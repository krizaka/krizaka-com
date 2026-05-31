/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Packages
   A Package = a pre-configured set of pipeline interceptors that, assembled,
   form a tailored solution for one domain. The composition brick of Orasaka.
   Available by manual composition in Community; one-click in Cloud (waitlist).
   Bilingual (FR-CA default + EN). Externalized per [ERR-115].
   ═══════════════════════════════════════════════════════════════════ */

export type LocalizedText = { fr: string; en: string };

export interface PackageInterceptor {
  /** Engine interceptor name (or domain composition) — shown verbatim, technical. */
  name: string;
  role: LocalizedText;
}

export interface Package {
  id: string;
  name: LocalizedText;
  tagline: LocalizedText;
  /** The pain this package assembles interceptors to solve. */
  problem: LocalizedText;
  interceptors: PackageInterceptor[];
  /** Slug of the related use case (app/use-cases/[slug]). */
  useCaseSlug: string;
}

export const PACKAGES: Package[] = [
  {
    id: "loi-25",
    name: { fr: "Conformité Loi 25", en: "Law 25 Compliance" },
    tagline: {
      fr: "Conçu pour faciliter la conformité Loi 25 / RGPD.",
      en: "Designed to ease Law 25 / GDPR compliance.",
    },
    problem: {
      fr: "Traiter des renseignements personnels avec l'IA sans jamais les laisser sortir de ton réseau, et garder une trace auditable.",
      en: "Process personal information with AI without ever letting it leave your network — with an auditable trail.",
    },
    interceptors: [
      { name: "UserContextResolver", role: { fr: "Vérifie le rôle RBAC et le consentement avant traitement", en: "Checks RBAC role and consent before processing" } },
      { name: "SystemContextInjector", role: { fr: "Force le routage vers des modèles locaux souverains uniquement", en: "Forces routing to sovereign local models only" } },
      { name: "RouterInterceptor", role: { fr: "Bloque tout provider hors infrastructure", en: "Blocks any off-infrastructure provider" } },
      { name: "AuditInterceptor", role: { fr: "Journalise chaque décision pour la piste d'audit", en: "Logs every decision for the audit trail" } },
    ],
    useCaseSlug: "sante-cliniques",
  },
  {
    id: "support",
    name: { fr: "Support client", en: "Customer Support" },
    tagline: {
      fr: "Triage, réponse contextuelle et escalade — sans fuite de données.",
      en: "Triage, contextual reply and escalation — without data leaks.",
    },
    problem: {
      fr: "Trier un flux de tickets répétitifs et urgents, proposer une réponse, et escalader les cas complexes aux humains.",
      en: "Sort a stream of repetitive and urgent tickets, draft a reply, and escalate hard cases to humans.",
    },
    interceptors: [
      { name: "RouterInterceptor", role: { fr: "Classe le ticket par intention et urgence", en: "Classifies the ticket by intent and urgency" } },
      { name: "MemoryInterceptor", role: { fr: "Rappelle l'historique de conversation du client", en: "Recalls the customer's conversation history" } },
      { name: "RagInterceptor", role: { fr: "Ancre la réponse dans ta base de connaissance", en: "Grounds the reply in your knowledge base" } },
      { name: "EscalationInterceptor", role: { fr: "Route les cas complexes vers un humain", en: "Routes complex cases to a human" } },
    ],
    useCaseSlug: "support-client",
  },
  {
    id: "document",
    name: { fr: "Analyse documentaire", en: "Document Analysis" },
    tagline: {
      fr: "Des réponses ancrées dans tes documents, sources citées.",
      en: "Answers grounded in your documents, with cited sources.",
    },
    problem: {
      fr: "Interroger des contrats, rapports et PDF confidentiels sans jamais les téléverser dans le cloud.",
      en: "Query confidential contracts, reports and PDFs without ever uploading them to the cloud.",
    },
    interceptors: [
      { name: "RagInterceptor", role: { fr: "Récupération vectorielle locale (pgvector)", en: "Local vector retrieval (pgvector)" } },
      { name: "RefinerInterceptor", role: { fr: "Transforme une question floue en requête précise", en: "Turns a fuzzy question into a precise query" } },
      { name: "McpInterceptor", role: { fr: "Branche des sources externes via MCP", en: "Wires external sources via MCP" } },
      { name: "MemoryInterceptor", role: { fr: "Garde le fil entre les questions d'un dossier", en: "Keeps the thread across questions in a file" } },
    ],
    useCaseSlug: "juridique-finance",
  },
  {
    id: "content",
    name: { fr: "Création de contenu", en: "Content Creation" },
    tagline: {
      fr: "Livrables, contenu et média générés en interne.",
      en: "Deliverables, copy and media generated in-house.",
    },
    problem: {
      fr: "Produire du contenu et des visuels sans téléverser briefs et créations sur des outils cloud.",
      en: "Produce copy and visuals without uploading briefs and assets to cloud tools.",
    },
    interceptors: [
      { name: "SystemContextInjector", role: { fr: "Injecte la voix de marque et les gabarits", en: "Injects brand voice and templates" } },
      { name: "RefinerInterceptor", role: { fr: "Affine le brief en instruction structurée", en: "Refines the brief into a structured instruction" } },
      { name: "MediaInterceptor", role: { fr: "Génère image, audio et vidéo on-prem", en: "Generates image, audio and video on-prem" } },
      { name: "ToolInterceptor", role: { fr: "Publie vers tes outils via callbacks", en: "Publishes to your tools via callbacks" } },
    ],
    useCaseSlug: "agences-marketing",
  },
];
