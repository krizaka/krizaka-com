/* The media of "Krizaka UI, live" (lib/kit-live.ts), resolved to CDN URLs on the server. */

import { cdn, video, type Video } from "@/lib/cdn";
import { KIT_BRANDS, KIT_CROP_IMAGE, KIT_FILMSTRIP, KIT_VIDEO, KIT_YAZAKIA_PEOPLE } from "@/lib/kit-live";

export type KitMedia = {
  /** Orochia: the clip that plays, its poster, the filmstrip frames, the picture to crop. */
  clip: { src: string; poster: string };
  frames: string[];
  crop: string;
  /** Yazakia's portraits, by id. */
  people: Record<string, string>;
};

export function kitMedia(): KitMedia {
  const tour = (name: string) => video(`products/orochia/tour/${name}`);
  return {
    clip: { src: tour(KIT_VIDEO).mp4, poster: tour(KIT_VIDEO).poster },
    frames: KIT_FILMSTRIP.map((n) => tour(n).poster),
    crop: tour(KIT_CROP_IMAGE).poster,
    people: Object.fromEntries(KIT_YAZAKIA_PEOPLE.map((p) => [p.id, cdn(`people/yazakia/${p.id}-512.webp`)])),
  };
}

/** The native components of the same kit, recorded on an iPhone simulator under each identity, dark and light (a
 *  short loop each, from `@krizaka/ui/native`, re-themed with the brand's tokens). */
export function kitPhones(): Record<string, Video> {
  return Object.fromEntries(KIT_BRANDS.flatMap((b) => (["dark", "light"] as const).map((m) => [`${b}-${m}`, video(`home/kit-native/${b}-${m}`)])));
}
