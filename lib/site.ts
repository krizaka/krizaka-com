/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Single source of truth for external identity & links.
   Used by nav (GitHub stars), community section, footer, metadata.
   ═══════════════════════════════════════════════════════════════════ */

export const GITHUB_ORG = "krizaka";
export const GITHUB_REPO = "orazaka";

export const SITE_URL = "https://krizaka.com";

export const CONTACT_EMAIL = "bonjour@krizaka.com";

/** Real engine version — keep in sync with the Orazaka monorepo. */
export const ORAZAKA_VERSION = "1.0.0-SNAPSHOT";

export const GITHUB_ORG_URL = `https://github.com/${GITHUB_ORG}`;
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_DISCUSSIONS_URL = `${GITHUB_REPO_URL}/discussions`;
export const GITHUB_CONTRIBUTING_URL = `${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`;
export const GITHUB_GOOD_FIRST_ISSUES_URL = `${GITHUB_REPO_URL}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`;

/** Raw source of the roadmap's source-of-truth file, for the transparency callout. */
export const MASTER_FEATURES_URL = `${GITHUB_REPO_URL}/blob/main/orazaka-content/docs/MASTER_FEATURES.md`;
