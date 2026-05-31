/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Typed i18n System
   ─────────────────────────────────────────────────────────────────
   FR (default — Québec market) + EN
   2026 editorial line: community & adoption, not sales. Dev-first, honest.
   All user-facing strings are externalized here. [ERR-115]
   ═══════════════════════════════════════════════════════════════════ */

export type Locale = "fr" | "en";

export const DEFAULT_LOCALE: Locale = "fr";

export interface TranslationDictionary {
  /* ─── Global ─── */
  meta: {
    siteTitle: string;
    siteDescription: string;
    ogTitle: string;
    ogDescription: string;
  };

  /* ─── Navigation ─── */
  nav: {
    products: string;
    solutions: string;
    docs: string;
    compliance: string;
    useCases: string;
    getStarted: string;
    menu: string;
    close: string;
    darkMode: string;
    lightMode: string;
    language: string;
    orasakaDesc: string;
    architecture: string;
    roadmap: string;
    editions: string;
    viewDocs: string;
    byEdition: string;
    recommended: string;
    demos: string;
    community: string;
    packages: string;
    start: string;
    githubAria: string;
    starsAria: string;
  };

  /* ─── Hero ─── */
  hero: {
    headline: string;
    headlineAccent: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badge: string;
  };

  /* ─── Quickstart (code-first, high on home) ─── */
  quickstart: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    note: string;
    docsCta: string;
    communityCta: string;
  };

  /* ─── Feature Pillars ─── */
  pillars: {
    sectionLabel: string;
    sectionTitle: string;
    items: Array<{
      keyword: string;
      title: string;
      desc: string;
    }>;
  };

  /* ─── Tech Stack ─── */
  techStack: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
  };

  /* ─── Use Cases ─── */
  useCases: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    viewAll: string;
    learnMore: string;
    items: Array<{
      industry: string;
      title: string;
      desc: string;
      slug: string;
    }>;
  };

  /* ─── Editions (home section) ─── */
  editions: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    available: string;
    waitlist: string;
    learnMore: string;
    joinWaitlist: string;
    compareAll: string;
  };

  /* ─── Packages (home section + page) ─── */
  packages: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    concept: string;
    composedOf: string;
    manualNote: string;
    cloudNote: string;
    viewUseCase: string;
    viewAll: string;
    pageTitle: string;
    pageDesc: string;
  };

  /* ─── Community (home section) ─── */
  community: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    items: Array<{ title: string; desc: string; cta: string }>;
    waitlistTitle: string;
    waitlistDesc: string;
  };

  /* ─── FAQ (home section, FAQPage schema) ─── */
  faq: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    items: Array<{ q: string; a: string }>;
  };

  /* ─── Contact & partnerships page ─── */
  contact: {
    pageTitle: string;
    pageDesc: string;
    heading: string;
    intro: string;
    channels: Array<{ title: string; desc: string; cta: string; kind: string }>;
    backHome: string;
  };

  /* ─── Docs reading chrome ─── */
  docsNav: {
    onThisPage: string;
    readingTime: string;
    minRead: string;
    prev: string;
    next: string;
  };

  /* ─── Docs Preview ─── */
  docsPreview: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    viewAllDocs: string;
  };

  /* ─── Compliance ─── */
  compliance: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSub: string;
    openSourceNote: string;
    auditOnGithub: string;
    items: Array<{
      tag: string;
      title: string;
      desc: string;
      cta: string;
    }>;
  };

  /* ─── Footer ─── */
  footer: {
    product: string;
    solutions: string;
    legal: string;
    social: string;
    documentation: string;
    architecture: string;
    privacy: string;
    terms: string;
    loi25: string;
    allRights: string;
    openSource: string;
    explore: string;
    community: string;
    useCases: string;
    compliance: string;
    contact: string;
    roadmap: string;
    demos: string;
    packages: string;
    editions: string;
    github: string;
    tagline: string;
  };

  /* ─── Cognitive Engineering ─── */
  cognitiveEngineering: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSub: string;
    sectionDesc: string;
    ctaLabel: string;
    ctaHref: string;
    agnosticTitle: string;
    agnosticDesc: string;
    deterministicTitle: string;
    deterministicDesc: string;
    effortTitle: string;
    effortDesc: string;
    stages: Array<{
      order: string;
      name: string;
      desc: string;
    }>;
    principles: Array<{
      title: string;
      desc: string;
    }>;
  };

  /* ─── Cognitive Engineering Page ─── */
  cognitiveEngineeringPage: {
    pageTitle: string;
    pageDesc: string;
    introTitle: string;
    introText: string;
    pipelineTitle: string;
    pipelineDesc: string;
    principlesTitle: string;
    principlesDesc: string;
    diffTitle: string;
    diffItems: Array<{
      cloud: string;
      orasaka: string;
    }>;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    backHome: string;
  };

  /* ─── Use Case Pages ─── */
  useCasePage: {
    backToUseCases: string;
    problem: string;
    solution: string;
    keyFeatures: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    relatedDocs: string;
    relatedPackage: string;
    composePackage: string;
  };
}

/* ═══════════════════════════════════════════════════════════════════
   FRENCH (Default — Québec)
   ═══════════════════════════════════════════════════════════════════ */

const fr: TranslationDictionary = {
  meta: {
    siteTitle: "Krizaka — Orasaka, moteur d'orchestration IA souverain open source",
    siteDescription:
      "Orasaka est un moteur d'orchestration IA souverain et open source — Java 21, Spring AI, pipeline à 15 intercepteurs, multimodal. Auto-héberge une IA locale conçue pour faciliter la conformité Loi 25 et RGPD. Conçu au Québec.",
    ogTitle: "Orasaka — moteur d'orchestration IA souverain, open source",
    ogDescription:
      "Le moteur d'orchestration IA que tu héberges toi-même. Java 21 · Spring AI · 15 intercepteurs · multimodal. Open source, souverain, conçu au Québec.",
  },

  nav: {
    products: "Produits",
    solutions: "Solutions",
    docs: "Docs",
    compliance: "Conformité",
    useCases: "Cas d'usage",
    getStarted: "Commencer",
    menu: "Menu",
    close: "Fermer",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    language: "Langue",
    orasakaDesc: "Moteur d'orchestration IA souverain",
    architecture: "Architecture",
    roadmap: "Roadmap",
    editions: "Éditions",
    viewDocs: "Documentation",
    byEdition: "Par édition",
    recommended: "Recommandé",
    demos: "Démos",
    community: "Communauté",
    packages: "Packages",
    start: "Démarrer",
    githubAria: "Voir le dépôt sur GitHub",
    starsAria: "étoiles GitHub",
  },

  hero: {
    headline: "Le moteur d'orchestration IA souverain.",
    headlineAccent: "Open source.",
    sub: "Java 21 · Spring AI · 15 intercepteurs · multimodal. Une infrastructure cognitive que tu héberges toi-même — conçue au Québec.\nTes données ne quittent jamais ton réseau.",
    ctaPrimary: "Démarrer en 3 commandes",
    ctaSecondary: "Star sur GitHub",
    badge: "Open Source",
  },

  quickstart: {
    sectionLabel: "Quickstart",
    sectionTitle: "Démarre en 3 commandes",
    sectionDesc: "Une seule dépendance : Node. Orasaka installe le moteur, le lance et ouvre le mode dev.",
    note: "Besoin du détail ? Le guide d'installation couvre Docker, Ollama et la configuration.",
    docsCta: "Lire les docs",
    communityCta: "Rejoindre la communauté",
  },

  pillars: {
    sectionLabel: "Ce que fait Orasaka",
    sectionTitle: "Toute l'IA moderne, dans un seul moteur.",
    items: [
      {
        keyword: "Souverain",
        title: "Tes données ne sortent jamais",
        desc: "Chaque inférence s'exécute localement. Aucun relais cloud, aucune API tierce. Compatible Ollama, LocalAI et modèles open source.",
      },
      {
        keyword: "Multi-Modal",
        title: "Chat · Image · Vidéo · Voix",
        desc: "Un seul moteur pour chaque modalité IA — unifié sous une couche d'orchestration à 15 intercepteurs.",
      },
      {
        keyword: "Hybride",
        title: "Tes clés, ton choix",
        desc: "Besoin de GPT-4, Claude ou Gemini ? Apporte tes clés API — Orasaka route intelligemment tout en gardant ton orchestration souveraine.",
      },
      {
        keyword: "Open Source",
        title: "Code ouvert, auditable",
        desc: "Architecture hexagonale vérifiée par ArchUnit. Chaque décision architecturale est documentée et le code est disponible sur GitHub.",
      },
      {
        keyword: "Validé",
        title: "Vérification en boucle fermée",
        desc: "Chaque réponse passe par une matrice de validation multi-étapes avant d'atteindre tes utilisateurs.",
      },
    ],
  },

  techStack: {
    sectionLabel: "Stack technologique",
    sectionTitle: "Construit avec des technologies éprouvées",
    sectionDesc:
      "Java 21 Virtual Threads, Spring AI, architecture hexagonale — pas de frameworks expérimentaux.",
  },

  useCases: {
    sectionLabel: "L'Infrastructure en Action",
    sectionTitle: "Solutions Souveraines par Secteur",
    sectionDesc:
      "De l'automatisation sécurisée à l'analyse sous secret professionnel : découvrez six configurations concrètes adaptées aux exigences réglementaires de la Loi 25 et du RGPD.",
    viewAll: "Explorer tous les cas d'usage",
    learnMore: "Fiche technique",
    items: [
      {
        industry: "Agences & Médias",
        title: "Génération Sécurisée de Contenu & Rapports",
        desc: "Générez des livrables stratégiques, des publications de marque et des analyses de performance sans jamais exposer les briefs ou les insights clients à des tiers.",
        slug: "agences-marketing",
      },
      {
        industry: "Ventes & Relation Client",
        title: "Enrichissement Sémantique de Leads",
        desc: "Qualifiez vos opportunités d'affaires, personnalisez les approches et compilez les résumés CRM localement sur votre propre serveur d'infrastructure.",
        slug: "ventes-prospection",
      },
      {
        industry: "Juridique & Finance",
        title: "Audit et Analyse de Pièces Confidentielles",
        desc: "Interrogez des contrats volumineux et auditez des rapports de conformité financière en préservant l'intégrité absolue du secret professionnel.",
        slug: "juridique-finance",
      },
      {
        industry: "Support Client",
        title: "Triage et Service Clientèle Autonome",
        desc: "Catégorisez les tickets d'assistance par intention et niveau d'urgence, puis génerez des résolutions contextuelles sans fuite d'informations personnelles.",
        slug: "support-client",
      },
      {
        industry: "Immobilier",
        title: "Rédaction d'Annonces & Jumelage d'Inventaire",
        desc: "Automatisez la création de fiches descriptives et associez l'intention d'achat à votre catalogue de propriétés en local.",
        slug: "immobilier",
      },
      {
        industry: "Santé & Cliniques",
        title: "Synthèse Clinique et Aide au Triage Patient",
        desc: "Structurez les rapports cliniques, résumez les dossiers d'admission et assistez la prise de décision médicale dans un environnement hermétique Loi 25.",
        slug: "sante-cliniques",
      },
    ],
  },

  editions: {
    sectionLabel: "Éditions",
    sectionTitle: "Deux façons de faire tourner Orasaka",
    sectionDesc:
      "Community est le produit héros : open source, auto-hébergé, gratuit pour toujours. Cloud arrive — white-label et Packages en un clic.",
    available: "Disponible",
    waitlist: "Liste d'attente",
    learnMore: "En savoir plus",
    joinWaitlist: "Rejoindre la liste d'attente",
    compareAll: "Comparer les éditions",
  },

  packages: {
    sectionLabel: "Gouvernance",
    sectionTitle: "Les Packages d'Intercepteurs Orasaka",
    sectionDesc:
      "Des topologies de sécurité pré-configurées pour encapsuler vos applications intelligentes selon les normes industrielles.",
    concept:
      "Chaque flux de données traverse séquentiellement le maillage d'Orasaka. Un Package assemble et configure un groupe d'intercepteurs (ex. RAG + Audit + Router) pour certifier la conformité de vos processus.",
    composedOf: "Intercepteurs chaînés",
    manualNote: "Composables manuellement dans Community.",
    cloudNote: "Déploiement en 1 clic dans Cloud (à venir).",
    viewUseCase: "Configurer le package",
    viewAll: "Découvrir tous les Packages",
    pageTitle: "Packages de Gouvernance IA — Orasaka",
    pageDesc:
      "Encapsulez vos requêtes IA avec nos Packages d'intercepteurs pré-configurés : conformité Loi 25, support, analyse documentaire, création de contenu. Sécurité on-premise.",
  },

  community: {
    sectionLabel: "Communauté",
    sectionTitle: "Construisons-le ensemble",
    sectionDesc:
      "Orasaka est un projet naissant et il l'assume. Transparence radicale : tout est public, tout se discute, et chaque contribution compte.",
    items: [
      { title: "Issues", desc: "Signale un bogue, propose une fonctionnalité, suis ce sur quoi on travaille.", cta: "Ouvrir une issue" },
      { title: "Discussions", desc: "Pose tes questions, partage ton déploiement, échange avec les autres adoptants.", cta: "Rejoindre les discussions" },
      { title: "Contribuer", desc: "Le guide de contribution explique l'architecture, les conventions et le workflow.", cta: "Lire le guide" },
      { title: "Good first issues", desc: "De petites tâches balisées pour une première contribution sans friction.", cta: "Trouver une issue" },
    ],
    waitlistTitle: "Orasaka Cloud arrive",
    waitlistDesc:
      "White-label et Packages en un clic. Laisse ton courriel — on te contacte quand l'aperçu est prêt.",
  },

  faq: {
    sectionLabel: "Questions fréquentes",
    sectionTitle: "Tout ce qu'il faut savoir",
    sectionDesc: "Les réponses courtes aux questions qu'on nous pose le plus.",
    items: [
      {
        q: "Qu'est-ce que l'IA souveraine ?",
        a: "Une IA souveraine est une approche technologique où vous conservez la maîtrise absolue de l'ensemble de votre infrastructure cognitive.\n\nContrairement aux solutions SaaS traditionnelles, l'IA souveraine garantit :\n- Exécution locale : Chaque prompt est traité sur vos propres serveurs (physiques ou cloud privés).\n- Contrôle des données : Aucun contenu n'est envoyé à des tiers ou utilisé pour entraîner des modèles externes.\n- Auditabilité totale : Vous pouvez tracer chaque étape de traitement, assurant une conformité parfaite.",
      },
      {
        q: "Orasaka est-il gratuit ?",
        a: "Oui, le cœur du projet est et restera gratuit.\n\nOrasaka Community est distribué sous licence open source. Cela inclut :\n- L'ensemble des 15 intercepteurs du pipeline de cognition.\n- Les fonctionnalités complètes de l'architecture hexagonale.\n- Le support complet pour les modèles locaux (Ollama, LocalAI).\n\nL'édition Cloud (payante, en cours de développement) proposera un hébergement managé par Krizaka, le white-labeling pour les agences, et l'activation des Packages en un clic.",
      },
      {
        q: "Quels modèles d'IA sont supportés ?",
        a: "Orasaka est entièrement agnostique quant aux modèles d'inférence.\n\nVous pouvez utiliser :\n- Modèles locaux : Llama 3, Mistral, Gemma, Phi-3 via Ollama ou LocalAI pour une souveraineté à 100%.\n- Modèles Cloud : GPT-4, Claude 3.5, Gemini Pro via leurs clés API respectives.\n- Modèles hybrides : Router les tâches simples vers un modèle local et les tâches complexes vers un modèle distant tout en gardant l'orchestration souveraine.",
      },
      {
        q: "Comment Orasaka facilite-t-il la conformité à la Loi 25 (Québec) et au RGPD (Europe) ?",
        a: "Orasaka a été conçu dès sa première ligne de code au Québec pour répondre aux exigences modernes de confidentialité.\n\nLe moteur assure la conformité par construction :\n- Localisation des données : Les données ne quittent jamais votre infrastructure ou le territoire canadien.\n- Journal d'audit transparent : L'intercepteur Audit Log trace chaque décision pour répondre aux exigences de transparence.\n- Consentement et sécurité : Aucun relais tiers n'est utilisé, éliminant les risques de fuites ou d'utilisation non autorisée.",
      },
      {
        q: "Quelle différence entre Community et Cloud ?",
        a: "Community s'adresse aux développeurs et équipes auto-hébergeant leur infrastructure. Cloud s'adresse aux organisations cherchant une solution clé en main.\n\n- Community : Code ouvert, hébergement libre (on-premise, Docker), configuration manuelle des intercepteurs.\n- Cloud : Hébergement managé par Krizaka, personnalisation sous votre marque (white-label), et déploiement instantané des Packages par domaine sans code.",
      },
      {
        q: "Qu'est-ce qu'un Package ?",
        a: "Un Package est une composition logique d'intercepteurs d'Orasaka pré-configurée pour un cas d'usage précis.\n\nPar exemple, le Package de Conformité Loi 25 active et chaîne :\n- L'intercepteur Safety Guardrails pour filtrer les données sensibles.\n- L'intercepteur Audit Log pour tracer le traitement.\n- L'intercepteur Cost Shield pour monitorer la consommation.\n\nVous pouvez les assembler manuellement dans la version Community, ou les activer en un clic dans la version Cloud.",
      },
    ],
  },

  contact: {
    pageTitle: "Contact & partenariats",
    pageDesc:
      "Contributions, partenariats, presse ou questions sur Orasaka — voici comment nous joindre. Projet open source, échanges publics par défaut.",
    heading: "Contact & partenariats",
    intro:
      "Orasaka est un projet open source : la plupart des échanges se font en public. Choisis le canal qui correspond à ton besoin.",
    channels: [
      { title: "Questions & entraide", desc: "Une question technique ou d'usage ? Les Discussions GitHub sont l'endroit.", cta: "Ouvrir une discussion", kind: "discussions" },
      { title: "Bogues & fonctionnalités", desc: "Quelque chose ne va pas, ou une idée à proposer ? Ouvre une issue.", cta: "Ouvrir une issue", kind: "issues" },
      { title: "Partenariats & presse", desc: "Collaboration, intégration ou demande média — écris-nous directement.", cta: "Nous écrire", kind: "email" },
      { title: "Orasaka Cloud", desc: "Intéressé par le white-label et les Packages gérés ? Rejoins la liste d'attente.", cta: "Rejoindre la liste d'attente", kind: "waitlist" },
    ],
    backHome: "Retour à l'accueil",
  },

  docsNav: {
    onThisPage: "Sur cette page",
    readingTime: "Temps de lecture",
    minRead: "min",
    prev: "Précédent",
    next: "Suivant",
  },

  docsPreview: {
    sectionLabel: "Documentation",
    sectionTitle: "Explore la documentation technique",
    sectionDesc:
      "Architecture, API, déploiement — tout est documenté et open source.",
    viewAllDocs: "Voir toute la documentation",
  },

  compliance: {
    sectionLabel: "Conformité",
    sectionTitle: "La vie privée n'est pas une fonctionnalité",
    sectionSub: "C'est l'architecture.",
    openSourceNote: "Orasaka est open source. Audite le code sur",
    auditOnGithub: "GitHub",
    items: [
      {
        tag: "Loi 25 (Québec)",
        title: "Souveraineté locale absolue",
        desc: "Sanctions jusqu'à 25M$ (ou 4% du CA mondial). L'exécution 100% locale d'Orasaka élimine l'obligation légale d'Évaluation des Facteurs relatifs à la Vie Privée (EFVP/PIA) requise pour tout transfert de données hors Québec (indispensable avec les APIs d'OpenAI/Anthropic). Vos données ne quittent jamais votre infrastructure physique.",
        cta: "Lire sur le site de la CAI",
      },
      {
        tag: "RGPD",
        title: "Règlement UE 2016/679",
        desc: "Aucun transfert de données hors de ton infrastructure. Protection de la vie privée dès la conception et par défaut.",
        cta: "Lire sur EUR-Lex",
      },
      {
        tag: "PIPEDA",
        title: "Loi fédérale canadienne LPRPDE",
        desc: "Conçu pour s'aligner sur la loi fédérale sur la protection des renseignements personnels. Tes données restent au Canada, sur tes serveurs.",
        cta: "Lire sur le site du commissariat",
      },
    ],
  },

  footer: {
    product: "Produit",
    solutions: "Solutions",
    legal: "Légal",
    social: "Social",
    documentation: "Documentation",
    architecture: "Architecture",
    privacy: "Confidentialité",
    terms: "Conditions",
    loi25: "Loi 25",
    allRights: "Tous droits réservés",
    openSource: "Open Source",
    explore: "Explorer",
    community: "Communauté",
    useCases: "Cas d'usage",
    compliance: "Conformité",
    contact: "Contact",
    roadmap: "Roadmap",
    demos: "Démos",
    packages: "Packages",
    editions: "Éditions",
    github: "GitHub",
    tagline: "Le moteur d'orchestration IA souverain, open source. Conçu au Québec.",
  },

  cognitiveEngineering: {
    sectionLabel: "Ingénierie cognitive",
    sectionTitle: "Au-delà du prompt",
    sectionSub: "L'intelligence est dans le pipeline.",
    sectionDesc:
      "Orasaka ne se contente pas de relayer tes prompts à un modèle. Par défaut, chaque requête traverse un cycle de traitement à 9 étapes séquentielles. Cependant, la force d'Orasaka réside dans sa bibliothèque complète de 15 intercepteurs modulaires (débat multi-agents, bac à sable MCP, audit, validation humaine) que vous pouvez assembler pour composer vos propres Packages de gouvernance.",
    ctaLabel: "Explorer l'ingénierie cognitive",
    ctaHref: "/ingenierie-cognitive",
    agnosticTitle: "Mode Agnostique (Souveraineté)",
    agnosticDesc: "Libre choix du modèle : Ollama en local, ou API cloud (OpenAI, Anthropic, Gemini). Orasaka s'adapte sans verrouillage propriétaire.",
    deterministicTitle: "Mode Déterministe (Précision)",
    deterministicDesc: "Contrôle total du flux : température à 0.0, schémas de sortie stricts (JSON), validation en boucle fermée. Zéro hallucination.",
    effortTitle: "Mode Effort (Profondeur adaptative)",
    effortDesc: "Orasaka jauge la complexité de l'intention et alloue l'effort de raisonnement en conséquence — réponse directe pour le trivial, délibération approfondie pour le critique.",
    stages: [
      { order: "01", name: "Résolution du contexte utilisateur", desc: "Profil, rôle RBAC, tier de rate-limiting" },
      { order: "02", name: "Injection du contexte système", desc: "Variables d'environnement, outils, signaux système" },
      { order: "03", name: "Enrichissement RAG", desc: "Récupération vectorielle → injection de connaissances" },
      { order: "04", name: "Résolution MCP", desc: "Sources de connaissance externes via Model Context Protocol" },
      { order: "05", name: "Mémoire conversationnelle", desc: "Historique FIFO avec fenêtre de 50 messages" },
      { order: "06", name: "Raffinement sémantique", desc: "Requête floue → instruction précise" },
      { order: "07", name: "Routage intentionnel", desc: "Intention → provider optimal (temp: 0.0)" },
      { order: "08", name: "Attachement d'outils", desc: "Callbacks d'outils à la demande" },
      { order: "09", name: "Assemblage multi-modal", desc: "Extraction media base64 et assemblage" },
    ],
    principles: [
      { title: "Enrichissement contextuel", desc: "Chaque prompt est enrichi avec le profil utilisateur, l'historique de conversation et les connaissances RAG avant d'atteindre le modèle." },
      { title: "Routage intentionnel", desc: "L'intention de l'utilisateur est analysée pour router vers le modèle optimal — local Ollama ou provider cloud — avec une température de 0.0 pour maximiser le déterminisme." },
      { title: "Mémoire architecturale", desc: "La mémoire conversationnelle n'est pas un simple buffer. C'est un système FIFO à fenêtre glissante qui préserve le contexte pertinent sans surcharger le context window." },
      { title: "Validation en boucle fermée", desc: "Les réponses sont validées par une matrice multi-étapes — schéma JSON, sandbox MCP, débat multi-agents — avant d'atteindre l'utilisateur." },
    ],
  },

  cognitiveEngineeringPage: {
    pageTitle: "Ingénierie cognitive IA — Pipeline cognitif Orasaka | Krizaka",
    pageDesc: "Découvre comment le pipeline cognitif à 9 étapes d'Orasaka transforme chaque prompt en instruction optimale. Enrichissement contextuel, mémoire architecturale, routage intentionnel.",
    introTitle: "L'ingénierie cognitive, c'est quoi ?",
    introText: "L'ingénierie cognitive appliquée à l'IA consiste à concevoir des systèmes qui augmentent la cognition humaine. Par défaut, Orasaka orchestre un pipeline standard de 9 étapes pour enrichir et structurer les requêtes. Mais son architecture est bâtie sur 15 intercepteurs distincts. Dans le mode Déterministe, vous assemblez ces 15 intercepteurs sous forme de Packages de gouvernance fermés pour garantir une exécution ultra-précise, tandis que le mode Agnostique vous laisse libre du choix des modèles d'inférence (locaux via Ollama ou distants).\n\nC'est la différence entre \"utiliser un chatbot\" et \"déployer une infrastructure cognitive\".",
    pipelineTitle: "Le pipeline cognitif — 9 étapes par défaut",
    pipelineDesc: "Chaque requête traverse séquentiellement 9 intercepteurs par défaut. Chaque étape enrichit le contexte. En parallèle, vous disposez de 15 intercepteurs configurables pour bâtir des règles strictes sur mesure.",
    principlesTitle: "Principes d'ingénierie cognitive",
    principlesDesc: "Quatre piliers fondamentaux qui distinguent Orasaka d'un simple wrapper de LLM.",
    diffTitle: "Cloud chatbot vs. Ingénierie cognitive",
    diffItems: [
      { cloud: "Prompt brut envoyé au modèle", orasaka: "Prompt enrichi par 9 intercepteurs" },
      { cloud: "Pas de mémoire entre les sessions", orasaka: "Mémoire FIFO à fenêtre glissante" },
      { cloud: "Modèle unique imposé", orasaka: "Routage intentionnel vers le modèle optimal" },
      { cloud: "Données envoyées au cloud", orasaka: "Tout reste on-premise" },
      { cloud: "Aucune validation de sortie", orasaka: "Validation multi-étapes en boucle fermée" },
    ],
    ctaTitle: "Commence avec l'ingénierie cognitive",
    ctaDesc: "Orasaka est open source. Déploie le pipeline cognitif sur ton infrastructure en 3 commandes.",
    ctaButton: "Lire la documentation",
    backHome: "Retour à l'accueil",
  },

  useCasePage: {
    backToUseCases: "Retour aux cas d'usage",
    problem: "Le défi",
    solution: "La solution Orasaka",
    keyFeatures: "Fonctionnalités clés",
    ctaTitle: "Essaie-le sur ta machine",
    ctaDesc:
      "Orasaka est open source. Installe-le en 3 commandes et compose le Package qui correspond.",
    ctaButton: "Démarrer en 3 commandes",
    relatedDocs: "Documentation associée",
    relatedPackage: "Package associé",
    composePackage: "Composer ce package",
  },
};

/* ═══════════════════════════════════════════════════════════════════
   ENGLISH
   ═══════════════════════════════════════════════════════════════════ */

const en: TranslationDictionary = {
  meta: {
    siteTitle: "Krizaka — Orasaka, the sovereign open-source AI orchestration engine",
    siteDescription:
      "Orasaka is a sovereign, open-source AI orchestration engine — Java 21, Spring AI, 15-interceptor pipeline, multimodal. Self-host local AI designed to ease Law 25 and GDPR compliance. Built in Québec.",
    ogTitle: "Orasaka — the sovereign AI orchestration engine, open source",
    ogDescription:
      "The AI orchestration engine you self-host. Java 21 · Spring AI · 15 interceptors · multimodal. Open source, sovereign, built in Québec.",
  },

  nav: {
    products: "Products",
    solutions: "Solutions",
    docs: "Docs",
    compliance: "Compliance",
    useCases: "Use Cases",
    getStarted: "Get Started",
    menu: "Menu",
    close: "Close",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    language: "Language",
    orasakaDesc: "Sovereign AI orchestration engine",
    architecture: "Architecture",
    roadmap: "Roadmap",
    editions: "Editions",
    viewDocs: "Documentation",
    byEdition: "By edition",
    recommended: "Recommended",
    demos: "Demos",
    community: "Community",
    packages: "Packages",
    start: "Get started",
    githubAria: "View the repository on GitHub",
    starsAria: "GitHub stars",
  },

  hero: {
    headline: "The sovereign AI orchestration engine.",
    headlineAccent: "Open source.",
    sub: "Java 21 · Spring AI · 15 interceptors · multimodal. A cognitive infrastructure you self-host — built in Québec.\nYour data never leaves your network.",
    ctaPrimary: "Get started in 3 commands",
    ctaSecondary: "Star on GitHub",
    badge: "Open Source",
  },

  quickstart: {
    sectionLabel: "Quickstart",
    sectionTitle: "Get started in 3 commands",
    sectionDesc: "A single dependency: Node. Orasaka installs the engine, starts it, and opens dev mode.",
    note: "Need the details? The install guide covers Docker, Ollama and configuration.",
    docsCta: "Read the docs",
    communityCta: "Join the community",
  },

  pillars: {
    sectionLabel: "What Orasaka does",
    sectionTitle: "All of modern AI, in one engine.",
    items: [
      {
        keyword: "Sovereign",
        title: "Your data never leaves",
        desc: "Every inference runs locally. No cloud relay, no third-party API. Compatible with Ollama, LocalAI and open-source models.",
      },
      {
        keyword: "Multi-Modal",
        title: "Chat · Image · Video · Voice",
        desc: "One engine for every AI modality — unified under a single orchestration layer with 15 interceptors.",
      },
      {
        keyword: "Hybrid",
        title: "Your keys, your choice",
        desc: "Need GPT-4, Claude, or Gemini? Bring your API keys — Orasaka routes seamlessly while keeping your orchestration sovereign.",
      },
      {
        keyword: "Open Source",
        title: "Open code, auditable",
        desc: "Hexagonal architecture verified by ArchUnit. Every architectural decision is documented and code is available on GitHub.",
      },
      {
        keyword: "Validated",
        title: "Closed-loop verification",
        desc: "Every response passes through a multi-stage validation matrix before reaching your users.",
      },
    ],
  },

  techStack: {
    sectionLabel: "Tech Stack",
    sectionTitle: "Built with battle-tested technologies",
    sectionDesc:
      "Java 21 Virtual Threads, Spring AI, hexagonal architecture — no experimental frameworks.",
  },

  useCases: {
    sectionLabel: "Infrastructure in Action",
    sectionTitle: "Sovereign Sector Solutions",
    sectionDesc:
      "From secure automation to confidential document analysis: discover six concrete topologies tailored to the regulatory standards of Law 25 and GDPR.",
    viewAll: "Explore all use cases",
    learnMore: "Technical sheet",
    items: [
      {
        industry: "Agencies & Media",
        title: "Secure Content & Reporting Generation",
        desc: "Generate strategic client deliverables, brand copy, and performance reports without ever exposing briefs or raw insight files to third-party clouds.",
        slug: "agences-marketing",
      },
      {
        industry: "Sales & CRM",
        title: "Semantic Lead Enrichment on Autopilot",
        desc: "Qualify opportunities, personalize outbound emails, and summarize CRM notes locally on your own private infrastructure server.",
        slug: "ventes-prospection",
      },
      {
        industry: "Legal & Finance",
        title: "Confidential Document Audit & Analysis",
        desc: "Query large contracts and audit financial compliance sheets under absolute confidentiality. Attorney-client privilege remains 100% protected.",
        slug: "juridique-finance",
      },
      {
        industry: "Customer Support",
        title: "Intelligent Triage & Autonomous Service",
        desc: "Classify incoming tickets by intent and urgency, then generate context-grounded resolutions without leaking sensitive customer PII.",
        slug: "support-client",
      },
      {
        industry: "Real Estate",
        title: "Listing Copywriting & Inventory Matchmaking",
        desc: "Automatically write property descriptions and match buyer intent directly with your catalog in a local, private network.",
        slug: "immobilier",
      },
      {
        industry: "Healthcare & Clinics",
        title: "Clinical Summaries & Patient Triage Aid",
        desc: "Structure clinical reports, summarize intake forms, and assist medical triage within a hermetic, Law 25-compliant deployment.",
        slug: "sante-cliniques",
      },
    ],
  },

  editions: {
    sectionLabel: "Editions",
    sectionTitle: "Two ways to run Orasaka",
    sectionDesc:
      "Community is the hero product: open source, self-hosted, free forever. Cloud is coming — white-label and one-click Packages.",
    available: "Available",
    waitlist: "Waitlist",
    learnMore: "Learn more",
    joinWaitlist: "Join the waitlist",
    compareAll: "Compare editions",
  },

  packages: {
    sectionLabel: "Governance",
    sectionTitle: "Orasaka Interceptor Packages",
    sectionDesc:
      "Pre-configured security topologies to encapsulate your cognitive apps according to strict compliance standards.",
    concept:
      "Every data stream sequentially traverses the Orasaka mesh. A Package groups and configures a set of interceptors (e.g. RAG + Audit + Router) to certify compliance for your operations.",
    composedOf: "Chained interceptors",
    manualNote: "Composable manually in Community.",
    cloudNote: "1-click deployment in Cloud (upcoming).",
    viewUseCase: "Configure package",
    viewAll: "Discover all Packages",
    pageTitle: "AI Governance Packages — Orasaka",
    pageDesc:
      "Encapsulate your AI queries with our pre-configured interceptor Packages: Law 25 compliance, support, document analysis, content creation. On-premise security.",
  },

  community: {
    sectionLabel: "Community",
    sectionTitle: "Let's build it together",
    sectionDesc:
      "Orasaka is an early project and owns it. Radical transparency: everything is public, everything is discussed, and every contribution counts.",
    items: [
      { title: "Issues", desc: "Report a bug, propose a feature, follow what we're working on.", cta: "Open an issue" },
      { title: "Discussions", desc: "Ask questions, share your deployment, talk with other adopters.", cta: "Join the discussions" },
      { title: "Contribute", desc: "The contributing guide covers the architecture, conventions and workflow.", cta: "Read the guide" },
      { title: "Good first issues", desc: "Small, labelled tasks for a frictionless first contribution.", cta: "Find an issue" },
    ],
    waitlistTitle: "Orasaka Cloud is coming",
    waitlistDesc:
      "White-label and one-click Packages. Drop your email — we'll reach out when the preview is ready.",
  },

  faq: {
    sectionLabel: "FAQ",
    sectionTitle: "Everything you need to know",
    sectionDesc: "Short answers to the questions we get most.",
    items: [
      {
        q: "What is sovereign AI?",
        a: "Sovereign AI is a technological approach where you maintain absolute control over your entire cognitive infrastructure.\n\nUnlike traditional SaaS AI solutions, sovereign AI guarantees:\n- Local Execution: Every prompt is processed on your own servers (bare metal or private clouds).\n- Data Ownership: No content is sent to third parties or used to train external models.\n- Full Auditability: You can trace every step of the cognitive pipeline, ensuring perfect compliance.",
      },
      {
        q: "Is Orasaka free?",
        a: "Yes, the core engine is and will always remain free.\n\nOrasaka Community is distributed under an open-source license. This includes:\n- Access to all 15 modular interceptors in the pipeline of cognition.\n- Full hexagonal architecture features.\n- Complete support for local models (Ollama, LocalAI).\n\nThe Cloud edition (paid, in active development) will offer hosting managed by Krizaka, white-label branding, and one-click Package deployment.",
      },
      {
        q: "Which AI models are supported?",
        a: "Orasaka is entirely model-agnostic.\n\nYou can use:\n- Local Models: Llama 3, Mistral, Gemma, Phi-3 via Ollama or LocalAI for 100% data sovereignty.\n- Cloud Models: GPT-4, Claude 3.5, Gemini Pro via their respective API keys.\n- Hybrid Routing: Route simple tasks to local models and complex queries to cloud models, keeping the orchestration sovereign.",
      },
      {
        q: "How does Orasaka ease compliance with Law 25 (Québec) and GDPR (Europe)?",
        a: "Orasaka was engineered in Québec to answer the strict requirements of modern data protection frameworks.\n\nThe engine ensures compliance by design:\n- Localized Storage: Personal data never leaves your infrastructure or Canadian soil.\n- Audit Trails: The Audit Log interceptor records every single processing step for full accountability.\n- Zero Leaks: No third-party network egress occurs during local inference, eliminating leak risks.",
      },
      {
        q: "What is the difference between Community and Cloud?",
        a: "Community is built for developers and teams self-hosting their infrastructure. Cloud is built for businesses wanting a turn-key solution.\n\n- Community: Open-source code, self-hosted (on-premise, Docker), manual composition of interceptors.\n- Cloud: Managed hosting by Krizaka, custom branding (white-label), and instant deployment of domain-specific Packages.",
      },
      {
        q: "What is a Package?",
        a: "A Package is a pre-configured composition of Orasaka interceptors tailored for a specific business domain.\n\nFor example, the Law 25 Compliance Package chain activates:\n- Safety Guardrails: To filter out sensitive personal details before inference.\n- Audit Log: To record and trace processing decisions.\n- Cost Shield: To monitor token budgets and prevent resource runaway.\n\nThese can be composed manually in Community, or activated in one click in Cloud.",
      },
    ],
  },

  contact: {
    pageTitle: "Contact & partnerships",
    pageDesc:
      "Contributions, partnerships, press or questions about Orasaka — here's how to reach us. Open-source project, public conversations by default.",
    heading: "Contact & partnerships",
    intro:
      "Orasaka is an open-source project: most conversations happen in public. Pick the channel that fits your need.",
    channels: [
      { title: "Questions & help", desc: "A technical or usage question? GitHub Discussions is the place.", cta: "Open a discussion", kind: "discussions" },
      { title: "Bugs & features", desc: "Something's off, or an idea to propose? Open an issue.", cta: "Open an issue", kind: "issues" },
      { title: "Partnerships & press", desc: "Collaboration, integration or media request — write to us directly.", cta: "Email us", kind: "email" },
      { title: "Orasaka Cloud", desc: "Interested in white-label and managed Packages? Join the waitlist.", cta: "Join the waitlist", kind: "waitlist" },
    ],
    backHome: "Back to home",
  },

  docsNav: {
    onThisPage: "On this page",
    readingTime: "Reading time",
    minRead: "min",
    prev: "Previous",
    next: "Next",
  },

  docsPreview: {
    sectionLabel: "Documentation",
    sectionTitle: "Explore the technical docs",
    sectionDesc:
      "Architecture, API, deployment — everything is documented and open source.",
    viewAllDocs: "View all documentation",
  },

  compliance: {
    sectionLabel: "Compliance",
    sectionTitle: "Privacy is not a feature",
    sectionSub: "It's the architecture.",
    openSourceNote: "Orasaka is open source. Audit the code on",
    auditOnGithub: "GitHub",
    items: [
      {
        tag: "Law 25 (Quebec)",
        title: "Absolute Local Sovereignty",
        desc: "Fines up to $25M (or 4% of global turnover). Orasaka's 100% on-premise execution completely eliminates the mandatory Privacy Impact Assessment (PIA/EFVP) required for transferring personal data outside Quebec (mandatory when using OpenAI/Anthropic APIs). Your sensitive files remain securely inside your infrastructure.",
        cta: "Read on CAI",
      },
      {
        tag: "GDPR",
        title: "EU Regulation 2016/679",
        desc: "No data transfer outside your infrastructure. Privacy by design and by default.",
        cta: "Read on EUR-Lex",
      },
      {
        tag: "PIPEDA",
        title: "Canadian Federal Privacy Act",
        desc: "Designed to align with the federal Personal Information Protection and Electronic Documents Act. Your data stays in Canada, on your servers.",
        cta: "Read on OPC",
      },
    ],
  },

  footer: {
    product: "Product",
    solutions: "Solutions",
    legal: "Legal",
    social: "Social",
    documentation: "Documentation",
    architecture: "Architecture",
    privacy: "Privacy",
    terms: "Terms",
    loi25: "Law 25",
    allRights: "All rights reserved",
    openSource: "Open Source",
    explore: "Explore",
    community: "Community",
    useCases: "Use Cases",
    compliance: "Compliance",
    contact: "Contact",
    roadmap: "Roadmap",
    demos: "Demos",
    packages: "Packages",
    editions: "Editions",
    github: "GitHub",
    tagline: "The sovereign AI orchestration engine, open source. Built in Québec.",
  },

  cognitiveEngineering: {
    sectionLabel: "Cognitive Engineering",
    sectionTitle: "Beyond the prompt",
    sectionSub: "The intelligence is in the pipeline.",
    sectionDesc:
      "Orasaka doesn't just relay your prompts to a model. By default, each request traverses a 9-stage sequential processing cycle. However, Orasaka's strength lies in its full library of 15 modular interceptors (multi-agent debate, MCP sandbox, auditing, human-in-the-loop) that you can assemble to build your own custom governance Packages.",
    ctaLabel: "Explore cognitive engineering",
    ctaHref: "/ingenierie-cognitive",
    agnosticTitle: "Agnostic Mode (Sovereignty)",
    agnosticDesc: "Free choice of models: local Ollama, or cloud APIs (OpenAI, Anthropic, Gemini). Orasaka adapts without vendor lock-in.",
    deterministicTitle: "Deterministic Mode (Precision)",
    deterministicDesc: "Total flow control: temperature at 0.0, strict output schemas (JSON), closed-loop verification. Zero hallucinations.",
    effortTitle: "Effort Mode (Adaptive depth)",
    effortDesc: "Orasaka gauges the complexity of the intent and allocates reasoning effort accordingly — a direct answer for the trivial, deep deliberation for the critical.",
    stages: [
      { order: "01", name: "User context resolution", desc: "Profile, RBAC role, rate-limiting tier" },
      { order: "02", name: "System context injection", desc: "Environment variables, tools, system signals" },
      { order: "03", name: "RAG enrichment", desc: "Vector retrieval → knowledge injection" },
      { order: "04", name: "MCP resolution", desc: "External knowledge via Model Context Protocol" },
      { order: "05", name: "Conversational memory", desc: "FIFO history with 50-message window" },
      { order: "06", name: "Semantic refinement", desc: "Fuzzy query → precise instruction" },
      { order: "07", name: "Intent routing", desc: "Intent → optimal provider (temp: 0.0)" },
      { order: "08", name: "Tool attachment", desc: "Demand-driven tool callbacks" },
      { order: "09", name: "Multi-modal assembly", desc: "Base64 media extraction and assembly" },
    ],
    principles: [
      { title: "Contextual enrichment", desc: "Every prompt is enriched with user profile, conversation history, and RAG knowledge before reaching the model." },
      { title: "Intent routing", desc: "User intent is analyzed to route to the optimal model — local Ollama or cloud provider — at temperature 0.0 for maximum determinism." },
      { title: "Architectural memory", desc: "Conversational memory isn't a simple buffer. It's a sliding-window FIFO system that preserves relevant context without overloading the context window." },
      { title: "Closed-loop validation", desc: "Responses are validated through a multi-stage matrix — JSON schema, MCP sandbox, multi-agent debate — before reaching the user." },
    ],
  },

  cognitiveEngineeringPage: {
    pageTitle: "Cognitive Engineering — Orasaka by Krizaka",
    pageDesc: "Discover how Orasaka's 9-stage cognitive pipeline transforms every prompt into an optimal instruction. Contextual enrichment, architectural memory, intent routing.",
    introTitle: "What is cognitive engineering?",
    introText: "Applied cognitive engineering in AI means designing systems that augment human cognition. By default, Orasaka orchestrates a standard 9-stage pipeline to enrich and structure queries. Yet its architecture is built upon 15 distinct interceptors. In Deterministic Mode, you assemble these 15 interceptors into closed governance Packages to guarantee ultra-precise execution, while Agnostic Mode gives you absolute freedom of inference models (local via Ollama or remote).\n\nThis is the difference between \"using a chatbot\" and \"deploying cognitive infrastructure\".",
    pipelineTitle: "The cognitive pipeline — 9 default stages",
    pipelineDesc: "Every query traverses 9 default interceptors sequentially. Each stage enriches the context. In parallel, you have 15 configurable interceptors to build custom strict governance rules.",
    principlesTitle: "Cognitive engineering principles",
    principlesDesc: "Four foundational pillars that distinguish Orasaka from a simple LLM wrapper.",
    diffTitle: "Cloud chatbot vs. Cognitive engineering",
    diffItems: [
      { cloud: "Raw prompt sent to model", orasaka: "Prompt enriched by 9 interceptors" },
      { cloud: "No memory between sessions", orasaka: "Sliding-window FIFO memory" },
      { cloud: "Single imposed model", orasaka: "Intent-based routing to optimal model" },
      { cloud: "Data sent to the cloud", orasaka: "Everything stays on-premise" },
      { cloud: "No output validation", orasaka: "Multi-stage closed-loop validation" },
    ],
    ctaTitle: "Get started with cognitive engineering",
    ctaDesc: "Orasaka is open source. Deploy the cognitive pipeline on your infrastructure in 3 commands.",
    ctaButton: "Read the documentation",
    backHome: "Back to home",
  },

  useCasePage: {
    backToUseCases: "Back to use cases",
    problem: "The Challenge",
    solution: "The Orasaka Solution",
    keyFeatures: "Key Features",
    ctaTitle: "Try it on your machine",
    ctaDesc:
      "Orasaka is open source. Install it in 3 commands and compose the matching Package.",
    ctaButton: "Get started in 3 commands",
    relatedDocs: "Related documentation",
    relatedPackage: "Related package",
    composePackage: "Compose this package",
  },
};

/* ═══════════════════════════════════════════════════════════════════
   DICTIONARY MAP & ACCESSOR
   ═══════════════════════════════════════════════════════════════════ */

const dictionaries: Record<Locale, TranslationDictionary> = { fr, en };

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale];
}

export function getLocaleFromStorage(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem("kz-locale");
  if (stored === "fr" || stored === "en") return stored;
  /* Detect browser language */
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("fr")) return "fr";
  return "en";
}

export function setLocaleToStorage(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("kz-locale", locale);
}
