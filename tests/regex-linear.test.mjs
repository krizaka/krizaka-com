import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanText, plain } from "../lib/changelog.ts";
import { logicalPath } from "../scripts/cdn-assets.mjs";
import { parseEnvFile, rewriteLinks, slug } from "../scripts/pr-assets.mjs";
import { trimEnd } from "../scripts/trim-end.mjs";

// A hostile input is long and almost matches: a linear regex answers in a few ms, a quadratic one in seconds.
const BIG = 50_000;
const fast = (fn) => {
  const start = performance.now();
  const out = fn();
  assert.ok(performance.now() - start < 500, "must stay linear");
  return out;
};

test("trimEnd drops a run of one character at the end only", () => {
  assert.equal(trimEnd("a//", "/"), "a");
  assert.equal(trimEnd("///", "/"), "");
  assert.equal(trimEnd("/a/b", "/"), "/a/b");
  assert.equal(trimEnd("", "/"), "");
  assert.equal(fast(() => trimEnd(`${"/".repeat(BIG)}x`, "/")).length, BIG + 1);
});

test("changelog: an em dash with spaces becomes a colon, a bare one a hyphen, links keep their words", () => {
  assert.equal(cleanText("Fast  —  simple"), "Fast: simple");
  assert.equal(cleanText("a—b"), "a-b");
  assert.equal(plain("see [the docs](https://x.y/z) and **bold**"), "see the docs and bold");
  assert.equal(plain("[a](x) [b](y)"), "a b");
  assert.equal(fast(() => cleanText(" ".repeat(BIG) + "x")).trim(), "x");
  assert.equal(fast(() => plain("[".repeat(BIG))).length > 0, true);
});

test("cdn-assets logicalPath: slashes at both ends are dropped, hostile slashes stay fast", () => {
  assert.equal(logicalPath("//products/folioviv/tour///"), "products/folioviv/tour");
  assert.throws(() => fast(() => logicalPath(`products/${"/".repeat(BIG)}x`)));
});

test("pr-assets: slug, env file, host and link rewriting give the same results", () => {
  assert.equal(slug(" feat/x y ", "key"), "feat-x-y");
  assert.equal(slug("--a--", "key"), "a");
  assert.throws(() => slug("---", "key"));
  assert.deepEqual(parseEnvFile("export A=1\nB = 'two' \nC=3 # note\n# skip\nD="), { A: "1", B: "two", C: "3", D: "" });
  assert.equal(parseEnvFile(`X=1${" ".repeat(BIG)}y`).X, `1${" ".repeat(BIG)}y`);
  assert.equal(fast(() => parseEnvFile(`X=${" ".repeat(BIG)}z`)).X, "z");
  const cfg = { pullZone: "cdn.example" };
  const r = rewriteLinks("![a](docs/screenshots/12/a.png) ![b](https://github.com/krizaka/r/blob/main/docs/screenshots/12/b.png?raw=true)", { repo: "r", cfg });
  assert.equal(r.count, 2);
  assert.equal(r.text, "![a](https://cdn.example/pr-assets/r/12/a.png) ![b](https://cdn.example/pr-assets/r/12/b.png)");
  assert.equal(rewriteLinks("x ./docs/screenshots/1/a.png", { repo: "r", cfg, from: "./docs/screenshots/" }).count, 1);
  assert.equal(fast(() => rewriteLinks("docs/screenshots/".repeat(2000), { repo: "r", cfg })).count >= 0, true);
});
