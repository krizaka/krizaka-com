#!/usr/bin/env node
/* The products' public addresses, from @krizaka/org (`brandOf(id).domains.site`), written to lib/product-sites.json.
   Why a file: next.config.ts reads them (lib/product-redirects.ts) and its loader is CommonJS, while @krizaka/org is ESM-only.
   Committed, never hand-edited: tests/product-sites.test.mjs fails when it differs from @krizaka/org — then run
   `node scripts/gen-product-sites.mjs` and commit the result. */
import { writeFileSync } from "node:fs";
import { brandOf } from "@krizaka/org";

const IDS = ["orazaka", "yomizaka", "akinaza"];
export const productSites = () => Object.fromEntries(IDS.map((id) => [id, new URL(brandOf(id).domains.site).origin]));

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(new URL("../lib/product-sites.json", import.meta.url), JSON.stringify(productSites(), null, 2) + "\n");
  console.log("product-sites: lib/product-sites.json written");
}
