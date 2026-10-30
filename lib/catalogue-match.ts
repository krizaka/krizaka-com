/* The search of the Krizaka UI catalogue on /open-source — pure, shared by the server (tests) and the client.
   An entry is a component or a template of the registries (lib/ui-catalogue.ts); its page is on ui.krizaka.com
   (the same addresses as krizaka-ui apps/site/lib/urls.ts: /components/<name>, French under /fr). */

export interface CatalogueEntry {
  name: string;
  title: string;
  category: string;
}

export const UI_SITE = "https://ui.krizaka.com";

/** The entry's page on ui.krizaka.com, in the reader's language (English has no prefix). */
const PREFIX: Record<string, string> = { en: "", fr: "/fr" };

export function cataloguePageUrl(name: string, locale: string): string {
  return `${UI_SITE}${PREFIX[locale] ?? ""}/components/${name}`;
}

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** The entries a query finds: a title or name that starts with it first, then one that contains it, then the
    category; at most `limit`. An empty query finds nothing (the hints say where to start). */
export function matchCatalogue(entries: readonly CatalogueEntry[], query: string, limit = 8): CatalogueEntry[] {
  const q = fold(query.trim());
  if (!q) {
    return [];
  }
  const rank = (e: CatalogueEntry) => {
    const title = fold(e.title);
    const name = e.name.toLowerCase();
    if (title.startsWith(q) || name.startsWith(q)) {
      return 0;
    }
    if (title.includes(q) || name.includes(q.replaceAll(" ", "-"))) {
      return 1;
    }
    return fold(e.category).includes(q) ? 2 : -1;
  };
  return entries
    .map((e) => ({ e, r: rank(e) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r)
    .slice(0, limit)
    .map((x) => x.e);
}
