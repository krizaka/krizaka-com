"use client";

/* « Watch the full film »: « Le monde de Krizaka : le relais » (the reference film, AI-generated) in a dialog,
   with the same captions and words as /story. Nothing is fetched before it opens: the player's code is loaded on open
   (next/dynamic), the film with preload none and its poster first. Under reduced motion or Save-Data the dialog plays
   the light, calm film instead: the 44 s « Le monde de Krizaka » rendered from the code (`fallback`). */

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { format } from "@krizaka/i18n";
import { PlayIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { useI18n } from "@/app/components/I18nProvider";
import { prefersLightFilm } from "@/lib/film-captions";

const VideoPlayer = dynamic(() => import("@krizaka/ui/video-player").then((m) => m.VideoPlayer), { ssr: false });

export interface LightboxFilm {
  mp4: string;
  poster: string;
  /** The captions route under /<locale>/story/, e.g. "relay.vtt". */
  vtt: string;
}

export default function FilmLightbox({ film, fallback, trigger }: { film: LightboxFilm; fallback: LightboxFilm; /** Another way to open it (/story: the poster card); the home's ghost button by default. */ trigger?: ReactNode }) {
  const { t, locale } = useI18n();
  const [light, setLight] = useState(false);
  const h = t.site.home.hero;
  const w = t.site.story.world;
  const play = light ? fallback : film;
  const labels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild onClick={() => setLight(prefersLightFilm(window))}>
        {trigger ?? (
          <Button type="button" variant="ghost" size="lg" className="kz-home-film-trigger">
            <PlayIcon size={15} aria-hidden /> {h.film} <span className="kz-home-film-length">{h.filmLength}</span>
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content size="lg" closeLabel={h.filmClose} className="kz-home-film">
        <Dialog.Title className="sr-only">{light ? w.title : w.relay.player}</Dialog.Title>
        <VideoPlayer
          key={play.mp4}
          src={play.mp4}
          poster={play.poster}
          preload="none"
          autoPlay={!light}
          title={light ? w.player : w.relay.player}
          tracks={(["en", "fr"] as const).map((lang) => ({ src: `/${lang}/story/${play.vtt}`, srcLang: lang, label: w.captions[lang], default: lang === locale }))}
          labels={labels}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
