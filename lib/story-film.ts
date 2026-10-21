/* The reference film of /story (chapter « Who we are »), newest first. A new film takes the slot the day its files are on
   the CDN: upload them (node scripts/cdn-assets.mjs upload … --to brand-films/<name>), add its line at the TOP of the list
   below with its captions route (the cues as messages, a route like relay.vtt). Until its files are recorded in
   lib/cdn-manifest.json the page shows the film under it: never a dead poster. « Le monde de Krizaka : le relais » is
   the reference film (2026-10-21); « la tournée » left the slot with it. */

import { onCdn, video } from "./cdn";
import { pickFilm, RELAY_BASE, type StoryFilm } from "./film-captions";

export const STORY_FILMS: readonly StoryFilm[] = [
  { id: "relais", base: RELAY_BASE, vtt: "relay.vtt" },
];

export function storyFilm() {
  const film = pickFilm(STORY_FILMS, onCdn);
  return { ...film, ...video(film.base) };
}
