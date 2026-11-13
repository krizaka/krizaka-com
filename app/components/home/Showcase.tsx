/* A carousel of the home, resolved on the server (krizaka-internal#2450): its slides' files on the CDN (an unknown file
   throws, so the build fails: lib/home-showcase.ts), its words, and its text version — every slide's caption and what it
   shows, a film's transcript (its words, krizaka-internal#2837), plus where the pictures come from — rendered here so it is
   in the HTML before any script runs. */

import Link from "next/link";
import { cdn, onCdn } from "@/lib/cdn";
import { BRAND_FILM } from "@/lib/brand-film";
import { format, getDictionary } from "@/lib/i18n";
import {
  showcaseProblems,
  showcaseSlides,
  slideSeconds,
  SlideSource,
  type Showcase as ShowcaseId,
  type ShowcaseSlideSpec,
} from "@/lib/home-showcase";
import { watchPath } from "@/lib/watch-films";
import { MediaCarousel, type CarouselSlide } from "@krizaka/ui/media-carousel";
import "./showcase.css";

const problems = showcaseProblems(onCdn);
if (problems.length > 0) {
  throw new Error(`home carousels: ${problems.join("; ")}`);
}

const letter = (i: number) => String.fromCodePoint(97 + i);

/** The words of a film: its caption, its alt, and, when it says something in words, its transcript. */
interface FilmWords {
  caption: string;
  alt: string;
  watchLabel?: string;
  transcript?: { lead: string; lines: string[] };
}

export default function Showcase({
  carousel,
  fig,
  locale,
  className,
}: Readonly<{ carousel: ShowcaseId; fig: number; locale: string; className?: string }>) {
  const home = getDictionary(locale).site.home;
  const t = home.showcase;
  const words = t.slides[carousel] as Record<string, { caption: string; alt: string }>;
  const films = home.films as Record<string, FilmWords>;
  const wordsOf = (s: ShowcaseSlideSpec) => (s.source === SlideSource.Film ? films[s.id] : words[s.id]);
  const specs = showcaseSlides(carousel);
  const slides = specs.map((s, i) => {
    const figLabel = `${fig}${letter(i)}`;
    const caption = format(t.labels.figure, { fig: figLabel, caption: wordsOf(s).caption });
    const mp4 = s.videos.find((v) => !v.media && v.type === "video/mp4");
    const webm = s.videos.find((v) => v.type === "video/webm");
    return {
      id: s.id,
      src: cdn(s.poster),
      alt: wordsOf(s).alt,
      caption,
      text: wordsOf(s).alt,
      video: { webm: webm && cdn(webm.path), mp4: mp4 && cdn(mp4.path) },
      duration: slideSeconds(s.id),
      audio: s.audio,
    } satisfies CarouselSlide;
  });
  const sources = [...new Set(specs.map((s) => s.source))];
  const film = specs.some((s) => s.film);
  return (
    <MediaCarousel
      label={t.carousels[carousel]}
      slides={slides}
      className={className}
      frame="cahier"
      caption="bar"
      autoplay
      sound
      textVersion
      labels={{
        previous: t.labels.previous,
        next: t.labels.next,
        close: t.labels.close,
        slide: t.labels.slideOf,
        pause: t.labels.pause,
        play: t.labels.play,
        soundOn: t.labels.sound,
        textVersion: t.labels.textVersion,
        carousel: t.labels.carousel,
        slideRole: t.labels.slide,
      }}
    >
      {specs.map((s) => {
        const transcript = s.source === SlideSource.Film ? films[s.id].transcript : undefined;
        return (
          <div key={s.id}>
            {transcript && (
              <>
                <p>{transcript.lead}</p>
                <ol className="kz-show-transcript">
                  {transcript.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </>
            )}
            {s.watch && (
              <p>
                <Link href={`/${locale}${watchPath(s.watch)}`}>{films[s.watch].watchLabel ?? wordsOf(s).caption}</Link>
              </p>
            )}
          </div>
        );
      })}
      {sources.map((source) => (
        <p key={source}>{t.sources[source]}</p>
      ))}
      {film && <Link href={`/${locale}/films/${BRAND_FILM.id}`}>{t.labels.film}</Link>}
    </MediaCarousel>
  );
}
