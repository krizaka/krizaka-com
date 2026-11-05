"use client";

/* « Fig. 1 »: the hero's figures (lib/hero-slides.ts), the product's checked pay stub first, then the brand film
   (krizaka-internal#2445). Two named tabs of @krizaka/ui (`Tabs`, segmented) say what each one shows: nothing advances by
   itself and nothing slides (WCAG 2.2.2, « nothing moves on its own »); the visitor picks. Each figure is a <figure>: its
   frame (@krizaka/ui MediaPlayer in lightbox mode, poster first), its caption under it, and its own text version (rendered
   on the server and passed in). A figure with a silent loop previews through @krizaka/ui/pausable-loop (nothing fetched
   before the page's load, plays only on screen, a visible pause, the poster alone under reduced motion or Save-Data). The
   clip itself, with sound, waits for a press: the lightbox and its player load on open, so the h1 stays the LCP. Words are
   messages. The carousel block of @krizaka/ui has no named-tabs variant yet, so the tabs are composed here from Tabs + MediaPlayer. */

import type { ReactNode } from "react";
import { MediaPlayer } from "@krizaka/ui/media-player";
import { PausableLoop } from "@krizaka/ui/pausable-loop";
import { Tabs } from "@krizaka/ui/tabs";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";

export interface HeroSlideView {
  id: string;
  fig: string;
  mp4: string;
  poster: string;
  /** The silent loop that previews the figure (its poster is the figure's). */
  loop?: { webm: string; mp4: string };
  /** The film's length (« 31 s »), said on its play button; a recording says none. */
  length?: string;
}

export default function HeroFigure({
  slides,
  texts,
}: Readonly<{
  slides: readonly HeroSlideView[];
  /** Each figure's text version, rendered on the server, by figure id. */
  texts: Readonly<Record<string, ReactNode>>;
}>) {
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

  const figure = (s: HeroSlideView) => (
    <figure className="kz-fig-one" aria-labelledby={`fig-${s.id}-caption`}>
      <div className="kz-fig-frame">
        <MediaPlayer
          src={s.mp4}
          title={words(s.id).title}
          playLabel={s.length ? `${words(s.id).open} · ${s.length}` : words(s.id).open}
          labels={labels}
          mode="lightbox"
          poster={s.poster}
          posterAlt={words(s.id).alt}
          closeLabel={hero.filmClose}
          preview={s.loop && <PausableLoop sources={s.loop} poster={s.poster} labels={loopLabels} />}
          className="h-full rounded-none border-0"
        />
      </div>
      <figcaption id={`fig-${s.id}-caption`} className="kz-fig-caption">
        {format(hero.figure, { fig: s.fig, caption: words(s.id).caption })}
      </figcaption>
      {texts[s.id]}
    </figure>
  );

  if (slides.length === 1) return figure(slides[0]);

  return (
    // @ephemeral: which figure the visitor looks at is a passing choice on the home, not a page of its own.
    <Tabs.Root defaultValue={slides[0].id} variant="segmented" className="kz-fig-tabs">
      <Tabs.List aria-label={hero.fig.tabs}>
        {slides.map((s) => (
          <Tabs.Trigger key={s.id} value={s.id}>
            {words(s.id).tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {slides.map((s) => (
        <Tabs.Content key={s.id} value={s.id}>
          {figure(s)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
