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
  architecture: {
    title: "Architecture",
    category: "architecture",
    order: 1,
    audience: "developer",
    intro:
      "How Orochia is built: Next.js app and packages, server-side access control, gateway-confirmed payments, the double-entry ledger and the compliance records. For developers and reviewers evaluating the platform.",
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
