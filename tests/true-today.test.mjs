import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { org } from "@krizaka/org";
import { PRODUCTS } from "../lib/products.ts";

const root = new URL("../", import.meta.url).pathname;
const messages = (l) => JSON.parse(readFileSync(`${root}messages/${l}.json`, "utf8"));
const WHERE = { fr: "notre propre dépôt Maven", en: "our own Maven repository" };

test("the home says what the privacy page says: no tracker, a cookieless first-party visit counter", () => {
  for (const l of ["fr", "en"]) {
    const m = messages(l).site;
    const home = m.home.principles.items.canada.body;
    assert.doesNotMatch(home, /ni mesure d'audience|no analytics/i, `${l}: the home denies the counter`);
    assert.match(
      home,
      l === "fr" ? /compte lui-même ses visites, sans cookie/ : /counts its own visits, first-party and cookieless/,
    );
  }
});

test("Kridoc has one stage: read from @krizaka/org, never typed in the « later » list", () => {
  assert.equal(PRODUCTS.find((p) => p.id === "kridoc").status, org.products.find((p) => p.id === "kridoc").status);
  for (const l of ["fr", "en"]) {
    const later = JSON.stringify(messages(l).site.home.direction.steps.later);
    assert.doesNotMatch(later, /kridoc/i, `${l}: Kridoc's stage is the « now » list's, not a typed second one`);
  }
});

test("the Java artefacts are said to be in our own Maven repository, never on Maven Central, on the docs and the story", () => {
  for (const l of ["fr", "en"]) {
    const s = messages(l).site;
    for (const text of [
      s.home.stack.java.line,
      s.openSource.packages.caption,
      s.openSource.packages.lead,
      s.openSource.lead,
    ]) {
      assert.ok(text.includes(WHERE[l]), `${l}: ${text}`);
      assert.doesNotMatch(text, /Maven Central/);
    }
  }
});
