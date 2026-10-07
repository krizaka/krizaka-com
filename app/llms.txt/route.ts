import { readFile } from "node:fs/promises";
import path from "node:path";
import { OROCHIA_APP_URL } from "@/lib/site";

// Built once per deployment: content/llms.txt with the Orochia URL of this environment.
export const dynamic = "force-static";

export async function GET() {
  const text = await readFile(path.join(process.cwd(), "content", "llms.txt"), "utf8");
  return new Response(text.replaceAll("{{OROCHIA_APP_URL}}", OROCHIA_APP_URL), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
