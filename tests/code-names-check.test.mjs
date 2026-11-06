import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CODE_NAMES } from "@krizaka/org";
import { codeNameProblems, identifierAround, isAllowed } from "../scripts/check-code-names.mjs";

// The built-output guard (krizaka-internal#2659): the org package's bin plus a narrow allow-list of exact, real published
// identifiers. The retired names are read from the org package, the only place they are written.
const [old] = Object.keys(CODE_NAMES);
const allowed = [`@krizaka/${old}-shared`];
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("a retired name is a problem; an allowed identifier is not, wherever it appears", () => {
  assert.equal(codeNameProblems(`<p>${old} reads it</p>`, allowed).length, 1);
  assert.deepEqual(codeNameProblems(`<li>@krizaka/${old}-shared</li>`, allowed), []);
  assert.deepEqual(
    codeNameProblems(`@krizaka/${old}-shared@1.5.0 and https://npm.example/package/@krizaka/${old}-shared`, allowed),
    [],
  );
});

test("the allowance is the exact identifier: a longer name, another package or the bare word is refused", () => {
  assert.equal(codeNameProblems(`@krizaka/${old}-shared-extra`, allowed).length, 1);
  assert.equal(codeNameProblems(`@krizaka/${old}-cli`, allowed).length, 1);
  assert.equal(codeNameProblems(`the ${old} package @krizaka/${old}-shared`, allowed).length, 1);
  assert.equal(codeNameProblems(`https://github.com/krizaka/${old}/pull/1`, allowed).length, 1);
});

test("the identifier around a hit is its whole run of name characters", () => {
  assert.equal(identifierAround('a href="https://x.example/@krizaka/p-q" b', 28, 29), "https://x.example/@krizaka/p-q");
  assert.equal(isAllowed("nothing", allowed), false);
});

test("the committed allow-list names exact packages, each with a reason, and no file or page", () => {
  const list = JSON.parse(read("scripts/code-names-allowed.json"));
  assert.ok(list.tokens.length > 0);
  for (const t of list.tokens) {
    assert.match(t.value, /^@krizaka\/[a-z-]+$/, "an exact npm package name");
    assert.ok(t.why.length > 30, `${t.value} says why`);
  }
  assert.deepEqual(Object.keys(list).sort(), ["$comment", "tokens"]);
});

test("the build runs the guard over the built pages, and lint keeps the bin over the sources", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts.build, /node scripts\/check-code-names\.mjs \.next\/server\/app/);
  assert.match(pkg.scripts.lint, /krizaka-code-names messages content/);
});
