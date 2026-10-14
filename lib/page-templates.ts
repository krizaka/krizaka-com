/* Every page of krizaka.com declares its template — one of the page templates of @krizaka/ui (category « Templates »
   of /docs/ui), or `redirect` for an address kept for old links. `npm run lint` fails when a page (app/**​/page.tsx)
   is missing here (scripts/check-page-templates.mjs), so no page is built outside the catalogue. A page is rebuilt on
   its template's component as the catalogue grows; the composition is the template's either way.
   Keys: the route under app/[locale], as written in the folder names. */

export type PageTemplate =
  | "landing"
  | "product"
  | "how-it-works"
  | "gallery"
  | "docs-hub"
  | "docs-article"
  | "component"
  | "catalogue"
  | "longform"
  | "changelog"
  | "contact"
  | "legal"
  | "status"
  | "error"
  | "pricing"
  | "redirect";

export const PAGE_TEMPLATES = {
  "/": "landing",
  "/products": "catalogue",
  "/open-source": "catalogue",
  "/open-source/[block]": "longform",
  "/docs": "docs-hub",
  "/docs/[section]/[[...slug]]": "docs-article",
  "/contact": "contact",
  "/privacy": "legal",
  "/terms": "legal",
  "/story": "longform",
  "/[...missing]": "error",
} as const satisfies Record<string, PageTemplate>;

export type PageRoute = keyof typeof PAGE_TEMPLATES;

/** The template a route is built on. */
export const templateOf = (route: PageRoute): PageTemplate => PAGE_TEMPLATES[route];
