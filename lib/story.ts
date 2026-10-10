/* "Our story" — the structure of /story and its home teaser. Every text lives in
   messages/<locale>.json under site.story (intro, chapters.<id> with its special move, heads, flock.<id>, open,
   closing, arcade). */

export const CHAPTERS = [
  { id: "krizaka", name: "Krizaka" },
  { id: "orazaka", name: "Orazaka" },
  { id: "orochia", name: "Orochia" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/** The flock, in the order the page shows it. */
export const FLOCK = ["falcon", "owl", "pigeon", "flamingo", "duck", "phoenix"] as const;

export type BirdId = (typeof FLOCK)[number];
