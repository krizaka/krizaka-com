/* "How Orochia stays live" — the chapter of /story about realtime and push. Structure only: the words are in
   messages (site.story.live). Only what runs, numbers measured — never estimated:

   - the stream figures come from `scripts/realtime-load.mjs` in krizaka/orochia (production build, one MacBook,
     2026-10-11), recorded in its docs/adr/0001-realtime-transport.md and docs/REALTIME.md §7 (PostgreSQL bus);
   - the push figure was timed on 2026-10-13: a message on a local Orochia (PUSH_DELIVERY=on) until the notification
     shown on the Android emulator, through Expo Push and Firebase Cloud Messaging — median of 6 sends, 0.50–1.24 s
     (docs/NOTIFICATIONS.md §4);
   - the timings of presence are the constants the code runs with (@krizaka/realtime, apps/web/lib/realtime.ts). */

/** The path of an event, in order (texts: site.story.live.path.<id>). */
export const LIVE_PATH = ["action", "notify", "stream", "push"] as const;

/** Measured figures (texts: site.story.live.figures.<id>.label). `value` is what the counter climbs to. */
export const LIVE_FIGURES = [
  { id: "p50", value: 27, unit: "ms" },
  { id: "p95", value: 65, unit: "ms" },
  { id: "memory", value: 90, unit: "KB" },
  { id: "push", value: 0.5, unit: "s" },
] as const satisfies readonly { id: string; value: number; unit: string }[];

/** The bird of the chapter: the pigeon delivers. Its combo is decorative, like every stage's. */
export const LIVE_BIRD = { bird: "pigeon", combo: ["↓", "→", "↓", "P"] } as const;
