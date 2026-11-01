import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Page } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { video } from "@/lib/cdn";
import { format, getDictionary, asLocale } from "@/lib/i18n";
import { buildAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildVideoJsonLd } from "@/lib/structured-data";
import { isoDuration, watchFilm, watchPath, WATCH_FILMS } from "@/lib/watch-films";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { JsonLd } from "@/app/components/JsonLd";

/* /films/<id> — the watch page of one film (template: gallery). The video is the main content of the page, which is
   what Google asks of a page it indexes a video from: title, description, poster, the player, the transcript, the
   captions in both languages, and the VideoObject. Words: site.story.watch (+ the film's cues). */

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamicParams = false;
export const generateStaticParams = () =>
  ["fr", "en"].flatMap((locale) => WATCH_FILMS.map((f) => ({ locale, id: f.id })));

const wordsOf = (locale: string, id: string) => {
  const t = getDictionary(asLocale(locale)).site.story;
  return { watch: t.watch, film: t.watch[id as "family"], cues: t.world[id as "family"].cues };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const f = watchFilm(id);
  if (!f) {
    return {};
  }
  const { film } = wordsOf(locale, id);
  const title = film.title;
  const description = format(film.description, { seconds: f.seconds });
  return {
    title: { absolute: `${title} | Krizaka` },
    description,
    alternates: buildAlternates(locale, watchPath(f.id)),
    openGraph: { title, description, type: "video.other", images: [video(f.base).poster] },
  };
}

export default async function FilmPage({ params }: Props) {
  const { locale: raw, id } = await params;
  const f = watchFilm(id);
  if (!f) {
    notFound();
  }
  const locale = asLocale(raw);
  const { watch, film, cues } = wordsOf(locale, id);
  const media = video(f.base);
  const url = `${SITE_URL}/${locale}${watchPath(f.id)}`;
  const description = format(film.description, { seconds: f.seconds });
  const lines = f.cues.map((c) => (cues as Record<string, string>)[c.id]!);
  return (
    <main className="kz-site-main">
      <JsonLd
        data={buildVideoJsonLd({
          locale,
          name: film.title,
          description,
          url,
          thumbnailUrl: media.poster,
          contentUrl: media.mp4,
          uploadDate: f.uploadDate,
          duration: isoDuration(f.seconds),
          transcript: lines.join(" "),
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Krizaka", url: `${SITE_URL}/${locale}` },
          { name: film.title, url },
        ])}
      />
      <SiteBar />
      <PageHero eyebrow={watch.eyebrow} title={film.title} lead={description}>
        <ButtonLink href={`/${locale}/story`} variant="secondary" size="md">
          {watch.back}
        </ButtonLink>
      </PageHero>
      <Page>
        <video controls playsInline preload="metadata" poster={media.poster} style={{ width: "100%", height: "auto" }}>
          <source src={media.webm} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
          <track
            kind="captions"
            srcLang="en"
            label={watch.captionEn}
            src={`/en/story/${f.vtt}`}
            default={locale === "en"}
          />
          <track
            kind="captions"
            srcLang="fr"
            label={watch.captionFr}
            src={`/fr/story/${f.vtt}`}
            default={locale === "fr"}
          />
        </video>
        <p>{format(watch.length, { seconds: f.seconds })}</p>
        <section aria-labelledby="film-transcript">
          <h2 id="film-transcript">{watch.transcript}</h2>
          <p>{watch.transcriptLead}</p>
          <ol>
            {lines.map((line, i) => (
              <li key={f.cues[i]!.id}>{line}</li>
            ))}
          </ol>
        </section>
      </Page>
    </main>
  );
}
