/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Solutions / domain packages (mined from Orasaka capabilities)
   Bilingual (FR-CA default + EN). Each package: problem → capability →
   outcome → who-it's-for → why-sovereign → CTA. Externalized [ERR-115].
   ═══════════════════════════════════════════════════════════════════ */

export type LocalizedText = { fr: string; en: string };

export type SolutionIcon =
  | "document-intelligence"
  | "support-automation"
  | "knowledge-rag"
  | "media-generation"
  | "autonomous-agents";

export interface Solution {
  id: SolutionIcon;
  name: LocalizedText;
  capability: LocalizedText; // the Orasaka capability it builds on
  problem: LocalizedText;
  outcome: LocalizedText;
  whoFor: LocalizedText;
  sovereignty: LocalizedText;
}

export const SOLUTIONS: Solution[] = [
  {
    id: "document-intelligence",
    name: { fr: "Intelligence documentaire", en: "Document Intelligence" },
    capability: { fr: "RAG + chat (pgvector, local)", en: "RAG + chat (pgvector, local)" },
    problem: {
      fr: "Ta connaissance est enfouie dans des PDF, contrats et rapports que personne n'a le temps de relire.",
      en: "Your knowledge is buried in PDFs, contracts and reports nobody has time to re-read.",
    },
    outcome: {
      fr: "Des réponses instantanées, ancrées dans tes documents, avec les sources citées.",
      en: "Instant answers grounded in your documents, with cited sources.",
    },
    whoFor: { fr: "Juridique, finance, immobilier", en: "Legal, finance, real estate" },
    sovereignty: {
      fr: "Tes documents ne quittent jamais ton serveur — indexés et interrogés sur place.",
      en: "Your documents never leave your server — indexed and queried in place.",
    },
  },
  {
    id: "support-automation",
    name: { fr: "Automatisation du support", en: "Support Automation" },
    capability: { fr: "Agent de triage + chat + escalade", en: "Agent triage + chat + escalation" },
    problem: {
      fr: "Ton équipe de support croule sous des tickets répétitifs et urgents mélangés.",
      en: "Your support team drowns in repetitive and urgent tickets, all mixed together.",
    },
    outcome: {
      fr: "Les tickets sont classés par urgence, une réponse contextuelle est proposée, et les cas complexes sont escaladés aux humains.",
      en: "Tickets are classified by urgency, a contextual reply is drafted, and hard cases are escalated to humans.",
    },
    whoFor: { fr: "Équipes de support client", en: "Customer support teams" },
    sovereignty: {
      fr: "Les données de tes clients restent sur ton infrastructure — l'agent tourne chez toi.",
      en: "Your customers' data stays on your infrastructure — the agent runs on your side.",
    },
  },
  {
    id: "knowledge-rag",
    name: { fr: "Assistant de connaissance", en: "Knowledge & RAG Assistant" },
    capability: { fr: "RAG + outils / MCP", en: "RAG + tools / MCP" },
    problem: {
      fr: "Ta connaissance interne est éparpillée dans des wikis, des fichiers et des têtes.",
      en: "Your internal knowledge is scattered across wikis, files and people's heads.",
    },
    outcome: {
      fr: "Un assistant privé qui répond à partir de TA base, branché à tes outils via MCP.",
      en: "A private assistant grounded in YOUR knowledge base, wired to your tools via MCP.",
    },
    whoFor: { fr: "Équipes à forte densité de savoir", en: "Knowledge-heavy teams" },
    sovereignty: {
      fr: "Ta base de connaissance, ton serveur — aucun index envoyé à un tiers.",
      en: "Your knowledge base, your server — no index sent to a third party.",
    },
  },
  {
    id: "media-generation",
    name: { fr: "Génération média", en: "Media Generation" },
    capability: { fr: "Modèles image · audio · vidéo (on-prem)", en: "Image · audio · video models (on-prem)" },
    problem: {
      fr: "Les outils créatifs cloud exigent que tu téléverses tes visuels et tes scripts.",
      en: "Cloud creative tools require you to upload your visuals and scripts.",
    },
    outcome: {
      fr: "Image, audio et vidéo générés en interne — rien n'est téléversé.",
      en: "Image, audio and video generated in-house — nothing is uploaded.",
    },
    whoFor: { fr: "Agences marketing, studios", en: "Marketing agencies, studios" },
    sovereignty: {
      fr: "Tes créations et tes briefs ne quittent jamais ton réseau.",
      en: "Your assets and briefs never leave your network.",
    },
  },
  {
    id: "autonomous-agents",
    name: { fr: "Agents autonomes", en: "Autonomous Agents" },
    capability: { fr: "Boucle agent (plan → agir → observer) + outils", en: "Agent loop (plan → act → observe) + tools" },
    problem: {
      fr: "Des tâches répétitives en plusieurs étapes monopolisent ton équipe.",
      en: "Repetitive multi-step tasks tie up your team.",
    },
    outcome: {
      fr: "Des agents qui planifient et exécutent des flux de travail sur tes propres systèmes.",
      en: "Agents that plan and run workflows across your own systems.",
    },
    whoFor: { fr: "Ventes / prospection, opérations", en: "Sales / prospecting, operations" },
    sovereignty: {
      fr: "Les agents s'exécutent sur ton infrastructure, contre tes systèmes — sous ton contrôle.",
      en: "Agents run on your infrastructure, against your systems — under your control.",
    },
  },
];
