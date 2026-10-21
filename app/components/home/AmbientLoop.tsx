"use client";

/* The valley, looping — the backdrop of the flock band that opens the products (ProductsFlock; krizaka-ui tools/brand-films
   « home-valley »: the sky, the peaks and the ridge, no birds): a muted, seamless 12 s loop. The poster paints first, the
   video is created only after mount and `load`, plays only while on screen and pauses off it; under reduced motion or
   Save-Data the poster stays. One layer per theme (html.light hides the other, which then never intersects, never loads);
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
    const el = box.current;
    if (reduce || saveData || typeof IntersectionObserver === "undefined" || !el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) setCut((c) => c ?? (window.matchMedia(TALL).matches ? "tall" : "wide"));
      const v = video.current;
      if (!v) return;
      if (entry.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    }, { threshold: 0.1 });
    // Nothing of the film before the page has loaded: the first screen's text, fonts and styles come first (LCP).
    const watch = () => observer.observe(el);
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    video.current?.play().catch(() => undefined);
  }, [cut]);

  const src = cut ? set[cut][theme] : null;
  return (
    <div ref={box} className="kz-ambient-layer" data-theme-only={theme}>
      <picture>
        <source media={TALL} srcSet={set.tall[theme].poster} />
        <img src={set.wide[theme].poster} alt="" decoding="async" fetchPriority="low" loading="lazy" />
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
