#!/usr/bin/env node
/* The products' public addresses, from @krizaka/org (`brandOf(id).domains.site`), written to lib/product-sites.json, and the
   retired ids old links may still carry (`CODE_NAMES`, the org package's historic table) to lib/retired-product-ids.json.
   Why a file: next.config.ts reads them (lib/product-redirects.ts) and its loader is CommonJS, while @krizaka/org is ESM-only.
   Committed, never hand-edited: tests/product-sites.test.mjs fails when it differs from @krizaka/org — then run
   `node scripts/gen-product-sites.mjs` and commit the result. */
import { writeFileSync } from "node:fs";
import { CODE_NAMES, brandOf } from "@krizaka/org";

const IDS = ["sovkora", "verikora", "folioviv", "kridoc"];
export const productSites = () => Object.fromEntries(IDS.map((id) => [id, new URL(brandOf(id).domains.site).origin]));

/** The retired product ids and the commercial id each became: the old links the site still accepts, never produces. */
export const retiredProductIds = () =>
  Object.fromEntries(Object.entries(CODE_NAMES).filter(([, id]) => IDS.includes(id)));

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(new URL("../lib/product-sites.json", import.meta.url), JSON.stringify(productSites(), null, 2) + "\n");
  writeFileSync(
    new URL("../lib/retired-product-ids.json", import.meta.url),
    JSON.stringify(retiredProductIds(), null, 2) + "\n",
  );
  console.log("product-sites: lib/product-sites.json and lib/retired-product-ids.json written");
}
