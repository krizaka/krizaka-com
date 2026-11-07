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
  assert.match(gen, /publicReleases\([\s\S]*?PUBLIC_RULE,\s*SERVABLE,?\s*\)[\s\S]*?\.slice\(0, MAX\)/);
});

/* The page is built from live release notes, and the build refuses a retired code name in what it serves
   (scripts/check-code-names.mjs). Prose is said in commercial words, but an identifier keeps its name. A changeset that
   names a retired export therefore failed every build once it fell inside the 60 newest entries (2026-11-07,
   krizaka-internal#2880). The guard's own judgement now runs before the cut: such a line is dropped, whatever its tag. */
const KRIZAKA_UI_492 =
  'Products wear plain Krizaka UI: under `data-surface="product"` on the root (an app themed at :root: set it on `<html>`) or a product brand (`.brand-orazaka`, retired exports, `-yomizaka`, a retired export, `-akinaza`)…';

test("a line the page could not serve is dropped before the cut, whatever its tag, and its release with it when nothing is left", async () => {
  const { codeNameProblems } = await import("../scripts/check-code-names.mjs");
  const { commercialWords } = await import("../lib/commercial-words.ts");
  const servable = (text) => codeNameProblems(commercialWords(text)).length === 0;
  assert.equal(servable(KRIZAKA_UI_492), false, "the real line of krizaka-ui#492 would fail the build");
  assert.equal(servable("Products wear plain Krizaka UI."), true);
  const release = { changes: [fix("Products wear plain Krizaka UI."), fix(KRIZAKA_UI_492)] };
  assert.deepEqual(publicRelease(release, rule, servable).changes, [fix("Products wear plain Krizaka UI.")]);
  assert.equal(publicRelease({ changes: [{ tag: "breaking", text: KRIZAKA_UI_492 }] }, rule, servable), null);
  const fr = { changes: [fix("Plain UI."), fix("Ok.")], fr: [fix("UI simple."), fix("`-yomizaka` retiré.")] };
  assert.deepEqual(publicRelease(fr, rule, servable).fr, [fix("UI simple.")], "a French line is judged too");
  assert.equal(publicReleases([release, { changes: [fix(KRIZAKA_UI_492)] }], rule, servable).length, 1);
  assert.deepEqual(
    publicRelease(release, rule).changes,
    release.changes,
    "without a judgement, every line is servable",
  );
});

test("gen-changelog judges a line with the site's own guards, on the line in commercial words", () => {
  const gen = read("scripts/gen-changelog.mjs");
  assert.match(gen, /import \{ codeNameProblems \} from "\.\/check-code-names\.mjs";/);
  assert.match(gen, /import \{ claimProblems \} from "\.\.\/lib\/public-claims\.ts";/);
  assert.match(gen, /codeNameProblems\(said\)\.length === 0 && claimProblems\(said\)\.length === 0/);
});

/* The same day, CI's tests went red on the live notes too: the install step fetches the changelog (gen-fresh) and
   tests/claims-guard.test.mjs read lib/changelog.json, where krizaka/.github#413 said « Four products left the
   organisation ». The claims rules are one module (lib/public-claims.ts): the guard reads what we write, and the
   generator drops a live line that breaks them; a test never reads live data. */
test("a live line that breaks a claims rule is not servable: a product count in words, a licence next to a product", async () => {
  const { claimProblems } = await import("../lib/public-claims.ts");
  const four =
    "Four products left the organisation (krizaka/.github#413): their brands, marks, sites, avatars and chart palettes are removed.";
  assert.deepEqual(claimProblems(four), ["a product count in words"]);
  assert.deepEqual(claimProblems("Sovkora is now under the FSL-1.1."), ["a licence next to a product"]);
  assert.deepEqual(claimProblems("Every repository is public under Apache-2.0."), ["a licence claim on everything"]);
  assert.deepEqual(claimProblems("The carousel plays a loop."), []);
  const claims = read("tests/claims-guard.test.mjs");
  assert.match(claims, /from "\.\.\/lib\/public-claims\.ts"/, "the guard uses the same rules");
  assert.match(claims, /changelog/, "the guard leaves the generated changelog to its generator");
});
