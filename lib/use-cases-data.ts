import type { Locale } from "./i18n";

/* ═══════════════════════════════════════════════════════════════════
   USE CASE — Full Page Data
   ═══════════════════════════════════════════════════════════════════ */

export interface UseCaseData {
  slug: string;
  industry: { fr: string; en: string };
  title: { fr: string; en: string };
  metaDescription: { fr: string; en: string };
  problem: { fr: string; en: string };
  solution: { fr: string; en: string };
  features: Array<{ fr: string; en: string }>;
  relatedDocs: Array<{ title: string; href: string }>;
}

export const USE_CASES: UseCaseData[] = [
  {
    slug: "agences-marketing",
    industry: { fr: "Agences marketing", en: "Marketing Agencies" },
    title: {
      fr: "IA locale pour agences marketing",
      en: "Local AI for Marketing Agencies",
    },
    metaDescription: {
      fr: "Générez du contenu, des rapports et des visuels avec Orasaka — directement sur votre infrastructure. Aucune donnée client ne quitte votre agence.",
      en: "Generate content, reports, and visuals with Orasaka — directly on your infrastructure. No client data ever leaves your agency.",
    },
    problem: {
      fr: "Les agences manipulent des données sensibles de marque : briefs stratégiques, données clients, rapports de performance. Envoyer ces données à ChatGPT ou d'autres API cloud expose vos clients à des fuites de propriété intellectuelle. Chaque prompt envoyé à un service tiers peut être utilisé pour l'entraînement de modèles.",
      en: "Agencies handle sensitive brand data: strategic briefs, client data, performance reports. Sending this data to ChatGPT or other cloud APIs exposes your clients to IP leaks. Every prompt sent to a third-party service may be used for model training.",
    },
    solution: {
      fr: "Orasaka exécute toutes les inférences IA localement via Ollama et des modèles open source. Générez des textes publicitaires, résumez des rapports de performance, créez des variations de contenu — sans qu'un seul octet ne transite par Internet. L'architecture hexagonale d'Orasaka isole chaque module pour que vos données restent compartimentées.",
      en: "Orasaka runs all AI inference locally via Ollama and open-source models. Generate ad copy, summarize performance reports, create content variations — without a single byte transiting the internet. Orasaka's hexagonal architecture isolates each module to keep your data compartmentalized.",
    },
    features: [
      { fr: "Génération de texte (blog, social, email)", en: "Text generation (blog, social, email)" },
      { fr: "Résumé automatique de rapports", en: "Automated report summarization" },
      { fr: "Pipeline multi-modal (texte + image)", en: "Multi-modal pipeline (text + image)" },
      { fr: "Aucune API cloud requise", en: "No cloud API required" },
      { fr: "Compatible Apple Silicon (MLX)", en: "Apple Silicon compatible (MLX)" },
    ],
    relatedDocs: [
      { title: "Architecture Core", href: "/products/orasaka/architecture/core" },
      { title: "Model Catalog", href: "/products/orasaka/architecture/models" },
      { title: "CLI Reference", href: "/products/orasaka/api/cli" },
    ],
  },
  {
    slug: "ventes-prospection",
    industry: { fr: "Ventes et prospection", en: "Sales & Prospection" },
    title: {
      fr: "IA prospection commerciale on-premise",
      en: "On-Premise AI for Sales Prospection",
    },
    metaDescription: {
      fr: "Enrichissez vos leads, rédigez des approches personnalisées et analysez vos données CRM avec une IA qui tourne sur votre serveur.",
      en: "Enrich leads, draft personalized outreach, and analyze CRM data with AI running on your own server.",
    },
    problem: {
      fr: "Les équipes commerciales jonglent entre les CRM, les fichiers de leads et les templates d'emails. L'utilisation d'outils IA cloud pour enrichir des contacts expose des données sensibles de prospection — noms, emails, historique d'achats — à des serveurs tiers hors de votre contrôle.",
      en: "Sales teams juggle CRMs, lead files, and email templates. Using cloud AI tools to enrich contacts exposes sensitive prospection data — names, emails, purchase history — to third-party servers outside your control.",
    },
    solution: {
      fr: "Avec Orasaka, votre pipeline de prospection reste entièrement local. Scorez vos leads par pertinence, générez des approches email personnalisées par modèle local, et résumez automatiquement les notes CRM de vos commerciaux. Le pipeline d'intercepteurs à 15 nœuds enrichit chaque requête avec le contexte de votre pipeline.",
      en: "With Orasaka, your prospection pipeline stays entirely local. Score leads by relevance, generate personalized email outreach via local models, and auto-summarize your sales reps' CRM notes. The 15-node interceptor pipeline enriches each request with your pipeline context.",
    },
    features: [
      { fr: "Lead scoring par modèle local", en: "Lead scoring via local model" },
      { fr: "Rédaction d'emails de prospection", en: "Prospection email drafting" },
      { fr: "Résumé de notes CRM", en: "CRM notes summarization" },
      { fr: "Intégration MCP pour données externes", en: "MCP integration for external data" },
      { fr: "Données commerciales 100% privées", en: "100% private sales data" },
    ],
    relatedDocs: [
      { title: "MCP Tool Registry", href: "/products/orasaka/core-features/automation" },
      { title: "Pipeline Interceptors", href: "/products/orasaka/architecture/core" },
      { title: "API Reference", href: "/products/orasaka/api/api_reference" },
    ],
  },
  {
    slug: "juridique-finance",
    industry: { fr: "Juridique et finance", en: "Legal & Finance" },
    title: {
      fr: "IA confidentielle pour cabinets juridiques",
      en: "Confidential AI for Law Firms",
    },
    metaDescription: {
      fr: "Analysez des contrats, extrayez des clauses et identifiez des risques en toute confidentialité. Le secret professionnel reste intact avec Orasaka.",
      en: "Analyze contracts, extract clauses, and identify risks confidentially. Attorney-client privilege stays intact with Orasaka.",
    },
    problem: {
      fr: "Le secret professionnel est la pierre angulaire des professions juridiques et financières. Utiliser des outils IA cloud pour analyser des contrats, des clauses ou des dossiers clients constitue un risque de violation du secret. Les régulateurs sont de plus en plus stricts sur le traitement des données sensibles.",
      en: "Attorney-client privilege is the cornerstone of legal and financial professions. Using cloud AI tools to analyze contracts, clauses, or client files is a violation risk. Regulators are increasingly strict about sensitive data processing.",
    },
    solution: {
      fr: "Orasaka est conçu pour les environnements réglementés. Analysez des milliers de pages de contrats, extrayez des clauses pertinentes, identifiez des incohérences — le tout sans qu'aucune donnée ne quitte votre réseau interne. Compatible avec des déploiements air-gapped pour les environnements les plus sensibles.",
      en: "Orasaka is designed for regulated environments. Analyze thousands of contract pages, extract relevant clauses, identify inconsistencies — all without any data leaving your internal network. Compatible with air-gapped deployments for the most sensitive environments.",
    },
    features: [
      { fr: "Analyse de contrats multi-pages", en: "Multi-page contract analysis" },
      { fr: "Extraction de clauses spécifiques", en: "Specific clause extraction" },
      { fr: "Identification de risques juridiques", en: "Legal risk identification" },
      { fr: "Compatible déploiement air-gapped", en: "Air-gapped deployment compatible" },
      { fr: "Secret professionnel préservé", en: "Attorney-client privilege preserved" },
    ],
    relatedDocs: [
      { title: "Auth & Security", href: "/products/orasaka/core-features/auth" },
      { title: "Deployment (IaC)", href: "/products/orasaka/operations/deploy" },
      { title: "Architecture", href: "/products/orasaka/architecture/architecture" },
    ],
  },
  {
    slug: "support-client",
    industry: { fr: "Support client", en: "Customer Support" },
    title: {
      fr: "IA service client on-premise",
      en: "On-Premise AI for Customer Support",
    },
    metaDescription: {
      fr: "Classifiez les tickets, générez des réponses et routez les escalades avec une IA qui ne partage jamais vos données clients.",
      en: "Classify tickets, generate responses, and route escalations with AI that never shares your customer data.",
    },
    problem: {
      fr: "Le support client traite des informations personnelles identifiables en continu : noms, adresses, numéros de compte, historique d'achats. Chaque interaction client envoyée à un chatbot cloud crée un point de vulnérabilité supplémentaire pour la conformité LPRPDE et Loi 25.",
      en: "Customer support processes personally identifiable information continuously: names, addresses, account numbers, purchase history. Every client interaction sent to a cloud chatbot creates an additional vulnerability point for PIPEDA and Law 25 compliance.",
    },
    solution: {
      fr: "Orasaka permet de déployer un agent de triage IA directement sur votre serveur. Les tickets entrants sont classifiés par urgence et catégorie, des réponses contextuelles sont générées automatiquement, et les cas complexes sont escaladés aux agents humains — le tout sans que vos données clients ne quittent votre infrastructure.",
      en: "Orasaka lets you deploy an AI triage agent directly on your server. Incoming tickets are classified by urgency and category, contextual responses are generated automatically, and complex cases are escalated to human agents — all without your customer data leaving your infrastructure.",
    },
    features: [
      { fr: "Triage automatique par IA locale", en: "Automated triage via local AI" },
      { fr: "Génération de réponses contextuelles", en: "Contextual response generation" },
      { fr: "Routage d'escalades intelligent", en: "Intelligent escalation routing" },
      { fr: "Intégration via MCP/API", en: "Integration via MCP/API" },
      { fr: "Aucune donnée client en transit", en: "No customer data in transit" },
    ],
    relatedDocs: [
      { title: "Pipeline Interceptors", href: "/products/orasaka/architecture/core" },
      { title: "API Reference", href: "/products/orasaka/api/api_reference" },
      { title: "Feature Matrix", href: "/products/orasaka/core-features/master_features" },
    ],
  },
  {
    slug: "immobilier",
    industry: { fr: "Immobilier", en: "Real Estate" },
    title: {
      fr: "IA pour l'immobilier — Évaluations et annonces",
      en: "AI for Real Estate — Valuations & Listings",
    },
    metaDescription: {
      fr: "Générez des descriptions de propriétés, analysez le marché et associez acheteurs et inventaire avec une IA locale conforme Loi 25.",
      en: "Generate property descriptions, analyze the market, and match buyers to inventory with local AI, Law 25 compliant.",
    },
    problem: {
      fr: "Les agences immobilières manipulent des données financières sensibles : prix d'achat, évaluations, dossiers de crédit des acheteurs. Générer des descriptions de propriétés ou des analyses comparatives via des outils cloud expose ces données financières à des tiers.",
      en: "Real estate agencies handle sensitive financial data: purchase prices, valuations, buyer credit files. Generating property descriptions or comparative analyses via cloud tools exposes this financial data to third parties.",
    },
    solution: {
      fr: "Orasaka génère des descriptions de propriétés à partir de fiches techniques, produit des analyses comparatives de marché, et peut associer les critères d'acheteurs à l'inventaire disponible — entièrement en local. Le pipeline multi-modal permet de traiter photos, textes et données structurées dans une seule requête.",
      en: "Orasaka generates property descriptions from spec sheets, produces comparative market analyses, and can match buyer criteria to available inventory — entirely locally. The multi-modal pipeline processes photos, text, and structured data in a single request.",
    },
    features: [
      { fr: "Génération de descriptions de propriétés", en: "Property description generation" },
      { fr: "Analyse comparative de marché", en: "Comparative market analysis" },
      { fr: "Association acheteur-inventaire", en: "Buyer-inventory matching" },
      { fr: "Pipeline multi-modal (photo + texte)", en: "Multi-modal pipeline (photo + text)" },
      { fr: "Données financières protégées", en: "Protected financial data" },
    ],
    relatedDocs: [
      { title: "Model Catalog", href: "/products/orasaka/architecture/models" },
      { title: "Architecture Core", href: "/products/orasaka/architecture/core" },
      { title: "CLI Reference", href: "/products/orasaka/api/cli" },
    ],
  },
  {
    slug: "sante-cliniques",
    industry: { fr: "Santé et cliniques", en: "Healthcare & Clinics" },
    title: {
      fr: "IA santé conforme Loi 25 — Données patients",
      en: "Law 25 Compliant Healthcare AI — Patient Data",
    },
    metaDescription: {
      fr: "Résumez des notes cliniques, automatisez l'admission et assistez le triage — entièrement on-premise, conforme Loi 25 du Québec.",
      en: "Summarize clinical notes, automate intake, and assist triage — fully on-premise, Quebec Law 25 compliant.",
    },
    problem: {
      fr: "Les données de santé sont parmi les plus réglementées au monde. Au Québec, la Loi 25 impose des obligations strictes sur le traitement des renseignements de santé. Les cliniques et hôpitaux ne peuvent pas envoyer des notes cliniques, diagnostics ou informations patient à des serveurs cloud sans violer la loi.",
      en: "Health data is among the most regulated in the world. In Quebec, Law 25 imposes strict obligations on health information processing. Clinics and hospitals cannot send clinical notes, diagnoses, or patient information to cloud servers without violating the law.",
    },
    solution: {
      fr: "Orasaka s'exécute entièrement sur votre infrastructure locale. Résumez des notes cliniques pour accélérer la consultation, automatisez les formulaires d'admission, assistez le triage des patients par niveau d'urgence — sans qu'aucune donnée patient ne quitte l'enceinte de votre établissement. Compatible avec des réseaux isolés (air-gapped).",
      en: "Orasaka runs entirely on your local infrastructure. Summarize clinical notes to speed up consultations, automate intake forms, assist patient triage by urgency level — without any patient data leaving your facility. Compatible with isolated networks (air-gapped).",
    },
    features: [
      { fr: "Résumé de notes cliniques", en: "Clinical notes summarization" },
      { fr: "Automatisation des formulaires d'admission", en: "Intake form automation" },
      { fr: "Assistance au triage par urgence", en: "Urgency-based triage assistance" },
      { fr: "Déploiement réseau isolé (air-gapped)", en: "Isolated network deployment (air-gapped)" },
      { fr: "Conforme Loi 25 par architecture", en: "Law 25 compliant by architecture" },
    ],
    relatedDocs: [
      { title: "Auth & Security", href: "/products/orasaka/core-features/auth" },
      { title: "Deployment (IaC)", href: "/products/orasaka/operations/deploy" },
      { title: "Feature Matrix", href: "/products/orasaka/core-features/master_features" },
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
