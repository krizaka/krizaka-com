/* Krizaka UI in figures, read at build from the published registries of @krizaka/ui and @krizaka/charts (their
   registry/index.json, built from the components' own code in krizaka-ui): how many components, how many also run on
   iOS and Android. Deprecated ones are not counted. When a registry cannot be read, its figures are 0 and the home
   drops them — never a number typed here. Server only. */

import { readFileSync } from "node:fs";
import path from "node:path";

interface IndexItem {
  name: string;
  platforms?: "web" | "native" | "both";
  status?: string;
}

export const UI_REGISTRIES = ["@krizaka/ui", "@krizaka/charts"] as const;

function items(pkg: string): IndexItem[] {
  try {
    const file = path.join(process.cwd(), "node_modules", pkg, "registry", "index.json");
    const index = JSON.parse(readFileSync(file, "utf8")) as { items?: IndexItem[] };
    return (index.items ?? []).filter((i) => i.status !== "deprecated");
  } catch {
    return [];
  }
}

/** The components of Krizaka UI, and those that also run natively (React Native). */
export function uiFacts(): { components: number; native: number } {
  const all = UI_REGISTRIES.flatMap(items);
  return { components: all.length, native: all.filter((i) => i.platforms && i.platforms !== "web").length };
}
