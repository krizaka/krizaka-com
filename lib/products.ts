/* The Krizaka products, as krizaka.com shows them: one card each on the home — the mark, the name, one line, the
   status, a link to the product's site (its commercial www domain, lib/product-hosts.ts) and a link to its source;
   the same address serves the nav, the sitemap and the JSON-LD. This site carries no product demo,
   recording or documentation (next.config.ts redirects the old addresses). Structure only: the words are messages.
   Four products are paused (2026-10-25): they are not presented here, and their repositories are private. */

import { displayName } from "@krizaka/org";
import { FOLIOVIV_REPO_URL, VERIKORA_REPO_URL } from "./site.ts";
import { siteUrlOf, type ProductId } from "./product-hosts.ts";

export type { ProductId } from "./product-hosts.ts";

/** Where a product stands. `devPreview`: runs on its dev site for QA, and its dev-preview.json checklist is complete
 *  (the build refuses it otherwise: scripts/gen-dev-preview.mjs, krizaka/.github docs/standards/dev-preview.md). `upcoming`: announced, coming soon. `construction`: being built, nothing
 *  offered yet. `development`: built in the open, in development (its repository is public; a dev site when it has one).
 *  `paused`: built in the open, work paused for now (Folioviv, 2026-11-05: « En pause »).
 *  `design`: in conception — its need and scope are being settled, nothing is built or offered (lib/products-in-design.ts).
 *  Only `devPreview` is gated. Words: site.nav.status.<status>. */
export type ProductStatus = "design" | "upcoming" | "construction" | "development" | "paused" | "devPreview";

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
    status: "development",
    siteUrl: siteUrlOf("sovkora"),
    repoUrl: "https://github.com/krizaka/sovkora",
  },
  {
    id: "verikora",
    name: displayName("verikora"),
    status: "development",
    siteUrl: siteUrlOf("verikora"),
    repoUrl: VERIKORA_REPO_URL,
  },
  {
    id: "folioviv",
    name: displayName("folioviv"),
    status: "paused",
    siteUrl: siteUrlOf("folioviv"),
    repoUrl: FOLIOVIV_REPO_URL,
  },
];
