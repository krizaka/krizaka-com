/* The products have their own public pages (www.<product>.com, « coming soon»): krizaka.com presents them on its home (#products) — /products
   itself answers 308 there (two views only, 2026-10-17: the home and Open source). Every old
   address of a product page, demo or documentation answers 308 with the product's site — the same address under the
   locale prefix or without it (a config redirect runs before the locale proxy). Read by next.config.ts, tested by
   tests/product-redirects.test.mjs. */

import { wwwUrl } from "./product-hosts.ts";

/** The product's public address (www.<product>.com). Yasakia is renamed Yasakia: its domain is yasakia.com. The old
    addresses never lead to a dev host: it is not indexed (AGENTS.md §2.4). */
export const PRODUCT_SITES = {
  orazaka: wwwUrl("orazaka"),
  orochia: wwwUrl("orochia"),
  yasakia: wwwUrl("yasakia"),
  yororis: wwwUrl("yororis"),
  yomizaka: wwwUrl("yomizaka"),
  kachizaka: wwwUrl("kachizaka"),
  akinaza: wwwUrl("akinaza"),
} as const;

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
  const { orazaka, orochia, yasakia, yororis, yomizaka } = PRODUCT_SITES;
  return [
    // The products' page merged into the home: /products → the home's products section (same language).
    { source: "/products", destination: "/#products", statusCode: 308 },
    { source: "/:locale(fr|en)/products", destination: "/:locale#products", statusCode: 308 },
    // The product pages, their demos, galleries, journeys and use cases.
    ...(Object.entries(PRODUCT_SITES) as [string, string][]).map(([id, site]) => to(`/products/${id}/:path*`, site)),
    // Yazakia's old address (renamed Yasakia, 2026-10-14).
    to("/products/yazakia/:path*", yasakia),
    // The products' documentation (Krizaka UI and Krizaka Java stay here).
    to("/docs/orazaka/:path*", orazaka),
    to("/docs/orochia/:path*", orochia),
    to("/docs/yororis/:path*", yororis),
    to("/docs/yomizaka/:path*", yomizaka),
    // Old Orazaka addresses.
    ...ORAZAKA_LEGACY.map((path) => to(`${path}/:path*`, orazaka)),
  ];
}
