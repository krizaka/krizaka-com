/* The changelog's product filter. The address is the state (`?produit=verikora`, krizaka AGENTS.md §4): a shared link,
   back and forward and a reload all keep it. Pure, tested by tests/changelog.test.mjs. */

import { CODE_NAMES, displayName } from "@krizaka/org";
import { PRODUCT_IDS } from "./product-hosts.ts";

export const FILTER_PARAM = "produit";
/** Every filter, in the order of the chips: the products, then the open-source stack. */
export const FILTER_IDS = [...PRODUCT_IDS, "ui", "java"] as const;
export type FilterId = (typeof FILTER_IDS)[number];

/** The filter an address asks for, `undefined` (everything) when it is absent or unknown. A product is asked for by its id or
 *  by its commercial name (`?produit=verikora`), the address the products' waiting pages link to; a retired id in an old
 *  link (`CODE_NAMES` of @krizaka/org) is accepted as the product it became, never produced. */
export const filterOf = (value: string | null | undefined): FilterId | undefined => {
  const id = value ? (CODE_NAMES[value.toLowerCase()] ?? value) : value;
  return (
    FILTER_IDS.find((f) => f === id) ?? PRODUCT_IDS.find((f) => displayName(f).toLowerCase() === id?.toLowerCase())
  );
};

/** The entries to show for a filter: the product's, or every entry of a product still presented (paused products' old
    releases are not shown). */
export const visibleEntries = <T extends { product: string }>(
  entries: readonly T[],
  selected: FilterId | undefined,
): T[] =>
  entries.filter((e) => (selected ? e.product === selected : (FILTER_IDS as readonly string[]).includes(e.product)));

/** The address of a chip: the same page with `?produit=` set (or removed for everything). */
export function filterHref(search: string, id: FilterId | undefined): string {
  const params = new URLSearchParams(search);
  if (id) params.set(FILTER_PARAM, id);
  else params.delete(FILTER_PARAM);
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}
