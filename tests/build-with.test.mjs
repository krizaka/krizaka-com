import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CREATE_PACKAGE, NATIVE_SHOTS, cliSession } from "../lib/build-with.ts";

const ROOT = path.join(import.meta.dirname, "..");
const RECORDED = JSON.parse(readFileSync(path.join(ROOT, "public/assets/orazaka/cli/session.json"), "utf8"));

test("the terminal plays the recorded install, start, dev — and create only once it is published", () => {
  assert.deepEqual(cliSession(RECORDED, false).map((s) => s.command), RECORDED.steps.map((s) => s.command));
  assert.equal(cliSession(RECORDED, true).at(-1).command, `npx ${CREATE_PACKAGE} my-app`);
  for (const step of cliSession(RECORDED, false)) {
    assert.ok((step.output ?? []).length > 0, `${step.command} prints something`);
    // Only lines the CLI printed: each one is in the recording.
    const printed = RECORDED.steps.find((s) => s.command === step.command).output.map((l) => l.text);
    for (const line of step.output) assert.ok(printed.some((p) => p.includes(line.text.trim())), `${line.text} was printed`);
  }
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
