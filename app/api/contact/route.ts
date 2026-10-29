import { NextResponse } from "next/server";
import { captchaMissing, verifyCaptcha } from "@/lib/captcha";
import { contactChannels, validateContact, type ContactMessage } from "@/lib/contact";
import { startContactVerification, throttled } from "@/lib/contact-verification";

export const runtime = "nodejs";

const now = () => new Date();

/** Receives a contact message from krizaka.com/contact, holds it and mails a code to its author (verify first). */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await throttled("contact.send", ip, now)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

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
  if (!(await verifyCaptcha(token, ip, process.env, undefined, now))) return NextResponse.json({ error: "contact.captcha_failed" }, { status: 400 });

  // Delivery must exist before a visitor is asked to verify anything.
  const channels = contactChannels();
  if (!channels.email && !channels.webhook) {
    console.error("contact: no delivery channel configured (MAIL_PROVIDER=mailgun + MAIL_API_KEY + MAIL_DOMAIN + MAIL_CONTACT_TO, or MAIL_CONTACT_WEBHOOK_URL)");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  // Verify first: the message is held and a code is mailed to the address; the team receives it only after /api/contact/verify.
  return holdAndAskForCode(result.value);
}

const START_STATUS = { rate_limited: 429, unavailable: 503, code_mail_failed: 502 } as const;

async function holdAndAskForCode(message: ContactMessage) {
  const started = await startContactVerification(message, now);
  if (started.ok) return NextResponse.json({ verify: true, challengeId: started.challengeId });
  if (started.error !== "rate_limited") console.error(`contact: the verification code could not be sent (${started.error})`);
  return NextResponse.json({ error: started.error }, { status: START_STATUS[started.error] });
}
