import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("the canonical host is www, and nothing else hard-codes the apex", () => {
  assert.match(read("lib/site.ts"), /SITE_URL = "https:\/\/www\.krizaka\.com"/);
  assert.doesNotMatch(read("app/[locale]/layout.tsx"), /"https:\/\/krizaka\.com/);
});

test("the home title is the company's; its description names the four products and the stack", () => {
  const home = read("app/[locale]/page.tsx");
  assert.match(home, /title: "Krizaka — open-source software studio in Montréal",/);
  assert.match(home, /title: "Krizaka — studio logiciel open source à Montréal",/);
  for (const p of ["Krizaka UI", "Krizaka Java", "Orazaka", "Orochia", "Yasakia", "Yororis"]) assert.ok(home.includes(p), p);
});

test("the Organization is in Montréal and points to GitHub", () => {
  const graph = read("lib/structured-data.ts");
  assert.match(graph, /addressLocality: "Montréal"/);
  assert.match(graph, /sameAs: \[GITHUB_ORG_URL/);
});

test("the Organization owns the products and the open-source sites, each published by it", () => {
  const sd = read("lib/structured-data.ts");
  assert.match(sd, /owns: owned\.map/);
  for (const url of ["https://dev.orazaka.com", "https://dev.orochia.com", "https://dev.yasakia.com", "https://dev.yororis.com", "https://java.krizaka.com"]) {
    assert.ok(sd.includes(url), `${url} is owned by the Organization`);
  }
  assert.ok((sd.match(/publisher: \{ "@id": ORG_ID \}/g) ?? []).length >= 3);
});

test("every page has an Open Graph image", () => {
  assert.match(read("app/[locale]/opengraph-image.tsx"), /ImageResponse/);
});
