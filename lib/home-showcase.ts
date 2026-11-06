/* The home's carousels (krizaka-internal#2450, founder 2026-11-05): the hero's, then one per product — Verikora, Sovkora
   in the centre, Folioviv. Their storyboard is content/films/home-showcase.json (the shots cut from the founder's reels and
   widened to 16:9 by Runway Aleph, the 16:9 clips Sovkora generated, the brand film, the company media library), rendered
   by scripts/home-showcase.mjs and uploaded with scripts/cdn-assets.mjs under home/showcase/<carousel>/. Every screen, the
   phone included, shows the 16:9 rendition (`wide`, 1280x720, object-fit: cover): no vertical anywhere (founder,
   2026-11-05). A slide whose files the manifest does not know fails the build (tests/home-showcase.test.mjs); a slide
   whose real file is not a clean 16:9 (pillarbox, end card held on screen) is `retired` in the storyboard, out of the
   order, until it is remade (scripts/check-showcase-media.mjs reads the real files). The words (caption, alt) are messages:
   site.home.showcase.slides.<carousel>.<id>. */

import board from "../content/films/home-showcase.json" with { type: "json" };

export const SHOWCASES = ["hero", "verikora", "sovkora", "folioviv"] as const;
export type Showcase = (typeof SHOWCASES)[number];
/** The products' carousels, in the page's order: Sovkora in the centre (founder, 2026-11-05). */
export const PRODUCT_SHOWCASES = ["verikora", "sovkora", "folioviv"] as const satisfies readonly Showcase[];
export type ProductShowcase = (typeof PRODUCT_SHOWCASES)[number];

/** Where a slide comes from: a reel's take widened by Runway, a 16:9 clip, or a clip of the company media library (whose
 *  public use waits on the founder's assignment to the company, annex B: the PR that ships one says so). */
export const SlideSource = { Reel: "reel", Clip: "clip", Library: "library", Generated: "generated" } as const;
export type SlideSource = (typeof SlideSource)[keyof typeof SlideSource];

export interface ShowcaseSlideSpec {
  id: string;
  carousel: Showcase;
  source: SlideSource;
  /** The logical base of the 16:9 rendition on the CDN (`<base>.mp4|.webm|.jpg`). */
  wide: string;
  /** True when the clip carries an audio track (none does today: Runway's outputs are silent). */
  audio: boolean;
  /** True for the brand film's slide: it leads to the film's watch page. */
  film: boolean;
}

interface BoardItem {
  id: string;
  /** A generated clip of a product: the rule of its catalogue it shows (krizaka-internal#2658). */
  rule?: string;
  library?: boolean;
  film?: boolean;
  audio?: boolean;
}
interface BoardCarousel {
  order: string[];
  shots: BoardItem[];
  clips: BoardItem[];
  generated?: BoardItem[];
}

/** The logical base of a rendition of a slide. */
export const renditionBase = (carousel: string, id: string) => `home/showcase/${carousel}/${id}-wide`;

/** The slides of a carousel, in their order. */
export function showcaseSlides(carousel: Showcase): ShowcaseSlideSpec[] {
  const c = (board.carousels as Record<Showcase, BoardCarousel>)[carousel];
  return c.order.map((id) => {
    const shot = c.shots.find((s) => s.id === id);
    const clip = c.clips.find((s) => s.id === id);
    const made = c.generated?.find((s) => s.id === id);
    const item = shot ?? clip ?? made;
    if (!item) {
      throw new Error(`${carousel}/${id}: in the order, not in the storyboard`);
    }
    let source: SlideSource = SlideSource.Clip;
    if (shot) {
      source = SlideSource.Reel;
    } else if (made) {
      source = SlideSource.Generated;
    } else if (clip?.library) {
      source = SlideSource.Library;
    }
    return {
      id,
      carousel,
      source,
      wide: renditionBase(carousel, id),
      audio: Boolean(item.audio),
      film: Boolean(item.film),
    };
  });
}

const EXTENSIONS = ["mp4", "webm", "jpg"] as const;

/** The three files of a slide: its 16:9 rendition as mp4, webm and its poster. */
const filesOf = (s: ShowcaseSlideSpec): string[] => EXTENSIONS.map((ext) => `${s.wide}.${ext}`);

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
