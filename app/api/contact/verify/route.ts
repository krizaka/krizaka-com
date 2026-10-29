import { NextResponse } from "next/server";
import { deliverContact } from "@/lib/contact";
import { confirmContactVerification, throttled } from "@/lib/contact-verification";

export const runtime = "nodejs";

const now = () => new Date();

/** Releases the held contact message to the team when the code mailed to its author comes back. */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await throttled("contact.verify", ip, now)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: { challengeId?: unknown; email?: unknown; code?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { challengeId, email, code } = body;
  if (typeof challengeId !== "string" || typeof email !== "string" || typeof code !== "string" || challengeId.length > 200 || email.length > 320 || code.length > 20) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const confirmed = await confirmContactVerification({ challengeId, email, code }, now);
  if (!confirmed.ok) return NextResponse.json({ error: `contact.code_${confirmed.reason}`, attemptsLeft: confirmed.attemptsLeft }, { status: 400 });

  const delivered = await deliverContact(confirmed.message);
  if (delivered === 0) {
    console.error("contact: every configured channel refused the verified message");
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
