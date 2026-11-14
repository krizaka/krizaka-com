/* The products' public addresses (founder, 2026-11-04, krizaka-internal#2373): each product's commercial www domain
   (www.verikora.com, www.folioviv.com, www.sovkora.com), from @krizaka/org (`brandOf(id).domains.site`) through
   lib/product-sites.json (scripts/gen-product-sites.mjs; next.config.ts's CommonJS loader cannot import the ESM-only package),
   kept equal to the package by tests/product-sites.test.mjs. Until a product opens there, its www address is its
   « coming soon » face (krizaka/krizaka-coming-soon). Every link, the sitemap, llms.txt and the JSON-LD use it — never a
   code-name host (www.<code>.com, dev.<code>.com stay the products' development addresses). Pure: tests and scripts share it. */

import sites from "./product-sites.json" with { type: "json" };

export const PRODUCT_IDS = ["sovkora", "verikora", "folioviv", "kridoc"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

/** The products that publish releases (the changelog's chips, its release-notes link): Kridoc's repository is private for now
 *  and cuts none, so it has no chip and no « Release notes » (krizaka-internal#3559). */
export const RELEASE_PRODUCT_IDS = ["sovkora", "verikora", "folioviv"] as const satisfies readonly ProductId[];

/** The public origin of a product (`https://www.verikora.com`). */
export const siteUrlOf = (id: ProductId): string => (sites as Record<ProductId, string>)[id];
/** Its host, as a card shows it (`www.verikora.com`). */
export const siteHostOf = (id: ProductId) => new URL(siteUrlOf(id)).hostname;
