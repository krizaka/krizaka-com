import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { siteById } from "@krizaka/ui/sites";
import { FOCUS_IDS, HIDDEN_IDS, KONAMI, TAPS_NEEDED, TAP_WINDOW_MS, carnetOpen, focusProps, hiddenCss, inFocus, isHidden, konamiStep, namesHidden, tapStep, withCarnet } from "../lib/focus.ts";
import { PRODUCT_IDS, wwwUrl } from "../lib/product-hosts.ts";
import { BAND_TALL, BAND_WIDE, FOCUS_TALL, FOCUS_WIDE } from "../lib/products-flock.ts";

// The focus (Oussama, 2026-10-22): three products by default, the four others hidden until a Konami code opens the
// notebook whole. A visual focus: the data, the JSON-LD, llms.txt, the sitemaps and the products' sites stay whole.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const press = (keys) => keys.reduce((p, k) => konamiStep(p, k), 0);

test("the focus is exactly Orazaka, Akinaza and Yomizaka; the other four are hidden, not removed", () => {
  assert.deepEqual([...FOCUS_IDS], ["orazaka", "akinaza", "yomizaka"]);
  assert.deepEqual([...HIDDEN_IDS].sort(), ["kachizaka", "orochia", "yasakia", "yororis"]);
  assert.equal(FOCUS_IDS.length + HIDDEN_IDS.length, PRODUCT_IDS.length);
  const products = read("lib/products.ts");
  for (const id of PRODUCT_IDS) assert.match(products, new RegExp(`id: "${id}"`), `${id} stays in lib/products.ts`);
});

test("by default a list shows exactly the three; opened, all seven; bricks are never hidden", () => {
  const all = PRODUCT_IDS.map((id) => ({ id }));
  assert.deepEqual(inFocus(all, false).map((x) => x.id).sort(), ["akinaza", "orazaka", "yomizaka"]);
  assert.equal(inFocus(all, true).length, 7);
  assert.deepEqual(inFocus([{ id: "blocks" }, { id: "krizaka" }, { id: "orochia" }], false).map((x) => x.id), ["blocks", "krizaka"]);
  assert.deepEqual(focusProps("orochia"), { "data-focus": "off" });
  assert.deepEqual(focusProps("orazaka"), {});
  assert.equal(isHidden("yasakia"), true);
  assert.equal(namesHidden("canvas (Orazaka Neural Engine, Yororis Acoustic Space)"), true);
  assert.equal(namesHidden("Orazaka and Akinaza"), false);
});

test("the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A, either case, a wrong key starts over", () => {
  assert.equal(KONAMI.length, 10);
  assert.equal(press(["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]), 10);
  assert.equal(press(["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "B", "A"]), 10);
  assert.equal(press(["ArrowUp", "ArrowUp", "ArrowDown", "x", "ArrowDown"]), 0, "a wrong key resets");
  assert.equal(press(["ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowDown"]), 3, "extra ↑ before the code are forgiven");
  assert.equal(press(["x", "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]), 10, "noise before the code is forgiven");
  assert.equal(press(["ArrowUp", "ArrowUp", "ArrowUp"]), 1, "the key that breaks the series restarts it");
});

test("the state is the address: ?carnet=complet opens, removing it closes, nothing else moves", () => {
  assert.equal(carnetOpen("?carnet=complet"), true);
  assert.equal(carnetOpen("?a=1&carnet=complet"), true);
  assert.equal(carnetOpen("?carnet=autre"), false);
  assert.equal(carnetOpen(""), false);
  assert.equal(withCarnet("/fr", true), "/fr?carnet=complet");
  assert.equal(withCarnet("/fr?carnet=complet", false), "/fr");
  assert.equal(withCarnet("/en/contact?topic=orazaka#public", true), "/en/contact?topic=orazaka&carnet=complet#public");
  assert.equal(withCarnet("/en/contact?topic=orazaka&carnet=complet#public", false), "/en/contact?topic=orazaka#public");
  assert.equal(withCarnet(withCarnet("/fr#products", true), false), "/fr#products", "open then close is a round trip");
});

test("on a phone: five taps on the hint within four seconds", () => {
  let s = { taps: [], done: false };
  for (let i = 0; i < TAPS_NEEDED - 1; i++) s = tapStep(s.taps, 1000 + i * 300);
  assert.equal(s.done, false);
  assert.equal(tapStep(s.taps, 1000 + (TAPS_NEEDED - 1) * 300).done, true);
  // slow taps never add up
  let slow = { taps: [], done: false };
  for (let i = 0; i < 10; i++) slow = tapStep(slow.taps, i * (TAP_WINDOW_MS + 1));
  assert.equal(slow.done, false);
});

test("the footer is filtered by SiteFooter's `products` prop (FOCUS_IDS until the notebook is open), not by CSS on the links' addresses", () => {
  const footer = read("app/components/SiteFooter.tsx");
  assert.match(footer, /products=\{wholeNotebook \? undefined : FOCUS_IDS\}/);
  assert.match(footer, /useCarnet\(\)/);
  const css = hiddenCss();
  for (const id of HIDDEN_IDS) assert.ok(!css.includes(`footer`) && !css.includes(`a[href="${wwwUrl(id)}"]`), `${id}: no footer CSS hack`);
  for (const id of HIDDEN_IDS) assert.equal(siteById(id).url, wwwUrl(id));
  assert.match(css, /html:not\(\[data-carnet\]\)/, "the story's contents are still hidden only while the notebook is closed");
});

test("machines see everything: JSON-LD owns all products; llms.txt, sitemap and robots do not know the focus", () => {
  const ld = read("lib/structured-data.ts");
  for (const id of PRODUCT_IDS) assert.match(ld, new RegExp(`id: "${id}"`), `${id} stays owned by the Organization`);
  for (const file of ["lib/structured-data.ts", "app/sitemap.ts", "app/robots.ts", "lib/product-redirects.ts"]) {
    assert.doesNotMatch(read(file), /lib\/focus|from "\.\/focus|data-focus/, `${file} ignores the focus`);
  }
});

test("every list of products wears the focus: CSS attribute on the server, the hook where the list is data", () => {
  const files = {
    "app/components/home/HomeHero.tsx": /focusProps\(p\.id\)/,
    "app/components/home/ProductShowcase.tsx": /focusProps\(/,
    "app/components/home/ProductsFlock.tsx": /useCarnet\(\)/,
    "app/components/home/EngineFlowFocus.tsx": /useCarnet\(\)/,
    "app/components/ContactForm.tsx": /useCarnet\(\)/,
    "app/components/PublicChannelList.tsx": /focusProps\(/,
    "app/[locale]/open-source/OpenSourceTables.tsx": /useCarnet\(\)/,
    "app/[locale]/open-source/HowItFits.tsx": /focusProps\(/,
    "app/[locale]/story/page.tsx": /focusProps\(|<Mode\b/,
  };
  for (const [file, rule] of Object.entries(files)) assert.match(read(file), rule, file);
});

test("the layout sets the state before the first paint, mounts the code and the note, and carries the CSS", () => {
  const layout = read("app/[locale]/layout.tsx");
  assert.match(layout, /<CarnetScript\s*\/>/);
  assert.match(layout, /<CarnetEgg\s*\/>/);
  assert.match(layout, /hiddenCss\(\)/);
  const css = read("app/components/focus.css");
  assert.match(css, /html:not\(\[data-carnet\]\) \[data-focus="off"\]\s*\{\s*display:\s*none/);
  assert.match(css, /prefers-reduced-motion/, "the pen stroke rests under reduced motion");
});

test("the proxy keeps the query string when it adds the language (a shared ?carnet=complet link survives)", () => {
  assert.match(read("proxy.ts"), /pathname === "\/" \? "" : pathname\}\$\{request\.nextUrl\.search\}/);
});

test("the egg never blocks: the code is ignored in fields, the hint is decorative", () => {
  const egg = read("app/components/Carnet.tsx");
  assert.match(egg, /isContentEditable|INPUT|TEXTAREA|SELECT/, "typing in a field never feeds the code");
  assert.match(egg, /metaKey|ctrlKey|altKey/, "shortcuts never feed the code");
  const hint = read("app/components/PencilHint.tsx");
  assert.match(hint, /aria-hidden/);
  assert.doesNotMatch(hint, /tabIndex|role="button"|<button/, "not focusable: it is decoration");
});

test("the notebook opens with words in both languages, and a way back", () => {
  for (const l of ["en", "fr"]) {
    const c = messages(l).site.carnet;
    assert.ok(c.found.length > 10 && c.close.length > 3 && c.region.length > 3, l);
  }
  assert.match(messages("fr").site.carnet.found, /page cachée du carnet/);
  const egg = read("app/components/Carnet.tsx");
  assert.match(egg, /withCarnet\(/);
  assert.match(egg, /<a\b[^>]*href=\{/, "« refermer » is a real link");
});

test("the flock holds the three birds of the focus, the engine's flamingo in the middle and larger, all inside the frame", () => {
  for (const band of [FOCUS_WIDE, FOCUS_TALL]) {
    assert.deepEqual(band.birds.map((b) => b.product).sort(), [...FOCUS_IDS].sort());
    for (const b of band.birds) assert.ok(b.x - b.size / 2 >= 0 && b.x + b.size / 2 <= 100 && b.y > 60 && b.y < 100, b.product);
    const engine = band.birds.find((b) => b.product === "orazaka");
    assert.equal(engine.x, 50);
    assert.ok(band.birds.every((b) => b === engine || b.size < engine.size));
  }
  assert.equal(FOCUS_WIDE.ratio, BAND_WIDE.ratio);
  assert.equal(FOCUS_TALL.ratio, BAND_TALL.ratio);
  for (const [focus, whole] of [[FOCUS_WIDE, BAND_WIDE], [FOCUS_TALL, BAND_TALL]]) {
    for (const b of focus.birds) assert.equal(b.bird, whole.birds.find((x) => x.product === b.product).bird, "same bird as the whole band");
  }
});

test("a package named after a hidden product waits for the notebook too", async () => {
  const { focusTextProps } = await import("../lib/focus.ts");
  assert.deepEqual(focusTextProps("@krizaka/orochia-design-system"), { "data-focus": "off" });
  assert.deepEqual(focusTextProps("@krizaka/ui"), {});
});
