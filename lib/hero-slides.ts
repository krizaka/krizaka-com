/* The hero's « Fig. 1 » is a carousel of realisations (krizaka-internal#2229, @krizaka/ui MediaCarousel). The slides are
   ONE array: a later pull request adds a line (Fig. 1b: Verikora's recording), never a component. A slide names its clip
   by the logical path of its files on the CDN (`<base>.webm|.mp4|.jpg`, recorded in lib/cdn-manifest.json): a slide whose
   clip the manifest does not know fails the build (lib/story-film.ts → cdn() throws, tests/hero-slides.test.mjs). A
   product's recording also names the journey that records it, so a clip nobody can re-run never ships. Never a placeholder
   and never an invented screen. The words (caption, what it shows, the play label) are messages:
   site.home.hero.slides.<id>. Since 2026-11-05 (krizaka-internal#2445) the home speaks to the property manager: Verikora's
   checked pay stub first, the brand film second. The hero shows them as two named tabs, never advancing by themselves. */

import { BRAND_FILM } from "./brand-film.ts";

/** What a slide plays: the brand film, or a product's journey recorded by its own e2e. */
export const SlideKind = { Film: "film", Recording: "recording" } as const;
export type SlideKind = (typeof SlideKind)[keyof typeof SlideKind];

/** The files a clip is recorded under, one of three kinds. */
export interface HeroSlideSpec {
  /** The slide's id, also the key of its words (site.home.hero.slides.<id>). */
  id: string;
  /** « 1a »: the figure's number, its caption starts « Fig. 1a ». */
  fig: string;
  /** `film`: the brand film. `recording`: a product's journey recorded by its own e2e. */
  kind: SlideKind;
  /** The logical path of the clip's files on the CDN. */
  base: string;
  /** The journey that records a `recording` (its id in the product repository's e2e). */
  journey?: string;
  /** The logical path of a silent loop (`<loop>.webm|.mp4|.jpg`) that previews the slide, muted, poster first. */
  loop?: string;
}

export const HERO_SLIDES = [
  {
    id: "applicant-file",
    fig: "1a",
    kind: SlideKind.Recording,
    base: "products/yomizaka/tour/applicant-file",
    journey: "applicant-file-open",
  },
  { id: "film", fig: "1b", kind: SlideKind.Film, base: BRAND_FILM.base, loop: BRAND_FILM.loop },
] as const satisfies readonly HeroSlideSpec[];

const EXTENSIONS = ["webm", "mp4", "jpg"] as const;

const slideProblems = (s: HeroSlideSpec, has: (path: string) => boolean): string[] => {
  const missing = [s.base, ...(s.loop ? [s.loop] : [])]
    .flatMap((base) => EXTENSIONS.map((ext) => `${base}.${ext}`))
    .filter((path) => !has(path))
    .map((path) => `${s.id}: ${path} is not in the CDN manifest`);
  const unjourneyed =
    s.kind === SlideKind.Recording && !s.journey?.trim() ? [`${s.id}: a recording names its journey`] : [];
  return [...missing, ...unjourneyed];
};

/** What is wrong with the slides, as sentences (empty: fine). `has` is lib/cdn.ts's onCdn. */
export function heroSlideProblems(slides: readonly HeroSlideSpec[], has: (path: string) => boolean): string[] {
  const ids = slides.map((s) => s.id);
  const twice = ids.filter((id, i) => ids.indexOf(id) !== i).map((id) => `${id}: the id is used twice`);
  return [...slides.flatMap((s) => slideProblems(s, has)), ...twice];
}
