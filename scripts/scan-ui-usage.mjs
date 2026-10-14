#!/usr/bin/env node
/* Which product uses which Krizaka UI component today — the data behind "used by" in /docs/ui (lib/ui-usage.json).

   It reads the *committed* sources of each product repository (`git` at `origin/<main>` after a fetch — never the
   working tree, so a half-finished session does not count) and counts, per component of the @krizaka/ui and
   @krizaka/charts registries, the import statements that bring it in:
     import { Button } from "@krizaka/ui/button"        → button   (the entry of the web side)
     import { Loader, Screen } from "@krizaka/ui/native" → loader, screen (the names the native side imports)
     import { LineChart } from "@krizaka/charts/line"    → line-chart (the entry of the chart)
   Tests, stories, mocks and builds are left out. The result is written to lib/ui-usage.json and committed: it is an
   editorial snapshot (dated), refreshed by hand when the products move — `npm run ui:usage` — because CI has no clone
   of the products. tests/docs-ia.test.mjs checks its shape against the registry; it never reads the products.

   Usage: node scripts/scan-ui-usage.mjs [--root <folder holding the clones>] [--no-fetch] */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const base = path.resolve(flag("--root") ?? path.join(homedir(), "krizaka-com"));
const fetchFirst = !args.includes("--no-fetch");

/** The product repositories (clones under <root>), grouped by product. A repo's own path is where its sources start. */
export const PRODUCTS = {
  orochia: [
    { repo: "products/orochia", dir: "apps/web" },
    { repo: "products/orochia-admin" },
    { repo: "products/orochia-mobile" },
    { repo: "products/orochia-design-system" },
  ],
  orazaka: [
    { repo: "products/orazaka/orazaka-apps/ui/orazaka-web-client" },
    { repo: "products/orazaka/orazaka-apps/ui/orazaka-web-admin" },
    { repo: "products/orazaka/orazaka-apps/ui/orazaka-mobile-client" },
    { repo: "products/orazaka/orazaka-apps/ui/orazaka-ui-kit" },
  ],
  yasakia: [{ repo: "products/yazakia" }],
  krizaka: [{ repo: ".", skip: /^(products|company|orazaka-content|content|public)\// }],
};

const SOURCE = /\.(tsx|ts|jsx|js|mjs)$/;
const NOT_SOURCE = /(^|\/)(node_modules|\.next|dist|build|out|coverage|storybook-static|\.turbo|\.expo|android|ios|__screenshots__|e2e|\.source|tests?|__tests__|__mocks__)\/|\.(test|spec|stories|d)\.[cm]?[jt]sx?$|\.config\.[cm]?[jt]s$/;

const git = (cwd, ...a) => execFileSync("git", a, { cwd, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "pipe"] });

/** The registries: which module and which names stand for which component. */
export function loadResolvers() {
  const webEntry = new Map(); // "@krizaka/ui/button" → "button"
  const nativeName = new Map(); // "Loader" (from @krizaka/ui/native) → "loader"
  const nativeEntry = new Map(); // "@krizaka/ui/native/list" → "list"
  for (const pkg of ["ui", "charts"]) {
    const dir = path.join(root, "node_modules", "@krizaka", pkg, "registry");
    const index = JSON.parse(readFileSync(path.join(dir, "index.json"), "utf8"));
    for (const { name } of index.items) {
      const item = JSON.parse(readFileSync(path.join(dir, `${name}.json`), "utf8"));
      if (item.web?.entry) webEntry.set(item.web.entry, name);
      if (item.native) {
        if (item.native.entry && item.native.entry !== "@krizaka/ui/native") nativeEntry.set(item.native.entry, name);
        else for (const imported of item.native.import.match(/\{([^}]*)\}/)?.[1].split(",").map((s) => s.trim()).filter(Boolean) ?? []) nativeName.set(imported, name);
      }
    }
  }
  return { webEntry, nativeName, nativeEntry };
}

const IMPORT = /import\s+(?:type\s+)?(?:([\w$]+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*["'](@krizaka\/(?:ui|charts)(?:\/[\w./-]+)?)["']/g;

/** The components a source file imports, one entry per import statement (a native name counts once per statement). */
export function componentsImported(text, { webEntry, nativeName, nativeEntry }) {
  const found = [];
  for (const [statement, , named, specifier] of text.matchAll(IMPORT)) {
    if (/^import\s+type\b/.test(statement)) continue;
    if (nativeEntry.has(specifier)) found.push(nativeEntry.get(specifier));
    else if (specifier === "@krizaka/ui/native") {
      const names = (named ?? "").split(",").map((s) => s.trim().replace(/^type\s+.*/, "").split(/\s+as\s+/)[0]).filter(Boolean);
      for (const component of new Set(names.map((n) => nativeName.get(n)).filter(Boolean))) found.push(component);
    } else {
      // "@krizaka/ui/form/server" belongs to "@krizaka/ui/form".
      const entry = [...webEntry.keys()].find((e) => specifier === e || specifier.startsWith(`${e}/`));
      if (entry) found.push(webEntry.get(entry));
    }
  }
  return found;
}

function scanRepo({ repo, dir, skip }, resolvers) {
  const cwd = path.join(base, repo);
  if (!existsSync(path.join(cwd, ".git"))) return null;
  if (fetchFirst) git(cwd, "fetch", "-q", "origin");
  const head = ["origin/main", "origin/master"].find((ref) => {
    try {
      git(cwd, "rev-parse", "--verify", "-q", ref);
      return true;
    } catch {
      return false;
    }
  });
  if (!head) return null;
  const files = git(cwd, "ls-tree", "-r", "--name-only", head)
    .split("\n")
    .filter((f) => SOURCE.test(f) && !NOT_SOURCE.test(f) && (!dir || f.startsWith(`${dir}/`)) && !(skip && skip.test(f)));
  const counts = {};
  for (const file of files) {
    for (const component of componentsImported(git(cwd, "show", `${head}:${file}`), resolvers)) counts[component] = (counts[component] ?? 0) + 1;
  }
  return { repo, ref: head, commit: git(cwd, "rev-parse", "--short", head).trim(), files: files.length, counts };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const resolvers = loadResolvers();
  const components = {};
  const repos = {};
  for (const [product, list] of Object.entries(PRODUCTS)) {
    repos[product] = [];
    for (const entry of list) {
      const result = scanRepo(entry, resolvers);
      if (!result) {
        console.warn(`skipped ${entry.repo}: no clone with origin/main under ${base}`);
        continue;
      }
      repos[product].push({ repo: result.repo, commit: result.commit, files: result.files });
      for (const [component, n] of Object.entries(result.counts)) {
        components[component] ??= {};
        components[component][product] = (components[component][product] ?? 0) + n;
      }
    }
  }
  const sorted = Object.fromEntries(Object.keys(components).sort().map((k) => [k, Object.fromEntries(Object.entries(components[k]).sort())]));
  const out = { scannedAt: new Date().toLocaleDateString("sv"), repos, components: sorted };
  writeFileSync(path.join(root, "lib", "ui-usage.json"), `${JSON.stringify(out, null, 2)}\n`);
  console.log(`ui-usage: ${Object.keys(sorted).length} components used by ${Object.keys(repos).join(", ")} → lib/ui-usage.json`);
}
