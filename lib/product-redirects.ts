/* The products have their own sites (dev.<product>.com): krizaka.com keeps one page about them (/products). Every old
   address of a product page, demo or documentation answers 308 with the product's site — the same address under the
   locale prefix or without it (a config redirect runs before the locale proxy). Read by next.config.ts, tested by
   tests/product-redirects.test.mjs. */

/** The product's own site. Yasakia is renamed Yasakia: its domain is yasakia.com. */
export const PRODUCT_SITES = {
  orazaka: "https://dev.orazaka.com",
  orochia: "https://dev.orochia.com",
  yasakia: "https://dev.yasakia.com",
  yororis: "https://dev.yororis.com",
  yomizaka: "https://dev.yomizaka.com",
  // In development, nothing deployed yet: the old addresses lead to the repository (never a dead dev site).
  kachizaka: "https://github.com/krizaka/kachizaka",
  akinaza: "https://github.com/krizaka/akinaza",
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
    // The product pages, their demos, galleries, journeys and use cases.
    ...(Object.entries(PRODUCT_SITES) as [string, string][]).map(([id, site]) => to(`/products/${id}/:path*`, site)),
    // Yazakia's old address (renamed Yasakia, 2026-10-14).
    to("/products/yazakia/:path*", yasakia),
    // The products' documentation (Krizaka UI and Krizaka Java stay here).
    to("/docs/orazaka/:path*", `${orazaka}/docs`),
    to("/docs/orochia/:path*", `${orochia}/docs`),
    to("/docs/yororis/:path*", yororis),
    to("/docs/yomizaka/:path*", `${yomizaka}/docs`),
    // Old Orazaka addresses.
    ...ORAZAKA_LEGACY.map((path) => to(`${path}/:path*`, orazaka)),
  ];
}
