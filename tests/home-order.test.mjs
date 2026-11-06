import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { entrySide, productOrder } from "../lib/home-sections.ts";
const PRODUCTS = ["orazaka", "yomizaka", "akinaza", "kachizaka"].map((id) => ({ id }));

const msg = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8"));

// Founder, 2026-11-06 (krizaka-internal#2714; was Verikora, Sovkora, Folioviv in #2450): the products in one row, Sovkora
// first, then Verikora, then Folioviv, then the rest as listed; the sides alternate by position.
test("the products' row: Sovkora first, then Verikora, then Folioviv, then the rest as listed", () => {
  const ids = productOrder(PRODUCTS).map((p) => p.id);
  assert.deepEqual(ids, ["orazaka", "yomizaka", "akinaza", "kachizaka"]);
  const sides = ["orazaka", "yomizaka", "akinaza"].map((id) => entrySide(PRODUCTS, id));
  assert.deepEqual(
    sides,
    ["plate-left", "card-left", "plate-left"],
    "Sovkora's carousel left, Verikora's tag left, Folioviv's carousel left",
  );
});

// krizaka-internal#2445: the hero speaks to the property manager, so its lead opens on Verikora and runs on Sovkora; the
// libraries leave it (they are under Docs) and the chronology is told on /story.
test("the hero lead opens on Verikora, in short sentences, no em dash, Sovkora « our engine »", () => {
  for (const l of ["en", "fr"]) {
    const { lead } = msg(l).site.home.hero;
    assert.match(lead, /^Verikora .*Sovkora/s, `${l}: Verikora first, on Sovkora`);
    assert.doesNotMatch(lead, /Krizaka UI|Krizaka Java/, `${l}: the libraries live under Docs`);
    assert.doesNotMatch(lead, /moteur d'IA|AI engine/, `${l}: the engine is « ours », the word AI is not the pitch`);
    assert.match(
      msg(l).site.home.products.lead,
      /Sovkora.*Verikora.*Folioviv/s,
      `${l}: § 2's lead, in the row's order`,
    );
    assert.doesNotMatch(msg(l).site.home.products.lead, /moteur d'IA|AI engine/, `${l}: § 2's lead`);
    assert.doesNotMatch(lead, /[\u2014\u2013]/, l);
    assert.ok(lead.split(/[.]\s/).length <= 3, `${l}: two or three sentences`);
  }
});

test("Sovkora is an entry like the products: its specimen tag, its carousel as a numbered figure, the duck, what it gives folded in", () => {
  const src = readFileSync(new URL("../app/components/home/ProductShowcase.tsx", import.meta.url), "utf8");
  const fn = src.slice(
    src.indexOf("function ProductEntry"),
    src.indexOf("/** The marks of the products in conception"),
  );
  assert.match(fn, /<SpecimenTag className="kz-entry-tag" \{\.\.\.tagProps\(p, t, locale\)\}>/, "the same tag for all");
  assert.match(src, /code: code\(p\)/, "its catalogue number is KZ-01 (first of lib/products.ts)");
  assert.match(
    fn,
    /<Showcase carousel=\{carousel\} fig=\{sectionFigure\(nOf\(p\)\)\}/,
    "a numbered carousel, like the others",
  );
  assert.match(fn, /className=\{cn\("kz-entry", engine && "kz-entry-engine", "brand-" \+ p\.id\)\}/, "its brand light");
  const gives = src.slice(src.indexOf("function EngineGives"), src.indexOf("function ProductEntry"));
  assert.match(gives, /<details className="kz-entry-gives"/, "what it gives is folded in the tag");
  assert.match(fn, /<Bird bird=\{PRODUCT_BIRD\[p\.id\]\}/, "its mascot, the data's");
  assert.match(gives, /ENGINE_USES/, "what it powers is read from lib/engine-uses.ts");
  assert.doesNotMatch(gives, /webhook|run events|SSE/i, "only what runs is said (orazaka#189)");
  assert.match(
    readFileSync(new URL("../lib/story.ts", import.meta.url), "utf8"),
    /orazaka: "duck"/,
    "the duck builds: Orazaka's bird everywhere",
  );
  const css = readFileSync(new URL("../app/components/home/home.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.kz-foundation/);
  assert.doesNotMatch(
    css.slice(css.indexOf(".kz-entry-gives")),
    /#[0-9a-f]{3,6}\b|glow|blur\(|radial-gradient/i,
    "tokens only",
  );
  for (const l of ["en", "fr"]) {
    const e = msg(l).site.home.engine;
    assert.deepEqual(Object.keys(e.gives), ["models", "pipeline", "packs", "analytics"], l);
    assert.doesNotMatch(JSON.stringify(e), /[\u2014\u2013]/, l);
  }
});
