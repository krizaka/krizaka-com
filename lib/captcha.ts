/**
 * Bot protection of the public forms — a CAPTCHA verified on the server (ABUSE context).
 * Configured by `ABUSE_CAPTCHA_PROVIDER=turnstile` + `ABUSE_CAPTCHA_SECRET_KEY` (the browser widget reads
 * `NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY`). Not configured → the check is off (local dev, tests). Configured → a missing,
 * refused or unverifiable token fails: the check fails closed.
 */
export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type Fetch = (url: string, init: { method: string; body: string; headers: Record<string, string>; signal?: AbortSignal }) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export function captchaConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return env.ABUSE_CAPTCHA_PROVIDER?.trim().toLowerCase() === "turnstile" && Boolean(env.ABUSE_CAPTCHA_SECRET_KEY?.trim());
}

/** True when the check is off or the token is valid. `ip` is the visitor's address ("unknown" is not sent). */
export async function verifyCaptcha(
  token: unknown,
  ip: string,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: Fetch = fetch as unknown as Fetch,
): Promise<boolean> {
  if (!captchaConfigured(env)) return true;
  if (typeof token !== "string" || !token.trim() || token.length > 4096) return false;
  const body = new URLSearchParams({ secret: env.ABUSE_CAPTCHA_SECRET_KEY!.trim(), response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    return (await res.json() as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}
