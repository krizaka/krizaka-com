/* The home's sections, in order. The numbers in the margin (§ n) and the folios (« page n of N ») are read from this
   list, never typed: removing or adding a section renumbers the rest. */

import type { ContactProduct } from "./contact.ts";

export const HOME_SECTIONS = ["hero", "products", "services", "direction", "principles"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];

/** The values of a section's folio: its page (1-based) and the total of pages. */
export function folioOf(section: HomeSection): { page: number; total: number } {
  return { page: HOME_SECTIONS.indexOf(section) + 1, total: HOME_SECTIONS.length };
}

/** The products' row on the home (founder, 2026-11-06, krizaka-internal#2714; was Verikora, Sovkora, Folioviv in #2450):
 *  Sovkora, the engine the products run on, first, then Verikora, then Folioviv, then any other product as listed. */
export const PRODUCT_ORDER = ["orazaka", "yomizaka", "akinaza"] as const;

/** The one product the home serves (krizaka-internal#2445): its reader is the property manager, so the hero's primary
 *  action writes to us on this product's topic of the contact form (lib/contact.ts), and its figure shows this product first. */
export const HOME_PRODUCT = "verikora" satisfies ContactProduct;

/** The hero's carousel is Fig. 1 (its slides 1a, 1b…, lib/home-showcase.ts). */
// @fixed: the hero is the page's first figure, a fact of the page's order.
export const HERO_FIGURE = 1;
/** The number of the n-th figure of the sections (1-based): they follow the hero's, so no two figures share a number. */
export const sectionFigure = (n: number): number => HERO_FIGURE + n;
export function productOrder<T extends { id: string }>(products: readonly T[]): T[] {
  const rank = (id: string) => {
    const i = (PRODUCT_ORDER as readonly string[]).indexOf(id);
    return i < 0 ? PRODUCT_ORDER.length : i;
  };
  return [...products].sort((a, b) => rank(a.id) - rank(b.id));
}

/** Where an entry's specimen tag stands beside its carousel on a wide screen: the entries alternate in the row's order,
 *  so Sovkora puts its carousel on the left, Verikora its tag on the left and its carousel on the right, Folioviv its
 *  carousel on the left again (krizaka-internal#2714). One column on a phone and a tablet, where there is no side. */
export type EntrySide = "card-left" | "plate-left";
export function entrySide<T extends { id: string }>(products: readonly T[], id: string): EntrySide {
  const i = productOrder(products).findIndex((p) => p.id === id);
  return i % 2 === 0 ? "plate-left" : "card-left";
}
