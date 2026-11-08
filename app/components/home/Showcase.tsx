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
  SlideSource,
  type Showcase as ShowcaseId,
  type ShowcaseSlideSpec,
} from "@/lib/home-showcase";
import { watchPath } from "@/lib/watch-films";
import ShowcaseCarousel from "./ShowcaseCarousel";
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
  const slides = specs.map((s, i) => ({
    id: s.id,
    fig: `${fig}${letter(i)}`,
    caption: wordsOf(s).caption,
    alt: wordsOf(s).alt,
    poster: cdn(s.poster),
    videos: s.videos.map((v) => ({ src: cdn(v.path), type: v.type, media: v.media })),
    audio: s.audio,
    watch: s.watch
      ? { href: `/${locale}${watchPath(s.watch)}`, label: films[s.watch].watchLabel ?? wordsOf(s).caption }
      : undefined,
  }));
  const sources = [...new Set(specs.map((s) => s.source))];
  const film = specs.some((s) => s.film);
  return (
    <ShowcaseCarousel label={t.carousels[carousel]} slides={slides} className={className}>
      <details className="kz-fig-text kz-show-text">
        <summary>{t.labels.textVersion}</summary>
        <ol>
          {slides.map((s, i) => {
            const transcript = specs[i].source === SlideSource.Film ? films[s.id].transcript : undefined;
            return (
              <li key={s.id}>
                <b>{format(t.labels.figure, { fig: s.fig, caption: s.caption })}</b> {s.alt}
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
              </li>
            );
          })}
        </ol>
        {sources.map((source) => (
          <p key={source}>{t.sources[source]}</p>
        ))}
        {film && <Link href={`/${locale}/films/${BRAND_FILM.id}`}>{t.labels.film}</Link>}
      </details>
    </ShowcaseCarousel>
  );
}
