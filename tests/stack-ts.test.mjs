import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Krizaka TypeScript documents itself on ts.krizaka.com (krizaka/krizaka-ts#28), like Krizaka UI and Krizaka Java: the stack points to its site.
const stack = readFileSync(new URL("../lib/stack.ts", import.meta.url), "utf8");

test("the stack sends Krizaka TypeScript to its own site and its source to the repository", () => {
  assert.match(stack, /\{ id: "ts", name: "Krizaka TypeScript", url: "https:\/\/ts\.krizaka\.com", repoUrl: `\$\{GITHUB_ORG_URL\}\/krizaka-ts`/);
});
