import { getDictionary } from "@/lib/i18n";
/* ═══════════════════════════════════════════════════════════════════
   Structured data (schema.org / JSON-LD) builders.

   Entities are emitted as a single linked @graph and cross-referenced by
   stable @id, so Google's Knowledge Graph reads Krizaka (Organization),
   krizaka.com (WebSite) and its released products (SoftwareApplication:
   Orazaka, Orochia) as one connected knowledge unit. The Organization names
   every product in its description; Yazakia gets no application node
   until it is released — schema.org has no "upcoming" state for software,
   and an application node without a store or a download would misinform.
   Yororis, under construction, gets a page-scoped node on /products/yororis
   (buildYororisJsonLd): a LifestyleApplication — never Medical or Health —
   whose creativeWorkStatus says it is under construction, with no offer,
   no download and no application address.
   ═══════════════════════════════════════════════════════════════════ */

import {
  SITE_URL,
  YORORIS_REPO_URL,
  GITHUB_ORG_URL,
  GITHUB_REPO_URL,
  ORAZAKA_VERSION,
  OROCHIA_APP_URL,
} from "@/lib/site";

export type Locale = "fr" | "en";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#orazaka`;

const HREFLANG: Record<Locale, string> = { fr: "fr-CA", en: "en" };
const hreflangOf = (locale: Locale) => HREFLANG[locale];

const SOFTWARE_DESCRIPTION: Record<Locale, string> = {
  fr: "Moteur d'orchestration d'IA open source et souverain. Pipeline d'intercepteurs cognitifs, inférence multimodale et protocole MCP, sur architecture hexagonale (Java 21, Spring AI). Exécution locale, sans dépendance cloud.",
  en: "Open-source, sovereign AI orchestration engine. Cognitive interceptor pipeline, multimodal inference and MCP, on a hexagonal architecture (Java 21, Spring AI). Runs locally with zero cloud dependency.",
};

/** Sitewide @graph: Organization · WebSite · SoftwareApplication (Orazaka). */
export function buildSiteGraph(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Krizaka",
        url: SITE_URL,
        description: getDictionary(locale).site.structuredData.organization,
        foundingDate: "2024",
        knowsAbout: [
          "AI orchestration engine",
          "Sovereign AI",
          "On-premise AI",
          "Multi-modal inference",
          "Model Context Protocol (MCP)",
          "Retrieval-augmented generation (RAG)",
          "Hexagonal architecture",
          "Spring AI",
          "Law 25 (Quebec)",
          "GDPR compliance",
        ],
        sameAs: [GITHUB_ORG_URL],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Montréal",
          addressRegion: "QC",
          addressCountry: "CA",
        },
        areaServed: [
          { "@type": "Country", name: "Canada" },
          { "@type": "AdministrativeArea", name: "Québec" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "Krizaka",
        inLanguage: hreflangOf(locale),
        publisher: { "@id": ORG_ID },
        about: { "@id": SOFTWARE_ID },
      },
      {
        "@type": "SoftwareApplication",
        "@id": SOFTWARE_ID,
        name: "Orazaka",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Linux",
        softwareVersion: ORAZAKA_VERSION,
        description: SOFTWARE_DESCRIPTION[locale],
        url: `${SITE_URL}/${locale}/products/orazaka`,
        isAccessibleForFree: true,
        codeRepository: GITHUB_REPO_URL,
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
        featureList: [
          "Cognitive interceptor pipeline",
          "Multi-modal AI (chat, image, video, voice)",
          "Model Context Protocol (MCP) integration",
          "Hexagonal architecture enforced by ArchUnit",
          "Java 21 virtual threads",
          "Law 25 / GDPR compliant by architecture",
          "Ollama and open-source model support",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#orochia`,
        name: "Orochia",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Linux (Docker), DigitalOcean App Platform",
        description: getDictionary(locale).site.structuredData.orochia,
        url: `${SITE_URL}/${locale}/products/orochia`,
        isAccessibleForFree: true,
        codeRepository: "https://github.com/krizaka/orochia",
        sameAs: [OROCHIA_APP_URL, "https://github.com/krizaka/orochia"],
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        contentRating: "adult",
        featureList: [
          "HLS playback signed for 300 seconds",
          "Per-video audiences: followers, contacts, paid unlock, invited people and lists",
          "Collections with permissions",
          "Views, likes, comments and shares",
          "Gateway-confirmed payments and double-entry ledger",
          "18 U.S.C. § 2257 creator verification",
        ],
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
      },
    ],
  };
}

/** Page-scoped breadcrumb trail. Emit on the page whose path it describes. */
export function buildBreadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage schema. Only emit this on a page that *visibly* renders the same Q&A —
 * Google flags FAQ markup without matching on-page content.
 */
export function buildFaqJsonLd(
  qa: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** /products/yororis — the product as it stands: under construction, a lifestyle application (its category is a
    declaration of purpose: never MedicalApplication or HealthApplication), no offer, no download, no application. */
export function buildYororisJsonLd(locale: Locale) {
  const y = getDictionary(locale).site.structuredData.yororis;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#yororis`,
    name: "Yororis",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web, iOS, Android",
    description: y.description,
    creativeWorkStatus: y.status,
    keywords: y.keywords,
    inLanguage: hreflangOf(locale),
    url: `${SITE_URL}/${locale}/products/yororis`,
    codeRepository: YORORIS_REPO_URL,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
