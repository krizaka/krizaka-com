import type { Locale } from "./i18n";

/* ═══════════════════════════════════════════════════════════════════
   USE CASE — Full Page Data
   ═══════════════════════════════════════════════════════════════════ */

export interface UseCaseActionPlanStep {
  phase: string;
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
}

export interface UseCaseData {
  slug: string;
  packageId: string;
  industry: { fr: string; en: string };
  title: { fr: string; en: string };
  metaDescription: { fr: string; en: string };
  problem: { fr: string; en: string };
  solution: { fr: string; en: string };
  features: Array<{ fr: string; en: string }>;
  relatedDocs: Array<{ title: string; href: string }>;
  quebecContext: { fr: string; en: string };
  quebecLinks: Array<{ title: string; url: string }>;
  actionPlan: UseCaseActionPlanStep[];
}

export const USE_CASES: UseCaseData[] = [
  {
    slug: "local-prospecting",
    packageId: "prospection",
    industry: { fr: "Services de proximité", en: "Local Services" },
    title: {
      fr: "Orazaka Sentinelle : Prospection locale souveraine",
      en: "Orazaka Sentinel: Sovereign Local Outreach",
    },
    metaDescription: {
      fr: "Automatisez la prospection locale B2C et B2B pour votre métier en scannant les chantiers et les ventes foncières de manière éthique et 100% locale.",
      en: "Automate local B2C and B2B outreach for your trade by scanning public permits and properties ethically and 100% locally.",
    },
    problem: {
      fr: "Martin est électricien indépendant à Montréal. Chaque semaine, il consacre près de 10 heures à la recherche manuelle d'opportunités : 5h de veille sur les réseaux et babillards, 2h de consultation du Registre foncier du Québec, et 3h de rédaction de courriers. Au Québec, la Loi canadienne anti-spam (LCEE) interdit l'envoi de courriels commerciaux B2C sans consentement préalable. De plus, la Loi 25 interdit le traitement de données personnelles de citoyens sur des IA cloud sans évaluation approfondie. Martin est bloqué : il doit prospecter mais ne peut ni spammer, ni envoyer ses données de prospects dans le cloud.",
      en: "Martin is a solo electrician in Montreal. Every week, he spends nearly 10 hours searching for opportunities manually: 5h scanning social groups and boards, 2h checking the Quebec Land Registry, and 3h writing letters. In Quebec, CASL anti-spam laws prohibit B2C commercial emails without consent. Furthermore, Law 25 bans processing citizen PII on cloud AIs without a Privacy Impact Assessment. Martin is stuck: he needs to find clients but cannot spam or upload prospect data to cloud servers.",
    },
    solution: {
      fr: "Orazaka Sentinelle s'installe localement sur l'ordinateur de Martin. Le package automatise sa veille territoriale en interceptant les permis et les transactions publiques. Il prépare des enveloppes prêtes à poster pour le B2C (une approche papier légale qui échappe à la LCEE) et des e-mails ciblés pour le B2B. Grâce à une boucle de relance locale configurable dans `sentinelle.config.json`, Martin peut automatiquement ajuster, suspendre ou stopper ses relances dès qu'un prospect interagit, garantissant une approche éthique, légale et sans aucune fuite cloud.",
      en: "Orazaka Sentinel runs locally on Martin's computer. The package automates his territorial watch by intercepting public permits and registry deals. It drafts ready-to-mail postcards for B2C (a physical approach that is exempt from CASL) and targeted emails for B2B. Thanks to a local feedback loop configured in `sentinelle.config.json`, Martin can automatically adjust, pause, or terminate follow-up sequences based on prospect replies, ensuring ethical, compliant outreach with zero cloud leaks.",
    },
    features: [
      { fr: "Scan de permis municipaux & transactions foncières via MCP locaux", en: "Municipal permit & land registry scanning via local MCPs" },
      { fr: "Génération automatique de publipostage physique (B2C légal hors LCEE)", en: "Auto-drafting of physical mailers (CASL-exempt B2C outreach)" },
      { fr: "Prospection B2B qualifiée sous exemption de messagerie d'affaires", en: "Qualified B2B prospecting matching business contact exemptions" },
      { fr: "Boucle de relance locale intelligente et configurable (Feedback Loop)", en: "Intelligent, configurable local follow-up and feedback loop" },
      { fr: "Isolation 100% souveraine conforme Loi 25 (zéro cloud tiers)", en: "100% sovereign isolation compliant with Law 25 (zero cloud leaks)" },
    ],
    relatedDocs: [
      { title: "Architecture Core", href: "/products/orazaka/architecture/core" },
      { title: "CLI Reference", href: "/products/orazaka/api/cli" },
      { title: "MCP Tool Registry", href: "/products/orazaka/core-features/automation" },
    ],
    quebecContext: {
      fr: "Au Québec, la prospection directe est encadrée par de strictes règles de protection de la vie privée et de démarchage électronique. La Loi canadienne anti-spam (LCEE/CASL) interdit formellement l'envoi de messages commerciaux électroniques sans consentement préalable, rendant la prospection B2C par courriel illégale pour cibler de nouveaux propriétaires. Pour le B2C, le publipostage physique postal reste la voie privilégiée et légale car il échappe à la LCEE. Parallèlement, la Loi 25 exige que le profilage ou la gestion de fichiers de clients potentiels respectent le principe de souveraineté des données. Orazaka Sentinelle concilie ces impératifs en exécutant l'intégralité du traitement en local, éliminant le besoin de stocker des renseignements personnels dans des infrastructures cloud tierces, et en automatisant des relances conformes et éthiques.",
      en: "In Quebec, direct outreach is governed by strict electronic messaging and privacy rules. CASL (anti-spam law) prohibits sending B2C commercial electronic messages without prior consent, making cold B2C emailing illegal. For B2C, physical direct mail (postcards/letters) remains the primary lawful path. Meanwhile, Law 25 mandates that profiling and prospect databases respect data sovereignty. Orazaka Sentinel reconciles these requirements by executing all processing locally on-premise, keeping PII out of third-party cloud servers, and automating compliant, ethical sequences."
    },
    quebecLinks: [
      { title: "CRTC — Loi canadienne anti-spam (LCEE)", url: "https://crtc.gc.ca/fra/archive/2012/2012-548.htm" },
      { title: "Commission d'accès à l'information (CAI) — Nouvelles obligations", url: "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/information-entreprises-privees/nouvelles-responsabilites-entreprises" },
    ],
    actionPlan: [
      {
        phase: "01",
        title: { fr: "Configuration locale du profil", en: "Local Profile Config" },
        desc: {
          fr: "Définissez votre spécialité (ex: électricien) et vos zones géographiques cibles directement dans votre fichier local.",
          en: "Set your specialty (e.g. electrician) and target postal code zones directly in your local config file.",
        },
      },
      {
        phase: "02",
        title: { fr: "Veille automatisée du territoire", en: "Automated Territorial Watch" },
        desc: {
          fr: "La sentinelle interroge les permis et les transactions de vente publics sans transmettre aucune donnée externe.",
          en: "The sentinel queries public building permit feeds and sales logs without transmitting data outside your network.",
        },
      },
      {
        phase: "03",
        title: { fr: "Qualification locale de l'intention", en: "Local Intent Qualification" },
        desc: {
          fr: "Analyse sémantique (LLM local) pour cibler les projets pertinents (ex: permis de borne VE = besoin d'augmentation de panneau).",
          en: "Semantic analysis (local LLM) to highlight relevant projects (e.g. EV charger permit = electric panel upgrade need).",
        },
      },
      {
        phase: "04",
        title: { fr: "Envoi et boucle de rétroaction", en: "Dispatch & Feedback Loop" },
        desc: {
          fr: "Les courriers physiques B2C et courriels B2B sont générés. Le système ajuste la séquence de relance selon les retours.",
          en: "B2C letters and B2B emails are drafted. The system dynamically updates or stops outreach sequences based on replies.",
        },
      },
    ],
  },
];

/* ─── Helpers ─── */

export function getUseCaseBySlug(slug: string): UseCaseData | undefined {
  return USE_CASES.find((uc) => uc.slug === slug);
}

export function getLocalizedField(
  field: { fr: string; en: string },
  locale: Locale,
): string {
  return field[locale];
}

export function getAllUseCaseSlugs(): string[] {
  return USE_CASES.map((uc) => uc.slug);
}
