/* The home's sections, in order. The numbers in the margin (§ n) and the folios (« page n of N ») are read from this
   list, never typed: removing or adding a section renumbers the rest. */

export const HOME_SECTIONS = ["hero", "engine", "products", "services", "direction", "principles"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];

/** The values of a section's folio: its page (1-based) and the total of pages. */
export function folioOf(section: HomeSection): { page: number; total: number } {
  return { page: HOME_SECTIONS.indexOf(section) + 1, total: HOME_SECTIONS.length };
}

/** The marks under the hero, in the story's order: the engine first, then the products by priority (Akinaza, Yomizaka), then the rest as listed. */
export const HERO_MARK_PRIORITY = ["orazaka", "akinaza", "yomizaka"] as const;
export function heroMarkOrder<T extends { id: string }>(products: readonly T[]): T[] {
  const rank = (id: string) => {
    const i = (HERO_MARK_PRIORITY as readonly string[]).indexOf(id);
    return i < 0 ? HERO_MARK_PRIORITY.length : i;
  };
  return [...products].sort((a, b) => rank(a.id) - rank(b.id));
}

/** Where an entry's specimen tag stands beside its plate on a wide screen (founder, 2026-11-01, krizaka-internal#683): the
 *  timeline alternates from the engine on, in the story's order, so the engine opens with its tag on the left, the next
 *  entry puts its plate there, and so on. One column on a phone and a tablet, where there is no side. */
export type EntrySide = "card-left" | "plate-left";
export function entrySide<T extends { id: string }>(products: readonly T[], id: string): EntrySide {
  const i = heroMarkOrder(products).findIndex((p) => p.id === id);
  return i % 2 === 0 ? "card-left" : "plate-left";
}
