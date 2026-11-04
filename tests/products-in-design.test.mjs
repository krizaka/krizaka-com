import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { assertStatuses, readProductStatuses } from "../scripts/dev-preview-lib.mjs";
import { IN_DESIGN } from "../lib/products-in-design.ts";

// A product in conception (founder, 2026-11-03, krizaka-internal#2143): Kridoc is named on the home with its mark, one line
// and the stamp « In design » — nothing that is not built: no version, no source, no bird, no note. Since 2026-11-03
// (krizaka-internal#2302) it also links its live coming-soon site and shows a « Demo soon » plate (a sample document in demo
// data). It stays out of PRODUCTS, so out of the nav, the hero's marks, the sitemap, llms.txt and the JSON-LD.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const showcase = read("app/components/home/ProductShowcase.tsx");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };

test("Kridoc is in design, named by @krizaka/org, never by its code name", () => {
  assert.deepEqual(
    IN_DESIGN.map((p) => [p.id, p.name, p.status]),
    [["kachizaka", "Kridoc", "design"]],
  );
  assert.doesNotMatch(read("lib/products-in-design.ts"), /name: "/, "the name is data, never typed");
});

test("the status has its words in both languages, and its stamp", () => {
  assert.equal(messages.en.site.nav.status.design.label, "In design");
  assert.equal(messages.fr.site.nav.status.design.label, "En conception");
  assert.match(showcase, /design: "neutral"/);
  for (const l of ["en", "fr"])
    for (const p of IN_DESIGN) {
      const line = messages[l].site.home.products.inDesign.lines[p.id];
      assert.ok(line, `${l}: ${p.id}`);
      assert.doesNotMatch(
        line,
        /beta|bêta|early access|accès anticipé|waiting list|liste d'attente|sign up|inscri/i,
        l,
      );
      assert.ok(line.length <= 100, `${l}: one short line`);
    }
});

test("a product in design links its live coming-soon site and shows a « Demo soon » plate, nothing else that is not built", () => {
  const start = showcase.indexOf("function DesignPlate");
  const entry = showcase.slice(start, showcase.indexOf("/** « Orazaka, our first build »"));
  assert.ok(start > 0 && entry.length > 0);
  // Not built: no version, no source, no bird, no note, no fields, no run, no sign-up.
  for (const absent of [
    "fields=",
    "devVersion",
    "ProductVisual",
    "Bird",
    "FootnoteRef",
    "repoUrl",
    "signup",
    "waiting",
  ])
    assert.ok(!entry.includes(absent), absent);
  // The one link is its site (« See the site »), from the data.
  assert.match(entry, /href=\{p\.siteUrl\}/);
  assert.match(entry, /h\.visitSite/);
  assert.match(entry, /status=\{\{ label: t\.site\.nav\.status\[p\.status\]\.label, tone: STAMP\[p\.status\] \}\}/);
  // The plate says « Demo soon » (a chip), from the messages.
  assert.match(entry, /v\.demoSoon/);
});

test("the site of a product in design is its commercial www address, never a code-name host", () => {
  for (const p of IN_DESIGN) {
    assert.equal(p.siteUrl, "https://www.kridoc.com");
    assert.doesNotMatch(p.siteUrl, /kachizaka|dev\./);
  }
});

test("the plate's words exist in both languages, say demo, and promise no date or sign-up", () => {
  assert.equal(messages.en.site.home.products.inDesign.plate.demoSoon, "Demo soon");
  assert.equal(messages.fr.site.home.products.inDesign.plate.demoSoon, "Démo bientôt");
  for (const l of ["en", "fr"]) {
    const plate = messages[l].site.home.products.inDesign.plate;
    assert.match(plate.docMeta + plate.figure, /demo|démo/i, l);
    assert.doesNotMatch(
      JSON.stringify(plate),
      /\d{4}|beta|bêta|waiting list|liste d'attente|sign up|inscri|early access/i,
      l,
    );
  }
});

test("a product in design stays out of PRODUCTS, the hero, the nav, the sitemap, llms and the JSON-LD", () => {
  assert.ok(!Object.keys(readProductStatuses(read("lib/products.ts"))).includes("kachizaka"));
  const users = ["app", "lib"]
    .flatMap((d) => readdirSync(new URL(`../${d}/`, import.meta.url), { recursive: true }).map((f) => `${d}/${f}`))
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => /from "[^"]*products-in-design"/.test(read(f)));
  assert.deepEqual(users.sort(), ["app/components/home/ProductShowcase.tsx"]);
  for (const f of ["content/llms.txt", "content/llms-full.txt"]) assert.doesNotMatch(read(f), /kridoc/i, f);
});

test("the design status is never gated by the dev-preview checklists", () => {
  assert.deepEqual(assertStatuses({ kachizaka: "design" }, {}, { today: "2026-11-03" }), []);
});
