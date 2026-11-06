import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// 2026-11-06: the founder deleted krizaka/krizaka-users and krizaka/krizaka-platform-kit (both live in krizaka/krizaka-build
// since ADR-021, as are krizaka-notifications and krizaka-billing) and krizaka/krizaka-accounts (empty, created again when a shared accounts site is needed). No link, forum,
// tracker or source path of the site names them: a link to a deleted repository is a 404.
// Not here on purpose: lib/java-redirects.ts (the old /docs/java/<repo> addresses still answer 308), the Maven coordinates
// (`com.krizaka:krizaka-platform-kit` is a module of krizaka-build) and app/data/architecture.json (generated from the
// Orazaka workspace by its scripts/generate-docs.mjs).
const GONE = ["krizaka-accounts", "krizaka-users", "krizaka-platform-kit", "krizaka-notifications", "krizaka-billing"];
const files = [
  "lib/building-blocks.ts",
  "lib/maven-packages.ts",
  "lib/site.ts",
  "lib/structured-data.ts",
  "content/llms.txt",
  "messages/en.json",
  "messages/fr.json",
];
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("no link points at a deleted repository", () => {
  for (const file of files) {
    for (const gone of GONE) {
      assert.doesNotMatch(read(file), new RegExp(`github\\.com/krizaka/${gone}(?![-\\w])`), `${file} links ${gone}`);
    }
  }
});

test("no source names a deleted repository as the place of a block or a package", () => {
  for (const file of files) {
    for (const gone of GONE) {
      assert.doesNotMatch(read(file), new RegExp(`repo: "${gone}"`), `${file} names ${gone} as a repo`);
    }
  }
});

test("the messages do not send readers to the deleted forum", () => {
  for (const file of ["messages/en.json", "messages/fr.json"]) {
    assert.doesNotMatch(read(file), /Discussions? (of|de) krizaka-platform-kit/, `${file} names the deleted forum`);
  }
});
