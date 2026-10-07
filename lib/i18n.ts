/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — i18n
   ─────────────────────────────────────────────────────────────────
   Every user-facing string lives in messages/<locale>.json — never in a
   component (`locale === "fr" ? … : …` is refused by ESLint).
   - en.json is the reference: its shape is the TranslationDictionary type.
   - fr.json must have exactly the same keys (type-checked below and by
     `npm run i18n:check`, which also refuses empty strings).
   - Components read `t` from useI18n() (client) or getDictionary(locale)
     (server) and use format() for {placeholders}.
   ═══════════════════════════════════════════════════════════════════ */

import en from "@/messages/en.json";
import frMessages from "@/messages/fr.json";

export type Locale = "fr" | "en";

export const DEFAULT_LOCALE: Locale = "en";

export type TranslationDictionary = typeof en;

// A key missing from (or added to) fr.json fails type-checking here.
const fr: TranslationDictionary = frMessages;

const dictionaries: Record<Locale, TranslationDictionary> = { fr, en };

export function getDictionary(locale: Locale | string): TranslationDictionary {
  return dictionaries[locale === "fr" ? "fr" : "en"];
}

/** Narrows a route segment to a supported locale (English for anything else). */
export function asLocale(value: string): Locale {
  return value === "fr" ? "fr" : "en";
}

/** Replaces `{name}` placeholders: format("{count} repositories", { count: 23 }). */
export function format(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Cookie the locale switch writes and `proxy.ts` honours: English unless the visitor chose French. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
