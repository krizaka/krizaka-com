import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The invented people of every product (lib/people.json): one face = one persona = one product.
const people = JSON.parse(readFileSync(new URL("../lib/people.json", import.meta.url), "utf8"));
const manifest = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));

test("every portrait lives under its own product's folder", () => {
  for (const p of people.people) {
    assert.ok(people.products.includes(p.product), `${p.product} is not a product with people`);
    for (const file of p.files) assert.ok(file.startsWith(`people/${p.product}/${p.id}-`), `${file} is not under people/${p.product}/${p.id}-`);
  }
});

test("no file is worn by two personas, let alone two products", () => {
  const owner = new Map();
  for (const p of people.people) {
    for (const file of p.files) {
      assert.ok(!owner.has(file), `${file} is used by ${owner.get(file)} and ${p.product}/${p.id}`);
      owner.set(file, `${p.product}/${p.id}`);
    }
  }
  const ids = people.people.map((p) => `${p.product}/${p.id}`);
  assert.equal(new Set(ids).size, ids.length);
});

test("no two portraits come from the same generation", () => {
  const runs = people.people.map((p) => `${p.prompt}#${p.seed}`);
  assert.equal(new Set(runs).size, runs.length);
  for (const p of people.people) assert.match(p.seed, /^\d{1,10}$/);
});

test("every portrait is on the CDN", () => {
  for (const p of people.people) for (const file of p.files) assert.ok(manifest.files[file], `${file} is not in lib/cdn-manifest.json`);
});

test("Yororis has no faces: its presences are drawn marks", () => {
  assert.ok(!people.products.includes("yororis"));
  assert.ok(people.people.every((p) => p.product !== "yororis"));
});
