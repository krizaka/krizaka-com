import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// next.config.ts is loaded by Next's CommonJS loader: a module in its import graph that imports an ESM-only package (one whose
// package.json `exports` has no `require`/`default` condition, as @krizaka/org) fails the build with
// ERR_PACKAGE_PATH_NOT_EXPORTED, which no unit test of the module itself sees (krizaka-com#606). The guard walks the graph.
const root = fileURLToPath(new URL("..", import.meta.url));
const IMPORT = /^\s*import\s+(?!type\b)[^;]*?from\s+"([^"]+)"/gm;

function resolveLocal(from, spec) {
  const base = spec.startsWith("@/") ? path.join(root, spec.slice(2)) : path.resolve(path.dirname(from), spec);
  return [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")].find(
    (f) => existsSync(f) && !f.endsWith("/"),
  );
}

function esmOnly(pkg) {
  const name = pkg.startsWith("@") ? pkg.split("/").slice(0, 2).join("/") : pkg.split("/")[0];
  const file = path.join(root, "node_modules", name, "package.json");
  if (!existsSync(file)) return false;
  const exp = JSON.parse(readFileSync(file, "utf8")).exports?.["."];
  return Boolean(exp && typeof exp === "object" && !("require" in exp) && !("default" in exp));
}

test("next.config.ts imports no ESM-only package, directly or through lib/", () => {
  const seen = new Set();
  const bad = [];
  const walk = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const [, spec] of readFileSync(file, "utf8").matchAll(IMPORT)) {
      if (spec.endsWith(".json")) continue;
      if (spec.startsWith(".") || spec.startsWith("@/")) {
        const next = resolveLocal(file, spec);
        if (next) walk(next);
      } else if (esmOnly(spec)) bad.push(`${path.relative(root, file)} → ${spec}`);
    }
  };
  walk(path.join(root, "next.config.ts"));
  assert.ok(seen.size > 3, "the walk reached lib/");
  assert.ok(esmOnly("@krizaka/org"), "the guard knows an ESM-only package when it sees one");
  assert.deepEqual(bad, []);
});
