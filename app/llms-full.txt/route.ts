import { LLMS_HEADERS, renderLlms } from "@/lib/llms";

// Built once per deployment: content/llms-full.txt with this environment's URLs, every docs page and the published packages.
export const dynamic = "force-static";

export async function GET() {
  return new Response(await renderLlms("llms-full.txt"), { headers: LLMS_HEADERS });
}
