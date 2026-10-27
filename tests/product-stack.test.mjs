import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ENGINE, KITS, PLANNED, provenKit, stackCell, stackRows } from "../lib/product-stack.ts";

// What each product runs on (no table any more; the rules stay for the story): every cell is read from the products' manifests
// (lib/product-manifests.json, scripts/gen-product-manifests.mjs) — no network here.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const { products: manifests } = JSON.parse(read("lib/product-manifests.json"));
const ids = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name: "\w+",/g)].map((m) => m[1]);

test("every product of lib/products.ts has a row", () => {
  assert.deepEqual(ids, ["orazaka", "yomizaka", "akinaza"]);
  const rows = stackRows(ids, manifests);
  assert.deepEqual(rows.map((r) => r.id), ids);
  for (const r of rows) {
    assert.ok(manifests[r.id]?.sources.length > 0, `${r.id}: manifests were read`);
    assert.deepEqual(r.cells.map((c) => c.kit), [...KITS]);
  }
});

test("a cell says Yes only when a manifest of the product proves it", () => {
  for (const id of ids) {
    for (const cell of stackRows([id], manifests)[0].cells) {
      if (cell.state === "yes" || cell.state === "partial") assert.ok(provenKit(cell.kit, manifests[id]), `${id}/${cell.kit} is in no manifest`);
    }
    // Every @krizaka package claimed is a dependency of the product's repositories.
    const npm = new Set(manifests[id].npm);
    const ui = stackCell(id, "ui", manifests[id]);
    assert.equal(ui.state === "yes", npm.has("@krizaka/ui"), `${id}: Krizaka UI`);
    const java = stackCell(id, "java", manifests[id]);
    assert.equal(java.state === "yes", manifests[id].maven.length > 0, `${id}: Java platform kit`);
  }
});

test("what is Planned is not in a manifest yet (else it is shipped: say Yes)", () => {
  for (const [id, kits] of Object.entries(PLANNED)) {
    assert.ok(ids.includes(id), `${id} is a product`);
    for (const kit of kits) if (kit !== "engine") assert.equal(provenKit(kit, manifests[id]), false, `${id}/${kit} is shipped: drop it from PLANNED`);
  }
});

test("the engine is the only product that is the engine; the others run on it only when it ships", () => {
  assert.equal(stackCell(ENGINE, "engine", manifests[ENGINE]).state, "engine");
  for (const id of ids.filter((i) => i !== ENGINE)) if (!manifests[id]?.engineRun) assert.notEqual(stackCell(id, "engine", manifests[id]).state, "yes");
});

test("the table, product by product", () => {
  const word = (c) => (c.state === "partial" ? `partial:${c.parts.join("+")}` : c.state === "yes" && c.transport ? c.transport : c.state);
  const table = Object.fromEntries(stackRows(ids, manifests).map((r) => [r.id, r.cells.map(word)]));
  assert.deepEqual(table, {
    orazaka: ["yes", "yes", "sse", "yes", "engine"],
    yomizaka: ["yes", "yes", "no", "no", "planned"],
    akinaza: ["yes", "yes", "sse", "no", "planned"],
  });
});

test("the table is not on /open-source (the products are operated, not open source; 2026-10-26) and /story only points to it", () => {
  assert.doesNotMatch(read("app/[locale]/open-source/page.tsx"), /ProductStackTable/);
  assert.doesNotMatch(read("app/[locale]/story/page.tsx"), /<table/);
  assert.match(read("app/[locale]/story/page.tsx"), /href="\/open-source"/);
});

test("no message says a product runs on Orazaka while its cell is Planned", () => {
  const planned = Object.entries(PLANNED).filter(([, kits]) => kits.includes("engine")).map(([id]) => id);
  assert.ok(planned.length > 0);
  const words = { en: /planned/i, fr: /prévu/i };
  for (const lang of ["en", "fr"]) {
    const story = JSON.parse(read(`messages/${lang}.json`)).site.story;
    // The engine chapter and what comes next: a sentence naming a planned product next to the engine must say "planned".
    const sentences = [story.engine.lead, story.next.wire, story.next.lead].flatMap((p) => p.split(/(?<=[.!?])\s+/));
    for (const id of planned) {
      const name = id[0].toUpperCase() + id.slice(1);
      for (const s of sentences.filter((s) => s.includes(name) && s.includes("Orazaka"))) assert.match(s, words[lang], `${lang} story: "${s}"`);
    }
  }
});
