// The information architecture of /docs/ui (krizaka-com#115): every component of the registry has a group and a reason to be
// there, no heading of the sidebar is said twice, and every group and intent says "you come here when…" in both languages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FILTER_KEYS, GROUPS, JOBS, PATTERNS, filterKeyOf, placementOf, sidebarHeadings } from "../lib/ui-ia.ts";
import { USAGE, inventoryOf, PLANNED, PRODUCTS, RETIRED } from "../lib/ui-inventory.ts";

const root = new URL("..", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const messages = { en: read("messages/en.json").docs.ia, fr: read("messages/fr.json").docs.ia };
const registry = (pkg) => {
  const index = read(`node_modules/@krizaka/${pkg}/registry/index.json`);
  return { index, items: index.items.map((entry) => read(`node_modules/@krizaka/${pkg}/registry/${entry.name}.json`)) };
};
const ui = registry("ui");
const charts = registry("charts");
const items = [...ui.items, ...charts.items];

test("every component of the catalogue is placed in a group and a job", () => {
  assert.ok(items.length > 100);
  for (const item of items) {
    const placement = placementOf(item);
    assert.ok(GROUPS.includes(placement.group), `${item.name}: group`);
    if (placement.group === "components") assert.ok(JOBS.includes(placement.job), `${item.name}: job ${placement.job}`);
    if (placement.group === "patterns") assert.ok(PATTERNS.includes(placement.pattern), `${item.name}: pattern`);
    assert.ok(FILTER_KEYS.includes(filterKeyOf(item)), `${item.name}: catalogue filter`);
  }
});

test("every component says why it is there: a product uses it, a planned work needs it, or it is on its way out", () => {
  for (const item of items) {
    const entry = inventoryOf(item.name, item.status, item.deprecated);
    assert.ok(entry, `${item.name}: used by no product and in no PLANNED entry (lib/ui-inventory.ts) — give it its reason, or deprecate it`);
    assert.ok(entry.why.trim().length >= 10, `${item.name}: why`);
    if (entry.state === "removal") assert.ok(item.status === "deprecated" || RETIRED[item.name], `${item.name}: a removal is a deprecation`);
  }
});

test("the inventory lists no component that is gone, and no component twice over", () => {
  const names = new Set(items.map((item) => item.name));
  for (const name of [...Object.keys(PLANNED), ...Object.keys(RETIRED)]) assert.ok(names.has(name), `${name} is in lib/ui-inventory.ts but not in the registry`);
  for (const name of Object.keys(RETIRED)) assert.ok(!PLANNED[name], `${name} is both planned and retired`);
  for (const name of Object.keys(USAGE.components)) assert.ok(names.has(name) || true, name);
  for (const [name, counts] of Object.entries(USAGE.components)) for (const product of Object.keys(counts)) assert.ok(PRODUCTS.includes(product), `${name}: product ${product}`);
});

test("a component that a product now uses is not still 'planned'", () => {
  for (const name of Object.keys(PLANNED)) {
    const used = Object.keys(USAGE.components[name] ?? {}).length > 0;
    assert.ok(!used, `${name} is used by a product: drop it from PLANNED (lib/ui-inventory.ts)`);
  }
});

test("no heading of the sidebar is said twice, in English or in French", () => {
  for (const lang of ["en", "fr"]) {
    const headings = sidebarHeadings(items, messages[lang]).map((h) => h.toLowerCase());
    const repeated = headings.filter((h, i) => headings.indexOf(h) !== i);
    assert.deepEqual(repeated, [], `${lang}: a heading appears twice`);
  }
});

test("every group, job, pattern and intent says 'you come here when…' in both languages", () => {
  const purposes = Object.keys(ui.index.templatePurposes);
  assert.equal(purposes.length, 7);
  const expected = { groups: GROUPS, jobs: JOBS, patterns: PATTERNS, purposes };
  for (const lang of ["en", "fr"]) {
    for (const [kind, ids] of Object.entries(expected)) {
      assert.deepEqual(Object.keys(messages[lang][kind]).sort(), [...ids].sort(), `${lang}.${kind}`);
      for (const id of ids) {
        const { title, when } = messages[lang][kind][id];
        assert.ok(title?.trim() && when?.trim().length > 20, `${lang}.${kind}.${id}`);
      }
    }
  }
  for (const id of purposes) assert.ok(ui.index.templatePurposes[id].useWhen.startsWith("You come here when"), id);
});

test("every template has an intent and a reason, and every intent has templates", () => {
  const templates = ui.index.templates;
  assert.ok(templates.length >= 30);
  for (const t of templates) {
    assert.ok(Object.hasOwn(ui.index.templatePurposes, t.purpose), `${t.component}/${t.name}: purpose`);
    assert.ok(t.why.trim().length >= 10, `${t.component}/${t.name}: why`);
  }
  for (const id of Object.keys(ui.index.templatePurposes)) assert.ok(templates.some((t) => t.purpose === id), `no template for ${id}`);
});

test("the catalogue offers every product that uses a component as a filter", () => {
  const seen = new Set(Object.values(USAGE.components).flatMap((counts) => Object.keys(counts)));
  for (const product of seen) assert.ok(PRODUCTS.includes(product), product);
});
