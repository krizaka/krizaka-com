"use client";

/* « Fig. 1 »: the hero's realisations (lib/hero-slides.ts, krizaka-internal#2229), made with @krizaka/ui's MediaCarousel and
   MediaPlayer. Every slide waits on its poster: no video byte before a press (the lightbox and its player are loaded on
   open), so the first screen's h1 stays the LCP and a visitor who asked for less (reduced motion, Save-Data) gets the same.
   One slide is the film alone, in its frame, with no carousel chrome and no « 1 / 1 »; from two slides on, the carousel
   brings its buttons and its count (nothing advances by itself). Words are messages, never typed here. */

import { MediaCarousel, type CarouselSlide } from "@krizaka/ui/media-carousel";
import { MediaPlayer } from "@krizaka/ui/media-player";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";

export interface HeroSlideView {
  id: string;
  fig: string;
  mp4: string;
  poster: string;
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
          className="h-full rounded-none border-0"
        />
      </div>
    );
  }

  // The carousel's film slide takes no `labels` yet (the player's words stay English in its lightbox): krizaka-ui gap.
  const items: CarouselSlide[] = slides.map((s) => ({
    id: s.id,
    src: s.poster,
    alt: words(s.id).alt,
    caption: format(hero.carousel.figure, { fig: s.fig }),
    film: film(s),
  }));
  return (
    <MediaCarousel
      slides={items}
      label={hero.carousel.label}
      ratio="16 / 9"
      labels={{ ...hero.carousel, close: hero.filmClose }}
    />
  );
}
