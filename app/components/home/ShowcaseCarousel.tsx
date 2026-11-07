"use client";

/* One carousel of the home (krizaka-internal#2450): the hero's, and one per product. It moves on by itself (founder,
   2026-11-05, AGENTS.md §4 names this one exception to « nothing moves on its own »), with the rules of WCAG 2.2.2:
   - a visible pause / play, and it holds while the pointer is over it or the keyboard focus is in it (the clip pauses and
     resumes), and while it is off screen;
   - a video slide lasts as long as its video (krizaka-internal#2837): it moves on at the clip's end, a clip never loops, so
     no last frame is held; a still slide stays a fixed time. lib/showcase-player.ts holds these rules, tested;
   - under prefers-reduced-motion (or Save-Data) nothing moves on and no clip starts by itself: the posters, previous / next,
     and a play button on a video slide (at the clip's end its poster comes back);
   - previous / next are buttons, the arrow keys on them turn too; the counter is announced only while nothing moves on;
   - every slide is a figure with its caption (« Fig. 3b — … ») and its text alternative (the poster's alt), and the whole
     carousel has its text version (rendered on the server, passed as children: a film's transcript is there).
   Media: every slide is 16:9 on every screen, the phone included (object-fit: cover; founder, 2026-11-05: no vertical). The
   poster is drawn only for the slide in view, the ones already seen and the next one; the clip (muted, inline) is mounted
   only for the slide in view, after the page's load and once the carousel has been on screen, so the LCP is a poster, never a clip, and a
   carousel below the fold downloads no film. A film's lighter cut goes to phones, chosen once on the client (pickSources).
   If the clip cannot play (a file missing, a codec refused, autoplay refused) it unmounts and the poster stays.
   Sound: only after the visitor's click on the sound control of a slide that has sound, for that slide while it plays on
   screen; another slide or scrolling away mutes it again. The carousel block of @krizaka/ui (MediaCarousel) never moves on
   by itself: this composition is noted for krizaka-ui (an `autoplay` variant). */

import { useEffect, useEffectEvent, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { IconButton } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";
import ButtonLink from "@/app/components/ButtonLink";
import { prefersStill } from "@/lib/brand-film";
import {
  DWELL_MS,
  initialPlayer,
  pickSources,
  playerView,
  stepPlayer,
  type PlayerEnv,
  type PlayerEvent,
  type PlayerSource,
  type PlayerState,
} from "@/lib/showcase-player";

export interface ShowcaseSlideView {
  id: string;
  /** « 3b »: the figure's number. */
  fig: string;
  caption: string;
  alt: string;
  poster: string;
  /** The video's sources, best first (empty for a still slide); a lighter cut names its screens in `media`. */
  videos: readonly PlayerSource[];
  /** True when the video has an audio track. */
  audio: boolean;
  /** The slide's one action, when it plays only a loop of a film: « Watch Nadia's story · 1 min 25 », to its watch page. */
  watch?: { href: string; label: string };
}

const subscribeMedia = (query: string) => (notify: () => void) => {
  const list = globalThis.matchMedia(query);
  list.addEventListener("change", notify);
  return () => list.removeEventListener("change", notify);
};
const subscribeCalm = subscribeMedia("(prefers-reduced-motion: reduce)");
/** True when the visitor asked for less: nothing moves on, no clip starts by itself. True on the server too (still first). */
function useStill(): boolean {
  return useSyncExternalStore(
    subscribeCalm,
    () => prefersStill(globalThis),
    () => true,
  );
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

/** The clip of the slide in view: plays and pauses as the player says, sounds only when it says, reports its end, its
 *  progress and a failure. Its sources are chosen once, on mount, for this screen. */
function Clip({
  slide,
  playing,
  audible,
  onEnded,
  onBroken,
  onProgress,
}: Readonly<{
  slide: ShowcaseSlideView;
  playing: boolean;
  audible: boolean;
  onEnded: () => void;
  onBroken: () => void;
  onProgress: (fraction: number) => void;
}>) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sources] = useState(() => pickSources(slide.videos, (q) => globalThis.matchMedia(q).matches));
  const refused = useEffectEvent(onBroken);
  useEffect(() => {
    if (ref.current) {
      ref.current.muted = !audible;
    }
  }, [audible]);
  useEffect(() => {
    const v = ref.current;
    if (!v) {
      return;
    }
    if (playing) {
      // A browser that refuses even a muted autoplay (a phone's power saving) leaves the poster, and the dwell moves on.
      v.play().catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "NotAllowedError") {
          refused();
        }
      });
    } else {
      v.pause();
    }
  }, [playing]);
  return (
    <video
      ref={ref}
      className="kz-show-media"
      poster={slide.poster}
      muted
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onEnded={onEnded}
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        onProgress(v.duration > 0 ? v.currentTime / v.duration : 0);
      }}
    >
      {/* The best first; the last one failing leaves the poster. */}
      {sources.map((src, i) => (
        <source key={src.src} src={src.src} type={src.type} onError={i === sources.length - 1 ? onBroken : undefined} />
      ))}
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
  const env: PlayerEnv = {
    slides: slides.map((s) => ({ video: s.videos.length > 0, audio: s.audio })),
    still,
    loaded,
  };
  const [state, dispatch] = useReducer(
    (s: PlayerState, e: PlayerEvent) => stepPlayer(s, e, env),
    undefined,
    initialPlayer,
  );
  const view = playerView(state, env);
  const root = useRef<HTMLElement>(null);
  const tick = useRef<HTMLSpanElement>(null);
  const total = slides.length;
  const { active } = state;

  useEffect(() => {
    const el = root.current;
    if (!el) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      dispatch({ type: "screen", on: true });
      return;
    }
    const io = new IntersectionObserver(([entry]) => dispatch({ type: "screen", on: entry.isIntersecting }), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (view.clock !== "dwell") {
      return;
    }
    const timer = globalThis.setTimeout(() => dispatch({ type: "dwell" }), DWELL_MS);
    return () => globalThis.clearTimeout(timer);
  }, [view.clock, active]);

  const go = (to: number) => dispatch({ type: "go", to });
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
  const onEnded = () => dispatch({ type: "ended" });
  const onBroken = () => dispatch({ type: "broken", slide: active });
  // The current tick fills with the clip's progress (a video slide) or over the dwell (a still one, in CSS).
  const onProgress = (fraction: number) => tick.current?.style.setProperty("--kz-show-progress", String(fraction));

  const current = slides[active];
  const moving = view.clock !== "none";
  return (
    <section
      ref={root}
      className={cn("kz-show", className)}
      aria-roledescription={w.carousel}
      aria-label={label}
      data-clock={view.clock}
      onPointerEnter={() => dispatch({ type: "hover", on: true })}
      onPointerLeave={() => dispatch({ type: "hover", on: false })}
      onFocus={() => dispatch({ type: "focus", on: true })}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          dispatch({ type: "focus", on: false });
        }
      }}
    >
      <div className="rd-plate kz-show-stage">
        {slides.map((s, i) => {
          const draw = state.seen.includes(i) || i === (active + 1) % total;
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
                    src={s.poster}
                    alt={s.alt}
                    decoding="async"
                    loading={i === 0 ? undefined : "lazy"}
                  />
                </picture>
              )}
              {here && view.clip && (
                <Clip
                  key={s.id}
                  slide={s}
                  playing={view.playing}
                  audible={view.audible}
                  onEnded={onEnded}
                  onBroken={onBroken}
                  onProgress={onProgress}
                />
              )}
            </figure>
          );
        })}
        {view.playButton && (
          <IconButton
            variant="primary"
            size="lg"
            className="kz-show-play"
            label={format(w.playVideo, { caption: current.caption })}
            onClick={() => dispatch({ type: "watch" })}
            onKeyDown={onKey}
          >
            <PlayGlyph />
          </IconButton>
        )}
        {view.soundControl && (
          <IconButton
            variant="secondary"
            size="sm"
            className="kz-show-sound"
            label={w.sound}
            aria-pressed={state.sound}
            onClick={() => dispatch({ type: "sound" })}
            onKeyDown={onKey}
          >
            <SoundGlyph on={state.sound} />
          </IconButton>
        )}
        <ol className="kz-show-ticks" aria-hidden>
          {slides.map((s, i) => (
            <li key={s.id} data-state={tickState(i, active)}>
              {i === active && (
                <span
                  key={view.clip ? `clip-${active}` : `${active}-${view.clock}`}
                  ref={tick}
                  data-progress={view.clip ? "" : undefined}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="kz-show-bar">
        <p className="rd-plate-caption kz-show-caption" aria-live={moving ? "off" : "polite"}>
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
          {view.pauseControl && (
            <IconButton
              variant="secondary"
              size="sm"
              label={state.stopped ? w.play : w.pause}
              onClick={() => dispatch({ type: "toggle" })}
              onKeyDown={onKey}
            >
              {state.stopped ? <PlayGlyph /> : <PauseGlyph />}
            </IconButton>
          )}
          <IconButton variant="secondary" size="sm" label={w.next} onClick={() => go(active + 1)} onKeyDown={onKey}>
            <Chevron />
          </IconButton>
        </fieldset>
      </div>
      {slides.some((s) => s.watch) && (
        // Always the height of the action, so a slide without one moves nothing (no layout shift as the slides turn).
        <div className="kz-show-watch">
          {current.watch && (
            <ButtonLink href={current.watch.href} variant="secondary" size="sm">
              {current.watch.label}
            </ButtonLink>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
