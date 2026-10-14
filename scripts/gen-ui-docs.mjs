#!/usr/bin/env node
/* /docs/ui is generated from the @krizaka/ui registry (the installed package) at every build — the code of each
   component drives its page: meta.ts (summary, when to use, accessibility, platforms), its named examples and its
   props. Nothing about a component is written here. (The product kits' own pages, /docs/<product>/ui, live on the
   products' sites.)

   This script writes what a bundler and a static host need (git-ignored, rewritten by `postinstall`, `dev` and
   `build`; the pages themselves are virtual: lib/docs-source.ts reads the registry):
   - lib/ui-examples.ts      the import map of the live web examples (@krizaka/ui and @krizaka/charts);
   - public/ui-examples/     the screenshots of the React Native examples (dark and light: the Linux baselines of
                             their stories, shipped in the package), which have no live preview on the web.
   and checks that the registry is complete enough to render: every component has its title, summary, platforms and
   at least one example per platform, every example's compiled module is in the package, every related component
   exists, and every optional enrichment page (content/docs/ui/components/<name>.mdx) is a component of the registry;
   a deprecated component says what replaces it.

   Usage: node scripts/gen-ui-docs.mjs [--strict | --check]
     (none)     writes lib/ui-examples.ts; reports an incomplete registry without failing (`postinstall`, `dev`).
     --strict   writes it and exits 1 when the registry is incomplete (`npm run build`).
     --check    writes nothing; exits 1 when a generated file is stale or a registry incomplete (`npm run lint`). */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const registryDir = (pkg) => path.join(root, "node_modules", ...pkg.split("/"), "registry");
const enrichDir = path.join(root, "content", "docs", "ui", "components");
const examplesFile = path.join(root, "lib", "ui-examples.ts");
const shotsDir = path.join(root, "public", "ui-examples");
const check = process.argv.includes("--check");
const strict = check || process.argv.includes("--strict");

/** The documented packages: Krizaka UI (@krizaka/ui and @krizaka/charts, one catalogue). */
const PACKAGES = [
  { id: "ui", pkg: "@krizaka/ui" },
  { id: "charts", pkg: "@krizaka/charts" },
];

const load = ({ pkg }) => {
  const index = JSON.parse(readFileSync(path.join(registryDir(pkg), "index.json"), "utf8"));
  const items = index.items.map((entry) => JSON.parse(readFileSync(path.join(registryDir(pkg), `${entry.name}.json`), "utf8")));
  return { index, items, names: new Set(items.map((item) => item.name)) };
};
const registries = Object.fromEntries(PACKAGES.map((entry) => [entry.id, { ...entry, ...load(entry) }]));
const { index } = registries.ui;
const uiParts = Object.values(registries);
const names = new Set(uiParts.flatMap((r) => [...r.names]));
const problems = [];

/** Where an example's module lives in the package: compiled (`.js`) or as its source (`.tsx`). */
const moduleFile = (pkg, example) => path.join(registryDir(pkg), example.path.replace(/\.tsx$/, ""));
const hasModule = (pkg, example) => existsSync(`${moduleFile(pkg, example)}.js`) || existsSync(`${moduleFile(pkg, example)}.tsx`);

for (const { pkg, items: packageItems } of Object.values(registries)) {
  const resolves = (ref) => names.has(ref);
  for (const item of packageItems) {
    const where = `${pkg}/registry/${item.name}`;
    const deprecated = item.status === "deprecated";
    if (!item.title || !item.summary) problems.push(`${where}: no title or summary (meta.ts)`);
    if (!["web", "native", "both"].includes(item.platforms)) problems.push(`${where}: unknown platforms "${item.platforms}"`);
    if (!item.whenToUse?.length || !item.accessibility) problems.push(`${where}: no "when to use" or accessibility (meta.ts)`);
    if (deprecated && !(item.deprecated?.use && resolves(item.deprecated.use))) problems.push(`${where}: deprecated without a replacement that exists`);
    for (const side of ["web", "native"]) {
      const expected = item.platforms === "both" || item.platforms === side;
      if (expected && !deprecated && !item[side]?.examples?.length) problems.push(`${where}: no ${side} example`);
      for (const example of item[side]?.examples ?? []) {
        if (side === "web" && !hasModule(pkg, example)) problems.push(`${where}: ${example.path} is not in the package`);
        if (!example.code) problems.push(`${where}: ${example.path} has no code`);
      }
    }
    for (const ref of [...(item.related ?? []), ...(item.whenNotToUse ?? []).map((w) => w.use).filter(Boolean)]) {
      if (!resolves(ref)) problems.push(`${where}: unknown related component "${ref}"`);
    }
  }
}
for (const file of existsSync(enrichDir) ? readdirSync(enrichDir) : []) {
  if (file.endsWith(".mdx") && !names.has(file.replace(/\.mdx$/, ""))) {
    problems.push(`content/docs/ui/components/${file}: no component of that name in the registry (an enrichment page needs one)`);
  }
}

const key = (example) => example.module.replace("@krizaka/ui/registry/examples/", "").replace("@krizaka/charts/registry/examples/", "charts/");
const webExamples = Object.values(registries).flatMap((r) => r.items.flatMap((item) => item.web?.examples ?? []));
const versions = Object.values(registries).map((r) => `${r.pkg}@${r.index.version}`).join(", ");
const expected = `/* GENERATED by scripts/gen-ui-docs.mjs from the registries of ${versions} — do not edit (git-ignored).
   The live web examples of /docs/ui (modules of the packages), loaded by ExamplePreview. */

export const UI_EXAMPLES = {
${webExamples.map((example) => `  "${key(example)}": () => import("${example.module}"),`).join("\n")}
} as const;

export type UiExampleKey = keyof typeof UI_EXAMPLES;

export const UI_REGISTRY_VERSION = "${index.version}";
`;

for (const [file, content, label] of [
  [examplesFile, expected, `lib/ui-examples.ts — ${webExamples.length} examples (${versions})`],
]) {
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (current === content) continue;
  if (check) problems.push(`${path.relative(root, file)} is stale — run \`npm run docs:ui\` (or \`npm install\`).`);
  else {
    writeFileSync(file, content);
    console.log(`gen-ui-docs: ${label}`);
  }
}

// The screenshots of the native examples (Krizaka UI: primitives and charts), served next to the pages:
// public/ui-examples/<name>/native/<example>.<theme>.png.
const shots = uiParts.flatMap((r) =>
  r.items.flatMap((item) => (item.native?.examples ?? []).flatMap((example) => Object.values(example.screenshots ?? {}).map((shot) => ({ shot, dir: registryDir(r.pkg), pkg: r.pkg })))),
);
for (const { shot, dir, pkg } of shots) {
  if (!existsSync(path.join(dir, shot))) problems.push(`${pkg}/registry/${shot}: missing screenshot`);
}
if (!check) {
  rmSync(shotsDir, { recursive: true, force: true });
  for (const { shot, dir } of shots) {
    const from = path.join(dir, shot);
    if (!existsSync(from)) continue;
    const to = path.join(shotsDir, shot.replace(/^examples\//, ""));
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(from, to);
  }
}

for (const problem of problems) console.error(`gen-ui-docs: ${problem}`);
process.exit(strict && problems.length ? 1 : 0);
