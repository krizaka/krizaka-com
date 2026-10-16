/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Single source of truth for external identity & links.
   Used by nav (GitHub stars), community section, footer, metadata.
   ═══════════════════════════════════════════════════════════════════ */

export const GITHUB_ORG = "krizaka";
export const GITHUB_REPO = "orazaka";

/** The canonical host: www (the apex answers 308 to www, see deploy/digitalocean/app.yaml). */
export const SITE_URL = "https://www.krizaka.com";

/**
 * Where Orochia runs — its card on /products and llms.txt point here.
 * NEXT_PUBLIC_APP_DEMO_URL switches it (dev today, production later) without touching the code;
 * it is read at build time, so a change takes effect on the next deployment.
 */
export const OROCHIA_APP_URL = (process.env.NEXT_PUBLIC_APP_DEMO_URL || "https://dev.orochia.com").replace(/\/$/, "");

export const CONTACT_EMAIL = "bonjour@krizaka.com";

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

/** Yasakia, the dating app (coming soon; formerly Yazakia): its repository. */
export const YASAKIA_REPO_URL = `${GITHUB_ORG_URL}/yasakia`;

/** Yororis, the listening space (under construction): its repository. The products card links its static site
    (dev.yororis.com) and its source — no application address, no download link (krizaka/yororis docs/FRAMEWORK.md §5). */
export const YORORIS_REPO_URL = `${GITHUB_ORG_URL}/yororis`;

/** Yomizaka, documents read and checked by Orazaka (coming soon): its repository. */
export const YOMIZAKA_REPO_URL = `${GITHUB_ORG_URL}/yomizaka`;
export const KACHIZAKA_REPO_URL = `${GITHUB_ORG_URL}/kachizaka`;
export const AKINAZA_REPO_URL = `${GITHUB_ORG_URL}/akinaza`;

/** The repositories the docs link to. */
export const KRIZAKA_UI_REPO_URL = `${GITHUB_ORG_URL}/krizaka-ui`;
export const PLATFORM_KIT_REPO_URL = `${GITHUB_ORG_URL}/krizaka-platform-kit`;
export const KRIZAKA_BUILD_REPO_URL = `${GITHUB_ORG_URL}/krizaka-build`;
