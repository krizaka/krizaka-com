// Krizaka runs on DigitalOcean App Platform; Vercel is retired (2026-10-21). Nothing in the repository configures or mentions it,
// except the env-name guard that REFUSES a VERCEL_ variable (tests/env.test.mjs).
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter(Boolean);
const ALLOWED = new Set(["tests/env.test.mjs", "tests/no-vercel.test.mjs", "package-lock.json"]);

test("no vercel.json and no Vercel deployment file", () => {
  assert.deepEqual(files.filter((f) => /(^|\/)(vercel\.json|\.vercel)(\/|$)/.test(f)), []);
});

test("no file mentions Vercel (the env-name ban list aside), and no @vercel package is a dependency", () => {
  const mentions = files.filter((f) => !ALLOWED.has(f) && /\.(md|mdx|ts|tsx|mjs|js|json|ya?ml|env\.example|txt)$|Dockerfile|ignore$|\.example$/.test(f) && /vercel/i.test(readFileSync(f, "utf8")));
  assert.deepEqual(mentions, []);
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.deepEqual(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((d) => d.startsWith("@vercel/")), []);
});
