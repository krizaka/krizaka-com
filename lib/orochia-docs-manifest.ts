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
  admin_console: {
    title: "Admin Console",
    category: "operations",
    order: 1,
    audience: "decision-maker",
    intro:
      "What an operator controls from orochia-admin — creator verification, moderation, payouts, auctions, accounts, backups — and the four gates around it: IP allow-list, one account, a service token, armed confirmations.",
  },
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
  creator_onboarding: {
    title: "Creator Onboarding",
    category: "architecture",
    order: 7,
    audience: "developer",
    intro:
      "One account for everyone: how a fan opens a creator space on the account they already have, the 18+ and 18 U.S.C. § 2257 checks before the first upload, what is stored, who sees what — and the next step every viewer is offered.",
  },
  notifications: {
    title: "Notifications & Push",
    category: "architecture",
    order: 6.5,
    audience: "developer",
    intro:
      "One event, three channels: a live toast on open pages and apps, a push to closed phones through Expo, FCM and APNs, e-mail at the pace each person chose — preferences by kind on the phone, a tap that opens its screen, and how to test a real push.",
  },
  realtime: {
    title: "Realtime",
    category: "architecture",
    order: 6,
    audience: "developer",
    intro:
      "How Orochia stays live without a broker: PostgreSQL LISTEN/NOTIFY (or Valkey) between instances, Server-Sent Events to the screens, resume with Last-Event-ID, presence by heartbeat — every event, the measured latencies, and how each part is tested.",
  },
  ux_decisions: {
    title: "UX Decisions",
    category: "architecture",
    order: 9,
    audience: "decision-maker",
    intro:
      "Why the experience is built like this: each notable choice with the problem, the principle of cognitive science behind it (and its source), what was refused, what it costs, and the signal that would prove it wrong.",
  },
  accessibility: {
    title: "Accessibility",
    category: "architecture",
    order: 9.5,
    audience: "decision-maker",
    intro:
      "WCAG 2.2 AA on the web and in the app: what axe, the keyboard checks and the mobile render tests verify on every change, the manual pass and what it fixed, the known gaps — and where to tell us what blocks you.",
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
  mobile: {
    title: "Mobile App",
    category: "getting-started",
    order: 3,
    audience: "developer",
    intro:
      "The Orochia app for iOS and Android as it runs today, on the iOS simulator and the Android emulator against dev.orochia.com and a local Orochia: every screen, how it signs in, how to run it, its tests — and what is not done yet (a phone, TestFlight, push).",
  },
};
