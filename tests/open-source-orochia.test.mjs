import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// /open-source lists every repository with GitHub's description — except Orochia's, whose descriptions are written for its
// own audience: krizaka.com says one neutral line each, from the messages (the GitHub descriptions are not edited).
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`)).site.openSource.orochiaRepos;
const BANNED = /creator|createur|créateur|18\+|revenue|revenu|adult|90\s?%|payout|fan/i;

test("each Orochia repository has a neutral line in both languages, and a default", () => {
  for (const lang of ["en", "fr"]) {
    const lines = messages(lang);
    for (const key of ["orochia", "orochia-mobile", "orochia-design-system", "default"]) {
      assert.ok(lines[key]?.length > 10, `${lang}: ${key}`);
      assert.ok(!BANNED.test(lines[key]), `${lang}: ${key} is not neutral: ${lines[key]}`);
    }
  }
});

test("the page shows that line, never the GitHub description, for an Orochia repository", () => {
  const page = read("app/[locale]/open-source/page.tsx");
  assert.match(page, /r\.name\.startsWith\("orochia"\) \? \(t\.orochiaRepos\[r\.name as keyof typeof t\.orochiaRepos\] \?\? t\.orochiaRepos\.default\) : r\.description/);
});
