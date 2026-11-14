/* The home's carousels (krizaka-internal#2450, founder 2026-11-05): the hero's, then one per product — Verikora, Sovkora
   in the centre, Folioviv. Their storyboard is content/films/home-showcase.json (the shots cut from the founder's reels and
   widened to 16:9 by Runway Aleph, the 16:9 clips Sovkora generated, the brand film, the company media library), rendered
   by scripts/home-showcase.mjs and uploaded with scripts/cdn-assets.mjs under home/showcase/<carousel>/. Every screen, the
   phone included, shows the 16:9 rendition (`wide`, 1280x720, object-fit: cover): no vertical anywhere (founder,
   2026-11-05). A slide whose files the manifest does not know fails the build (tests/home-showcase.test.mjs); a slide
   whose real file is not a clean 16:9 (pillarbox, end card held on screen) is `retired` in the storyboard, out of the
   order, until it is remade (scripts/check-showcase-media.mjs reads the real files). The words (caption, alt) are messages:
   site.home.showcase.slides.<carousel>.<id>.
   A slide may also be a finished film played whole with its sound (krizaka-internal#2837, founder 2026-11-07: the Sovkora
   trailer is the hero's first slide and Sovkora's): « films » of the storyboard, its full cut, a lighter cut for phones and
   its poster under products/<product>/films/; its words are site.home.films.<id>, its transcript in the text version.
   No product shows a mood photo any more: Kridoc, the last one, is a row like the others (krizaka-internal#3559). */

import board from "../content/films/home-showcase.json" with { type: "json" };

export const SHOWCASES = ["hero", "verikora", "sovkora", "folioviv"] as const;
export type Showcase = (typeof SHOWCASES)[number];

/** Where a slide comes from: a reel's take widened by Runway, a 16:9 clip, a clip of the company media library (whose
 *  public use waits on the founder's assignment to the company, annex B: the PR that ships one says so), or a finished film. */
export const SlideSource = { Reel: "reel", Clip: "clip", Library: "library", Film: "film" } as const;
export type SlideSource = (typeof SlideSource)[keyof typeof SlideSource];

// @fixed: the screens that get a film's lighter cut, the phones (the hero's figure is full width under 1024 px).
export const PHONE_CUT = "(max-width: 767px)";

/** A video file of a slide on the CDN (a logical path), best first; `media` names the screens a lighter cut is for. */
export interface ShowcaseVideoFile {
  path: string;
  type: "video/mp4" | "video/webm";
  media?: string;
}

export interface ShowcaseSlideSpec {
  id: string;
  carousel: Showcase;
  source: SlideSource;
  /** The logical path of the 16:9 poster: the first paint, and the reduced-motion still. */
  poster: string;
  /** The video files, best first: VP9 then H.264 for a rendered clip; the phone cut then the full one for a film. */
  videos: readonly ShowcaseVideoFile[];
  /** True when the video carries an audio track (Runway's outputs are silent; a film has its music). */
  audio: boolean;
  /** True for the brand film's slide: it leads to the film's watch page. */
  film: boolean;
  /** The id of the film whose watch page the slide's one action leads to (a film played as a loop, its whole on its own page). */
  watch?: string;
}

interface BoardItem {
  id: string;
  library?: boolean;
  film?: boolean;
  audio?: boolean;
}
interface BoardCarousel {
  order: string[];
  shots: BoardItem[];
  clips: BoardItem[];
}
interface BoardFilm {
  base: string;
  audio?: boolean;
  /** The whole film, played on its watch page (/<locale>/films/<id>) and never inside a carousel: its web cut and its length.
   *  `withheld` says why its watch page is not published yet (the trailer's wrong licence card): no page, no sitemap entry,
   *  no slide action, while its loop still plays. Only a deliberate edit lifts it (showcase-add.mjs --replace keeps it). */
  watch?: { mp4: string; seconds: number; uploadDate: string; audio?: boolean; withheld?: string };
}

/** The whole film whose watch page is published, or undefined (no whole film, or its page withheld). */
const published = (f: BoardFilm) => (f.watch && !f.watch.withheld ? f.watch : undefined);

/** The logical base of a rendition of a slide. */
export const renditionBase = (carousel: string, id: string) => `home/showcase/${carousel}/${id}-wide`;

/** The finished films of the storyboard, by id (the « $comment » is not one). */
const FILMS = Object.fromEntries(
  Object.entries(board.films as Record<string, BoardFilm | string>).filter(
    (e): e is [string, BoardFilm] => typeof e[1] !== "string",
  ),
);

/** The ids of the finished films a carousel may play. */
export const FILM_IDS = Object.keys(FILMS);

/** A film of the storyboard whose whole plays on its own watch page: the carousel plays only its loop (`base`). */
export interface StoryboardWatch {
  id: string;
  /** The logical path of the whole film's web cut (with its sound). */
  mp4: string;
  /** The logical path of the poster: the loop's, and the watch page's thumbnail. */
  poster: string;
  seconds: number;
  uploadDate: string;
}

/** The films with a watch page, in the storyboard's order. */
export const STORYBOARD_WATCH: readonly StoryboardWatch[] = Object.entries(FILMS).flatMap(([id, f]) => {
  const watch = published(f);
  return watch
    ? [{ id, mp4: watch.mp4, poster: `${f.base}-poster.webp`, seconds: watch.seconds, uploadDate: watch.uploadDate }]
    : [];
});

/** A finished film's slide: its poster, its phone cut then its full cut, its sound. */
function filmSlide(id: string, carousel: Showcase, f: BoardFilm): ShowcaseSlideSpec {
  return {
    id,
    carousel,
    source: SlideSource.Film,
    poster: `${f.base}-poster.webp`,
    videos: [
      { path: `${f.base}-720.mp4`, type: "video/mp4", media: PHONE_CUT },
      { path: `${f.base}.mp4`, type: "video/mp4" },
    ],
    audio: Boolean(f.audio),
    film: false,
    ...(published(f) ? { watch: id } : {}),
  };
}

/** Every finished film of the storyboard as a slide, in or out of an order (a film not in any carousel yet is still checked). */
export const filmSlides = (): ShowcaseSlideSpec[] =>
  Object.entries(FILMS).map(([id, f]) => filmSlide(id, "sovkora", f));

/** The slides of a carousel, in their order. */
export function showcaseSlides(carousel: Showcase): ShowcaseSlideSpec[] {
  const c = (board.carousels as Record<Showcase, BoardCarousel>)[carousel];
  return c.order.map((id) => {
    if (FILMS[id]) {
      return filmSlide(id, carousel, FILMS[id]);
    }
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
    const base = renditionBase(carousel, id);
    return {
      id,
      carousel,
      source,
      poster: `${base}.jpg`,
      videos: [
        { path: `${base}.webm`, type: "video/webm" },
        { path: `${base}.mp4`, type: "video/mp4" },
      ],
      audio: Boolean(item.audio),
      film: Boolean(item.film),
    };
  });
}

/** The seconds a slide's loop lasts (measured on its file, the storyboard's `durations`), or undefined when not measured. */
export const slideSeconds = (id: string): number | undefined =>
  (board.durations as Record<string, number | string>)[id] as number | undefined;

/** The files of a slide: its videos and its poster. */
export const filesOf = (s: ShowcaseSlideSpec): string[] => [...s.videos.map((v) => v.path), s.poster];

/** What is wrong with the carousels and the films, as sentences (empty: fine). `has` is lib/cdn.ts's onCdn. */
export function showcaseProblems(has: (path: string) => boolean): string[] {
  const carousels = SHOWCASES.flatMap((carousel) => {
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
  const inOrder = new Set(SHOWCASES.flatMap((c) => showcaseSlides(c).map((s) => s.id)));
  const films = Object.entries(FILMS).flatMap(([id, f]) => {
    const own = inOrder.has(id) ? [] : filesOf(filmSlide(id, "sovkora", f));
    return [...own, ...(f.watch ? [f.watch.mp4] : [])]
      .filter((path) => !has(path))
      .map((path) => `film/${id}: ${path} is not in the CDN manifest`);
  });
  return [...carousels, ...films];
}
