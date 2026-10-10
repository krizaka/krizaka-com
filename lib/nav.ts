/* Site navigation — one source for the desktop mega-menu (ProductsMenu), the mobile panel, the footer and the home
   spotlights. Every product exposes the same four entries, in the same order, so the two read alike:
   overview · how it works · demo · its signature capability. Documentation lives under Docs (NAV_DOCS), the one entry
   point of every documentation — the products' and the platform's. */

import type { TranslationDictionary } from "@/lib/i18n";

export type ProductLinkId = "overview" | "architecture" | "demo" | "signature";
export type CompanyLinkId = "products" | "story" | "repos" | "contact";
export type NavIcon = ProductLinkId | CompanyLinkId;

/** Texts: messages → site.nav.<product>.links.<icon> (products) or site.nav.company.<icon>. */
export interface NavLink<I extends NavIcon = NavIcon> {
  href: string;
  icon: I;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}

export interface NavProduct {
  id: "orazaka" | "orochia";
  name: string;
  href: string;
  /** Tagline and badge: messages → site.nav.<id>. */
  links: NavLink<ProductLinkId>[];
}

export const NAV_PRODUCTS: NavProduct[] = [
  {
    id: "orazaka",
    name: "Orazaka",
    href: "/products/orazaka",
    links: [
      { href: "/products/orazaka", icon: "overview" },
      { href: "/products/orazaka/architecture", icon: "architecture" },
      { href: "/products/orazaka/demos", icon: "demo" },
      { href: "/products/orazaka/ingenierie-cognitive", icon: "signature", match: ["/products/orazaka/packages", "/products/orazaka/usecases"] },
    ],
  },
  {
    id: "orochia",
    name: "Orochia",
    href: "/products/orochia",
    links: [
      { href: "/products/orochia", icon: "overview" },
      { href: "/products/orochia#architecture", icon: "architecture" },
      { href: "/products/orochia#tour", icon: "demo" },
      { href: "/products/orochia#guarantees", icon: "signature" },
    ],
  },
];

export const NAV_COMPANY: NavLink<CompanyLinkId>[] = [
  { href: "/products", icon: "products" },
  { href: "/story", icon: "story" },
  { href: "/open-source", icon: "repos" },
  { href: "/contact", icon: "contact" },
];

/* Docs: the one entry point of every documentation — the products' (synced from their code) and the platform's
   (Krizaka UI, Krizaka Java). The "Docs" menu on desktop, the "Docs" group on mobile, "Documentation" in the footer; the
   hub /docs links everything. Open source (/open-source) stays the list of packages and repositories; Docs is how to
   use them. Krizaka UI is the one public documentation of the components (generated from their code; the visual-test
   catalogue of krizaka-ui is an internal test tool, never linked).
   Texts: products → site.nav.docs.<id>; ui/java → docs.sections.<id>; the hub → site.nav.docs.all. */
export type DocsLinkId = "orazaka" | "orochia" | "ui" | "java";
export interface DocsNavLink {
  id: DocsLinkId;
  href: string;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}
export const NAV_DOCS_HUB = "/docs";
export const NAV_DOCS: DocsNavLink[] = [
  { id: "orazaka", href: "/docs/orazaka" },
  { id: "orochia", href: "/docs/orochia", match: ["/products/orochia/docs"] },
  { id: "ui", href: "/docs/ui" },
  { id: "java", href: "/docs/java" },
];
export const docsLinkText = (t: TranslationDictionary, link: DocsNavLink) =>
  link.id === "orazaka" || link.id === "orochia"
    ? t.site.nav.docs[link.id]
    : { label: t.docs.sections[link.id].title, desc: t.docs.sections[link.id].description };
export const isDocsActive = (link: DocsNavLink, pathname: string) =>
  pathname.startsWith(link.href) || (link.match ?? []).some((p) => pathname.startsWith(p));
/** The Docs menu is active anywhere under /docs (and on the legacy product doc routes). */
export const isDocsSection = (pathname: string) =>
  pathname === NAV_DOCS_HUB || pathname.startsWith(`${NAV_DOCS_HUB}/`) || NAV_DOCS.some((d) => isDocsActive(d, pathname));

/** True when `pathname` (locale-less) is this link's page — anchors (#…) never mark a link active. */
export function isNavActive(link: NavLink, pathname: string): boolean {
  if (link.href.includes("#")) return false;
  if (pathname === link.href) return true;
  return (link.match ?? []).some((p) => pathname.startsWith(p));
}

/** Strips the /fr or /en prefix. */
export function localeless(pathname: string): string {
  return pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
}

/** The label and description of a product's entry. */
export const productLinkText = (t: TranslationDictionary, product: NavProduct["id"], link: NavLink<ProductLinkId>) => t.site.nav[product].links[link.icon];

/** The label and description of a company entry. */
export const companyLinkText = (t: TranslationDictionary, link: NavLink<CompanyLinkId>) => t.site.nav.company[link.icon];
