import { getDictionary } from "@/lib/i18n";
/* ═══════════════════════════════════════════════════════════════════
   Structured data (schema.org / JSON-LD) builders.

   Entities are emitted as a single linked @graph and cross-referenced by
   stable @id, so Google's Knowledge Graph reads Krizaka (Organization) and
   krizaka.com (WebSite) as one connected knowledge unit. The Organization names
   the products in its description; each product's own site describes its
   application (krizaka.com carries no product page, so no application node).
   ═══════════════════════════════════════════════════════════════════ */

import { SITE_URL, GITHUB_ORG_URL, CONTACT_EMAIL, NPM_ORG_URL } from "@/lib/site";

export type Locale = "fr" | "en";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const HREFLANG: Record<Locale, string> = { fr: "fr-CA", en: "en" };
const hreflangOf = (locale: Locale) => HREFLANG[locale];

/** What the family owns, as schema.org nodes: the products (each on its own site) and the open-source projects.
    Words are messages (`site.structuredData.family.<id>`); here only structure — ids, urls, categories. */
const FAMILY = [
  { id: "orazaka", name: "Orazaka", url: "https://dev.orazaka.com", repo: "orazaka", category: "BusinessApplication", kind: "app" },
  { id: "orochia", name: "Orochia", url: "https://dev.orochia.com", repo: "orochia", category: "MultimediaApplication", kind: "app" },
  { id: "yasakia", name: "Yasakia", url: "https://dev.yasakia.com", repo: "yasakia", category: "LifestyleApplication", kind: "app" },
  { id: "yororis", name: "Yororis", url: "https://dev.yororis.com", repo: "yororis", category: "LifestyleApplication", kind: "app" },
  { id: "yomizaka", name: "Yomizaka", url: "https://dev.yomizaka.com", repo: "yomizaka", category: "BusinessApplication", kind: "app" },
  { id: "krizaka-ui", name: "Krizaka UI", url: "https://ui.krizaka.com", repo: "krizaka-ui", language: "TypeScript", kind: "code" },
  { id: "krizaka-java", name: "Krizaka Java", url: "https://java.krizaka.com", repo: "krizaka-platform-kit", language: "Java", kind: "code" },
] as const;

const familyNode = (f: (typeof FAMILY)[number], description: string) =>
  f.kind === "app"
    ? {
        "@type": "SoftwareApplication",
        "@id": `${f.url}/#software`,
        name: f.name,
        url: f.url,
        description,
        applicationCategory: f.category,
        operatingSystem: "Web, iOS, Android",
        isAccessibleForFree: true,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        codeRepository: `${GITHUB_ORG_URL}/${f.repo}`,
        publisher: { "@id": ORG_ID },
      }
    : {
        "@type": "SoftwareSourceCode",
        "@id": `${f.url}/#source`,
        name: f.name,
        url: f.url,
        description,
        programmingLanguage: f.language,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        codeRepository: `${GITHUB_ORG_URL}/${f.repo}`,
        publisher: { "@id": ORG_ID },
      };

/** Sitewide @graph: Organization · WebSite · what the organization owns. */
export function buildSiteGraph(locale: Locale) {
  const family = getDictionary(locale).site.structuredData.family;
  const owned = FAMILY.map((f) => familyNode(f, family[f.id]));
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
          "Open-source software",
          "Design systems",
          "React and React Native components",
          "Spring Boot building blocks",
          "Sovereign AI",
          "Law 25 (Quebec)",
          "GDPR compliance",
        ],
        logo: `${SITE_URL}/favicon.svg`,
        email: CONTACT_EMAIL,
        sameAs: [GITHUB_ORG_URL, NPM_ORG_URL],
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
        isAccessibleForFree: true,
        codeRepository: GITHUB_ORG_URL,
        owns: owned.map((n) => ({ "@id": n["@id"] })),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "Krizaka",
        inLanguage: hreflangOf(locale),
        publisher: { "@id": ORG_ID },
      },
      ...owned,
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

/** A documentation page: TechArticle in the product's docs, with its breadcrumb. */
export function buildTechArticleJsonLd(a: { locale: Locale; title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: a.title,
    description: a.description,
    url: a.url,
    inLanguage: hreflangOf(a.locale),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
