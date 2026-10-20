import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

// The redirect tests match sources with path-to-regexp, the matcher Next.js uses. They import it as a declared
// devDependency, never by reaching into Next.js' private compiled bundle (next/dist/compiled/...), which can move
// in any minor release and break CI for a reason that has nothing to do with the redirects (krizaka-com#211).
const tests = readdirSync(new URL(".", import.meta.url)).filter((f) => f.endsWith(".mjs") && f !== "no-private-next-imports.test.mjs");

test("no test imports a private next/dist module", () => {
  const offenders = tests.filter((f) => /next\/dist\//.test(readFileSync(new URL(f, import.meta.url), "utf8").replace(/^\s*\/\/.*$/gm, "")));
  assert.deepEqual(offenders, []);
});

test("path-to-regexp is a declared devDependency", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.ok(pkg.devDependencies?.["path-to-regexp"], "add path-to-regexp to devDependencies");
});
