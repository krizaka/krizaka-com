"use client";

import { createI18nReact } from "@krizaka/i18n/react";
import { useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { type Locale, type TranslationDictionary, LOCALE_COOKIE, i18n } from "@/lib/i18n";

/* ─── The shared engine's context (@krizaka/i18n), bound to the site's catalogues ─── */

const shared = createI18nReact(i18n);

/* ─── Provider: the site decides how a locale switch happens (URL prefix + cookie) ─── */

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback((l: Locale) => {
    if (!pathname) return;

    const segments = pathname.split("/");
    // segments[0] is always empty due to leading slash
    if (i18n.isLocale(segments[1])) {
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
    <shared.I18nProvider locale={locale} setLocale={setLocale}>
      {children}
    </shared.I18nProvider>
  );
}

/* ─── Hook: `t` is the active catalogue (t.site.nav…), as every component reads it ─── */

export function useI18n(): {
  locale: Locale;
  t: TranslationDictionary;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
} {
  const { locale, messages, setLocale } = shared.useI18n();
  const toggleLocale = useCallback(() => {
    setLocale(i18n.locales.find((l) => l !== locale) ?? locale);
  }, [locale, setLocale]);
  return { locale, t: messages, setLocale, toggleLocale };
}
