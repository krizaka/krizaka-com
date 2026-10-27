/* The version each product's dev site runs, read at build time from its /api/healthz (scripts/gen-dev-versions.mjs →
   git-ignored lib/dev-versions.json). Never typed here: when the dev site could not be reached and no earlier value exists,
   the page shows no version. */

import file from "./dev-versions.json";
import type { ProductId } from "./product-hosts";

const read = file as { versions?: Partial<Record<ProductId, string>> };

/** The version a product's dev site reported at build, or undefined. */
export const devVersion = (id: ProductId): string | undefined => read.versions?.[id];
