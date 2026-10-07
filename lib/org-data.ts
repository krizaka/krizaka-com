/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — organisation-level data for the home page and /open-source.
   Repository lists are NOT written here: they come from the generated
   architecture files of each product (app/data/*.json).
   ═══════════════════════════════════════════════════════════════════ */

import orazaka from "@/app/data/architecture.json";
import orochia from "@/app/data/orochia-architecture.json";

export type Loc = "fr" | "en";
export type L = Record<Loc, string>;

export interface OrgRepository {
  name: string;
  url: string;
  description: string;
  product: "orazaka" | "orochia";
  group: string;
}

const ORAZAKA_GROUP: Record<string, string> = {
  foundation: "foundation",
  domain: "domain",
  ai: "ai",
  worker: "ai",
  app: "apps",
  content: "apps",
};

/** Every public repository of the organisation, from the generated product data. */
export function orgRepositories(): OrgRepository[] {
  const oz = ((orazaka as { repositories?: { name: string; url: string; description: string; layer: string }[] }).repositories ?? []).map(
    (r) => ({ name: r.name, url: r.url, description: r.description, product: "orazaka" as const, group: ORAZAKA_GROUP[r.layer] ?? "apps" }),
  );
  const workspace: OrgRepository = {
    name: "orazaka",
    url: "https://github.com/krizaka/orazaka",
    description:
      "Orazaka platform workspace: governance contract, workspace manifest, local infrastructure, end-to-end tests and architecture docs. Clones and builds every Orazaka repository.",
    product: "orazaka",
    group: "workspace",
  };
  const oc = orochia.repositories.map((r) => ({
    name: r.name,
    url: r.url,
    description: r.description,
    product: "orochia" as const,
    group: "orochia",
  }));
  return [workspace, ...oz, ...oc];
}

export interface Product {
  id: "orazaka" | "orochia";
  name: string;
  href: string;
  docsHref: string;
  repoUrl: string;
  accent: string;
  tagline: L;
  summary: L;
  points: L[];
  stack: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "orazaka",
    name: "Orazaka",
    href: "/products/orazaka",
    docsHref: "/products/orazaka/getting-started/101",
    repoUrl: "https://github.com/krizaka/orazaka",
    accent: "#6366f1",
    tagline: { fr: "IA souveraine, hébergée chez vous.", en: "Sovereign AI, hosted on your infrastructure." },
    summary: {
      fr: "Moteur d'orchestration IA multimodal : chaque requête traverse un pipeline d'intercepteurs déterministe vers le meilleur modèle local. Rien ne quitte votre réseau.",
      en: "A multimodal AI orchestration engine: every request flows through a deterministic interceptor pipeline to the best local model. Nothing leaves your network.",
    },
    points: [
      { fr: "Chat, RAG, agents, image, audio, vidéo", en: "Chat, RAG, agents, image, audio, video" },
      { fr: "Architecture hexagonale vérifiée au build (ArchUnit)", en: "Hexagonal architecture enforced at build time (ArchUnit)" },
      { fr: "Composants réutilisables : utilisateurs, notifications, facturation", en: "Reusable components: users, notifications, billing" },
    ],
    stack: "Java 21 · Spring Boot 4 · Spring AI 2 · Next.js · Ollama",
  },
  {
    id: "orochia",
    name: "Orochia",
    href: "/products/orochia",
    docsHref: "/products/orochia/docs",
    repoUrl: "https://github.com/krizaka/orochia",
    accent: "#a855f7",
    tagline: { fr: "La plateforme vidéo des créateurs indépendants.", en: "The video platform for independent creators." },
    summary: {
      fr: "Streaming 4K, paywalls et versements créateurs, avec la rigueur d'une infrastructure financière. Conçue pour les contenus adultes (18+).",
      en: "4K streaming, paywalls and creator payouts with the rigour of financial infrastructure. Designed for adult (18+) content.",
    },
    points: [
      { fr: "Vidéo directe sur CDN, URL signées de 5 minutes", en: "Direct-to-CDN video, 5-minute signed URLs" },
      { fr: "Paiements confirmés par webhook signé, réglés une seule fois", en: "Payments confirmed by signed webhook, settled exactly once" },
      { fr: "Conformité 18+ et registres 2257 intégrés", en: "Built-in 18+ compliance and 2257 records" },
    ],
    stack: "Next.js 14 · PostgreSQL · Drizzle · Bunny Stream",
  },
];

export const EXPERTISE: { title: L; body: L }[] = [
  {
    title: { fr: "IA souveraine", en: "Sovereign AI" },
    body: {
      fr: "Orchestration de modèles locaux, RAG, agents et MCP sur votre infrastructure — conforme à la Loi 25 et au RGPD par conception.",
      en: "Local model orchestration, RAG, agents and MCP on your infrastructure — Law 25 and GDPR compliant by design.",
    },
  },
  {
    title: { fr: "Architecture modulaire", en: "Modular architecture" },
    body: {
      fr: "Hexagonal, contrats versionnés, un dépôt par composant : des briques que chaque nouvelle application reprend telles quelles.",
      en: "Hexagonal, versioned contracts, one repository per component: building blocks every new application reuses as they are.",
    },
  },
  {
    title: { fr: "Conformité intégrée", en: "Compliance built in" },
    body: {
      fr: "Loi 25, RGPD, 18 U.S.C. § 2257 : les obligations deviennent des invariants du code, vérifiés à chaque build.",
      en: "Law 25, GDPR, 18 U.S.C. § 2257: obligations become code invariants, checked on every build.",
    },
  },
  {
    title: { fr: "Médias & diffusion", en: "Media & streaming" },
    body: {
      fr: "Ingestion reprenable, encodage adaptatif, URL signées et génération image/vidéo native sur GPU Apple.",
      en: "Resumable ingest, adaptive encoding, signed URLs and native image/video generation on Apple GPUs.",
    },
  },
  {
    title: { fr: "Paiements & grands livres", en: "Payments & ledgers" },
    body: {
      fr: "Crédits, abonnements, intentions de paiement, webhooks signés et règlement idempotent en partie double.",
      en: "Credits, subscriptions, payment intents, signed webhooks and idempotent double-entry settlement.",
    },
  },
  {
    title: { fr: "Gouvernance par le code", en: "Governance as code" },
    body: {
      fr: "Règles d'architecture testées, documentation générée depuis le code, CI qui refuse ce que le contrat interdit.",
      en: "Tested architecture rules, documentation generated from code, CI that refuses what the contract forbids.",
    },
  },
];
