import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { kindOfRepository, productOfRepository, repositoriesOf } from "../lib/repository-catalogue.ts";
import { groupOfPackage, groupPackages, summary } from "../lib/npm-catalogue.ts";

const PRODUCTS = ["orazaka", "yomizaka", "akinaza"];
const repo = (name, topics = [], archived = false) => ({ name, description: "", url: `https://github.com/krizaka/${name}`, topics, language: null, archived });

test("a repository belongs to the product it is named after, anything else to the platform", () => {
  assert.equal(productOfRepository("yomizaka", PRODUCTS), "yomizaka");
  assert.equal(productOfRepository("yomizaka-console", PRODUCTS), "yomizaka");
  assert.equal(productOfRepository("akinaza-mobile", PRODUCTS), "akinaza");
  assert.equal(productOfRepository("krizaka-ui", PRODUCTS), "krizaka");
  assert.equal(productOfRepository(".github", PRODUCTS), "krizaka");
  // A prefix is a whole segment: "orazakatools" is not Orazaka's.
  assert.equal(productOfRepository("orazakatools", PRODUCTS), "krizaka");
});

test("the kind of a repository comes from its topics", () => {
  assert.equal(kindOfRepository(repo("orazaka"), "orazaka"), "main");
  assert.equal(kindOfRepository(repo("yomizaka-mobile", ["expo", "react-native"]), "yomizaka"), "mobile");
  assert.equal(kindOfRepository(repo("yomizaka-design-system", ["design-system", "react", "npm-package"]), "yomizaka"), "library");
  assert.equal(kindOfRepository(repo("orazaka-ui-kit", ["react-native", "npm-package"]), "orazaka"), "library");
  assert.equal(kindOfRepository(repo("orazaka-edge", ["java", "spring-boot"]), "orazaka"), "service");
  assert.equal(kindOfRepository(repo("orazaka-cli", ["cli", "typescript"]), "orazaka"), "tooling");
  assert.equal(kindOfRepository(repo("yomizaka-console", ["nextjs", "bff"]), "yomizaka"), "web");
  assert.equal(kindOfRepository(repo("x-y", []), "x"), "other");
});

test("a product lists all its repositories, main first, archived ones left out", () => {
  const all = [repo("yomizaka-mobile", ["expo"]), repo("yomizaka"), repo("yomizaka-console", ["nextjs"]), repo("yomizaka-old", [], true), repo("krizaka-ui", ["design-system"])];
  assert.deepEqual(repositoriesOf(all, "yomizaka", PRODUCTS).map((r) => r.name), ["yomizaka", "yomizaka-console", "yomizaka-mobile"]);
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

test("/open-source is the technical view (2026-10-17): live figures, the stack, packages, repositories, how it fits, contribute", () => {
  const page = readFileSync(new URL("../app/[locale]/open-source/page.tsx", import.meta.url), "utf8");
  for (const read of ["publicRepositoryCount()", "npmPackages().length", "mavenArtifactCount()", '"Apache-2.0"']) assert.ok(page.includes(read), read);
  for (const id of ["stack", "packages", "repositories", "how-it-fits", "contribute"]) assert.match(page, new RegExp(`<Section id="${id}"`), id);
  assert.match(page, /<PackagesTable rows=\{packages\} \/>/);
  assert.match(page, /<RepositoriesTable rows=\{repoRows\} \/>/);
  assert.match(page, /packageRows\(snapshot as RegistrySnapshot/, "packages from the registries at build");
  assert.match(page, /PUBLIC_CHANNELS\.map/, "the contact page's discussions/issues picker");
  assert.match(page, /CODE_OF_CONDUCT\.md/);
  assert.match(page, /LICENSE-2\.0/);
  assert.doesNotMatch(page, /<style>/, "no inline stylesheet: open-source.css");
  assert.equal(page.match(/variant="primary"/g)?.length, 2, "one primary action in the hero, one in contribute");
  const tables = readFileSync(new URL("../app/[locale]/open-source/OpenSourceTables.tsx", import.meta.url), "utf8");
  assert.match(tables, /from "@krizaka\/ui\/data-table"/);
  assert.match(tables, /defaultSort=\{\{ column: "product", direction: "ascending" \}\}/, "repositories read by product");
  assert.doesNotMatch(tables, /column: "weeklyDownloads", direction: "descending"/, "unknown downloads never sort first");
  assert.equal(tables.match(/defaultPageSize=\{12\}/g)?.length, 2, "short pages, not a wall of rows");
  assert.doesNotMatch(tables, /fetch\(/, "rows come from the server, never fetched here");
  const contact = readFileSync(new URL("../app/[locale]/contact/ContactClient.tsx", import.meta.url), "utf8");
  assert.match(contact, /from "@\/lib\/public-channels"/, "one list of channels for both pages");
  assert.match(readFileSync(new URL("../lib/page-templates.ts", import.meta.url), "utf8"), /"\/open-source": "docs-hub"/);
});

test("the packages: every npm and Maven artifact, its family, its repository only when it exists", async () => {
  const { packageRows, mavenFamily, weeklyTotal } = await import("../lib/package-catalogue.ts");
  const snap = {
    npm: { "@krizaka/ui": "3.21.0", "@krizaka/query": "0.2.1" },
    npmMeta: {
      "@krizaka/ui": { description: "Components: a lot", keywords: ["design-system"], repository: "https://github.com/krizaka/krizaka-ui", homepage: "https://ui.krizaka.com", weeklyDownloads: 12, weeklySeries: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      "@krizaka/query": { description: "Server state", keywords: ["react-query"] },
    },
    maven: { "krizaka-users-api": "0.1.0", "krizaka-users": "0.1.0", "krizaka-bom": "0.2.0" },
    mavenMeta: { "krizaka-users-api": { description: "Identity contract; pure JDK", parent: "krizaka-users" }, "krizaka-users": { parent: "krizaka-parent" }, "krizaka-bom": { parent: "krizaka-parent" } },
  };
  assert.equal(mavenFamily("krizaka-users-api", snap.mavenMeta), "krizaka-users");
  assert.equal(mavenFamily("krizaka-bom", snap.mavenMeta), "krizaka-bom");
  const rows = packageRows(snap, ["krizaka-users", "krizaka-ui"], "https://java.krizaka.com");
  // A package whose source repository is no longer public (a paused product's, 2026-10-25) is left out.
  assert.deepEqual(packageRows(snap, ["krizaka-users"], "https://java.krizaka.com").map((r) => r.id).filter((id) => id.startsWith("npm:")), ["npm:@krizaka/query"]);
  assert.deepEqual(rows.map((r) => r.id), ["npm:@krizaka/query", "npm:@krizaka/ui", "maven:krizaka-bom", "maven:krizaka-users", "maven:krizaka-users-api"]);
  const ui = rows.find((r) => r.name === "@krizaka/ui");
  assert.equal(ui.line, "Components");
  assert.equal(ui.family, "ui");
  assert.equal(ui.weeklyDownloads, 12);
  assert.deepEqual(ui.weeklySeries, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(rows.find((r) => r.name === "@krizaka/query").weeklySeries, undefined, "an absent series stays absent");
  assert.equal(weeklyTotal(rows), 12);
  assert.equal(weeklyTotal(rows.filter((r) => r.registry === "maven")), undefined, "Maven Central has no download count: no total");
  const bad = packageRows({ npm: { "@krizaka/x": "1.0.0" }, npmMeta: { "@krizaka/x": { weeklyDownloads: 3, weeklySeries: [1, 2, "3"] } } }, [], "https://java.krizaka.com");
  assert.equal(bad[0].weeklySeries, undefined, "a malformed series is dropped, not drawn");
  assert.equal(rows.find((r) => r.name === "@krizaka/query").weeklyDownloads, undefined, "unknown downloads stay unknown");
  const api = rows.find((r) => r.name === "krizaka-users-api");
  assert.equal(api.repoUrl, "https://github.com/krizaka/krizaka-users");
  assert.equal(api.registryUrl, "https://central.sonatype.com/artifact/com.krizaka/krizaka-users-api");
  assert.equal(rows.find((r) => r.name === "krizaka-bom").repoUrl, undefined, "no repository named krizaka-bom: no link");
});

test("how it fits: products → engine → building blocks → shared services, from the manifests", async () => {
  const { howItFits } = await import("../lib/how-it-fits.ts");
  const layers = howItFits(
    [{ id: "orazaka" }, { id: "yomizaka" }, { id: "akinaza" }],
    "orazaka",
    [{ id: "yomizaka" }, { id: "akinaza", planned: true }],
    { yomizaka: { npm: ["@krizaka/ui"], maven: [] }, orazaka: { npm: ["@krizaka/ui", "@krizaka/tokens"], maven: ["krizaka-users-client", "krizaka-security"] } },
    { "krizaka-users-client": { parent: "krizaka-users" }, "krizaka-users": { parent: "krizaka-parent" }, "krizaka-security": { parent: "krizaka-platform-kit" }, "krizaka-platform-kit": { parent: "krizaka-parent" } },
    { "krizaka-users-service": "0.1.0" },
  );
  assert.deepEqual(layers.products, ["yomizaka", "akinaza"]);
  assert.deepEqual(layers.engine, { id: "orazaka", calls: 1, planned: 1 });
  assert.deepEqual(layers.blocks, { npm: ["@krizaka/tokens", "@krizaka/ui"], java: ["krizaka-security"] });
  assert.deepEqual(layers.services, ["krizaka-users"]);
});

test("the registries' generator reads a POM's own description, its com.krizaka parent and the repository of an npm package", async () => {
  const { pomMeta, githubUrl } = await import("../scripts/gen-registry-versions.mjs");
  const pom = "<project><parent><groupId>com.krizaka</groupId><artifactId>krizaka-users</artifactId><description>parent's</description></parent><artifactId>x</artifactId><description>  Its own\n line </description><dependencies><dependency><description>no</description></dependency></dependencies></project>";
  assert.deepEqual(pomMeta(pom), { description: "Its own line", parent: "krizaka-users" });
  assert.equal(githubUrl("git+https://github.com/krizaka/krizaka-ui.git"), "https://github.com/krizaka/krizaka-ui");
});
