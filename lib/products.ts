/* The Krizaka products, as krizaka.com shows them: one card each on the home — the mark, the name, one line, the
   status, a link to the product's public address (www.<product>.com, the real app served by the product's own
   deployment, sign-up closed) and a link to its source. The development hosts (dev.<product>.com) are not indexed, send
   their pages to www and are never linked from a public page. This site carries no product demo,
   recording or documentation (next.config.ts redirects the old addresses). Structure only: the words are messages. */

import { AKINAZA_REPO_URL, KACHIZAKA_REPO_URL, YASAKIA_REPO_URL, YOMIZAKA_REPO_URL, YORORIS_REPO_URL } from "./site";
import { wwwUrl, type ProductId } from "./product-hosts";

export type { ProductId } from "./product-hosts";

/** Where a product stands. `devPreview`: runs on its dev site for QA, and its dev-preview.json checklist is complete
 *  (the build refuses it otherwise: scripts/gen-dev-preview.mjs, krizaka/.github docs/standards/dev-preview.md). `upcoming`: announced, coming soon. `construction`: being built, nothing
 *  offered yet. `development`: built in the open, in development (its repository is public; a dev site when it has one).
 *  Words: site.nav.status.<status>. */
export type ProductStatus = "upcoming" | "construction" | "development" | "devPreview";

export interface Product {
  /** The id the mark, the brand and the messages use (Yazakia was renamed Yasakia, 2026-10). */
  id: ProductId;
  name: string;
  status: ProductStatus;
  /** The product's public address, www.<product>.com: what every public link, sitemap and declaration to a provider
   *  uses (lib/product-hosts.ts). Never the dev host. */
  siteUrl: string;
  /** Its source on GitHub. */
  repoUrl: string;
}

export const PRODUCTS: Product[] = [
  { id: "orazaka", name: "Orazaka", status: "devPreview", siteUrl: wwwUrl("orazaka"), repoUrl: "https://github.com/krizaka/orazaka" },
  { id: "yomizaka", name: "Yomizaka", status: "development", siteUrl: wwwUrl("yomizaka"), repoUrl: YOMIZAKA_REPO_URL },
  { id: "orochia", name: "Orochia", status: "devPreview", siteUrl: wwwUrl("orochia"), repoUrl: "https://github.com/krizaka/orochia" },
  { id: "kachizaka", name: "Kachizaka", status: "development", siteUrl: wwwUrl("kachizaka"), repoUrl: KACHIZAKA_REPO_URL },
  { id: "akinaza", name: "Akinaza", status: "development", siteUrl: wwwUrl("akinaza"), repoUrl: AKINAZA_REPO_URL },
  { id: "yasakia", name: "Yasakia", status: "development", siteUrl: wwwUrl("yasakia"), repoUrl: YASAKIA_REPO_URL },
  { id: "yororis", name: "Yororis", status: "construction", siteUrl: wwwUrl("yororis"), repoUrl: YORORIS_REPO_URL },
];
