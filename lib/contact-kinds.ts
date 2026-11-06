/* The kinds and the products of the contact form, and the old names kept so every link already written keeps working
   (`/contact?topic=yomizaka`, a message posted by a page loaded before the kinds existed). Data and two lookups, nothing else:
   a product is known by its commercial id (verikora, folioviv, sovkora, kridoc, blocks); the code names and the old topics are aliases. */

/* What a message is (the founder's rule of 2026-11-06: no Krizaka address is public, « Support » is a kind of this form, so each
   received message says what it is): support for a product in use, business (enterprise, partnership), anything else. */
export const CONTACT_KINDS = ["support", "business", "other"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];

/* What it is about, by COMMERCIAL id (the building blocks are the stack's libraries). */
export const CONTACT_PRODUCTS = ["verikora", "folioviv", "sovkora", "kridoc", "blocks"] as const;
export type ContactProduct = (typeof CONTACT_PRODUCTS)[number];

/** The kind and the product a link or a page implies; each is null when it implies none. */
export interface ContactPreset {
  kind: ContactKind | null;
  product: ContactProduct | null;
}

/** Every spelling of a product, by its commercial id: the id itself, its code name (id kept by repositories and old links). */
const PRODUCT_ALIASES: Record<string, ContactProduct> = {
  verikora: "verikora",
  yomizaka: "verikora",
  folioviv: "folioviv",
  akinaza: "folioviv",
  sovkora: "sovkora",
  orazaka: "sovkora",
  kridoc: "kridoc",
  kachizaka: "kridoc",
  blocks: "blocks",
};

/** The topics of the form before the kinds: a product, or a kind of its own. */
const LEGACY_KIND: Record<string, ContactKind> = { enterprise: "business", partnership: "business", other: "other" };

/** A product by any of its names, or null. */
export function productOf(value: unknown): ContactProduct | null {
  return typeof value === "string" ? (PRODUCT_ALIASES[value] ?? null) : null;
}

/** An old `topic` as a preset: a product topic names the product (no kind), enterprise and partnership are business. */
export function legacyPreset(topic: unknown): ContactPreset | null {
  if (typeof topic !== "string") return null;
  if (topic in LEGACY_KIND) return { kind: LEGACY_KIND[topic], product: null };
  const product = productOf(topic);
  return product ? { kind: null, product } : null;
}
