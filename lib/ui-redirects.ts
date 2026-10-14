/* Krizaka UI's documentation lives on its own site, ui.krizaka.com, built from the krizaka-ui repository (apps/site)
   at every change. Every old address of krizaka.com/docs/ui answers 308 with its page there — with the locale prefix or
   without it (a config redirect runs before the locale proxy): English at the path, French under /fr.

   The map is the one of krizaka-ui apps/site/lib/urls.ts (`pathOfLegacySlug`), copied here (no runtime dependency
   between the two sites) and tested by tests/ui-redirects.test.mjs. Read by next.config.ts. */

export const UI_SITE = "https://ui.krizaka.com";

export interface Redirect {
  source: string;
  destination: string;
  statusCode: 308;
}

const GET_STARTED = ["installation", "theming"];
const FOUNDATIONS = ["tokens", "typography", "icons", "motion", "brand-marks"];
const PACKAGES = ["tailwind", "intl", "i18n", "query", "realtime", "push", "config"];

/** The path on ui.krizaka.com (no locale) of a page of the old /docs/ui, by its slug there (`""` for /docs/ui). */
export function uiPathOf(slug: string): string {
  if (slug === "") return "/";
  if (GET_STARTED.includes(slug)) return `/${slug}`;
  if (FOUNDATIONS.includes(slug)) return `/foundations/${slug}`;
  if (PACKAGES.includes(slug)) return `/packages/${slug}`;
  if (slug === "mobile") return "/mobile";
  if (slug === "templates" || slug === "screens") return "/templates";
  if (slug.startsWith("templates-")) return `/templates/${slug.slice("templates-".length)}`;
  return `/components/${slug}`;
}

/** Every redirect: the named pages first, then any other slug — a component — and the old hub. The static host serves
    each page as a folder: destinations end with a slash (one hop, no host redirect). */
export function uiRedirects(): Redirect[] {
  const named = ["", ...GET_STARTED, ...FOUNDATIONS, ...PACKAGES, "mobile", "templates", "screens"];
  const rules: Redirect[] = [];
  for (const [prefix, target] of [["/fr", `${UI_SITE}/fr`], ["/:locale(en)?", UI_SITE]] as const) {
    for (const slug of named) {
      const path = uiPathOf(slug);
      rules.push({ source: `${prefix}/docs/ui${slug ? `/${slug}` : ""}`, destination: `${target}${path === "/" ? "/" : `${path}/`}`, statusCode: 308 });
    }
    rules.push({ source: `${prefix}/docs/ui/templates-:intent`, destination: `${target}/templates/:intent/`, statusCode: 308 });
    rules.push({ source: `${prefix}/docs/ui/:name`, destination: `${target}/components/:name/`, statusCode: 308 });
    // Deeper than one segment never existed; keep the reader on the site rather than on a 404.
    rules.push({ source: `${prefix}/docs/ui/:path+`, destination: `${target}/`, statusCode: 308 });
  }
  // The documentation hub (/docs) is gone with its last set: the open-source page is the way to ui. and java.
  rules.push({ source: "/fr/docs", destination: "/fr/open-source", statusCode: 308 });
  rules.push({ source: "/:locale(en)?/docs", destination: "/en/open-source", statusCode: 308 });
  return rules;
}
