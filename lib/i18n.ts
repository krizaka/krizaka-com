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
    orazakaDesc: string;
    architecture: string;
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

  /* ─── Home Hero (remastered — sovereign AI chat showcase) ─── */
  homeHero: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: string[];
    chat: {
      status: string;
      model: string;
      routed: string;
      question: string;
      answer: string;
      pipeline: string[];
      privacy: string;
      placeholder: string;
    };
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

  /* ─── Packages (home section + page) ─── */
  packages: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    concept: string;
    composedOf: string;
    manualNote: string;
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
  };

  /* ─── Engine Showcase (home section) — focused on Cognitive Engineering ─── */
  engineShowcase: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    cogTitle: string;
    cogDesc: string;
    cogCta: string;
    highlights: Array<{ label: string; value: string }>;
    simulatorTitle: string;
    simulatorSubtitle: string;
    runSim: string;
    simulating: string;
    simReset: string;
    simStatus: string;
    simOutput: string;
    galleryTitle: string;
    gallerySubtitle: string;
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
    visionTitle: string;
    visionText: string;
    neuromorphicTitle: string;
    neuromorphicDesc: string;
    neuromorphicCards: Array<{
      title: string;
      brainRegion: string;
      moduleName: string;
      desc: string;
    }>;
    familiesTitle: string;
    familiesDesc: string;
    families: Array<{
      name: string;
      desc: string;
      interceptors: string[];
    }>;
    pipelineTitle: string;
    pipelineDesc: string;
    executorTitle: string;
    executorDesc: string;
    executorPhases: Array<{ title: string; desc: string }>;
    modesTitle: string;
    modesDesc: string;
    modes: Array<{ title: string; desc: string; accent: string }>;
    effortTitle: string;
    effortDesc: string;
    extensibilityTitle: string;
    extensibilityDesc: string;
    diffTitle: string;
    diffLeftTitle: string;
    diffLeftSub: string;
    diffLeftFeatures: Array<{ title: string; desc: string }>;
    diffRightTitle: string;
    diffRightSub: string;
    diffRightFeatures: Array<{ title: string; desc: string }>;
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
    quebecContextTitle: string;
    actionPlanTitle: string;
    topologyTitle: string;
  };
}

/* ═══════════════════════════════════════════════════════════════════
   FRENCH (Default — Québec)
   ═══════════════════════════════════════════════════════════════════ */

const fr: TranslationDictionary = {
  meta: {
    siteTitle: "Krizaka — Orazaka, moteur d'orchestration IA souverain open source",
    siteDescription:
      "Orazaka est un moteur d'orchestration IA souverain et open source — Java 21, Spring AI, pipeline à 15 intercepteurs, multimodal. Auto-héberge une IA locale conçue pour faciliter la conformité Loi 25 et RGPD. Conçu au Québec.",
    ogTitle: "Orazaka — moteur d'orchestration IA souverain, open source",
    ogDescription:
      "Le moteur d'orchestration IA que tu héberges toi-même. Java 21 · Spring AI · 15 intercepteurs · multimodal. Open source, souverain, conçu au Québec.",
  },

  nav: {
    products: "Produits",
    solutions: "Solutions",
    docs: "Docs",
    compliance: "Conformité",
    useCases: "Cas d'usage",
    getStarted: "Découvrir Orazaka",
    menu: "Menu",
    close: "Fermer",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    language: "Langue",
    orazakaDesc: "Moteur d'orchestration IA souverain",
    architecture: "Fonctionnement",
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

  homeHero: {
    badge: "IA cognitive souveraine · Loi 25 · RGPD",
    titleLead: "L'IA de ton organisation,",
    titleAccent: "souveraine",
    titleTail: "et hébergée chez toi.",
    sub: "Krizaka conçoit Orazaka — le moteur d'orchestration IA multimodal qui raisonne sur ton infra. Chaque requête traverse un pipeline d'intercepteurs déterministe. Rien ne quitte ton réseau.",
    ctaPrimary: "Découvrir Orazaka",
    ctaSecondary: "Voir l'architecture",
    trust: ["On-premise", "Ollama", "Open source", "Architecture hexagonale"],
    chat: {
      status: "En ligne · local",
      model: "llama3 · Ollama",
      routed: "Routé localement",
      question: "Résume le contrat en pièce jointe et signale les clauses non conformes à la Loi 25.",
      answer: "3 clauses à revoir : transfert de données hors Québec (art. 17), durée de conservation indéfinie, absence de consentement explicite. Analyse effectuée sur ton serveur — aucune donnée transmise.",
      pipeline: ["Intention", "Contexte", "Routage", "Validation"],
      privacy: "0 donnée ne quitte ton réseau",
      placeholder: "Pose une question à ton IA souveraine…",
    },
  },

  quickstart: {
    sectionLabel: "Quickstart",
    sectionTitle: "Démarre en 3 commandes",
    sectionDesc: "Une seule dépendance : Node. Orazaka installe le moteur, le lance et ouvre le mode dev.",
    note: "Besoin du détail ? Le guide d'installation couvre Docker, Ollama et la configuration.",
    docsCta: "Lire les docs",
    communityCta: "Rejoindre la communauté",
  },

  pillars: {
    sectionLabel: "Ce que fait Orazaka",
    sectionTitle: "Toute l'IA moderne, dans un seul moteur.",
    items: [
      {
        keyword: "Souverain",
        title: "Tes données ne sortent jamais",
        desc: "Chaque inférence tourne sur ton infra, rien ne quitte ton réseau — conforme Loi 25 et aligné RGPD par construction.",
      },
      {
        keyword: "Multi-Modal",
        title: "Chat · Image · Vidéo · Voix",
        desc: "Un seul moteur pour chaque modalité IA — unifié sous une couche d'orchestration à 15 intercepteurs.",
      },
      {
        keyword: "Hybride",
        title: "Tes clés, ton choix",
        desc: "Besoin de GPT-4, Claude ou Gemini ? Apporte tes clés API — Orazaka route intelligemment tout en gardant ton orchestration souveraine.",
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
      "De la veille territoriale à l'engagement éthique : découvrez comment Orazaka automatise la prospection locale tout en garantissant la conformité Loi 25 et LCEE.",
    viewAll: "Explorer le cas d'usage",
    learnMore: "Fiche technique",
    items: [
      {
        industry: "Services de proximité",
        title: "Prospection locale et détection d'opportunités",
        desc: "Automatisez la prospection locale B2C et B2B pour votre métier en scannant les chantiers et les ventes foncières publiques sans fuite cloud.",
        slug: "local-prospecting",
      },
    ],
  },

  packages: {
    sectionLabel: "Gouvernance",
    sectionTitle: "Les Packages d'Intercepteurs Orazaka",
    sectionDesc:
      "Des topologies de sécurité pré-configurées pour encapsuler vos applications intelligentes selon les normes industrielles.",
    concept:
      "Chaque flux de données traverse séquentiellement le maillage d'Orazaka. Un Package assemble et configure un groupe d'intercepteurs (ex. RAG + Audit + Router) pour certifier la conformité de vos processus.",
    composedOf: "Intercepteurs chaînés",
    manualNote: "Composables manuellement dans Orazaka Community — open source, sans verrou propriétaire.",
    viewUseCase: "Configurer le package",
    viewAll: "Découvrir le Package",
    pageTitle: "Packages de Gouvernance IA — Orazaka",
    pageDesc:
      "Encapsulez vos requêtes IA avec notre Package de gouvernance local Orazaka Sentinelle : conformité Loi 25 et LCEE pour la prospection locale.",
  },

  community: {
    sectionLabel: "Communauté",
    sectionTitle: "Construisons-le ensemble",
    sectionDesc:
      "Orazaka est un projet naissant et il l'assume. Transparence radicale : tout est public, tout se discute, et chaque contribution compte.",
    items: [
      { title: "Issues", desc: "Signale un bogue, propose une fonctionnalité, suis ce sur quoi on travaille.", cta: "Ouvrir une issue" },
      { title: "Discussions", desc: "Pose tes questions, partage ton déploiement, échange avec les autres adoptants.", cta: "Rejoindre les discussions" },
      { title: "Contribuer", desc: "Le guide de contribution explique l'architecture, les conventions et le workflow.", cta: "Lire le guide" },
      { title: "Good first issues", desc: "De petites tâches balisées pour une première contribution sans friction.", cta: "Trouver une issue" },
    ],
  },

  engineShowcase: {
    sectionLabel: "Technologie",
    sectionTitle: "L'ingénierie cognitive derrière l'orchestration",
    sectionDesc: "Orazaka ne relaie pas vos prompts à un modèle. Chaque requête traverse un pipeline déterministe d'intercepteurs qui enrichit, raffine, route et valide — avant que le modèle ne soit sollicité.",
    cogTitle: "La Science Cognitive dans l'IA",
    cogDesc: "Plutôt que d'utiliser l'IA comme une simple boîte noire génératrice de texte, l'ingénierie cognitive structure le raisonnement artificiel. En découpant le flux en étapes ordonnées — analyse d'intention, contextualisation factuelle et auto-surveillance —, elle garantit le déterminisme, la sécurité logique et l'alignement métier indispensables aux architectures de production d'entreprise.",
    cogCta: "Explorer l'ingénierie cognitive",
    highlights: [
      { label: "Intercepteurs", value: "15" },
      { label: "Pipeline par défaut", value: "9 étapes" },
      { label: "Familles", value: "5" },
      { label: "Modes", value: "3" },
    ],
    simulatorTitle: "Simulateur de Traitement Souverain d'Orazaka",
    simulatorSubtitle: "Visualisez comment Orazaka, l'engin d'automatisation cognitive souverain conçu par Krizaka, traite vos flux d'affaires locaux de manière hermétique et sécurisée.",
    runSim: "Simuler l'exécution",
    simulating: "Exécution locale...",
    simReset: "Réinitialiser",
    simStatus: "Statut de Souveraineté",
    simOutput: "Sortie produit localement",
    galleryTitle: "Visualisations & Preuves de Raisonnement",
    gallerySubtitle: "Des rendus locaux et captures d'activités extraits directement depuis le cœur souverain d'Orazaka.",
  },

  contact: {
    pageTitle: "Contact & partenariats",
    pageDesc:
      "Contributions, partenariats, presse ou questions sur Orazaka — voici comment nous joindre. Projet open source, échanges publics par défaut.",
    heading: "Contact & partenariats",
    intro:
      "Orazaka est un projet open source : la plupart des échanges se font en public. Choisis le canal qui correspond à ton besoin.",
    channels: [
      { title: "Questions & entraide", desc: "Une question technique ou d'usage ? Les Discussions GitHub sont l'endroit.", cta: "Ouvrir une discussion", kind: "discussions" },
      { title: "Bogues & fonctionnalités", desc: "Quelque chose ne va pas, ou une idée à proposer ? Ouvre une issue.", cta: "Ouvrir une issue", kind: "issues" },
      { title: "Partenariats & presse", desc: "Collaboration, intégration ou demande média — écris-nous directement.", cta: "Nous écrire", kind: "email" },
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

  footer: {
    product: "Produit",
    solutions: "Solutions",
    legal: "Légal",
    social: "Social",
    documentation: "Documentation",
    architecture: "Fonctionnement",
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
      "Orazaka ne se contente pas de relayer tes prompts à un modèle. Par défaut, chaque requête traverse un cycle de traitement à 9 étapes séquentielles. Cependant, la force d'Orazaka réside dans sa bibliothèque complète de 15 intercepteurs modulaires (débat multi-agents, bac à sable MCP, audit, validation humaine) que vous pouvez assembler pour composer vos propres Packages de gouvernance.",
    ctaLabel: "Explorer l'ingénierie cognitive",
    ctaHref: "/products/orazaka/ingenierie-cognitive",
    agnosticTitle: "Mode Agnostique (Souveraineté)",
    agnosticDesc: "Libre choix du modèle : Ollama en local, ou API cloud (OpenAI, Anthropic, Gemini). Orazaka s'adapte sans verrouillage propriétaire.",
    deterministicTitle: "Mode Déterministe (Précision)",
    deterministicDesc: "Contrôle total du flux : température à 0.0, schémas de sortie stricts (JSON), validation en boucle fermée. Zéro hallucination.",
    effortTitle: "Mode Effort (Profondeur adaptative)",
    effortDesc: "Orazaka jauge la complexité de l'intention et alloue l'effort de raisonnement en conséquence — réponse directe pour le trivial, délibération approfondie pour le critique.",
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
    pageTitle: "Ingénierie cognitive IA — Pipeline cognitif Orazaka | Krizaka",
    pageDesc: "Découvrez comment l'ingénierie cognitive structure l'intelligence artificielle pour la rendre fiable, sécurisée et souveraine.",
    introTitle: "L'ingénierie cognitive, c'est quoi ?",
    introText: "L'ingénierie cognitive appliquée à l'IA consiste à structurer et organiser le flux de pensée de l'intelligence artificielle.\n\nAu lieu d'utiliser un modèle de langage comme une boîte noire à qui l'on envoie des questions en espérant une bonne réponse, Orazaka décompose chaque interaction en étapes claires et spécialisées. C'est ce qui garantit la sécurité des données, l'exactitude des faits et la prévisibilité de l'IA.",
    visionTitle: "Dépasser le simple chatbot",
    visionText: "Les chatbots d'entreprise traditionnels envoient directement vos questions à des serveurs cloud sans contrôle intermédiaire. Cela pose des risques majeurs de fuites de données et d'hallucinations.\n\nKrizaka a conçu Orazaka pour changer cela. Orazaka agit comme un copilote d'ingénierie cognitive : il nettoie la requête, va chercher la mémoire et les connaissances locales, applique des filtres de sécurité, et valide délibérément la réponse en local (on-premise) sur votre machine avant de vous la livrer. Une souveraineté totale, conforme à la Loi 25 et au RGPD.",
    neuromorphicTitle: "Les 3 Piliers de la Cognition Orazaka",
    neuromorphicDesc: "Inspiré du fonctionnement du cerveau humain, le moteur d'Orazaka orchestre 3 grandes fonctions cognitives complémentaires.",
    neuromorphicCards: [
      {
        title: "Perception & Attention",
        brainRegion: "Le Cortex Préfrontal",
        moduleName: "Routage sémantique",
        desc: "Orazaka analyse l'intention profonde derrière votre demande pour éliminer les informations inutiles et l'aiguiller vers le meilleur modèle (local ou cloud)."
      },
      {
        title: "Mémoire & Connaissances",
        brainRegion: "L'Hippocampe",
        moduleName: "RAG & MCP",
        desc: "Orazaka connecte l'IA à vos documents locaux et à vos outils de travail en temps réel, sans jamais envoyer vos données personnelles à des tiers."
      },
      {
        title: "Métacognition & Réflexion",
        brainRegion: "Cortex Cingulaire",
        moduleName: "Validation en boucle fermée",
        desc: "L'IA examine sa propre réponse, corrige les erreurs potentielles et vérifie les règles de sécurité avant de vous afficher le résultat."
      }
    ],
    familiesTitle: "Familles d'intercepteurs",
    familiesDesc: "Les intercepteurs d'Orazaka.",
    families: [],
    pipelineTitle: "Le Pipeline Cognitif : 3 Étapes Clés",
    pipelineDesc: "Chaque interaction utilisateur traverse un circuit sécurisé en trois temps pour garantir une réponse irréprochable.",
    executorTitle: "Analyse et Action Séparées",
    executorDesc: "Orazaka sépare hermétiquement la phase de préparation de la phase de décision, comme le fait le cerveau humain.",
    executorPhases: [
      { title: "Phase 1 : Accumulation & Contexte", desc: "Le moteur rassemble l'historique conversationnel, vos fichiers (RAG) et les règles système pour enrichir la demande." },
      { title: "Phase 2 : Raisonnement & Sécurité", desc: "L'IA formule la réponse dans un environnement sécurisé et valide sa conformité logique avant toute livraison." }
    ],
    modesTitle: "Modes de fonctionnement par défaut",
    modesDesc: "Orazaka propose deux modes d'exécution standards intégrés, tout en permettant une extensibilité complète du pipeline.",
    modes: [
      { title: "Mode Souverain", desc: "Exécution locale hermétique (via Ollama) garantissant une confidentialité absolue de vos données et une conformité directe (Loi 25 / RGPD).", accent: "#10b981" },
      { title: "Mode Déterministe", desc: "Température stricte à 0.0, schémas de sortie contraints (JSON) et validation en boucle fermée pour éradiquer les hallucinations.", accent: "#a78bfa" }
    ],
    effortTitle: "Ajustement dynamique de l'effort",
    effortDesc: "L'effort n'est pas un mode, mais un paramètre d'ajustement. Le moteur analyse la complexité de l'intention utilisateur pour calibrer les tokens de réflexion et le nombre d'intercepteurs actifs.",
    extensibilityTitle: "Extensibilité & Modes Personnalisés",
    extensibilityDesc: "Assemblez les 15 intercepteurs d'Orazaka pour concevoir des modes sur mesure. Configurez vos propres règles métiers, audits et topologies de sécurité.",
    diffTitle: "Cloud Stateless API vs. Moteur de Raisonnement Orazaka",
    diffLeftTitle: "API & Chatbot Cloud Classique",
    diffLeftSub: "Générateur de texte simple (Stateless)",
    diffLeftFeatures: [
      { title: "Pipeline linéaire direct", desc: "La requête est relayée sans analyse préalable d'intention ni contextualisation locale." },
      { title: "Pas de mémoire ou état sécurisé", desc: "Historique et contexte volatils, sans isolation ou contrôle d'accès (RBAC)." },
      { title: "Dépendance et fuite de données", desc: "Envoi obligatoire des prompts vers des serveurs tiers cloud (risques Loi 25 / RGPD)." },
      { title: "Génération brute incontrôlée", desc: "Pas d'auto-évaluation ou de validation finale du format (hallucinations fréquentes)." }
    ],
    diffRightTitle: "Moteur de Raisonnement Orazaka",
    diffRightSub: "Infrastructure cognitive souveraine",
    diffRightFeatures: [
      { title: "Pipeline d'intercepteurs cognitifs", desc: "La requête traverse 9 à 15 intercepteurs pour valider l'intention et optimiser le prompt." },
      { title: "Mémoire & RAG locaux", desc: "Accès immédiat à la base vectorielle locale et à une mémoire glissante préservant la souveraineté." },
      { title: "Hébergement hermétique local", desc: "Données chiffrées sur votre infrastructure privée (conformité Loi 25 et RGPD native)." },
      { title: "Validation en boucle fermée", desc: "Métacognition locale vérifiant la conformité du format (JSON strict) avant livraison." }
    ],
    ctaTitle: "Prêt à démarrer avec l'ingénierie cognitive ?",
    ctaDesc: "Déployez Orazaka et configurez vos propres règles de conformité en quelques minutes.",
    ctaButton: "Découvrir les Packages Orazaka",
    backHome: "Retour à l'accueil",
  },

  useCasePage: {
    backToUseCases: "Retour aux cas d'usage",
    problem: "Le défi",
    solution: "La solution Orazaka",
    keyFeatures: "Fonctionnalités clés",
    ctaTitle: "Essaie-le sur ta machine",
    ctaDesc:
      "Orazaka est open source. Installe-le en 3 commandes et compose le Package qui correspond.",
    ctaButton: "Démarrer en 3 commandes",
    relatedDocs: "Documentation associée",
    relatedPackage: "Package associé",
    composePackage: "Composer ce package",
    quebecContextTitle: "Cadre réglementaire & Souveraineté au Québec",
    actionPlanTitle: "Plan de déploiement et intégration projetée",
    topologyTitle: "Topologie du Package d'Intercepteurs Orazaka",
  },
};

/* ═══════════════════════════════════════════════════════════════════
   ENGLISH
   ═══════════════════════════════════════════════════════════════════ */

const en: TranslationDictionary = {
  meta: {
    siteTitle: "Krizaka — Orazaka, the sovereign open-source AI orchestration engine",
    siteDescription:
      "Orazaka is a sovereign, open-source AI orchestration engine — Java 21, Spring AI, 15-interceptor pipeline, multimodal. Self-host local AI designed to ease Law 25 and GDPR compliance. Built in Québec.",
    ogTitle: "Orazaka — the sovereign AI orchestration engine, open source",
    ogDescription:
      "The AI orchestration engine you self-host. Java 21 · Spring AI · 15 interceptors · multimodal. Open source, sovereign, built in Québec.",
  },

  nav: {
    products: "Products",
    solutions: "Solutions",
    docs: "Docs",
    compliance: "Compliance",
    useCases: "Use Cases",
    getStarted: "Get started with Orazaka",
    menu: "Menu",
    close: "Close",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    language: "Language",
    orazakaDesc: "Sovereign AI orchestration engine",
    architecture: "How it works",
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

  homeHero: {
    badge: "Sovereign cognitive AI · Law 25 · GDPR",
    titleLead: "Your organization's AI,",
    titleAccent: "sovereign",
    titleTail: "and hosted on your own infra.",
    sub: "Krizaka builds Orazaka — the multimodal AI orchestration engine that reasons on your infrastructure. Every request flows through a deterministic interceptor pipeline. Nothing leaves your network.",
    ctaPrimary: "Discover Orazaka",
    ctaSecondary: "View the architecture",
    trust: ["On-premise", "Ollama", "Open source", "Hexagonal architecture"],
    chat: {
      status: "Online · local",
      model: "llama3 · Ollama",
      routed: "Routed locally",
      question: "Summarize the attached contract and flag any clauses that violate Law 25.",
      answer: "3 clauses to review: data transfer outside Quebec (art. 17), indefinite retention period, no explicit consent. Analysis ran on your server — no data was transmitted.",
      pipeline: ["Intent", "Context", "Routing", "Validation"],
      privacy: "0 data leaves your network",
      placeholder: "Ask your sovereign AI…",
    },
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
    sectionDesc: "A single dependency: Node. Orazaka installs the engine, starts it, and opens dev mode.",
    note: "Need the details? The install guide covers Docker, Ollama and configuration.",
    docsCta: "Read the docs",
    communityCta: "Join the community",
  },

  pillars: {
    sectionLabel: "What Orazaka does",
    sectionTitle: "All of modern AI, in one engine.",
    items: [
      {
        keyword: "Sovereign",
        title: "Your data never leaves",
        desc: "Every inference runs on your own infra, nothing leaves your network — Law 25 compliant and GDPR-aligned by construction.",
      },
      {
        keyword: "Multi-Modal",
        title: "Chat · Image · Video · Voice",
        desc: "One engine for every AI modality — unified under a single orchestration layer with 15 interceptors.",
      },
      {
        keyword: "Hybrid",
        title: "Your keys, your choice",
        desc: "Need GPT-4, Claude, or Gemini? Bring your API keys — Orazaka routes seamlessly while keeping your orchestration sovereign.",
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
      "From local market monitoring to ethical outreach: discover how Orazaka automates local prospecting while guaranteeing Law 25 and CASL compliance.",
    viewAll: "Explore the use case",
    learnMore: "Technical sheet",
    items: [
      {
        industry: "Local Services",
        title: "Local Prospecting & Opportunity Detection",
        desc: "Automate local B2C and B2B prospecting for your trade by scanning public building permits and property sales without cloud leaks.",
        slug: "local-prospecting",
      },
    ],
  },

  packages: {
    sectionLabel: "Governance",
    sectionTitle: "Orazaka Interceptor Packages",
    sectionDesc:
      "Pre-configured security topologies to encapsulate your cognitive apps according to strict compliance standards.",
    concept:
      "Every data stream sequentially traverses the Orazaka mesh. A Package groups and configures a set of interceptors (e.g. RAG + Audit + Router) to certify compliance for your operations.",
    composedOf: "Chained interceptors",
    manualNote: "Composable manually in Orazaka Community — open source, no vendor lock-in.",
    viewUseCase: "Configure package",
    viewAll: "Discover the Package",
    pageTitle: "AI Governance Packages — Orazaka",
    pageDesc:
      "Encapsulate your AI queries with our local Orazaka Sentinel package: Law 25 and CASL compliance for local prospecting.",
  },

  community: {
    sectionLabel: "Community",
    sectionTitle: "Let's build it together",
    sectionDesc:
      "Orazaka is an early project and owns it. Radical transparency: everything is public, everything is discussed, and every contribution counts.",
    items: [
      { title: "Issues", desc: "Report a bug, propose a feature, follow what we're working on.", cta: "Open an issue" },
      { title: "Discussions", desc: "Ask questions, share your deployment, talk with other adopters.", cta: "Join the discussions" },
      { title: "Contribute", desc: "The contributing guide covers the architecture, conventions and workflow.", cta: "Read the guide" },
      { title: "Good first issues", desc: "Small, labelled tasks for a frictionless first contribution.", cta: "Find an issue" },
    ],
  },

  engineShowcase: {
    sectionLabel: "Technology",
    sectionTitle: "The cognitive engineering behind the orchestration",
    sectionDesc: "Orazaka doesn't just relay your prompts to a model. Every query traverses a deterministic pipeline of interceptors that enriches, refines, routes, and validates — before the model is even invoked.",
    cogTitle: "Cognitive Science in AI",
    cogDesc: "Instead of using AI as a simple text-generating black box, cognitive engineering structures artificial reasoning. By dividing the flow into orderly stages — intent analysis, factual context enrichment, and self-monitoring —, it guarantees the determinism, logical safety, and business alignment essential for enterprise production architectures.",
    cogCta: "Explore cognitive engineering",
    highlights: [
      { label: "Interceptors", value: "15" },
      { label: "Default pipeline", value: "9 stages" },
      { label: "Families", value: "5" },
      { label: "Modes", value: "3" },
    ],
    simulatorTitle: "Orazaka Sovereign Pipeline Simulator",
    simulatorSubtitle: "Visualize how Orazaka, the sovereign cognitive automation engine designed by Krizaka, processes local business flows inside your own secure perimeter.",
    runSim: "Run Simulation",
    simulating: "Processing locally...",
    simReset: "Reset",
    simStatus: "Sovereignty Status",
    simOutput: "Locally produced output",
    galleryTitle: "Visualizations & Proof of Reasoning",
    gallerySubtitle: "Local renders and activity logs extracted directly from the sovereign Orazaka core.",
  },

  contact: {
    pageTitle: "Contact & partnerships",
    pageDesc:
      "Contributions, partnerships, press or questions about Orazaka — here's how to reach us. Open-source project, public conversations by default.",
    heading: "Contact & partnerships",
    intro:
      "Orazaka is an open-source project: most conversations happen in public. Pick the channel that fits your need.",
    channels: [
      { title: "Questions & help", desc: "A technical or usage question? GitHub Discussions is the place.", cta: "Open a discussion", kind: "discussions" },
      { title: "Bugs & features", desc: "Something's off, or an idea to propose? Open an issue.", cta: "Open an issue", kind: "issues" },
      { title: "Partnerships & press", desc: "Collaboration, integration or media request — write to us directly.", cta: "Email us", kind: "email" },
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

  footer: {
    product: "Product",
    solutions: "Solutions",
    legal: "Legal",
    social: "Social",
    documentation: "Documentation",
    architecture: "How it works",
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
      "Orazaka doesn't just relay your prompts to a model. By default, each request traverses a 9-stage sequential processing cycle. However, Orazaka's strength lies in its full library of 15 modular interceptors (multi-agent debate, MCP sandbox, auditing, human-in-the-loop) that you can assemble to build your own custom governance Packages.",
    ctaLabel: "Explore cognitive engineering",
    ctaHref: "/products/orazaka/ingenierie-cognitive",
    agnosticTitle: "Agnostic Mode (Sovereignty)",
    agnosticDesc: "Free choice of models: local Ollama, or cloud APIs (OpenAI, Anthropic, Gemini). Orazaka adapts without vendor lock-in.",
    deterministicTitle: "Deterministic Mode (Precision)",
    deterministicDesc: "Total flow control: temperature at 0.0, strict output schemas (JSON), closed-loop verification. Zero hallucinations.",
    effortTitle: "Effort Mode (Adaptive depth)",
    effortDesc: "Orazaka gauges the complexity of the intent and allocates reasoning effort accordingly — a direct answer for the trivial, deep deliberation for the critical.",
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
    pageTitle: "Cognitive Engineering & Sovereign AI — Orazaka | Krizaka",
    pageDesc: "Discover how cognitive engineering structures artificial intelligence to make it reliable, secure, and sovereign.",
    introTitle: "What is cognitive engineering?",
    introText: "Applied cognitive engineering in AI means structuring and organizing the flow of thought of artificial intelligence.\n\nInstead of treating a large language model as a black box where you send queries and hope for a good answer, Orazaka divides each interaction into clear, specialized stages. This guarantees data security, factual grounding, and AI predictability.",
    visionTitle: "Moving Beyond Basic Chatbots",
    visionText: "Traditional enterprise chatbots send your queries directly to cloud servers without intermediate checks, leading to severe data leakage and hallucination risks.\n\nKrizaka designed Orazaka to change this. Orazaka acts as a cognitive engineering copilot: it cleans the query, fetches local memory and knowledge, applies safety checks, and validates the output locally on your machine before delivery. Total sovereignty, fully compliant with Law 25 and GDPR.",
    neuromorphicTitle: "The 3 Pillars of Orazaka's Cognition",
    neuromorphicDesc: "Inspired by the human brain, Orazaka's engine coordinates 3 major complementary cognitive functions.",
    neuromorphicCards: [
      {
        title: "Perception & Attention",
        brainRegion: "Prefrontal Cortex",
        moduleName: "Semantic Routing",
        desc: "Orazaka analyzes the underlying intent of your request to filter noise and route it to the optimal local or cloud model."
      },
      {
        title: "Memory & Knowledge",
        brainRegion: "Hippocampus",
        moduleName: "RAG & MCP",
        desc: "Orazaka securely connects the AI to your local files and workspace tools in real-time, without ever exposing personal data."
      },
      {
        title: "Metacognition & Reflection",
        brainRegion: "Anterior Cingulate",
        moduleName: "Closed-Loop Validation",
        desc: "The AI inspects its own response, self-corrects logic errors, and verifies security policies before displaying the result."
      }
    ],
    familiesTitle: "Interceptor Families",
    familiesDesc: "Orazaka's interceptors.",
    families: [],
    pipelineTitle: "The Cognitive Pipeline: 3 Key Stages",
    pipelineDesc: "Every user interaction flows through a secure three-step sequence to guarantee a flawless response.",
    executorTitle: "Divided Analysis & Action",
    executorDesc: "Orazaka cleanly separates the information accumulation phase from the decision phase, mimicking human thought.",
    executorPhases: [
      { title: "Stage 1: Ingestion & Enrichment", desc: "The engine gathers chat history, vector knowledge (RAG), and system rules to construct a rich context." },
      { title: "Stage 2: Reasoning & Safety", desc: "The AI reasons in a secure sandbox and validates output compliance before returning the final answer." }
    ],
    modesTitle: "Default Operating Modes",
    modesDesc: "Orazaka includes two built-in standard execution modes while allowing full pipeline extensibility.",
    modes: [
      { title: "Sovereign Mode", desc: "Hermetic local execution (via Ollama) ensuring absolute data privacy and direct compliance (Law 25 / GDPR).", accent: "#10b981" },
      { title: "Deterministic Mode", desc: "Strict 0.0 temperature, constrained output schemas (JSON), and closed-loop validation to eradicate hallucinations.", accent: "#a78bfa" }
    ],
    effortTitle: "Dynamic Effort Adjustment",
    effortDesc: "Effort is not a mode, but an adjustment parameter. The engine analyzes user intent complexity to calibrate reflection tokens and active interceptor depth.",
    extensibilityTitle: "Extensibility & Custom Modes",
    extensibilityDesc: "Assemble Orazaka's 15 interceptors to design tailored modes. Configure custom business rules, auditing, and security topologies.",
    diffTitle: "Cloud Stateless API vs. Orazaka Reasoning Engine",
    diffLeftTitle: "Classic Cloud API & Chatbot",
    diffLeftSub: "Simple text generator (Stateless)",
    diffLeftFeatures: [
      { title: "Direct linear pipeline", desc: "Queries are relayed directly without prior intent analysis or local context gathering." },
      { title: "No secure state or memory", desc: "Session history and context are volatile, without local isolation or RBAC controls." },
      { title: "Third-party dependency", desc: "Mandatory transmission of raw prompts to external servers (Law 25 & GDPR risks)." },
      { title: "Unchecked raw generation", desc: "No output verification or format enforcement, causing frequent hallucinations." }
    ],
    diffRightTitle: "Orazaka Reasoning Engine",
    diffRightSub: "Sovereign cognitive infrastructure",
    diffRightFeatures: [
      { title: "Cognitive interceptor mesh", desc: "Queries traverse 9 to 15 modular interceptors to validate intent and refine the prompt." },
      { title: "Local memory & RAG", desc: "Immediate access to local vector stores and sliding history windows, keeping metadata secure." },
      { title: "Hermetic on-premise execution", desc: "Data remains encrypted inside your private corporate network (native Law 25 & GDPR)." },
      { title: "Closed-loop metacognition", desc: "Self-correcting audits verify formats (JSON schema) and security policies before delivery." }
    ],
    ctaTitle: "Ready to get started with cognitive engineering?",
    ctaDesc: "Deploy Orazaka and configure your own compliance rules in minutes.",
    ctaButton: "Explore Orazaka Packages",
    backHome: "Back to home",
  },

  useCasePage: {
    backToUseCases: "Back to use cases",
    problem: "The Challenge",
    solution: "The Orazaka Solution",
    keyFeatures: "Key Features",
    ctaTitle: "Try it on your machine",
    ctaDesc:
      "Orazaka is open source. Install it in 3 commands and compose the matching Package.",
    ctaButton: "Get started in 3 commands",
    relatedDocs: "Related documentation",
    relatedPackage: "Related package",
    composePackage: "Compose this package",
    quebecContextTitle: "Regulatory Framework & Sovereignty in Quebec",
    actionPlanTitle: "Projected Deployment & Integration Plan",
    topologyTitle: "Orazaka Interceptor Package Topology",
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
