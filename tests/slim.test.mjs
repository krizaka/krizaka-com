import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// krizaka.com is a showcase (#150): what only the products' own sites render must not come back here.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));

test("the product-only schemas and their journeys are gone", () => {
  for (const file of [
    "lib/journeys.ts",
    "app/components/diagrams/InterceptorPipeline.tsx",
    "app/components/diagrams/SequenceDiagram.tsx",
    "app/components/diagrams/StateDiagram.tsx",
    "app/components/docs/kit-themes.css",
  ]) {
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
  }
  // Krizaka Java's module map lives on java.krizaka.com (krizaka-build/site): no map here.
  assert.ok(
    !existsSync(new URL("../lib/architecture-model.ts", import.meta.url)),
    "lib/architecture-model.ts came back",
  );
});

test("the generated UI docs are gone with their generator and registry reader (ui.krizaka.com renders them)", () => {
  for (const file of ["scripts/gen-ui-docs.mjs", "lib/ui-registry.ts"])
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
});

test("no message is left for a removed page (en and fr)", () => {
  for (const lang of ["en", "fr"]) {
    const m = messages(lang);
    assert.equal(m.pages, undefined, `${lang}: pages`);
    assert.equal(m.docs?.kit, undefined, `${lang}: docs.kit`);
    assert.equal(m.diagrams, undefined, `${lang}: diagrams`);
    assert.equal(m.docs?.pages, undefined, `${lang}: docs.pages`);
    assert.equal(m.docs?.sections?.java, undefined, `${lang}: docs.sections.java`);
  }
});
