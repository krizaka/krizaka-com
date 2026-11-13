import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/* Lesson 2 of « Cours du soir » asks every app five questions, « us too » (krizaka-internal#3307). The privacy page answers each
   one in a section with a stable anchor, in both languages: 1 what is collected (Law 25 s. 3.1), 2 where it goes and the
   assessment before it leaves Québec (s. 17), 3 access and deletion (s. 23 and the rights), 4 whether a machine decides alone
   (s. 12.1), 5 who tells you about a confidentiality incident (s. 3.5 to 3.8). Every sentence is what runs today: no register,
   assessment or delay we do not keep. */
const privacy = (l) =>
  JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.legal.privacy;
const section = (l, id) => privacy(l).sections.find((s) => s.id === id);
const text = (l, id) => section(l, id).paragraphs.join(" ");

const FIVE = ["collected", "outside-quebec", "rights", "automated-decisions", "incidents"];
const LOCALES = ["en", "fr"];
const ADDRESS = /[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/;

test("the five questions each have their anchor, in English and in French", () => {
  for (const l of LOCALES) for (const id of FIVE) assert.ok(section(l, id), `${l}: #${id}`);
});

test("the answers to the five questions show no e-mail address: the way in is the contact form", () => {
  for (const l of LOCALES) for (const id of FIVE) assert.doesNotMatch(text(l, id), ADDRESS, `${l}: #${id}`);
  for (const l of LOCALES)
    assert.match(text(l, "incidents"), /krizaka\.com\/contact/, `${l}: #incidents names the form`);
});

test("question 4: no decision about a person rests on a machine alone, and each product named says what it does", () => {
  const expected = {
    en: [
      /12\.1/,
      /based exclusively on automated processing/,
      /Verikora decides nothing/,
      /Folioviv/,
      /Kridoc/,
      /Sovkora/,
    ],
    fr: [
      /12\.1/,
      /fondée exclusivement sur un traitement automatisé/,
      /Verikora ne décide rien/,
      /Folioviv/,
      /Kridoc/,
      /Sovkora/,
    ],
  };
  for (const [l, patterns] of Object.entries(expected))
    for (const p of patterns) assert.match(text(l, "automated-decisions"), p, l);
});

test("question 5: the legal duty is stated, and the register is said to be in preparation, never kept", () => {
  const expected = {
    en: [/3\.5/, /3\.8/, /Commission d'accès à l'information/, /risk of serious injury/, /register is being set up/],
    fr: [
      /3\.5/,
      /3\.8/,
      /Commission d'accès à l'information/,
      /risque de préjudice sérieux/,
      /registre est en cours de mise en place/,
    ],
  };
  for (const [l, patterns] of Object.entries(expected))
    for (const p of patterns) assert.match(text(l, "incidents"), p, l);
  assert.doesNotMatch(text("en", "incidents"), /we keep a register|on call|within \d+ (?:hours|days)/i);
  assert.doesNotMatch(text("fr", "incidents"), /nous tenons un registre|de garde|dans les \d+ (?:heures|jours)/i);
});

test("s. 17: where the information goes outside Québec, and the assessment said to be in preparation, never done", () => {
  const expected = {
    en: [/section 17/, /Toronto/, /Ontario/, /United States/, /Cloudflare/, /assessment is being prepared/],
    fr: [/article 17/, /Toronto/, /Ontario/, /États-Unis/, /Cloudflare/, /évaluation est en préparation/],
  };
  for (const [l, patterns] of Object.entries(expected))
    for (const p of patterns) assert.match(text(l, "outside-quebec"), p, l);
  assert.doesNotMatch(text("en", "outside-quebec"), /assessment (?:is|was) (?:done|complete)/i);
  assert.doesNotMatch(text("fr", "outside-quebec"), /évaluation (?:est|a été) (?:faite|terminée|réalisée)/i);
});

test("the audience sentence follows the cookieless-measure decision (krizaka-internal#3244): none today, cookieless if ever", () => {
  assert.match(text("en", "technical"), /measures no audience today/);
  assert.match(text("en", "technical"), /without a cookie, an identifier or a stored IP address/);
  assert.match(text("fr", "technical"), /ne mesure aujourd'hui aucune audience/);
  assert.match(text("fr", "technical"), /sans témoin, sans identifiant et sans adresse IP conservée/);
});

test("the privacy page's date follows this change, and the page reads it before the shared date", () => {
  assert.match(privacy("en").updated, /November 13, 2026/);
  assert.match(privacy("fr").updated, /13 novembre 2026/);
  const page = readFileSync(new URL("../app/components/LegalPage.tsx", import.meta.url), "utf8");
  assert.match(page, /"updated" in doc/, "LegalPage reads site.legal.<page>.updated first");
});

test("the privacy page claims no conformity or certification", () => {
  for (const l of LOCALES) assert.doesNotMatch(JSON.stringify(privacy(l)), /conforme|compliant|compliance|certifi/i, l);
});
