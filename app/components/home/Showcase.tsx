/* A carousel of the home, resolved on the server (krizaka-internal#2450, #2658): its slides' files on the CDN (an unknown
   file throws, so the build fails: lib/home-showcase.ts), its words, and its text version — every slide's caption and what
   it shows, plus where the pictures come from — rendered here so it is in the HTML before any script runs.
   The carousel itself is @krizaka/ui's `MediaCarousel` v2 (krizaka-ui ADR-010): `autoplay` (it advances on its own at each
   slide's pace, with a visible pause, held on hover, keyboard focus, a hidden tab and off screen; nothing moves under
   reduced motion or Save-Data), one 16:9 rendition on every screen, the clip mounted after the page's load for the slide in
   view only (the h1 stays the LCP), the poster kept when a clip cannot play, « Sound on » for slides with an audio track,
   the Cahier frame and the caption in the bar. The product's hue comes from the `brand-<id>` of its entry. */

import Link from "next/link";
import { type CarouselSlide, MediaCarousel } from "@krizaka/ui/media-carousel";
import { cdn, onCdn } from "@/lib/cdn";
import { BRAND_FILM } from "@/lib/brand-film";
import { format, getDictionary } from "@/lib/i18n";
import { showcaseProblems, showcaseSlides, SlideSource, type Showcase as ShowcaseId } from "@/lib/home-showcase";

const problems = showcaseProblems(onCdn);
if (problems.length > 0) {
  throw new Error(`home carousels: ${problems.join("; ")}`);
}

const letter = (i: number) => String.fromCodePoint(97 + i);

export default function Showcase({
  carousel,
  fig,
  locale,
  className,
}: Readonly<{ carousel: ShowcaseId; fig: number; locale: string; className?: string }>) {
  const t = getDictionary(locale).site.home.showcase;
  const w = t.labels;
  const words = t.slides[carousel] as Record<string, { caption: string; alt: string }>;
  const specs = showcaseSlides(carousel);
  const slides: CarouselSlide[] = specs.map((s, i) => ({
    id: s.id,
    kind: "clip",
    src: cdn(`${s.wide}.jpg`),
    alt: words[s.id].alt,
    caption: format(w.figure, { fig: `${fig}${letter(i)}`, caption: words[s.id].caption }),
    video: { webm: cdn(`${s.wide}.webm`), mp4: cdn(`${s.wide}.mp4`) },
    audio: s.audio,
  }));
  const sources = [...new Set(specs.map((s) => s.source))];
  const film = specs.some((s) => s.film);
  return (
    <MediaCarousel
      label={t.carousels[carousel]}
      slides={slides}
      autoplay
      sound
      frame="cahier"
      caption="bar"
      className={className}
      labels={{
        previous: w.previous,
        next: w.next,
        pause: w.pause,
        play: w.play,
        soundOn: w.soundOn,
        textVersion: w.textVersion,
        slide: w.slideOf,
        carousel: w.carousel,
        slideRole: w.slide,
      }}
    >
      <details className="kz-fig-text">
        <summary>{w.textVersion}</summary>
        <ol>
          {slides.map((s) => (
            <li key={s.id}>
              <b>{s.caption}</b> {s.alt}
            </li>
          ))}
        </ol>
        {sources.map((source) => (
          <p key={source}>{t.sources[source === SlideSource.Library ? "library" : source]}</p>
        ))}
        {film && <Link href={`/${locale}/films/${BRAND_FILM.id}`}>{t.labels.film}</Link>}
      </details>
    </MediaCarousel>
  );
}
