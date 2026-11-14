/* "Our story" — the structure of /story. Krizaka is the studio that tells it: it forges the platform (the open building
   blocks), Sovkora is the engine, and the products run on both. Every text lives in messages/<locale>.json under
   site.story; this module keeps structure only.

   - The products come from lib/products.ts (the one list of the site, with their release state): the story's stages
     pick them by role below, and the roster is whatever is left — a product added there appears on the page by itself.
   - Every figure is computed (the registries, the generated data): none is typed here. */

export { KITS, KIT_PACKAGES, type KitId } from "./product-stack";
import { PRODUCTS, type ProductId } from "./products";

/** Kridoc has no chapter yet: its repository is private and nothing of it is told (krizaka-internal#3559). It is on the
 *  status board and everywhere else PRODUCTS feeds. */
const NOT_IN_STORY: readonly ProductId[] = ["kridoc"];
export type StoryProductId = Exclude<ProductId, "kridoc">;

/** The engine: the product the others are powered by (stage 03). */
export const ENGINE = "sovkora" satisfies StoryProductId;

/** What the engine proves first (stage 04): a Québec firm's documents (Verikora). */
export const PROVES_FIRST: readonly StoryProductId[] = ["verikora"];

/** The rest of the roster (stage 05): every other product of lib/products.ts, in its order. */
export const ROSTER: readonly StoryProductId[] = PRODUCTS.map((p) => p.id).filter(
  (id): id is StoryProductId =>
    id !== ENGINE && !(PROVES_FIRST as readonly ProductId[]).includes(id) && !NOT_IN_STORY.includes(id),
);

/** The chapters of /story, in reading order (anchors and the sticky contents): who we are, where the name comes from,
 *  how we work (founder, 2026-11-06), the engine, each product (the first proofs, then the rest of the roster), the
 *  open stack, what is next. A product added to lib/products.ts gets its chapter by itself. */
export const PRODUCT_CHAPTERS: readonly StoryProductId[] = [...PROVES_FIRST, ...ROSTER];
/** The company's own chapters, before the engine: not a product, no brand. */
export const COMPANY_CHAPTERS = ["who", "name", "work"] as const;
export const STORY_ANCHORS = [...COMPANY_CHAPTERS, "engine", ...PRODUCT_CHAPTERS, "open", "next"] as const;

/** How a change travels, in order (the « how we work » chapter's text version and its drawing): the board, a lane per
 *  product, the pull request, the train, the matrix. Words: site.story.work.steps.<id>. Facts from krizaka-agents' README. */
export const WORK_STEPS = ["board", "lane", "pr", "train", "matrix"] as const;

/** The bird each chapter wears, from the cast of the film (the brand reference, « Référence : les personnages et le
 *  discours »): one promise per subject, never the same bird twice on the page. */
export type StoryBird = "falcon" | "owl" | "duck" | "flamingo" | "pigeon" | "lovebird" | "crane" | "magpie" | "beaver";
export const PRODUCT_BIRD: Record<StoryProductId, StoryBird> = {
  sovkora: "duck",
  verikora: "owl",
  folioviv: "beaver",
};
export const WHO_BIRD: StoryBird = "falcon";
export const OPEN_BIRD: StoryBird = "pigeon";
