/* "Our story" — the structure of /story and its home teaser. Every text lives in
   messages/<locale>.json under site.story (intro, chapters.<id> with its special move, heads, flock.<id>, open,
   closing, arcade). This module keeps only structure: ids, the bird in each clan's corner, the figure on each
   clan's gauge and the input of its special move. */

import type { MascotBird } from "@krizaka/ui/mascots";

export const CHAPTERS = [
  /* The duck builds: the code, the tests, the docs — the forge's promise is proof. Every line is open: 100 %. */
  { id: "krizaka", name: "Krizaka", bird: "duck", stat: 1, combo: ["↓", "↘", "→", "P"] },
  /* The owl reads your documents and keeps every question in the house: 100 % of the data stays home. */
  { id: "orazaka", name: "Orazaka", bird: "owl", stat: 1, combo: ["←", "↙", "↓", "↘", "→", "K"] },
  /* The flamingo gets paid: the creator keeps 90 % of every sale. */
  { id: "orochia", name: "Orochia", bird: "flamingo", stat: 0.9, combo: ["→", "↓", "↘", "P+K"] },
] as const satisfies readonly { id: string; name: string; bird: MascotBird; stat: number; combo: readonly string[] }[];

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/** The flock, in the order the page shows it. */
export const FLOCK = ["falcon", "owl", "pigeon", "flamingo", "duck", "phoenix"] as const;

export type BirdId = (typeof FLOCK)[number];

/** The motes of light that float over the select screen: position (%) and size (px) — a fixed, hand-placed field. */
export const DUST = [
  [8, 22, 2], [15, 64, 3], [22, 38, 2], [31, 78, 2], [38, 16, 3], [46, 58, 2], [53, 30, 2], [61, 72, 3],
  [68, 12, 2], [74, 48, 2], [82, 26, 3], [88, 66, 2], [93, 40, 2], [27, 52, 2], [57, 88, 2], [79, 84, 2],
] as const;
