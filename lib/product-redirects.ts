/* The products have their own public pages (their commercial www domains, « coming soon » until they open): krizaka.com presents them on its home (#products) — /products
   itself answers 308 there (two views only, 2026-10-17: the home and Open source). Every old
   address of a product page, demo or documentation answers 308 with the product's site — the same address under the
   locale prefix or without it (a config redirect runs before the locale proxy). Read by next.config.ts, tested by
   tests/product-redirects.test.mjs. */

import retired from "./retired-product-ids.json" with { type: "json" };
import { siteUrlOf } from "./product-hosts.ts";

/** The product's public address (its commercial www domain, lib/product-hosts.ts). The old addresses never lead to a
    code-name or dev host (AGENTS.md §2.4). */
export const PRODUCT_SITES = {
  sovkora: siteUrlOf("sovkora"),
  verikora: siteUrlOf("verikora"),
  folioviv: siteUrlOf("folioviv"),
} as const;

/** The retired ids that old links still carry, with the commercial id each became (`CODE_NAMES` of @krizaka/org, through
    lib/retired-product-ids.json, which tests/product-sites.test.mjs keeps equal): an incoming address is accepted, never produced. */
export const RETIRED_PRODUCT_IDS = Object.entries(retired) as [string, keyof typeof PRODUCT_SITES][];

export interface Redirect {
  source: string;
  destination: string;
  statusCode: 308;
  /** Next's `has` condition: lets a locale-less address reach its page in one hop, in the visitor's language. */
  has?: { type: "header"; key: string; value: string }[];
}

/** A browser that asks for English and never French (the rule of lib/locale-negotiation.ts, as a header regex). */
const ENGLISH_ONLY = [{ type: "header", key: "accept-language", value: "^(?!.*\\bfr).*\\ben" }] as Redirect["has"];

/** An address without a locale goes to its final page in ONE hop: the locale proxy would add a second one (`/` → `/fr`). */
const homeSection = (source: string, section: string): Redirect[] => [
  { source, destination: `/en${section}`, statusCode: 308, has: ENGLISH_ONLY },
  { source, destination: `/fr${section}`, statusCode: 308 },
];

/** Optional locale prefix of every source. */
const L = "/:locale(fr|en)?";

const to = (source: string, destination: string): Redirect => ({
  source: `${L}${source}`,
  destination,
  statusCode: 308,
});

/** The addresses an old Sovkora link may carry (the pages that redirected to its product page, before it left). */
const SOVKORA_LEGACY = [
  "/architecture",
  "/demos",
  "/editions",
  "/get-started",
  "/ingenierie-cognitive",
  "/packages",
  "/roadmap",
  "/solutions",
  "/use-cases",
];

/** A product's old documentation → its site. Verikora's keeps the visitor's language (the coming-soon face has no /docs). */
const docsRedirects = (id: string): Redirect[] => {
  const site = PRODUCT_SITES[((retired as Record<string, string>)[id] ?? id) as keyof typeof PRODUCT_SITES];
  return site === PRODUCT_SITES.verikora
    ? [
        { source: `/:locale(fr|en)/docs/${id}/:path*`, destination: `${site}/:locale/`, statusCode: 308 },
        { source: `/docs/${id}/:path*`, destination: `${site}/`, statusCode: 308 },
      ]
    : [to(`/docs/${id}/:path*`, site)];
};

export function productRedirects(): Redirect[] {
  return [
    // The products' page merged into the home: /products → the home's products section (same language).
    ...homeSection("/products", "#products"),
    { source: "/:locale(fr|en)/products", destination: "/:locale#products", statusCode: 308 },
    // The product pages, their demos, galleries, journeys and use cases.
    ...(Object.entries(PRODUCT_SITES) as [string, string][]).map(([id, site]) => to(`/products/${id}/:path*`, site)),
    ...RETIRED_PRODUCT_IDS.map(([old, id]) => to(`/products/${old}/:path*`, PRODUCT_SITES[id])),
    // The products' documentation (Krizaka UI and Krizaka Java stay here), at the commercial id and at the retired one.
    ...[...Object.keys(PRODUCT_SITES), ...RETIRED_PRODUCT_IDS.map(([old]) => old)].flatMap((id) => docsRedirects(id)),
    // Any other old product page (a product that left, krizaka/.github#413) → the products section, never a dead site.
    ...homeSection("/products/:path*", "#products"),
    { source: "/:locale(fr|en)/products/:path*", destination: "/:locale#products", statusCode: 308 },
    // The blog is blog.krizaka.com (English at the root, French under /fr): its old krizaka.com address, never a 404.
    { source: "/fr/blog", destination: "https://blog.krizaka.com/fr/", statusCode: 308 },
    { source: "/fr/blog/:path+", destination: "https://blog.krizaka.com/fr/:path+/", statusCode: 308 },
    { source: "/:locale(en)?/blog", destination: "https://blog.krizaka.com/", statusCode: 308 },
    { source: "/:locale(en)?/blog/:path+", destination: "https://blog.krizaka.com/:path+/", statusCode: 308 },
    // Old Sovkora addresses, and the page it had at its retired id.
    ...[...SOVKORA_LEGACY, ...RETIRED_PRODUCT_IDS.filter(([, id]) => id === "sovkora").map(([old]) => `/${old}`)].map(
      (path) => to(`${path}/:path*`, PRODUCT_SITES.sovkora),
    ),
  ];
}

/** Served after every other redirect (next.config.ts): an old documentation address no rule claims (the docs of a
    product that left, krizaka/.github#413) goes to the products section, never a 404 and never a dead site. It names no
    product: whatever is under /docs/ and is not Krizaka UI, Krizaka Java or a presented product lands there. */
export function lastResortRedirects(): Redirect[] {
  return [
    ...homeSection("/docs/:path+", "#products"),
    // …except the hub's own share image, /<locale>/docs/opengraph-image (krizaka-internal#2833).
    { source: "/:locale(fr|en)/docs/:path((?!opengraph-image).+)", destination: "/:locale#products", statusCode: 308 },
  ];
}
