"use client";

/* One recording of the real application, framed like the product tour. Its poster loads only near the screen (a page
   of clips never competes with its first paint); it plays muted and in a loop only while it is on screen, so a page
   of clips never runs four videos at once; under prefers-reduced-motion nothing plays on
   its own — the poster shows and the native controls play on demand. */

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { Video } from "@/lib/cdn";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** `portrait`: a phone recording (9:20), framed at a phone's width instead of a 16:10 window.
 *  `bare`: a 9:16 clip that carries its own phone and captions (the mobile promo) — no window chrome around it. */
export default function DemoClip({ media, label, frameLabel = "", portrait = false, bare = false }: { media: Video; label: string; frameLabel?: string; portrait?: boolean; bare?: boolean }) {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => true);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.poster = media.poster;
        near.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(el);
    return () => near.disconnect();
  }, [media.poster]);

  useEffect(() => {
    const el = video.current;
    if (!el || reduce) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, [reduce]);

  return (
    <figure className={bare ? "dc-frame dc-bare" : portrait ? "dc-frame dc-portrait" : "dc-frame"}>
      {!bare && (
        <div className="dc-chrome" aria-hidden>
          <span /><span /><span />
          <em>{frameLabel}</em>
        </div>
      )}
      <video
        ref={video}
        className="dc-video"
        muted
        loop
        playsInline
        controls={reduce}
        preload="none"
        aria-label={label}
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
      </video>
      <style>{`
        .dc-frame { margin: 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--kz-border-default);
          background: var(--kz-media); box-shadow: var(--kz-shadow-lg); }
        .dc-chrome { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: var(--kz-surface-2); border-bottom: 1px solid var(--kz-border-subtle); }
        .dc-chrome span { width: 9px; height: 9px; border-radius: 50%; background: var(--kz-border-strong); }
        .dc-chrome em { margin-left: 8px; font-style: normal; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .dc-video { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: var(--kz-media); }
        .dc-portrait { width: min(100%, 300px); margin-inline: auto; border-radius: 28px; }
        .dc-portrait .dc-video { aspect-ratio: 9 / 20; object-fit: contain; }
        .dc-bare { width: min(100%, 340px); margin-inline: auto; border-radius: 24px; }
        .dc-bare .dc-video { aspect-ratio: 9 / 16; }
      `}</style>
    </figure>
  );
}
