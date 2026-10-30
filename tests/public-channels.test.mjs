import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PRODUCT_RECORDS, records, templates } from "./helpers/source.mjs";

// « Or talk in public » (contact, /open-source): one entry per product of lib/products.ts and per open-source piece of
// lib/stack.ts, derived — never a hand list. A Discussions link only where the repository has Discussions on (a
// snapshot read from GitHub at build: scripts/gen-github-channels.mjs); elsewhere the question goes to an issue.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const { buildPublicChannels, repoName, discussionsUrl, issuesUrl } = await import("../lib/public-channels.ts");
const { parseChannelState } = await import("../scripts/github-channels-lib.mjs");

// Repository addresses come from the syntax trees (lib/site.ts constants, lib/products.ts, lib/stack.ts), any layout.
const orgRepo = (expr) => expr.match(/^`\$\{GITHUB_ORG_URL\}\/([\w-]+)`$/)?.[1];
const consts = Object.fromEntries(
  Object.entries(templates("lib/site.ts")).map(([name, tpl]) => [name, `https://github.com/krizaka/${orgRepo(tpl)}`]),
);
const resolve = (expr) =>
  /^https:/.test(expr) ? expr : orgRepo(expr) ? `https://github.com/krizaka/${orgRepo(expr)}` : consts[expr];
const products = PRODUCT_RECORDS().map((p) => ({ id: p.id, name: p.name, repoUrl: resolve(p.repoUrl) }));
const stack = records("lib/stack.ts", "STACK").map((p) => ({ id: p.id, name: p.name, repoUrl: resolve(p.repoUrl) }));

const state = {
  fetchedAt: "2026-10-21",
  repos: Object.fromEntries(
    [...products, ...stack].map((p) => [repoName(p.repoUrl), { discussions: false, issues: true }]),
  ),
};
state.repos.orazaka.discussions = true;
state.repos["krizaka-ui"].discussions = true;

test("the sources are read: the products in the data, the stack and the lab", () => {
  assert.ok(products.length >= 3, "products read from lib/products.ts");
  assert.deepEqual(stack.map((s) => s.id).sort(), ["java", "motion", "skills", "ts", "ui"]);
  for (const p of [...products, ...stack]) assert.match(p.repoUrl, /^https:\/\/github\.com\/krizaka\/[\w-]+$/, p.id);
});

test("every product and every open-source piece appears, in its group, once", () => {
  const groups = buildPublicChannels(products, stack, state);
  assert.deepEqual(
    groups.map((g) => g.group),
    ["products", "stack"],
  );
  assert.deepEqual(
    groups[0].entries.map((e) => e.id),
    products.map((p) => p.id),
  );
  assert.deepEqual(
    groups[1].entries.map((e) => e.id),
    stack.map((s) => s.id),
  );
});

test("every link is a valid https GitHub URL on the entry's own repository", () => {
  for (const g of buildPublicChannels(products, stack, state)) {
    for (const e of g.entries) {
      for (const link of [e.discussions.href, e.issues.href]) {
        const url = new URL(link);
        assert.equal(url.protocol, "https:");
        assert.equal(url.hostname, "github.com");
        assert.ok(url.pathname.startsWith(`/krizaka/${repoName(e.repoUrl)}/`), link);
      }
    }
  }
});

test("Discussions is linked only where it is enabled; elsewhere the question is an issue labelled question", () => {
  const entries = buildPublicChannels(products, stack, state).flatMap((g) => g.entries);
  for (const e of entries) {
    const on = state.repos[repoName(e.repoUrl)].discussions;
    assert.equal(e.discussions.viaIssue, !on, e.id);
    if (on) assert.equal(e.discussions.href, discussionsUrl(e.repoUrl));
    else {
      assert.doesNotMatch(e.discussions.href, /\/discussions/, `${e.id}: no dead Discussions page`);
      assert.match(e.discussions.href, /\/issues\/new\?labels=question$/);
    }
    assert.equal(e.issues.href, issuesUrl(e.repoUrl));
  }
  assert.ok(entries.some((e) => e.discussions.viaIssue) && entries.some((e) => !e.discussions.viaIssue));
});

test("without a snapshot (GitHub unreachable at build) nothing claims Discussions; issues are assumed on", () => {
  for (const g of buildPublicChannels(products, stack, parseChannelState(undefined)))
    for (const e of g.entries) assert.equal(e.discussions.viaIssue, true);
});

test("a repository whose issues are off is left out of nothing but gets no new-issue link claim", () => {
  const off = { repos: { ...state.repos, akinaza: { discussions: false, issues: false } } };
  const e = buildPublicChannels(products, stack, off)[0].entries.find((x) => x.id === "akinaza");
  assert.equal(
    e.issues.href,
    `${products.find((p) => p.id === "akinaza").repoUrl}`,
    "falls back to the repository itself",
  );
});

test("the snapshot parser keeps only booleans", () => {
  const s = parseChannelState({
    fetchedAt: "x",
    repos: { a: { discussions: true, issues: true }, b: { discussions: "yes" }, c: 3 },
  });
  assert.deepEqual(s.repos, { a: { discussions: true, issues: true }, b: { discussions: false, issues: true } });
});

test("both pages use the derived list; the words are messages in both languages; no hand list remains", () => {
  const src = read("lib/public-channels.ts");
  assert.doesNotMatch(src, /PUBLIC_REPOSITORIES/);
  assert.match(read("lib/github-channels.ts"), /PRODUCTS/);
  assert.match(read("lib/github-channels.ts"), /STACK/);
  assert.doesNotMatch(read("lib/github-channels.ts"), /MOTION_LAB/, "Krizaka Lab is in the stack list");
  assert.match(read("package.json"), /gen-github-channels\.mjs/, "read at build, like the other GitHub data");
  for (const f of ["app/[locale]/contact/ContactClient.tsx", "app/[locale]/open-source/page.tsx"])
    assert.doesNotMatch(read(f), /PUBLIC_REPOSITORIES/, f);
  for (const l of ["en", "fr"]) {
    const m = JSON.parse(read(`messages/${l}.json`)).site.contactPage;
    for (const k of ["groupProducts", "groupStack", "viaIssue", "discussionsAria", "issuesAria"])
      assert.ok(m[k], `${l}: ${k}`);
    assert.equal(m.publicProducts, undefined);
  }
  assert.match(read(".gitignore"), /github-channels\.json/);
});
