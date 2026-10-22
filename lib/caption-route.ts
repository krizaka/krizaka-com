import { filmVtt, vttResponse } from "@/lib/film-captions";
import { asLocale, getDictionary, type TranslationDictionary } from "@/lib/i18n";

type Cues = Parameters<typeof filmVtt>[1];

/** The two caption routes (/story/film.vtt, /story/relay.vtt) differ by their words and their cue times only: the locales and the handler are shared. */
export const captionLocales = () => [{ locale: "en" }, { locale: "fr" }];

export function captionHandler(wordsOf: (dictionary: TranslationDictionary) => Record<string, string>, cues?: Cues) {
  return async (_request: Request, { params }: { params: Promise<{ locale: string }> }) =>
    vttResponse(filmVtt(wordsOf(getDictionary(asLocale((await params).locale))), cues));
}
