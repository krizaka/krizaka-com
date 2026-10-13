import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("the canonical host is www, and nothing else hard-codes the apex", () => {
  assert.match(read("lib/site.ts"), /SITE_URL = "https:\/\/www\.krizaka\.com"/);
  assert.doesNotMatch(read("app/[locale]/layout.tsx"), /"https:\/\/krizaka\.com/);
});

test("the home title leads with the brand and names the four products", () => {
  const home = read("app/[locale]/page.tsx");
  for (const p of ["Orazaka", "Orochia", "Yazakia", "Yororis"]) assert.ok(home.includes(p));
  assert.match(home, /title: "Krizaka — sovereign AI and apps from Montréal/);
});
