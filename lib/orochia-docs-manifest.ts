/* ═══════════════════════════════════════════════════════════════════
   Orochia docs — PUBLICATION MANIFEST
   ─────────────────────────────────────────────────────────────────
   orochia-content/docs is synced from krizaka/orochia by
   `npm run docs:generate` (products/orochia). Only the docs listed here
   are published. MARKET_ANALYSIS_AND_LORE is internal positioning and
   stays out.
   ═══════════════════════════════════════════════════════════════════ */

import type { DocManifestEntry } from "./docs-manifest";

export const OROCHIA_DOCS_MANIFEST: Record<string, DocManifestEntry> = {
  getting_started: {
    title: "Getting Started",
    category: "getting-started",
    order: 1,
    audience: "developer",
    intro:
      "Run Orochia locally in five commands, sign in with the seeded accounts, start the admin console, and run the quality gates.",
  },
  development: {
    title: "Development Guide",
    category: "getting-started",
    order: 2,
    audience: "developer",
    intro:
      "Everyday commands, the database lifecycle (schema changes, seed, reset, backups), the seeded accounts, tests and troubleshooting.",
  },
  database: {
    title: "Database Reference",
    category: "architecture",
    order: 5,
    audience: "developer",
    intro:
      "Every table, column, index, foreign key and enum of the PostgreSQL schema, with the relationship diagram — generated from the Drizzle schema.",
  },
  architecture: {
    title: "Architecture",
    category: "architecture",
    order: 1,
    audience: "developer",
    intro:
      "How Orochia is built: Next.js app and packages, server-side access control, gateway-confirmed payments, the double-entry ledger and the compliance records. For developers and reviewers evaluating the platform.",
  },
  auctions: {
    title: "Auctions & Realtime",
    category: "architecture",
    order: 3,
    audience: "developer",
    intro:
      "Video auctions with bids escrowed in credits, anti-sniping, the creator's decision or an automatic sale — and the broker-free realtime behind them: PostgreSQL LISTEN/NOTIFY, Server-Sent Events, a SKIP LOCKED closer.",
  },
  challenges: {
    title: "Challenges",
    category: "architecture",
    order: 4,
    audience: "developer",
    intro:
      "Goals, dares and open calls: fans fund custom videos and stories with credits held in escrow, paid to the creator only on delivery and released otherwise — with what the industry does and why Orochia does it this way.",
  },
  notifications: {
    title: "Notifications & Realtime",
    category: "architecture",
    order: 6,
    audience: "developer",
    intro:
      "One event, three channels: live toasts over Server-Sent Events, push to phones through FCM and APNs, e-mail at the pace each person chose — and why SSE rather than WebSocket, and why no separate realtime service yet.",
  },
  media_pipeline: {
    title: "Media Pipeline",
    category: "architecture",
    order: 2,
    audience: "developer",
    intro:
      "Direct-to-Bunny resumable uploads, encoding webhooks and short-lived signed playback URLs — video never passes through the application servers.",
  },
  api_contracts: {
    title: "API Reference",
    category: "api",
    order: 1,
    audience: "developer",
    intro:
      "Every HTTP endpoint of the Orochia web app with the access rule that guards it, and the database tables — generated from the code.",
  },
  deployment: {
    title: "Deployment & Operations",
    category: "operations",
    order: 1,
    audience: "developer",
    intro:
      "Required configuration, gateway webhooks, DigitalOcean App Platform (with its migration job), self-hosting and the quality gates.",
  },
};
