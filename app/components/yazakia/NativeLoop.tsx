"use client";

/* The same loop of the Yazakia demo, recorded on an iPhone simulator with the native components of Krizaka UI
   (products/yazakia/mobile/loop-<theme>, scripted on a 30 s clock). It plays only while on screen, and not at all under
   reduced motion (the poster stays). */

import { useEffect, useRef } from "react";
import type { NativeLoops } from "@/lib/yazakia-demo";
import { useI18n } from "../I18nProvider";
import { useLightTheme, usePrefersReducedMotion } from "../home/kit/shared";

export default function NativeLoop({ loops }: { loops: NativeLoops }) {
  const { t } = useI18n();
  const n = t.site.yazakia.demo.native;
  const clip = useLightTheme() ? loops.light : loops.dark;
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  const visible = useRef(false);

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
    <figure className="yd-native">
      <div className="yd-native-phone">
        <video key={clip.mp4} ref={ref} className="yd-native-video" muted loop playsInline preload="metadata" poster={clip.poster} aria-label={n.alt}>
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
      </div>
      <figcaption>
        <strong>{n.title}</strong>
        <span>{n.caption}</span>
      </figcaption>
    </figure>
  );
}
