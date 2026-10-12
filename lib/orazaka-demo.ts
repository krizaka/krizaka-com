/* The Orazaka demo page (/products/orazaka/demos): structure only — the words are in messages
   (site.orazakaDemo). Clips are recordings of the real web client signed in as Eric, the demo persona
   (`orazaka demo seed --runs --with-video`, orazaka-cli; `npm run record:tour`, orazaka-web-client), stored as
   site/products/orazaka/tour/<id>.<hash>.{webm,mp4,jpg} on the CDN (scripts/cdn-assets.mjs, lib/cdn.ts). The "Made on this Mac" gallery is lib/orazaka-gallery.ts. */

import { video, type Video } from "./cdn";

/**
 * The whole tour, the wow first: what a generation looks like the moment it lands, then the Studios, the document
 * checks, the voice-over, the jobs and the bell, the chat on his documents, the packs.
 */
export const DEMO_TOUR = ["creations", "studios", "documents", "voice", "notifications", "chat", "packs"] as const;
export type DemoClipId = (typeof DEMO_TOUR)[number];

/** One section per thing a client wants done; each plays the clip that shows it. */
export const DEMO_USE_CASES = [
  { id: "visuals", clip: "creations", icon: "image", bird: "duck" },
  { id: "documents", clip: "documents", icon: "shield", bird: "owl" },
  { id: "voice", clip: "voice", icon: "sound", bird: "duck" },
  { id: "studios", clip: "studios", icon: "studio", bird: "falcon" },
  { id: "jobs", clip: "notifications", icon: "notification", bird: "pigeon" },
  { id: "chat", clip: "chat", icon: "knowledge", bird: "flamingo" },
  { id: "costs", clip: "packs", icon: "credits", bird: "falcon" },
] as const satisfies readonly { id: string; clip: DemoClipId; icon: string; bird: string }[];

export const tourSrc = (id: DemoClipId | "showcase"): Video => video(`products/orazaka/tour/${id}`);
