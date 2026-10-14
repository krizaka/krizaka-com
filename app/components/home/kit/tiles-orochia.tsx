"use client";

/* Orochia's tiles: media. The player, the trimmer over a filmstrip, the round cropper, the camera, and the figures of
   an auction and a goal (Canadian dollars). Media are Krizaka's own AI-generated clips (home/kit on the CDN), neutral — component demos, not app stories. */

import { useState } from "react";
import { Countdown } from "@krizaka/ui/countdown";
import { GoalGauge } from "@krizaka/ui/goal-gauge";
import { ImageCropper, type CropValue } from "@krizaka/ui/image-cropper";
import { MediaCapture } from "@krizaka/ui/media-capture";
import ShortClip from "./ShortClip";
import { VideoTrimmer } from "@krizaka/ui/video-trimmer";
import { Sparkline } from "@krizaka/charts/sparkline";
import { format } from "@krizaka/i18n";
import { useI18n } from "../../I18nProvider";
import { KIT_CLIP_SECONDS, KIT_COUNTDOWN_MS, KIT_MOMENT_MS, KIT_CURRENCY, KIT_GOAL, KIT_SERIES_CENTS } from "@/lib/kit-live";
import { money, useTargetIn } from "./shared";
import type { KitTileProps } from "./types";

export default function OrochiaTile({ id, media, brand }: KitTileProps) {
  const { t, locale } = useI18n();
  const k = t.site.home.build.kit;
  const [kept, setKept] = useState<[number, number]>([1.2, 4.4]);
  const [crop, setCrop] = useState<CropValue>({ x: 0.5, y: 0.28, zoom: 1 });
  const moment = brand === "yororis";
  const end = useTargetIn(moment ? KIT_MOMENT_MS : KIT_COUNTDOWN_MS);
  const v = k.video.labels;
  const trim = k.trimmer.labels;

  switch (id) {
    case "video-player":
      return (
        <>
        <ShortClip
          avatar={media.avatar}
          title={k.video.title}
          src={media.clip.src}
          poster={media.clip.poster}
          labels={{
            play: v.play, pause: v.pause, mute: v.mute, unmute: v.unmute, volume: v.volume, seek: v.seek, fullscreen: v.fullscreen,
            exitFullscreen: v.exitFullscreen, pictureInPicture: v.pictureInPicture, loading: v.loading, error: v.error, retry: v.retry,
            speed: (rate) => format(v.speed, { rate }),
            captions: (track) => format(v.captions, { track: track ?? v.captionsOff }),
            time: (time, duration) => format(v.time, { time, duration }),
          }}
        />
        <p className="kl-muted kl-credit">{k.media.credit}</p>
        </>
      );
    case "video-trimmer":
      return <><VideoTrimmer duration={KIT_CLIP_SECONDS} value={kept} onValueChange={setKept} frames={media.frames} labels={{ start: trim.start, end: trim.end, playhead: trim.playhead, kept: (length) => format(trim.kept, { length }) }} /><p className="kl-muted kl-credit">{k.media.credit}</p></>;
    case "image-cropper":
      return <><div className="kl-narrow"><ImageCropper src={media.crop} aspect={1} round value={crop} onValueChange={setCrop} labels={k.cropper.labels} /></div><p className="kl-muted kl-credit">{k.media.credit}</p></>;
    case "media-capture":
      return <><div className="kl-capture" style={{ "--kl-viewfinder": `url(${media.capture})` } as React.CSSProperties}><MediaCapture aspectRatio="3 / 2" mode="photo" facing="user" onCapture={() => {}} labels={k.capture.labels} /></div><p className="kl-muted kl-credit">{k.media.credit}</p></>;
    case "countdown":
      return end !== null ? <Countdown target={end} units={k.countdown.units} label={moment ? k.yororis.moment : k.auction.label} size="md" /> : <span className="kl-countdown-rest" aria-hidden />;
    case "goal-gauge":
      return <GoalGauge label={k.gauge.label} segments={KIT_GOAL.segments} value={KIT_GOAL.reached} valueText={format(k.gauge.text, { raised: money(KIT_GOAL.raisedCents, locale, KIT_CURRENCY), target: money(KIT_GOAL.targetCents, locale, KIT_CURRENCY) })} />;
    case "sparkline":
      return (
        <>
          <p className="kl-figure">{money(KIT_SERIES_CENTS[KIT_SERIES_CENTS.length - 1]!, locale, KIT_CURRENCY)}</p>
          <Sparkline title={k.chart.title} data={KIT_SERIES_CENTS} variant="area" trendTone width={240} height={48} format={{ style: "money", currency: KIT_CURRENCY }} />
        </>
      );
    default:
      return null;
  }
}
