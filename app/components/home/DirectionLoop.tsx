"use client";

/* « Where we are going », the loop (founder, 2026-11-05, krizaka-internal#2450: « keep the idea, smarter and more
   ergonomic, with a looping animation that gives more detail of each target »). Three stations — now, next, later — on
   one line on a wide screen and down the page on a phone; the light rests on one station at a time and opens what it
   holds (its details), then moves on, every 4.5 s, and loops. WCAG 2.2.2: a visible pause / play, paused while the
   pointer is over it or the focus is in it and while it is off screen. Under prefers-reduced-motion nothing moves and
   every station shows its details. A station is also a button: pressing it rests the light there (and pauses). */

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { IconButton } from "@krizaka/ui/button";

export interface DirectionStation {
  id: string;
  title: string;
  body: string;
  details: ReactNode;
}

// @fixed: how long the light rests on a station, a reading time for its two or three lines.
const REST_MS = 4500;

const subscribeCalm = (notify: () => void) => {
  const list = window.matchMedia("(prefers-reduced-motion: reduce)");
  list.addEventListener("change", notify);
  return () => list.removeEventListener("change", notify);
};
const useCalm = () =>
  useSyncExternalStore(
    subscribeCalm,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );

function Glyph({ paused }: Readonly<{ paused: boolean }>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      {paused ? (
        <path d="M5 3l8 5-8 5z" fill="currentColor" />
      ) : (
        <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      )}
    </svg>
  );
}

export default function DirectionLoop({
  stations,
  labels,
}: Readonly<{
  stations: readonly DirectionStation[];
  labels: { pause: string; play: string; list: string };
}>) {
  const calm = useCalm();
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const moving = !calm && !stopped && !held && onScreen;

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!moving) return;
    const timer = window.setTimeout(() => setOn((i) => (i + 1) % stations.length), REST_MS);
    return () => window.clearTimeout(timer);
  }, [moving, on, stations.length]);

  return (
    <div
      ref={root}
      className="kz-dir"
      data-calm={calm ? "" : undefined}
      data-moving={moving ? "" : undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      {!calm && (
        <IconButton
          variant="ghost"
          size="sm"
          className="kz-dir-toggle"
          label={stopped ? labels.play : labels.pause}
          onClick={() => setStopped((v) => !v)}
        >
          <Glyph paused={stopped} />
        </IconButton>
      )}
      <ol className="kz-dir-line" aria-label={labels.list}>
        {stations.map((st, i) => {
          const lit = calm || i === on;
          return (
            <li key={st.id} className="kz-dir-station" data-lit={lit ? "" : undefined} data-step={st.id}>
              <button
                type="button"
                className="kz-dir-head"
                aria-expanded={lit}
                aria-controls={`kz-dir-${st.id}`}
                onClick={() => {
                  setOn(i);
                  setStopped(true);
                }}
              >
                <span className="kz-dir-mark" aria-hidden />
                <span className="kz-dir-title">{st.title}</span>
                {i === on && moving && <span key={on} className="kz-dir-time" aria-hidden />}
              </button>
              <p className="kz-dir-body">{st.body}</p>
              <div id={`kz-dir-${st.id}`} className="kz-dir-details" hidden={!lit}>
                {st.details}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
