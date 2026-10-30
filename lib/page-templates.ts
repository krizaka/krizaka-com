/* Every page of krizaka.com declares its template — one of the page templates of @krizaka/ui (category « Templates »
   of ui.krizaka.com/templates), or `redirect` for an address kept for old links. `npm run lint` fails when a page (app/**​/page.tsx)
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
  "/open-source": "docs-hub",
  "/open-source/[block]": "longform",
  "/services": "pricing",
  "/changelog": "changelog",
  "/contact": "contact",
  "/privacy": "legal",
  "/terms": "legal",
  "/story": "longform",
  "/[...missing]": "error",
} as const satisfies Record<string, PageTemplate>;

export type PageRoute = keyof typeof PAGE_TEMPLATES;

/** The template a route is built on. */
export const templateOf = (route: PageRoute): PageTemplate => PAGE_TEMPLATES[route];
