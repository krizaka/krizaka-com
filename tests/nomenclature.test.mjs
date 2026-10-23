import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { nomenclature, assertNomenclature, repositoryOfUrl } from "../lib/nomenclature.ts";

const repo = (name, topics = [], description = `${name} line`) => ({ name, description, url: `https://github.com/krizaka/${name}`, topics, language: null, archived: false });
const input = {
  repositories: [repo("orazaka"), repo("orazaka-edge", ["spring-boot"]), repo("orochia-mobile", ["expo"]), repo("krizaka-ui", ["npm-package"]), repo("krizaka-users", ["java"]), repo("krizaka-com", ["website"]), repo(".github", ["community-health"])],
  snapshot: {
    npm: { "@krizaka/ui": "3.1.0" },
    npmMeta: { "@krizaka/ui": { description: "Components", repository: "https://github.com/krizaka/krizaka-ui" } },
    maven: { "krizaka-users-service": "0.2.0", "krizaka-security": "0.3.0" },
    mavenMeta: { "krizaka-users-service": { parent: "krizaka-users" }, "krizaka-users": { parent: "krizaka-parent" }, "krizaka-security": { parent: "krizaka-platform-kit" }, "krizaka-platform-kit": { parent: "krizaka-parent" } },
  },
  manifests: { orochia: { npm: ["@krizaka/ui"], maven: [] }, orazaka: { npm: [], maven: ["krizaka-security"] } },
  products: ["orazaka", "orochia"],
  engineId: "orazaka",
  engineCallers: ["orochia"],
  javaDocs: "https://java.krizaka.com",
};

test("the nomenclature carries every repository, grouped by layer: products → engine → blocks → services → platform", () => {
  const rows = nomenclature(input);
  const by = Object.fromEntries(rows.map((r) => [r.id, r]));
  assert.deepEqual(rows.map((r) => r.layer), ["products", "engine", "engine", "blocks", "blocks", "services", "platform", "platform"]);
  assert.equal(by.orazaka.kind, "engine");
  assert.equal(by["orazaka-edge"].kind, "worker");
  assert.equal(by["orochia-mobile"].layer, "products");
  assert.equal(by["krizaka-ui"].kind, "package");
  assert.deepEqual(by["krizaka-ui"].publications, [{ registry: "npm", name: "@krizaka/ui", version: "3.1.0", url: "https://www.npmjs.com/package/@krizaka/ui" }]);
  assert.deepEqual(by["krizaka-ui"].usedBy, ["orochia"]);
  assert.equal(by["krizaka-users"].layer, "services");
  assert.equal(by["krizaka-users"].publications[0].registry, "maven");
  assert.equal(by["krizaka-com"].kind, "site");
  assert.equal(by[".github"].kind, "tooling");
  assert.deepEqual(by.orazaka.usedBy, ["orochia"]);
});

test("a published module without a repository still has its row, with no link", () => {
  const rows = nomenclature(input);
  const kit = rows.find((r) => r.id === "maven:krizaka-platform-kit");
  assert.equal(kit.layer, "blocks");
  assert.equal(kit.kind, "java");
  assert.equal(kit.repoUrl, undefined);
  assert.deepEqual(kit.usedBy, ["orazaka"]);
});

test("a public repository missing from the map fails the build", () => {
  const rows = nomenclature(input);
  assert.throws(() => assertNomenclature([...input.repositories, repo("krizaka-new")], rows), /misses 1 public repository: krizaka-new/);
  assertNomenclature(input.repositories, rows);
});

test("a repository's name is read from its GitHub URL", () => {
  assert.equal(repositoryOfUrl("https://github.com/krizaka/krizaka-build.git"), "krizaka-build");
  assert.equal(repositoryOfUrl("https://github.com/krizaka/krizaka-ts/tree/main/x"), "krizaka-ts");
  assert.equal(repositoryOfUrl("https://example.com/x"), undefined);
});

test("/open-source carries « La nomenclature », generated, with no module typed in the page", () => {
  const page = readFileSync(new URL("../app/[locale]/open-source/page.tsx", import.meta.url), "utf8");
  assert.match(page, /<Section id="nomenclature"/);
  assert.match(page, /<NomenclatureTable rows=\{modules\} \/>/);
  assert.match(page, /nomenclature\(\{/);
});
