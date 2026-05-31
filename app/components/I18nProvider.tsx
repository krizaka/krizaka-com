"use client";


import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  type Locale,
  type TranslationDictionary,
  DEFAULT_LOCALE,
  getDictionary,
} from "@/lib/i18n";

/* ─── Context shape ─── */

interface I18nContextValue {
  locale: Locale;
  t: TranslationDictionary;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: getDictionary(DEFAULT_LOCALE),
  setLocale: () => {},
  toggleLocale: () => {},
});

/* ─── Provider ─── */

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback((l: Locale) => {
    if (!pathname) return;
    
    const segments = pathname.split("/");
    // segments[0] is always empty due to leading slash
    if (segments[1] === "fr" || segments[1] === "en") {
      segments[1] = l;
    } else {
      segments.splice(1, 0, l);
    }
    
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  }, [pathname, router]);

  const toggleLocale = useCallback(() => {
    const next = locale === "fr" ? "en" : "fr";
    setLocale(next);
  }, [locale, setLocale]);

  const t = getDictionary(locale);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ─── Hook ─── */

export function useI18n() {
  return useContext(I18nContext);
}
