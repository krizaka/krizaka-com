import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { CODE_NAMES, brandOf, catalogueValues, findCodeNames } from "@krizaka/org";
import { PRODUCTS } from "../lib/products.ts";

// Commercial names (Oussama, 2026-11-01, krizaka-internal#2103): the site shows Verikora, Folioviv and Sovkora; the code names
// (verikora, folioviv, sovkora) stay in ids, addresses and repositories, never in a rendered word.
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("the home's product cards carry the commercial names, read from @krizaka/org", () => {
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.name]));
  assert.deepEqual(byId, { sovkora: "Sovkora", verikora: "Verikora", folioviv: "Folioviv" });
  assert.doesNotMatch(
    read("lib/products.ts"),
    /name: "(Verikora|Folioviv|Sovkora|Sovkora|Verikora|Folioviv)"/,
    "the name is data, never typed",
  );
});

test("the public addresses are the commercial www domains (founder, 2026-11-04): no code-name host is linked", () => {
  assert.deepEqual(Object.fromEntries(PRODUCTS.map((p) => [p.id, p.siteUrl])), {
    sovkora: "https://www.sovkora.com",
    verikora: "https://www.verikora.com",
    folioviv: "https://www.folioviv.com",
  });
  for (const p of PRODUCTS) assert.equal(p.siteUrl, new URL(brandOf(p.id).domains.site).origin, p.id);
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

test("a release line says the commercial names, in prose and hosts; repositories and packages keep their address", async () => {
  const { commercialWords } = await import("../lib/commercial-words.ts");
  const [code] = Object.keys(CODE_NAMES); // the retired ids are read from the org package, the only place they are written
  const name = CODE_NAMES[code];
  const cap = (w) => w[0].toUpperCase() + w.slice(1);
  assert.equal(commercialWords(`${cap(code)} reads it`), `${cap(name)} reads it`);
  assert.equal(commercialWords(`${code} and ${cap(code)}`), `${name} and ${cap(name)}`);
  assert.equal(commercialWords(`moves to www.${code}.com`), `moves to www.${name}.com`);
  assert.equal(commercialWords(`dev.${code}.com`), `dev.${name}.com`);
  for (const kept of [`${code}-edge`, `github.com/krizaka/${code}`, `@krizaka/${code}-cli`]) {
    assert.equal(commercialWords(kept), kept);
  }
});

test("the footer's family names are the commercial names, the rest of the family unchanged", async () => {
  const { org } = await import("@krizaka/org");
  const names = Object.fromEntries(org.family.map((e) => [e.id, e.name]));
  assert.equal(names.sovkora, "Sovkora");
  assert.equal(names.verikora, "Verikora");
  assert.equal(names.folioviv, "Folioviv");
  assert.equal(names.krizaka, "Krizaka");
});
