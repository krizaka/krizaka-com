/* The media of "Krizaka UI, live" (lib/kit-live.ts), resolved to CDN URLs on the server. */

import { cdn, video, type Video } from "@/lib/cdn";
import { KIT_BRANDS, KIT_PEOPLE } from "@/lib/kit-live";

/** The Krizaka UI portraits of the examples (lib/people.json, product "ui"): no product's face. */
export function kitPortraits(): Record<string, string> {
  return Object.fromEntries(KIT_PEOPLE.map((id) => [id, cdn(`people/ui/${id}-256.webp`)]));
}

/** The native components of the same kit, recorded on an iPhone simulator under each identity, dark and light (a
 *  short loop each, from `@krizaka/ui/native`, re-themed with the brand's tokens). */
export function kitPhones(): Record<string, Video> {
  return Object.fromEntries(KIT_BRANDS.flatMap((b) => (["dark", "light"] as const).map((m) => [`${b}-${m}`, video(`home/kit-native/${b}-${m}`)])));
}
