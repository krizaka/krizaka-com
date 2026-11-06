/* The home's sections, in order. The numbers in the margin (§ n) and the folios (« page n of N ») are read from this
   list, never typed: removing or adding a section renumbers the rest. */

import type { ContactTopic } from "./contact.ts";

export const HOME_SECTIONS = ["hero", "products", "services", "direction", "principles"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];

/** The values of a section's folio: its page (1-based) and the total of pages. */
export function folioOf(section: HomeSection): { page: number; total: number } {
  return { page: HOME_SECTIONS.indexOf(section) + 1, total: HOME_SECTIONS.length };
}

/** The products' row on the home (founder, 2026-11-05, krizaka-internal#2450): Verikora, Sovkora in the centre, Folioviv,
 *  then any other product as listed. */
export const PRODUCT_ORDER = ["yomizaka", "orazaka", "akinaza"] as const;

/** The products' sections under the row (founder, 2026-11-06, krizaka-internal#2658): Sovkora first, then Verikora, then
 *  Folioviv, then any other product as listed. The row above keeps Sovkora in the centre (PRODUCT_ORDER). */
export const SECTION_ORDER = ["orazaka", "yomizaka", "akinaza"] as const;

/** The one product the home serves (krizaka-internal#2445): its reader is the property manager, so the hero's primary
 *  action writes to us on this product's topic of the contact form (lib/contact.ts), and its figure shows this product first. */
export const HOME_PRODUCT = "yomizaka" satisfies ContactTopic;

/** The hero's carousel is Fig. 1 (its slides 1a, 1b…, lib/home-showcase.ts). */
// @fixed: the hero is the page's first figure, a fact of the page's order.
export const HERO_FIGURE = 1;
/** The number of the n-th figure of the sections (1-based): they follow the hero's, so no two figures share a number. */
export const sectionFigure = (n: number): number => HERO_FIGURE + n;
const orderBy =
  (order: readonly string[]) =>
  <T extends { id: string }>(products: readonly T[]): T[] => {
    const rank = (id: string) => {
      const i = order.indexOf(id);
      return i < 0 ? order.length : i;
    };
    return [...products].sort((a, b) => rank(a.id) - rank(b.id));
  };
/** The products in the row's order (PRODUCT_ORDER). */
export const productOrder = orderBy(PRODUCT_ORDER);
/** The products in the sections' order (SECTION_ORDER): the page's order, so the notes and the figures follow it. */
export const sectionOrder = orderBy(SECTION_ORDER);

/** Where an entry's specimen tag stands beside its carousel on a wide screen: the entries alternate in the sections'
 *  order, Sovkora keeping its tag on the left and its carousel on the right (founder, 2026-11-05), so Verikora puts its
 *  carousel on the left and Folioviv on the right again. One column on a phone and a tablet, where there is no side. */
export type EntrySide = "card-left" | "plate-left";
export function entrySide<T extends { id: string }>(products: readonly T[], id: string): EntrySide {
  const i = sectionOrder(products).findIndex((p) => p.id === id);
  return i % 2 === 0 ? "card-left" : "plate-left";
}
