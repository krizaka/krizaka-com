/* Site navigation — one source for the bar (TopNavBar), the mobile panel, the footer and the products page.

   krizaka.com is the company; everything else Krizaka makes has its own site (NAV-SYS, 2026-10-14): the products on
   dev.<product>.com (lib/products.ts), the open-source stack on ui.krizaka.com and java.krizaka.com (lib/stack.ts).
   The bar, in three zones:
   - left, who we are: the Krizaka mark, then the family switcher (NAV_FAMILY: Krizaka · the products · the open-source
     stack · GitHub) — it becomes @krizaka/ui's NavBar.Family (fed by @krizaka/ui/sites) once that is published;
   - centre, this site: Products · Open source · Our story (NAV_BAR_LINKS) — never a link to another site;
   - right, tools: GitHub · theme · language · Contact us. No "Docs": the documentation lives on its own sites. */

import type { TranslationDictionary } from "./i18n";
import { PRODUCTS, type ProductId, type ProductStatus } from "./products";
import { GITHUB_ORG_URL, SITE_URL } from "./site";
import { STACK, type StackId } from "./stack";

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

/* The Krizaka family — every site Krizaka runs, as the family switcher (left of the bar), the mobile panel and the
   footer list them. Words: site.nav.family (FamilySwitcher). */
export type FamilyEntry =
  | { kind: "company"; id: "krizaka"; name: string; href: string }
  | { kind: "product"; id: ProductId; name: string; href: string; status?: ProductStatus }
  | { kind: "stack"; id: StackId; name: string; href: string }
  | { kind: "github"; id: "github"; name: string; href: string };

export const NAV_FAMILY: {
  company: FamilyEntry & { kind: "company" };
  products: (FamilyEntry & { kind: "product" })[];
  stack: (FamilyEntry & { kind: "stack" })[];
  github: FamilyEntry & { kind: "github" };
} = {
  company: { kind: "company", id: "krizaka", name: "Krizaka", href: SITE_URL },
  products: NAV_PRODUCTS.map((p) => ({ kind: "product" as const, ...p })),
  stack: STACK.map((s) => ({ kind: "stack" as const, id: s.id, name: s.name, href: s.url })),
  github: { kind: "github", id: "github", name: "GitHub", href: GITHUB_ORG_URL },
};

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
