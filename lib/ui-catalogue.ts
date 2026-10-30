/* The catalogue of Krizaka UI, for the search of /open-source: every component and template of the published registries
   of @krizaka/ui and @krizaka/charts (their registry/index.json, built from each component's own meta.ts in krizaka-ui),
   reduced to what a search shows — its name, its title, its category. Deprecated entries are left out (they are on
   their way out of the package). Read at build, on the server; the matching itself is pure (lib/catalogue-match.ts),
   so the client receives only this slice, never the registry. When a registry cannot be read, the list is empty and the
   page shows no search — never a list typed here. */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { UI_REGISTRIES } from "./ui-facts.ts";
import type { CatalogueEntry } from "./catalogue-match.ts";

interface IndexItem {
  name: string;
  title?: string;
  category?: string;
  status?: string;
}

/** The registries' word for an entry on its way out of the package (meta.ts `status`). */
const DEPRECATED = "deprecated";

async function read(pkg: string): Promise<IndexItem[]> {
  try {
    const file = path.join(process.cwd(), "node_modules", pkg, "registry", "index.json");
    const index = JSON.parse(await readFile(file, "utf8")) as { items?: IndexItem[] };
    return index.items ?? [];
  } catch {
    return [];
  }
}

/** Every live entry of the registries, sorted by title; one per name (the first registry wins). */
export async function uiCatalogue(
  items: (pkg: string) => Promise<IndexItem[]> | IndexItem[] = read,
): Promise<CatalogueEntry[]> {
  const all = await Promise.all(UI_REGISTRIES.map((pkg) => items(pkg)));
  const live = all.flat().filter((i) => i.status !== DEPRECATED);
  const byName = new Map<string, CatalogueEntry>();
  live.forEach((i) => {
    if (!byName.has(i.name)) {
      byName.set(i.name, { name: i.name, title: i.title ?? i.name, category: i.category ?? "" });
    }
  });
  return [...byName.values()].sort((a, b) => a.title.localeCompare(b.title, "en"));
}
