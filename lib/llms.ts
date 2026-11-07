import { readFile } from "node:fs/promises";
import path from "node:path";
import snapshot from "./registry-versions.json";
import { summary } from "./npm-catalogue";
import { isOperatedPackage } from "./package-catalogue";
import { PRODUCT_IDS } from "./product-hosts";
import { getDictionary } from "./i18n";
import { productLines, stackLines, type LlmsAbout } from "./llms-sections";
import { PRODUCTS } from "./products";
import { SITE_URL } from "./site";
import { STACK } from "./stack";

/** The @krizaka packages as the registry says at build (version + first clause of the description), one per line: the open-source
    ones, as /open-source lists them (an operated product's own packages are not). */
function npmPackages(): string {
  const data = snapshot as {
    npm?: Record<string, string>;
    npmMeta?: Record<string, { description?: string; repository?: string }>;
  };
  const lines = Object.entries(data.npm ?? {})
    .filter(([name]) => !isOperatedPackage(data.npmMeta, name, PRODUCT_IDS))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, version]) => {
      const about = data.npmMeta?.[name]?.description;
      return `- ${name}@${version}${about ? ` — ${summary(about)}` : ""}: https://www.npmjs.com/package/${name}`;
    });
  return lines.length ? lines.join("\n") : `- ${SITE_URL}/en/docs`;
}

/** The products and the stack as the site presents them (lib/llms-sections.ts), in English: llms.txt is read by machines. */
async function dataSections(): Promise<{ products: string; stack: string }> {
  const about = JSON.parse(await readFile(path.join(process.cwd(), "content", "llms-about.json"), "utf8")) as LlmsAbout;
  const status = getDictionary("en").site.nav.status;
  return { products: productLines(PRODUCTS, about, (s) => status[s].label), stack: stackLines(STACK, about) };
}

/** content/<file> with the placeholders of this deployment filled: the site, the products, the stack, the packages. */
export async function renderLlms(file: "llms.txt" | "llms-full.txt"): Promise<string> {
  const text = await readFile(path.join(process.cwd(), "content", file), "utf8");
  const { products, stack } = await dataSections();
  return text
    .replaceAll("{{SITE_URL}}", SITE_URL)
    .replace("{{PRODUCTS}}", () => products)
    .replace("{{STACK}}", () => stack)
    .replace("{{NPM_PACKAGES}}", () => npmPackages());
}

export const LLMS_HEADERS = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" };
