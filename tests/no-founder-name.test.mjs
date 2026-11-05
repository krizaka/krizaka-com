import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

// Founder decision, 2026-11-05: no founder name on any public page. The name lives here, in a test, never in a public message.
const NAMES = ["Oussama", "Abid"];
const rx = new RegExp(`\\b(${NAMES.join("|")})\\b`, "i");

function textFiles(dir) {
  const root = new URL(`../${dir}/`, import.meta.url);
  return readdirSync(root, { recursive: true })
    .filter((f) => /\.(json|md|txt|mdx)$/.test(f))
    .map((f) => [`${dir}/${f}`, readFileSync(new URL(f, root), "utf8")]);
}

test("the founder's name is in no message and no content file", () => {
  for (const [file, text] of [...textFiles("messages"), ...textFiles("content")]) {
    assert.doesNotMatch(text, rx, `${file} names the founder`);
  }
});

test("the llms files, built or rendered, carry no founder name", () => {
  const built = ["public/llms.txt", "public/llms-full.txt", ".next/server/app/llms.txt.body", ".next/server/app/llms-full.txt.body"];
  for (const f of built) {
    const p = new URL(`../${f}`, import.meta.url);
    if (existsSync(p)) assert.doesNotMatch(readFileSync(p, "utf8"), rx, `${f} names the founder`);
  }
});

test("the company is « founded in Montréal », not founded by a person", () => {
  for (const l of ["en", "fr"]) {
    const t = readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8");
    assert.doesNotMatch(t, /fondée par|founded by|fondé par/i, `${l}: no « founded by »`);
  }
  assert.match(readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"), /founded in Montréal/);
  assert.match(readFileSync(new URL("../messages/fr.json", import.meta.url), "utf8"), /fondée à Montréal/);
});
