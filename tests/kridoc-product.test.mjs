import { test } from "node:test";
import assert from "node:assert/strict";
import { read } from "./helpers/source.mjs";
import { brandOf, displayName, org } from "@krizaka/org";
import { PRODUCTS } from "../lib/products.ts";
import { ORG_PENDING } from "../lib/product-status.ts";
import { productLines } from "../lib/llms-sections.ts";

// Kridoc is shown like the other products (founder, 2026-11-14, krizaka-internal#3559): it left the products in design, joined
// PRODUCTS in development, lost its mood photo. Everything PRODUCTS feeds is checked here for Kridoc, or says why it is left out.
const messages = Object.fromEntries(["en", "fr"].map((l) => [l, JSON.parse(read(`messages/${l}.json`))]));
const kridoc = PRODUCTS.find((p) => p.id === "kridoc");
const about = JSON.parse(read("content/llms-about.json"));

test("Kridoc is a product in development, named and linked from @krizaka/org, no source while its repository is private", () => {
  assert.ok(kridoc);
  assert.equal(kridoc.name, displayName("kridoc"));
  assert.equal(kridoc.status, "development");
  assert.equal(kridoc.siteUrl, new URL(brandOf("kridoc").domains.site).origin);
  assert.equal(kridoc.repoUrl, undefined, "a public page never links a private repository");
  assert.doesNotMatch(read("lib/products.ts"), /name: "/, "the name is data, never typed");
});

test("the org's status is read first: the waiver goes the day @krizaka/org lists Kridoc", () => {
  assert.deepEqual(
    ORG_PENDING.map((p) => p.id),
    ["kridoc"],
  );
  assert.ok(
    !org.products.some((p) => p.id === "kridoc"),
    "@krizaka/org now lists Kridoc: delete ORG_PENDING (lib/product-status.ts) and read the status from org.products",
  );
});

test("the products in design are gone, with their still", () => {
  for (const f of [
    "lib/products-in-design.ts",
    "app/components/home/ShowcaseStill.tsx",
    "app/components/home/still.css",
  ])
    assert.throws(() => read(f), /ENOENT/, f);
  for (const l of ["en", "fr"]) assert.equal(messages[l].site.home.products.inDesign, undefined, l);
});

test("Kridoc's one line says business documents and files storage and Law 25, never hosting, databases or a price", () => {
  for (const l of ["en", "fr"]) {
    const line = messages[l].site.products.cards.kridoc.line;
    assert.match(line, /Law 25|Loi 25/, l);
    assert.match(line, /documents/, l);
    assert.match(line, /files|fichiers/, l);
    const all = JSON.stringify([
      line,
      messages[l].site.home.products.notes.kridoc,
      messages[l].site.structuredData.family.kridoc,
    ]);
    assert.doesNotMatch(all, /hosting|hébergement|database|base de donn|\$|€|prix|price|gratuit|free/i, l);
  }
});

test("every surface PRODUCTS feeds carries Kridoc: nav, llms.txt, JSON-LD", () => {
  // The nav reads PRODUCTS whole (no list typed): Kridoc is in it with its public address.
  assert.match(read("lib/nav.ts"), /NAV_PRODUCTS: NavProduct\[\] = PRODUCTS\.map\(/);
  const line = productLines(PRODUCTS, about, (s) => s)
    .split("\n")
    .find((l) => l.startsWith("- Kridoc ("));
  assert.ok(line?.includes(`Site: ${kridoc.siteUrl}`) && !line.includes("source:"));
  // The Organization `owns` every FAMILY entry; Kridoc's node claims no source and no licence (its repository is private).
  const ld = read("lib/structured-data.ts");
  assert.match(ld, /id: "kridoc",\s*name: displayName\("kridoc"\),\s*url: siteUrlOf\("kridoc"\)/);
  assert.doesNotMatch(ld.slice(ld.indexOf('id: "kridoc"'), ld.indexOf('id: "krizaka-ui"')), /repo:/);
  assert.match(ld, /"repo" in f/);
  for (const l of ["en", "fr"]) assert.ok(messages[l].site.structuredData.family.kridoc, l);
});

test("Kridoc is a row of the home like the others: its mark is KridocLogo, no Source and no release notes", () => {
  const row = read("app/components/home/ProductShowcase.tsx");
  assert.match(row, /<ProductMark id=\{p\.id\} size=\{30\} \/>/);
  assert.match(read("app/components/ProductMark.tsx"), /id === "kridoc" \? \(\s*<KridocLogo/);
  assert.match(row, /\{p\.repoUrl && \(/);
  assert.match(row, /RELEASE_PRODUCT_IDS/);
});

test("left out on purpose: /story has no chapter, the changelog no chip, the mobile discovery no entry", () => {
  const story = read("lib/story.ts");
  assert.match(story, /NOT_IN_STORY[^=]*= \["kridoc"\]/);
  assert.match(read("lib/product-hosts.ts"), /RELEASE_PRODUCT_IDS = \["sovkora", "verikora", "folioviv"\]/);
  assert.doesNotMatch(read("lib/services.signed.json"), /kridoc/i, "the signed discovery document carries no Kridoc");
});
