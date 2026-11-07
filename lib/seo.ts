import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

type Locale = "fr" | "en";

const normalize = (locale: string): Locale => (locale === "en" ? "en" : "fr");

/**
 * Self-referential, localized canonical + hreflang alternates for one page.
 *
 * - `canonical` is the page's OWN localized URL (never the bare "/", which the
 *   middleware 307-redirects per Accept-Language).
 * - `languages` advertises every locale of THIS path, with `x-default` → fr
 *   (Loi 96: French first), matching the middleware and the sitemap.
 *
 * @param locale active locale ("fr" | "en")
 * @param path   route path WITHOUT locale prefix, "" for home, else "/contact"
 */
export function buildAlternates(locale: string, path: string): NonNullable<Metadata["alternates"]> {
  const loc = normalize(locale);
  const p = path === "/" ? "" : path; // home is "/{loc}", never "/{loc}/"
  return {
    canonical: `${SITE_URL}/${loc}${p}`,
    languages: {
      "fr-CA": `${SITE_URL}/fr${p}`,
      en: `${SITE_URL}/en${p}`,
      "x-default": `${SITE_URL}/fr${p}`,
    },
    // For AI engines: the machine-readable summary of the site, advertised in every page's <head>.
    types: { "text/plain": `${SITE_URL}/llms.txt` },
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
  return {
    // The layout appends " | Krizaka"; a title that already names the brand is left as is.
    title: /krizaka/i.test(copy.title) ? { absolute: copy.title } : copy.title,
    description: copy.description,
    alternates: buildAlternates(locale, opts.path),
    ...shareMetadata(locale, opts.path, copy.og ?? copy),
  };
}

/**
 * The page's own share card (founder, 2026-11-07, krizaka-internal#2833): its Open Graph and Twitter title and description,
 * and an `og:url` that is its canonical. Every page sets them, so no page shares as the home; the image is the route's own
 * `opengraph-image.tsx` (lib/og-card.tsx). A page's `openGraph` replaces the layout's, so the site's name and locale are here too.
 */
export function shareMetadata(
  locale: string,
  path: string,
  copy: { title: string; description: string },
): Pick<Metadata, "openGraph" | "twitter"> {
  const loc = normalize(locale);
  return {
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: buildAlternates(loc, path).canonical as string,
      siteName: "Krizaka",
      type: "website",
      locale: loc === "en" ? "en_US" : "fr_CA",
      alternateLocale: loc === "en" ? "fr_CA" : "en_US",
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}
