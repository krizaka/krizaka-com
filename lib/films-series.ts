/* The founder's films as a series, in the order he made them (founder, 2026-11-15, krizaka-internal#3909): 1 « Montrer son
   travail », 2 « Notre histoire », then what comes next. Data only: a new film is one more entry, its words are
   site.story.watch.series.items.<id>. A published entry has a date and a link (its watch page here when its files are on
   our CDN, else its YouTube page); an entry to come has neither and no title of its own. « Notre histoire » was published
   on 2026-11-13 (publishing calendar of brand/publication). The YouTube host is the org's (`org.links.social`), never typed. */

import { org } from "@krizaka/org";

import { BRAND_FILM } from "./brand-film.ts";
import { watchPath } from "./watch-films.ts";

export const SeriesStatus = { Published: "published", Upcoming: "upcoming" } as const;

interface SeriesPublished {
  id: string;
  status: typeof SeriesStatus.Published;
  /** ISO date the film was published. */
  date: string;
  /** The id of its watch page on this site, when its files are on our CDN. */
  watchId?: string;
  /** Else its YouTube video id. */
  youtubeId?: string;
}

interface SeriesUpcoming {
  id: string;
  status: typeof SeriesStatus.Upcoming;
  date?: undefined;
  watchId?: undefined;
  youtubeId?: undefined;
}

export type SeriesEntry = SeriesPublished | SeriesUpcoming;

export const FILMS_SERIES: readonly SeriesEntry[] = [
  { id: BRAND_FILM.id, status: SeriesStatus.Published, date: BRAND_FILM.uploadDate, watchId: BRAND_FILM.id },
  { id: "notre-histoire", status: SeriesStatus.Published, date: "2026-11-13", youtubeId: "8Ctg73JPT1M" },
  { id: "next", status: SeriesStatus.Upcoming },
];

/** A video's YouTube page, on the host of the org's YouTube channel. */
export function youtubeWatchUrl(videoId: string): string {
  const channel = org.links.social.find((s) => s.id === "youtube");
  if (!channel) {
    throw new Error("@krizaka/org lists no YouTube account");
  }
  return new URL(`/watch?v=${videoId}`, channel.url).href;
}

/** Where an entry leads: its watch page (with the locale) or its YouTube page; nothing for a film to come. */
export function seriesHref(entry: SeriesEntry, locale: string): string | undefined {
  if (entry.watchId) {
    return `/${locale}${watchPath(entry.watchId)}`;
  }
  return entry.youtubeId ? youtubeWatchUrl(entry.youtubeId) : undefined;
}
