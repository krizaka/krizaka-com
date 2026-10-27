/* The products' public domains. Each product owns <product>.com: www.<product>.com is its public address (the real app
   of the product's own deployment, sign-up closed), the apex answers 308 with www. dev.<product>.com is the development
   environment, exposed as production on www and only redirecting there (Oussama, 2026-10-26): every link, the healthz
   read at build and the sitemap use www (krizaka-com AGENTS.md §2.4, epic krizaka/.github#119). Pure: tests and scripts share it. */

export const PRODUCT_IDS = ["orazaka", "yomizaka", "akinaza"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const wwwHost = (id: ProductId) => `www.${id}.com`;
export const wwwUrl = (id: ProductId) => `https://${wwwHost(id)}`;
