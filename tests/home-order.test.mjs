import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { heroMarkOrder } from "../lib/home-sections.ts";
const PRODUCTS = ["orazaka", "yomizaka", "akinaza"].map((id) => ({ id }));

const msg = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8"));

// krizaka-internal#2445 (founder, 2026-11-05): the home serves the property manager, so the products lead in the order they go
// to market (2026-11-04: Verikora first, Folioviv is paused) and the engine follows them. Replaces the « honest chronology »
// of 2026-10-22 (#337), which /story still tells.
test("the marks under the hero: Verikora, Folioviv, then the engine, then the rest as listed", () => {
  const ids = heroMarkOrder(PRODUCTS).map((p) => p.id);
  assert.deepEqual(ids.slice(0, 3), ["yomizaka", "akinaza", "orazaka"]);
  assert.deepEqual(
    ids.slice(3),
    PRODUCTS.map((p) => p.id).filter((id) => !ids.slice(0, 3).includes(id)),
  );
  assert.equal(ids.length, PRODUCTS.length);
});

// krizaka-internal#2445: the hero speaks to the property manager, so its lead opens on Verikora and runs on Sovkora; the
// libraries leave it (they are under Docs) and the chronology is told on /story.
test("the hero lead opens on Verikora, in short sentences, no em dash, Sovkora « our engine »", () => {
  for (const l of ["en", "fr"]) {
    const { lead } = msg(l).site.home.hero;
    assert.match(lead, /^Verikora .*Sovkora/s, `${l}: Verikora first, on Sovkora`);
    assert.doesNotMatch(lead, /Krizaka UI|Krizaka Java/, `${l}: the libraries live under Docs`);
    assert.doesNotMatch(lead, /moteur d'IA|AI engine/, `${l}: the engine is « ours », the word AI is not the pitch`);
    assert.doesNotMatch(msg(l).site.home.engine.lead, /moteur d'IA|AI engine/, `${l}: § 2's lead`);
    assert.match(
      msg(l).site.home.products.title,
      /^(How Verikora|Comment Verikora)/,
      `${l}: § 2 is how Verikora checks`,
    );
    assert.match(msg(l).site.home.products.lead, /Folioviv/, `${l}: § 2's lead names the other tools after`);
    assert.doesNotMatch(lead, /[\u2014\u2013]/, l);
    assert.ok(lead.split(/[.]\s/).length <= 3, `${l}: two or three sentences`);
  }
});

test("§ 2 opens on how Verikora checks a file: three real steps, in both languages, before the entries", () => {
  const src = readFileSync(new URL("../app/components/home/ProductShowcase.tsx", import.meta.url), "utf8");
  assert.match(src, /const CHECK_STEPS = \["drop", "read", "report"\] as const;/);
  assert.ok(
    src.indexOf("CHECK_STEPS.map") < src.indexOf('<ol className="kz-prod-list"'),
    "the steps, then the entries",
  );
  assert.match(src, /href="#engine"/, "each product's card links to the engine's line");
  assert.doesNotMatch(src, /href="#product-orazaka"/, "the engine has no entry any more");
  assert.match(
    readFileSync(new URL("../lib/story.ts", import.meta.url), "utf8"),
    /orazaka: "duck"/,
    "the duck builds: the engine's bird everywhere",
  );
  for (const l of ["en", "fr"]) {
    const p = msg(l).site.home.products;
    assert.deepEqual(Object.keys(p.steps), ["drop", "read", "report"], l);
    for (const id of Object.keys(p.steps))
      assert.ok(p.steps[id].title.trim() && p.steps[id].body.trim(), `${l}: ${id}`);
    assert.match(p.steps.report.body, /page/, `${l}: every finding cites its page`);
    assert.doesNotMatch(JSON.stringify(p.steps), /[\u2014\u2013]/, l);
  }
});
