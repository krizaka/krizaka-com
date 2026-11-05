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
   Media: each slide has two renditions (lib/home-showcase.ts), 16:9 for ≥ 640 px and 4:5 for phones. The poster is a
   <picture> (the browser fetches one), drawn only for the slide in view, the ones already seen and the next one; the clip
   (muted, no audio track) is mounted only for the slide in view, after the page's load, in the rendition the viewport
   chose, so the phone never fetches the desktop file and the h1 stays the LCP. The carousel block of @krizaka/ui
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
  tall: ShowcaseRendition;
}

// @fixed: how long a slide stays before the next one, a reading time (a caption and a short clip), not a setting.
const DWELL_MS = 6500;
const WIDE_QUERY = "(min-width: 640px)";

const subscribeMedia = (query: string) => (notify: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", notify);
  return () => list.removeEventListener("change", notify);
};
/** The viewport's rendition: `null` on the server (no clip is rendered there). */
function useRendition(): "wide" | "tall" | null {
  return useSyncExternalStore(
    subscribeMedia(WIDE_QUERY),
    () => (window.matchMedia(WIDE_QUERY).matches ? "wide" : "tall"),
    () => null,
  );
}
const subscribeCalm = subscribeMedia("(prefers-reduced-motion: reduce)");
/** True when the visitor asked for less: nothing advances, no clip plays. True on the server too (still first). */
function useStill(): boolean {
  return useSyncExternalStore(
    subscribeCalm,
    () => prefersStill(window),
    () => true,
  );
}
const subscribeLoad = (notify: () => void) => {
  window.addEventListener("load", notify);
  return () => window.removeEventListener("load", notify);
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

function Clip({ r, playing, first }: Readonly<{ r: ShowcaseRendition; playing: boolean; first: "webm" | "mp4" }>) {
  const ref = useRef<HTMLVideoElement>(null);
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
      {/* The lighter encode first: VP9 on the 16:9 rendition, H.264 on the phone's 4:5 one (measured on the renders). */}
      {first === "webm" && <source src={r.webm} type="video/webm" />}
      <source src={r.mp4} type="video/mp4" />
      {first === "mp4" && <source src={r.webm} type="video/webm" />}
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
  const rendition = useRendition();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const total = slides.length;
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
    const timer = window.setTimeout(() => {
      const next = (active + 1) % total;
      setActive(next);
      remember(next);
    }, DWELL_MS);
    return () => window.clearTimeout(timer);
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
      <div className="kz-show-stage">
        {slides.map((s, i) => {
          const draw = seen.has(i) || i === (active + 1) % total;
          const here = i === active;
          return (
            <figure
              key={s.id}
              className="kz-show-slide"
              role="group"
              aria-roledescription={w.slide}
              aria-label={format(w.slideOf, { n: String(i + 1), total: String(total) })}
              aria-hidden={here ? undefined : true}
              inert={here ? undefined : true}
              data-active={here ? "" : undefined}
            >
              {draw && (
                <picture>
                  <source media={WIDE_QUERY} srcSet={s.wide.poster} />
                  <img
                    className="kz-show-media"
                    src={s.tall.poster}
                    alt={s.alt}
                    decoding="async"
                    loading={i === 0 ? undefined : "lazy"}
                  />
                </picture>
              )}
              {here && loaded && !still && rendition && (
                <Clip
                  key={rendition}
                  r={s[rendition]}
                  playing={onScreen && !stopped}
                  first={rendition === "wide" ? "webm" : "mp4"}
                />
              )}
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
        <p className="kz-show-caption" aria-live={advancing ? "off" : "polite"}>
          <span className="kz-show-count">
            {active + 1} / {total}
          </span>
          {format(w.figure, { fig: current.fig, caption: current.caption })}
        </p>
        <div className="kz-show-controls" role="group" aria-label={format(w.controls, { label })} onKeyDown={onKey}>
          <IconButton variant="secondary" size="sm" label={w.previous} onClick={() => go(active - 1)}>
            <Chevron back />
          </IconButton>
          {!still && (
            <IconButton
              variant="secondary"
              size="sm"
              label={stopped ? w.play : w.pause}
              onClick={() => setStopped((v) => !v)}
            >
              {stopped ? <PlayGlyph /> : <PauseGlyph />}
            </IconButton>
          )}
          <IconButton variant="secondary" size="sm" label={w.next} onClick={() => go(active + 1)}>
            <Chevron />
          </IconButton>
        </div>
      </div>
      {children}
    </section>
  );
}
