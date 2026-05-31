/* Layout + presentation metadata for the 2D hexagonal architecture mesh.
   The factual data (modules, ports, dependencies) is read from the generated
   app/data/architecture.json — this file only adds the things the graph needs to
   be *drawn*: a hand-tuned position, a layer color, an icon and a short blurb.
   Keep it in sync with the module ids in architecture.json (do not hand-edit the
   generated JSON itself — see AGENTS.md). */

export type MeshLocale = "fr" | "en";
export type ArchLayer = "framework" | "app" | "aggregate";

export type ArchIconName =
  | "core"
  | "database"
  | "identity"
  | "business"
  | "interceptors"
  | "tools"
  | "test"
  | "router"
  | "workers"
  | "aggregate";

export interface ArchNodeMeta {
  /** position on the canvas, in percent (0–100) */
  x: number;
  y: number;
  layer: ArchLayer;
  icon: ArchIconName;
  /** the hub (core) gets extra emphasis: larger hex + sonar beacon */
  hub?: boolean;
  label: string;
  desc: Record<MeshLocale, string>;
}

/* Per-layer mid-tone identity colors. Chosen to read on both dark and light
   themes (semantic accents, allowed by the theming contract). */
export const LAYER_THEME: Record<ArchLayer, { color: string; glow: string; label: Record<MeshLocale, string> }> = {
  framework: { color: "#3b82f6", glow: "rgba(59, 130, 246, 0.35)", label: { fr: "Framework", en: "Framework" } },
  app: { color: "#10b981", glow: "rgba(16, 185, 129, 0.35)", label: { fr: "Application", en: "Application" } },
  aggregate: { color: "#a855f7", glow: "rgba(168, 85, 247, 0.35)", label: { fr: "Agrégat", en: "Aggregate" } },
};

/* The hub (core) reads as the centerpiece with its own indigo identity. */
export const HUB_THEME = { color: "#6366f1", glow: "rgba(99, 102, 241, 0.45)" };

/* Keyed by the module id in architecture.json. */
export const ARCH_NODES: Record<string, ArchNodeMeta> = {
  "orasaka-core": {
    x: 50, y: 50, layer: "framework", icon: "core", hub: true,
    label: "Core",
    desc: {
      fr: "Le cœur hexagonal — domaine pur et ports. Toutes les capacités passent par lui.",
      en: "The hexagonal core — pure domain and ports. Every capability flows through it.",
    },
  },
  "orasaka-business": {
    x: 31, y: 24, layer: "framework", icon: "business",
    label: "Business",
    desc: {
      fr: "Logique métier et cas d'usage applicatifs au-dessus du core.",
      en: "Business logic and application use-cases built on top of the core.",
    },
  },
  "orasaka-identity": {
    x: 69, y: 24, layer: "framework", icon: "identity",
    label: "Identity",
    desc: {
      fr: "Identité, RBAC et quotas, résolus par tenant depuis la base.",
      en: "Identity, RBAC and quotas, resolved per tenant from the database.",
    },
  },
  "orasaka-interceptors": {
    x: 31, y: 76, layer: "framework", icon: "interceptors",
    label: "Interceptors",
    desc: {
      fr: "Les 15 intercepteurs modulaires du pipeline cognitif.",
      en: "The 15 modular interceptors of the cognitive pipeline.",
    },
  },
  "orasaka-tools": {
    x: 69, y: 76, layer: "framework", icon: "tools",
    label: "Tools",
    desc: {
      fr: "Outils et intégrations MCP exposés au moteur.",
      en: "Tools and MCP integrations exposed to the engine.",
    },
  },
  "orasaka-persistence": {
    x: 88, y: 50, layer: "framework", icon: "database",
    label: "Persistence",
    desc: {
      fr: "Adaptateurs sortants (JPA / pgvector) derrière les ports du domaine.",
      en: "Outbound adapters (JPA / pgvector) behind the domain ports.",
    },
  },
  "orasaka-test-support": {
    x: 12, y: 50, layer: "framework", icon: "test",
    label: "Test Support",
    desc: {
      fr: "Fixtures et Testcontainers partagés par tous les modules.",
      en: "Shared fixtures and Testcontainers used by every module.",
    },
  },
  "orasaka-router": {
    x: 50, y: 12, layer: "app", icon: "router",
    label: "Router",
    desc: {
      fr: "Adaptateur entrant : API REST / SSE qui route vers le core.",
      en: "Inbound adapter: REST / SSE API routing into the core.",
    },
  },
  "orasaka-workers": {
    x: 88, y: 84, layer: "app", icon: "workers",
    label: "Workers",
    desc: {
      fr: "Workers asynchrones — jobs sur threads virtuels Java 21.",
      en: "Async workers — jobs on Java 21 virtual threads.",
    },
  },
  "orasaka-end2end": {
    x: 50, y: 88, layer: "aggregate", icon: "aggregate",
    label: "End-to-End",
    desc: {
      fr: "Module agrégat : les tests E2E qui câblent toute la plateforme.",
      en: "Aggregate module: the E2E tests wiring the whole platform.",
    },
  },
};

/* The generated deps reference split persistence ids (…-app / …-identity) that
   collapse onto the single drawn persistence node. */
export function canonicalModuleId(id: string): string {
  if (id === "orasaka-persistence-app" || id === "orasaka-persistence-identity") {
    return "orasaka-persistence";
  }
  return id;
}
