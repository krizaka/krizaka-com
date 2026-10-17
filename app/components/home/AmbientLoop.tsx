"use client";

/* The home's ambient loop — the flock on the hero's valley (krizaka-ui tools/brand-films, « home-ambient »): a muted,
   seamless 12 s backdrop that melts into the page's surface. The poster paints first (the hero's text stays the LCP);
   the video is created only after mount, plays only while on screen and pauses off it; under reduced motion or
   Save-Data the poster stays. One per theme (html.light hides the other, which then never intersects, never loads);
   the wide cut above 640 px, the 4:5 cut below. Decorative. */

import { useEffect, useRef, useState } from "react";

export interface AmbientSources {
  webm: string;
  mp4: string;
  poster: string;
}
export type AmbientSet = Record<"wide" | "tall", Record<"dark" | "light", AmbientSources>>;

const TALL = "(max-width: 640px)";

function Layer({ theme, set }: { theme: "dark" | "light"; set: AmbientSet }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [cut, setCut] = useState<"wide" | "tall" | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduce || saveData || typeof IntersectionObserver === "undefined" || !box.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) setCut((c) => c ?? (window.matchMedia(TALL).matches ? "tall" : "wide"));
      const v = video.current;
      if (!v) return;
      if (entry.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    }, { threshold: 0.1 });
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    video.current?.play().catch(() => undefined);
  }, [cut]);

  const src = cut ? set[cut][theme] : null;
  return (
    <div ref={box} className="kz-ambient-layer" data-theme-only={theme}>
      <picture>
        <source media={TALL} srcSet={set.tall[theme].poster} />
        <img src={set.wide[theme].poster} alt="" decoding="async" fetchPriority="low" />
      </picture>
      {src ? (
        <video ref={video} muted loop playsInline autoPlay preload="auto" poster={src.poster} aria-hidden>
          <source src={src.webm} type="video/webm" />
          <source src={src.mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

export default function AmbientLoop({ set }: { set: AmbientSet }) {
  return (
    <div className="kz-ambient" aria-hidden>
      <Layer theme="dark" set={set} />
      <Layer theme="light" set={set} />
    </div>
  );
}
