/* The products have their own public pages (www.<product>.com, « coming soon»): krizaka.com presents them on its home (#products) — /products
   itself answers 308 there (two views only, 2026-10-17: the home and Open source). Every old
   address of a product page, demo or documentation answers 308 with the product's site — the same address under the
   locale prefix or without it (a config redirect runs before the locale proxy). Read by next.config.ts, tested by
   tests/product-redirects.test.mjs. */

import { wwwUrl } from "./product-hosts.ts";

/** The product's public address (www.<product>.com). The old
    addresses never lead to a dev host: it is not indexed (AGENTS.md §2.4). */
export const PRODUCT_SITES = {
  orazaka: wwwUrl("orazaka"),
  yomizaka: wwwUrl("yomizaka"),
  akinaza: wwwUrl("akinaza"),
} as const;

/** The old addresses of products that are no longer presented (paused, 2026-10-25): they answer 308 with the home's
    products section, never a 404 and never a site that is gone. */
const RETIRED = ["orochia", "yasakia", "yazakia", "yororis", "kachizaka"] as const;

export interface Redirect {
  source: string;
  destination: string;
  statusCode: 308;
}

/** Optional locale prefix of every source. */
const L = "/:locale(fr|en)?";

const to = (source: string, destination: string): Redirect => ({ source: `${L}${source}`, destination, statusCode: 308 });

/** The addresses an old Orazaka link may carry (the pages that redirected to /products/orazaka/…, before it left). */
const ORAZAKA_LEGACY = ["/orazaka", "/architecture", "/demos", "/editions", "/get-started", "/ingenierie-cognitive", "/packages", "/roadmap", "/solutions", "/use-cases"];

export function productRedirects(): Redirect[] {
  const { orazaka, yomizaka } = PRODUCT_SITES;
  return [
    // The products' page merged into the home: /products → the home's products section (same language).
    { source: "/products", destination: "/#products", statusCode: 308 },
    { source: "/:locale(fr|en)/products", destination: "/:locale#products", statusCode: 308 },
    // The product pages, their demos, galleries, journeys and use cases.
    ...(Object.entries(PRODUCT_SITES) as [string, string][]).map(([id, site]) => to(`/products/${id}/:path*`, site)),
    // The products' documentation (Krizaka UI and Krizaka Java stay here).
    to("/docs/orazaka/:path*", orazaka),
    // Yomizaka documents itself at /docs (yomizaka#387): a single page, in the visitor's language when the address names one.
    { source: "/:locale(fr|en)/docs/yomizaka/:path*", destination: `${yomizaka}/:locale/docs`, statusCode: 308 },
    { source: "/docs/yomizaka/:path*", destination: `${yomizaka}/docs`, statusCode: 308 },
    // The retired products' pages and documentation → the products section.
    ...RETIRED.flatMap((id) => [to(`/products/${id}/:path*`, "/#products"), to(`/docs/${id}/:path*`, "/#products")]),
    // Old Orazaka addresses.
    ...ORAZAKA_LEGACY.map((path) => to(`${path}/:path*`, orazaka)),
  ];
}
