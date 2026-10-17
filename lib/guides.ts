/* The guides (search plan 2026-10, ~/Documents/krizaka/04_STRATEGIE_ANNEE_1_ET_ROADMAP/seo-family-2026-10.md): pages that
   answer what people search — on-premise AI in Montréal, AI under Québec's Law 25 — in the words of what really runs.
   Here the structure (slug, hue, where the call to action leads); the words are messages, site.guides.pages.<slug>. */

export const GUIDES = [
  { slug: "on-premise-ai-montreal", hue: "cobalt", product: "orazaka", topic: "orazaka" },
  { slug: "law-25-ai", hue: "indigo", product: "orazaka", topic: "orazaka" },
] as const;

export type GuideSlug = (typeof GUIDES)[number]["slug"];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);

/** Where a guide's second action leads: the product's own site (never a page of krizaka.com). */
export const GUIDE_PRODUCT_URL = { orazaka: "https://dev.orazaka.com" } as const;
