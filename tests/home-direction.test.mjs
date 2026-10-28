import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { KNOW_HOW, knowHowFacts } from "../lib/know-how.ts";
import { DIRECTION_STEPS, nowProducts } from "../lib/direction.ts";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const msg = (l) => JSON.parse(read(`messages/${l}.json`)).site;
const FORBIDDEN = /revolution|game-?chang|best-in-class|world-class|cutting-edge|state-of-the-art|unparalleled|seamless|next-gen|r[eé]volutionnaire|r[eé]volutionne|r[eé]volution|r[eé]f[eé]rence mondiale|de pointe|in[eé]gal[eé]|sans pr[eé]c[eé]dent|le meilleur|la meilleure|the best/i;
const figures = { components: 10, native: 4, maven: 27, repositories: 35, npm: 45, downloads: 100 };

test("every capability has its words in both languages, and a proof that opens", () => {
  for (const l of ["en", "fr"]) {
    const k = msg(l).home.knowhow;
    assert.deepEqual(Object.keys(k.items).sort(), KNOW_HOW.map((c) => c.id).sort(), l);
    for (const c of KNOW_HOW) {
      for (const key of ["title", "line", "cta"]) assert.ok(k.items[c.id][key].length > 3, `${l}: ${c.id}.${key}`);
      assert.match(c.href, /^(https:\/\/|\/open-source)/);
    }
  }
});

test("figures are read, never typed: no digit in the capability words, facts dropped when unread", () => {
  for (const l of ["en", "fr"]) {
    const k = msg(l).home;
    assert.doesNotMatch(JSON.stringify(k.knowhow.items).replace("Apache-2.0", ""), /\d/, `${l}: no digit in the capabilities' words`);
    assert.doesNotMatch(JSON.stringify(k.direction.steps), /\d/, `${l}: no digit in the direction`);
    for (const f of Object.values(k.knowhow.facts)) assert.match(f, /\{count\}/);
  }
  const zero = { components: 0, native: 0, maven: 0, repositories: 0, npm: 0 };
  for (const c of KNOW_HOW) assert.deepEqual(knowHowFacts(c.id, zero), [], c.id);
  assert.deepEqual(knowHowFacts("design", figures), [["components", 10], ["native", 4]]);
  assert.deepEqual(knowHowFacts("open", { ...figures, downloads: undefined }).map(([k]) => k), ["repositories", "npm"]);
  const src = read("app/components/home/KnowHow.tsx");
  assert.match(src, /knowHowFacts\(id, figures\)/, "the facts come from the figures read at build");
});

test("« now » is the products' statuses from lib/products.ts; the steps are now, next, later, without dates", () => {
  assert.deepEqual([...DIRECTION_STEPS], ["now", "next", "later"]);
  const ids = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name:/g)].map((m) => m[1]);
  const products = ids.map((id) => ({ id, name: id, status: "development" }));
  assert.deepEqual(nowProducts(products).map((p) => p.id), ids);
  assert.ok(ids.length >= 3);
  for (const l of ["en", "fr"]) {
    const d = msg(l).home.direction;
    assert.deepEqual(Object.keys(d.steps), ["now", "next", "later"], l);
    assert.match(d.steps.now.body, /\{names\}/);
    assert.doesNotMatch(JSON.stringify(d), /20\d\d|\b(Q[1-4]|janvier|january|demain|tomorrow)\b/i, `${l}: no date`);
  }
  assert.match(read("app/components/home/Direction.tsx"), /nowProducts\(PRODUCTS\)/);
});

test("the tone is restrained: no hype word in the new sections, in either language", () => {
  for (const l of ["en", "fr"]) {
    const h = msg(l).home;
    const text = JSON.stringify({ k: h.knowhow, d: h.direction });
    assert.doesNotMatch(text, FORBIDDEN, l);
    assert.doesNotMatch(text, /!/, `${l}: no exclamation`);
  }
  for (const sample of ["revolutionary", "game-changing", "best-in-class", "révolutionnaire"]) assert.match(sample, FORBIDDEN);
});

test("one primary action per section: no primary button in the two sections", () => {
  for (const f of ["KnowHow", "Direction"]) assert.doesNotMatch(read(`app/components/home/${f}.tsx`), /variant="primary"/, f);
});
