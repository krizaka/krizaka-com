/* The products' public domains. Each product owns <product>.com: www.<product>.com is its public address (the real app
   of the product's own deployment, sign-up closed), the apex answers 308 with www, and dev.<product>.com is the
   development host — not indexed, sending its pages to www, never linked from a public page (krizaka-com AGENTS.md §2.4,
   epic krizaka/.github#119). Pure: tests and scripts share it. */

export const PRODUCT_IDS = ["orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const wwwHost = (id: ProductId) => `www.${id}.com`;
export const wwwUrl = (id: ProductId) => `https://${wwwHost(id)}`;
