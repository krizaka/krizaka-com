/* The @krizaka packages on npm, grouped — pure rules over what the registry says at build (scripts/gen-registry-versions.mjs
   → lib/registry-versions.json: version, description, keywords). No list of packages here: a package published under
   the scope appears on /open-source at the next build, in the group its keywords name. Tested by
   tests/open-source.test.mjs (no import alias: Node strips the types and runs it as is). */

export const NPM_GROUPS = ["ui", "data", "realtime", "tooling"] as const;
export type NpmGroup = (typeof NPM_GROUPS)[number];

export interface NpmPackageInfo {
  name: string;
  version: string;
  description: string;
  keywords: string[];
}

/* First rule that matches wins: realtime before data (a server-state package speaks SSE too), data before tooling
   (the i18n engine ships a CLI), tooling before UI (the shared config knows the design system). */
const RULES: readonly [NpmGroup, readonly string[]][] = [
  ["realtime", ["realtime", "push", "push-notifications", "pubsub", "presence"]],
  ["data", ["server-state", "react-query", "tanstack-query", "i18n", "intl", "zod", "money", "offline", "storage"]],
  ["tooling", ["cli", "eslint-config", "tsconfig", "codemod", "scaffold", "create"]],
  ["ui", ["design-system", "design-tokens", "components", "icons", "fonts", "tailwindcss", "charts", "react"]],
];

/** The group of a package, from its npm keywords; a package that names none of them is tooling. */
export function groupOfPackage(keywords: readonly string[]): NpmGroup {
  return RULES.find(([, words]) => words.some((w) => keywords.includes(w)))?.[0] ?? "tooling";
}

/** The first clause of a registry description — what the package is, before the list of what it holds. Whole words,
    never an ellipsis: the full description stays on npm. */
export function summary(description: string): string {
  const text = description.trim();
  const cut = text.search(/[:.;](\s|$)/);
  return (cut > 0 ? text.slice(0, cut) : text).trim();
}

/** The packages by group, each group sorted by name; empty groups left out. */
export function groupPackages(packages: readonly NpmPackageInfo[]) {
  return NPM_GROUPS.map((group) => ({
    group,
    packages: packages.filter((p) => groupOfPackage(p.keywords) === group).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.packages.length > 0);
}
