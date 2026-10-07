/* Orochia request journeys for the animated architecture (OrochiaArchitecture).
   The structure lives here, the narrative in messages/<locale>.json (site.orochia.arch); every endpoint it names is checked against the endpoints the
   generator extracted from the Orochia code (app/data/orochia-architecture.json) — a renamed or
   removed route fails the build instead of leaving the page wrong. */

import orochia from "@/app/data/orochia-architecture.json";
import en from "@/messages/en.json";

export type NodeId = "viewer" | "creator" | "app" | "db" | "gateway" | "bunny";

/** Label and subtitle: messages → site.orochia.arch.nodes.<id>. */
export interface ArchNode {
  id: NodeId;
  x: number;
  y: number;
}

/** Title and detail: messages → site.orochia.arch.journeys.<journey>.steps[i]. */
export interface JourneyStep {
  from: NodeId;
  to: NodeId;
  endpoint?: string; // "METHOD /path", must exist in the generated data
}

/** Name and summary: messages → site.orochia.arch.journeys.<id>. */
export interface Journey {
  id: "playback" | "unlock" | "upload";
  color: string;
  steps: JourneyStep[];
}

export const ARCH_NODES: ArchNode[] = [
  { id: "viewer", x: 110, y: 110 },
  { id: "creator", x: 110, y: 330 },
  { id: "app", x: 380, y: 220 },
  { id: "gateway", x: 650, y: 90 },
  { id: "db", x: 650, y: 350 },
  { id: "bunny", x: 890, y: 220 },
];

export const JOURNEYS: Journey[] = [
  {
    id: "playback",
    color: "#0ea5e9",
    steps: [
      {
        from: "viewer", to: "app", endpoint: "GET /api/videos/[id]/stream",
      },
      {
        from: "app", to: "db",
      },
      {
        from: "db", to: "app",
      },
      {
        from: "app", to: "viewer",
      },
      {
        from: "viewer", to: "bunny",
      },
    ],
  },
  {
    id: "unlock",
    color: "#10b981",
    steps: [
      {
        from: "viewer", to: "app", endpoint: "POST /api/videos/unlock-video",
      },
      {
        from: "app", to: "db",
      },
      {
        from: "app", to: "viewer",
      },
      {
        from: "viewer", to: "gateway",
      },
      {
        from: "gateway", to: "app", endpoint: "POST /api/webhooks/payments/[gateway]",
      },
      {
        from: "app", to: "db",
      },
    ],
  },
  {
    id: "upload",
    color: "#a855f7",
    steps: [
      {
        from: "creator", to: "app", endpoint: "POST /api/videos/create-upload-session",
      },
      {
        from: "app", to: "bunny",
      },
      {
        from: "app", to: "creator",
      },
      {
        from: "creator", to: "bunny",
      },
      {
        from: "bunny", to: "app", endpoint: "POST /api/webhooks/bunny",
      },
      {
        from: "app", to: "db",
      },
    ],
  },
];

/** The journeys, after checking that every endpoint they name exists in the generated data. */
export function verifiedJourneys(): Journey[] {
  const known = new Set(orochia.apiEndpoints.map((e) => `${e.method} ${e.path}`));
  const missing = JOURNEYS.flatMap((j) => j.steps.map((s) => s.endpoint).filter((e): e is string => !!e && !known.has(e)));
  // Every step has its text in the messages (en.json is the reference; fr.json is checked against it).
  const textless = JOURNEYS.filter((j) => en.site.orochia.arch.journeys[j.id].steps.length !== j.steps.length).map((j) => j.id);
  if (textless.length) throw new Error(`orochia-journeys: steps and messages differ for ${textless.join(", ")}`);
  if (missing.length) {
    throw new Error(`orochia-journeys: endpoints not found in app/data/orochia-architecture.json: ${missing.join(", ")}`);
  }
  return JOURNEYS;
}
