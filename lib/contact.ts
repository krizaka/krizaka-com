/* Contact messages — validation and delivery, shared by app/api/contact/route.ts.
   Delivery is configured by environment (fail-closed: nothing configured → 503, never a fake success):
     MAIL_PROVIDER=mailgun + MAIL_API_KEY + MAIL_DOMAIN + MAIL_CONTACT_TO   e-mail through the Mailgun HTTP API
       (+ MAIL_API_URL for the EU region, + MAIL_FROM)
     MAIL_CONTACT_WEBHOOK_URL                                               JSON POST (Slack / Discord / Teams / any relay)
   Every variable is declared in lib/env.ts (krizaka/.github#46).
   Both may be set; the message is accepted when at least one channel delivers it. */

const CONTACT_LOCALES = ["en", "fr"] as const;

export const CONTACT_TOPICS = ["orazaka", "orochia", "yazakia", "yororis", "blocks", "partnership", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/* Where a visitor came from (`/contact?source=<slug>`): pre-selects the topic and travels with the message, so the
   team knows which page sent it. A slug, never free text. */
const SOURCE = /^[a-z0-9][a-z0-9-]{0,39}$/;
export const cleanSource = (v: unknown): string | null => (typeof v === "string" && SOURCE.test(v) ? v : null);

/** The source of a page: its product, its documentation or open source, else its first segment ("home" for /). */
export function contactSourceFromPath(pathname: string): string {
  const path = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  if (/^\/(products|docs)\/orochia(\/|$)/.test(path)) return "orochia";
  if (/^\/(products|docs)\/orazaka(\/|$)/.test(path)) return "orazaka";
  if (/^\/(products|docs)\/yazakia(\/|$)/.test(path)) return "yazakia";
  if (/^\/(products|docs)\/yororis(\/|$)/.test(path)) return "yororis";
  if (/^\/open-source(\/|$)/.test(path)) return "open-source";
  if (/^\/docs\/(ui|java)(\/|$)/.test(path)) return `docs-${path.split("/")[2]}`;
  return cleanSource(path.split("/")[1]) ?? "home";
}

/** The topic a source implies — none when the page is about Krizaka as a whole (home, story…). */
export function topicForSource(source: string | null): ContactTopic | null {
  if (source === "orochia" || source === "orazaka" || source === "yazakia" || source === "yororis") return source;
  if (source === "open-source" || source === "docs-ui" || source === "docs-java") return "blocks";
  return null;
}

/** The contact page link, carrying where the visitor is and, when the page knows it, the topic. */
export function contactHref(source: string | null, topic?: ContactTopic): string {
  const q = new URLSearchParams();
  if (topic) q.set("topic", topic);
  if (source) q.set("source", source);
  const s = q.toString();
  return s ? `/contact?${s}` : "/contact";
}

/** When the sender needs it (optional): qualifies the request for the team. */
export const CONTACT_TIMELINES = ["now", "quarter", "exploring"] as const;
export type ContactTimeline = (typeof CONTACT_TIMELINES)[number];

export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  topic: ContactTopic;
  timeline: ContactTimeline | null;
  message: string;
  locale: "fr" | "en";
  /** The page the visitor came from (`?source=`), when known. */
  source: string | null;
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
  const timeline = CONTACT_TIMELINES.includes(b.timeline as ContactTimeline) ? (b.timeline as ContactTimeline) : null;
  if (b.timeline !== undefined && b.timeline !== null && b.timeline !== "" && !timeline) return { ok: false, field: "timeline" };
  if (message.length < 10 || message.length > 5000) return { ok: false, field: "message" };
  return { ok: true, value: { name, email, company, topic, timeline, message, locale: CONTACT_LOCALES.find((l) => l === b.locale) ?? "en", source: cleanSource(b.source) } };
}

const TOPIC_LABEL: Record<ContactTopic, string> = {
  orazaka: "Orazaka",
  orochia: "Orochia",
  yazakia: "Yazakia",
  yororis: "Yororis",
  blocks: "Building blocks",
  partnership: "Partnership",
  other: "Other",
};

const TIMELINE_LABEL: Record<ContactTimeline, string> = {
  now: "As soon as possible",
  quarter: "This quarter",
  exploring: "Exploring",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The e-mail channel: the provider named (only `mailgun` exists), its key, the domain and a recipient. */
function mailConfigured(env: NodeJS.ProcessEnv): boolean {
  return env.MAIL_PROVIDER?.trim().toLowerCase() === "mailgun" && Boolean(env.MAIL_API_KEY && env.MAIL_DOMAIN && env.MAIL_CONTACT_TO);
}

export function contactChannels(env: NodeJS.ProcessEnv = process.env) {
  return {
    email: mailConfigured(env),
    webhook: Boolean(env.MAIL_CONTACT_WEBHOOK_URL),
  };
}

/** Delivers to every configured channel. Returns how many accepted it. */
export async function deliverContact(m: ContactMessage, env: NodeJS.ProcessEnv = process.env): Promise<number> {
  const subject = `[krizaka.com] ${TOPIC_LABEL[m.topic]} — ${m.name}${m.company ? ` (${m.company})` : ""}`;
  const text = `${m.message}\n\n— ${m.name} <${m.email}>${m.company ? `, ${m.company}` : ""} · ${TOPIC_LABEL[m.topic]}${m.timeline ? ` · ${TIMELINE_LABEL[m.timeline]}` : ""} · ${m.locale}${m.source ? ` · from ${m.source}` : ""}`;
  const jobs: Promise<boolean>[] = [];

  if (mailConfigured(env) && env.MAIL_CONTACT_TO && env.MAIL_DOMAIN) {
    // https://documentation.mailgun.com — POST /v3/{domain}/messages, Basic auth `api:<key>`, form fields.
    const form = new FormData();
    form.append("from", env.MAIL_FROM || `Krizaka <contact@${env.MAIL_DOMAIN}>`);
    for (const to of env.MAIL_CONTACT_TO.split(",").map((s) => s.trim()).filter(Boolean)) form.append("to", to);
    form.append("h:Reply-To", m.email);
    form.append("subject", subject);
    // Every field of the form, as filled in.
    const fields: [string, string][] = [
      ["Name", m.name],
      ["E-mail", m.email],
      ["Company", m.company || "—"],
      ["Topic", TOPIC_LABEL[m.topic]],
      ["Timeline", m.timeline ? TIMELINE_LABEL[m.timeline] : "—"],
      ["Language", m.locale],
      ["Source", m.source ?? "—"],
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
    const base = (env.MAIL_API_URL || "https://api.mailgun.net").replace(/\/+$/, "");
    jobs.push(
      fetch(`${base}/v3/${encodeURIComponent(env.MAIL_DOMAIN)}/messages`, {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`api:${env.MAIL_API_KEY}`).toString("base64")}` },
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

  if (env.MAIL_CONTACT_WEBHOOK_URL) {
    jobs.push(
      fetch(env.MAIL_CONTACT_WEBHOOK_URL, {
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
