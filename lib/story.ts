/* "Our story" — the structure of /story. Krizaka is the studio that tells it: it forges the platform (the open building
   blocks), Orazaka is the engine, and the products run on both. Every text lives in messages/<locale>.json under
   site.story; this module keeps structure only.

   - The products come from lib/products.ts (the one list of the site, with their release state): the story's stages
     pick them by role below, and the roster is whatever is left — a product added there appears on the page by itself.
   - Every figure is computed (the registries, the generated data): none is typed here. */

export { KITS, KIT_PACKAGES, type KitId } from "./product-stack";
import { PRODUCTS, type ProductId } from "./products";

/** The engine: the product the others are powered by (stage 03). */
export const ENGINE: ProductId = "orazaka";

/** What the engine proves first (stage 04): a Québec firm's documents (Yomizaka) and the media craft (Orochia). */
export const PROVES_FIRST: readonly ProductId[] = ["yomizaka", "orochia"];

/** The rest of the roster (stage 05): every other product of lib/products.ts, in its order. */
export const ROSTER: readonly ProductId[] = PRODUCTS.map((p) => p.id).filter((id) => id !== ENGINE && !PROVES_FIRST.includes(id));
