/* Where Krizaka is going: now / next / later, no dates, no promise. « Now » is read from the products' honest statuses
   (lib/products.ts); « next » and « later » are the founder's stated order (the words are messages,
   site.home.direction.steps.<id>). */

import type { Product } from "./products.ts";

export const DIRECTION_STEPS = ["now", "next", "later"] as const;
export type DirectionStep = (typeof DIRECTION_STEPS)[number];

/** The products being built today, each with its status: what « now » says, never typed. */
export const nowProducts = (products: readonly Product[]): Pick<Product, "id" | "name" | "status">[] => products.map(({ id, name, status }) => ({ id, name, status }));
