/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — i18n
   ─────────────────────────────────────────────────────────────────
   Every user-facing string lives in messages/<locale>.json — never in a
   component (`locale === "fr" ? … : …` is refused by ESLint).
   - en.json is the reference: its shape is the TranslationDictionary type.
   - fr.json must have exactly the same keys (type-checked below and by
     `npm run i18n:check` = `krizaka-i18n check messages`, which also
     refuses empty strings and differing {placeholders} or markup).
   - Components read `t` from useI18n() (client) or getDictionary(locale)
     (server) and use format() for {placeholders}.
   The engine (lookup, fallback, format, <Rich>) is @krizaka/i18n, shared
   with every Krizaka app: this file only binds it to the site's catalogues.
   ═══════════════════════════════════════════════════════════════════ */

import { createI18n } from "@krizaka/i18n";

import en from "@/messages/en.json";
import frMessages from "@/messages/fr.json";

export type Locale = "fr" | "en";

export const DEFAULT_LOCALE: Locale = "en";

export type TranslationDictionary = typeof en;

// A key missing from (or added to) fr.json fails type-checking here.
const fr: TranslationDictionary = frMessages;

export const i18n = createI18n<TranslationDictionary, Locale>({ fr, en }, { defaultLocale: DEFAULT_LOCALE });

export function getDictionary(locale: Locale | string): TranslationDictionary {
  return i18n.getDictionary(locale);
}

/** Narrows a route segment to a supported locale (English for anything else). */
export function asLocale(value: string): Locale {
  return i18n.asLocale(value);
}

/** Replaces `{name}` placeholders: format("{count} repositories", { count: 23 }). */
export { format } from "@krizaka/i18n";

/** Cookie the locale switch writes and `proxy.ts` honours: English unless the visitor chose French. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
