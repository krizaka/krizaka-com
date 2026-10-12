/* Site navigation — one source for the desktop bar (TopNavBar · ProductsMenu), the mobile panel, the footer, the ⌘K
   search and the home spotlights.

   The bar (left → right): the Krizaka mark · Products (the one menu) · Open source · Our story — then, on the right,
   Search ⌘K · Docs (a plain link to the hub /docs) · GitHub · theme · language · Contact us. Products and the
   documentation never compete: Docs is not a menu, it opens the hub, and the documentation carries its own section
   switcher (Fumadocs tabs). Under /docs the left group becomes a breadcrumb (Docs / <section>) instead of the site menu.

   Every product exposes the same four entries, in the same order: overview · how it works · demo · its signature
   capability. The Products panel shows them in two columns — the products on the left, the selected product's entries
   on the right, each with its icon and a short line (site.nav.<product>.links.<icon>.desc). NAV_COMPANY adds
   "All products" under the panel; the mobile panel lists every entry. */

import type { TranslationDictionary } from "@/lib/i18n";

export type ProductLinkId = "overview" | "architecture" | "demo" | "signature";
export type CompanyLinkId = "products" | "story" | "repos" | "contact";
export type NavIcon = ProductLinkId | CompanyLinkId;

/** Texts: messages → site.nav.<product>.links.<icon> (label, desc) or site.nav.company.<icon> (label, desc). */
export interface NavLink<I extends NavIcon = NavIcon> {
  href: string;
  icon: I;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}

export interface NavProduct {
  id: "orazaka" | "orochia" | "yazakia";
  name: string;
  href: string;
  /** Not released yet: the menus and the home say so (site.nav.<id>.badge, "Coming soon"). */
  soon?: boolean;
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
      { href: "/products/orochia/demos", icon: "demo" },
      { href: "/products/orochia#guarantees", icon: "signature" },
    ],
  },
  /* Coming soon: only what exists today — the teaser page and its sections. The demo and the documentation join the
     four entries when the app and its docs exist (no dead link). */
  {
    id: "yazakia",
    name: "Yazakia",
    href: "/products/yazakia",
    soon: true,
    links: [
      { href: "/products/yazakia", icon: "overview" },
      { href: "/products/yazakia#architecture", icon: "architecture" },
      { href: "/products/yazakia#matching", icon: "signature" },
    ],
  },
];

export const NAV_COMPANY: NavLink<CompanyLinkId>[] = [
  { href: "/products", icon: "products" },
  { href: "/story", icon: "story" },
  { href: "/open-source", icon: "repos" },
  { href: "/contact", icon: "contact" },
];

/** The plain links of the bar's left group, after the Products menu (desktop), in this order. */
export const NAV_BAR_LINKS: NavLink<CompanyLinkId>[] = (["repos", "story"] as const).map((icon) => NAV_COMPANY.find((l) => l.icon === icon)!);

/* Docs: the one entry point of every documentation — the products' (synced from their code) and the platform's
   (Krizaka UI, Krizaka Java). The "Docs" group on mobile, the "Documentation" column of the footer; the hub /docs links
   everything. Open source (/open-source) stays the list of packages and repositories; Docs is how to
   use them. Krizaka UI is the one public documentation of the components (generated from their code; the visual-test
   catalogue of krizaka-ui is an internal test tool, never linked). In the bar, Docs is a plain link to the hub on the
   right (next to the search); under /docs the bar shows the breadcrumb Docs / <section> (docsSectionOf). The ⌘K
   search and the footer's Documentation column list NAV_DOCS.
   The CLI has its own entry — the tool a developer reaches for first (one command per intent) — pointing at its
   generated reference in the Orazaka docs.
   Texts: products and the CLI → site.nav.docs.<id>; ui/java → docs.sections.<id>; the hub → site.nav.docs.all. */
export type DocsLinkId = "orazaka" | "cli" | "orochia" | "ui" | "java";
export interface DocsNavLink {
  id: DocsLinkId;
  href: string;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}
export const NAV_DOCS_HUB = "/docs";
export const NAV_DOCS: DocsNavLink[] = [
  { id: "orazaka", href: "/docs/orazaka" },
  { id: "cli", href: "/docs/orazaka/cli" },
  { id: "orochia", href: "/docs/orochia", match: ["/products/orochia/docs"] },
  { id: "ui", href: "/docs/ui" },
  { id: "java", href: "/docs/java" },
];
export const docsLinkText = (t: TranslationDictionary, link: DocsNavLink) =>
  link.id === "ui" || link.id === "java"
    ? { label: t.docs.sections[link.id].title, desc: t.docs.sections[link.id].description }
    : t.site.nav.docs[link.id];
/** The mark beside a docs entry: the product's, the CLI wears Orazaka's (it is the Orazaka CLI), Krizaka's otherwise. */
export const docsLinkLogo = (link: DocsNavLink): "orazaka" | "orochia" | "krizaka" =>
  link.id === "orazaka" || link.id === "cli" ? "orazaka" : link.id === "orochia" ? "orochia" : "krizaka";
const docsLinkMatches = (link: DocsNavLink, pathname: string) =>
  pathname.startsWith(link.href) || (link.match ?? []).some((p) => pathname.startsWith(p));
/** Active on its pages — but not where a more specific entry (the CLI inside the Orazaka docs) is. */
export const isDocsActive = (link: DocsNavLink, pathname: string) =>
  docsLinkMatches(link, pathname) &&
  !NAV_DOCS.some((other) => other !== link && other.href.length > link.href.length && other.href.startsWith(link.href) && docsLinkMatches(other, pathname));
/** The Docs menu is active anywhere under /docs (and on the legacy product doc routes). */
export const isDocsSection = (pathname: string) =>
  pathname === NAV_DOCS_HUB || pathname.startsWith(`${NAV_DOCS_HUB}/`) || NAV_DOCS.some((d) => isDocsActive(d, pathname));

/** The documentation entry `pathname` (locale-less) belongs to — the most specific one (the CLI inside Orazaka's docs). */
export const docsSectionOf = (pathname: string) =>
  NAV_DOCS.filter((d) => isDocsActive(d, pathname)).sort((a, b) => b.href.length - a.href.length)[0];

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

/** The label of a product's entry. */
export const productLinkText = (t: TranslationDictionary, product: NavProduct["id"], link: NavLink<ProductLinkId>) => t.site.nav[product].links[link.icon].label;
/** The short line under a product's entry (Products panel, mobile panel). */
export const productLinkDesc = (t: TranslationDictionary, product: NavProduct["id"], link: NavLink<ProductLinkId>) => t.site.nav[product].links[link.icon].desc;

/** The label and description of a company entry. */
export const companyLinkText = (t: TranslationDictionary, link: NavLink<CompanyLinkId>) => t.site.nav.company[link.icon];
