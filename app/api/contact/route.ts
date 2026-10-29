import { NextResponse } from "next/server";
import { captchaMissing, verifyCaptcha } from "@/lib/captcha";
import { contactChannels, deliverContact, validateContact } from "@/lib/contact";

export const runtime = "nodejs";

/* Best-effort per-instance throttle: 5 messages / 10 min / IP. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

/** Receives a contact message from krizaka.com/contact and forwards it to the team. */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validateContact(body);
  // Bots filling the honeypot get the same answer as people, and nothing is sent.
  if (result.ok === "spam") return NextResponse.json({ ok: true });
  if (!result.ok) return NextResponse.json({ error: "invalid", field: result.field }, { status: 400 });

  // Bot protection: verified before anything is sent (off only outside production; in production a missing key refuses, #464).
  if (captchaMissing()) {
    console.error("contact: refused, the bot check is not configured (set ABUSE_CAPTCHA_PROVIDER=turnstile and the widget's key)");
    return NextResponse.json({ error: "contact.captcha_unconfigured" }, { status: 503 });
  }
  const token = (body as { captchaToken?: unknown }).captchaToken;
  if (!(await verifyCaptcha(token, ip, process.env, undefined, () => new Date()))) return NextResponse.json({ error: "contact.captcha_failed" }, { status: 400 });

  const channels = contactChannels();
  if (!channels.email && !channels.webhook) {
    console.error("contact: no delivery channel configured (MAIL_PROVIDER=mailgun + MAIL_API_KEY + MAIL_DOMAIN + MAIL_CONTACT_TO, or MAIL_CONTACT_WEBHOOK_URL)");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const delivered = await deliverContact(result.value);
  if (delivered === 0) {
    console.error("contact: every configured channel refused the message");
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
