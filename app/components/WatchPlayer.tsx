"use client";

/* The player of a film's watch page (/<locale>/films/<id>): @krizaka/ui's MediaPlayer, inline, in the site's words. Nothing
   plays by itself (a visitor who asked for less gets the same): the poster waits and its default preload is metadata, which keeps the page
   light. The page keeps its video structured data (contentUrl, thumbnail) and the text version of the shots. */

import { MediaPlayer } from "@krizaka/ui/media-player";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";

export default function WatchPlayer({ src, poster, title }: Readonly<{ src: string; poster: string; title: string }>) {
  const { t } = useI18n();
  const w = t.site.story.world;
  const labels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  return <MediaPlayer src={src} poster={poster} title={title} labels={labels} />;
}
