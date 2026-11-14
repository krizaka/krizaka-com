/* A product's status, read from the org data (`org.products` of @krizaka/org): the site never types one. Pure, so the
   tests and the build scripts share it (scripts/dev-preview-lib.mjs `readProductStatuses` reads the same data). */

import type { ProductStatus } from "@krizaka/org";

/** Products the org data does not carry yet (founder, 2026-11-14, krizaka-internal#3559): @krizaka/org 1.3.0 lists Kridoc as a
 *  brand (`service`) and not in `org.products`, so its status cannot be read from there. The entry is a time-boxed waiver, not a
 *  second source: `tests/kridoc-product.test.mjs` fails the day the org lists it, and the entry then goes. */
export const ORG_PENDING: readonly { id: string; status: ProductStatus }[] = [{ id: "kridoc", status: "development" }];

/** The status the org data gives a product; a product the org does not carry is an error, never a default. */
export function statusOf(products: readonly { id: string; status: ProductStatus }[], id: string): ProductStatus {
  const found = products.find((p) => p.id === id);
  if (!found) throw new Error(`@krizaka/org carries no product "${id}": its status cannot be read`);
  return found.status;
}
