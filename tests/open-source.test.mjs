import { test } from "node:test";
import assert from "node:assert/strict";
import { kindOfRepository, productOfRepository, repositoriesOf } from "../lib/repository-catalogue.ts";
import { groupOfPackage, groupPackages, summary } from "../lib/npm-catalogue.ts";

const PRODUCTS = ["orazaka", "orochia", "yazakia", "yororis"];
const repo = (name, topics = [], archived = false) => ({ name, description: "", url: `https://github.com/krizaka/${name}`, topics, language: null, archived });

test("a repository belongs to the product it is named after, anything else to the platform", () => {
  assert.equal(productOfRepository("orochia", PRODUCTS), "orochia");
  assert.equal(productOfRepository("orochia-admin", PRODUCTS), "orochia");
  assert.equal(productOfRepository("yororis-mobile", PRODUCTS), "yororis");
  assert.equal(productOfRepository("krizaka-ui", PRODUCTS), "krizaka");
  assert.equal(productOfRepository(".github", PRODUCTS), "krizaka");
  // A prefix is a whole segment: "orazakatools" is not Orazaka's.
  assert.equal(productOfRepository("orazakatools", PRODUCTS), "krizaka");
});

test("the kind of a repository comes from its topics", () => {
  assert.equal(kindOfRepository(repo("orazaka"), "orazaka"), "main");
  assert.equal(kindOfRepository(repo("orochia-mobile", ["expo", "react-native"]), "orochia"), "mobile");
  assert.equal(kindOfRepository(repo("orochia-design-system", ["design-system", "react", "npm-package"]), "orochia"), "library");
  assert.equal(kindOfRepository(repo("orazaka-ui-kit", ["react-native", "npm-package"]), "orazaka"), "library");
  assert.equal(kindOfRepository(repo("orazaka-edge", ["java", "spring-boot"]), "orazaka"), "service");
  assert.equal(kindOfRepository(repo("orazaka-cli", ["cli", "typescript"]), "orazaka"), "tooling");
  assert.equal(kindOfRepository(repo("orochia-admin", ["nextjs", "bff"]), "orochia"), "web");
  assert.equal(kindOfRepository(repo("x-y", []), "x"), "other");
});

test("a product lists all its repositories, main first, archived ones left out", () => {
  const all = [repo("orochia-mobile", ["expo"]), repo("orochia"), repo("orochia-admin", ["nextjs"]), repo("orochia-old", [], true), repo("krizaka-ui", ["design-system"])];
  assert.deepEqual(repositoriesOf(all, "orochia", PRODUCTS).map((r) => r.name), ["orochia", "orochia-admin", "orochia-mobile"]);
  assert.deepEqual(repositoriesOf(all, "krizaka", PRODUCTS).map((r) => r.name), ["krizaka-ui"]);
});

test("npm packages are grouped by their keywords", () => {
  assert.equal(groupOfPackage(["react", "design-system", "tanstack"]), "ui");
  assert.equal(groupOfPackage(["react-query", "server-sent-events", "react-native"]), "data");
  assert.equal(groupOfPackage(["realtime", "server-sent-events", "postgresql"]), "realtime");
  assert.equal(groupOfPackage(["push", "expo"]), "realtime");
  assert.equal(groupOfPackage(["i18n", "cli"]), "data");
  assert.equal(groupOfPackage(["eslint-config", "design-system"]), "tooling");
  assert.equal(groupOfPackage(["orazaka", "cli"]), "tooling");
  assert.equal(groupOfPackage([]), "tooling");
});

test("a description is summarised to its first clause, in whole words", () => {
  assert.equal(summary("The Krizaka front-end platform's components: the primitives (button, card)"), "The Krizaka front-end platform's components");
  assert.equal(summary("Mobile push without an SDK: the Expo Push Service relays"), "Mobile push without an SDK");
  assert.equal(summary("Orazaka shared contracts: TypeScript types."), "Orazaka shared contracts");
  assert.equal(summary("v1.2 of the thing"), "v1.2 of the thing");
});

test("groups keep their order and drop when empty", () => {
  const groups = groupPackages([
    { name: "@krizaka/push", version: "1", description: "", keywords: ["push"] },
    { name: "@krizaka/ui", version: "1", description: "", keywords: ["design-system"] },
    { name: "@krizaka/icons", version: "1", description: "", keywords: ["icons"] },
  ]);
  assert.deepEqual(groups.map((g) => g.group), ["ui", "realtime"]);
  assert.deepEqual(groups[0].packages.map((p) => p.name), ["@krizaka/icons", "@krizaka/ui"]);
});
