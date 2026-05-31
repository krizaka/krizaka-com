import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

type Locale = "fr" | "en";

const normalize = (locale: string): Locale => (locale === "en" ? "en" : "fr");

/**
 * Self-referential, localized canonical + hreflang alternates for one page.
 *
 * - `canonical` is the page's OWN localized URL (never the bare "/", which the
 *   middleware 307-redirects per Accept-Language).
 * - `languages` advertises every locale of THIS path, with `x-default` → en
 *   (the international fallback), matching the middleware and the sitemap.
 *
 * @param locale active locale ("fr" | "en")
 * @param path   route path WITHOUT locale prefix, "" for home, else "/contact"
 */
export function buildAlternates(
  locale: string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const loc = normalize(locale);
  const p = path === "/" ? "" : path; // home is "/{loc}", never "/{loc}/"
  return {
    canonical: `${SITE_URL}/${loc}${p}`,
    languages: {
      "fr-CA": `${SITE_URL}/fr${p}`,
      en: `${SITE_URL}/en${p}`,
      "x-default": `${SITE_URL}/en${p}`,
    },
  };
}

type LocalizedCopy = {
  title: string;
  description: string;
  /** Optional Open Graph copy when it differs from the page title/description. */
  og?: { title: string; description: string };
};

/**
 * Per-page metadata in one call: picks the locale copy and attaches the
 * self-referential canonical + hreflang (+ Open Graph when provided). Pages that
 * need still more (e.g. `keywords`) spread the result:
 * `{ ...localizedMetadata(...), keywords: [...] }`.
 */
export function localizedMetadata(
  locale: string,
  opts: { path: string; en: LocalizedCopy; fr: LocalizedCopy },
): Metadata {
  const copy = normalize(locale) === "en" ? opts.en : opts.fr;
  const meta: Metadata = {
    title: copy.title,
    description: copy.description,
    alternates: buildAlternates(locale, opts.path),
  };
  if (copy.og) {
    meta.openGraph = { title: copy.og.title, description: copy.og.description };
  }
  return meta;
}
