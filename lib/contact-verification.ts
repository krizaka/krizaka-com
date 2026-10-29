/**
 * The contact form verifies the visitor's address before anything reaches the team (verify first, krizaka/krizaka-com#464):
 * POST /api/contact holds the message and mails a 6-digit code to the address; POST /api/contact/verify releases the message
 * when the code comes back. The mechanism is `@krizaka/email-verification` (6 digits, 15 minutes, single use, 5 tries, salted
 * hash); this file only binds it to the site's mail channel and to a per-address limit.
 */
import { randomBytes } from "node:crypto";
import { createEmailVerification, memoryCodeStore, verificationMail } from "@krizaka/email-verification";
import { createLimiter, memoryLimitStore } from "@krizaka/rate-limit";
import { postMailgun, type ContactMessage } from "./contact.ts";

// @fixed: codes mailed to one address per window; a mailbox can never be flooded through the form
const CODES_PER_ADDRESS = 3;
// @fixed: the same window as the code's own validity (15 minutes)
const WINDOW_SECONDS = 900;
// @fixed: best-effort per-instance throttles of the two routes, per visitor address and 10 minutes
const LIMITS = {
  "contact.code": { perSubject: CODES_PER_ADDRESS, windowSeconds: WINDOW_SECONDS },
  "contact.send": { perIp: 5, windowSeconds: 600 },
  "contact.verify": { perIp: 20, windowSeconds: 600 },
} as const;

interface State {
  verification: ReturnType<typeof createEmailVerification>;
  limiter: ReturnType<typeof createLimiter>;
}
let state: State | undefined;

/** The routes pass the system clock (`() => new Date()`): this module reads none. State lives in this process: one salt, one store, one limiter. */
function shared(now: () => Date): State {
  state ??= {
    verification: createEmailVerification({ store: memoryCodeStore(), secret: randomBytes(32).toString("base64url"), now }),
    limiter: createLimiter({ store: memoryLimitStore(), limits: LIMITS, clock: { now } }),
  };
  return state;
}

/** True when this visitor address has used up the allowance of `action`. */
export async function throttled(action: "contact.send" | "contact.verify", ip: string, now: () => Date): Promise<boolean> {
  return !(await shared(now).limiter.check(action, { ip })).ok;
}

/** The channel that carries the code needs the Mailgun settings (the team's recipient list is not needed here). */
export function codeMailConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.MAIL_PROVIDER?.trim().toLowerCase() === "mailgun" && Boolean(env.MAIL_API_KEY && env.MAIL_DOMAIN);
}

export type StartResult = { ok: true; challengeId: string } | { ok: false; error: "rate_limited" | "code_mail_failed" | "unavailable" };

/** Holds the message and mails the code to its author. Nothing is delivered to the team here. */
export async function startContactVerification(message: ContactMessage, now: () => Date, env: NodeJS.ProcessEnv = process.env): Promise<StartResult> {
  if (!codeMailConfigured(env)) return { ok: false, error: "unavailable" };
  const { limiter, verification } = shared(now);
  const allowed = await limiter.check("contact.code", { subject: message.email });
  if (!allowed.ok) return { ok: false, error: "rate_limited" };
  const issued = await verification.issue({ address: message.email, payload: message });
  const mail = verificationMail({ locale: message.locale, code: issued.code, ttlMinutes: issued.ttlMinutes });
  const form = new FormData();
  form.append("from", env.MAIL_FROM || `Krizaka <contact@${env.MAIL_DOMAIN}>`);
  form.append("to", message.email);
  form.append("subject", mail.subject);
  form.append("text", mail.text);
  form.append("html", mail.html);
  if (!(await postMailgun(form, env))) return { ok: false, error: "code_mail_failed" };
  return { ok: true, challengeId: issued.challengeId };
}

export type ConfirmResult = { ok: true; message: ContactMessage } | { ok: false; reason: "invalid" | "expired" | "locked" | "unknown"; attemptsLeft?: number };

/** Releases the held message when `code` is the one mailed to `email`; the message is the one that was held, never one the browser sends back. */
export async function confirmContactVerification(input: { challengeId: string; email: string; code: string }, now: () => Date): Promise<ConfirmResult> {
  const result = await shared(now).verification.confirm<ContactMessage>({ challengeId: input.challengeId, address: input.email, code: input.code });
  if (result.ok) return { ok: true, message: result.payload };
  return result.attemptsLeft === undefined ? { ok: false, reason: result.reason } : { ok: false, reason: result.reason, attemptsLeft: result.attemptsLeft };
}
