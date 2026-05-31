/* ═══════════════════════════════════════════════════════════════════
   Structured data (schema.org / JSON-LD) builders.

   Entities are emitted as a single linked @graph and cross-referenced by
   stable @id, so Google's Knowledge Graph reads Krizaka (Organization),
   krizaka.com (WebSite) and Orazaka (SoftwareApplication) as one connected
   knowledge unit rather than three disconnected blobs.
   ═══════════════════════════════════════════════════════════════════ */

import {
  SITE_URL,
  GITHUB_ORG_URL,
  GITHUB_REPO_URL,
  ORAZAKA_VERSION,
} from "@/lib/site";

export type Locale = "fr" | "en";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#orazaka`;

const hreflangOf = (locale: Locale) => (locale === "fr" ? "fr-CA" : "en");

const ORG_DESCRIPTION: Record<Locale, string> = {
  fr: "Krizaka conçoit Orazaka, un moteur d'orchestration d'IA souverain et open source. Déployez une IA multimodale (chat, image, vidéo, voix) entièrement sur votre propre infrastructure — conforme à la Loi 25, au RGPD et à PIPEDA.",
  en: "Krizaka builds Orazaka, an open-source sovereign AI orchestration engine. Run multimodal AI (chat, image, video, voice) entirely on your own infrastructure — Law 25, GDPR and PIPEDA compliant by architecture.",
};

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
        description: ORG_DESCRIPTION[locale],
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
