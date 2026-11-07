import { test } from "node:test";
import assert from "node:assert/strict";
import { auditHtml, auditRobots, shareCard, sharedCards, shareProblems } from "../scripts/check-seo.mjs";

const page = (over = {}) => `<html><head><title>${over.title ?? "Sovkora | Krizaka"}</title>
<meta name="description" content="${"A description long enough to be useful to a search engine and its readers. ".repeat(1)}"/>
<link rel="canonical" href="${over.canonical ?? "https://www.krizaka.com/en/products"}"/>
<link rel="alternate" hrefLang="fr-CA" href="https://www.krizaka.com/fr/products"/>
<link rel="alternate" hrefLang="en" href="https://www.krizaka.com/en/products"/>
<link rel="alternate" hrefLang="x-default" href="https://www.krizaka.com/fr/products"/>
${over.share ?? '<meta property="og:title" content="Sovkora"/><meta property="og:url" content="https://www.krizaka.com/en/products"/><meta property="og:image" content="https://www.krizaka.com/en/products/opengraph-image?x"/><meta name="twitter:image" content="https://www.krizaka.com/en/products/opengraph-image?x"/>'}
<script type="application/ld+json">${over.ld ?? '{"@context":"https://schema.org","@type":"FAQPage"}'}</script></head><body></body></html>`;

test("a well-formed product page has no problem", () => {
  assert.deepEqual(auditHtml(page(), "/en/products"), []);
});

test("the apex canonical, a repeated brand and broken JSON-LD are caught", () => {
  const bad = auditHtml(
    page({ canonical: "https://krizaka.com/en/products", title: "X | Krizaka | Krizaka", ld: "{nope" }),
    "/en/products",
  );
  assert.ok(bad.some((p) => p.includes("canonical")));
  assert.ok(bad.some((p) => p.includes("brand repeated")));
  assert.ok(bad.some((p) => p.includes("does not parse")));
  assert.ok(bad.some((p) => p.includes("apex")));
});

test("the home without its WebSite JSON-LD is refused", () => {
  assert.ok(
    auditHtml(page({ ld: '{"@context":"https://schema.org","@type":"Organization"}' }), "/en").some((p) =>
      p.includes("WebSite"),
    ),
  );
});

test("robots.txt must welcome the AI crawlers", () => {
  const ok =
    ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]
      .map((b) => `User-Agent: ${b}\nAllow: /\n`)
      .join("\n") + "Sitemap: https://www.krizaka.com/sitemap.xml";
  assert.deepEqual(auditRobots(ok), []);
  assert.ok(auditRobots("User-Agent: *\nAllow: /").length > 1);
});

/* krizaka-internal#2833: every page shared the home's og:title, og:url and image. Each page's card is its own now. */
test("a page without its own share card, or whose og:url is not its canonical, is refused", () => {
  const none = auditHtml(page({ share: "" }), "/en/products");
  for (const tag of ["og:title", "og:image", "twitter:image"]) assert.ok(none.includes(`no ${tag}`), tag);
  const home =
    '<meta property="og:title" content="Krizaka"/><meta property="og:url" content="https://www.krizaka.com"/><meta property="og:image" content="https://www.krizaka.com/en/opengraph-image"/><meta name="twitter:image" content="x"/>';
  assert.ok(shareProblems(home, "https://www.krizaka.com/en/products")[0].includes("is not the canonical"));
  assert.equal(shareCard(page()).title, "Sovkora");
});

test("two pages of one language never share an og:title or an og:image; the other language may", () => {
  const card = (title, image) => ({ title, image });
  assert.deepEqual(
    sharedCards([
      ["/en", card("A", "i1")],
      ["/fr", card("A", "i1")],
      ["/en/docs", card("B", "i2")],
    ]),
    [],
  );
  const shared = sharedCards([
    ["/en", card("A", "i1")],
    ["/en/docs", card("A", "i1")],
  ]);
  assert.deepEqual(shared, ["/en/docs shares its og:title with /en", "/en/docs shares its og:image with /en"]);
});
