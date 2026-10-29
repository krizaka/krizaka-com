/**
 * Bot protection of the public forms — a CAPTCHA verified on the server (ABUSE context). The verification itself is
 * `@krizaka/rate-limit/turnstile` (fail closed, single-use tokens, hostname check, timeout): nothing of it is copied here.
 * Configured by `ABUSE_CAPTCHA_PROVIDER=turnstile` + the widget's server key (`ABUSE_CAPTCHA_SECRET_KEY`); the browser widget reads
 * `NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY`. Both are read at run time on every call. Outside production an unconfigured check is
 * off (local dev, tests); in PRODUCTION it is a refusal (`captchaMissing`): a widget that renders while the key is unset
 * protects nothing and lets every bot through (#464).
 */
import { createTurnstileVerifier, TURNSTILE_SITEVERIFY_URL, type TurnstileFetch } from "@krizaka/rate-limit/turnstile";

export const SITEVERIFY_URL = TURNSTILE_SITEVERIFY_URL;

type Env = Record<string, string | undefined>;

// @fixed: the hostnames krizaka.com is served on; a token solved elsewhere is refused
const HOSTNAMES = ["www.krizaka.com", "krizaka.com"] as const;

export function captchaConfigured(env: Env = process.env): boolean {
  return env.ABUSE_CAPTCHA_PROVIDER?.trim().toLowerCase() === "turnstile" && Boolean(env.ABUSE_CAPTCHA_SECRET_KEY?.trim());
}

/** Production without the check configured: the form must refuse (503) rather than accept every bot. */
export function captchaMissing(env: Env = process.env): boolean {
  return env.NODE_ENV === "production" && !captchaConfigured(env);
}

// One verifier per key and process: it remembers the tokens it saw, so a replayed token is refused.
const verifiers = new Map<string, ReturnType<typeof createTurnstileVerifier>>();

/** True when the check is off (not production, not configured) or the token is valid. `ip` is the visitor's address ("unknown" is not sent). */
export async function verifyCaptcha(token: unknown, ip: string, env: Env = process.env, fetchImpl?: TurnstileFetch): Promise<boolean> {
  if (!captchaConfigured(env)) return !captchaMissing(env);
  const secret = env.ABUSE_CAPTCHA_SECRET_KEY!.trim();
  const options = { secret, hostnames: env.NODE_ENV === "production" ? HOSTNAMES : [], now: () => new Date() };
  let verify = fetchImpl ? createTurnstileVerifier({ ...options, fetch: fetchImpl }) : verifiers.get(secret);
  if (!verify) {
    verify = createTurnstileVerifier(options);
    verifiers.set(secret, verify);
  }
  return (await verify({ token, remoteIp: ip })).ok;
}
