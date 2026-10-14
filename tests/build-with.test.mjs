import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CREATE_PACKAGE, cliSession } from "../lib/build-with.ts";
import { KIT_BRANDS, KIT_CAPTURE_IMAGE, KIT_CLIP_SECONDS, KIT_CROP_IMAGE, KIT_FILMSTRIP, KIT_FILMSTRIP_FRAMES, KIT_SETS, KIT_TILES, KIT_VIDEO } from "../lib/kit-live.ts";

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

test("every tile of the gallery is a published component, every identity's set is made of tiles, and every brand has its native loop", () => {
  for (const [id, { doc }] of Object.entries(KIT_TILES)) {
    const file = ["@krizaka/ui", "@krizaka/charts"]
      .map((pkg) => path.join(ROOT, "node_modules", ...pkg.split("/"), "registry", `${doc}.json`))
      .find(existsSync);
    assert.ok(file, `${id} (${doc}) is in a registry`);
  }
  for (const [brand, ids] of Object.entries(KIT_SETS)) for (const id of ids) assert.ok(KIT_TILES[id], `${brand}: ${id} is a tile`);
  const manifest = JSON.parse(readFileSync(path.join(ROOT, "lib/cdn-manifest.json"), "utf8")).files;
  for (const brand of KIT_BRANDS) for (const mode of ["dark", "light"]) for (const ext of ["webm", "mp4", "jpg"]) assert.ok(manifest[`home/kit-native/${brand}-${mode}.${ext}`], `${brand} ${mode} ${ext}`);
});

test("Orochia's media of the gallery are Krizaka's own clips on the CDN (home/kit): the clip, its filmstrip, the two stills", () => {
  const manifest = JSON.parse(readFileSync(path.join(ROOT, "lib/cdn-manifest.json"), "utf8")).files;
  for (const ext of ["webm", "mp4", "jpg"]) assert.ok(manifest[`home/kit/${KIT_VIDEO}.${ext}`], `clip ${ext}`);
  for (let i = 0; i < KIT_FILMSTRIP_FRAMES; i++) assert.ok(manifest[`home/kit/frames/${KIT_FILMSTRIP}-${i}.jpg`], `frame ${i}`);
  for (const still of [KIT_CROP_IMAGE, KIT_CAPTURE_IMAGE]) assert.ok(manifest[`home/kit/${still}.jpg`], still);
  assert.ok(KIT_CLIP_SECONDS > 0);
});
