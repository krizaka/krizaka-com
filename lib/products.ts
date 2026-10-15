/* The Krizaka products, as krizaka.com shows them: one card each on /products (and a strip on the home) — the mark, the
   name, one line, the status, a link to the product's own site and a link to its source. The products live on their
   own sites (dev.<product>.com); this site never carries a product page, demo, recording or documentation of them
   (next.config.ts redirects the old addresses). Structure only: the words are messages → site.products.<id>. */

import { AKINAZA_REPO_URL, KACHIZAKA_REPO_URL, OROCHIA_APP_URL, YASAKIA_REPO_URL, YOMIZAKA_REPO_URL, YORORIS_REPO_URL } from "./site";

export type ProductId = "orazaka" | "orochia" | "yasakia" | "yororis" | "yomizaka" | "kachizaka" | "akinaza";

/** Where a product not released yet stands. `upcoming`: announced, coming soon. `construction`: being built, nothing
 *  offered yet. `development`: built in the open, in development (its repository is public; a dev site when it has one).
 *  No status: released. Words: site.nav.status.<status>. */
export type ProductStatus = "upcoming" | "construction" | "development";

export interface Product {
  /** The id the mark, the brand and the messages use (Yazakia was renamed Yasakia, 2026-10). */
  id: ProductId;
  name: string;
  status?: ProductStatus;
  /** The product's own site: where the product is presented, demonstrated and documented. A product without a site yet
   *  (nothing deployed) points to its repository — never to a dead address. */
  devUrl: string;
  /** No dev site yet: `devUrl` is the repository (the cards then say "See the code" rather than "Visit"). */
  noSite?: true;
  /** Its source on GitHub. */
  repoUrl: string;
}

export const PRODUCTS: Product[] = [
  { id: "orazaka", name: "Orazaka", devUrl: "https://dev.orazaka.com", repoUrl: "https://github.com/krizaka/orazaka" },
  { id: "yomizaka", name: "Yomizaka", status: "development", devUrl: "https://dev.yomizaka.com", repoUrl: YOMIZAKA_REPO_URL },
  { id: "orochia", name: "Orochia", devUrl: OROCHIA_APP_URL, repoUrl: "https://github.com/krizaka/orochia" },
  { id: "kachizaka", name: "Kachizaka", status: "development", devUrl: "https://dev.kachizaka.com", repoUrl: KACHIZAKA_REPO_URL },
  { id: "akinaza", name: "Akinaza", status: "development", devUrl: "https://dev.akinaza.com", repoUrl: AKINAZA_REPO_URL },
  { id: "yasakia", name: "Yasakia", status: "development", devUrl: "https://dev.yasakia.com", repoUrl: YASAKIA_REPO_URL },
  { id: "yororis", name: "Yororis", status: "construction", devUrl: "https://dev.yororis.com", repoUrl: YORORIS_REPO_URL },
];
