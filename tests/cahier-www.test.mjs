import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// www.krizaka.com in the Cahier (krizaka-ui ADR-004, #417): the home is a field notebook — an asymmetric first page with
// the flock's plate, every section numbered in the margin instead of an uppercase eyebrow, and the site's own styles free
// of the template tells (caps, tracking, blur, glow, washes, pills on the chrome).
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const hero = read("app/components/home/HomeHero.tsx");
const home = read("app/components/home/home.css");
const msgs = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };

test("the first page is asymmetric: the words on the left, Plate I of the flock on the right, never centred", () => {
  assert.match(hero, /from "@krizaka\/ui\/bird-plate"/);
  assert.match(hero, /<BirdPlate\b/);
  for (const b of ["falcon", "owl", "duck", "flamingo", "pigeon"]) assert.match(hero, new RegExp(`bird: "${b}"`), b);
  assert.match(hero, /t\.site\.story\.world\.cues|cues\[/, "the plate's lines are the film's cues");
  const inner = home.match(/\.kz-home-hero-inner \{([^}]*)\}/)?.[1] ?? "";
  assert.doesNotMatch(inner, /text-align: center|align-items: center/, "a centred hero");
  assert.match(home, /\.kz-home-hero-grid \{[^}]*grid-template-columns/);
});

test("every section of the home is numbered in the margin (§ n), none carries an eyebrow", () => {
  const sections = ["HomeHero", "ProductShowcase", "OpenStack", "Principles", "Company", "ContactCta"];
  for (const s of sections) assert.doesNotMatch(read(`app/components/home/${s}.tsx`), /eyebrow=/, `${s} still has an eyebrow`);
  for (const s of ["OpenStack", "Principles", "Company", "ContactCta"]) assert.match(read(`app/components/home/${s}.tsx`), /\.number\}/, `${s} has no number`);
  for (const l of ["en", "fr"]) {
    const h = msgs[l].site.home;
    assert.deepEqual([h.hero.number, h.products.number, h.stack.number, h.principles.number, h.company.number, h.contact.number], ["§ 1", "§ 2", "§ 3", "§ 4", "§ 5", "§ 6"], l);
  }
});

test("the site's own styles carry no template tell", () => {
  const files = ["app/globals.css", "app/components/home/home.css", "app/[locale]/open-source/open-source.css", "app/[locale]/contact/ContactClient.tsx", "app/components/SearchCommand.tsx", "app/components/DocsCrumb.tsx", "app/components/ProductStatus.tsx"];
  for (const f of files) {
    const src = read(f).replace(/\/\*[\s\S]*?\*\//g, "");
    assert.doesNotMatch(src, /text-transform:\s*uppercase|textTransform: "uppercase"|["'\s]uppercase["'\s]/, `${f}: uppercase`);
    assert.doesNotMatch(src, /letter-spacing:\s*\.?0?\.[1-9]\d*em|tracking-(wide|wider|widest|\[0\.)/, `${f}: tracked caps`);
    assert.doesNotMatch(src, /blur\(|backdropFilter|backdrop-blur|radial-gradient|drop-shadow\(/, `${f}: a blur or a glow`);
    assert.doesNotMatch(src, /border-radius:\s*(1[0-9]|[2-9][0-9]|999)px|rounded-full/, `${f}: a round card or a pill`);
  }
  assert.doesNotMatch(read("app/globals.css"), /bp-glide \{ background: linear-gradient/, "the brand wash between sections");
});

test("the hero keeps its contract: one primary action, server-rendered, the figures before the scene", () => {
  assert.equal(hero.match(/variant="primary"/g)?.length, 1);
  assert.doesNotMatch(hero, /"use client"|data-reveal/);
  assert.ok(hero.indexOf("kz-home-proofs") < hero.indexOf("kz-home-scene"));
});
