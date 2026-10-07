#!/usr/bin/env node
/**
 * i18n gate: messages/en.json (the reference) and every other locale must have exactly the same
 * keys, with non-empty strings and the same {placeholders}. Run by `npm run lint` and CI.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "messages");
const load = (l) => JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), "utf8"));
const flat = (o, p = "", out = new Map()) => {
  if (Array.isArray(o)) o.forEach((v, i) => flat(v, `${p}[${i}]`, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flat(v, p ? `${p}.${k}` : k, out);
  else out.set(p, o);
  return out;
};
const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const ref = flat(load("en"));
const problems = [];
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const locale = file.replace(".json", "");
  const other = flat(load(locale));
  for (const key of ref.keys()) if (!other.has(key)) problems.push(`${locale}: missing ${key}`);
  for (const key of other.keys()) if (!ref.has(key)) problems.push(`${locale}: unknown ${key} (not in en.json)`);
  for (const [key, value] of other) {
    if (typeof value === "string" && !value.trim()) problems.push(`${locale}: empty ${key}`);
    if (ref.has(key) && placeholders(ref.get(key)) !== placeholders(value)) problems.push(`${locale}: placeholders differ in ${key}`);
  }
}
for (const [key, value] of ref) if (typeof value === "string" && !value.trim()) problems.push(`en: empty ${key}`);

if (problems.length) {
  console.error(`✗ i18n: ${problems.length} problem(s)\n  ${problems.slice(0, 50).join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ i18n: ${ref.size} messages, every locale complete`);
