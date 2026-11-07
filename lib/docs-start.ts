/* /docs — « where do I start? » by who the reader is. Structure only (ids, addresses): the words are messages
   (site.openSource.hub.paths.<id>). Each path opens the documentation on its own site with its first pages — the
   docs live there, never here (AGENTS.md §2.3). Pure: tested by tests/docs-hub.test.mjs. */

import { JAVA_SITE } from "./java-redirects.ts";
import { productOrder } from "./home-sections.ts";
import { PRODUCTS, type ProductStatus } from "./products.ts";
import { UI_SITE } from "./ui-redirects.ts";
import { GOOD_FIRST_URL } from "./library-links.ts";

export const CONTRIBUTING_URL = "https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md";
export const CONDUCT_URL = "https://github.com/krizaka/.github/blob/main/CODE_OF_CONDUCT.md";

export type StartPathId = "ui" | "java" | "products" | "contribute";

export interface StartLink {
  /** The key of the label in site.openSource.hub.paths.<path>.links; a product's link is its name instead. */
  id: string;
  href: string;
  /** A product's own name replaces the message. */
  name?: string;
  /** A product's status, said with the home's words (site.nav.status.<status>). */
  status?: ProductStatus;
}

export interface StartPath {
  id: StartPathId;
  /** The site the path is about (the row's title links to it). */
  href: string;
  links: StartLink[];
}

export const START_PATHS: StartPath[] = [
  {
    id: "ui",
    href: UI_SITE,
    links: [
      { id: "start", href: `${UI_SITE}/installation/` },
      { id: "templates", href: `${UI_SITE}/templates/` },
      { id: "tokens", href: `${UI_SITE}/foundations/tokens/` },
    ],
  },
  {
    id: "java",
    href: JAVA_SITE,
    links: [
      { id: "start", href: `${JAVA_SITE}/start/` },
      { id: "map", href: `${JAVA_SITE}/map/` },
      { id: "build", href: `${JAVA_SITE}/build/` },
    ],
  },
  {
    id: "products",
    href: "/#products",
    // The home's order (Sovkora, Verikora, Folioviv) and the product's own status, each to its public page.
    links: productOrder(PRODUCTS).map((p) => ({ id: "site", href: p.siteUrl, name: p.name, status: p.status })),
  },
  {
    id: "contribute",
    href: CONTRIBUTING_URL,
    links: [
      { id: "guide", href: CONTRIBUTING_URL },
      { id: "goodFirst", href: GOOD_FIRST_URL },
      { id: "conduct", href: CONDUCT_URL },
    ],
  },
];

/** A path's address in the reader's language: an anchor of the home (`/#products`) takes the locale (`/fr#products`), so
 *  the link lands without a redirect; a site's address is unchanged. */
export function hrefIn(href: string, locale: string): string {
  return href.startsWith("/#") ? `/${locale}${href.slice(1)}` : href;
}
