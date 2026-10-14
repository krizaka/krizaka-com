/* The media of "Krizaka UI, live" (lib/kit-live.ts), resolved to CDN URLs on the server. */

import { cdn, video, type Video } from "@/lib/cdn";
import { KIT_BRANDS, KIT_CAPTURE_IMAGE, KIT_CROP_IMAGE, KIT_FILMSTRIP, KIT_FILMSTRIP_FRAMES, KIT_VIDEO, KIT_YAZAKIA_PEOPLE } from "@/lib/kit-live";

export type KitMedia = {
  /** Orochia: the clip that plays, its poster, the filmstrip frames, the picture to crop, the one behind the camera. */
  clip: { src: string; poster: string };
  frames: string[];
  crop: string;
  /** The creator's avatar over the clip (a fictional face of lib/people.json). */
  avatar: string;
  capture: string;
  /** Yazakia's portraits, by id. */
  people: Record<string, string>;
};

export function kitMedia(): KitMedia {
  const clip = video(`home/kit/${KIT_VIDEO}`);
  return {
    clip: { src: clip.mp4, poster: clip.poster },
    frames: Array.from({ length: KIT_FILMSTRIP_FRAMES }, (_, i) => cdn(`home/kit/frames/${KIT_FILMSTRIP}-${i}.jpg`)),
    crop: cdn(`home/kit/${KIT_CROP_IMAGE}.jpg`),
    avatar: cdn("people/orochia/elena-256.webp"),
    capture: cdn(`home/kit/${KIT_CAPTURE_IMAGE}.jpg`),
    people: Object.fromEntries(KIT_YAZAKIA_PEOPLE.map((p) => [p.id, cdn(`people/yazakia/${p.id}-512.webp`)])),
  };
}

/** The native components of the same kit, recorded on an iPhone simulator under each identity, dark and light (a
 *  short loop each, from `@krizaka/ui/native`, re-themed with the brand's tokens). */
export function kitPhones(): Record<string, Video> {
  return Object.fromEntries(KIT_BRANDS.flatMap((b) => (["dark", "light"] as const).map((m) => [`${b}-${m}`, video(`home/kit-native/${b}-${m}`)])));
}
