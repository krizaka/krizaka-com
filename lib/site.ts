/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Single source of truth for external identity & links.
   Used by nav (GitHub stars), community section, footer, metadata.
   ═══════════════════════════════════════════════════════════════════ */

export const GITHUB_ORG = "krizaka";
export const GITHUB_REPO = "orazaka";

export const SITE_URL = "https://krizaka.com";

/**
 * Where Orochia runs — every "open the app" link, the structured data and llms.txt point here.
 * NEXT_PUBLIC_OROCHIA_APP_URL switches it (dev today, production later) without touching the code;
 * it is read at build time, so a change takes effect on the next deployment.
 */
export const OROCHIA_APP_URL = (process.env.NEXT_PUBLIC_OROCHIA_APP_URL || "https://dev.orochia.com").replace(/\/$/, "");

export const CONTACT_EMAIL = "bonjour@krizaka.com";

/** Real engine version — keep in sync with orazaka-parent (the Orazaka BOM). */
export const ORAZAKA_VERSION = "1.0.0-SNAPSHOT";

export const GITHUB_ORG_URL = `https://github.com/${GITHUB_ORG}`;
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_DISCUSSIONS_URL = `${GITHUB_REPO_URL}/discussions`;
export const GITHUB_CONTRIBUTING_URL = `${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`;
export const GITHUB_GOOD_FIRST_ISSUES_URL = `${GITHUB_REPO_URL}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`;

/** The site's own repository — where the synced Orazaka docs are published from. */
export const SITE_REPO_URL = `${GITHUB_ORG_URL}/krizaka-com`;

/** Raw source of the roadmap's source-of-truth file, for the transparency callout. */
export const MASTER_FEATURES_URL = `${SITE_REPO_URL}/blob/main/orazaka-content/docs/MASTER_FEATURES.md`;

/** Orazaka is one repository per component; the workspace (GITHUB_REPO_URL) assembles them. */
export const GITHUB_REPOSITORIES_URL = `${GITHUB_ORG_URL}?q=orazaka&type=all`;

/**
 * Where the @krizaka/ui Storybook is published — /docs/ui embeds its stories (StoryFrame).
 * NEXT_PUBLIC_STORYBOOK_URL switches it (GitHub Pages today, https://ui.krizaka.com/latest once the Bunny mirror
 * is live); read at build time.
 */
export const STORYBOOK_URL = (process.env.NEXT_PUBLIC_STORYBOOK_URL || "https://krizaka.github.io/krizaka-ui/latest").replace(/\/$/, "");

/** The repositories the docs link to. */
export const KRIZAKA_UI_REPO_URL = `${GITHUB_ORG_URL}/krizaka-ui`;
export const PLATFORM_KIT_REPO_URL = `${GITHUB_ORG_URL}/krizaka-platform-kit`;
export const KRIZAKA_BUILD_REPO_URL = `${GITHUB_ORG_URL}/krizaka-build`;
