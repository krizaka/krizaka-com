"use client";

/* « Watch the film »: the brand film « Montrer son travail » (lib/brand-film.ts) in a dialog. Nothing is fetched before it
   opens: the player's code is loaded on open (next/dynamic), the film with preload none and its poster first. Under
   reduced motion or Save-Data it waits on its poster (no autoplay). On a phone held upright it plays the vertical cut
   once that cut is on the CDN. No speech, so no captions track. */

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { format } from "@krizaka/i18n";
import { PlayIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { useI18n } from "@/app/components/I18nProvider";
import { prefersStill } from "@/lib/brand-film";

const VideoPlayer = dynamic(() => import("@krizaka/ui/video-player").then((m) => m.VideoPlayer), { ssr: false });

export interface LightboxCut {
  mp4: string;
  poster: string;
}

export interface LightboxFilm extends LightboxCut {
  /** The 9:16 cut, when it is on the CDN. */
  tall?: LightboxCut;
}

export default function FilmLightbox({
  film,
  trigger,
}: {
  film: LightboxFilm;
  /** Another way to open it (/story: the poster card); the home's ghost button by default. */ trigger?: ReactNode;
}) {
  const { t } = useI18n();
  const [still, setStill] = useState(true);
  const [upright, setUpright] = useState(false);
  const h = t.site.home.hero;
  const w = t.site.story.world;
  const play = upright && film.tall ? film.tall : film;
  const labels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  const open = () => {
    setStill(prefersStill(window));
    setUpright(window.matchMedia("(orientation: portrait) and (max-width: 640px)").matches);
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild onClick={open}>
        {trigger ?? (
          <Button type="button" variant="ghost" size="lg" className="kz-home-film-trigger">
            <PlayIcon size={15} aria-hidden /> {h.film} <span className="kz-home-film-length">{h.filmLength}</span>
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content size="lg" closeLabel={h.filmClose} className="kz-home-film">
        <Dialog.Title className="sr-only">{w.brand.player}</Dialog.Title>
        <VideoPlayer
          key={play.mp4}
          src={play.mp4}
          poster={play.poster}
          preload="none"
          autoPlay={!still}
          title={w.brand.player}
          labels={labels}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
