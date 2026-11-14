import { getDictionary } from "@/lib/i18n";
/* ═══════════════════════════════════════════════════════════════════
   Structured data (schema.org / JSON-LD) builders.

   Entities are emitted as a single linked @graph and cross-referenced by
   stable @id, so Google's Knowledge Graph reads Krizaka (Organization) and
   krizaka.com (WebSite) as one connected knowledge unit. The Organization names
   the products in its description; each product's own site describes its
   application (krizaka.com carries no product page, so no application node).
   ═══════════════════════════════════════════════════════════════════ */

import { displayName, org } from "@krizaka/org";
import { SITE_URL, GITHUB_ORG_URL, NPM_ORG_URL } from "@/lib/site";
import { siteUrlOf } from "@/lib/product-hosts";

export type Locale = "fr" | "en";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const HREFLANG: Record<Locale, string> = { fr: "fr-CA", en: "en" };
const hreflangOf = (locale: Locale) => HREFLANG[locale];

/** What the family owns, as schema.org nodes: the products (each on its own site) and the open-source projects.
    Words are messages (`site.structuredData.family.<id>`); here only structure — ids, urls, categories. */
const FAMILY = [
  {
    id: "sovkora",
    name: displayName("sovkora"),
    url: siteUrlOf("sovkora"),
    repo: "sovkora",
    category: "BusinessApplication",
    app: true,
  },
  {
    id: "verikora",
    name: displayName("verikora"),
    url: siteUrlOf("verikora"),
    repo: "verikora",
    category: "BusinessApplication",
    app: true,
  },
  {
    id: "folioviv",
    name: displayName("folioviv"),
    url: siteUrlOf("folioviv"),
    repo: "folioviv",
    category: "BusinessApplication",
    app: true,
  },
  {
    id: "kridoc",
    name: displayName("kridoc"),
    url: siteUrlOf("kridoc"),
    repo: "kridoc",
    // Its source is public under the Functional Source License, not Apache: the node names that licence.
    license: "https://spdx.org/licenses/FSL-1.1-ALv2",
    category: "BusinessApplication",
    app: true,
  },
  {
    id: "krizaka-ui",
    name: "Krizaka UI",
    url: "https://ui.krizaka.com",
    repo: "krizaka-ui",
    language: "TypeScript",
    app: false,
  },
  {
    id: "krizaka-java",
    name: "Krizaka Java",
    url: "https://java.krizaka.com",
    repo: "krizaka-platform-kit",
    language: "Java",
    app: false,
  },
] as const;

type FamilyEntry = (typeof FAMILY)[number];
type AppEntry = Extract<FamilyEntry, { category: string }>;
type CodeEntry = Exclude<FamilyEntry, AppEntry>;

const appNode = (f: AppEntry, description: string) => ({
  "@type": "SoftwareApplication",
  "@id": `${f.url}/#software`,
  name: f.name,
  url: f.url,
  description,
  applicationCategory: f.category,
  operatingSystem: "Web, iOS, Android",
  isAccessibleForFree: true,
  ...("repo" in f
    ? {
        license: "license" in f ? f.license : "https://www.apache.org/licenses/LICENSE-2.0",
        codeRepository: `${GITHUB_ORG_URL}/${f.repo}`,
      }
    : {}),
  publisher: { "@id": ORG_ID },
});

const codeNode = (f: CodeEntry, description: string) => ({
  "@type": "SoftwareSourceCode",
  "@id": `${f.url}/#source`,
  name: f.name,
  url: f.url,
  description,
  programmingLanguage: f.language,
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  codeRepository: `${GITHUB_ORG_URL}/${f.repo}`,
  publisher: { "@id": ORG_ID },
});

/** An application has a category, a library a language: the shape says which node it is. */
const familyNode = (f: FamilyEntry, description: string) =>
  "category" in f ? appNode(f, description) : codeNode(f, description);

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
          "Privacy law in Québec (Law 25)",
        ],
        logo: `${SITE_URL}/favicon.svg`,
        sameAs: [GITHUB_ORG_URL, NPM_ORG_URL, ...org.links.social.map((s) => s.url)],
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

/** /services: the one offer, a schema.org Service provided by the Organization (no price node). */
export function buildServiceJsonLd(
  locale: Locale,
  s: { name: string; description: string; covers: readonly string[] },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#entreprise`,
    name: s.name,
    description: s.description,
    serviceType: s.covers,
    inLanguage: hreflangOf(locale),
    url: `${SITE_URL}/${locale}/services`,
    provider: { "@id": ORG_ID },
    areaServed: [{ "@type": "Country", name: "Canada" }],
  };
}

/** Page-scoped breadcrumb trail. Emit on the page whose path it describes. */
export function buildBreadcrumbJsonLd(items: ReadonlyArray<{ name: string; url: string }>) {
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

/** A film worth ranking: emitted ONLY on its watch page (tests/video-structured-data.test.mjs), never for an illustrative clip. */
export function buildVideoJsonLd(v: {
  locale: Locale;
  name: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration: string;
  /** What is said, when the film speaks; a silent film carries none (its shots are in the description). */
  transcript?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    thumbnailUrl: [v.thumbnailUrl],
    uploadDate: v.uploadDate,
    duration: v.duration,
    contentUrl: v.contentUrl,
    embedUrl: v.url,
    url: v.url,
    inLanguage: hreflangOf(v.locale),
    ...(v.transcript ? { transcript: v.transcript } : {}),
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
