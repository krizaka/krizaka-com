/* Site navigation — one source for the bar (TopNavBar), the mobile panel, the footer and the products page.

   krizaka.com is the company; everything else Krizaka makes has its own site (NAV-SYS, 2026-10-14): the products on
   dev.<product>.com (lib/products.ts), the open-source stack on ui.krizaka.com and java.krizaka.com (lib/stack.ts).
   The bar, in three zones:
   - left, who we are: the Krizaka mark, then NavBar.Family — every site of the family, from @krizaka/ui/sites;
   - centre, this site: Products · Open source · Our story (NAV_BAR_LINKS) — never a link to another site;
   - right, tools: Repo · theme · language · Contact us. No "Docs": the documentation lives on its own sites. */

import type { TranslationDictionary } from "./i18n";
import { PRODUCTS, type ProductId, type ProductStatus } from "./products";

export type { ProductStatus } from "./products";
export type CompanyLinkId = "products" | "story" | "repos" | "contact";
export type NavIcon = CompanyLinkId;

/** Texts: messages → site.nav.company.<icon> (label, desc). */
export interface NavLink<I extends NavIcon = NavIcon> {
  href: string;
  icon: I;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}

/** A product as the footer and the family list it: the product's own site is its entry (never a page of this site). */
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
  { href: "/open-source", icon: "repos", match: ["/open-source/"] },
  { href: "/contact", icon: "contact" },
];

/** The centre of the bar: this site's sections, in this order. */
export const NAV_BAR_LINKS: NavLink<CompanyLinkId>[] = (["products", "repos", "story"] as const).map((icon) => NAV_COMPANY.find((l) => l.icon === icon)!);

/* While the documentation still renders here (/docs, until it has moved to ui.krizaka.com and java.krizaka.com), the
   bar under /docs names where the reader is (Docs / <section>, DocsCrumb) and keeps the search over it. Nothing outside
   /docs links here any more. Texts: docs.sections.<id>. */
export type DocsLinkId = "ui";
export interface DocsNavLink {
  id: DocsLinkId;
  href: string;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}
export const NAV_DOCS_HUB = "/docs";
export const NAV_DOCS: DocsNavLink[] = [
  { id: "ui", href: "https://ui.krizaka.com" },
];
export const docsLinkText = (t: TranslationDictionary, link: DocsNavLink) => ({
  label: t.docs.sections[link.id].title,
  desc: t.docs.sections[link.id].description,
});
const docsLinkMatches = (link: DocsNavLink, pathname: string) =>
  pathname.startsWith(link.href) || (link.match ?? []).some((p) => pathname.startsWith(p));
/** True anywhere under /docs. */
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
