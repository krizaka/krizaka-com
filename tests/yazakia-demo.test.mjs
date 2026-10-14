import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The demo of /products/yazakia (app/components/yazakia/YazakiaDemo.tsx): its cast, its words in both languages, its place
// in the page and in the navigation. The component itself is built from @krizaka/ui only.
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const people = JSON.parse(read("lib/people.json")).people.filter((p) => p.product === "yazakia");
const manifest = JSON.parse(read("lib/cdn-manifest.json"));
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };
const castIds = [...read("lib/kit-live.ts").matchAll(/KIT_YAZAKIA_PEOPLE = \[(.*?)\] as const/gs)][0][1].match(/id: "(\w+)"/g).map((s) => s.slice(5, -1));

test("the cast is Yazakia's invented people, portraits on the CDN", () => {
  assert.equal(castIds.length, 3);
  for (const id of castIds) {
    assert.ok(people.some((p) => p.id === id), `${id} is not a Yazakia person of lib/people.json`);
    assert.ok(manifest.files[`people/yazakia/${id}-512.webp`], `${id}'s portrait is not on the CDN`);
  }
});

for (const locale of ["en", "fr"]) {
  const d = messages[locale].site.yazakia.demo;
  test(`${locale}: three turns of three quick replies, three debrief questions, a reason and a whisper per person`, () => {
    assert.equal(d.talk.turns.length, 3);
    for (const turn of d.talk.turns) {
      assert.equal(turn.choices.length, 3);
      for (const c of turn.choices) assert.ok(c.label && c.reply && c.trait);
    }
    assert.equal(d.debrief.questions.length, 3);
    for (const q of d.debrief.questions) assert.equal(q.options.length, 3);
    for (const id of castIds) {
      const person = d.deck.people[id];
      assert.ok(person?.name && person.why && person.whisper && person.tags.length === 2, `${locale}: ${id} is incomplete`);
    }
  });

  test(`${locale}: the four steps are written, in the demo's order`, () => {
    assert.deepEqual(Object.keys(d.steps), ["talk", "debrief", "batch", "intro"]);
  });
}

test("no score in the demo: the portrait shows what was said, never a number of points", () => {
  const source = read("app/components/yazakia/YazakiaDemo.tsx");
  assert.ok(!/score\s*[=:(]/i.test(source.replace(/no score/gi, "")), "a score is computed in the demo");
});

test("the page carries the demo and the navigation points at it", () => {
  assert.match(read("app/[locale]/products/yazakia/page.tsx"), /<Section id="demo"[\s\S]*<YazakiaDemo /);
  assert.match(read("lib/nav.ts"), /href: "\/products\/yazakia#demo", icon: "demo"/);
});

test("the demo is made of Krizaka UI components only", () => {
  const imports = [...read("app/components/yazakia/YazakiaDemo.tsx").matchAll(/from "(@krizaka\/[^"]+)"/g)].map((m) => m[1]);
  for (const need of ["chat", "swipe-deck", "match-dialog", "loader", "skeleton", "countdown", "chip", "progress", "step-progress"]) {
    assert.ok(imports.includes(`@krizaka/ui/${need}`), `@krizaka/ui/${need} is not used`);
  }
});
