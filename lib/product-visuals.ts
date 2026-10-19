/* The demo data of the product cards' mini-visuals (app/components/home/visuals) — structure only, said as demo data on
   the page; the words are messages (site.home.visuals.<id>). Nothing here claims a real user, figure or result. */

import type { ProductId } from "./products";

/** The products whose requests flow into the engine on Orazaka's card, top to bottom (every product but the engine). */
export const ENGINE_FLOW: readonly Exclude<ProductId, "orazaka">[] = ["yomizaka", "orochia", "kachizaka", "akinaza", "yasakia", "yororis"];

/** Orochia: the renditions an upload is encoded to before it streams (adaptive HLS ladder). */
export const OROCHIA_RENDITIONS = ["360p", "720p", "1080p"] as const;

/** Kachizaka: a friends' league's points per match day (a demo season), read as a rolling window of eight. */
export const KACHIZAKA_POINTS: readonly number[] = [3, 5, 2, 6, 4, 7, 3, 8, 5, 6, 9, 4, 7, 8, 6, 10];

/** Akinaza: the free slots of a salon's day (demo); the visual books them one by one. */
export const AKINAZA_SLOTS = ["9:00", "10:30", "13:00", "15:30"] as const;

/** Yororis: the peaks (0–1) of a calm spoken sentence, drawn as a waveform. */
export const YORORIS_PEAKS: readonly number[] = [
  0.18, 0.32, 0.55, 0.42, 0.7, 0.86, 0.6, 0.38, 0.24, 0.46, 0.68, 0.92, 0.74, 0.5, 0.3, 0.2, 0.36, 0.58, 0.8, 0.64, 0.44, 0.28, 0.4,
  0.62, 0.48, 0.3, 0.22, 0.16,
];
