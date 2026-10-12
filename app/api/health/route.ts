import { NextResponse } from "next/server";

/* Liveness probe of the container host (DigitalOcean App Platform health check, Docker HEALTHCHECK): the Node server
   answers. Rendered per request, never cached — a cached answer would hide a dead server. */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
