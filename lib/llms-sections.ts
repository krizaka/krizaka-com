/* The parts of llms.txt and llms-full.txt that are data (krizaka-internal#2807): the products, from PRODUCTS in the home's
   order with their live status, address and source, and the open-source stack, from STACK. Their one English line each lives in
   content/llms-about.json, beside the files' other words. A product or a stack part without its line fails the build, so
   the files never list what the site does not present, nor miss what it does. Pure: tests/llms.test.mjs. */

import { productOrder } from "./home-sections.ts";
import type { Product, ProductStatus } from "./products.ts";
import type { StackPart } from "./stack.ts";

export interface LlmsAbout {
  products: Record<string, string>;
  stack: Record<string, string>;
}

function lineOf(about: Record<string, string>, id: string, kind: string): string {
  const line = about[id];
  if (!line) {
    throw new Error(`llms: no line for the ${kind} « ${id} » in content/llms-about.json`);
  }
  return line;
}

/** One line per product: `- Verikora (in development) — <line>. Site: <siteUrl> · source: <repoUrl>`. */
export function productLines(
  products: readonly Product[],
  about: LlmsAbout,
  statusWord: (status: ProductStatus) => string,
): string {
  return productOrder(products)
    .map((p) => {
      const source = p.repoUrl ? " · source: " + p.repoUrl : "";
      return `- ${p.name} (${statusWord(p.status).toLowerCase()}) — ${lineOf(about.products, p.id, "product")}. Site: ${p.siteUrl}${source}`;
    })
    .join("\n");
}

/** One line per part of the stack: `- Krizaka UI — <line>: https://ui.krizaka.com`. */
export function stackLines(stack: readonly StackPart[], about: LlmsAbout): string {
  return stack.map((part) => `- ${part.name} — ${lineOf(about.stack, part.id, "stack part")}: ${part.url}`).join("\n");
}
