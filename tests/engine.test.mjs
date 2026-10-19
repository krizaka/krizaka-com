import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Orazaka is the engine every product's AI runs on (2026-10-16): the home and /products show it as the foundation (a
// wide card, CardGrid `foundation`) with the other products as the cards it powers; /story's engine stage shows the
// same card. What each product uses it for is honest: a use not wired to a real Studio says "planned".
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };
const uses = [...read("lib/engine-uses.ts").matchAll(/\{ id: "(\w+)", back: \[([^\]]*)\](, planned: true)? \}/g)].map((m) => ({
  id: m[1],
  back: [...m[2].matchAll(/"(\w+)"/g)].map((b) => b[1]),
  planned: Boolean(m[3]),
}));

test("every use names a product of lib/products.ts, never the engine itself, and has words in both languages", () => {
  const products = read("lib/products.ts");
  assert.ok(uses.length >= 5);
  for (const u of uses) {
    assert.match(products, new RegExp(`id: "${u.id}"`), `${u.id} is a product`);
    assert.notEqual(u.id, "orazaka");
    for (const l of ["en", "fr"]) assert.ok(messages[l].site.products.engine.uses[u.id], `${l}: uses.${u.id}`);
  }
  for (const l of ["en", "fr"]) assert.deepEqual(Object.keys(messages[l].site.products.engine.uses).sort(), uses.map((u) => u.id).sort());
});

test("a planned use is said planned: the products not wired yet are flagged, the wired ones are not", () => {
  assert.deepEqual(uses.filter((u) => u.planned).map((u) => u.id).sort(), ["akinaza", "yasakia", "yororis"]);
  const home = read("app/components/home/ProductShowcase.tsx");
  assert.match(home, /use\?\.planned \? t\.site\.home\.products\.enginePlanned : t\.site\.home\.products\.engineUse/);
  for (const l of ["en", "fr"]) {
    const p = messages[l].site.home.products;
    assert.match(p.engineUse, /\{use\}/);
    assert.match(p.enginePlanned, /\{use\}/);
    assert.notEqual(p.engineUse, p.enginePlanned, `${l}: a planned use reads differently`);
  }
  const card = read("app/components/ProductCard.tsx");
  assert.match(card, /e\.planned/);
  assert.match(card, /tone: "wip"/);
});

test("the home wears the engine as the foundation (CardGrid foundation, its own wide GlowCard); /story's engine stage shows the engine card", () => {
  const home = read("app/components/home/ProductShowcase.tsx");
  assert.match(home, /foundation=\{<EngineCard /);
  assert.match(home, /foundationLabel=\{t\.site\.products\.engine\.label\}/);
  assert.match(home, /PRODUCTS\.filter\(\(p\) => p\.id !== ENGINE\)/, "the engine is the foundation, never a card among the others");
  assert.match(read("app/[locale]/page.tsx"), /<ProductShowcase\b/);
  assert.match(read("app/[locale]/story/page.tsx"), /engine: <EngineCard/);
});

// The flow is two-way (2026-10-17): products -> Orazaka (requests, documents, prompts), Orazaka -> products (results,
// analytics). Only what runs is claimed: run events / signed webhooks are orazaka#189 (open) and are not drawn nor said.
test("the diagram shows both directions, from data, claiming only what runs", () => {
  assert.ok(uses.every((u) => u.back.length > 0 && u.back.includes("results")), "every product gets results back");
  for (const u of uses) for (const b of u.back) assert.ok(["results", "analytics"].includes(b), `${u.id}: '${b}' is not live (events/webhooks are orazaka#189)`);
  assert.deepEqual(uses.filter((u) => u.back.includes("analytics")).map((u) => u.id), ["orochia"], "analytics back: only Orochia reads it (ADR-081)");
  const flow = read("app/components/EngineFlow.tsx");
  assert.match(flow, /data-lane="out"/);
  assert.match(flow, /data-lane="back"/);
  assert.match(flow, /aria-hidden/);
  assert.match(flow, /data-motion-scope/, "off-screen pause comes from @krizaka/ui's motion system");
  assert.match(flow, /u\.planned/, "a planned use is drawn still and dim");
  assert.doesNotMatch(flow, /requestAnimationFrame|<canvas/);
  assert.match(read("app/components/ProductCard.tsx"), /<EngineFlow/);
  const css = read("app/globals.css");
  assert.match(css, /\.engine-flow/);
  assert.match(css, /prefers-reduced-motion: no-preference[^}]*\{[^]*engine-flow-dots/, "motion only when allowed; reduced motion keeps static arrows");
});

test("the text version and the legend are messages in both languages, with no hand-written direction", () => {
  for (const l of ["en", "fr"]) {
    const e = messages[l].site.products.engine;
    for (const k of ["legendOut", "legendBack", "sends", "gets"]) assert.ok(e[k], `${l}: engine.${k}`);
    assert.deepEqual(Object.keys(e.back).sort(), ["analytics", "results"]);
  }
  assert.match(read("app/components/ProductCard.tsx"), /e\.sends/);
  assert.match(read("app/components/ProductCard.tsx"), /e\.gets/);
});
