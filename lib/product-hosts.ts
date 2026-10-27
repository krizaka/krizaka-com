/* The products' public domains. Each product owns <product>.com: www.<product>.com is its public address (the real app
   of the product's own deployment, sign-up closed), the apex answers 308 with www, and dev.<product>.com is the
   development host — not indexed (krizaka-com AGENTS.md §2.4, epic krizaka/.github#119). The products are in development
   and not open to the public: krizaka.com's cards name and link the dev site and show the version it runs (Oussama,
   2026-10-26); the sitemap, JSON-LD and the nav keep the www address. Pure: tests and scripts share it. */

export const PRODUCT_IDS = ["orazaka", "yomizaka", "akinaza"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const wwwHost = (id: ProductId) => `www.${id}.com`;
export const wwwUrl = (id: ProductId) => `https://${wwwHost(id)}`;
export const devHost = (id: ProductId) => `dev.${id}.com`;
export const devUrl = (id: ProductId) => `https://${devHost(id)}`;
