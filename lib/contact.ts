/* Contact messages — validation and delivery, shared by app/api/contact/route.ts.
   Delivery is configured by environment (fail-closed: nothing configured → 503, never a fake success):
     MAILGUN_API_KEY + MAILGUN_DOMAIN + CONTACT_TO_EMAIL         e-mail through the Mailgun HTTP API
       (+ MAILGUN_API_URL for the EU region, + CONTACT_FROM_EMAIL)
     CONTACT_WEBHOOK_URL                                        JSON POST (Slack / Discord / Teams / any relay)
   Both may be set; the message is accepted when at least one channel delivers it. */

const CONTACT_LOCALES = ["en", "fr"] as const;

export const CONTACT_TOPICS = ["orazaka", "orochia", "partnership", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  topic: ContactTopic;
  message: string;
  locale: "fr" | "en";
}

export type ContactValidation = { ok: true; value: ContactMessage } | { ok: false; field: string };

const EMAIL = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");

/** Validates an untrusted JSON body. `website` is a honeypot: humans never fill it. */
export function validateContact(body: unknown): ContactValidation | { ok: "spam" } {
  const b = (body ?? {}) as Record<string, unknown>;
  if (str(b.website, 200)) return { ok: "spam" };
  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const company = str(b.company, 160);
  const message = str(b.message, 5000);
  const topic = CONTACT_TOPICS.includes(b.topic as ContactTopic) ? (b.topic as ContactTopic) : null;
  if (name.length < 2 || name.length > 120) return { ok: false, field: "name" };
  if (!EMAIL.test(email) || email.length > 200) return { ok: false, field: "email" };
  if (company.length > 160) return { ok: false, field: "company" };
  if (!topic) return { ok: false, field: "topic" };
  if (message.length < 10 || message.length > 5000) return { ok: false, field: "message" };
  return { ok: true, value: { name, email, company, topic, message, locale: CONTACT_LOCALES.find((l) => l === b.locale) ?? "en" } };
}

const TOPIC_LABEL: Record<ContactTopic, string> = {
  orazaka: "Orazaka",
  orochia: "Orochia",
  partnership: "Partnership",
  other: "Other",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function contactChannels(env: NodeJS.ProcessEnv = process.env) {
  return {
    email: Boolean(env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN && env.CONTACT_TO_EMAIL),
    webhook: Boolean(env.CONTACT_WEBHOOK_URL),
  };
}

/** Delivers to every configured channel. Returns how many accepted it. */
export async function deliverContact(m: ContactMessage, env: NodeJS.ProcessEnv = process.env): Promise<number> {
  const subject = `[krizaka.com] ${TOPIC_LABEL[m.topic]} — ${m.name}${m.company ? ` (${m.company})` : ""}`;
  const text = `${m.message}\n\n— ${m.name} <${m.email}>${m.company ? `, ${m.company}` : ""} · ${TOPIC_LABEL[m.topic]} · ${m.locale}`;
  const jobs: Promise<boolean>[] = [];

  if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN && env.CONTACT_TO_EMAIL) {
    // https://documentation.mailgun.com — POST /v3/{domain}/messages, Basic auth `api:<key>`, form fields.
    const form = new FormData();
    form.append("from", env.CONTACT_FROM_EMAIL || `Krizaka <contact@${env.MAILGUN_DOMAIN}>`);
    for (const to of env.CONTACT_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean)) form.append("to", to);
    form.append("h:Reply-To", m.email);
    form.append("subject", subject);
    // Every field of the form, as filled in.
    const fields: [string, string][] = [
      ["Name", m.name],
      ["E-mail", m.email],
      ["Company", m.company || "—"],
      ["Topic", TOPIC_LABEL[m.topic]],
      ["Language", m.locale],
      ["Message", m.message],
    ];
    form.append("text", fields.map(([k, v]) => `${k}: ${v}`).join("\n"));
    form.append(
      "html",
      `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${fields
        .map(
          ([k, v]) =>
            `<tr><th align="left" valign="top" style="border-bottom:1px solid #ddd">${k}</th><td style="border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`,
    );
    const base = (env.MAILGUN_API_URL || "https://api.mailgun.net").replace(/\/+$/, "");
    jobs.push(
      fetch(`${base}/v3/${encodeURIComponent(env.MAILGUN_DOMAIN)}/messages`, {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`api:${env.MAILGUN_API_KEY}`).toString("base64")}` },
        body: form,
        signal: AbortSignal.timeout(8000),
      }).then(
        async (r) => {
          if (!r.ok) console.error(`contact: mailgun refused (${r.status}) ${(await r.text()).slice(0, 300)}`);
          return r.ok;
        },
        (e) => {
          console.error("contact: mailgun unreachable", e);
          return false;
        },
      ),
    );
  }

  if (env.CONTACT_WEBHOOK_URL) {
    jobs.push(
      fetch(env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `text` for Slack, `content` for Discord; the structured fields for any other relay.
        body: JSON.stringify({ text: `*${subject}*\n${text}`, content: `**${subject}**\n${text}`.slice(0, 2000), contact: m }),
        signal: AbortSignal.timeout(8000),
      }).then((r) => r.ok, () => false),
    );
  }

  const results = await Promise.all(jobs);
  return results.filter(Boolean).length;
}
