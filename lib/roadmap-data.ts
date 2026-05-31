/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Roadmap (versioned, aligned with the Orasaka engine state)
   Bilingual (FR-CA default + EN). Statuses: stable · in-progress · research.
   ═══════════════════════════════════════════════════════════════════ */

export type LocalizedText = { fr: string; en: string };
export type RoadmapStatus = "stable" | "in-progress" | "research";

export interface RoadmapItem {
  id: string;
  status: RoadmapStatus;
  title: LocalizedText;
  desc: LocalizedText;
  area: LocalizedText;
}

export const ROADMAP_VERSION = "2026.06";

export const ROADMAP: RoadmapItem[] = [
  // ── Stable ──
  {
    id: "sovereign-chat",
    status: "stable",
    title: { fr: "Chat souverain + RAG", en: "Sovereign chat + RAG" },
    desc: {
      fr: "Chat en streaming SSE ancré dans tes documents (pgvector), modèles locaux Ollama.",
      en: "Streaming SSE chat grounded in your documents (pgvector), local Ollama models.",
    },
    area: { fr: "Cognition", en: "Cognition" },
  },
  {
    id: "capability-registry",
    status: "stable",
    title: { fr: "Registre de capacités (DB)", en: "Capability registry (DB)" },
    desc: {
      fr: "Les capacités du graphe d'opérations sont pilotées par la base — plus de config en dur.",
      en: "Operation-graph capabilities are database-driven — no more hard-coded config.",
    },
    area: { fr: "Plateforme", en: "Platform" },
  },
  {
    id: "hexagonal-arch",
    status: "stable",
    title: { fr: "Architecture hexagonale + vue 3D", en: "Hexagonal architecture + 3D view" },
    desc: {
      fr: "Ports & adaptateurs stricts, modèle généré depuis le code et rendu en 3D interactif.",
      en: "Strict ports & adapters, model generated from code and rendered as interactive 3D.",
    },
    area: { fr: "Plateforme", en: "Platform" },
  },
  {
    id: "identity-rbac",
    status: "stable",
    title: { fr: "Identité, RBAC & limites de débit", en: "Identity, RBAC & rate limiting" },
    desc: {
      fr: "Authentification, rôles et quotas, résolus depuis la base, par locataire.",
      en: "Authentication, roles and quotas, resolved from the database, per tenant.",
    },
    area: { fr: "Sécurité", en: "Security" },
  },
  // ── In progress ──
  {
    id: "app-factory",
    status: "in-progress",
    title: { fr: "App Factory (SPI UseCase)", en: "App Factory (UseCase SPI)" },
    desc: {
      fr: "Ajouter une capacité produit = une classe UseCase ; dispatcher intention → cas d'usage.",
      en: "Adding a product capability = one UseCase class; dispatch intention → use-case.",
    },
    area: { fr: "Orchestration", en: "Orchestration" },
  },
  {
    id: "intention-ingress",
    status: "in-progress",
    title: { fr: "Ingress piloté par l'intention", en: "Intention-driven ingress" },
    desc: {
      fr: "Un point d'entrée unique (/v1/intentions) traduit le transport en intention typée.",
      en: "A single entry point (/v1/intentions) translates transport into a typed intention.",
    },
    area: { fr: "Ingress", en: "Ingress" },
  },
  {
    id: "media-generation",
    status: "in-progress",
    title: { fr: "Génération média on-prem", en: "On-prem media generation" },
    desc: {
      fr: "Image, audio et vidéo générés localement via des workers natifs — rien n'est téléversé.",
      en: "Image, audio and video generated locally via native workers — nothing uploaded.",
    },
    area: { fr: "Média", en: "Media" },
  },
  // ── Research ──
  {
    id: "agentic-planning",
    status: "research",
    title: { fr: "Planification agentique", en: "Agentic planning" },
    desc: {
      fr: "Boucle plan → agir → observer déléguée au cœur, exécutée par la couche métier.",
      en: "Plan → act → observe loop delegated to the core, run by the business layer.",
    },
    area: { fr: "Agents", en: "Agents" },
  },
  {
    id: "krizaka-cloud",
    status: "research",
    title: { fr: "Krizaka Cloud (multi-locataire)", en: "Krizaka Cloud (multi-tenant)" },
    desc: {
      fr: "La version gérée, hébergée au Canada, avec isolation par client.",
      en: "The managed edition, hosted in Canada, with per-tenant isolation.",
    },
    area: { fr: "Cloud", en: "Cloud" },
  },
  {
    id: "enterprise-packages",
    status: "research",
    title: { fr: "Packages Enterprise par domaine", en: "Enterprise domain packages" },
    desc: {
      fr: "Bundles métiers prêts à l'emploi, RBAC avancé, audit, accompagnement de déploiement.",
      en: "Ready-to-use domain bundles, advanced RBAC, audit, deployment support.",
    },
    area: { fr: "Solutions", en: "Solutions" },
  },
];
