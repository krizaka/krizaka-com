import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { kindOfRepository, productOfRepository, repositoriesOf } from "../lib/repository-catalogue.ts";
import { groupOfPackage, groupPackages, summary } from "../lib/npm-catalogue.ts";
import { calls, countCode, hasCode, hasJsx, importsFrom, jsx, records, strings } from "./helpers/source.mjs";

const PRODUCTS = ["orazaka", "yomizaka", "akinaza"];
const repo = (name, topics = [], archived = false) => ({
  name,
  description: "",
  url: `https://github.com/krizaka/${name}`,
  topics,
  language: null,
  archived,
});

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
  assert.equal(
    kindOfRepository(repo("yomizaka-design-system", ["design-system", "react", "npm-package"]), "yomizaka"),
    "library",
  );
  assert.equal(kindOfRepository(repo("orazaka-ui-kit", ["react-native", "npm-package"]), "orazaka"), "library");
  assert.equal(kindOfRepository(repo("orazaka-edge", ["java", "spring-boot"]), "orazaka"), "service");
  assert.equal(kindOfRepository(repo("orazaka-cli", ["cli", "typescript"]), "orazaka"), "tooling");
  // Agent Skills (krizaka-skills): tooling for coding agents, read from the `agent-skills` topic.
  assert.equal(kindOfRepository(repo("krizaka-skills", ["agent-skills", "claude-code-plugin"]), "krizaka"), "tooling");
  assert.equal(kindOfRepository(repo("yomizaka-console", ["nextjs", "bff"]), "yomizaka"), "web");
  assert.equal(kindOfRepository(repo("x-y", []), "x"), "other");
});

test("a product lists all its repositories, main first, archived ones left out", () => {
  const all = [
    repo("yomizaka-mobile", ["expo"]),
    repo("yomizaka"),
    repo("yomizaka-console", ["nextjs"]),
    repo("yomizaka-old", [], true),
    repo("krizaka-ui", ["design-system"]),
  ];
  assert.deepEqual(
    repositoriesOf(all, "yomizaka", PRODUCTS).map((r) => r.name),
    ["yomizaka", "yomizaka-console", "yomizaka-mobile"],
  );
  assert.deepEqual(
    repositoriesOf(all, "krizaka", PRODUCTS).map((r) => r.name),
    ["krizaka-ui"],
  );
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
  assert.equal(
    summary("The Krizaka front-end platform's components: the primitives (button, card)"),
    "The Krizaka front-end platform's components",
  );
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
  assert.deepEqual(
    groups.map((g) => g.group),
    ["ui", "realtime"],
  );
  assert.deepEqual(
    groups[0].packages.map((p) => p.name),
    ["@krizaka/icons", "@krizaka/ui"],
  );
});

test("/docs is the documentation hub (2026-10-30): paths by reader, a quiet line of figures, how it fits, the folded reference, contribute", () => {
  const page = "app/[locale]/docs/page.tsx";
  for (const read of ["repositories.length", "npmPackages().length", "mavenArtifactCount()"])
    assert.ok(hasCode(page, read), read);
  // The hub's collections are the reader's paths (lib/docs-start.ts), not the stack's cards.
  assert.ok(hasCode(page, "collections={START_PATHS.map("), "paths by reader");
  for (const id of ["how-it-fits", "reference", "contribute"]) assert.ok(hasJsx(page, "Section", { id }), id);
  assert.ok(!hasJsx(page, "Section", { id: "packages" }), "the packages are not a headline");
  assert.ok(hasJsx(page, "details"), "the reference tables are folded");
  assert.ok(hasCode(page, "<PackagesTable rows={packages} />"));
  assert.ok(!hasCode(page, "<RepositoriesTable"), "the repositories table is gone");
  assert.ok(hasCode(page, "packageRows(snapshot as RegistrySnapshot"), "packages from the registries at build");
  assert.ok(hasCode(page, "PUBLIC_CHANNELS.map"), "the contact page's discussions/issues picker");
  assert.ok(!hasJsx(page, "Facts"), "figures are a quiet line, never a band of facts");
  assert.ok(!hasJsx(page, "style"), "no inline stylesheet: open-source.css");
  assert.equal(jsx(page).filter((e) => e.attrs.variant === "primary").length, 1, "one primary button, in contribute");
  const tables = "app/[locale]/docs/OpenSourceTables.tsx";
  assert.ok(importsFrom(tables, "@krizaka/ui/data-table"));
  assert.ok(
    !hasCode(tables, 'column: "weeklyDownloads", direction: "descending"'),
    "unknown downloads never sort first",
  );
  assert.equal(countCode(tables, "defaultPageSize={12}"), 1, "short pages, not a wall of rows");
  assert.ok(!calls(tables).includes("fetch"), "rows come from the server, never fetched here");
  assert.ok(
    importsFrom("app/[locale]/contact/ContactClient.tsx", "@/lib/public-channels"),
    "one list of channels for both pages",
  );
  assert.ok(hasCode("lib/page-templates.ts", '"/docs": "docs-hub"'));
  assert.ok(
    !existsSync(new URL("../app/[locale]/open-source/page.tsx", import.meta.url)),
    "/open-source has no page: it redirects",
  );
});

test("the packages: every npm and Maven artifact, its family, its repository only when it exists", async () => {
  const { packageRows, mavenFamily, weeklyTotal } = await import("../lib/package-catalogue.ts");
  const snap = {
    npm: { "@krizaka/ui": "3.21.0", "@krizaka/query": "0.2.1" },
    npmMeta: {
      "@krizaka/ui": {
        description: "Components: a lot",
        keywords: ["design-system"],
        repository: "https://github.com/krizaka/krizaka-ui",
        homepage: "https://ui.krizaka.com",
        weeklyDownloads: 12,
        weeklySeries: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      "@krizaka/query": { description: "Server state", keywords: ["react-query"] },
    },
    maven: { "krizaka-users-api": "0.1.0", "krizaka-users": "0.1.0", "krizaka-bom": "0.2.0" },
    mavenMeta: {
      "krizaka-users-api": { description: "Identity contract; pure JDK", parent: "krizaka-users" },
      "krizaka-users": { parent: "krizaka-parent" },
      "krizaka-bom": { parent: "krizaka-parent" },
    },
  };
  assert.equal(mavenFamily("krizaka-users-api", snap.mavenMeta), "krizaka-users");
  assert.equal(mavenFamily("krizaka-bom", snap.mavenMeta), "krizaka-bom");
  const rows = packageRows(snap, ["krizaka-users", "krizaka-ui"], "https://java.krizaka.com");
  // A package whose source repository is no longer public (a paused product's, 2026-10-25) is left out.
  assert.deepEqual(
    packageRows(snap, ["krizaka-users"], "https://java.krizaka.com")
      .map((r) => r.id)
      .filter((id) => id.startsWith("npm:")),
    ["npm:@krizaka/query"],
  );
  assert.deepEqual(
    rows.map((r) => r.id),
    ["npm:@krizaka/query", "npm:@krizaka/ui", "maven:krizaka-bom", "maven:krizaka-users", "maven:krizaka-users-api"],
  );
  const ui = rows.find((r) => r.name === "@krizaka/ui");
  assert.equal(ui.line, "Components");
  assert.equal(ui.family, "ui");
  assert.equal(ui.weeklyDownloads, 12);
  assert.deepEqual(ui.weeklySeries, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(rows.find((r) => r.name === "@krizaka/query").weeklySeries, undefined, "an absent series stays absent");
  assert.equal(weeklyTotal(rows), 12);
  assert.equal(
    weeklyTotal(rows.filter((r) => r.registry === "maven")),
    undefined,
    "Maven Central has no download count: no total",
  );
  const bad = packageRows(
    { npm: { "@krizaka/x": "1.0.0" }, npmMeta: { "@krizaka/x": { weeklyDownloads: 3, weeklySeries: [1, 2, "3"] } } },
    [],
    "https://java.krizaka.com",
  );
  assert.equal(bad[0].weeklySeries, undefined, "a malformed series is dropped, not drawn");
  assert.equal(
    rows.find((r) => r.name === "@krizaka/query").weeklyDownloads,
    undefined,
    "unknown downloads stay unknown",
  );
  const api = rows.find((r) => r.name === "krizaka-users-api");
  assert.equal(api.repoUrl, "https://github.com/krizaka/krizaka-users");
  assert.equal(api.registryUrl, "https://central.sonatype.com/artifact/com.krizaka/krizaka-users-api");
  assert.equal(
    rows.find((r) => r.name === "krizaka-bom").repoUrl,
    undefined,
    "no repository named krizaka-bom: no link",
  );
});

test("how it fits: building blocks → shared services, from the manifests (no product, no engine layer)", async () => {
  const { howItFits } = await import("../lib/how-it-fits.ts");
  const layers = howItFits(
    {
      yomizaka: { npm: ["@krizaka/ui"], maven: [] },
      orazaka: { npm: ["@krizaka/ui", "@krizaka/tokens"], maven: ["krizaka-users-client", "krizaka-security"] },
    },
    {
      "krizaka-users-client": { parent: "krizaka-users" },
      "krizaka-users": { parent: "krizaka-parent" },
      "krizaka-security": { parent: "krizaka-platform-kit" },
      "krizaka-platform-kit": { parent: "krizaka-parent" },
    },
    { "krizaka-users-service": "0.1.0" },
  );
  assert.deepEqual(layers, {
    blocks: { npm: ["@krizaka/tokens", "@krizaka/ui"], java: ["krizaka-security"] },
    services: ["krizaka-users"],
  });
});

test("the registries' generator reads a POM's own description, its com.krizaka parent and the repository of an npm package", async () => {
  const { pomMeta, githubUrl } = await import("../scripts/gen-registry-versions.mjs");
  const pom =
    "<project><parent><groupId>com.krizaka</groupId><artifactId>krizaka-users</artifactId><description>parent's</description></parent><artifactId>x</artifactId><description>  Its own\n line </description><dependencies><dependency><description>no</description></dependency></dependencies></project>";
  assert.deepEqual(pomMeta(pom), { description: "Its own line", parent: "krizaka-users" });
  assert.equal(githubUrl("git+https://github.com/krizaka/krizaka-ui.git"), "https://github.com/krizaka/krizaka-ui");
});
