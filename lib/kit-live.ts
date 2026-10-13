/* "Krizaka UI, live" (home): the numbers and the faces of each product's own composition. Structure only — ids,
   amounts, durations, portraits; every word is a message (site.home.build.kit.<product>.*). Money is integer cents
   in Canadian dollars (Orochia's currency); the faces are the product's own (lib/people.json: one face = one product). */

import { cdn } from "@/lib/cdn";

/** The portrait of each person of the compositions, as CDN URLs (resolved on the server, handed to the client stage). */
export const KIT_PORTRAITS = {
  orochia: { creator: "elena", bidder: "alex", stories: ["theo", "sam", "lina", "mia"] },
  yazakia: { matches: ["ines", "kofi", "hana"] },
} as const;

export function kitPortraits(): Record<string, string> {
  const ids = [
    ...[KIT_PORTRAITS.orochia.creator, KIT_PORTRAITS.orochia.bidder, ...KIT_PORTRAITS.orochia.stories].map((id) => `orochia/${id}`),
    ...KIT_PORTRAITS.yazakia.matches.map((id) => `yazakia/${id}`),
  ];
  return Object.fromEntries(ids.map((id) => [id, cdn(`people/${id}-256.webp`)]));
}

export const KIT_ORAZAKA = {
  /** The task card: images done of the batch, and the time left. */
  job: { done: 3, total: 4, secondsLeft: 40 },
  /** The receipt of the answer: where it ran, how long, what left the machine. */
  receipt: { milliseconds: 4200, bytesOut: 0, model: "qwen2.5:7b" },
} as const;

export const KIT_OROCHIA = {
  currency: "CAD",
  /** Earnings per day, last 30 days, in cents. */
  earningsCents: [8200, 7600, 9100, 8800, 10200, 9900, 11300, 12100, 10900, 13400, 12800, 14200, 13900, 15100, 16200, 15800, 17000, 16400, 18100, 17600, 19300, 20400, 19800, 21500, 20900, 22600, 23400, 22800, 24100, 25200],
  auction: { currentBidCents: 18500, endsInMs: 74 * 60_000 + 20_000 },
  tipCents: 500,
  unlockCents: 300,
  /** The challenge's goal: raised so far of the target (cents), in ten segments. */
  goal: { raisedCents: 320_000, targetCents: 500_000, segments: 10 },
  challenges: { met: 12, of: 15 },
} as const;

export const KIT_YAZAKIA = {
  /** Three people for today, each with the ids of the reasons "why you two" (words: kit.yazakia.matches.<id>.reasons.<n>). */
  matches: [
    { id: "ines", reasons: ["a", "b"] },
    { id: "kofi", reasons: ["a", "b"] },
    { id: "hana", reasons: ["a", "b"] },
  ],
  debrief: ["again", "talk", "pass"],
  introInMs: 3 * 3_600_000 + 12 * 60_000,
} as const;

export const KIT_YORORIS = {
  /** The moment stops after this long; the screen shows what is left. */
  momentMs: 12 * 60_000,
  leftMs: 7 * 60_000 + 30_000,
  /** Self-reported, 1 to 5: before, and after. The person says it; nothing is inferred. */
  mood: { min: 1, max: 5, before: 2, after: 4 },
  keeps: 3,
} as const;
