import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { PRODUCTS } from "../lib/products.ts";

// Réunion 6 (2026-11-05), wave 1 (krizaka-internal#2629): one line and one status per product, the same word everywhere; the card
// says its link opens a waiting page and shows no « latest release » (a coming-soon page runs no app); « the owl knows every face »
// cannot be read as biometrics; no page claims « Loi 25, par construction » while the EFVP is not published.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const m = { fr: JSON.parse(read("messages/fr.json")), en: JSON.parse(read("messages/en.json")) };

const LINES = {
  fr: {
    verikora: "Lisez avant de signer. Verikora vérifie les papiers d'un dossier de location et cite chaque passage.",
    sovkora: "L'IA qui reste chez vous. Vos modèles, vos machines : vos données ne sortent pas.",
    folioviv: "Vos rendez-vous et vos factures réglés, vos taxes préparées.",
    kridoc: "Vos documents d'entreprise, rangés et retrouvés.",
  },
  en: {
    verikora: "Read before you sign. Verikora checks the papers of a rental file and quotes every passage.",
    sovkora: "The AI that stays home. Your models, your machines: your data stays in.",
    folioviv: "Your bookings and invoices sorted, your taxes prepared.",
    kridoc: "Your company documents, filed and found.",
  },
};

test("each product's card says the canonical line, in both languages", () => {
  for (const l of ["fr", "en"]) {
    for (const id of ["verikora", "sovkora", "folioviv"])
      assert.equal(m[l].site.products.cards[id].line, LINES[l][id], `${l}: ${id}`);
    assert.equal(m[l].site.home.products.inDesign.lines.kridoc, LINES[l].kridoc, `${l}: kridoc`);
  }
});

test("one status word per product: In development (all three), In design (Kridoc)", () => {
  const status = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.status]));
  assert.deepEqual(status, { sovkora: "development", verikora: "development", folioviv: "development" });
  const labels = (l) => Object.fromEntries(Object.entries(m[l].site.nav.status).map(([k, v]) => [k, v.label]));
  assert.equal(labels("fr").development, "En développement");
  assert.equal(labels("fr").paused, "En pause");
  assert.equal(labels("fr").design, "En conception");
  assert.equal(labels("en").development, "In development");
  assert.equal(labels("en").paused, "Paused");
  assert.equal(labels("en").design, "In design");
  assert.match(read("app/components/home/ProductShowcase.tsx"), /paused: "/, "a stamp tone for the new status");
});

test("the card's link says it opens a waiting page, and no card shows a « latest release »", () => {
  for (const l of ["fr", "en"]) {
    const p = m[l].site.products;
    const fr = l === "fr";
    assert.equal(p.visitSite, fr ? "Voir la page (bientôt ouverte)" : "See the page (opening soon)");
    assert.equal(p.visit, p.visitSite);
    assert.match(p.visitSiteAria, fr ? /page d'attente/ : /waiting page/);
    assert.equal(m[l].site.home.products.fields.latest, undefined);
    assert.equal(m[l].site.home.products.latestValue, undefined);
  }
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.doesNotMatch(
    showcase,
    /latestRelease|RELEASES|fields\.latest/,
    "AGENTS §2: no app version on a coming-soon page",
  );
  assert.ok(!existsSync(new URL("../lib/latest-release.ts", import.meta.url)), "nothing reads it any more");
});

test("the owl reads and quotes: nothing says it knows or recognises faces (it reads as biometrics)", () => {
  const faces = /chaque visage|tous les visages|every face|recogni[sz]e[sd]? (faces|visages)|reconna[iî]t/i;
  for (const l of ["fr", "en"]) assert.doesNotMatch(JSON.stringify(m[l]), faces, l);
});

test("no page claims « Loi 25, par construction » until the EFVP is published", () => {
  const claim = /Loi 25,? par construction|Law 25,? by (construction|design)/i;
  for (const l of ["fr", "en"]) assert.doesNotMatch(JSON.stringify(m[l]), claim, l);
});

test("the engine's entry on the home says Sovkora's canonical line too", () => {
  for (const l of ["fr", "en"]) assert.equal(m[l].site.home.engine.line, LINES[l].sovkora, l);
});
