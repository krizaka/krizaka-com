import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Page } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { format, getDictionary, asLocale } from "@/lib/i18n";
import { buildAlternates, shareMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildVideoJsonLd } from "@/lib/structured-data";
import { isoDuration, watchFilm, watchPath, WATCH_FILMS, WatchKind, type WatchFilm } from "@/lib/watch-films";
import { watchMedia } from "@/lib/watch-media";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { JsonLd } from "@/app/components/JsonLd";
import WatchPlayer from "@/app/components/WatchPlayer";

/* /films/<id> — the watch page of one film (template: gallery). The video is the main content of the page, which is
   what Google asks of a page it indexes a video from: title, description, poster, the player, a text version, and the
   VideoObject. The brand film has no speech, so no captions: its text version is the description of its shots, in
   order. Nothing plays by itself: the poster waits for a press (reduced motion included). Words: site.story.watch. A film of the
   storyboard (the Sovkora trailer, the Dossiers, whose carousels play only a loop of them) says its words in
   site.home.films.<id>: its caption is the page's title, its alt the description, and the text version is the transcript of
   its titles, in the language of the page. The sound is the visitor's, on the player's control. */

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamicParams = false;
export const generateStaticParams = () =>
  ["fr", "en"].flatMap((locale) => WATCH_FILMS.map((f) => ({ locale, id: f.id })));

interface PageWords {
  title: string;
  description: string;
  /** The text version: its heading, its lead and its lines. */
  version: { heading: string; lead: string; lines: readonly string[] };
  credit?: string;
}

/** The words of a watch page, from the brand film's messages or the storyboard film's. */
function pageWords(locale: string, f: WatchFilm): PageWords {
  const home = getDictionary(asLocale(locale)).site.home;
  const watch = getDictionary(asLocale(locale)).site.story.watch;
  if (f.kind === WatchKind.Storyboard) {
    const w = (
      home.films as Record<string, { caption: string; alt: string; transcript?: { lead: string; lines: string[] } }>
    )[f.id];
    return {
      title: w.caption,
      description: w.alt,
      version: { heading: watch.titles, lead: w.transcript?.lead ?? "", lines: w.transcript?.lines ?? [] },
    };
  }
  const film = watch.film;
  return {
    title: film.title,
    description: format(film.description, { seconds: f.seconds }),
    version: {
      heading: watch.shots,
      lead: watch.shotsLead,
      lines: f.shots.map((id) => film.shots[id as keyof typeof film.shots]),
    },
    credit: film.credit,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const f = watchFilm(id);
  if (!f) {
    return {};
  }
  const { title, description } = pageWords(locale, f);
  const share = shareMetadata(locale, watchPath(f.id), { title, description });
  const { poster } = watchMedia(f);
  return {
    title: { absolute: `${title} | Krizaka` },
    description,
    alternates: buildAlternates(locale, watchPath(f.id)),
    ...share,
    // The film's card is its poster: the share image of a watch page is the film itself.
    openGraph: { ...share.openGraph, type: "video.other", images: [poster] },
    twitter: { ...share.twitter, images: [poster] },
  };
}

export default async function FilmPage({ params }: Props) {
  const { locale: raw, id } = await params;
  const f = watchFilm(id);
  if (!f) {
    notFound();
  }
  const locale = asLocale(raw);
  const watch = getDictionary(locale).site.story.watch;
  const words = pageWords(locale, f);
  const media = watchMedia(f);
  const url = `${SITE_URL}/${locale}${watchPath(f.id)}`;
  return (
    <main className="kz-site-main">
      <JsonLd
        data={buildVideoJsonLd({
          locale,
          name: words.title,
          description: words.description,
          url,
          thumbnailUrl: media.poster,
          contentUrl: media.mp4,
          uploadDate: f.uploadDate,
          duration: isoDuration(f.seconds),
          ...(f.kind === WatchKind.Storyboard && words.version.lines.length > 0
            ? { transcript: words.version.lines.join(" ") }
            : {}),
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Krizaka", url: `${SITE_URL}/${locale}` },
          { name: words.title, url },
        ])}
      />
      <SiteBar />
      <PageHero eyebrow={watch.eyebrow} title={words.title} lead={words.description}>
        <ButtonLink href={f.kind === WatchKind.Brand ? `/${locale}/story` : `/${locale}`} variant="secondary" size="md">
          {f.kind === WatchKind.Brand ? watch.back : watch.backHome}
        </ButtonLink>
      </PageHero>
      <Page>
        <div className="rd-stack">
          <WatchPlayer src={media.mp4} poster={media.poster} title={words.title} />
          <p className="rd-prose is-small">{format(watch.length, { seconds: f.seconds })}</p>
          <section aria-labelledby="film-shots" className="rd-stack">
            <h2 id="film-shots" className="rd-h2">
              {words.version.heading}
            </h2>
            <p className="rd-prose">{words.version.lead}</p>
            <ol className="rd-prose rd-shots">
              {words.version.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            {words.credit && <p className="rd-prose is-small">{words.credit}</p>}
          </section>
        </div>
      </Page>
    </main>
  );
}
