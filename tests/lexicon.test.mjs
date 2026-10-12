import { test } from "node:test";
import assert from "node:assert/strict";
import { check, violations } from "../scripts/lexicon.mjs";

test("the never column is caught, as whole words, in both languages", () => {
  assert.deepEqual(violations("Join the waitlist for our beta", "en").map((v) => v.term).sort(), ["beta", "waitlist*"]);
  assert.deepEqual(violations("Votre thérapeute IA, bientôt disponible", "fr").map((v) => v.term).sort(), ["bientôt", "thérap*"]);
  assert.equal(violations("A session with Léa", "en").length, 1);
  assert.equal(violations("Une séance avec Léa", "fr").length, 1);
  // Whole words only: "health" is not "heal", "therapists'" is caught by its prefix, "Health Canada" is allowed.
  assert.equal(violations("Health Canada's rules for software", "en").length, 0);
  assert.equal(violations("Bring it to your therapists", "en").length, 1);
});

test("a reviewed sentence is exempt where it is quoted verbatim, and only there", () => {
  const reviewed = ["Not care, not a clinical service."];
  assert.equal(violations("Intro. Not care, not a clinical service. Outro.", "en", reviewed).length, 0);
  assert.equal(violations("A clinical service.", "en", reviewed).length, 1);
});

test("the site's Yororis words pass, and the reviewed texts are acknowledged", () => {
  const { findings, hash, recorded } = check();
  assert.deepEqual(findings, []);
  assert.equal(recorded.sha256, hash);
});
