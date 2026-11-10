// node --test: the drift workflow opens its pull request with the app token (krizaka-internal#2158).
// GitHub starts no workflow for an event made with github.token: krizaka-com#673 sat at « Action required », its required checks
// never started, and nothing said why. A workflow that goes back to github.token is refused here, not found on a stuck pull request.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync(new URL("../.github/workflows/drift.yml", import.meta.url), "utf8");
const code = source
  .split("\n")
  .filter((line) => !/^\s*#/.test(line))
  .join("\n");
const job = code.slice(code.indexOf("\n  drift:\n"));
const steps = job.split(/^ {6}- /m).slice(1);
const APP_TOKEN = "${{ steps.app.outputs.token }}";

describe("the drift pull request starts its required checks", () => {
  it("never uses the workflow token", () => {
    assert.doesNotMatch(code, /github\.token|secrets\.GITHUB_TOKEN/);
  });

  it("mints the app token before anything else, pinned by commit", () => {
    assert.match(steps[0], /^id: app\n/);
    assert.match(steps[0], /uses: actions\/create-github-app-token@[0-9a-f]{40} # v/);
    assert.match(steps[0], /app-id: \$\{\{ vars\.RELEASE_APP_ID \}\}/);
    assert.match(steps[0], /private-key: \$\{\{ secrets\.RELEASE_APP_PRIVATE_KEY \}\}/);
  });

  it("pushes the branch with the app token", () => {
    const checkout = steps.find((s) => s.includes("actions/checkout@"));
    assert.ok(checkout.includes(`token: ${APP_TOKEN}`), "the checkout that the push relies on holds the app token");
  });

  it("opens the pull request with the app token", () => {
    const opener = steps.find((s) => s.includes("gh pr create"));
    assert.ok(opener, "a step opens the pull request");
    assert.ok(opener.includes(`GH_TOKEN: ${APP_TOKEN}`), "gh pr create runs with the app token");
  });

  it("commits as the app, in the form the commit-trailers check accepts", () => {
    assert.match(job, /git config user\.email "345578919\+krizaka-agents\[bot\]@users\.noreply\.github\.com"/);
  });

  it("asks the workflow token for nothing it no longer uses", () => {
    assert.match(job, /^ {4}permissions:\n {6}contents: read(?: #[^\n]*)?\n(?! {6})/m);
  });
});
