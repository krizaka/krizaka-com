/* The products' public addresses (founder, 2026-11-04, krizaka-internal#2373): each product's commercial www domain, read
   from @krizaka/org (`brandOf(id).domains.site`: www.verikora.com, www.folioviv.com, www.sovkora.com), never typed here.
   The apex answers 308 with www. Until a product opens there, its www address is its « coming soon » face
   (krizaka/krizaka-coming-soon). Every link, the sitemap, llms.txt and the JSON-LD use it — never a code-name host
   (www.<code>.com, dev.<code>.com stay the products' development addresses). Pure: tests and scripts share it. */

import { brandOf } from "@krizaka/org";

export const PRODUCT_IDS = ["orazaka", "yomizaka", "akinaza"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

/** The public origin of a product (`https://www.verikora.com`). */
export const siteUrlOf = (id: ProductId) => new URL(brandOf(id).domains.site).origin;
/** Its host, as a card shows it (`www.verikora.com`). */
export const siteHostOf = (id: ProductId) => new URL(siteUrlOf(id)).hostname;
