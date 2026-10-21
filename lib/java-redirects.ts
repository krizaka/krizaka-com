/* Krizaka Java's documentation moved to https://java.krizaka.com (built from krizaka/krizaka-build, site/). Every old
   /docs/java address answers 308 with the same page there — the guides keep their slug, French keeps its /fr prefix — and
   an unknown page falls back to the site's home. Read by next.config.ts, tested by tests/java-redirects.test.mjs. */

export const JAVA_SITE = "https://java.krizaka.com";

/** The guides of java.krizaka.com (their slug is the one /docs/java/<slug> had). The home is `index`. */
export const JAVA_PAGES = ["start", "app-config", "map", "build", "web", "security", "messaging", "observability", "architecture", "users", "billing", "notifications", "events", "openapi", "configuration", "features", "idempotency"] as const;

/** The Java building blocks' pages (/open-source/<block>) and the page of java.krizaka.com that now tells their story. */
export const JAVA_BLOCK_PAGES = {
  "krizaka-platform-kit": "",
  "krizaka-build": "build",
  "krizaka-users": "users",
  "krizaka-billing": "billing",
  "krizaka-notifications": "notifications",
} as const;

export interface JavaRedirect {
  source: string;
  destination: string;
  statusCode: 308;
}

const rule = (source: string, destination: string): JavaRedirect => ({ source, destination, statusCode: 308 });

export function javaRedirects(): JavaRedirect[] {
  const pages = JAVA_PAGES.join("|");
  return [
    // The building blocks' pages: each one is its page on the Java site.
    ...Object.entries(JAVA_BLOCK_PAGES).flatMap(([id, page]) => [
      rule(`/fr/open-source/${id}`, `${JAVA_SITE}/fr/${page ? `${page}/` : ""}`),
      rule(`/:locale(en)?/open-source/${id}`, `${JAVA_SITE}/${page ? `${page}/` : ""}`),
    ]),
    // French first: /fr/docs/java/<guide> → /fr/<guide>/ on the site.
    rule(`/fr/docs/java/:slug(${pages})`, `${JAVA_SITE}/fr/:slug/`),
    rule("/fr/docs/java/:path*", `${JAVA_SITE}/fr/`),
    // English: with the locale or without it.
    rule(`/:locale(en)?/docs/java/:slug(${pages})`, `${JAVA_SITE}/:slug/`),
    rule("/:locale(en)?/docs/java/:path*", `${JAVA_SITE}/`),
  ];
}
