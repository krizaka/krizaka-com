import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { internalKindOf, publicRelease, publicReleases } from "../lib/changelog-public.ts";

/* /changelog promised « highlights » and showed the team's internal work (founder, 2026-11-07, krizaka-internal#2832). The
   rule is data; each kind it hides is tested on the real lines that reached the page, and so is what it must keep. */
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const rule = JSON.parse(read("content/changelog-public.json"));
const fix = (text) => ({ tag: "fix", text });

test("every kind of internal work is data with its reason, and security and breaking lines are always kept", () => {
  assert.deepEqual([...rule.keepTags].sort(), ["breaking", "security"]);
  for (const k of rule.internal) {
    assert.ok(k.id && k.why && k.pattern, `${k.id}: an id, a reason and a pattern`);
    assert.doesNotThrow(() => new RegExp(k.pattern, k.flags), k.id);
  }
  assert.equal(internalKindOf({ tag: "security", text: "The CI image takes Alpine's security fixes." }, rule), null);
  assert.equal(internalKindOf({ tag: "breaking", text: "Flyway V1 replaces the old migrations." }, rule), null);
});

test("the internal lines that reached the page are hidden, each by its kind", () => {
  const hidden = {
    ci: [
      "CI calls the shared pipeline as krizaka/sovkora, so it starts again after the rename.",
      "The dev smoke checks the app on dev.verikora.com only.",
    ],
    tooling: [
      "Explicit precedence in three regexes.",
      "TurnRequest maps messages and tools without nested ternaries (S3358).",
      "Test_capability_contract.py in ruff format.",
    ],
    tests: [
      "BlueprintFitnessTest reads the capability seed from the Flyway V1 baseline.",
      "Rate-limit IT waits with Awaitility, not sleeps.",
      "The journey settles the page before submit and presses again when the click is swallowed.",
      "The persona pays without Link; the stuck form names invalid fields.",
    ],
    deps: ["Re-pin the film workflow to a commit of sovkora main.", "Updated dependencies [a1b2c3d]."],
    release: ["Version Packages."],
    schema: ["Governance schema is Flyway V1, applied by the host at startup (krizaka-internal#2255)."],
    repository: [
      "Users, billing and notifications run from their krizaka-build folders.",
      "Main: the starters example is built after the modules whose metadata it reads.",
    ],
    dev: ["Dev shows the code name under Verikora.", "Every caller of dev.sovkora.com moves to www.sovkora.com."],
  };
  for (const [kind, lines] of Object.entries(hidden))
    for (const text of lines) assert.ok(internalKindOf(fix(text), rule), `${kind}: « ${text} » is internal`);
});

test("what a visitor can see stays: features, visible fixes, the stack's API changes", () => {
  for (const text of [
    "The app home leads with applicant files, one primary action, documents below.",
    "The console is French by default (Loi 96).",
    "The active chat model is the catalogue default, not Ollama's first listed.",
    "A client that closes the stream is not logged as backend unreachable.",
    "Payment terms live in Invoices, and the phone settings follow the web's groups.",
    "No public support address; Support links to Krizaka's contact form.",
    "Release: releases go to Maven Central only, GitHub Packages is abandoned for Maven (#235).",
    "`MediaCarousel` takes slides as data (`kind` clip · screen-demo · still).",
    "Users: a provider key is released only against a run-bound, single-use grant (#219).",
  ])
    assert.equal(internalKindOf(fix(text), rule), null, `« ${text} » is kept`);
});

test("a release keeps its visible lines, its French ones in step, and goes when nothing is left", () => {
  const release = {
    changes: [fix("CI calls the shared pipeline."), fix("The console is French by default (Loi 96).")],
    fr: [fix("La CI appelle la chaîne partagée."), fix("La console est en français par défaut (Loi 96).")],
  };
  assert.deepEqual(publicRelease(release, rule), { changes: [release.changes[1]], fr: [release.fr[1]] });
  assert.equal(publicRelease({ changes: [fix("Re-pin the film workflow.")] }, rule), null);
  assert.equal(publicReleases([{ changes: [fix("Re-pin.")] }, release], rule).length, 1);
  const uneven = {
    changes: [fix("The console is French.")],
    fr: [fix("Les dépendances suivent."), fix("La console est en français.")],
  };
  assert.deepEqual(publicRelease(uneven, rule)?.fr, [uneven.fr[1]], "uneven French lines are judged on their own");
});

test("the changelog reader applies the rule before it cuts the list, so the page, the feed and the build check share it", () => {
  const gen = read("scripts/gen-changelog.mjs");
  assert.match(gen, /import \{ publicReleases \} from "\.\.\/lib\/changelog-public\.ts";/);
  assert.match(gen, /publicReleases\([\s\S]*?PUBLIC_RULE,?\s*\)[\s\S]*?\.slice\(0, MAX\)/);
});
