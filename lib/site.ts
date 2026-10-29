/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Single source of truth for external identity & links.
   Used by nav (GitHub stars), community section, footer, metadata.
   ═══════════════════════════════════════════════════════════════════ */

export const GITHUB_ORG = "krizaka";
export const GITHUB_REPO = "orazaka";

/** The canonical host: www (the apex answers 308 to www, see deploy/digitalocean/app.yaml). */
export const SITE_URL = "https://www.krizaka.com";

export const CONTACT_EMAIL = "bonjour@krizaka.com";

/**
 * The company behind the site, as the Registraire des entreprises du Québec publishes it (certificate of 2026-10-08) — what a
 * footer and the legal pages must show. Never the head office's street (a home address), a phone or a tax account number:
 * those stay in the company's records (tests/legal-identity.test.mjs).
 */
export const COMPANY = {
  legalName: "Technologies Krizaka Inc.",
  name: "Technologies Krizaka",
  neq: "1182652231",
} as const;

export const GITHUB_ORG_URL = `https://github.com/${GITHUB_ORG}`;
export const NPM_ORG_URL = `https://www.npmjs.com/org/${GITHUB_ORG}`;
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_DISCUSSIONS_URL = `${GITHUB_REPO_URL}/discussions`;
export const GITHUB_CONTRIBUTING_URL = `${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`;
export const GITHUB_GOOD_FIRST_ISSUES_URL = `${GITHUB_REPO_URL}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`;

/** The company blog (its own site: krizaka/krizaka-blog). */
export const BLOG_URL = "https://blog.krizaka.com";

/** The site's own repository. */
export const SITE_REPO_URL = `${GITHUB_ORG_URL}/krizaka-com`;

/** Yomizaka, documents read and checked by Orazaka (coming soon): its repository. */
export const YOMIZAKA_REPO_URL = `${GITHUB_ORG_URL}/yomizaka`;
export const AKINAZA_REPO_URL = `${GITHUB_ORG_URL}/akinaza`;

/** The repositories the docs link to. */
export const KRIZAKA_UI_REPO_URL = `${GITHUB_ORG_URL}/krizaka-ui`;
export const PLATFORM_KIT_REPO_URL = `${GITHUB_ORG_URL}/krizaka-platform-kit`;
export const KRIZAKA_BUILD_REPO_URL = `${GITHUB_ORG_URL}/krizaka-build`;
