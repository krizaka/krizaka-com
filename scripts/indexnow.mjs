#!/usr/bin/env node
/* IndexNow ping (Bing, Yandex, Seznam, Naver…): tells the search engines which URLs changed, right after a deploy.
   The key is public by design — the protocol checks that https://<host>/<key>.txt serves it (public/<key>.txt).

   Usage: node scripts/indexnow.mjs [--dry-run] [--site https://www.krizaka.com] */

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SITE = "https://www.krizaka.com";

/** The IndexNow key: the only 32-hex `<key>.txt` of public/ whose content is its own name. */
export function findKey(dir = path.join(ROOT, "public")) {
  const keys = readdirSync(dir)
    .filter((f) => /^[0-9a-f]{32}\.txt$/.test(f))
    .map((f) => f.slice(0, -4))
    .filter((k) => readFileSync(path.join(dir, `${k}.txt`), "utf8").trim() === k);
  if (keys.length !== 1) throw new Error(`IndexNow: expected one key file in public/, found ${keys.length}`);
  return keys[0];
}

/** The <loc> of a sitemap, as a list (a flat urlset — the site has one). */
export function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

export function payload(site, key, urlList) {
  const host = new URL(site).host;
  return { host, key, keyLocation: `${site}/${key}.txt`, urlList };
}

async function main() {
  const args = process.argv.slice(2);
  const site = args.includes("--site") ? args[args.indexOf("--site") + 1] : SITE;
  const key = findKey();
  const res = await fetch(`${site}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap: HTTP ${res.status}`);
  const body = payload(site, key, sitemapUrls(await res.text()));
  if (args.includes("--dry-run")) {
    console.log(`IndexNow (dry run): ${body.urlList.length} URLs for ${body.host}, key file ${body.keyLocation}`);
    return;
  }
  const ping = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: ${body.urlList.length} URLs submitted, HTTP ${ping.status}`);
  if (ping.status >= 400) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
