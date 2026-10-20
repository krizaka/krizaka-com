/* The real takes of the products on /story: a recording of the product running on its dev site (a named demo persona,
   never admin), on the CDN under site/products/<product>/… (lib/cdn.ts, recorded in lib/cdn-manifest.json). The chapter
   shows its poster (a frame of the take, 9:16 for a phone, small and fixed) and the take plays on click, in a lightbox —
   never autoplayed, never in the text. A product with no take keeps its mini-visual (app/components/home/visuals).
   Structure only: the words are messages (site.story.products.take.*). */

import { cdn, onCdn } from "./cdn";
import type { ProductId } from "./products";

export interface Take {
  ratio: "phone" | "wide";
  mp4: string;
  webm?: string;
  poster: string;
  /** The language the take is spoken in, when it exists in one only (the page says so for the other). */
  lang?: "en" | "fr";
}

type Locale = "en" | "fr";

interface Spec {
  ratio: Take["ratio"];
  lang?: Take["lang"];
  /** The logical paths, `{l}` standing for the page's language when the take exists in both. */
  mp4: string;
  webm?: string;
  poster: string;
}

const SPECS: Partial<Record<ProductId, Spec>> = {
  orazaka: { ratio: "wide", mp4: "products/orazaka/home/take-{l}-dark.mp4", webm: "products/orazaka/home/take-{l}-dark.webm", poster: "products/orazaka/home/take-{l}-dark-poster.webp" },
  yomizaka: { ratio: "phone", mp4: "products/yomizaka/tour/take-{l}.mp4", webm: "products/yomizaka/tour/take-{l}.webm", poster: "products/yomizaka/tour/story-poster-{l}.jpg" },
  orochia: { ratio: "phone", mp4: "products/orochia/tour/{l}/home-phone.mp4", webm: "products/orochia/tour/{l}/home-phone.webm", poster: "products/orochia/tour/{l}/home-phone.jpg" },
  kachizaka: { ratio: "phone", lang: "fr", mp4: "products/kachizaka/tour/journey.mp4", poster: "products/kachizaka/tour/story-poster.jpg" },
  akinaza: { ratio: "phone", mp4: "products/akinaza/tour/hero-{l}.mp4", webm: "products/akinaza/tour/hero-{l}.webm", poster: "products/akinaza/tour/phone-hero-{l}.jpg" },
  yasakia: { ratio: "phone", lang: "fr", mp4: "products/yasakia/tour/take-full.mp4", webm: "products/yasakia/tour/take-full.webm", poster: "products/yasakia/tour/take-full.jpg" },
  yororis: { ratio: "phone", lang: "fr", mp4: "products/yororis/tour/moment-fr-phone.mp4", poster: "products/yororis/tour/moment-fr-phone.jpg" },
};

/** The take of a product in the page's language, or null when none is recorded on the CDN (the chapter then keeps its mini-visual). */
export function takeOf(id: ProductId, locale: Locale): Take | null {
  const s = SPECS[id];
  if (!s) return null;
  const path = (p: string) => p.replace("{l}", locale);
  const needed = [s.mp4, s.poster, ...(s.webm ? [s.webm] : [])].map(path);
  if (!needed.every(onCdn)) return null;
  return { ratio: s.ratio, lang: s.lang, mp4: cdn(path(s.mp4)), webm: s.webm ? cdn(path(s.webm)) : undefined, poster: cdn(path(s.poster)) };
}

export const TAKE_PRODUCTS = Object.keys(SPECS) as ProductId[];
