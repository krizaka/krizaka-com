import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Lightweight early-access waitlist endpoint (no contact form, no third party).
 * Email + chosen edition only — sovereignty-consistent. Persisted to a local
 * JSONL file on the host (self-hosted friendly); gitignored.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EDITIONS = new Set(["community", "cloud"]);

export async function POST(request: Request) {
  let body: { email?: string; edition?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const edition = body.edition ?? "cloud";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }
  if (!EDITIONS.has(edition)) {
    return NextResponse.json({ ok: false, error: "invalid_edition" }, { status: 422 });
  }

  const entry = {
    email,
    edition,
    locale: body.locale === "en" ? "en" : "fr",
    at: new Date().toISOString(),
  };

  try {
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, "waitlist.jsonl"), JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // Persistence is best-effort; never leak the request back to the user.
    return NextResponse.json({ ok: false, error: "store_unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
