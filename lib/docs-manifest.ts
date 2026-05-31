/* ═══════════════════════════════════════════════════════════════════
   Orazaka docs — PUBLICATION MANIFEST
   ─────────────────────────────────────────────────────────────────
   The engine generates many .md files in orazaka-content/docs, several of
   which are written for CONTRIBUTORS (agent rules, ADR ledgers, CI/test
   harnesses, internal UI guidelines). Those must NOT appear on the public
   site. This manifest is the single source of truth for what is published,
   how it is titled/categorised/ordered, and the human intro shown at the top
   of each page (what is this, who is it for).

   Decisions are recorded in docs/storefront/PLAN.md (Step 1 manifest table).
   ═══════════════════════════════════════════════════════════════════ */

export type Audience = "developer" | "decision-maker";

export interface DocManifestEntry {
  /** Curated, human title (overrides the raw markdown H1). */
  title: string;
  /** Routing category slug. */
  category: string;
  /** Sort order within the category. */
  order: number;
  /** Who this page is for — drives the audience badge. */
  audience: Audience;
  /** 2–3 sentence human intro: what is this, who is it for. */
  intro: string;
}

/** Keyed by the doc slug (lowercased filename without .md). Any file NOT in
 *  this map is treated as INTERNAL and excluded from the public site. */
export const DOCS_MANIFEST: Record<string, DocManifestEntry> = {
  "101": {
    title: "Getting Started",
    category: "getting-started",
    order: 1,
    audience: "developer",
    intro:
      "Stand up Orazaka locally and run your first request in minutes. This onboarding guide is for developers evaluating the engine or wiring it into an application.",
  },
  architecture: {
    title: "Architecture Overview",
    category: "architecture",
    order: 1,
    audience: "developer",
    intro:
      "How Orazaka is built: a Ports & Adapters (hexagonal) engine with a curated module topology. Read this to understand the moving parts before going deeper — the interactive 3D model above mirrors the same structure.",
  },
  core: {
    title: "Core Engine & Pipeline",
    category: "architecture",
    order: 2,
    audience: "developer",
    intro:
      "The orchestration core and the request pipeline that every interaction flows through. For developers who want to understand how a prompt becomes a validated answer.",
  },
  models: {
    title: "Supported AI Models",
    category: "architecture",
    order: 3,
    audience: "decision-maker",
    intro:
      "The models Orazaka has been tested with — local (Ollama) and optional hosted providers. Useful when deciding what you can run entirely on your own infrastructure.",
  },
  api_reference: {
    title: "API Reference",
    category: "api",
    order: 1,
    audience: "developer",
    intro:
      "The HTTP/GraphQL surface for integrating Orazaka into your product. For developers building against the engine.",
  },
  cli: {
    title: "CLI Reference",
    category: "api",
    order: 2,
    audience: "developer",
    intro:
      "Operate and script the engine from the terminal. For developers and operators automating Orazaka.",
  },
  master_features: {
    title: "Feature Matrix",
    category: "core-features",
    order: 1,
    audience: "decision-maker",
    intro:
      "A single matrix of what Orazaka can do — chat, RAG, agents, image, audio, video — and the status of each capability. The fastest way to evaluate fit.",
  },
  auth: {
    title: "Authentication",
    category: "core-features",
    order: 2,
    audience: "developer",
    intro:
      "How identity, sessions and access control work in Orazaka. For developers securing a deployment.",
  },
  automation: {
    title: "Automation & Agents",
    category: "core-features",
    order: 3,
    audience: "developer",
    intro:
      "The automation layer and local agent protocol — how Orazaka plans, calls tools, and acts on your systems. For developers building autonomous workflows.",
  },
  business_implementation: {
    title: "Business Implementation Playbook",
    category: "core-features",
    order: 4,
    audience: "decision-maker",
    intro:
      "A practical playbook for turning Orazaka capabilities into outcomes for a business — what to deploy, in what order, and what it delivers. Written for decision-makers, not just engineers.",
  },
  interceptors: {
    title: "Interceptor Registry",
    category: "architecture",
    order: 4,
    audience: "developer",
    intro:
      "Every cross-cutting interceptor in the cognitive pipeline and its DB-driven order — generated from the code. For developers reasoning about how a request is enriched, routed and validated.",
  },
  use_cases: {
    title: "Use-Case Catalog",
    category: "core-features",
    order: 5,
    audience: "developer",
    intro:
      "The App-Factory use-cases discovered in the engine, with their capability and domain — generated from the code. For developers extending Orazaka with new products.",
  },
  interface_contracts: {
    title: "Interface Contracts",
    category: "api",
    order: 3,
    audience: "developer",
    intro:
      "Inbound and outbound ports per module, extracted from the code — the contract surface between layers. For developers wiring adapters against the hexagonal core.",
  },
  adrs: {
    title: "ADR Ledger",
    category: "guidelines",
    order: 8,
    audience: "developer",
    intro:
      "The Architecture Decision Records cited across the codebase — generated from the source. For developers who want the rationale behind the engine's structure.",
  },
  glossary: {
    title: "Glossary",
    category: "guidelines",
    order: 9,
    audience: "decision-maker",
    intro:
      "Plain-language definitions of the terms used across these docs. A quick reference for anyone evaluating Orazaka.",
  },
};

/** True when a doc slug is approved for public publication. */
export function isPublished(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(DOCS_MANIFEST, slug.toLowerCase());
}

export function getManifestEntry(slug: string): DocManifestEntry | undefined {
  return DOCS_MANIFEST[slug.toLowerCase()];
}
