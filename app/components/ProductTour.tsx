"use client";

/* Product tour — screen recordings of the real application, one per tab, chained: when a clip
   ends the next tab starts. Muted, inline, lazy (only the active clip loads). Under
   prefers-reduced-motion nothing autoplays: the poster shows and the native controls play on demand. */

import { useRef, useState, useSyncExternalStore } from "react";

export interface TourClip {
  id: string;
  label: string;
  caption: string;
  /** Path without extension: `${src}.webm`, `${src}.mp4`, `${src}.jpg` must exist under /public. */
  src: string;
}

/* prefers-reduced-motion without an animation library; the server and the first client render say "still". */
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function ProductTour({ clips, accent = "var(--kz-accent)", frameLabel }: { clips: TourClip[]; accent?: string; frameLabel: string }) {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => true);
  const [i, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const setI = (next: number | ((k: number) => number)) => {
    setProgress(0);
    setIndex(next);
  };
  const video = useRef<HTMLVideoElement>(null);
  const clip = clips[i];

  return (
    <div className="pt" style={{ ["--pt" as string]: accent }}>
      <div className="pt-tabs" role="tablist">
        {clips.map((c, k) => (
          <button key={c.id} role="tab" aria-selected={k === i} className="pt-tab" onClick={() => setI(k)}>
            <span className="pt-tab-num">{String(k + 1).padStart(2, "0")}</span> {c.label}
          </button>
        ))}
      </div>

      <figure className="pt-frame">
        <div className="pt-chrome" aria-hidden>
          <span /><span /><span />
          <em>{frameLabel}</em>
        </div>
        <video
          key={clip.id}
          ref={video}
          className="pt-video"
          poster={`${clip.src}.jpg`}
          muted
          playsInline
          autoPlay={!reduce}
          controls={reduce}
          preload={reduce ? "none" : "auto"}
          onEnded={() => setI((k) => (k + 1) % clips.length)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
          aria-label={clip.caption}
        >
          <source src={`${clip.src}.webm`} type="video/webm" />
          <source src={`${clip.src}.mp4`} type="video/mp4" />
        </video>
        {!reduce && <div className="pt-progress" style={{ transform: `scaleX(${progress})` }} />}
        <figcaption className="pt-caption">{clip.caption}</figcaption>
      </figure>

      <style>{`
        .pt-tabs { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px; }
        .pt-tab { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 13px;
          font-weight: 600; color: var(--kz-text-secondary); background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: all 150ms ease; }
        .pt-tab:hover { color: var(--kz-text-primary); }
        .pt-tab[aria-selected="true"] { color: var(--kz-text-primary); border-color: var(--pt); box-shadow: 0 0 0 3px color-mix(in srgb, var(--pt) 18%, transparent); }
        .pt-tab-num { font-family: var(--font-mono); font-size: 11px; color: var(--kz-accent-text); }
        .pt-frame { position: relative; margin: 0; border-radius: 18px; overflow: hidden; border: 1px solid var(--kz-border-default);
          background: var(--kz-media); box-shadow: var(--kz-shadow-lg), 0 0 60px color-mix(in srgb, var(--pt) 16%, transparent); }
        .pt-chrome { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: var(--kz-surface-2); border-bottom: 1px solid var(--kz-border-subtle); }
        .pt-chrome span { width: 10px; height: 10px; border-radius: 50%; background: var(--kz-border-strong); }
        .pt-chrome em { margin-left: 10px; font-style: normal; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .pt-video { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: var(--kz-media); }
        .pt-progress { position: absolute; left: 0; right: 0; top: 41px; height: 2px; background: var(--pt); transform-origin: left; transition: transform 250ms linear; opacity: .8; }
        .pt-caption { padding: 12px 16px; font-size: 13px; color: var(--kz-text-secondary); background: var(--kz-surface-1); border-top: 1px solid var(--kz-border-subtle); }
      `}</style>
    </div>
  );
}
