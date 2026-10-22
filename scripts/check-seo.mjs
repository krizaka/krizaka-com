#!/usr/bin/env node
/* The SEO contract of the site, checked on the HTML the server really sends (issue krizaka/krizaka-com#126):
   one title (the brand once), a description, a canonical on the www host that is the page itself, hreflang fr-CA · en ·
   x-default on www, JSON-LD that parses, no apex URL anywhere, and the crawl files (robots.txt, llms.txt, sitemap).
   CI runs it against the container; locally: `node scripts/check-seo.mjs --base http://localhost:3000`
   (any `--base` serves — the pages are fetched from it, the URLs they declare must stay on www).

   Usage: node scripts/check-seo.mjs --base <origin> [--limit N] */

import { fileURLToPath } from "node:url";

export const CANONICAL_HOST = "https://www.krizaka.com";
const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"];

const attr = (tag, name) => new RegExp(`${name}="([^"]*)"`, "i").exec(tag)?.[1];
const decode = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

/** Everything wrong with one page's HTML; `path` is its route ("/en/products"). */
export function auditHtml(html, path) {
  const problems = [];
  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
  if (titles.length !== 1) problems.push(`${titles.length} <title> (expected 1)`);
  else if (/Krizaka[^|]*\| Krizaka \| Krizaka|\| Krizaka \| Krizaka/.test(titles[0])) problems.push(`brand repeated in title: ${titles[0]}`);
  const desc = [...html.matchAll(/<meta\s[^>]*name="description"[^>]*>/g)].map((m) => attr(m[0], "content"));
  if (desc.length !== 1) problems.push(`${desc.length} meta description (expected 1)`);
  else if (decode(desc[0]).length < 30 || decode(desc[0]).length > 400) problems.push(`description length ${decode(desc[0]).length}`);

  const links = [...html.matchAll(/<link\s[^>]*>/g)].map((m) => m[0]);
  const canonical = links.filter((l) => /rel="canonical"/.test(l)).map((l) => attr(l, "href"));
  if (canonical.length !== 1) problems.push(`${canonical.length} canonical (expected 1)`);
  else if (canonical[0] !== `${CANONICAL_HOST}${path}`) problems.push(`canonical ${canonical[0]} is not ${CANONICAL_HOST}${path}`);

  const alternates = Object.fromEntries(
    links.filter((l) => /rel="alternate"/.test(l) && /hreflang/i.test(l)).map((l) => [attr(l, "hreflang"), attr(l, "href")]),
  );
  for (const lang of ["fr-CA", "en", "x-default"]) {
    if (!alternates[lang]) problems.push(`hreflang ${lang} missing`);
    else if (!alternates[lang].startsWith(`${CANONICAL_HOST}/`)) problems.push(`hreflang ${lang} off www: ${alternates[lang]}`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) problems.push("no JSON-LD");
  const types = [];
  for (const raw of blocks) {
    try {
      const data = JSON.parse(raw);
      for (const node of data["@graph"] ?? [data]) types.push(...[].concat(node["@type"] ?? []));
      if (!data["@context"]) problems.push("JSON-LD without @context");
    } catch (e) {
      problems.push(`JSON-LD does not parse: ${e.message}`);
    }
  }
  if (path.split("/")[2] === undefined || path.split("/").length === 2) {
    for (const t of ["Organization", "WebSite"]) if (!types.includes(t)) problems.push(`home: ${t} JSON-LD missing`);
  }
  if (/^\/(en|fr)\/docs\/[^/]+\/.+/.test(path)) {
    for (const t of ["TechArticle", "BreadcrumbList"]) if (!types.includes(t)) problems.push(`docs page: ${t} JSON-LD missing`);
  }
  // What the page declares to machines (links, meta tags, JSON-LD) — a documentation sample may quote the apex in its text.
  const declared = [...links, ...[...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]), ...blocks].join("\n");
  if (/https:\/\/krizaka\.com/.test(declared)) problems.push("the apex https://krizaka.com is declared (use www)");
  return problems;
}

/** robots.txt: the AI crawlers are welcome, the sitemap is on www. */
export function auditRobots(text) {
  const problems = [];
  for (const bot of AI_CRAWLERS) if (!new RegExp(`User-Agent: ${bot}\\s+Allow: /`, "i").test(text)) problems.push(`robots.txt: ${bot} not allowed`);
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
  for (const p of paths) report(p, auditHtml(await get(p), p));
  if (failed) {
    console.error(`SEO check: ${failed} problem(s) on ${paths.length} pages`);
    process.exit(1);
  }
  console.log(`SEO check: ${paths.length} pages, robots.txt, llms.txt and llms-full.txt — all good`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
