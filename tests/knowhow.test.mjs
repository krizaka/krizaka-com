import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STORY_PRODUCT_IDS } from "./helpers/source.mjs";

// Krizaka's story is its know-how (2026-10-14): each product proves one thing the studio knows how to do. The home,
// /open-source and /story are cut that way; a product added to lib/products.ts must say what it proves.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`)).site;
const ids = STORY_PRODUCT_IDS();

test("every product of lib/products.ts proves a know-how, in both languages", () => {
  assert.ok(ids.length >= 3, ids.join());
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
  assert.match(k.sovkora.name, /engine/i);
});

test("the home and /story render the products from PRODUCTS: the home's rows, /story's chapters", () => {
  const story = read("app/[locale]/story/page.tsx");
  assert.match(story, /h\.knowhow\[id\]/);
  assert.match(story, /href=\{p\.siteUrl\}/);
  assert.match(story, /href=\{p\.repoUrl\}/);
  assert.match(story, /PRODUCT_CHAPTERS/);
  const home = read("app/components/home/ProductShowcase.tsx");
  // 2026-10-20 (home redesign, « one label instead of three »): on the home the know-how is SHOWN, not said again as a mono
  // eyebrow beside the status; since krizaka-internal#3243 the home has no carousel: a row says it in one line.
  assert.doesNotMatch(home, /h\.knowhow/, "one label per row on the home: the status");
  assert.doesNotMatch(home, /<Showcase\b/, "no carousel on the home");
  assert.match(home, /href=\{p\.repoUrl\}/);
  assert.doesNotMatch(story, /ProfileCard|StatGauge|ChoiceGrid/, "/story draws no tile of its own");
  const os = read("app/[locale]/docs/page.tsx");
  assert.doesNotMatch(
    os,
    /id="repositories"/,
    "the repositories table is gone (2026-10-30, #487): GitHub is the source",
  );
  assert.doesNotMatch(
    os,
    /id="runs-on"/,
    "no table of what each product runs on: the products are operated, not open source",
  );
});

test("a product card's one line is the canonical line: 110 characters at most (réunion 6, 2026-11-05), in both languages", () => {
  for (const lang of ["en", "fr"]) {
    for (const [id, c] of Object.entries(messages(lang).products.cards))
      assert.ok(c.line.length <= 110, `${lang}: products.cards.${id}.line (${c.line.length})`);
  }
});

test("/story keeps its founder's facts and its chapters come from PRODUCTS (the roster is the rest of them)", () => {
  for (const lang of ["en", "fr"]) {
    const who = messages(lang).story.who;
    // The founder is not named (réunion 6, 2026-11-05): « fondée à Montréal »; no studies, lab, year or personal detail.
    assert.deepEqual(who.places, ["Montréal"]);
    const text = [who.lead, who.refusal].join(" ");
    assert.doesNotMatch(text, /Oussama|Abid/, `${lang}: the founder is not named`);
    assert.match(text, /Montréal/);
    assert.doesNotMatch(
      text,
      /20\d\d|19\d\d|laborato|research lab|étudi|studied|mathémat|mathemat|cognit|—/i,
      `${lang}: no study, lab or year`,
    );
    assert.equal(who.fold, undefined, "no founder fold");
    const all = JSON.stringify(who);
    assert.doesNotMatch(
      all,
      /Oujda|Grenoble|Maroc|Morocco|Java and Spring|Java et Spring|linkedin/i,
      `${lang}: no former city, no title, no LinkedIn`,
    );
    assert.doesNotMatch(
      all,
      /RBC|TD Bank|BMO|Scotiabank|CIBC|Banque Nationale|National Bank|Desjardins/,
      `${lang}: places precise, employer never named`,
    );
  }
  const story = read("lib/story.ts");
  assert.match(story, /PROVES_FIRST[^=]*= \["verikora"\]/);
  assert.match(story, /ROSTER[^=]*= PRODUCTS\.map/);
  assert.match(story, /PRODUCT_CHAPTERS[^=]*= \[\.\.\.PROVES_FIRST, \.\.\.ROSTER\]/);
});
