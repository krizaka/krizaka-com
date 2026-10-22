/* The changelog's product filter. The address is the state (`?produit=yomizaka`, krizaka AGENTS.md §4): a shared link,
   back and forward and a reload all keep it. The focus applies: a product outside it is neither listed nor filterable
   until the notebook is open whole (lib/focus.ts). Pure, tested by tests/changelog.test.mjs. */

import { PRODUCT_IDS } from "./product-hosts.ts";
import { isHidden } from "./focus.ts";

export const FILTER_PARAM = "produit";
/** Every filter, in the order of the chips: the products, then the open-source stack. */
export const FILTER_IDS = [...PRODUCT_IDS, "ui", "java"] as const;
export type FilterId = (typeof FILTER_IDS)[number];

/** The filter an address asks for, `undefined` (everything) when it is absent or unknown. */
export const filterOf = (value: string | null | undefined): FilterId | undefined => FILTER_IDS.find((id) => id === value);

/** The chips to show: the focus, or all of them when the notebook is open. */
export const visibleFilters = (open: boolean): FilterId[] => FILTER_IDS.filter((id) => open || !isHidden(id));

/** The entries to show for a filter and a focus. */
export const visibleEntries = <T extends { product: string }>(entries: readonly T[], selected: FilterId | undefined, open: boolean): T[] =>
  entries.filter((e) => (selected ? e.product === selected : true) && (open || !isHidden(e.product)));

/** The address of a chip: the same page with `?produit=` set (or removed for everything). */
export function filterHref(search: string, id: FilterId | undefined): string {
  const params = new URLSearchParams(search);
  if (id) params.set(FILTER_PARAM, id);
  else params.delete(FILTER_PARAM);
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}
