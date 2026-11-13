import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { assertStatuses, readProductStatuses } from "../scripts/dev-preview-lib.mjs";
import { IN_DESIGN } from "../lib/products-in-design.ts";

// A product in conception (founder, 2026-11-03, krizaka-internal#2143): Kridoc is named on the home with its mark, one line
// and the stamp « In design » — nothing that is not built: no version, no source, no bird, no note. Since 2026-11-03
// (krizaka-internal#2302) it also links its live coming-soon site, and since 2026-11-06 (krizaka-internal#2802) its plate is a
// mood photo in the carousels' frame, not a mock app window. It stays out of PRODUCTS, so out of the nav, the hero's marks,
// the sitemap, llms.txt and the JSON-LD.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const showcase = read("app/components/home/ProductShowcase.tsx");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };

test("Kridoc is in design, named by @krizaka/org, never by its code name", () => {
  assert.deepEqual(
    IN_DESIGN.map((p) => [p.id, p.name, p.status]),
    [["kridoc", "Kridoc", "design"]],
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

test("a product in design links its live coming-soon site and shows its still, nothing else that is not built", () => {
  const start = showcase.indexOf("function DesignEntry");
  const entry = showcase.slice(start, showcase.indexOf("/** The products (§ 2)"));
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
  // Its plate is the still, numbered after the products' carousels.
  assert.match(
    entry,
    /<ShowcaseStill product=\{p\.id\} fig=\{sectionFigure\(SHOWN\.length \+ 1\)\} locale=\{locale\} \/>/,
  );
});

test("no mock plate is left: no drawn app window, no « Demo soon », no sample document, in code, styles or words", () => {
  assert.doesNotMatch(showcase, /DesignPlate|kz-doc-|demoSoon|docTitle|docMeta|<Badge/);
  assert.doesNotMatch(read("app/components/home/home.css"), /kz-doc-/);
  for (const l of ["en", "fr"]) {
    const products = messages[l].site.home.products;
    assert.equal(products.inDesign.plate, undefined, `${l}: inDesign.plate`);
    assert.equal(products.figureLabel, undefined, `${l}: figureLabel (the plate's caption)`);
  }
});

test("the still's words say the product is in conception, claim nothing that runs, and say the picture is generated", () => {
  for (const l of ["en", "fr"]) {
    for (const p of IN_DESIGN) {
      const still = messages[l].site.home.showcase.stills[p.id];
      assert.ok(still, `${l}: ${p.id}`);
      assert.match(still.caption, new RegExp(`^${p.name} `), `${l}: the caption names the product`);
      assert.match(still.caption, /en conception|being designed/, `${l}: the caption says it is in conception`);
      assert.match(still.alt, /générée|generated/, `${l}: the alt says the photo is generated`);
      assert.ok(still.alt.length > 60, `${l}: the alt says what it shows`);
      assert.doesNotMatch(
        still.caption + still.alt,
        /\d{4}|beta|bêta|demo|démo|waiting list|liste d'attente|sign up|inscri|early access|disponible|available|essayez|try /i,
        `${l}: no date, no demo, no sign-up, no claim that it runs`,
      );
    }
  }
});

test("the site of a product in design is its commercial www address, never a code-name host", () => {
  for (const p of IN_DESIGN) {
    assert.equal(p.siteUrl, "https://www.kridoc.com");
    assert.doesNotMatch(p.siteUrl, /dev\./);
  }
});

test("a product in design stays out of PRODUCTS, the hero, the nav, the sitemap, llms and the JSON-LD", () => {
  assert.ok(!Object.keys(readProductStatuses()).includes("kridoc"));
  const users = ["app", "lib"]
    .flatMap((d) => readdirSync(new URL(`../${d}/`, import.meta.url), { recursive: true }).map((f) => `${d}/${f}`))
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => /from "[^"]*products-in-design"/.test(read(f)));
  // The home's #products, and /story's « what is next », which says where every product stands (founder, 2026-11-06,
  // krizaka-internal#2648): its name, its status and its line, nothing more.
  assert.deepEqual(users.sort(), ["app/[locale]/story/page.tsx", "app/components/home/ProductShowcase.tsx"]);
  for (const f of ["content/llms.txt", "content/llms-full.txt"]) assert.doesNotMatch(read(f), /kridoc/i, f);
});

test("the design status is never gated by the dev-preview checklists", () => {
  assert.deepEqual(assertStatuses({ kridoc: "design" }, {}, { today: "2026-11-03" }), []);
});
