/* The clips of /story (founder, 2026-11-06, krizaka-internal#2800: « on vend une émotion, on laisse voir une émotion »).
   A chapter that has one shows a clip of the home's carousels: the feeling of the chapter, never an explanation (the
   diagrams and the products' screen recordings sit one step deeper, in the chapter's fold).

   A clip is a live slide of its carousel: in the storyboard's `order` (content/films/home-showcase.json), so it passed
   scripts/check-showcase-media.mjs (a clean 16:9, no pillarbox, no end card held). A retired or unknown slide is refused,
   and so is a slide whose files the CDN manifest does not know: the page throws at build. Its caption and its text
   alternative are the carousel's own messages (site.home.showcase.slides.<carousel>.<id>): one source for both pages.
   No generation for this page: only the clips we already have.

   Two chapters have none, on purpose (krizaka-internal#2800): the name (its shots, the blue ink and the feather on the
   notebook, are retired from the hero's carousel) and how we work (no live clip shows the work itself). */

import { renditionBase, showcaseSlides, type Showcase } from "./home-showcase.ts";
import type { STORY_ANCHORS } from "./story.ts";

type Anchor = (typeof STORY_ANCHORS)[number];

/** A slide of a home carousel, by its carousel and its id. */
export interface ClipRef {
  carousel: Showcase;
  id: string;
}

/** The clip of each chapter that has one, and the feeling it carries. */
export const STORY_CLIPS = {
  /** The brand film's loop, « Montrer son travail »: the owl, the beaver and the duck at work. It shows its work. */
  who: { carousel: "hero", id: "film" },
  /** Mint tea poured from high, generated with Sovkora: the AI that stays home welcomes you, and it made this shot. */
  engine: { carousel: "sovkora", id: "tea" },
  /** A hand signs the sheet with a feather pen, in window light: calm, because it was read first. */
  verikora: { carousel: "verikora", id: "signature" },
  /** A father carries his child along the canal at golden hour: the books are done, you get home on time. */
  folioviv: { carousel: "folioviv", id: "home" },
  /** The pigeon takes off over the rail yard: it delivers, every time (the chapter's own bird). */
  open: { carousel: "sovkora", id: "pigeon" },
  /** Dawn over the river and Mont Royal, a flight of birds: a new day, the flock setting off together. */
  next: { carousel: "hero", id: "river" },
} as const satisfies Partial<Record<Anchor, ClipRef>>;

export type ClipChapter = keyof typeof STORY_CLIPS;

/** The clip of a chapter, or undefined for a chapter that has none. */
export const clipOf = (chapter: string): ClipRef | undefined =>
  (STORY_CLIPS as Partial<Record<string, ClipRef>>)[chapter];

/** The logical base of a clip's 16:9 rendition on the CDN (`<base>.mp4|.webm|.jpg`). */
export const clipBase = (clip: ClipRef): string => renditionBase(clip.carousel, clip.id);

/** What is wrong with the story's clips, as sentences (empty: fine). `has` is lib/cdn.ts's onCdn. */
export function storyClipProblems(has: (path: string) => boolean): string[] {
  return Object.entries(STORY_CLIPS).flatMap(([chapter, clip]: [string, ClipRef]) => {
    const live = showcaseSlides(clip.carousel).some((s) => s.id === clip.id);
    if (!live) {
      return [`${chapter}: ${clip.carousel}/${clip.id} is not a live slide of its carousel (retired or unknown)`];
    }
    return ["mp4", "webm", "jpg"]
      .map((ext) => `${clipBase(clip)}.${ext}`)
      .filter((path) => !has(path))
      .map((path) => `${chapter}: ${path} is not in the CDN manifest`);
  });
}
