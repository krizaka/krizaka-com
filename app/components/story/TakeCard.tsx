"use client";

/* A product's real take on /story: its poster (a frame of the recording, fixed small size — 9:16 for a phone), and the
   take in a lightbox on click: the player's code and the video are fetched only then (next/dynamic, preload none),
   never autoplayed in the text. Under reduced motion or Save-Data the take still waits for the click. */

import dynamic from "next/dynamic";
import Image from "next/image";
import { format } from "@krizaka/i18n";
import { PlayIcon } from "@krizaka/icons";
import { Dialog } from "@krizaka/ui/dialog";
import { useI18n } from "@/app/components/I18nProvider";
import type { Take } from "@/lib/story-takes";

const VideoPlayer = dynamic(() => import("@krizaka/ui/video-player").then((m) => m.VideoPlayer), { ssr: false });

export default function TakeCard({ take, name, id, other }: { take: Take; name: string; /** The product's id: its captions are /<locale>/story/captions/<id>. */ id: string; /** The page's language is not the take's. */ other?: boolean }) {
  const { t, locale } = useI18n();
  const w = t.site.story.world;
  const k = t.site.story.products.take;
  const labels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  const film = take.ratio === "film";
  const title = format(film ? k.renderPlayer : k.player, { name });
  return (
    <div className="st-take" data-ratio={take.ratio}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" className="st-take-card" aria-label={`${film ? k.watchRender : k.watch} — ${name}`}>
            <Image className="st-take-poster" src={take.poster} alt="" width={take.ratio === "phone" ? 360 : film ? 640 : 640} height={take.ratio === "phone" ? 640 : film ? 360 : 540} sizes="(min-width: 900px) 200px, 50vw" unoptimized={take.poster.endsWith(".webp")} />
            <span className="st-take-play" aria-hidden>
              <PlayIcon size={20} />
            </span>
          </button>
        </Dialog.Trigger>
        <Dialog.Content size={take.ratio === "phone" ? "sm" : film ? "lg" : "md"} closeLabel={k.close} className="st-take-dialog" data-ratio={take.ratio}>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <VideoPlayer aspectRatio={take.ratio === "phone" ? "9 / 16" : film ? "16 / 9" : "19 / 16"} src={take.mp4} poster={take.poster} preload="none" autoPlay title={title} labels={labels}
            tracks={(["en", "fr"] as const).map((lang) => ({ src: `/${lang}/story/captions/${id}`, srcLang: lang, label: w.captions[lang], default: lang === locale }))} />
        </Dialog.Content>
      </Dialog.Root>
      <p className="st-take-note">
        {film ? k.watchRender : k.watch}
        {other && take.lang && <span> · {k.inLang[take.lang]}</span>}
      </p>
    </div>
  );
}
