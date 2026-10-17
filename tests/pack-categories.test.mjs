// The packs of the generated architecture data stand on the closed list of categories (orazaka-packs#16): the
// open-source lists and the product sites group by it.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const { packs } = JSON.parse(readFileSync(new URL("../app/data/architecture.json", import.meta.url), "utf8"));
const CATEGORIES = ["business-compliance", "creativity-media", "wellbeing", "data-analytics"];

test("every pack on the shelf has a category of the closed list, labelled in EN and FR", () => {
  const shown = packs.filter((p) => p.status === "PUBLISHED" && p.showcase);
  assert.ok(shown.length >= 5);
  for (const p of shown) {
    assert.ok(CATEGORIES.includes(p.category), `${p.key}: ${p.category}`);
    for (const l of ["en", "fr"]) assert.ok(p.categoryText[l]?.label, `${p.key}: ${l} label`);
  }
});
