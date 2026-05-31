/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Packages
   A Package = a pre-configured set of pipeline interceptors that, assembled,
   form a tailored solution for one domain. The composition brick of Orazaka.
   Composed manually inside the open-source Orazaka Community engine.
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
    id: "prospection",
    name: { fr: "Orazaka Sentinelle", en: "Orazaka Sentinel" },
    tagline: {
      fr: "Prospection locale et automatisation éthique pour entrepreneurs.",
      en: "Local prospecting and ethical automation for solo professionals.",
    },
    problem: {
      fr: "Détecter de nouvelles opportunités d'affaires locales (chantiers, transactions) et automatiser la prise de contact sans violer la Loi 25 ni la LCEE.",
      en: "Detect new local business opportunities (work sites, real estate deals) and automate outreach without violating Law 25 or CASL.",
    },
    interceptors: [
      { name: "SystemContextInjector", role: { fr: "Injecte le profil de métier et les limites de territoire", en: "Injects trade profile and territorial constraints" } },
      { name: "McpInterceptor", role: { fr: "Scanne les registres fonciers et permis via MCP locaux", en: "Scans land registers and permits via local MCPs" } },
      { name: "RefinerInterceptor", role: { fr: "Anticipe les besoins et qualifie l'opportunité", en: "Anticipates needs and qualifies opportunities" } },
      { name: "LanguageAlignmentInterceptor", role: { fr: "Garantit la conformité Loi 101 et LCEE (anti-spam)", en: "Enforces Bill 101 and CASL (anti-spam) compliance" } },
      { name: "AuditInterceptor", role: { fr: "Journalise les communications et fiches prospects", en: "Logs communications and prospect profiles" } },
    ],
    useCaseSlug: "local-prospecting",
  },
];
