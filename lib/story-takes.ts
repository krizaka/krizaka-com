/* The real takes of the products on /story: a recording of the product running on its dev site (a named demo persona,
   never admin), on the CDN under site/products/<product>/… (lib/cdn.ts, recorded in lib/cdn-manifest.json). The chapter
   shows its poster (a frame of the take, 9:16 for a phone, small and fixed) and the take plays on click, in a lightbox —
   never autoplayed, never in the text. A product with no take keeps its mini-visual (app/components/home/visuals).
   Structure only: the words are messages (site.story.products.take.*). */

import { cdn, onCdn } from "./cdn";
import type { TakeCues } from "./take-captions";
import type { ProductId } from "./products";

export interface Take {
  /** `film` is a 16:9 render (the engine's), `wide` the engine's own UI in a wide frame, `phone` a 9:16 recording. */
  ratio: "phone" | "wide" | "film";
  mp4: string;
  webm?: string;
  poster: string;
  /** The language the take is spoken in, when it exists in one only (the page says so for the other). */
  lang?: "en" | "fr";
  /** What the take says, line by line: [start, end] in seconds. The words are messages (site.story.products.take.captions.<id>, same count). */
  cues: TakeCues;
}

type Locale = "en" | "fr";

interface Paths {
  /** The logical paths, `{l}` standing for the page's language when the take exists in both. */
  mp4: string;
  webm?: string;
  poster: string;
}
interface Spec extends Paths {
  ratio: Take["ratio"];
  lang?: Take["lang"];
  /** The same take under other names in French (the French set predates the English one). */
  fr?: Paths;
  cues: TakeCues;
}

/* One take per chapter, chosen for what the chapter tells (story peer review, 2026-10-21):
   - orazaka: the web client on its dev site, the demo persona asking and the engine answering (2026-10-29: it replaces the Old
   Port scene, a generated clip that was not the product running); the others keep their recordings (a lease read, a shop's day). */
const SPECS: Partial<Record<ProductId, Spec>> = {
  orazaka: { ratio: "wide", mp4: "products/orazaka/home/take-{l}-dark.mp4", webm: "products/orazaka/home/take-{l}-dark.webm", poster: "products/orazaka/home/take-{l}-dark-poster.webp", cues: [[0, 9.5]] },
  yomizaka: { ratio: "phone", mp4: "products/yomizaka/tour/take-{l}.mp4", webm: "products/yomizaka/tour/take-{l}.webm", poster: "products/yomizaka/tour/story-poster-{l}.jpg", cues: [[0, 6], [6, 11], [11, 18.2]] },
  akinaza: { ratio: "phone", mp4: "products/akinaza/tour/hero-{l}.mp4", webm: "products/akinaza/tour/hero-{l}.webm", poster: "products/akinaza/tour/phone-hero-{l}.jpg", cues: [[0, 12], [12, 25], [25, 37], [37, 49.5]] },
};

/** The take of a product in the page's language, or null when none is recorded on the CDN (the chapter then keeps its mini-visual). */
export function takeOf(id: ProductId, locale: Locale): Take | null {
  const s = SPECS[id];
  if (!s) return null;
  const paths = (locale === "fr" && s.fr) || s;
  const path = (p: string) => p.replace("{l}", locale);
  const needed = [paths.mp4, paths.poster, ...(paths.webm ? [paths.webm] : [])].map(path);
  if (!needed.every(onCdn)) return null;
  return { ratio: s.ratio, lang: s.lang, mp4: cdn(path(paths.mp4)), webm: paths.webm ? cdn(path(paths.webm)) : undefined, poster: cdn(path(paths.poster)), cues: s.cues };
}

export const TAKE_PRODUCTS = Object.keys(SPECS) as ProductId[];
