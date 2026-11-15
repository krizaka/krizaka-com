/* The founder's films as a timeline, on every watch page (krizaka-internal#3909): the series in order, the current film
   marked, each published film a link, the next one « à venir ». The notebook-numbered list of OfferList (the catalogue has
   no timeline block); then the other films of the site, so every watch page is reached from a page that is read. A server
   component; words: site.story.watch.series. */

import Link from "next/link";
import { getDictionary, asLocale } from "@/lib/i18n";
import { FILMS_SERIES, SeriesStatus, seriesHref } from "@/lib/films-series";
import { WATCH_FILMS, watchPath } from "@/lib/watch-films";
import { OfferList, type OfferItem } from "./lists/OfferList";

export default function FilmsTimeline({ locale: raw, currentId }: Readonly<{ locale: string; currentId: string }>) {
  const locale = asLocale(raw);
  const dict = getDictionary(locale).site;
  const s = dict.story.watch.series;
  const items = FILMS_SERIES.map((e): OfferItem => {
    const words = (s.items as Record<string, { title: string }>)[e.id];
    const upcoming = e.status === SeriesStatus.Upcoming;
    const here = e.watchId === currentId;
    return {
      id: e.id,
      name: words.title,
      meta: upcoming ? s.soon : [e.date, here ? s.here : null].filter(Boolean).join(" · "),
      hook: (s.items as Record<string, { hook: string }>)[e.id].hook,
      href: here ? undefined : seriesHref(e, locale),
    };
  });
  const seriesIds = new Set(FILMS_SERIES.flatMap((e) => (e.watchId ? [e.watchId] : [])));
  const films = dict.home.films as Record<string, { caption: string }>;
  const others = WATCH_FILMS.filter((f) => !seriesIds.has(f.id) && f.id !== currentId);
  return (
    <section aria-labelledby="films-series" className="rd-stack">
      <h2 id="films-series" className="rd-h2">
        {s.heading}
      </h2>
      <p className="rd-prose">{s.lead}</p>
      <OfferList items={items} label={s.heading} compact />
      {others.length > 0 && (
        <>
          <h3 className="rd-h3">{s.others}</h3>
          <ul className="rd-prose">
            {others.map((f) => (
              <li key={f.id}>
                <Link href={`/${locale}${watchPath(f.id)}`}>{films[f.id].caption}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
