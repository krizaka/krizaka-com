"use client";

/* Small helpers of the gallery: "now" only exists in the reader's browser, and the phone's loop must rest for those
   who asked for less motion. */

import { useState, useSyncExternalStore } from "react";

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

const MONEY_LOCALE = { en: "en-CA", fr: "fr-CA" } as const;

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
