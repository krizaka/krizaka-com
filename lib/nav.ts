/* Site navigation — one source for the desktop mega-menu (ProductsMenu) and the mobile panel.
   Every product exposes the same five entries, in the same order, so the two read alike:
   overview · how it works · demo · documentation · its signature capability. */

import type { TranslationDictionary } from "@/lib/i18n";

export type ProductLinkId = "overview" | "architecture" | "demo" | "docs" | "signature";
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
      { href: "/products/orazaka/getting-started/101", icon: "docs", match: ["/products/orazaka/getting-started", "/products/orazaka/api", "/products/orazaka/core-features", "/products/orazaka/guidelines", "/products/orazaka/usecases"] },
      { href: "/products/orazaka/ingenierie-cognitive", icon: "signature", match: ["/products/orazaka/packages"] },
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
      { href: "/products/orochia/docs", icon: "docs", match: ["/products/orochia/docs"] },
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
