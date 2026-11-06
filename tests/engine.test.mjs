import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// Orazaka is the engine every product's AI runs on (2026-10-16): the home and /products show it as the foundation (a
// wide card, CardGrid `foundation`) with the other products as the cards it powers; /story's engine stage shows the
// same card. What each product uses it for is honest: a use not wired to a real Studio says "planned".
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };
const uses = [...read("lib/engine-uses.ts").matchAll(/\{ id: "(\w+)", back: \[([^\]]*)\](, planned: true)? \}/g)].map(
  (m) => ({
    id: m[1],
    back: [...m[2].matchAll(/"(\w+)"/g)].map((b) => b[1]),
    planned: Boolean(m[3]),
  }),
);

test("every use names a product of lib/products.ts, never the engine itself, and has words in both languages", () => {
  const products = read("lib/products.ts");
  assert.ok(uses.length >= 2);
  for (const u of uses) {
    assert.match(products, new RegExp(`id: "${u.id}"`), `${u.id} is a product`);
    assert.notEqual(u.id, "orazaka");
    for (const l of ["en", "fr"]) assert.ok(messages[l].site.products.engine.uses[u.id], `${l}: uses.${u.id}`);
  }
  for (const l of ["en", "fr"])
    assert.deepEqual(Object.keys(messages[l].site.products.engine.uses).sort(), uses.map((u) => u.id).sort());
});

test("a planned use is said planned: the products not wired yet are flagged, the wired ones are not", () => {
  assert.deepEqual(
    uses
      .filter((u) => u.planned)
      .map((u) => u.id)
      .sort(),
    ["akinaza"],
  );
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

// 2026-11-05 (founder, krizaka-internal#2450; supersedes the 2026-10-20 engine-first layout), order of 2026-11-06 (#2714): the
// products stand in one row, Sovkora · Verikora · Folioviv, each entry a specimen tag beside its carousel; the engine's tag
// folds what it gives and the products it powers. No frame around the products and no box in a box. /story keeps the engine's flow.
test("the products stand in one row, the engine first — no foundation frame, no card in a card", async () => {
  const home = read("app/components/home/ProductShowcase.tsx");
  const { PRODUCT_ORDER, productOrder } = await import("../lib/home-sections.ts");
  assert.deepEqual(PRODUCT_ORDER, ["orazaka", "yomizaka", "akinaza"], "Sovkora, Verikora, Folioviv");
  assert.deepEqual(
    productOrder([{ id: "akinaza" }, { id: "yomizaka" }, { id: "orazaka" }]).map((p) => p.id),
    ["orazaka", "yomizaka", "akinaza"],
  );
  assert.match(home, /const SHOWN = productOrder\(PRODUCTS\);/);
  assert.match(home, /<ol className="kz-prod-row"/, "the row of the three, each to its entry");
  assert.match(home, /\{engine && <EngineGives t=\{t\} \/>\}/, "the engine's tag folds what it gives");
  assert.doesNotMatch(
    home,
    /foundation=|CardGrid|GlowCard|<EngineEntry|EngineSection/,
    "the frame and the boxes are gone",
  );
  const page = read("app/[locale]/page.tsx");
  const at = (x) => page.indexOf(x);
  assert.ok(
    at("<HomeHero") < at("<ProductShowcase") && at("<ProductShowcase") < at("<Principles"),
    "hero, products, then the rest",
  );
  assert.doesNotMatch(page, /EngineSection/);
  assert.match(read("app/[locale]/story/page.tsx"), /<EngineFlowView t=\{t\} \/>/, "/story draws the engine's flow");
  const css = read("app/components/home/home.css");
  assert.doesNotMatch(css, /\.kz-foundation/, "the engine wears the products' tag, not a foundation plate");
  assert.match(
    read("lib/products.ts"),
    /id: "orazaka",\s+name: displayName\("orazaka"\),\s+status: "development"/,
    "Orazaka is in development too: its tag stamps it so, like the others",
  );
  assert.match(home, /status: \{ label: t\.site\.nav\.status\[p\.status\]\.label, tone: STAMP\[p\.status\] \}/);
});

test("each product's entry links to the engine, and the engine's tag to each product, from the data", () => {
  const home = read("app/components/home/ProductShowcase.tsx");
  assert.match(home, /data-product=\{p\.id\}/);
  assert.match(home, /href=\{`#product-\$\{ENGINE\}`\}/, "each product's tag links back to the engine");
  assert.match(home, /href=\{`#product-\$\{x\.id\}`\}/, "the engine's tag links each product it powers");
  assert.match(home, /ENGINE_USES/, "what it powers is read from lib/engine-uses.ts");
});

// The flow is two-way (2026-10-17): products -> Orazaka (requests, documents, prompts), Orazaka -> products (results,
// analytics). Only what runs is claimed: run events / signed webhooks are orazaka#189 (open) and are not drawn nor said.
test("the diagram shows both directions, from data, claiming only what runs", () => {
  assert.ok(
    uses.every((u) => u.back.length > 0 && u.back.includes("results")),
    "every product gets results back",
  );
  for (const u of uses)
    for (const b of u.back)
      assert.ok(["results", "analytics"].includes(b), `${u.id}: '${b}' is not live (events/webhooks are orazaka#189)`);
  assert.deepEqual(
    uses.filter((u) => u.back.includes("analytics")).map((u) => u.id),
    [],
    "analytics back: no product presented reads it yet (ADR-081)",
  );
  // /story's engine chapter is the home's EngineFlowView (@krizaka/ui/engine-flow): the static stand-in is gone.
  assert.ok(!existsSync(new URL("../app/components/story/EngineMap.tsx", import.meta.url)), "EngineMap came back");
  assert.ok(!existsSync(new URL("../lib/engine-map.ts", import.meta.url)), "lib/engine-map.ts came back");
  assert.doesNotMatch(
    read("app/[locale]/story/story.css"),
    /\.em-(line|lines|node|hub|box)\b/,
    "the stand-in's styles are gone",
  );
});

test("the text version of the drawing is a list of messages in both languages, with no hand-written direction", () => {
  for (const l of ["en", "fr"]) {
    const e = messages[l].site.products.engine;
    for (const k of ["sends", "gets"]) assert.ok(e[k], `${l}: engine.${k}`);
    assert.deepEqual(Object.keys(e.back).sort(), ["analytics", "results"]);
    for (const k of ["more"]) assert.ok(messages[l].site.story.engine[k], `${l}: story.engine.${k}`);
  }
  const page = read("app/[locale]/story/page.tsx");
  assert.match(page, /e\.sends/);
  assert.match(page, /e\.gets/);
  assert.match(page, /e\.planned/, "a planned use is said planned in the list too");
});

// The engine section uses @krizaka/ui's EngineFlow (2026-10-20, the coordinator's decisions): radial on desktop and
// tablet, top to bottom on a phone, both ways only where it runs, planned products dim and still, photons, S-shaped
// Bézier conduits, no settings for visitors, a node says what it uses Orazaka for with a link to its site.
test("the home's engine card draws @krizaka/ui's EngineFlow from the data, with no settings for visitors", () => {
  const view = read("app/components/home/EngineFlowView.tsx");
  assert.match(
    view,
    /from "@krizaka\/ui\/engine-flow"/,
    "the one motion system: the primitive of Krizaka UI, never a copy",
  );
  assert.match(view, /layout="radial"/);
  assert.match(view, /compactLayout="top-to-bottom"/);
  assert.match(view, /particles="photons"/);
  assert.match(view, /conduit="bezier"/);
  assert.match(view, /ENGINE_USES\.map/);
  assert.match(
    view,
    /flow: u\.planned \? "in" : u\.back\.length > 0 \? "both" : "in"/,
    "both ways only where results come back",
  );
  assert.match(view, /planned: u\.planned/);
  assert.match(view, /href: p\.siteUrl/);
  assert.doesNotMatch(view, /Chip|Slider|Switch|useState/, "the lab's parameters panel is not a home feature");
  assert.doesNotMatch(view, /requestAnimationFrame|<canvas/);
  assert.ok(!/ENGINE_FLOW/.test(read("lib/product-visuals.ts")), "the old dashed-lines engine visual is gone");
  for (const l of ["en", "fr"]) {
    const f = messages[l].site.home.products.flow;
    for (const k of ["label", "caption", "hint", "visit"]) assert.ok(f[k], `${l}: flow.${k}`);
    assert.match(f.uses, /\{use\}/);
    assert.match(f.usesPlanned, /\{use\}/);
    assert.notEqual(f.uses, f.usesPlanned, `${l}: a planned use reads as the future`);
  }
});

test("the engine's figure is the Lab's: the hub with everything around it — the products and the applications of a company that adopts it (Krizaka Entreprise)", async () => {
  const { ENGINE_OFFER } = await import("../lib/engine-uses.ts");
  assert.equal(ENGINE_OFFER.href, "/services");
  const view = readFileSync(new URL("../app/components/home/EngineFlowView.tsx", import.meta.url), "utf8");
  assert.match(view, /nodes\.push\(\{\s*id: ENGINE_OFFER\.id/);
  assert.match(view, /layout="radial"/);
  for (const l of ["en", "fr"]) {
    const f = JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.home.products
      .flow;
    assert.ok(f.yours && f.yoursUse && f.yoursLink, l);
    assert.match(f.yoursUse, /Krizaka Entreprise/, `${l}: the node says it is the offer, never a named customer`);
  }
});

// Founder, 2026-11-06 (krizaka-internal#2765): the engine's fold names what it gives, the packs included — installed from
// Sovkora's studio (krizaka/sovkora-studio-service), the packs in krizaka/sovkora-packs. Four items, each with a name and a
// line in both languages, in the order the component draws them.
test("the engine's fold gives models, pipeline, packs and analytics, each named and explained in both languages", () => {
  const home = read("app/components/home/ProductShowcase.tsx");
  assert.match(home, /\["models", "pipeline", "packs", "analytics"\] as const/);
  for (const lang of ["en", "fr"]) {
    const gives = JSON.parse(read(`messages/${lang}.json`)).site.home.engine.gives;
    for (const k of ["models", "pipeline", "packs", "analytics"]) {
      assert.ok(gives[k]?.name && gives[k]?.line, `${lang}: ${k} has a name and a line`);
    }
  }
});
