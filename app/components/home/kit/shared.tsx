"use client";

/* Small helpers of the gallery: "now" only exists in the reader's browser, and the phone's loop must rest for those
   who asked for less motion. */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** True once the page runs in the browser (a static page has no "now"): countdowns are drawn from then on. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** An instant `ms` from now, fixed at the first render in the browser (the countdown ticks down from the figure). */
export function useTargetIn(ms: number): number | null {
  const hydrated = useHydrated();
  const [target] = useState(() => (typeof window === "undefined" ? 0 : Date.now() + ms));
  return hydrated ? target : null;
}

/** The locales that write Canadian dollars with their country: "CA$252" (en), "252 $CA" (fr). */
const MONEY_LOCALE = { en: "en-US", fr: "fr-FR" } as const;

/** Money in integer cents, in the reader's language and Canadian dollars. */
export function money(cents: number, locale: string, currency: string, fractionDigits = 0): string {
  return new Intl.NumberFormat(MONEY_LOCALE[locale as keyof typeof MONEY_LOCALE] ?? "en-CA", { style: "currency", currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(cents / 100);
}

/** The reader asked for less motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** The site's theme: `html.light` is the light one (ThemeProvider). */
export function useLightTheme(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const observer = new MutationObserver(notify);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    },
    () => document.documentElement.classList.contains("light"),
    () => false,
  );
}

/** The part of `text` revealed so far: a few characters at a time once the block is on screen, all of it for
 *  those who prefer reduced motion. `done` flips when the whole text is shown. */
export function useStream(text: string, speedMs = 28): { shown: string; done: boolean; ref: React.RefObject<HTMLDivElement | null> } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const still = usePrefersReducedMotion();

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
