import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CREATE_PACKAGE, cliSession } from "../lib/build-with.ts";
import { KIT_BRANDS, KIT_TILES } from "../lib/kit-live.ts";

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

test("every tile of the gallery is a published component, and every brand has its native loop in both themes", () => {
  for (const { id } of KIT_TILES) {
    const file = ["@krizaka/ui", "@krizaka/charts"]
      .map((pkg) => path.join(ROOT, "node_modules", ...pkg.split("/"), "registry", `${id}.json`))
      .find(existsSync);
    assert.ok(file, `${id} is in a registry`);
  }
  const manifest = JSON.parse(readFileSync(path.join(ROOT, "lib/cdn-manifest.json"), "utf8")).files;
  for (const brand of KIT_BRANDS) for (const mode of ["dark", "light"]) for (const ext of ["webm", "mp4", "jpg"]) assert.ok(manifest[`home/kit-native/${brand}-${mode}.${ext}`], `${brand} ${mode} ${ext}`);
});
