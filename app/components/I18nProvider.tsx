"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createI18nReact } from "@krizaka/i18n/react";
import type { TranslationDictionary } from "@/lib/i18n";
import { type Locale, LOCALES, LOCALE_COOKIE, isLocale } from "@/lib/locales";

/* ─── The active catalogue, handed down by the server ───
   The locale layout resolves the dictionary (getDictionary) and passes ONLY that one to @krizaka/i18n/react, bound
   here to the locales alone: the client never bundles messages/*.json (both catalogues were ~60 kB of JavaScript on
   every page, parsed before the first paint counted — Lighthouse LCP). Text components keep reading `t` (the
   catalogue) from useI18n(); format and <Rich> stay @krizaka/i18n. */

const engine = createI18nReact<TranslationDictionary, Locale>({ locales: LOCALES, defaultLocale: "en" });

interface I18nValue {
  locale: Locale;
  /** The active catalogue: t.site.nav… */
  t: TranslationDictionary;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

export function I18nProvider({ children, locale, messages }: { children: ReactNode; locale: Locale; messages: TranslationDictionary }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback((l: Locale) => {
    if (!pathname) return;

    const segments = pathname.split("/");
    // segments[0] is always empty due to leading slash
    if (isLocale(segments[1])) {
      segments[1] = l;
    } else {
      segments.splice(1, 0, l);
    }

    // Remember the choice, so unprefixed URLs (/, shared links) open in this language next time.
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  }, [pathname, router]);

  return (
    <engine.I18nProvider locale={locale} messages={messages} setLocale={setLocale}>
      {children}
    </engine.I18nProvider>
  );
}

/* ─── Hook: `t` is the active catalogue (t.site.nav…), as every component reads it ─── */

export function useI18n(): I18nValue {
  const { locale, messages, setLocale } = engine.useI18n();
  return useMemo(
    () => ({ locale, t: messages, setLocale, toggleLocale: () => setLocale(LOCALES.find((l) => l !== locale) ?? locale) }),
    [locale, messages, setLocale],
  );
}
