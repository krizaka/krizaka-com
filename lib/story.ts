/* "Our story" — the structure of /story and its home teaser. Krizaka is the studio that tells it: it forges the
   platform (the open building blocks), Orazaka is the engine, and the products run on both. Every text lives in
   messages/<locale>.json under site.story; this module keeps structure only.

   - The products come from lib/nav.ts (NAV_PRODUCTS, the one list of the site, with their release state): a product
     added there gets its stage here as soon as its words exist (site.story.chapters.<id>) — nothing is listed twice.
   - Each stage carries the bird in its corner, the input of its promise ("special move"), and what it runs on.
   - Every figure is computed (lib/orochia-economics.ts, the registries, the generated data): none is typed here. */

import { MASCOT_BIRDS } from "@krizaka/ui/mascots";
import { NAV_PRODUCTS, type NavProduct } from "./nav";
import { PLATFORM_FEE_PERCENTAGE } from "./orochia-economics";

/** The kits a product can run on — the platform's blocks, then the engine. Texts: site.story.kits.<id>. */
export const KITS = ["ui", "foundations", "realtime", "java", "engine"] as const;
export type KitId = (typeof KITS)[number];

/** The packages and artifacts each kit stands for: their versions are read from the registries at build. */
export const KIT_PACKAGES: Record<Exclude<KitId, "engine">, readonly string[]> = {
  ui: ["@krizaka/ui"],
  foundations: ["@krizaka/tokens", "@krizaka/icons", "@krizaka/intl"],
  realtime: ["@krizaka/realtime", "@krizaka/push"],
  java: ["com.krizaka:krizaka-platform-kit"],
};

export interface StageStructure {
  /** The bird in the stage's corner — it carries the promise (one bird per idea). Ignored until @krizaka/ui draws it. */
  bird: string;
  /** The input of the special move, key by key (decorative). */
  combo: readonly string[];
  /** The figure on the stage's gauge, 0–1 — computed, or a design rule (100 %: never a share given away). */
  stat?: number;
  /** What it runs on, from its manifests (package.json, pom.xml) — see the source on each line. */
  runsOn: readonly KitId[];
}

/** The studio: the narrator, and the forge of the platform. The duck builds: the code, the tests, the docs. */
export const STUDIO = { id: "krizaka", bird: "duck", combo: ["↓", "↘", "→", "P"] } as const;

/** The engine: the product the others are powered by. */
export const ENGINE: NavProduct["id"] = "orazaka";

/** The stages of the products, by id. A product of NAV_PRODUCTS without an entry here is not staged. */
const STAGES: Record<string, StageStructure> = {
  /* The owl reads your documents and keeps every question in the house: 100 % of the data stays home.
     orazaka-apps/ui/*: @krizaka/ui, tokens, icons, intl; the services build on krizaka-platform-kit (architecture.json,
     layer "krizaka"). */
  orazaka: { bird: "owl", combo: ["←", "↙", "↓", "↘", "→", "K"], stat: 1, runsOn: ["ui", "foundations", "java"] },
  /* The flamingo gets paid: the creator keeps what the platform does not take (PLATFORM_FEE_PERCENTAGE).
     orochia/package.json: @krizaka/ui, tokens, icons, intl, realtime, push. */
  orochia: { bird: "flamingo", combo: ["→", "↓", "↘", "P+K"], stat: 1 - PLATFORM_FEE_PERCENTAGE / 100, runsOn: ["ui", "foundations", "realtime"] },
  /* The lovebird introduces: a batch opens only when the interest goes both ways (100 % mutual, by design).
     The Yazakia brand ships in @krizaka/ui; its matching runs on Orazaka (lib/org-data.ts, its stack). */
  yazakia: { bird: "lovebird", combo: ["↓", "↓", "→", "P"], stat: 1, runsOn: ["ui", "foundations", "engine"] },
  /* The crane: a listening space with a face and a voice, powered by Orazaka's wellbeing pack (under construction).
     Staged once it is in NAV_PRODUCTS and its words exist. */
  yororis: { bird: "crane", combo: ["←", "→", "↓", "K"], runsOn: ["ui", "foundations", "engine"] },
};

/** The staged products, in the site's order: the engine first, then the products it powers. */
export function storyProducts(hasWords: (id: string) => boolean) {
  const products = NAV_PRODUCTS.filter((p) => STAGES[p.id] && hasWords(p.id)).map((p) => ({ ...p, ...STAGES[p.id]! }));
  return [...products.filter((p) => p.id === ENGINE), ...products.filter((p) => p.id !== ENGINE)];
}
export type StoryProduct = ReturnType<typeof storyProducts>[number];

/** True when @krizaka/ui draws this bird (the crane joins with its release). */
export const isFlockBird = (bird: string): bird is (typeof MASCOT_BIRDS)[number] => (MASCOT_BIRDS as readonly string[]).includes(bird);

/** The flock, in the order the page shows it: the birds @krizaka/ui draws, then the phoenix — each only once its words
    exist (site.story.flock.<id>). */
export function flock(hasWords: (id: string) => boolean): string[] {
  return [...MASCOT_BIRDS, "phoenix"].filter(hasWords);
}

/** The motes of light that float over the select screen: position (%) and size (px) — a fixed, hand-placed field. */
export const DUST = [
  [8, 22, 2], [15, 64, 3], [22, 38, 2], [31, 78, 2], [38, 16, 3], [46, 58, 2], [53, 30, 2], [61, 72, 3],
  [68, 12, 2], [74, 48, 2], [82, 26, 3], [88, 66, 2], [93, 40, 2], [27, 52, 2], [57, 88, 2], [79, 84, 2],
] as const;
