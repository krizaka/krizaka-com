"use client";

/* One carousel of the home (krizaka-internal#2450): the hero's, and one per product. It advances on its own (founder,
   2026-11-05, AGENTS.md §4 names this one exception to « nothing moves on its own »), with the rules of WCAG 2.2.2:
   - a visible pause / play, and it pauses while the pointer is over it or the keyboard focus is in it, and while it is off
     screen;
   - under prefers-reduced-motion (or Save-Data) nothing advances and no clip plays: the posters, and the previous / next
     buttons;
   - previous / next are buttons, the arrow keys on them turn too; the counter is announced only while nothing advances;
   - every slide is a figure with its caption (« Fig. 3b — … ») and its text alternative (the poster's alt), and the whole
     carousel has its text version (rendered on the server, passed as children).
   Media: every slide has one rendition, 16:9, on every screen, the phone included (object-fit: cover; founder,
   2026-11-05: no vertical anywhere). The poster is drawn only for the slide in view, the ones already seen and the next
   one; the clip (muted) is mounted only for the slide in view, after the page's load, so the h1 stays the LCP. If the
   clip cannot play (a file missing, a codec refused) it unmounts and the poster stays.
   Sound is an option: clips are muted; a toggle appears only when a slide has an audio track (none has today); once
   the visitor has pressed it, hovering or focusing the carousel unmutes the clip and leaving it mutes again. The choice
   lasts for the session (sessionStorage); under reduced motion nothing plays, so nothing sounds. The carousel block of @krizaka/ui
   (MediaCarousel) never advances by itself: this composition is noted for krizaka-ui (an `autoplay` variant). */

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { IconButton } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";
import { prefersStill } from "@/lib/brand-film";

export interface ShowcaseRendition {
  mp4: string;
  webm: string;
  poster: string;
}
export interface ShowcaseSlideView {
  id: string;
  /** « 3b »: the figure's number. */
  fig: string;
  caption: string;
  alt: string;
  wide: ShowcaseRendition;
  /** True when the clip has an audio track. */
  audio: boolean;
}

// @fixed: how long a slide stays before the next one, a reading time (a caption and a short clip), not a setting.
const DWELL_MS = 6500;
const subscribeMedia = (query: string) => (notify: () => void) => {
  const list = globalThis.matchMedia(query);
  list.addEventListener("change", notify);
  return () => list.removeEventListener("change", notify);
};
const subscribeCalm = subscribeMedia("(prefers-reduced-motion: reduce)");
/** True when the visitor asked for less: nothing advances, no clip plays. True on the server too (still first). */
function useStill(): boolean {
  return useSyncExternalStore(
    subscribeCalm,
    () => prefersStill(globalThis),
    () => true,
  );
}
const SOUND_KEY = "kz-show-sound";
const SOUND_EVENT = "kz-show-sound-change";
const subscribeSound = (notify: () => void) => {
  globalThis.addEventListener(SOUND_EVENT, notify);
  return () => globalThis.removeEventListener(SOUND_EVENT, notify);
};
/** The visitor's choice of sound, for this session only (false on the server and before any click). */
function useSound(): [boolean, () => void] {
  const on = useSyncExternalStore(
    subscribeSound,
    () => globalThis.sessionStorage?.getItem(SOUND_KEY) === "1",
    () => false,
  );
  const toggle = () => {
    globalThis.sessionStorage?.setItem(SOUND_KEY, on ? "0" : "1");
    globalThis.dispatchEvent(new Event(SOUND_EVENT));
  };
  return [on, toggle];
}
const subscribeLoad = (notify: () => void) => {
  globalThis.addEventListener("load", notify);
  return () => globalThis.removeEventListener("load", notify);
};
const usePageLoaded = () =>
  useSyncExternalStore(
    subscribeLoad,
    () => document.readyState === "complete",
    () => false,
  );

function PauseGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}
function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path d="M5 3l8 5-8 5z" fill="currentColor" />
    </svg>
  );
}
function SoundGlyph({ on }: Readonly<{ on: boolean }>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
      {on ? (
        <path d="M11 5.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}
function Chevron({ back }: Readonly<{ back?: boolean }>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path
        d={back ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** The state of a slide's tick: before the current one, the current one, or still to come. */
function tickState(i: number, active: number): "done" | "now" | undefined {
  if (i < active) {
    return "done";
  }
  return i === active ? "now" : undefined;
}

function Clip({ r, playing, sound }: Readonly<{ r: ShowcaseRendition; playing: boolean; sound: boolean }>) {
  const ref = useRef<HTMLVideoElement>(null);
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    if (ref.current) {
      ref.current.muted = !sound;
    }
  }, [sound]);
  useEffect(() => {
    const v = ref.current;
    if (!v) {
      return;
    }
    if (playing) {
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [playing]);
  if (broken) {
    return null;
  }
  return (
    <video
      ref={ref}
      className="kz-show-media"
      poster={r.poster}
      muted
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
    >
      {/* The lighter encode first (VP9); H.264 for what does not play it. Both failing leaves the poster. */}
      <source src={r.webm} type="video/webm" />
      <source src={r.mp4} type="video/mp4" onError={() => setBroken(true)} />
    </video>
  );
}

export default function ShowcaseCarousel({
  label,
  slides,
  children,
  className,
}: Readonly<{
  /** The carousel's accessible name. */
  label: string;
  slides: readonly ShowcaseSlideView[];
  /** The text version of every slide, rendered on the server. */
  children?: ReactNode;
  className?: string;
}>) {
  const { t } = useI18n();
  const w = t.site.home.showcase.labels;
  const still = useStill();
  const loaded = usePageLoaded();
  const [soundChosen, toggleSound] = useSound();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const total = slides.length;
  const hasAudio = slides.some((s) => s.audio);
  const advancing = !still && !stopped && !hovered && !focused && onScreen && total > 1;

  const remember = (i: number) => setSeen((seenBefore) => new Set(seenBefore).add(i));
  const go = (to: number) => {
    const next = (to + total) % total;
    setActive(next);
    remember(next);
  };

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!advancing) {
      return;
    }
    const timer = globalThis.setTimeout(() => {
      const next = (active + 1) % total;
      setActive(next);
      remember(next);
    }, DWELL_MS);
    return () => globalThis.clearTimeout(timer);
  }, [advancing, active, total]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      go(active - 1);
    } else {
      return;
    }
    e.preventDefault();
  };

  const current = slides[active];
  // Sound only after the visitor's click, only on the pointer or the keyboard focus, never under reduced motion.
  const sound = soundChosen && current.audio && (hovered || focused) && !still;
  return (
    <section
      ref={root}
      className={cn("kz-show", className)}
      aria-roledescription={w.carousel}
      aria-label={label}
      data-advancing={advancing ? "" : undefined}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      <div className="rd-plate kz-show-stage">
        {slides.map((s, i) => {
          const draw = seen.has(i) || i === (active + 1) % total;
          const here = i === active;
          return (
            <figure
              key={s.id}
              className="kz-show-slide"
              aria-roledescription={w.slide}
              aria-label={format(w.slideOf, { n: String(i + 1), total: String(total) })}
              aria-hidden={here ? undefined : true}
              inert={here ? undefined : true}
              data-active={here ? "" : undefined}
            >
              {draw && (
                <picture>
                  <img
                    className="kz-show-media"
                    src={s.wide.poster}
                    alt={s.alt}
                    decoding="async"
                    loading={i === 0 ? undefined : "lazy"}
                  />
                </picture>
              )}
              {here && loaded && !still && <Clip r={s.wide} playing={onScreen && !stopped} sound={sound} />}
            </figure>
          );
        })}
        <ol className="kz-show-ticks" aria-hidden>
          {slides.map((s, i) => (
            <li key={s.id} data-state={tickState(i, active)}>
              {i === active && <span key={`${active}-${advancing}`} />}
            </li>
          ))}
        </ol>
      </div>
      <div className="kz-show-bar">
        <p className="rd-plate-caption kz-show-caption" aria-live={advancing ? "off" : "polite"}>
          <span className="kz-show-count">
            {active + 1} / {total}
          </span>
          {format(w.figure, { fig: current.fig, caption: current.caption })}
        </p>
        <fieldset className="kz-show-controls">
          <legend className="sr-only">{format(w.controls, { label })}</legend>
          <IconButton variant="secondary" size="sm" label={w.previous} onClick={() => go(active - 1)} onKeyDown={onKey}>
            <Chevron back />
          </IconButton>
          {!still && (
            <IconButton
              variant="secondary"
              size="sm"
              label={stopped ? w.play : w.pause}
              onClick={() => setStopped((v) => !v)}
              onKeyDown={onKey}
            >
              {stopped ? <PlayGlyph /> : <PauseGlyph />}
            </IconButton>
          )}
          {hasAudio && !still && (
            <IconButton
              variant="secondary"
              size="sm"
              label={w.soundOn}
              aria-pressed={soundChosen}
              onClick={toggleSound}
              onKeyDown={onKey}
            >
              <SoundGlyph on={soundChosen} />
            </IconButton>
          )}
          <IconButton variant="secondary" size="sm" label={w.next} onClick={() => go(active + 1)} onKeyDown={onKey}>
            <Chevron />
          </IconButton>
        </fieldset>
      </div>
      {children}
    </section>
  );
}
