#!/usr/bin/env node
/* The built-output guard: no retired code name in what the site serves (founder, 2026-11-06, krizaka-internal#2659).
   It is `krizaka-code-names` (bin of @krizaka/org) plus one narrow allow-list, scripts/code-names-allowed.json: an exact
   identifier that is a real published name (an npm package), each with its reason. A file or a page is never allowed as a
   whole. The sources keep the plain bin (`npm run lint`: messages and content).
     node scripts/check-code-names.mjs <file-or-dir>...   (exit 1 on a hit that is not allowed) */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { CODE_NAMES } from "@krizaka/org";

const ALLOWED = JSON.parse(readFileSync(new URL("./code-names-allowed.json", import.meta.url), "utf8")).tokens.map(
  (t) => t.value,
);
const SKIPPED_DIRS = new Set(["node_modules", ".git"]);
const NAME = new RegExp(Object.keys(CODE_NAMES).join("|"), "gi");
/** The characters an identifier, a package or an address is made of: a hit is judged inside its whole run of them. */
const IN_IDENTIFIER = new Set([..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@/._:-"]);

/** The identifier that holds the characters [from, to) of `line`. */
export function identifierAround(line, from, to) {
  let start = from;
  let end = to;
  while (start > 0 && IN_IDENTIFIER.has(line[start - 1])) {
    start--;
  }
  while (end < line.length && IN_IDENTIFIER.has(line[end])) {
    end++;
  }
  return line.slice(start, end);
}

/** Whether the identifier is an allowed one: it holds the allowed value, which ends there (`@1.5.0` or `/` may follow). */
export function isAllowed(identifier, allowed = ALLOWED) {
  return allowed.some((value) => {
    const at = identifier.indexOf(value);
    if (at < 0) return false;
    const next = identifier[at + value.length];
    return next === undefined || !(next === "-" || /\w/.test(next));
  });
}

/** The hits of one line that are not allowed. */
const problemsOfLine = (line, index, allowed) =>
  [...line.matchAll(NAME)]
    .map((hit) => ({
      line: index + 1,
      word: hit[0],
      identifier: identifierAround(line, hit.index, hit.index + hit[0].length),
    }))
    .filter((p) => !isAllowed(p.identifier, allowed));

/** The hits of a text that are not allowed, as `{ line, word, identifier }`. */
export const codeNameProblems = (text, allowed = ALLOWED) =>
  text.split("\n").flatMap((line, index) => problemsOfLine(line, index, allowed));

const isText = (buf) => !buf.subarray(0, 8192).includes(0);

function* files(path) {
  if (!statSync(path).isDirectory()) {
    yield path;
    return;
  }
  for (const entry of readdirSync(path)) {
    if (!SKIPPED_DIRS.has(entry)) {
      yield* files(join(path, entry));
    }
  }
}

/** The report lines of one file: `<file>:<line>: « word » in <identifier>`; none for a binary file. */
function reportOf(file) {
  const buf = readFileSync(file);
  if (!isText(buf)) {
    return [];
  }
  return codeNameProblems(buf.toString("utf8")).map(
    (p) => `${file}:${p.line}: « ${p.word} » in ${p.identifier.slice(0, 80)}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const roots = process.argv.slice(2);
  if (roots.length === 0) {
    console.error("usage: node scripts/check-code-names.mjs <file-or-dir>...");
    process.exit(2);
  }
  const lines = roots.flatMap((root) => [...files(root)].flatMap(reportOf));
  lines.forEach((line) => console.log(line));
  console.log(`${lines.length} retired code name(s) not allowed.`);
  process.exit(lines.length > 0 ? 1 : 0);
}
