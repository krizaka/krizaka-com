import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { openSourceRepositories } from "../lib/repository-catalogue.ts";
import { packageRows } from "../lib/package-catalogue.ts";
import { howItFits } from "../lib/how-it-fits.ts";
import { cssDecls, cssHas, cssSelectors, jsx } from "./helpers/source.mjs";

// 2026-10-26 (Oussama): the libraries leave the home and live on /open-source; /open-source lists only what is open source —
// the products are operated by Krizaka; the cards are pinned tags, slightly tilted, straight under reduced motion.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const PRODUCTS = ["orazaka", "yomizaka", "akinaza"];

test("the home has no library block: the stack rows are gone, /open-source carries the stack", () => {
  const home = read("app/[locale]/page.tsx");
  assert.doesNotMatch(home, /OpenStack|StackCards|StackRow/);
  assert.ok(
    !/export default/.test(read("app/components/home/OpenStack.tsx")),
    "OpenStack keeps only the cards of /open-source and /story",
  );
  assert.ok(!existsSync(new URL("../app/components/home/stack", import.meta.url)), "the rows' visuals are gone");
  assert.match(read("app/[locale]/story/page.tsx"), /<StackTiles locale=\{locale\} \/>/);
  assert.doesNotMatch(read("lib/home-sections.ts"), /"stack"/);
});

test("no product in the open-source repositories", () => {
  const repos = [
    "krizaka-ui",
    "krizaka-ts",
    "krizaka-build",
    "orazaka",
    "orazaka-cli",
    "orazaka-edge",
    "yomizaka",
    "akinaza",
    "template-next-app",
  ].map((name) => ({ name, archived: false }));
  assert.deepEqual(
    openSourceRepositories(repos, PRODUCTS).map((r) => r.name),
    ["krizaka-ui", "krizaka-ts", "krizaka-build", "template-next-app"],
  );
});

test("no product package in the open-source packages", () => {
  const snapshot = {
    npm: {
      "@krizaka/ui": "1.0.0",
      "@krizaka/orazaka-cli": "1.0.0",
      "@krizaka/orazaka-shared": "1.0.0",
      "@krizaka/orazaka-client": "1.0.0",
    },
    npmMeta: {
      "@krizaka/ui": { repository: "https://github.com/krizaka/krizaka-ui" },
      "@krizaka/orazaka-cli": { repository: "https://github.com/krizaka/orazaka-cli" },
      "@krizaka/orazaka-shared": { repository: "https://github.com/krizaka/orazaka-ui-kit" },
      "@krizaka/orazaka-client": { repository: "https://github.com/krizaka/krizaka-ts" },
    },
    maven: {},
  };
  const names = packageRows(snapshot, [], "https://java.example", PRODUCTS).map((r) => r.name);
  assert.deepEqual(
    names,
    ["@krizaka/orazaka-client", "@krizaka/ui"],
    "a library stays, even one that talks to a product",
  );
});

test("how it fits has no product and no engine layer", () => {
  const layers = howItFits({ orazaka: { npm: ["@krizaka/ui"], maven: ["krizaka-bom"] } }, {}, {});
  assert.deepEqual(Object.keys(layers), ["blocks", "services"]);
  assert.match(read("app/[locale]/docs/HowItFits.tsx"), /os-fits/);
  assert.doesNotMatch(read("app/[locale]/docs/HowItFits.tsx"), /ProductLogo|brand-/);
});

test("the open-source page and its tables name no product, claim no licence for one", () => {
  const page = read("app/[locale]/docs/page.tsx");
  assert.match(page, /openSourceRepositories\(allRepositories, PRODUCT_IDS\)/);
  assert.doesNotMatch(page, /ProductStackTable|ENGINE_USES|runs-on/);
  const tables = read("app/[locale]/docs/OpenSourceTables.tsx");
  assert.doesNotMatch(tables, /id: "product"|usedBy/);
  for (const lang of ["en", "fr"]) {
    const o = JSON.parse(read(`messages/${lang}.json`)).site.openSource;
    assert.equal(o.repositories.product, undefined, lang);
    assert.equal(o.runs, undefined, lang);
    const words = JSON.stringify([o.title, o.lead, o.fits, o.repositories]);
    for (const name of ["Orazaka", "Yomizaka", "Akinaza"])
      assert.doesNotMatch(words, new RegExp(name), `${lang}: ${name}`);
  }
  assert.match(JSON.parse(read("messages/en.json")).site.openSource.lead, /operated by Krizaka/);
});

test("the cards are pinned tags: tilted one way then the other, straight under reduced motion and on focus", () => {
  const css = "app/components/home/home.css";
  const sel = (s) => cssSelectors(css).find((x) => x.endsWith(s)) ?? s;
  assert.equal(cssDecls(css, sel(":nth-child(odd) .kz-entry-tag")).transform, "rotate(-0.6deg)");
  assert.equal(cssDecls(css, sel(":nth-child(even) .kz-entry-tag")).transform, "rotate(0.5deg)");
  assert.equal(
    cssDecls(css, sel(".kz-entry-tag:focus-within")).transform,
    "none",
    "the focus ring is never drawn tilted",
  );
  const reduced = { within: "(prefers-reduced-motion: reduce)" };
  const rule = (s) => cssDecls(css, s, reduced);
  const flat = cssSelectors(css).filter((s) => s.endsWith(".kz-entry-tag") && cssHas(css, s, reduced));
  assert.ok(flat.length > 0 && flat.every((s) => rule(s).transform === "none" && rule(s).transition === "none"));
  // The reduced-motion rule must be at least as specific as the tilt rules (:nth-child(n) matches the pseudo-class weight).
  assert.ok(flat.some((s) => s.includes(":nth-child(n)")));
  assert.ok(
    !jsx("app/components/home/ProductShowcase.tsx").some((e) => /rotate/.test(e.attrs.style ?? "")),
    "no inline style",
  );
});

test("the visuals show what the apps show: the finding with its law, the service card with its receipt, said as demo", () => {
  const visuals = read("app/components/home/visuals/ProductVisuals.tsx");
  for (const k of ["v.finding", "v.badge", "v.law", "v.includes", "v.choose", "receipt("])
    assert.ok(visuals.includes(k), k);
  const css = read("app/components/home/visuals/visuals.css");
  assert.match(css, /aspect-ratio: 16 \/ 9/, "a fixed box");
  assert.match(css, /prefers-reduced-motion: reduce/);
  for (const lang of ["en", "fr"]) {
    const v = JSON.parse(read(`messages/${lang}.json`)).site.home.visuals;
    assert.match(v.yomizaka.demo, /demo|démo/i, lang);
    assert.match(v.akinaza.booked, /demo|démo/i, lang);
  }
});
