/* The reference film of /story (chapter « Who we are »), newest first. A new film takes the slot the day its files are on
   the CDN: upload them (node scripts/cdn-assets.mjs upload … --to brand-films/<name>), add its line at the TOP of the list
   below with its captions route (the cues as messages, a route like family.vtt). Until its files are recorded in
   lib/cdn-manifest.json the page shows the film under it: never a dead poster. « The Krizaka family » (2026-10-29, the family of
   today only) is the reference film, in the story and on the home; « le relais » (2026-10-21) is retired from every slot. */

import { onCdn, video } from "./cdn";
import { FAMILY_BASE, pickFilm, type StoryFilm } from "./film-captions";

export const STORY_FILMS: readonly StoryFilm[] = [
  { id: "famille", base: FAMILY_BASE, vtt: "family.vtt" },
];

export function storyFilm() {
  const film = pickFilm(STORY_FILMS, onCdn);
  return { ...film, ...video(film.base) };
}
