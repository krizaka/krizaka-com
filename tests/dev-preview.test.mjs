import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CRITERIA, WAIVERS, assertStatuses, readProductStatuses, validateChecklist } from "../scripts/dev-preview-lib.mjs";

// « Dev preview » is data, not words (krizaka/.github docs/standards/dev-preview.md, ADR-002): a product may wear the
// status only when its dev-preview.json is complete and fresh. The build (scripts/gen-dev-preview.mjs) refuses the rest.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const TODAY = "2026-10-20";

function complete(product = "kachizaka") {
  const criteria = {};
  for (const id of CRITERIA) criteria[id] = { evidence: `https://example.com/${id}`, checked: "2026-10-16" };
  return { version: 1, product, index: "off", criteria };
}

test("a complete, fresh checklist is complete", () => {
  assert.deepEqual(validateChecklist(complete(), { today: TODAY }), { complete: true, problems: [] });
});

test("an evidence set to null is a gap: the checklist is incomplete and says which criterion", () => {
  const c = complete();
  c.criteria["journey.core"] = { evidence: null, gap: "no recorded run", issue: "https://github.com/krizaka/kachizaka/issues/1" };
  const r = validateChecklist(c, { today: TODAY });
  assert.equal(r.complete, false);
  assert.match(r.problems.join("\n"), /journey\.core/);
});

test("a missing criterion, a non-https evidence and an unknown criterion are refused", () => {
  const c = complete();
  delete c.criteria["site.healthy"];
  c.criteria["site.qa-signin"] = { evidence: "http://insecure.example", checked: "2026-10-16" };
  c.criteria["site.invented"] = { evidence: "https://example.com", checked: "2026-10-16" };
  const text = validateChecklist(c, { today: TODAY }).problems.join("\n");
  assert.match(text, /site\.healthy.*missing/);
  assert.match(text, /site\.qa-signin.*https/);
  assert.match(text, /site\.invented.*unknown/);
});

test("evidence older than 60 days no longer counts", () => {
  const c = complete();
  c.criteria["quality.ci-green"].checked = "2026-08-01";
  const r = validateChecklist(c, { today: TODAY });
  assert.equal(r.complete, false);
  assert.match(r.problems.join("\n"), /quality\.ci-green.*stale/);
});

test("na is allowed only where the standard allows it, with a real reason", () => {
  const c = complete();
  c.criteria["mobile.build"] = { na: "The AGENTS.md says there is no mobile app for the Dev preview." };
  assert.equal(validateChecklist(c, { today: TODAY }).complete, true);
  c.criteria["mobile.build"] = { na: "no" };
  assert.match(validateChecklist(c, { today: TODAY }).problems.join("\n"), /mobile\.build.*reason/);
  const d = complete();
  d.criteria["site.healthy"] = { na: "We prefer not to have a health route here." };
  assert.match(validateChecklist(d, { today: TODAY }).problems.join("\n"), /site\.healthy.*not allowed/);
});

test("a product wearing devPreview needs a complete checklist; any other status is never gated", () => {
  const statuses = { kachizaka: "devPreview", akinaza: "development", yororis: "construction" };
  assert.match(assertStatuses(statuses, {}, { today: TODAY }).join("\n"), /kachizaka.*no checklist/);
  const incomplete = complete();
  incomplete.criteria["docs.current"] = { evidence: null, gap: "not audited" };
  assert.match(assertStatuses(statuses, { kachizaka: incomplete }, { today: TODAY }).join("\n"), /kachizaka.*docs\.current/);
  assert.deepEqual(assertStatuses(statuses, { kachizaka: complete() }, { today: TODAY }), []);
  assert.deepEqual(assertStatuses({ akinaza: "development" }, {}, { today: TODAY }), []);
});

test("a checklist whose product does not match the repository it was read from is refused", () => {
  assert.match(assertStatuses({ kachizaka: "devPreview" }, { kachizaka: complete("akinaza") }, { today: TODAY }).join("\n"), /kachizaka.*product/);
});

test("a time-boxed waiver lets a product keep the badge it had before the gate, and ends on its date", () => {
  const statuses = { orochia: "devPreview" };
  assert.deepEqual(assertStatuses(statuses, {}, { today: "2026-10-20", waivers: { orochia: "2026-11-01" } }), []);
  assert.match(assertStatuses(statuses, {}, { today: "2026-11-02", waivers: { orochia: "2026-11-01" } }).join("\n"), /orochia.*waiver ended/);
});

test("the real waivers have not expired (the gate becomes strict on the day they end)", () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [id, until] of Object.entries(WAIVERS)) assert.ok(until >= today, `${id}: the Dev preview waiver ended ${until}: close the gaps or change the status`);
});

test("lib/products.ts gives every product an explicit status, and the cards and chips know devPreview", () => {
  const statuses = readProductStatuses(read("lib/products.ts"));
  assert.deepEqual(Object.keys(statuses).sort(), ["akinaza", "kachizaka", "orazaka", "orochia", "yasakia", "yomizaka", "yororis"]);
  for (const s of Object.values(statuses)) assert.ok(["devPreview", "development", "construction", "upcoming"].includes(s));
  for (const l of ["en", "fr"]) assert.ok(JSON.parse(read(`messages/${l}.json`)).site.nav.status.devPreview.label);
  assert.match(read("app/components/ProductStatus.tsx"), /devPreview/);
});

test("the build reads the checklists before it builds", () => {
  assert.match(read("package.json"), /gen-dev-preview\.mjs/);
  assert.match(read(".gitignore"), /dev-preview-checklists\.json/);
});
