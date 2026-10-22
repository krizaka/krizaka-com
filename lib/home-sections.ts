/* The home's sections, in order. The numbers in the margin (§ n) and the folios (« page n of N ») are read from this
   list, never typed: removing or adding a section renumbers the rest. */

export const HOME_SECTIONS = ["hero", "products", "stack", "principles"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];

/** The values of a section's folio: its page (1-based) and the total of pages. */
export function folioOf(section: HomeSection): { page: number; total: number } {
  return { page: HOME_SECTIONS.indexOf(section) + 1, total: HOME_SECTIONS.length };
}
