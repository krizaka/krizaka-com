/* The manifests of the products (lib/product-manifests.json, committed — scripts/gen-product-manifests.mjs) bound to
   the pure rules of lib/product-stack.ts. A static JSON import: safe in server and client modules. */

import snapshot from "./product-manifests.json";
import { kitsOf, stackRows, type ProductManifests } from "./product-stack";

export const PRODUCT_MANIFESTS = snapshot.products as ProductManifests;
/** The date the manifests were read on GitHub (YYYY-MM-DD). */
export const MANIFESTS_READ_AT = snapshot.readAt;

export const productStackRows = (ids: readonly string[]) => stackRows(ids, PRODUCT_MANIFESTS);
export const productKits = (id: string) => kitsOf(id, PRODUCT_MANIFESTS);
