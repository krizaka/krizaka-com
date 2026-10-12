/* The Orochia demo (/products/orochia/demos, and the tour of /products/orochia): structure only — the words are in
   messages (site.orochiaDemo). Clips are recordings of the real application, signed in as the two demo personas —
   Elena Marlow, a singer-songwriter who films her songs, and Alex Carter, a fan — seeded by `npm run demo:seed` and
   recorded by `npm run record:tour` (krizaka/orochia), stored on the CDN as
   site/products/orochia/tour/<id>.<hash>.{webm,mp4,jpg} (scripts/cdn-assets.mjs, lib/cdn.ts).
   Their videos play licensed stock footage (Mixkit); nobody shown is a real account. */

import { video, type Video } from "./cdn";

/** Alex's side of the day: find, watch, pay — in the order he does it. */
export const FAN_TOUR = ["alex-discover", "alex-story", "alex-unlock", "alex-bid", "alex-back"] as const;
/** Elena's side: publish, get paid live, read who paid, withdraw. */
export const CREATOR_TOUR = ["elena-publish", "elena-live", "elena-story", "elena-earnings"] as const;
export type OrochiaClipId = (typeof FAN_TOUR)[number] | (typeof CREATOR_TOUR)[number] | "showcase";

/** One section per thing a creator or a fan wants done; each plays the clip that shows it. */
export const DEMO_USE_CASES = [
  { id: "publish", clip: "elena-publish", side: "creator", icon: "video" },
  { id: "live", clip: "elena-live", side: "creator", icon: "tip" },
  { id: "stories", clip: "alex-story", side: "fan", icon: "heart" },
  { id: "unlock", clip: "alex-unlock", side: "fan", icon: "unlock" },
  { id: "auction", clip: "alex-bid", side: "fan", icon: "auction" },
  { id: "goal", clip: "alex-back", side: "fan", icon: "challenge" },
  { id: "earnings", clip: "elena-earnings", side: "creator", icon: "wallet" },
] as const satisfies readonly { id: string; clip: OrochiaClipId; side: "creator" | "fan"; icon: string }[];

export const tourSrc = (id: OrochiaClipId): Video => video(`products/orochia/tour/${id}`);
