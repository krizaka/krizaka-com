import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Krizaka's story is its know-how (2026-10-14): each product proves one thing the studio knows how to do. The home,
// /open-source and /story are cut that way; a product added to lib/products.ts must say what it proves.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`)).site;
const ids = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name:/g)].map((m) => m[1]);

test("every product of lib/products.ts proves a know-how, in both languages", () => {
  assert.ok(ids.length >= 4, ids.join());
  for (const lang of ["en", "fr"]) {
    const k = messages(lang).products.knowhow;
    assert.deepEqual(Object.keys(k).sort(), [...ids].sort(), `${lang}: site.products.knowhow`);
    for (const id of ids) {
      assert.ok(k[id].name.length > 3 && k[id].proof.length > 40, `${lang}: ${id}`);
      assert.match(messages(lang).products.proofBy, /\{name\}/);
    }
  }
});

test("the known know-hows are the ones Oussama named", () => {
  const k = messages("en").products.knowhow;
  assert.match(k.orazaka.name, /engine/i);
  assert.match(k.orochia.name, /media/i);
  assert.match(k.yasakia.name, /introductions/i);
  assert.match(k.yororis.name, /voice/i);
});

test("the home and /story render the products from PRODUCTS: the home's rows, /story's chapters", () => {
  const story = read("app/[locale]/story/page.tsx");
  assert.match(story, /h\.knowhow\[id\]/);
  assert.match(story, /href=\{p\.siteUrl\}/);
  assert.match(story, /href=\{p\.repoUrl\}/);
  assert.match(story, /PRODUCT_CHAPTERS/);
  const home = read("app/components/home/ProductShowcase.tsx");
  // 2026-10-20 (home redesign, « one label instead of three »): on the home the know-how is SHOWN by each row's live
  // visual, not said again as a mono eyebrow beside the status; /story's chapters keep naming it (above).
  assert.doesNotMatch(home, /h\.knowhow/, "one label per row on the home: the status");
  assert.match(home, /<ProductVisual id=\{p\.id\} \/>/, "the know-how is shown by the row's visual");
  assert.match(home, /href=\{p\.repoUrl\}/);
  assert.doesNotMatch(story, /ProfileCard|StatGauge|ChoiceGrid/, "/story draws no tile of its own");
  const os = read("app/[locale]/open-source/page.tsx");
  assert.match(os, /id="repositories"/, "every repository, by product");
  assert.match(os, /id="runs-on"/, "the runs-on table stays (folded)");
});

test("a product card's one line is a hook: 90 characters at most, in both languages", () => {
  for (const lang of ["en", "fr"]) {
    for (const [id, c] of Object.entries(messages(lang).products.cards)) assert.ok(c.line.length <= 90, `${lang}: products.cards.${id}.line (${c.line.length})`);
  }
});

test("/story keeps its founder's facts and its chapters come from PRODUCTS (the roster is the rest of them)", () => {
  for (const lang of ["en", "fr"]) {
    const who = messages(lang).story.who;
    // The founder's path is sourced (his own profile, shared 2026-10-16; ~/Documents/krizaka/00_FONDATEUR/parcours-oussama.md,
    // the same facts as blog.krizaka.com/about): Montréal since 2018, the education in his own words; no former city, no LinkedIn.
    assert.deepEqual(who.places, ["Montréal"]);
    assert.match(who.lead, /2018/, `${lang}: since 2018`);
    assert.match(who.fold[0], /2018/, `${lang}: since 2018`);
    assert.match(who.fold[0], /2011/, `${lang}: the 2011 research internship`);
    const all = JSON.stringify(who);
    assert.doesNotMatch(all, /Oujda|Grenoble|Maroc|Morocco|Java and Spring|Java et Spring|linkedin/i, `${lang}: no former city, no title, no LinkedIn`);
    assert.doesNotMatch(all, /RBC|TD Bank|BMO|Scotiabank|CIBC|Banque Nationale|National Bank|Desjardins/, `${lang}: places precise, employer never named`);
  }
  const story = read("lib/story.ts");
  assert.match(story, /PROVES_FIRST[^=]*= \["yomizaka", "orochia"\]/);
  assert.match(story, /ROSTER[^=]*= PRODUCTS\.map/);
  assert.match(story, /PRODUCT_CHAPTERS[^=]*= \[\.\.\.PROVES_FIRST, \.\.\.ROSTER\]/);
});

test("Orochia's know-how is worded neutrally", () => {
  const pitch = /creator|créat|payout|paid|payé|payment|paiement|\btips?\b|pourboire|90 ?%|adult|adulte|18\+/i;
  for (const lang of ["en", "fr"]) assert.doesNotMatch(JSON.stringify(messages(lang).products.knowhow.orochia), pitch, lang);
});
