"use client";

/* « Fig. 1 »: the hero's realisations (lib/hero-slides.ts, krizaka-internal#2229), made with @krizaka/ui's MediaCarousel and
   MediaPlayer. Every slide paints its poster first; a slide with a silent loop previews its film through
   @krizaka/ui/pausable-loop (nothing fetched before the page's load, plays only on screen, a visible pause, the poster alone
   under reduced motion or Save-Data). The film itself, with sound, waits for a press: the lightbox and its player load on open,
   so the first screen's h1 stays the LCP. One slide is the film alone, in its frame, with no carousel chrome and no « 1 / 1 »;
   from two slides on, the carousel brings its buttons and its count (nothing advances by itself). Words are messages. */

import { MediaCarousel, type CarouselSlide } from "@krizaka/ui/media-carousel";
import { MediaPlayer } from "@krizaka/ui/media-player";
import { PausableLoop } from "@krizaka/ui/pausable-loop";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";

export interface HeroSlideView {
  id: string;
  fig: string;
  mp4: string;
  poster: string;
  /** The silent loop that previews the slide (its poster is the slide's). */
  loop?: { webm: string; mp4: string };
}

export default function HeroFigure({ slides }: Readonly<{ slides: readonly HeroSlideView[] }>) {
  const { t } = useI18n();
  const hero = t.site.home.hero;
  const w = t.site.story.world;
  const labels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  const loopLabels = { pause: hero.fig.pause, play: hero.fig.play };
  const words = (id: string) => hero.slides[id as keyof typeof hero.slides];
  const film = (s: HeroSlideView) => ({
    src: s.mp4,
    title: words(s.id).title,
    playLabel: `${hero.fig.open} · ${hero.filmLength}`,
  });

  if (slides.length === 1) {
    const [only] = slides;
    return (
      <div className="kz-fig-frame">
        <MediaPlayer
          {...film(only)}
          labels={labels}
          mode="lightbox"
          poster={only.poster}
          posterAlt={words(only.id).alt}
          closeLabel={hero.filmClose}
          preview={only.loop && <PausableLoop sources={only.loop} poster={only.poster} labels={loopLabels} />}
          className="h-full rounded-none border-0"
        />
      </div>
    );
  }

  const items: CarouselSlide[] = slides.map((s) => ({
    id: s.id,
    src: s.poster,
    alt: words(s.id).alt,
    caption: format(hero.carousel.figure, { fig: s.fig, caption: words(s.id).caption }),
    video: s.loop,
    film: film(s),
  }));
  return (
    <MediaCarousel
      slides={items}
      label={hero.carousel.label}
      ratio="16 / 9"
      labels={{ ...hero.carousel, close: hero.filmClose }}
      playerLabels={labels}
      renderLoop={(video, { poster, inView }) => (
        <PausableLoop sources={video} poster={poster} active={inView} labels={loopLabels} />
      )}
    />
  );
}
