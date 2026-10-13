import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CREATE_PACKAGE, NATIVE_SHOTS, cliSession } from "../lib/build-with.ts";

const ROOT = path.join(import.meta.dirname, "..");

test("the terminal plays install, start, dev — and create only once it is published", () => {
  assert.deepEqual(cliSession(false).map((s) => s.command), ["npx orazaka install", "orazaka start", "orazaka dev"]);
  assert.equal(cliSession(true).at(-1).command, `npx ${CREATE_PACKAGE} my-app`);
  for (const step of cliSession(false)) assert.ok((step.output ?? []).length > 0, `${step.command} prints something`);
});

test("every native shot of the phone is a published story with both themes", () => {
  for (const { component, example } of NATIVE_SHOTS) {
    const file = ["@krizaka/ui", "@krizaka/charts"]
      .map((pkg) => path.join(ROOT, "node_modules", ...pkg.split("/"), "registry", `${component}.json`))
      .find(existsSync);
    assert.ok(file, `${component} is in a registry`);
    const shots = JSON.parse(readFileSync(file, "utf8")).native?.examples.find((e) => e.name === example)?.screenshots;
    assert.ok(shots?.dark && shots?.light, `${component}/${example} has dark and light screenshots`);
  }
});
