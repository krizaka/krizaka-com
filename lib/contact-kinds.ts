/* The kinds and the products of the contact form, and the old names kept so every link already written keeps working
   (`/contact?topic=yomizaka`, a message posted by a page loaded before the kinds existed). Data and two lookups, nothing else:
   a product is known by its commercial id (verikora, folioviv, sovkora, kridoc, blocks); the retired code names (from @krizaka/org) and the old topics are aliases. */

import { CODE_NAMES } from "@krizaka/org";

/* What a message is (the founder's rule of 2026-11-06: no Krizaka address is public, « Support » is a kind of this form, so each
   received message says what it is): support for a product in use, business (enterprise, partnership), anything else. */
export const CONTACT_KINDS = ["support", "business", "other"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];

/* What it is about, by COMMERCIAL id (the building blocks are the stack's libraries). */
/** In the home's order (PRODUCT_ORDER), then the products in design, then the building blocks (tests/contact-order.test.mjs). */
export const CONTACT_PRODUCTS = ["sovkora", "verikora", "folioviv", "kridoc", "blocks"] as const;
export type ContactProduct = (typeof CONTACT_PRODUCTS)[number];

/** The kind and the product a link or a page implies; each is null when it implies none. */
export interface ContactPreset {
  kind: ContactKind | null;
  product: ContactProduct | null;
}

/** A product's commercial id from any of its names: the id itself, or a retired code name that old links and repositories
    still carry (`CODE_NAMES` of @krizaka/org: accepted, never produced). */
const commercialId = (value: string): string => CODE_NAMES[value.toLowerCase()] ?? value;

/** The topics of the form before the kinds: a product, or a kind of its own. */
const LEGACY_KIND: Record<string, ContactKind> = { enterprise: "business", partnership: "business", other: "other" };

/** A product by any of its names, or null. */
export function productOf(value: unknown): ContactProduct | null {
  if (typeof value !== "string") {
    return null;
  }
  const id = commercialId(value);
  return CONTACT_PRODUCTS.find((p) => p === id) ?? null;
}

/** An old `topic` as a preset: a product topic names the product (no kind), enterprise and partnership are business. */
export function legacyPreset(topic: unknown): ContactPreset | null {
  if (typeof topic !== "string") return null;
  if (topic in LEGACY_KIND) return { kind: LEGACY_KIND[topic], product: null };
  const product = productOf(topic);
  return product ? { kind: null, product } : null;
}
