import { test } from "node:test";
import assert from "node:assert/strict";
import { records } from "./helpers/source.mjs";

// Krizaka TypeScript documents itself on ts.krizaka.com (krizaka/krizaka-ts#28), like Krizaka UI and Krizaka Java: the stack points to its site.

test("the stack sends Krizaka TypeScript to its own site and its source to the repository", () => {
  const ts = records("lib/stack.ts", "STACK").find((p) => p.id === "ts");
  assert.equal(ts?.name, "Krizaka TypeScript");
  assert.equal(ts.url, "https://ts.krizaka.com");
  assert.equal(ts.repoUrl, "`${GITHUB_ORG_URL}/krizaka-ts`");
});
