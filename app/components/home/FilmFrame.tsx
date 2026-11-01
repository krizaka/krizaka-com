"use client";

/* « Fig. 1 — Montrer son travail »: the plate of the home's hero. A thin ink frame holds a silent 10 s loop cut from the
   brand film (the owl, the beaver and the duck at work; lib/brand-film.ts `loop`), seen without a click. The poster paints
   first; the video is created only after the page has loaded, plays only while on screen and pauses off it. Under reduced
   motion or Save-Data nothing plays: the poster stays, the frame opens the film. The loop is decorative (aria-hidden); the
   frame is one button that opens the full film with sound (FilmLightbox), and a second one pauses the loop (WCAG 2.2.2).
   Nothing moves under the pointer. */

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@krizaka/icons";
import { useI18n } from "@/app/components/I18nProvider";
import { prefersStill } from "@/lib/brand-film";
import FilmLightbox, { type LightboxFilm } from "./FilmLightbox";

export interface LoopSources {
  webm: string;
  mp4: string;
  poster: string;
}

export default function FilmFrame({ loop, film, length }: { loop: LoopSources; film: LightboxFilm; length: string }) {
  const { t } = useI18n();
  const fig = t.site.home.hero.fig;
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || prefersStill(window) || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        if (entry.isIntersecting) {
          setArmed(true);
        }
        const v = video.current;
        if (!v) {
          return;
        }
        if (entry.isIntersecting && !userPaused.current) {
          v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    // Nothing of the loop before the page has loaded: the first screen's text, fonts and styles come first (LCP).
    const watch = () => observer.observe(el);
    if (document.readyState === "complete") {
      watch();
    } else {
      window.addEventListener("load", watch, { once: true });
    }
    return () => {
      window.removeEventListener("load", watch);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (armed && !userPaused.current) {
      video.current?.play().catch(() => undefined);
    }
  }, [armed]);

  const toggle = () => {
    const v = video.current;
    if (!v) {
      return;
    }
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current) {
      v.pause();
    } else {
      v.play().catch(() => undefined);
    }
  };

  return (
    <div ref={box} className="kz-fig-frame">
      {/* eslint-disable-next-line @next/next/no-img-element -- a CDN poster at its fixed ratio, painted under the loop */}
      <img src={loop.poster} alt="" width={1280} height={720} decoding="async" fetchPriority="low" />
      {armed ? (
        <video ref={video} muted loop playsInline autoPlay preload="auto" poster={loop.poster} aria-hidden>
          <source src={loop.webm} type="video/webm" />
          <source src={loop.mp4} type="video/mp4" />
        </video>
      ) : null}
      <FilmLightbox
        film={film}
        trigger={
          <button type="button" className="kz-fig-open" aria-label={`${fig.open} · ${length}`}>
            <span className="kz-fig-chip" aria-hidden>
              <PlayIcon size={13} /> {length}
            </span>
          </button>
        }
      />
      {armed ? (
        <button type="button" className="kz-fig-pause" aria-pressed={paused} onClick={toggle}>
          {paused ? <PlayIcon size={13} aria-hidden /> : <PauseIcon size={13} aria-hidden />}
          <span className="sr-only">{paused ? fig.play : fig.pause}</span>
        </button>
      ) : null}
    </div>
  );
}
