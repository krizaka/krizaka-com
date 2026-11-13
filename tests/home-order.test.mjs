import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { productOrder } from "../lib/home-sections.ts";
const PRODUCTS = ["sovkora", "verikora", "folioviv", "kridoc"].map((id) => ({ id }));

const msg = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8"));

// Founder, 2026-11-06 (krizaka-internal#2714; was Verikora, Sovkora, Folioviv in #2450): the products in one row, Sovkora
// first, then Verikora, then Folioviv, then the rest as listed.
test("the products' row: Sovkora first, then Verikora, then Folioviv, then the rest as listed", () => {
  const ids = productOrder(PRODUCTS).map((p) => p.id);
  assert.deepEqual(ids, ["sovkora", "verikora", "folioviv", "kridoc"]);
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

test("Sovkora is a row like the products: its row, its status stamp, what it powers from the data, nothing folded", () => {
  const src = readFileSync(new URL("../app/components/home/ProductShowcase.tsx", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("function ProductRow"), src.indexOf("/** The marks of the products in conception"));
  assert.match(fn, /className=\{"kz-row brand-" \+ p\.id\}/, "the same row for all, in its brand");
  assert.match(fn, /data-engine=\{engine \? "" : undefined\}/, "the engine's row carries its rule");
  assert.doesNotMatch(src, /<details|EngineGives/, "nothing folded: the home reads in one pass");
  assert.match(src, /ENGINE_USES/, "what it powers is read from lib/engine-uses.ts");
  assert.match(
    readFileSync(new URL("../lib/story.ts", import.meta.url), "utf8"),
    /sovkora: "duck"/,
    "the duck builds: Sovkora's bird everywhere",
  );
  const css = readFileSync(new URL("../app/components/home/home.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.kz-foundation/);
  assert.doesNotMatch(
    css.slice(css.indexOf(".kz-rows")),
    /#[0-9a-f]{3,6}\b|glow|blur\(|radial-gradient/i,
    "tokens only",
  );
});
