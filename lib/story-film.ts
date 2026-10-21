/* The reference film of /story (chapter « Who we are »), newest first. A new film takes the slot the day its files are on
   the CDN: upload them (node scripts/cdn-assets.mjs upload … --to brand-films/<name>), add its line at the TOP of the list
   below with its captions route (the cues as messages, a route like tour.vtt) — « Le monde de Krizaka : le relais » is
   next. Until its files are recorded in lib/cdn-manifest.json the page shows the film under it: never a dead poster. */

import { onCdn, video } from "./cdn";
import { pickFilm, TOUR_BASE, type StoryFilm } from "./film-captions";

export const STORY_FILMS: readonly StoryFilm[] = [
  // { id: "relais", base: "brand-films/relay/le-monde-de-krizaka-le-relais-16x9", vtt: "relais.vtt" },
  { id: "tournee", base: TOUR_BASE, vtt: "tour.vtt" },
];

export function storyFilm() {
  const film = pickFilm(STORY_FILMS, onCdn);
  return { ...film, ...video(film.base) };
}
