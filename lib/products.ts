/* The Krizaka products, as krizaka.com shows them: one card each on the home — the mark, the name, one line, the
   status, a link to the product's site (its commercial www domain, lib/product-hosts.ts) and a link to its source;
   the same address serves the nav, the sitemap and the JSON-LD. This site carries no product demo,
   recording or documentation (next.config.ts redirects the old addresses). Structure only: the words are messages.
   The products paused on 2026-10-25 left the org (krizaka/.github#413): they are not presented here. */

import { displayName, org, type ProductStatus } from "@krizaka/org";
import { FOLIOVIV_REPO_URL, VERIKORA_REPO_URL } from "./site.ts";
import { siteUrlOf, type ProductId } from "./product-hosts.ts";
import { statusOf } from "./product-status.ts";

export type { ProductId } from "./product-hosts.ts";

/** Where a product stands: the org's closed set (`PRODUCT_STATUS` of @krizaka/org), never typed here. The status of each
 *  product is read from the org data (`org.products`, @krizaka/org >= 1.3.0), the one JSON the whole org reads (founder,
 *  2026-11-13, krizaka-internal#3425). `devPreview` is gated (scripts/gen-dev-preview.mjs). Words: site.nav.status.<status>. */
export type { ProductStatus } from "@krizaka/org";

export interface Product {
  /** The id the mark, the brand and the messages use. */
  id: ProductId;
  name: string;
  status: ProductStatus;
  /** The product's public address, its commercial www domain (www.verikora.com…, @krizaka/org): what every public link,
   *  sitemap and declaration to a provider uses (lib/product-hosts.ts). Never a code-name host. */
  siteUrl: string;
  /** Its source on GitHub. */
  repoUrl: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "sovkora",
    name: displayName("sovkora"),
    status: statusOf(org.products, "sovkora"),
    siteUrl: siteUrlOf("sovkora"),
    repoUrl: "https://github.com/krizaka/sovkora",
  },
  {
    id: "verikora",
    name: displayName("verikora"),
    status: statusOf(org.products, "verikora"),
    siteUrl: siteUrlOf("verikora"),
    repoUrl: VERIKORA_REPO_URL,
  },
  {
    id: "folioviv",
    name: displayName("folioviv"),
    status: statusOf(org.products, "folioviv"),
    siteUrl: siteUrlOf("folioviv"),
    repoUrl: FOLIOVIV_REPO_URL,
  },
];
