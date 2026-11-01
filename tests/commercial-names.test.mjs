import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { catalogueValues, findCodeNames } from "@krizaka/org";
import { PRODUCTS } from "../lib/products.ts";

// Commercial names (Oussama, 2026-11-01, krizaka-internal#2103): the site shows Verikora, Folioviv and Sovkora; the code names
// (yomizaka, akinaza, orazaka) stay in ids, addresses and repositories, never in a rendered word.
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("the home's product cards carry the commercial names, read from @krizaka/org", () => {
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.name]));
  assert.deepEqual(byId, { orazaka: "Sovkora", yomizaka: "Verikora", akinaza: "Folioviv" });
  assert.doesNotMatch(
    read("lib/products.ts"),
    /name: "(Verikora|Folioviv|Sovkora|Orazaka|Yomizaka|Akinaza)"/,
    "the name is data, never typed",
  );
});

test("the addresses keep the code names: only the words change", () => {
  for (const p of PRODUCTS) assert.match(p.siteUrl, new RegExp(`^https://www\\.${p.id}\\.com`), p.id);
});

test("no code name in a message or in the llms files", () => {
  const files = ["messages/en.json", "messages/fr.json", "content/llms.txt", "content/llms-full.txt"];
  for (const f of files) {
    const pieces = f.endsWith(".json") ? catalogueValues(JSON.parse(read(f))) : [["", read(f)]];
    for (const [key, text] of pieces) assert.deepEqual(findCodeNames(text), [], `${f} ${key}`);
  }
  assert.ok(readdirSync(new URL("../content", import.meta.url)).length > 0);
});

test("the home's lead names Sovkora, Verikora and Folioviv in both languages", () => {
  for (const lang of ["en", "fr"]) {
    const home = JSON.parse(read(`messages/${lang}.json`)).site.home;
    const text = JSON.stringify(home);
    for (const n of ["Sovkora", "Verikora", "Folioviv"]) assert.ok(text.includes(n), `${lang}: ${n}`);
  }
});

test("a release line says the commercial names and keeps addresses, repositories and packages", async () => {
  const { commercialWords } = await import("../lib/commercial-words.ts");
  assert.equal(commercialWords("Orazaka reads it"), "Sovkora reads it");
  assert.equal(commercialWords("yomizaka and Akinaza"), "Verikora and Folioviv");
  for (const kept of ["orazaka-edge", "dev.yomizaka.com", "github.com/krizaka/akinaza", "www.orazaka.com"]) {
    assert.equal(commercialWords(kept), kept);
  }
});

test("the footer's family names are the commercial names, the rest of the family unchanged", async () => {
  const { FOOTER_ORG } = await import("../lib/footer-org.ts");
  const names = Object.fromEntries(FOOTER_ORG.family.map((e) => [e.id, e.name]));
  assert.equal(names.orazaka, "Sovkora");
  assert.equal(names.yomizaka, "Verikora");
  assert.equal(names.akinaza, "Folioviv");
  assert.equal(names.krizaka, "Krizaka");
});
