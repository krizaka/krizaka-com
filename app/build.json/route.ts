import { buildInfo } from "../../scripts/build-info.mjs";

// The commit of this build, rendered once at build time (APP_COMMIT); the post-deploy workflow waits for it.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildInfo(process.env.APP_COMMIT), { headers: { "Cache-Control": "no-store" } });
}
