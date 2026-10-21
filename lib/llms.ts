import { readFile } from "node:fs/promises";
import path from "node:path";
import snapshot from "./registry-versions.json";
import { summary } from "./npm-catalogue";
import { SITE_URL } from "./site";

/** The @krizaka packages as the registry says at build (version + first clause of the description), one per line. */
function npmPackages(): string {
  const data = snapshot as { npm?: Record<string, string>; npmMeta?: Record<string, { description?: string }> };
  const lines = Object.entries(data.npm ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, version]) => {
      const about = data.npmMeta?.[name]?.description;
      return `- ${name}@${version}${about ? ` — ${summary(about)}` : ""}: https://www.npmjs.com/package/${name}`;
    });
  return lines.length ? lines.join("\n") : `- ${SITE_URL}/en/open-source`;
}

/** content/<file> with the placeholders of this deployment filled: the site, the packages. */
export async function renderLlms(file: "llms.txt" | "llms-full.txt"): Promise<string> {
  const text = await readFile(path.join(process.cwd(), "content", file), "utf8");
  return text
    .replaceAll("{{SITE_URL}}", SITE_URL)
    .replace("{{NPM_PACKAGES}}", () => npmPackages());
}

export const LLMS_HEADERS = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" };
