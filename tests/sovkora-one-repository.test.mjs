// Sovkora is one repository, krizaka/sovkora (ADR-029, krizaka-internal#2864): its other repositories became folders and
// are deleted, with no redirect. No live file links one, and the repository map of the architecture data lists the
// folders as folders of krizaka/sovkora.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const GONE = [
  "sovkora-build",
  "sovkora-contracts",
  "sovkora-engine",
  "sovkora-edge-service",
  "sovkora-conversation-service",
  "sovkora-job-service",
  "sovkora-knowledge-service",
  "sovkora-automation-service",
  "sovkora-studio-service",
  "sovkora-worker-media",
  "sovkora-packs",
  "sovkora-web",
  "sovkora-mobile",
  "sovkora-cli",
  "sovkora-ui-kit",
];
const LIVE = ["app", "lib", "content", "messages", "scripts", "AGENTS.md", "README.md"];

test("no live file names a deleted Sovkora repository", () => {
  const files = execFileSync("git", ["ls-files", "--", ...LIVE], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const gone of GONE)
      assert.doesNotMatch(text, new RegExp(`krizaka/${gone}(?![\\w-])`), `${file} names krizaka/${gone}`);
  }
});

test("the architecture data maps Sovkora's modules to folders of krizaka/sovkora", () => {
  const { repositories } = JSON.parse(readFileSync("app/data/architecture.json", "utf8"));
  const own = repositories.filter((r) => r.layer !== "krizaka");
  assert.ok(own.length > 0);
  for (const r of own) assert.equal(r.url, `https://github.com/krizaka/sovkora/tree/main/${r.path}`, r.name);
});
