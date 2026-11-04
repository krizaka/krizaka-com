import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The users service lives in krizaka/krizaka-build (krizaka-users/, ADR-021): the krizaka/krizaka-users repository is the
// old split, kept only while its packages are bound to it. No link, tracker or source path here names it.
const files = ["lib/building-blocks.ts", "lib/maven-packages.ts"];

test("the users block and its artefacts point at krizaka-build, never the old split", () => {
  for (const file of files) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /github\.com\/krizaka\/krizaka-users\b/, `${file} links the old repository`);
    assert.doesNotMatch(source, /repo: "krizaka-users"/, `${file} names the old repository`);
  }
});

test("the users artefacts are read in their krizaka-build folder", () => {
  const source = readFileSync(new URL("../lib/maven-packages.ts", import.meta.url), "utf8");
  for (const part of ["api", "client", "core"]) {
    assert.match(source, new RegExp(`dir: "krizaka-users/krizaka-users-${part}"`));
  }
});
