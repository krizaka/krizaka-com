import { LLMS_HEADERS, renderLlms } from "@/lib/llms";

// Built once per deployment: content/llms.txt with this environment's URLs, every docs page and the published packages.
export const dynamic = "force-static";

export async function GET() {
  return new Response(await renderLlms("llms.txt"), { headers: LLMS_HEADERS });
}
