import signed from "@/lib/services.signed.json";

// The signed manifest the mobile apps read for their backend addresses (ADR-003, krizaka/.github#120): the committed
// document of `npm run services:sign`, served as is. Static: built once per deployment. Headers: next.config.ts.
export const dynamic = "force-static";

export function GET() {
  return Response.json(signed);
}

/** A browser's preflight for a cross-origin read. */
export function OPTIONS() {
  return new Response(null, { status: 204 });
}
