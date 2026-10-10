"use client";

/* One recording of the real application, framed like the product tour. It plays muted and in a loop only while it
   is on screen, so a page of clips never runs four videos at once; under prefers-reduced-motion nothing plays on
   its own — the poster shows and the native controls play on demand. */

import { useEffect, useRef, useSyncExternalStore } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function DemoClip({ src, label, frameLabel }: { src: string; label: string; frameLabel: string }) {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => true);
  const video = useRef<HTMLVideoElement>(null);

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
    <figure className="dc-frame">
      <div className="dc-chrome" aria-hidden>
        <span /><span /><span />
        <em>{frameLabel}</em>
      </div>
      <video
        ref={video}
        className="dc-video"
        poster={`${src}.jpg`}
        muted
        loop
        playsInline
        controls={reduce}
        preload="none"
        aria-label={label}
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
      <style>{`
        .dc-frame { margin: 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--kz-border-default);
          background: var(--kz-media); box-shadow: var(--kz-shadow-lg); }
        .dc-chrome { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: var(--kz-surface-2); border-bottom: 1px solid var(--kz-border-subtle); }
        .dc-chrome span { width: 9px; height: 9px; border-radius: 50%; background: var(--kz-border-strong); }
        .dc-chrome em { margin-left: 8px; font-style: normal; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .dc-video { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: var(--kz-media); }
      `}</style>
    </figure>
  );
}
