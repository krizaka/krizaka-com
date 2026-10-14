"use client";

/* The phone of "Krizaka UI, live": the native components of the same kit, recorded on an iPhone simulator under the
   chosen identity and theme. The loop plays only while the phone is on screen, and not at all under reduced motion
   (the poster stays). The other identities' posters are fetched ahead so the switch does not blink. */

import { useEffect, useRef } from "react";
import { format } from "@krizaka/i18n";
import type { Video } from "@/lib/cdn";
import { useI18n } from "../../I18nProvider";
import { usePrefersReducedMotion, useLightTheme } from "./shared";

export default function NativePhone({ phones, brand, brandName }: { phones: Record<string, Video>; brand: string; brandName: string }) {
  const { t } = useI18n();
  const n = t.site.home.build.kit.native;
  const light = useLightTheme();
  const reduced = usePrefersReducedMotion();
  const clip = phones[`${brand}-${light ? "light" : "dark"}`]!;
  const ref = useRef<HTMLVideoElement | null>(null);
  const visible = useRef(false);

  // Fetch the posters of the other identities ahead.
  useEffect(() => {
    for (const v of Object.values(phones)) new Image().src = v.poster;
  }, [phones]);

  // Play while on screen (and the motion is welcome), pause otherwise.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const sync = () => (visible.current && !reduced ? void video.play().catch(() => {}) : video.pause());
    const io = new IntersectionObserver(([entry]) => {
      visible.current = Boolean(entry?.isIntersecting);
      sync();
    });
    io.observe(video);
    sync();
    return () => io.disconnect();
  }, [clip, reduced]);

  return (
    <figure className="bk-phone-wrap">
      <div className="bk-phone">
        <div className="bk-phone-notch" aria-hidden />
        <div className="bk-phone-screen">
          <video
            key={clip.mp4}
            ref={ref}
            className="kl-phone-video"
            muted
            loop
            playsInline
            preload="metadata"
            poster={clip.poster}
            aria-label={format(n.alt, { brand: brandName })}
          >
            <source src={clip.webm} type="video/webm" />
            <source src={clip.mp4} type="video/mp4" />
          </video>
        </div>
      </div>
      <figcaption>
        <strong>{n.title}</strong>
        <span>{n.caption}</span>
      </figcaption>
    </figure>
  );
}
