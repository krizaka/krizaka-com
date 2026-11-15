#!/usr/bin/env node
/* The SEO contract of the site, checked on the HTML the server really sends (issue krizaka/krizaka-com#126):
   one title (the brand once), a description, a canonical on the www host that is the page itself, hreflang fr-CA · en ·
   x-default on www, JSON-LD that parses, no apex URL anywhere, and the crawl files (robots.txt, llms.txt, sitemap).
   The share card (krizaka-internal#2833): every page has its own og:title and og:image (no two pages of a language share
   either), an og:url that is its canonical, a twitter:image, and its image answers as a PNG.
   CI runs it against the container; locally: `node scripts/check-seo.mjs --base http://localhost:3000`
   (any `--base` serves — the pages are fetched from it, the URLs they declare must stay on www).

   Usage: node scripts/check-seo.mjs --base <origin> [--limit N] */

import { fileURLToPath } from "node:url";

export const CANONICAL_HOST = "https://www.krizaka.com";
const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"];

const attr = (tag, name) => new RegExp(`${name}="([^"]*)"`, "i").exec(tag)?.[1];
const decode = (s) => s.replaceAll("&#x27;", "'").replaceAll("&quot;", '"').replaceAll("&amp;", "&");

/** What is wrong with the page's `<title>`s: exactly one, and the brand not repeated. */
function titleProblems(html) {
  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
  if (titles.length !== 1) return [`${titles.length} <title> (expected 1)`];
  if (/Krizaka[^|]*\| Krizaka \| Krizaka|\| Krizaka \| Krizaka/.test(titles[0])) {
    return [`brand repeated in title: ${titles[0]}`];
  }
  return [];
}

/** What is wrong with the meta description: exactly one, of a readable length. */
function descriptionProblems(html) {
  const desc = [...html.matchAll(/<meta\s[^>]*name="description"[^>]*>/g)].map((m) => attr(m[0], "content"));
  if (desc.length !== 1) return [`${desc.length} meta description (expected 1)`];
  const length = decode(desc[0]).length;
  return length < 30 || length > 400 ? [`description length ${length}`] : [];
}

/** What is wrong with the canonical link(s) of a page. */
function canonicalProblems(canonical, path) {
  if (canonical.length !== 1) return [`${canonical.length} canonical (expected 1)`];
  return canonical[0] === `${CANONICAL_HOST}${path}`
    ? []
    : [`canonical ${canonical[0]} is not ${CANONICAL_HOST}${path}`];
}

/** What is wrong with the hreflang alternates: each language declared, on www. */
function hreflangProblems(links) {
  const alternates = Object.fromEntries(
    links
      .filter((l) => /rel="alternate"/.test(l) && /hreflang/i.test(l))
      .map((l) => [attr(l, "hreflang"), attr(l, "href")]),
  );
  const problems = [];
  for (const lang of ["fr-CA", "en", "x-default"]) {
    if (!alternates[lang]) problems.push(`hreflang ${lang} missing`);
    else if (!alternates[lang].startsWith(`${CANONICAL_HOST}/`))
      problems.push(`hreflang ${lang} off www: ${alternates[lang]}`);
  }
  return problems;
}

/** The `@type`s declared by the JSON-LD blocks, and what is wrong with the blocks themselves. */
function jsonLdOf(blocks) {
  const problems = [];
  const types = [];
  if (blocks.length === 0) problems.push("no JSON-LD");
  for (const raw of blocks) {
    try {
      const data = JSON.parse(raw);
      for (const node of data["@graph"] ?? [data]) types.push(...[node["@type"] ?? []].flat());
      if (!data["@context"]) problems.push("JSON-LD without @context");
    } catch (e) {
      problems.push(`JSON-LD does not parse: ${e.message}`);
    }
  }
  return { types, problems };
}

/** The JSON-LD types a page of this route must declare, missing ones reported. */
function requiredTypeProblems(path, types) {
  const problems = [];
  if (path.split("/")[2] === undefined || path.split("/").length === 2) {
    for (const t of ["Organization", "WebSite"]) if (!types.includes(t)) problems.push(`home: ${t} JSON-LD missing`);
  }
  if (/^\/(en|fr)\/docs\/[^/]+\/.+/.test(path)) {
    for (const t of ["TechArticle", "BreadcrumbList"])
      if (!types.includes(t)) problems.push(`docs page: ${t} JSON-LD missing`);
  }
  return problems;
}

/** Everything wrong with one page's HTML; `path` is its route ("/en/products"). */
export function auditHtml(html, path) {
  const links = [...html.matchAll(/<link\s[^>]*>/g)].map((m) => m[0]);
  const canonical = links.filter((l) => /rel="canonical"/.test(l)).map((l) => attr(l, "href"));
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const jsonLd = jsonLdOf(blocks);
  // What the page declares to machines (links, meta tags, JSON-LD) — a documentation sample may quote the apex in its text.
  const declared = [...links, ...[...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]), ...blocks].join("\n");
  return [
    ...titleProblems(html),
    ...descriptionProblems(html),
    ...canonicalProblems(canonical, path),
    ...hreflangProblems(links),
    ...jsonLd.problems,
    ...requiredTypeProblems(path, jsonLd.types),
    ...shareProblems(html, canonical[0]),
    ...(/https:\/\/krizaka\.com/.test(declared) ? ["the apex https://krizaka.com is declared (use www)"] : []),
  ];
}

/** The page's share card as its meta tags declare it: `{ title, image, url, twitterImage }` (undefined when missing). */
export function shareCard(html) {
  const metas = [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]);
  const meta = (key, value) => {
    const tag = metas.find((m) => attr(m, key) === value);
    return tag ? decode(attr(tag, "content") ?? "") : undefined;
  };
  return {
    title: meta("property", "og:title"),
    image: meta("property", "og:image"),
    url: meta("property", "og:url"),
    twitterImage: meta("name", "twitter:image"),
  };
}

/** What is wrong with one page's share card: each tag present, and its og:url the page's canonical. */
export function shareProblems(html, canonical) {
  const card = shareCard(html);
  const missing = [
    ["title", "og:title"],
    ["image", "og:image"],
    ["twitterImage", "twitter:image"],
  ].filter(([key]) => !card[key]);
  const problems = missing.map(([, tag]) => `no ${tag}`);
  if (card.url !== canonical) {
    problems.push(`og:url ${card.url} is not the canonical ${canonical}`);
  }
  return problems;
}

/** The pages of one language that share one card's `key` with an earlier page: `[path, firstPath]` pairs. */
function sharing(cards, key) {
  const seen = new Map();
  const pairs = [];
  for (const [path, card] of cards.filter(([, c]) => c[key])) {
    const slot = `${path.split("/")[1]} ${card[key]}`;
    if (seen.has(slot)) {
      pairs.push([path, seen.get(slot)]);
    } else {
      seen.set(slot, path);
    }
  }
  return pairs;
}

/** Pages of one language that share an og:title or an og:image: each page's card is its own. `cards`: [path, card][]. */
export const sharedCards = (cards) =>
  ["title", "image"].flatMap((key) =>
    sharing(cards, key).map(([path, other]) => `${path} shares its og:${key} with ${other}`),
  );

/** Each declared image is served, as an image, by this deployment (its URL is declared on www). */
async function imageProblems(base, cards) {
  const problems = [];
  for (const [path, card] of cards.filter(([, c]) => c.image?.startsWith(`${CANONICAL_HOST}/`))) {
    const res = await fetch(`${base}${card.image.slice(CANONICAL_HOST.length)}`);
    const type = String(res.headers.get("content-type"));
    if (!res.ok || !type.startsWith("image/")) {
      problems.push(`${path}: og:image answers ${res.status} ${type}`);
    }
  }
  return problems;
}

/** robots.txt: the AI crawlers are welcome, the sitemap is on www. */
export function auditRobots(text) {
  const problems = [];
  for (const bot of AI_CRAWLERS)
    if (!new RegExp(String.raw`User-Agent: ${bot}\s+Allow: /`, "i").test(text)) problems.push(`robots.txt: ${bot} not allowed`);
  if (!text.includes(`Sitemap: ${CANONICAL_HOST}/sitemap.xml`)) problems.push("robots.txt: Sitemap is not on www");
  return problems;
}

async function main() {
  const args = process.argv.slice(2);
  const base = (args[args.indexOf("--base") + 1] ?? "http://localhost:3000").replace(/\/$/, "");
  const limit = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
  const get = async (p) => {
    const res = await fetch(`${base}${p}`, { redirect: "manual" });
    if (!res.ok) throw new Error(`${p}: HTTP ${res.status}`);
    return res.text();
  };
  let failed = 0;
  const report = (where, problems) => {
    for (const p of problems) console.error(`✗ ${where}: ${p}`);
    failed += problems.length;
  };
  report("/robots.txt", auditRobots(await get("/robots.txt")));
  for (const file of ["/llms.txt", "/llms-full.txt"]) {
    const text = await get(file);
    report(file, /https:\/\/krizaka\.com/.test(text) ? ["declares the apex"] : []);
    report(file, text.includes("{{") ? ["unfilled placeholder"] : []);
  }
  const sitemap = await get("/sitemap.xml");
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).slice(0, limit);
  // The company site, in two languages (the docs left for ui.krizaka.com and java.krizaka.com, with their own sitemaps).
  if (paths.length < 12) report("/sitemap.xml", [`only ${paths.length} URLs`]);
  const cards = [];
  for (const p of paths) {
    const html = await get(p);
    report(p, auditHtml(html, p));
    cards.push([p, shareCard(html)]);
  }
  report("share cards", sharedCards(cards));
  report("share images", await imageProblems(base, cards));
  if (failed) {
    console.error(`SEO check: ${failed} problem(s) on ${paths.length} pages`);
    process.exit(1);
  }
  console.log(`SEO check: ${paths.length} pages, robots.txt, llms.txt and llms-full.txt — all good`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
