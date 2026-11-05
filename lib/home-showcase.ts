/* The home's carousels (krizaka-internal#2450, founder 2026-11-05): the hero's, then one per product — Verikora, Sovkora
   in the centre, Folioviv. Their storyboard is content/films/home-showcase.json (the shots cut from the founder's reels and
   widened to 16:9 by Runway Aleph, the 16:9 clips Sovkora generated, the brand film, the company media library), rendered
   by scripts/home-showcase.mjs and uploaded with scripts/cdn-assets.mjs under home/showcase/<carousel>/. Each slide has two
   renditions: `wide` (16:9, 1280x720) for tablets and desktops, `tall` (4:5, 544x680, lighter) for phones, each with its
   poster: the browser loads only one (lib/cdn.ts resolves both, the carousel picks by the viewport). A slide whose files
   the manifest does not know fails the build (tests/home-showcase.test.mjs). The words (caption, alt) are messages:
   site.home.showcase.slides.<carousel>.<id>. */

import board from "../content/films/home-showcase.json" with { type: "json" };

export const SHOWCASES = ["hero", "verikora", "sovkora", "folioviv"] as const;
export type Showcase = (typeof SHOWCASES)[number];
/** The products' carousels, in the page's order: Sovkora in the centre (founder, 2026-11-05). */
export const PRODUCT_SHOWCASES = ["verikora", "sovkora", "folioviv"] as const satisfies readonly Showcase[];
export type ProductShowcase = (typeof PRODUCT_SHOWCASES)[number];

/** Where a slide comes from: a reel's take widened by Runway, a 16:9 clip, or a clip of the company media library (whose
 *  public use waits on the founder's assignment to the company, annex B: the PR that ships one says so). */
export const SlideSource = { Reel: "reel", Clip: "clip", Library: "library" } as const;
export type SlideSource = (typeof SlideSource)[keyof typeof SlideSource];

export interface ShowcaseSlideSpec {
  id: string;
  carousel: Showcase;
  source: SlideSource;
  /** The logical bases of the two renditions on the CDN (`<base>.mp4|.webm|.jpg`). */
  wide: string;
  tall: string;
  /** True for the brand film's slide: it leads to the film's watch page. */
  film: boolean;
}

interface BoardItem {
  id: string;
  library?: boolean;
  film?: boolean;
}
interface BoardCarousel {
  order: string[];
  shots: BoardItem[];
  clips: BoardItem[];
}

/** The logical base of a rendition of a slide. */
export const renditionBase = (carousel: string, id: string, kind: "wide" | "tall") =>
  `home/showcase/${carousel}/${id}-${kind}`;

/** The slides of a carousel, in their order. */
export function showcaseSlides(carousel: Showcase): ShowcaseSlideSpec[] {
  const c = (board.carousels as Record<Showcase, BoardCarousel>)[carousel];
  return c.order.map((id) => {
    const shot = c.shots.find((s) => s.id === id);
    const clip = c.clips.find((s) => s.id === id);
    const item = shot ?? clip;
    if (!item) {
      throw new Error(`${carousel}/${id}: in the order, not in the storyboard`);
    }
    let source: SlideSource = SlideSource.Clip;
    if (shot) {
      source = SlideSource.Reel;
    } else if (clip?.library) {
      source = SlideSource.Library;
    }
    return {
      id,
      carousel,
      source,
      wide: renditionBase(carousel, id, "wide"),
      tall: renditionBase(carousel, id, "tall"),
      film: Boolean(item.film),
    };
  });
}

const EXTENSIONS = ["mp4", "webm", "jpg"] as const;

/** The six files of a slide: both renditions, each as mp4, webm and its poster. */
const filesOf = (s: ShowcaseSlideSpec): string[] =>
  [s.wide, s.tall].flatMap((base) => EXTENSIONS.map((ext) => `${base}.${ext}`));

/** What is wrong with the carousels, as sentences (empty: fine). `has` is lib/cdn.ts's onCdn. */
export function showcaseProblems(has: (path: string) => boolean): string[] {
  return SHOWCASES.flatMap((carousel) => {
    const slides = showcaseSlides(carousel);
    const ids = slides.map((s) => s.id);
    const twice = ids.filter((id, i) => ids.indexOf(id) !== i).map((id) => `${carousel}/${id}: twice in the order`);
    const few = slides.length < 3 ? [`${carousel}: a carousel has at least three slides`] : [];
    const missing = slides.flatMap((s) =>
      filesOf(s)
        .filter((path) => !has(path))
        .map((path) => `${carousel}/${s.id}: ${path} is not in the CDN manifest`),
    );
    return [...twice, ...few, ...missing];
  });
}

/** The carousel of a product, by its public name (Verikora → verikora); undefined for a product without one. */
export function showcaseOf(name: string): ProductShowcase | undefined {
  const key = name.toLowerCase();
  return (PRODUCT_SHOWCASES as readonly string[]).includes(key) ? (key as ProductShowcase) : undefined;
}
