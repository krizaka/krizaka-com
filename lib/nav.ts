/* Site navigation — one source for the desktop bar (TopNavBar), the mobile panel, the footer, the ⌘K search and the
   products page.

   krizaka.com is the company's showcase; each product lives on its own site (lib/products.ts). The bar (left → right):
   the Krizaka mark · Products (a plain link to /products — one card per product) · Open source · Our story — then, on
   the right, Search ⌘K · Docs (a plain link to the hub /docs) · GitHub · theme · language · Contact us. Under /docs the
   left group becomes a breadcrumb (Docs / <section>) instead of the site links. */

import type { TranslationDictionary } from "@/lib/i18n";
import { PRODUCTS, type ProductId, type ProductStatus } from "@/lib/products";

export type { ProductStatus } from "@/lib/products";
export type CompanyLinkId = "products" | "story" | "repos" | "contact";
export type NavIcon = CompanyLinkId;

/** Texts: messages → site.nav.company.<icon> (label, desc). */
export interface NavLink<I extends NavIcon = NavIcon> {
  href: string;
  icon: I;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}

/** A product as the footer and the search list it: the product's own site is its entry (never a page of this site). */
export interface NavProduct {
  id: ProductId;
  name: string;
  /** The product's dev site. */
  href: string;
  status?: ProductStatus;
}
export const NAV_PRODUCTS: NavProduct[] = PRODUCTS.map(({ id, name, devUrl, status }) => ({ id, name, href: devUrl, status }));

export const NAV_COMPANY: NavLink<CompanyLinkId>[] = [
  { href: "/products", icon: "products" },
  { href: "/story", icon: "story" },
  { href: "/open-source", icon: "repos" },
  { href: "/contact", icon: "contact" },
];

/** The plain links of the bar's left group (desktop), in this order. */
export const NAV_BAR_LINKS: NavLink<CompanyLinkId>[] = (["products", "repos", "story"] as const).map((icon) => NAV_COMPANY.find((l) => l.icon === icon)!);

/* Docs: the documentation of what Krizaka ships as a platform — Krizaka UI and Krizaka Java. The products' own
   documentation is on their sites (next.config redirects the old /docs/<product> addresses there). In the bar, Docs is a
   plain link to the hub on the right; under /docs the bar shows the breadcrumb Docs / <section> (docsSectionOf).
   Texts: docs.sections.<id>; the hub → site.nav.docs.all. */
export type DocsLinkId = "ui" | "java";
export interface DocsNavLink {
  id: DocsLinkId;
  href: string;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}
export const NAV_DOCS_HUB = "/docs";
export const NAV_DOCS: DocsNavLink[] = [
  { id: "ui", href: "/docs/ui" },
  { id: "java", href: "/docs/java" },
];
export const docsLinkText = (t: TranslationDictionary, link: DocsNavLink) => ({
  label: t.docs.sections[link.id].title,
  desc: t.docs.sections[link.id].description,
});
const docsLinkMatches = (link: DocsNavLink, pathname: string) =>
  pathname.startsWith(link.href) || (link.match ?? []).some((p) => pathname.startsWith(p));
/** The Docs menu is active anywhere under /docs. */
export const isDocsSection = (pathname: string) => pathname === NAV_DOCS_HUB || pathname.startsWith(`${NAV_DOCS_HUB}/`);

/** The documentation entry `pathname` (locale-less) belongs to. */
export const docsSectionOf = (pathname: string) => NAV_DOCS.find((d) => docsLinkMatches(d, pathname));

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

/** The label and description of a company entry. */
export const companyLinkText = (t: TranslationDictionary, link: NavLink<CompanyLinkId>) => t.site.nav.company[link.icon];
