/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Editions (Community · Cloud)
   2026 is the year of community & adoption — not sales. No prices.
   Community = the hero product. Cloud = announced, waitlist only.
   Bilingual content (FR-CA default + EN). Externalized per [ERR-115].
   ═══════════════════════════════════════════════════════════════════ */

export type LocalizedText = { fr: string; en: string };

export type EditionId = "community" | "cloud";

export interface Edition {
  id: EditionId;
  name: LocalizedText;
  tagline: LocalizedText;
  whoFor: LocalizedText;
  /** Availability label — never a price. */
  status: LocalizedText;
  /** "available" renders a live badge; "waitlist" renders a muted one. */
  availability: "available" | "waitlist";
  features: LocalizedText[];
  sovereignty: LocalizedText;
  cta: LocalizedText;
  ctaHref: string;
  /** When true the CTA opens the inline waitlist instead of navigating. */
  ctaWaitlist?: boolean;
  featured?: boolean;
}

export const EDITIONS: Edition[] = [
  {
    id: "community",
    name: { fr: "Orasaka Community", en: "Orasaka Community" },
    tagline: {
      fr: "Le moteur complet, open source, auto-hébergé.",
      en: "The full engine, open source, self-hosted.",
    },
    whoFor: {
      fr: "Pour les développeurs et les équipes qui veulent tout contrôler.",
      en: "For developers and teams who want full control.",
    },
    status: { fr: "Disponible", en: "Available" },
    availability: "available",
    features: [
      { fr: "Moteur complet : chat, RAG, agents, image, audio, vidéo", en: "Full engine: chat, RAG, agents, image, audio, video" },
      { fr: "Pipeline d'orchestration à 15 intercepteurs, composable", en: "15-interceptor orchestration pipeline, composable" },
      { fr: "Architecture hexagonale vérifiée par ArchUnit, extensible (SPI UseCase)", en: "Hexagonal architecture verified by ArchUnit, extensible (UseCase SPI)" },
      { fr: "Modèles locaux (Ollama, LocalAI) — aucune dépendance cloud", en: "Local models (Ollama, LocalAI) — no cloud dependency" },
      { fr: "Composition manuelle des Packages d'intercepteurs", en: "Manual composition of interceptor Packages" },
      { fr: "Gratuit pour toujours · support communautaire", en: "Free forever · community support" },
    ],
    sovereignty: {
      fr: "Tourne entièrement sur ton infrastructure — rien ne sort de ton réseau.",
      en: "Runs entirely on your infrastructure — nothing leaves your network.",
    },
    cta: { fr: "Démarrer en 3 commandes", en: "Get started in 3 commands" },
    ctaHref: "/products/orasaka/getting-started/101",
    featured: true,
  },
  {
    id: "cloud",
    name: { fr: "Orasaka Cloud", en: "Orasaka Cloud" },
    tagline: {
      fr: "White-label et Packages en un clic.",
      en: "White-label and one-click Packages.",
    },
    whoFor: {
      fr: "Pour les organisations qui veulent déployer Orasaka sous leur marque.",
      en: "For organizations deploying Orasaka under their own brand.",
    },
    status: { fr: "2026 — Liste d'attente", en: "2026 — Waitlist" },
    availability: "waitlist",
    features: [
      { fr: "White-label : déploie Orasaka sous ta propre marque", en: "White-label: deploy Orasaka under your own brand" },
      { fr: "Active des Packages d'intercepteurs en un clic", en: "Enable interceptor Packages in one click" },
      { fr: "Teste et compare des Packages par domaine sans config", en: "Test and compare domain Packages with zero config" },
      { fr: "Les mêmes garanties local-first du moteur Community", en: "The same local-first guarantees as the Community engine" },
    ],
    sovereignty: {
      fr: "Mêmes principes souverains que Community ; aperçu géré, en préparation.",
      en: "Same sovereign principles as Community; a managed preview, in the works.",
    },
    cta: { fr: "Rejoindre la liste d'attente", en: "Join the waitlist" },
    ctaHref: "#waitlist",
    ctaWaitlist: true,
  },
];
