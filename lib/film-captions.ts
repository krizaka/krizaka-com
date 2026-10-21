/* « Le monde de Krizaka » — the film of the flock (rendered from the code of @krizaka/ui by krizaka-ui
   tools/brand-films, on the CDN under site/brand-films/). This module holds the structure the page needs: the film's
   logical path, its length, and when each line is said. The words are messages (site.story.world.cues.<id>): the
   page lists them as the film's text version, and app/[locale]/story/film.vtt renders them as WebVTT.
   The times are the film's own (FILM.cues in krizaka-ui tools/brand-films/film.mjs): change both together. */

/** The site's cut: 16:9, music, no burned captions (`video()` of lib/cdn.ts adds .mp4/.webm/.jpg). */
export const FILM_BASE = "brand-films/film/le-monde-de-krizaka-16x9";
// @fixed: the length of the rendered file (FILM.seconds in krizaka-ui tools/brand-films/film.mjs), a fact of the media.
export const FILM_SECONDS = 44;

/** The birds, in the order they step forward. */
export const FILM_CAST = ["falcon", "owl", "duck", "flamingo", "pigeon"] as const;

export const FILM_CUES = [
  { id: "title", start: 0.6, end: 3.6 },
  { id: "falcon", start: 6.2, end: 10.8 },
  { id: "owl", start: 12.2, end: 16.8 },
  { id: "duck", start: 18.2, end: 22.8 },
  { id: "flamingo", start: 24.2, end: 28.8 },
  { id: "pigeon", start: 30.2, end: 34.8 },
  { id: "together", start: 35.4, end: 37.4 },
  { id: "family", start: 37.6, end: 39.6 },
] as const;

export type FilmCueId = (typeof FILM_CUES)[number]["id"];

const clock = (t: number) => {
  const ms = Math.round(t * 1000);
  const hh = String(Math.floor(ms / 3_600_000)).padStart(2, "0");
  const mm = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, "0");
  const ss = String(Math.floor((ms % 60_000) / 1000)).padStart(2, "0");
  return `${hh}:${mm}:${ss}.${String(ms % 1000).padStart(3, "0")}`;
};

interface Cue {
  id: FilmCueId;
  start: number;
  end: number;
}

/** The captions as WebVTT, one cue per line, in the words given (a locale's site.story.world.cues). */
export function filmVtt(words: Record<FilmCueId, string>, cues: readonly Cue[] = FILM_CUES): string {
  return `WEBVTT\n\n${cues.map((c) => `${c.id}\n${clock(c.start)} --> ${clock(c.end)}\n${words[c.id]}\n`).join("\n")}`;
}

/* « Le monde de Krizaka : la tournée » — the photoreal sequel (krizaka-ui tools/brand-films/epic): the same birds, rendered
   from @krizaka/ui, re-lit and animated by models (AI-generated, said on the page and in the film). It says the film's
   own lines, at its own times (epic/edl.json → the cut's timeline): change both together. */
export const TOUR_BASE = "brand-films/epic/le-monde-de-krizaka-la-tournee-16x9";
// @fixed: the length of the rendered file (the cut's timeline), a fact of the media.
export const TOUR_SECONDS = 78.3;

export const TOUR_CUES: readonly Cue[] = [
  { id: "falcon", start: 10.73, end: 15.73 },
  { id: "owl", start: 24.52, end: 29.92 },
  { id: "flamingo", start: 30.92, end: 35.12 },
  { id: "duck", start: 35.47, end: 39.77 },
  { id: "pigeon", start: 59.68, end: 66.18 },
  { id: "together", start: 70.4, end: 73.0 },
  { id: "family", start: 74.3, end: 76.3 },
];

interface Viewer {
  matchMedia?: (query: string) => { matches: boolean };
  /** The browser's navigator: `connection.saveData` is not in every engine nor in the DOM types, so it is read loosely. */
  navigator?: object;
}

/** True when the visitor asked for less (reduced motion, or Save-Data): the home's dialog then plays the light code film. */
export function prefersLightFilm(viewer: Viewer): boolean {
  const connection = (viewer.navigator as { connection?: { saveData?: boolean } } | undefined)?.connection;
  return Boolean(viewer.matchMedia?.("(prefers-reduced-motion: reduce)").matches || connection?.saveData);
}

/** A film the /story chapter « Who we are » may show: its files (`<base>.webm|.mp4|.jpg`) and its captions route under /<locale>/story/. */
export interface StoryFilm {
  id: string;
  base: string;
  vtt: string;
}

/** The slot of the reference film: the first of `films` (newest first) whose three files are all on the CDN; the last one (the oldest, always uploaded) otherwise. */
export function pickFilm(films: readonly StoryFilm[], onCdn: (path: string) => boolean): StoryFilm {
  return films.find((f) => ["webm", "mp4", "jpg"].every((ext) => onCdn(`${f.base}.${ext}`))) ?? films[films.length - 1]!;
}
