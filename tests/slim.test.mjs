import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// krizaka.com is a showcase (#150): what only the products' own sites render must not come back here.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));

test("the product-only schemas and their journeys are gone", () => {
  for (const file of ["lib/journeys.ts", "app/components/diagrams/InterceptorPipeline.tsx", "app/components/diagrams/SequenceDiagram.tsx", "app/components/diagrams/StateDiagram.tsx", "app/components/docs/kit-themes.css"]) {
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
  }
  assert.match(read("lib/architecture-model.ts"), /PRODUCTS = \["java"\] as const/, "the module map draws Krizaka Java only");
});

test("the product kits' generated docs are gone from the generator and the registry reader", () => {
  assert.ok(!/kit-themes|foundations\.json|namedThemes/.test(read("scripts/gen-ui-docs.mjs")));
  assert.ok(!/getKitFoundations|PRODUCT_KITS|KIT_PACKAGES|resolveReference/.test(read("lib/ui-registry.ts")));
});

test("no message is left for a removed page (en and fr)", () => {
  for (const lang of ["en", "fr"]) {
    const m = messages(lang);
    assert.equal(m.pages, undefined, `${lang}: pages`);
    assert.equal(m.docs.kit, undefined, `${lang}: docs.kit`);
    for (const key of ["pipeline", "messaging", "sequence", "states", "journeys", "sections"]) assert.equal(m.diagrams[key], undefined, `${lang}: diagrams.${key}`);
    assert.deepEqual(Object.keys(m.diagrams.roles), ["java"], `${lang}: only Krizaka Java's roles`);
  }
});
