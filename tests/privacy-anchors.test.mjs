import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/* The privacy page's sections have stable anchors: blog.krizaka.com links to /privacy#accounts (Krizaka accounts, ADR-001),
   and every product's consent line may link to a section. Same anchors, same order, in both languages. */
const read = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.legal.privacy.sections;

test("every privacy section has a unique anchor, the same in English and French", () => {
  const en = read("en").map((s) => s.id);
  const fr = read("fr").map((s) => s.id);
  assert.deepEqual(fr, en);
  assert.equal(new Set(en).size, en.length);
  for (const id of en) assert.match(id, /^[a-z]+(?:-[a-z]+)*$/);
});

test("the Krizaka accounts section exists and says what is kept and how to export and delete", () => {
  const expected = { en: [/download everything/, /delete the account/], fr: [/télécharger tout/, /supprimer le compte/] };
  for (const [l, patterns] of Object.entries(expected)) {
    const s = read(l).find((x) => x.id === "accounts");
    assert.ok(s, `${l}: #accounts`);
    for (const p of patterns) assert.match(s.paragraphs.join(" "), p);
  }
});
