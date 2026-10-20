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
  const story = read("app/[locale]/story/page.tsx");
  assert.match(story, /use\.planned \? t\.site\.home\.products\.enginePlanned : t\.site\.home\.products\.engineUse/);
  assert.match(story, /u\.planned \? ` \(\$\{e\.planned\}\)` : ""/);
});

test("the home wears the engine as the foundation (CardGrid foundation, its own wide GlowCard); /story's engine chapter draws the engine and its uses", () => {
  const home = read("app/components/home/ProductShowcase.tsx");
  assert.match(home, /foundation=\{<EngineCard /);
  assert.match(home, /foundationLabel=\{t\.site\.products\.engine\.label\}/);
  assert.match(home, /PRODUCTS\.filter\(\(p\) => p\.id !== ENGINE\)/, "the engine is the foundation, never a card among the others");
  assert.match(read("app/[locale]/page.tsx"), /<ProductShowcase\b/);
  assert.match(read("app/[locale]/story/page.tsx"), /<EngineMap /);
});

// The flow is two-way (2026-10-17): products -> Orazaka (requests, documents, prompts), Orazaka -> products (results,
// analytics). Only what runs is claimed: run events / signed webhooks are orazaka#189 (open) and are not drawn nor said.
test("the diagram shows both directions, from data, claiming only what runs", () => {
  assert.ok(uses.every((u) => u.back.length > 0 && u.back.includes("results")), "every product gets results back");
  for (const u of uses) for (const b of u.back) assert.ok(["results", "analytics"].includes(b), `${u.id}: '${b}' is not live (events/webhooks are orazaka#189)`);
  assert.deepEqual(uses.filter((u) => u.back.includes("analytics")).map((u) => u.id), ["orochia"], "analytics back: only Orochia reads it (ADR-081)");
  // /story's engine chapter (a clean static drawing until @krizaka/ui's EngineFlow is released): one connector per product,
  // solid where wired, dashed and dim where planned, nothing animated, a name for assistive technology.
  const map = read("app/components/story/EngineMap.tsx");
  assert.match(map, /ENGINE_USES\.map/, "drawn from data");
  assert.match(map, /data-planned=\{u\.planned \? "" : undefined\}/, "a planned use is drawn dashed and dim");
  assert.match(map, /role="img"/);
  assert.doesNotMatch(map, /requestAnimationFrame|<canvas|animation/);
  const css = read("app/[locale]/story/story.css");
  assert.match(css, /\.em-line\[data-planned\][^}]*stroke-dasharray/);
  assert.match(css, /@media \(max-width: 559px\)[^]*\.em-lines \{ display: none; \}/, "a phone gets the grid above the engine, no crossing lines");
});

test("the engine's connectors never reach a mark and never cross a name: placed on an ellipse, trimmed at both ends", async () => {
  const { placeNodes } = await import("../lib/engine-map.ts");
  const nodes = placeNodes(6);
  assert.equal(nodes.length, 6);
  assert.deepEqual(nodes.map((n) => n.side), ["top", "top", "bottom", "bottom", "bottom", "top"]);
  for (const n of nodes) {
    const [x1, y1, x2, y2] = n.line;
    assert.ok(Math.hypot(x2 - 50, y2 - 32) > Math.hypot(x1 - 50, y1 - 32), "the line runs outwards from the hub");
    assert.ok(Math.hypot(n.x - x2, n.y - y2) >= 4, "it stops short of the node's mark");
    assert.ok(Math.hypot(x1 - 50, y1 - 32) >= 9 - 1e-9, "and starts outside the hub");
  }
});

test("the text version of the drawing is a list of messages in both languages, with no hand-written direction", () => {
  for (const l of ["en", "fr"]) {
    const e = messages[l].site.products.engine;
    for (const k of ["sends", "gets"]) assert.ok(e[k], `${l}: engine.${k}`);
    assert.deepEqual(Object.keys(e.back).sort(), ["analytics", "results"]);
    for (const k of ["mapLabel", "mapNote", "wired", "more"]) assert.ok(messages[l].site.story.engine[k], `${l}: story.engine.${k}`);
  }
  const page = read("app/[locale]/story/page.tsx");
  assert.match(page, /e\.sends/);
  assert.match(page, /e\.gets/);
  assert.match(page, /e\.planned/, "a planned use is said planned in the list too");
});
