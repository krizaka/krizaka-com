import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { DIRECTION_STEPS, nowProducts } from "../lib/direction.ts";
import { PRODUCT_RECORDS, hasCode } from "./helpers/source.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const msg = (l) => JSON.parse(read(`messages/${l}.json`)).site;
const FORBIDDEN =
  /revolution|game-?chang|best-in-class|world-class|cutting-edge|state-of-the-art|unparalleled|seamless|next-gen|r[eé]volutionnaire|r[eé]volutionne|r[eé]volution|r[eé]f[eé]rence mondiale|de pointe|in[eé]gal[eé]|sans pr[eé]c[eé]dent|le meilleur|la meilleure|the best/i;
const figures = { components: 10, native: 4, maven: 27, repositories: 35, npm: 45, downloads: 100 };

test("the services line has its words in both languages, one action to /services, no digit, no price", () => {
  for (const l of ["en", "fr"]) {
    const k = msg(l).home.services;
    for (const key of ["number", "title", "lead", "cta"]) assert.ok(k[key].length > 2, `${l}: ${key}`);
    assert.doesNotMatch(JSON.stringify(k), /\d{2,}|\$|€/, `${l}: no figure, no price`);
  }
  const src = read("app/components/home/ServicesLine.tsx");
  assert.match(src, /href="\/services"/);
  assert.doesNotMatch(src, /variant="primary"/);
});

test("the « what we can do » section is gone from the home (2026-10-30, #487): the home stays short", () => {
  assert.ok(!existsSync(new URL("../app/components/home/KnowHow.tsx", import.meta.url)));
  assert.ok(!existsSync(new URL("../lib/know-how.ts", import.meta.url)));
  for (const l of ["en", "fr"]) assert.equal(msg(l).home.knowhow, undefined, l);
});

test("« now » is the products' statuses from lib/products.ts; the steps are now, next, later, without dates", () => {
  assert.deepEqual([...DIRECTION_STEPS], ["now", "next", "later"]);
  const ids = PRODUCT_RECORDS().map((p) => p.id);
  const products = ids.map((id) => ({ id, name: id, status: "development" }));
  assert.deepEqual(
    nowProducts(products).map((p) => p.id),
    ids,
  );
  assert.ok(ids.length >= 3);
  for (const l of ["en", "fr"]) {
    const d = msg(l).home.direction;
    assert.deepEqual(Object.keys(d.steps), ["now", "next", "later"], l);
    assert.match(d.steps.now.body, /\{names\}/);
    assert.doesNotMatch(JSON.stringify(d), /20\d\d|\b(Q[1-4]|janvier|january|demain|tomorrow)\b/i, `${l}: no date`);
  }
  assert.ok(hasCode("app/components/home/Direction.tsx", "nowProducts(PRODUCTS)"));
});

test("the tone is restrained: no hype word in the new sections, in either language", () => {
  for (const l of ["en", "fr"]) {
    const h = msg(l).home;
    const text = JSON.stringify({ k: h.knowhow, d: h.direction });
    assert.doesNotMatch(text, FORBIDDEN, l);
    assert.doesNotMatch(text, /!/, `${l}: no exclamation`);
  }
  for (const sample of ["revolutionary", "game-changing", "best-in-class", "révolutionnaire"])
    assert.match(sample, FORBIDDEN);
});

test("one primary action per section: no primary button in the two sections", () => {
  for (const f of ["ServicesLine", "Direction"])
    assert.doesNotMatch(read(`app/components/home/${f}.tsx`), /variant="primary"/, f);
});

test("licence words are true to the repositories: the products are never said to be Apache-2.0 (and no licence is claimed for them: tests/claims-guard.test.mjs)", async () => {
  const { readFileSync } = await import("node:fs");
  for (const l of ["en", "fr"]) {
    const text = readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8");
    assert.doesNotMatch(
      text,
      /(Verikora|Folioviv)[^"]{0,120}(Apache License 2\.0|licence Apache 2\.0)[^"]{0,20}:/,
      `${l}: a product named under Apache 2.0`,
    );
    assert.doesNotMatch(
      text,
      /(dépôts et (les )?paquets sont publics, sous licence Apache|repositories and packages are public, under the Apache)/,
      `${l}: « everything is Apache-2.0 »`,
    );
  }
});

test("the services and the direction carry content, not ruled paper: the offer as a list, the order as a static list of stations", () => {
  const services = read("app/components/home/ServicesLine.tsx");
  const direction = read("app/components/home/Direction.tsx");
  for (const [name, src] of [
    ["ServicesLine", services],
    ["Direction", direction],
  ])
    assert.doesNotMatch(src, /paper="lines"|kz-notebook-list/, name);
  assert.match(services, /<OfferList\s+compact/, "a list, not three squares (founder, 2026-11-05)");
  assert.match(
    services,
    /href: `\/\$\{locale\}\/services#offer-\$\{id\}`/,
    "each part leads to its entry on /services",
  );
  assert.match(read("app/components/lists/OfferList.tsx"), /id=\{compact \? undefined : `offer-\$\{o\.id\}`\}/);
  assert.match(direction, /<ol className="kz-dir-line"/, "a static numbered list (krizaka-internal#3243)");
  assert.doesNotMatch(direction, /DirectionLoop|"use client"/, "the page's second self-moving block is retired");
  assert.ok(
    !existsSync(new URL("../app/components/home/DirectionLoop.tsx", import.meta.url)),
    "DirectionLoop is deleted",
  );
  assert.doesNotMatch(direction, /<Stepper/, "the Stepper broke on a phone (krizaka-internal#2450)");
  for (const l of ["en", "fr"]) {
    const h = msg(l).home;
    for (const id of ["modules", "ai", "maintenance"])
      assert.ok(h.services.parts[id].title && h.services.parts[id].line.length <= 90, `${l}: parts.${id}`);
    for (const id of ["next", "later"])
      assert.ok(h.direction.steps[id].points.length >= 2, `${l}: steps.${id}.points, the details each station shows`);
    for (const k of ["pause", "play"])
      assert.equal(h.direction[k], undefined, `${l}: nothing to pause, direction.${k} is gone`);
    assert.doesNotMatch(JSON.stringify(h.services), FORBIDDEN, l);
  }
});

test("the direction is static: every station open, no timer, no pause, nothing travels", () => {
  const src = read("app/components/home/Direction.tsx");
  assert.doesNotMatch(src, /useState|useEffect|setInterval|setTimeout|IntersectionObserver|requestAnimationFrame/);
  assert.match(src, /DIRECTION_STEPS\.map\(\(id\)/, "the three stations are the data's");
  assert.doesNotMatch(src, /hidden=|aria-expanded/, "no station is folded");
  const css = read("app/components/home/direction.css").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(css, /@media \(min-width: 900px\)/, "one line on a wide screen, down the page on a phone");
  assert.doesNotMatch(css, /animation|transition|@keyframes/, "nothing moves");
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b|rgb\(|translate/, "tokens only, nothing travels");
});
