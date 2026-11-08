/* The films worth ranking as videos: each has ONE watch page, /<locale>/films/<id> (Google's video guidelines: the video
   must be the main content of its page, with a title, a description, a thumbnail, an upload date, a duration and a
   content URL). The clips that illustrate an article are NOT here and carry no structured data. Words:
   site.story.watch.film; the text version is the description of the film's shots. A retired film's watch page answers
   308 with the film that replaced it (RETIRED_FILMS). */

import { BRAND_FILM } from "./brand-film.ts";
import { STORYBOARD_WATCH } from "./home-showcase.ts";

/** The two kinds of watch page: the brand film (its own files and shots) and a film of the storyboard (its words in site.home.films). */
export const WatchKind = { Brand: "brand", Storyboard: "storyboard" } as const;

interface WatchBase {
  /** ISO date the film was published. */
  uploadDate: string;
  seconds: number;
}

/** The brand film: its files are `<base>.webm|.mp4|.jpg`, its text version is the list of its shots (site.story.watch.film). */
export interface BrandWatch extends WatchBase {
  kind: typeof WatchKind.Brand;
  /** The address segment: /<locale>/films/<id>. */
  id: typeof BRAND_FILM.id;
  /** The logical path of its files on the CDN (`<base>.webm|.mp4|.jpg`). */
  base: string;
  /** Its shots, in film order (the text version). */
  shots: readonly string[];
}

/** A film of the storyboard whose whole plays here (the Sovkora trailer, the Dossiers): its carousel plays only a loop of it.
 *  Its words are site.home.films.<id>: caption (the title), alt (the description), transcript (the text version of its titles). */
export interface StoryboardFilmWatch extends WatchBase {
  kind: typeof WatchKind.Storyboard;
  id: string;
  /** The logical path of the whole film's web cut, with its sound. */
  mp4: string;
  /** The logical path of its poster. */
  poster: string;
}

export type WatchFilm = BrandWatch | StoryboardFilmWatch;

export const WATCH_FILMS: readonly WatchFilm[] = [
  {
    kind: WatchKind.Brand,
    id: BRAND_FILM.id,
    base: BRAND_FILM.base,
    seconds: BRAND_FILM.seconds,
    uploadDate: BRAND_FILM.uploadDate,
    shots: BRAND_FILM.shots,
  },
  ...STORYBOARD_WATCH.map((f): WatchFilm => ({ kind: WatchKind.Storyboard, ...f })),
];

/** Watch pages of films taken down, and the film that replaced each (« La famille Krizaka », 2026-11-01). */
export const RETIRED_FILMS: Readonly<Record<string, typeof BRAND_FILM.id>> = { family: BRAND_FILM.id };

export const watchFilm = (id: string): WatchFilm | undefined => WATCH_FILMS.find((f) => f.id === id);

/** The path of a film's watch page, without the locale. */
export const watchPath = (id: string): string => `/films/${id}`;

/** 308s from a retired film's watch page (with or without the locale) to its successor's. */
export const filmRedirects = () =>
  Object.entries(RETIRED_FILMS).flatMap(([old, id]) => [
    { source: `/films/${old}`, destination: watchPath(id), permanent: true },
    { source: `/:locale(en|fr)/films/${old}`, destination: `/:locale${watchPath(id)}`, permanent: true },
  ]);

/** ISO 8601 duration of `seconds` (PT44S). */
export const isoDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const minutes = m ? m + "M" : "";
  const rest = s || !m ? s + "S" : "";
  return "PT" + minutes + rest;
};
