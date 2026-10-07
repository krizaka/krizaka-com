/* Contact messages — validation and delivery, shared by app/api/contact/route.ts.
   Delivery is configured by environment (fail-closed: nothing configured → 503, never a fake success):
     RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)   e-mail through the Resend HTTP API
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
    email: Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL),
    webhook: Boolean(env.CONTACT_WEBHOOK_URL),
  };
}

/** Delivers to every configured channel. Returns how many accepted it. */
export async function deliverContact(m: ContactMessage, env: NodeJS.ProcessEnv = process.env): Promise<number> {
  const subject = `[krizaka.com] ${TOPIC_LABEL[m.topic]} — ${m.name}${m.company ? ` (${m.company})` : ""}`;
  const text = `${m.message}\n\n— ${m.name} <${m.email}>${m.company ? `, ${m.company}` : ""} · ${TOPIC_LABEL[m.topic]} · ${m.locale}`;
  const jobs: Promise<boolean>[] = [];

  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL || "Krizaka <contact@krizaka.com>",
          to: env.CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: m.email,
          subject,
          text,
          html: `<p style="white-space:pre-wrap">${escapeHtml(m.message)}</p><hr><p>${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;${
            m.company ? ` · ${escapeHtml(m.company)}` : ""
          }<br>${TOPIC_LABEL[m.topic]} · ${m.locale}</p>`,
        }),
        signal: AbortSignal.timeout(8000),
      }).then((r) => r.ok, () => false),
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
