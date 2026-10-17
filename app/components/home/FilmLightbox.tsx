"use client";

/* « Watch the full film »: the 44 s « Le monde de Krizaka » in a dialog (the same cut, captions and words as /story).
   Nothing is fetched before it opens: the player's code is loaded on open (next/dynamic), the film with preload none. */

import dynamic from "next/dynamic";
import { format } from "@krizaka/i18n";
import { PlayIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { useI18n } from "@/app/components/I18nProvider";

const VideoPlayer = dynamic(() => import("@krizaka/ui/video-player").then((m) => m.VideoPlayer), { ssr: false });

export default function FilmLightbox({ mp4, poster }: { mp4: string; poster: string }) {
  const { t, locale } = useI18n();
  const h = t.site.home.hero;
  const w = t.site.story.world;
  const labels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button type="button" variant="ghost" size="lg" shape="cut" className="kz-home-film-trigger">
          <PlayIcon size={15} aria-hidden /> {h.film} <span className="kz-home-film-length">{h.filmLength}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="lg" closeLabel={h.filmClose} className="kz-home-film">
        <Dialog.Title className="sr-only">{w.title}</Dialog.Title>
        <VideoPlayer
          src={mp4}
          poster={poster}
          preload="none"
          autoPlay
          title={w.player}
          tracks={(["en", "fr"] as const).map((lang) => ({ src: `/${lang}/story/film.vtt`, srcLang: lang, label: w.captions[lang], default: lang === locale }))}
          labels={labels}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
