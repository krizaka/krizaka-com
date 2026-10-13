"use client";

/* Small helpers shared by the four compositions of "Krizaka UI, live": "today" only exists in the reader's browser,
   and a stream or a countdown must rest for those who asked for less motion. */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** True once the page runs in the browser (a static page has no "now"): countdowns are drawn from then on. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** No stream: the reader prefers reduced motion (or the browser cannot tell when the block is on screen). */
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const stillSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined";

/** An instant `ms` from now, fixed at the first render in the browser (so the countdown ticks down from the figure). */
export function useTargetIn(ms: number): number | null {
  const hydrated = useHydrated();
  const [target] = useState(() => (typeof window === "undefined" ? 0 : Date.now() + ms));
  return hydrated ? target : null;
}

/** The part of `text` revealed so far: a few characters at a time once the block is on screen, all of it for
 *  those who prefer reduced motion. `done` flips when the whole text is shown. */
export function useStream(text: string, speedMs = 28): { shown: string; done: boolean; ref: React.RefObject<HTMLDivElement | null> } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const still = useSyncExternalStore(subscribeMotion, stillSnapshot, () => false);

  useEffect(() => {
    const node = ref.current;
    if (still || !node) return;
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)));
    io.observe(node);
    return () => io.disconnect();
  }, [still]);

  useEffect(() => {
    if (still || !visible || count >= text.length) return;
    const id = window.setTimeout(() => setCount((c) => Math.min(text.length, c + 2)), speedMs);
    return () => window.clearTimeout(id);
  }, [still, visible, count, text, speedMs]);

  const shownCount = still ? text.length : count;
  return { shown: text.slice(0, shownCount), done: shownCount >= text.length, ref };
}

const MONEY_LOCALE = { en: "en-CA", fr: "fr-CA" } as const;

/** Money in integer cents, in the reader's language and Canadian dollars (Orochia's currency). */
export function money(cents: number, locale: string, currency: string, fractionDigits = 2): string {
  return new Intl.NumberFormat(MONEY_LOCALE[locale as keyof typeof MONEY_LOCALE] ?? "en-CA", { style: "currency", currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(cents / 100);
}
