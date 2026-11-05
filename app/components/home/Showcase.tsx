/* A carousel of the home, resolved on the server (krizaka-internal#2450): its slides' files on the CDN (an unknown file
   throws, so the build fails: lib/home-showcase.ts), its words, and its text version — every slide's caption and what it
   shows, plus where the pictures come from — rendered here so it is in the HTML before any script runs. */

import Link from "next/link";
import { cdn, onCdn } from "@/lib/cdn";
import { BRAND_FILM } from "@/lib/brand-film";
import { format, getDictionary } from "@/lib/i18n";
import { showcaseProblems, showcaseSlides, SlideSource, type Showcase as ShowcaseId } from "@/lib/home-showcase";
import ShowcaseCarousel, { type ShowcaseRendition } from "./ShowcaseCarousel";
import "./showcase.css";

const problems = showcaseProblems(onCdn);
if (problems.length > 0) {
  throw new Error(`home carousels: ${problems.join("; ")}`);
}

const rendition = (base: string): ShowcaseRendition => ({
  mp4: cdn(`${base}.mp4`),
  webm: cdn(`${base}.webm`),
  poster: cdn(`${base}.jpg`),
});
const letter = (i: number) => String.fromCodePoint(97 + i);

export default function Showcase({
  carousel,
  fig,
  locale,
  className,
}: Readonly<{ carousel: ShowcaseId; fig: number; locale: string; className?: string }>) {
  const t = getDictionary(locale).site.home.showcase;
  const words = t.slides[carousel] as Record<string, { caption: string; alt: string }>;
  const specs = showcaseSlides(carousel);
  const slides = specs.map((s, i) => ({
    id: s.id,
    fig: `${fig}${letter(i)}`,
    caption: words[s.id].caption,
    alt: words[s.id].alt,
    wide: rendition(s.wide),
    tall: rendition(s.tall),
  }));
  const sources = [...new Set(specs.map((s) => s.source))];
  const film = specs.some((s) => s.film);
  return (
    <ShowcaseCarousel label={t.carousels[carousel]} slides={slides} className={className}>
      <details className="kz-fig-text kz-show-text">
        <summary>{t.labels.textVersion}</summary>
        <ol>
          {slides.map((s) => (
            <li key={s.id}>
              <b>{format(t.labels.figure, { fig: s.fig, caption: s.caption })}</b> {s.alt}
            </li>
          ))}
        </ol>
        {sources.map((source) => (
          <p key={source}>{t.sources[source === SlideSource.Library ? "library" : source]}</p>
        ))}
        {film && <Link href={`/${locale}/films/${BRAND_FILM.id}`}>{t.labels.film}</Link>}
      </details>
    </ShowcaseCarousel>
  );
}
