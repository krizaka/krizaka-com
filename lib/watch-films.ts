/* The films worth ranking as videos: each has ONE watch page, /<locale>/films/<id> (Google's video guidelines: the video
   must be the main content of its page, with a title, a description, a thumbnail, an upload date, a duration and a
   content URL). The clips that illustrate an article are NOT here and carry no structured data. Words: site.story.watch;
   the transcript is the film's cues (site.story.world.family.cues). A new film is a line below, its files on the CDN. */

import { FAMILY_BASE, FAMILY_CUES, FAMILY_SECONDS } from "./film-captions.ts";

export interface WatchFilm {
  /** The address segment: /<locale>/films/<id>. */
  id: "family";
  /** The logical path of its files on the CDN (`<base>.webm|.mp4|.jpg`). */
  base: string;
  seconds: number;
  /** ISO date the film was published. */
  uploadDate: string;
  /** The captions route under /<locale>/story/. */
  vtt: string;
  cues: readonly { id: string; start: number; end: number }[];
}

export const WATCH_FILMS: readonly WatchFilm[] = [
  {
    id: "family",
    base: FAMILY_BASE,
    seconds: FAMILY_SECONDS,
    uploadDate: "2026-10-29",
    vtt: "family.vtt",
    cues: FAMILY_CUES,
  },
];

export const watchFilm = (id: string): WatchFilm | undefined => WATCH_FILMS.find((f) => f.id === id);

/** The path of a film's watch page, without the locale. */
export const watchPath = (id: WatchFilm["id"]): string => `/films/${id}`;

/** ISO 8601 duration of `seconds` (PT44S). */
export const isoDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const minutes = m ? m + "M" : "";
  const rest = s || !m ? s + "S" : "";
  return "PT" + minutes + rest;
};
