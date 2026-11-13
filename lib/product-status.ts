/* A product's status, read from the org data (`org.products` of @krizaka/org): the site never types one. Pure, so the
   tests and the build scripts share it (scripts/dev-preview-lib.mjs `readProductStatuses` reads the same data). */

import type { ProductStatus } from "@krizaka/org";

/** The status the org data gives a product; a product the org does not carry is an error, never a default. */
export function statusOf(products: readonly { id: string; status: ProductStatus }[], id: string): ProductStatus {
  const found = products.find((p) => p.id === id);
  if (!found) throw new Error(`@krizaka/org carries no product "${id}": its status cannot be read`);
  return found.status;
}
