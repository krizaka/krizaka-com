/* "Our story" — the structure of /story. Krizaka is the studio that tells it: it forges the platform (the open building
   blocks), Orazaka is the engine, and the products run on both. Every text lives in messages/<locale>.json under
   site.story; this module keeps structure only.

   - The products come from lib/products.ts (the one list of the site, with their release state): the story's stages
     pick them by role below, and the roster is whatever is left — a product added there appears on the page by itself.
   - Every figure is computed (the registries, the generated data): none is typed here. */

export { KITS, KIT_PACKAGES, type KitId } from "./product-stack";
import { PRODUCTS, type ProductId } from "./products";
import { BLOG_URL } from "./site";

/** The engine: the product the others are powered by (stage 03). */
export const ENGINE: ProductId = "orazaka";

/** What the engine proves first (stage 04): a Québec firm's documents (Yomizaka). */
export const PROVES_FIRST: readonly ProductId[] = ["yomizaka"];

/** The rest of the roster (stage 05): every other product of lib/products.ts, in its order. */
export const ROSTER: readonly ProductId[] = PRODUCTS.map((p) => p.id).filter((id) => id !== ENGINE && !PROVES_FIRST.includes(id));

/** The chapters of /story, in reading order (anchors and the sticky contents): who we are, the engine, each product
 *  (the first proofs, then the rest of the roster), the open stack, what is next. A product added to lib/products.ts
 *  gets its chapter by itself. */
export const PRODUCT_CHAPTERS: readonly ProductId[] = [...PROVES_FIRST, ...ROSTER];
export const STORY_ANCHORS = ["who", "engine", ...PRODUCT_CHAPTERS, "open", "next"] as const;

/** The bird each chapter wears, from the cast of the film (the brand reference, « Référence : les personnages et le
 *  discours »): one promise per subject, never the same bird twice on the page. */
export type StoryBird = "falcon" | "owl" | "duck" | "flamingo" | "pigeon" | "lovebird" | "crane" | "magpie" | "beaver";
export const PRODUCT_BIRD: Record<ProductId, StoryBird> = {
  orazaka: "flamingo",
  yomizaka: "owl",
  akinaza: "beaver",
};
/** The bird Orazaka wears on its tag on the home (2026-10-30): the duck builds. The story page and the flock keep the flamingo
 *  (PRODUCT_BIRD): there the duck is the open-source subject's. */
export const ENGINE_TAG_BIRD: StoryBird = "duck";
export const WHO_BIRD: StoryBird = "falcon";
export const OPEN_BIRD: StoryBird = "duck";

/** The blog chapter that tells each part of the story in full (blog.krizaka.com/story/<slug>, in each language). The words
 *  are messages (site.story.blog.<anchor>, the chapter's own title). */
export const BLOG_CHAPTER = {
  who: "why-krizaka",
  engine: "an-engine-on-a-laptop",
  yomizaka: "the-first-products",
  akinaza: "the-first-products",
  open: "one-interface-everywhere",
  next: "building-with-agents",
} as const;

const BLOG_PREFIX = { en: "", fr: "/fr" } as const;

/** The address of a blog chapter in the page's language. */
export function blogChapterUrl(slug: string, locale: keyof typeof BLOG_PREFIX): string {
  return `${BLOG_URL}${BLOG_PREFIX[locale]}/story/${slug}/`;
}
