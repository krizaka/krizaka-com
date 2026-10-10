/* The locales and the locale cookie, without the catalogues: client code imports these without pulling
   messages/*.json into its bundle (the active catalogue comes from the server, see I18nProvider). */

export type Locale = "fr" | "en";
export const LOCALES: readonly Locale[] = ["en", "fr"];
export const isLocale = (value: string | undefined): value is Locale => LOCALES.includes(value as Locale);

/** Cookie the locale switch writes and `proxy.ts` honours: English unless the visitor chose French. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
