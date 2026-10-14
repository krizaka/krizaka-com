/* The catalogue of /docs/ui as data: one entry per component, with where it sits, what it is, why it is there and what
   its card shows. Built on the server from the registry (the code of the package), lib/ui-ia.ts and lib/ui-inventory.ts. */

import { readFileSync } from "node:fs";
import path from "node:path";
import { exampleKey, getRegistryItems, type Platform, type RegistryItem, type Status } from "@/lib/ui-registry";
import { filterKeyOf } from "@/lib/ui-ia";
import { type InventoryState, inventoryOf, type Product } from "@/lib/ui-inventory";

/** What a card shows above its title: the live example (loaded on view), a screenshot of a mobile one, or nothing yet. */
export type CatalogPreview =
  | { kind: "live"; key: string; heavy: boolean }
  | { kind: "shot"; dark: string; light: string; width: number; height: number; alt: string }
  | null;

export interface CatalogEntry {
  name: string;
  title: string;
  summary: string;
  platforms: Platform;
  status: Status;
  /** The filter value of its group: a job, a pattern or `templates` (lib/ui-ia.ts FILTER_KEYS). */
  group: string;
  /** Who imports it today. */
  usedBy: Product[];
  /** Used, planned or leaving — and the one line that says why. */
  state: InventoryState | null;
  why: string;
  href: string;
  preview: CatalogPreview;
}

/** Categories whose examples are whole pages, maps, charts or media: they load once the page has settled. */
const HEAVY_CATEGORIES = new Set(["charts", "media", "templates", "layouts"]);
const HEAVY_NAMES = new Set(["map", "video-player", "audio-player", "terminal-replay", "scroll-stage", "iso", "landscape"]);

/** A PNG's size from its header, so a screenshot reserves its space. */
function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

function previewOf(item: RegistryItem, alt: string): CatalogPreview {
  const web = item.web?.examples[0];
  if (web) return { kind: "live", key: exampleKey(web), heavy: HEAVY_CATEGORIES.has(item.category) || HEAVY_NAMES.has(item.name) };
  const shot = item.native?.examples.find((example) => example.screenshots);
  if (!shot?.screenshots) return null;
  const file = (theme: "dark" | "light") => shot.screenshots![theme].replace(/^examples\//, "");
  try {
    return { kind: "shot", dark: `/ui-examples/${file("dark")}`, light: `/ui-examples/${file("light")}`, ...pngSize(path.join(process.cwd(), "public", "ui-examples", file("dark"))), alt };
  } catch {
    return null;
  }
}

export function catalogEntries(locale: string, previewAlt: (name: string) => string): CatalogEntry[] {
  return getRegistryItems().map((item) => {
    const inventory = inventoryOf(item.name, item.status, item.deprecated);
    return {
      name: item.name,
      title: item.title,
      summary: item.summary,
      platforms: item.platforms,
      status: item.status,
      group: filterKeyOf(item),
      usedBy: inventory?.usedBy ?? [],
      state: inventory?.state ?? null,
      why: inventory?.why ?? "",
      href: `/${locale}/docs/ui/${item.name}`,
      preview: previewOf(item, previewAlt(item.title)),
    };
  });
}
