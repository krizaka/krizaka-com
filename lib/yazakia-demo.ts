/* The people of the Yazakia demo on /products/yazakia: three of the invented adults of lib/people.json (product
   "yazakia"), the same cast as the home gallery (lib/kit-live.ts). Structure only; their words are messages
   (site.yazakia.demo.deck.people.<id>). Portraits are served from the CDN, resolved on the server. */

import { cdn, video, type Video } from "@/lib/cdn";
import { KIT_YAZAKIA_PEOPLE } from "@/lib/kit-live";

export const YAZAKIA_DEMO_PEOPLE = KIT_YAZAKIA_PEOPLE;
export type YazakiaDemoPersonId = (typeof YAZAKIA_DEMO_PEOPLE)[number]["id"];

/** `ines` → its 512 px portrait on the CDN. */
export function yazakiaDemoPortraits(): Record<YazakiaDemoPersonId, string> {
  return Object.fromEntries(YAZAKIA_DEMO_PEOPLE.map((p) => [p.id, cdn(`people/yazakia/${p.id}-512.webp`)])) as Record<YazakiaDemoPersonId, string>;
}

/** The loop recorded on an iPhone simulator with the native kit, dark and light (30 s, products/yazakia/mobile). */
export type NativeLoops = Record<"dark" | "light", Video>;
export const yazakiaNativeLoops = (): NativeLoops => Object.fromEntries((["dark", "light"] as const).map((theme) => [theme, video(`products/yazakia/mobile/loop-${theme}`)])) as NativeLoops;
