/* The films worth ranking as videos: each has ONE watch page, /<locale>/films/<id> (Google's video guidelines: the video
   must be the main content of its page, with a title, a description, a thumbnail, an upload date, a duration and a
   content URL). The clips that illustrate an article are NOT here and carry no structured data. Words:
   site.story.watch.film; the text version is the description of the film's shots. A retired film's watch page answers
   308 with the film that replaced it (RETIRED_FILMS). */

import { BRAND_FILM } from "./brand-film.ts";

export interface WatchFilm {
  /** The address segment: /<locale>/films/<id>. */
  id: typeof BRAND_FILM.id;
  /** The logical path of its files on the CDN (`<base>.webm|.mp4|.jpg`). */
  base: string;
  seconds: number;
  /** ISO date the film was published. */
  uploadDate: string;
  /** Its shots, in film order (the text version). */
  shots: readonly string[];
}

export const WATCH_FILMS: readonly WatchFilm[] = [
  {
    id: BRAND_FILM.id,
    base: BRAND_FILM.base,
    seconds: BRAND_FILM.seconds,
    uploadDate: BRAND_FILM.uploadDate,
    shots: BRAND_FILM.shots,
  },
];

/** Watch pages of films taken down, and the film that replaced each (« La famille Krizaka », 2026-11-01). */
export const RETIRED_FILMS: Readonly<Record<string, WatchFilm["id"]>> = { family: BRAND_FILM.id };

export const watchFilm = (id: string): WatchFilm | undefined => WATCH_FILMS.find((f) => f.id === id);

/** The path of a film's watch page, without the locale. */
export const watchPath = (id: WatchFilm["id"]): string => `/films/${id}`;

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
