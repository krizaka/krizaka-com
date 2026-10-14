// CardGrid wraps every child in its own cell (an `li` when `as="ul"`): a page that also wraps each card in an `li`
// nests the card in a block that does not stretch, so the cards of a row lose their common height and the footers
// (status, link) sit at different heights (the home's "What we build" row).
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function* sources(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* sources(path);
    else if (path.endsWith(".tsx")) yield path;
  }
}

test("no <li> wrapper directly inside a CardGrid (it makes the cells itself)", () => {
  const offenders = [];
  for (const file of sources("app")) {
    const code = readFileSync(file, "utf8");
    for (const match of code.matchAll(/<CardGrid\b[^>]*>([\s\S]*?)<\/CardGrid>/g)) {
      if (/<li[\s>]/.test(match[1])) offenders.push(file);
    }
  }
  assert.deepEqual([...new Set(offenders)], []);
});
