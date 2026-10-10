import { readFile } from "node:fs/promises";
import path from "node:path";
import { OROCHIA_APP_URL, SITE_URL } from "@/lib/site";
import { allDocsPaths } from "@/lib/docs-source";

// Built once per deployment: content/llms.txt with the Orochia URL of this environment and every docs page.
export const dynamic = "force-static";

export async function GET() {
  const text = await readFile(path.join(process.cwd(), "content", "llms.txt"), "utf8");
  const docs = allDocsPaths()
    .map((p) => `- ${SITE_URL}/en${p}`)
    .join("\n");
  return new Response(text.replaceAll("{{OROCHIA_APP_URL}}", OROCHIA_APP_URL).replace("{{DOCS_PAGES}}", docs), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
