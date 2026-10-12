#!/usr/bin/env node
/* The Yororis lexicon test (AGENTS.md §2.1) — name what it does, never what it would heal.

   Yororis is a listening space, under construction: the words of the site that speak about it must never make a care
   claim, never describe the presence as a person or a professional, never turn the limits into a scarcity to sell, and
   never promise an availability that does not exist (no beta, no waiting list, no "coming soon"). This script reads:
   - every message of messages/{en,fr}.json whose key path contains "yororis" (site.yororis.*, site.nav.yororis.*,
     site.products.yororis, the contact topic, the docs section, the story chapter…);
   - the written Yororis documentation (content/docs/yororis/**.mdx);
   and fails on any word of the "never" column (NEVER below, English and French), matched as whole words.

   Reviewed texts — the "under construction" statement and "What Yororis is not" (site.yororis.reviewed.*) — deny some
   of these words on purpose ("not care"). They are exempt wherever they appear verbatim, and protected instead: their
   fingerprint lives in scripts/lexicon-reviewed.json, so changing one fails until the change is acknowledged with its
   date (`npm run lexicon -- --accept-review YYYY-MM-DD`) — and that date is what the lawyer's review refers to.

   Usage: node scripts/lexicon.mjs [--accept-review YYYY-MM-DD] */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REVIEWED_FILE = path.join(ROOT, "scripts/lexicon-reviewed.json");
const DOCS_DIR = path.join(ROOT, "content/docs/yororis");
const LOCALES = ["en", "fr"];

/** The "never" column (prompts-yororis.md §2.1) plus construction mode's words. `*` = any ending. */
export const NEVER = {
  en: [
    // care and its vocabulary
    "therap*", "psychotherap*", "psycholog*", "psychiatr*", "counselling", "counseling", "counsellor*", "counselor*", "coach*",
    "treatment*", "treat", "treats", "treating", "heal", "heals", "healing", "cure", "cures", "diagnos*", "mental health",
    "health app", "clinical*", "clinic", "clinics", "medical*", "patient", "patients", "cbt", "clinically", "proven", "effective",
    // the presence is not a person, a professional or a companion
    "companion*", "virtual assistant", "realistic", "indistinguishable", "i miss you", "i love you", "24/7",
    // the encounter is a moment, never a session
    "session", "sessions", "consultation*",
    // limits are not a scarcity to sell
    "quota*", "credit", "credits", "streak*", "reward*", "unlock*",
    // no inference of feelings, no risk vocabulary
    "anxiety", "depress*", "emotion detection", "emotion recognition", "sentiment*", "mood score", "emotional score",
    "suicid*", "risk", "alert", "real-time translation",
    // construction mode: nothing is offered
    "beta", "early access", "waitlist*", "waiting list", "coming soon", "soon", "launch*", "pre-order*", "preorder*",
    "sign up", "sign-up", "signup", "register", "reserve your spot",
    // categories
    "medicalapplication", "healthapplication",
  ],
  fr: [
    "thérap*", "psychothérap*", "psy", "psys", "psychologue*", "psychiatr*", "conseillère*", "conseiller", "conseillers",
    "coach*", "intervenant*", "soin", "soins", "traitement*", "traiter", "soigner", "guérir", "soulager", "diagnost*",
    "santé mentale", "app de santé", "service de santé", "clinique*", "médic*", "programme d'aide", "cliniquement",
    "efficace*", "prouvé*", "tcc", "thérapeutique*",
    "compagne", "compagnes", "compagnon", "compagnons", "assistante virtuelle", "assistant virtuel", "réaliste",
    "indiscernable", "tu me manques", "je t'aime", "24/7",
    "patient", "patiente", "patients", "patientes", "bénéficiaire*", "usager*", "usagère*",
    "séance*", "consultation*", "session*", "entretien*",
    "quota*", "crédit*", "limite atteinte", "épuisé*", "série", "séries", "récompense*", "débloquer",
    "dossier*", "bilan*", "compte rendu", "synthèse clinique", "notes de séance", "profil psychologique", "suivi",
    "évaluation*", "évaluer", "analyser", "interpréter", "intervenir",
    "anxiété", "dépression*", "détection d'émotion*", "analyse de sentiment*", "humeur détectée", "on a remarqué",
    "urgence détectée", "risque*", "alerte*", "suicid*", "traduction en temps réel",
    "bêta", "accès anticipé", "liste d'attente", "bientôt", "lancement", "précommande*", "inscription*", "inscrire",
    "inscrivez*", "réservez votre place", "coming soon",
  ],
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A whole-word (or whole-phrase) matcher; a trailing `*` accepts any ending. Apostrophes are normalised. */
function matcher(term) {
  const prefix = term.endsWith("*");
  const body = escape(norm(prefix ? term.slice(0, -1) : term)).replace(/ /g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}${prefix ? "[\\p{L}\\p{N}]*" : ""}(?![\\p{L}\\p{N}])`, "giu");
}
const norm = (s) => s.normalize("NFC").replace(/[’‘]/g, "'").toLowerCase();
const MATCHERS = Object.fromEntries(Object.entries(NEVER).map(([lang, terms]) => [lang, terms.map((term) => [term, matcher(term)])]));

/** Every string leaf of a message tree, with its key path. */
function* leaves(node, at = []) {
  if (typeof node === "string") yield [at.join("."), node];
  else if (Array.isArray(node)) for (const [i, v] of node.entries()) yield* leaves(v, [...at, String(i)]);
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) yield* leaves(v, [...at, k]);
}

const isYororisKey = (key) => /yororis/i.test(key);
const isReviewedKey = (key) => key.startsWith("site.yororis.reviewed.");

/** The words of `text` from the "never" column of `lang`, once the reviewed sentences it quotes are set aside. */
export function violations(text, lang, reviewed = []) {
  let rest = norm(text);
  for (const sentence of reviewed) rest = rest.split(norm(sentence)).join(" ");
  const found = [];
  for (const [term, re] of MATCHERS[lang]) {
    re.lastIndex = 0;
    const hit = re.exec(rest);
    if (hit) found.push({ term, word: hit[0] });
  }
  return found;
}

function load(lang) {
  return JSON.parse(readFileSync(path.join(ROOT, `messages/${lang}.json`), "utf8"));
}

/** The reviewed texts of both languages, and their fingerprint. */
export function reviewedTexts() {
  const texts = {};
  for (const lang of LOCALES) texts[lang] = [...leaves(load(lang))].filter(([key]) => isReviewedKey(key)).map(([, text]) => text);
  const hash = createHash("sha256").update(JSON.stringify(texts)).digest("hex");
  return { texts, hash };
}

function mdxFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? mdxFiles(full) : full.endsWith(".mdx") ? [full] : [];
  });
}

/** Every finding of the site: [{ where, term, word }]. */
export function check() {
  const { texts, hash } = reviewedTexts();
  const allReviewed = [...texts.en, ...texts.fr];
  const findings = [];
  for (const lang of LOCALES) {
    for (const [key, text] of leaves(load(lang))) {
      if (!isYororisKey(key) || isReviewedKey(key)) continue;
      for (const v of violations(text, lang, texts[lang])) findings.push({ where: `messages/${lang}.json → ${key}`, ...v });
    }
  }
  // The written docs are English (developer documentation), with a French summary allowed: both lists apply.
  for (const file of mdxFiles(DOCS_DIR)) {
    const text = readFileSync(file, "utf8");
    for (const lang of LOCALES) for (const v of violations(text, lang, allReviewed)) findings.push({ where: path.relative(ROOT, file), ...v });
  }
  const recorded = existsSync(REVIEWED_FILE) ? JSON.parse(readFileSync(REVIEWED_FILE, "utf8")) : {};
  return { findings, hash, recorded };
}

function main() {
  const at = process.argv.indexOf("--accept-review");
  if (at > 0) {
    const date = process.argv[at + 1];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
      console.error("Usage: node scripts/lexicon.mjs --accept-review YYYY-MM-DD");
      process.exit(2);
    }
    const { hash } = reviewedTexts();
    const previous = existsSync(REVIEWED_FILE) ? JSON.parse(readFileSync(REVIEWED_FILE, "utf8")) : {};
    writeFileSync(REVIEWED_FILE, JSON.stringify({ ...previous, changedOn: date, sha256: hash }, null, 2) + "\n");
    console.log(`Reviewed texts acknowledged on ${date}.`);
    return;
  }
  const { findings, hash, recorded } = check();
  let failed = false;
  if (findings.length) {
    failed = true;
    console.error(`Yororis lexicon: ${findings.length} word(s) from the "never" column (prompts-yororis.md §2.1):`);
    for (const f of findings) console.error(`  ${f.where}: "${f.word}" (never: ${f.term})`);
  }
  if (recorded.sha256 !== hash) {
    failed = true;
    console.error(
      "Yororis lexicon: a reviewed text changed (site.yororis.reviewed.*). It must be read again before it ships: " +
        "acknowledge the change with `npm run lexicon -- --accept-review YYYY-MM-DD` and say so in the pull request.",
    );
  }
  if (failed) process.exit(1);
  console.log(`Yororis lexicon: clean (${NEVER.en.length + NEVER.fr.length} words checked; reviewed texts unchanged since ${recorded.changedOn}).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
