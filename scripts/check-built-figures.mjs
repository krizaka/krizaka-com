#!/usr/bin/env node
/* The built-output guard of the public figures (krizaka-internal#2806): no page the site serves says « more than 0 » or
   « plus de 0 ». A figure is read at build and rounded down (lib/figure-floor.ts); when that gives 0 the page must say
   nothing, never a figure that makes it look broken. It reads the HTML Next.js prerendered, whatever produced the zero.
   `npm run build` runs it through scripts/check-code-names.mjs, the one step that reads the built pages' words.
     node scripts/check-built-figures.mjs <dir>...   (exit 1 on a hit) */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** « more than 0 » / « plus de 0 », a whole 0 (not 0.5, not 05), once tags and comments are gone. */
const ZERO_FIGURE = /\b(more than|plus de)\s+0(?!\d|[.,]\d)/gi;

/** The HTML without its `<tag …>…</tag>` blocks (scripts, styles): what they hold is never read on the page. */
function withoutBlocks(html, tag) {
  const lower = html.toLowerCase();
  let out = "";
  let at = 0;
  for (let open = lower.indexOf(`<${tag}`, at); open >= 0; open = lower.indexOf(`<${tag}`, at)) {
    const close = lower.indexOf(`</${tag}>`, open);
    out += `${html.slice(at, open)} `;
    at = close < 0 ? html.length : close + tag.length + 3;
  }
  return out + html.slice(at);
}

/** The text between the tags: every `<…>` becomes one space (a comment, React's `<!-- -->`, is dropped whole). */
function withoutTags(html) {
  let out = "";
  let at = 0;
  for (let open = html.indexOf("<", at); open >= 0; open = html.indexOf("<", at)) {
    const [end, gap] = html.startsWith("<!--", open) ? ["-->", ""] : [">", " "];
    const close = html.indexOf(end, open);
    out += html.slice(at, open) + gap;
    at = close < 0 ? html.length : close + end.length;
  }
  return out + html.slice(at);
}

/** The visible text of an HTML document: scripts, styles, tags and comments out, entities for spaces read as spaces. */
export function visibleText(html) {
  return withoutTags(withoutBlocks(withoutBlocks(html, "script"), "style"))
    .replace(/&nbsp;|&#160;| | /g, " ")
    .replace(/\s+/g, " ");
}

/** The zero figures a page says, as the phrases found (« more than 0 », « plus de 0 »). */
export const zeroFigures = (html) => [...visibleText(html).matchAll(ZERO_FIGURE)].map((m) => m[0]);

function* htmlFiles(path) {
  if (!statSync(path).isDirectory()) {
    if (path.endsWith(".html")) {
      yield path;
    }
    return;
  }
  for (const entry of readdirSync(path)) {
    yield* htmlFiles(join(path, entry));
  }
}

/** Every built page under `roots` and the zero figures it says: `{ pages, lines }`, one line per hit (`<file>: « … »`). */
export function figureReport(roots) {
  const pages = roots.flatMap((root) => [...htmlFiles(root)]);
  const lines = pages.flatMap((file) =>
    zeroFigures(readFileSync(file, "utf8")).map((phrase) => `${file}: « ${phrase} »`),
  );
  return { pages: pages.length, lines };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const roots = process.argv.slice(2);
  if (roots.length === 0) {
    console.error("usage: node scripts/check-built-figures.mjs <dir>...");
    process.exit(2);
  }
  const { pages, lines } = figureReport(roots);
  lines.forEach((line) => console.error(line));
  console.log(`figures check: ${pages} built page(s), ${lines.length} « more than 0 ».`);
  process.exit(lines.length > 0 ? 1 : 0);
}
