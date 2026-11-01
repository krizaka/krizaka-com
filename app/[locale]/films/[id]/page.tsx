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
   what Google asks of a page it indexes a video from: title, description, poster, the player, a text version, and the
   VideoObject. The brand film has no speech, so no captions: its text version is the description of its shots, in
   order. Nothing plays by itself: the poster waits for a press (reduced motion included). Words: site.story.watch. */

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamicParams = false;
export const generateStaticParams = () =>
  ["fr", "en"].flatMap((locale) => WATCH_FILMS.map((f) => ({ locale, id: f.id })));

const wordsOf = (locale: string) => {
  const t = getDictionary(asLocale(locale)).site.story;
  return { watch: t.watch, film: t.watch.film };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const f = watchFilm(id);
  if (!f) {
    return {};
  }
  const { film } = wordsOf(locale);
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
  const { watch, film } = wordsOf(locale);
  const media = video(f.base);
  const url = `${SITE_URL}/${locale}${watchPath(f.id)}`;
  const description = format(film.description, { seconds: f.seconds });
  const shots = f.shots.map((id) => film.shots[id as keyof typeof film.shots]);
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
        <div className="rd-stack">
          <video
            controls
            playsInline
            preload="metadata"
            poster={media.poster}
            style={{ width: "100%", height: "auto" }}
          >
            <source src={media.webm} type="video/webm" />
            <source src={media.mp4} type="video/mp4" />
          </video>
          <p className="rd-prose is-small">{format(watch.length, { seconds: f.seconds })}</p>
          <section aria-labelledby="film-shots" className="rd-stack">
            <h2 id="film-shots" className="rd-h2">
              {watch.shots}
            </h2>
            <p className="rd-prose">{watch.shotsLead}</p>
            <ol className="rd-prose rd-shots">
              {shots.map((line, i) => (
                <li key={f.shots[i]}>{line}</li>
              ))}
            </ol>
            <p className="rd-prose is-small">{film.credit}</p>
          </section>
        </div>
      </Page>
    </main>
  );
}
