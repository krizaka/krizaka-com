"use client";

/* The home's cinematic intro, once per browser session (WWW-HERO, 2026-10-17). It renders nothing: it only sets
   `html[data-intro]`, and home.css plays the choreography — the Krizaka mark draws itself, the birds fly to their places,
   a light sweeps the backdrop — for about 1.2 s, while the figures climb (NumberTicker). The text is never part of it:
   the title, the lead and the actions are painted at once (LCP).

   - `play`: the first visit of the session, motion allowed, no Save-Data.
   - `skip`: already seen this session, reduced motion or Save-Data — everything at rest at once.
   - `done`: the intro ended, or the visitor skipped it (any key, pointer, wheel or touch).
   Without JavaScript the decorations fade in by themselves (home.css), so nothing stays hidden.
   No animation frame, no library: CSS animations and one timer. */

import { useEffect } from "react";

const SESSION_KEY = "kz-intro";
// @fixed: the length of the choreography in home.css (the longest animation plus its delay), a fact of the CSS.
const INTRO_MS = 1600;
const SKIP_EVENTS = ["keydown", "pointerdown", "wheel", "touchstart"] as const;

function saveData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

function seenThisSession(): boolean {
  try {
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";
    sessionStorage.setItem(SESSION_KEY, "1");
    return seen;
  } catch {
    return false;
  }
}

export default function HeroIntro() {
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || saveData() || seenThisSession()) {
      html.dataset.intro = "skip";
      return;
    }
    html.dataset.intro = "play";
    const finish = () => {
      html.dataset.intro = "done";
      window.clearTimeout(timer);
      for (const type of SKIP_EVENTS) window.removeEventListener(type, finish);
    };
    const timer = window.setTimeout(finish, INTRO_MS);
    for (const type of SKIP_EVENTS) window.addEventListener(type, finish, { passive: true });
    return finish;
  }, []);
  return null;
}
