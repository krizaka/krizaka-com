import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ENV_VARS, checkEnv, envMarkdown } from "../lib/env.ts";
import { contactChannels } from "../lib/contact.ts";

// Environment variables named by bounded context (krizaka/.github#46).
const ROOT = path.resolve(import.meta.dirname, "..");
const CONTEXT = /^(NEXT_PUBLIC_)?(APP|DATABASE|AUTH|MEDIA|MAIL|PUSH|PAYMENTS|REALTIME|ABUSE|OBSERVABILITY|AI|OPERATOR)_[A-Z0-9_]+$/;
const VENDOR_OR_PRODUCT = /^(NEXT_PUBLIC_)?(OROCHIA|ORAZAKA|YASAKIA|YORORIS|KRIZAKA|BUNNY|MAILGUN|RESEND|VERCEL|GITHUB|GH|CONTACT|DO|DIGITALOCEAN)_/;
// The runtime's and the platforms' own names, read but not ours to name.
const PLATFORM = new Set(["NODE_ENV", "PORT", "HOSTNAME", "NEXT_PHASE", "NEXT_RUNTIME", "CI", "VERCEL_URL", "VERCEL_ENV"]);

test("every variable is <CONTEXT>_<THING>, never a product or a vendor", () => {
  for (const e of ENV_VARS) {
    assert.match(e.name, CONTEXT, e.name);
    assert.doesNotMatch(e.name, VENDOR_OR_PRODUCT, e.name);
    assert.ok(e.name.startsWith(`${e.context}_`) || e.name.startsWith(`NEXT_PUBLIC_${e.context}_`), e.name);
  }
});

test("every variable the site, its scripts, .env.example and the App Platform spec use is declared", () => {
  const declared = new Set(ENV_VARS.map((e) => e.name));
  const files = execSync("git ls-files app lib scripts proxy.ts next.config.ts Dockerfile", { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.(ts|tsx|mjs|js)$|Dockerfile$/.test(f));
  const used = new Map();
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), "utf8");
    for (const m of src.matchAll(/\b(?:process\.env|env)(?:\.|\[["'])([A-Z][A-Z0-9_]*[A-Z0-9])\b/g)) used.set(m[1], f);
    for (const m of src.matchAll(/^(?:ARG|ENV) ([A-Z][A-Z0-9_]+)/gm)) used.set(m[1], f);
  }
  for (const m of fs.readFileSync(path.join(ROOT, ".env.example"), "utf8").matchAll(/^#?\s?([A-Z][A-Z0-9_]+)=/gm)) used.set(m[1], ".env.example");
  for (const m of fs.readFileSync(path.join(ROOT, "deploy/digitalocean/app.yaml"), "utf8").matchAll(/key: ([A-Z][A-Z0-9_]+)/g)) used.set(m[1], "app.yaml");
  const undeclared = [...used].filter(([n]) => !declared.has(n) && !PLATFORM.has(n) && !/^NEXT_TELEMETRY/.test(n)).map(([n, f]) => `${n} (${f})`);
  assert.equal(undeclared.join(", "), "");
});

test("values are checked against their schema — names only", () => {
  assert.deepEqual(checkEnv({ MAIL_PROVIDER: "mailgun", NEXT_PUBLIC_APP_DEMO_URL: "https://dev.orochia.com" }), []);
  const problems = checkEnv({ MAIL_PROVIDER: "postmark", NEXT_PUBLIC_MEDIA_CDN_URL: "not-a-url" });
  assert.equal(problems.length, 2);
  assert.ok(problems.every((p) => !p.includes("postmark") && !p.includes("not-a-url")));
});

test("the contact e-mail channel needs the provider named — fail-closed otherwise", () => {
  const mail = { MAIL_API_KEY: "k", MAIL_DOMAIN: "mg.krizaka.com", MAIL_CONTACT_TO: "team@krizaka.com" };
  assert.equal(contactChannels(mail).email, false);
  assert.equal(contactChannels({ ...mail, MAIL_PROVIDER: "mailgun" }).email, true);
  assert.equal(contactChannels({ MAIL_CONTACT_WEBHOOK_URL: "https://hooks.example/x" }).webhook, true);
});

test("README's table is generated from lib/env.ts (npm run docs:env)", () => {
  const readme = path.join(ROOT, "README.md");
  const src = fs.readFileSync(readme, "utf8");
  const block = /(<!-- env -->\n)[\s\S]*?(<!-- \/env -->)/;
  assert.ok(block.test(src));
  const next = src.replace(block, (_, a, b) => `${a}${envMarkdown()}${b}`);
  if (process.env.UPDATE_DOCS === "1") fs.writeFileSync(readme, next);
  else assert.equal(src, next, "README.md is stale — npm run docs:env");
});
