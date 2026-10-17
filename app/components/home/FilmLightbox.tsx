"use client";

/* « Watch the full film »: the 44 s « Le monde de Krizaka » in a dialog (the same cut, captions and words as /story);
   nothing is fetched before it opens. */

import { format } from "@krizaka/i18n";
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { VideoPlayer } from "@krizaka/ui/video-player";
import { useI18n } from "@/app/components/I18nProvider";

export default function FilmLightbox({ mp4, poster }: { mp4: string; poster: string }) {
  const { t, locale } = useI18n();
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
        <Button variant="ghost" size="md" className="kz-home-film-trigger">
          <span aria-hidden>▶</span> {t.site.home.hero.film}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="lg" closeLabel={t.site.home.hero.filmClose}>
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
