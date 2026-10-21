"use client";

/* The home's ambient loop — the flock on the hero's valley (krizaka-ui tools/brand-films, « home-ambient »): a muted,
   seamless 12 s backdrop that melts into the page's surface. The poster paints first (the hero's text stays the LCP);
   the video is created only after mount, plays only while on screen and pauses off it; under reduced motion or
   Save-Data the poster stays (the live flock too is still). The posters load lazily (the other theme's never), the film only after `load`. One per theme (html.light hides the other, which then never intersects, never loads);
   the wide cut above 640 px, the 4:5 cut below. Decorative. */

import { Flock } from "@krizaka/ui/flock";
import { useEffect, useRef, useState } from "react";

import { FLOCK_TALL, FLOCK_WIDE } from "@/lib/home-flock";

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
      {/* The birds are live (krizaka-ui Flock): at ease in character, glancing at each other, the pigeon delivering — over a
          valley that has none. Same frame as the film (cover, anchored at the bottom), so they stand on its ridge. */}
      <Flock className="kz-flock kz-flock-wide" tone="own" ratio={FLOCK_WIDE.ratio} birds={FLOCK_WIDE.birds} />
      <Flock className="kz-flock kz-flock-tall" tone="own" ratio={FLOCK_TALL.ratio} birds={FLOCK_TALL.birds} />
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
