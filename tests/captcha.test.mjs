import { test } from "node:test";
import assert from "node:assert/strict";
import { captchaConfigured, verifyCaptcha, SITEVERIFY_URL } from "../lib/captcha.ts";
import { ENV_VARS } from "../lib/env.ts";

const env = { ABUSE_CAPTCHA_PROVIDER: "turnstile", ABUSE_CAPTCHA_SECRET_KEY: "s3cret" };
const reply = (body, ok = true) => async () => ({ ok, json: async () => body });

test("the captcha variables are declared in the ABUSE context", () => {
  for (const n of ["NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY", "ABUSE_CAPTCHA_SECRET_KEY", "ABUSE_CAPTCHA_PROVIDER"]) {
    const v = ENV_VARS.find((e) => e.name === n);
    assert.ok(v, n);
    assert.equal(v.context, "ABUSE");
  }
  assert.equal(ENV_VARS.find((e) => e.name === "ABUSE_CAPTCHA_SECRET_KEY").secret, true);
});

test("not configured → the check is off", async () => {
  assert.equal(captchaConfigured({}), false);
  assert.equal(captchaConfigured({ ABUSE_CAPTCHA_PROVIDER: "turnstile" }), false);
  assert.equal(await verifyCaptcha(undefined, "1.2.3.4", {}), true);
});

test("configured: a valid token passes, with the secret, token and remote IP posted", async () => {
  let seen;
  const f = async (url, init) => { seen = { url, init }; return { ok: true, json: async () => ({ success: true }) }; };
  assert.equal(await verifyCaptcha("tok", "1.2.3.4", env, f), true);
  assert.equal(seen.url, SITEVERIFY_URL);
  const p = new URLSearchParams(seen.init.body);
  assert.equal(p.get("secret"), "s3cret");
  assert.equal(p.get("response"), "tok");
  assert.equal(p.get("remoteip"), "1.2.3.4");
});

test("configured: a refused token fails", async () => {
  assert.equal(await verifyCaptcha("bad", "1.2.3.4", env, reply({ success: false, "error-codes": ["invalid-input-response"] })), false);
});

test("configured: a missing or empty token fails without calling siteverify", async () => {
  const f = async () => { throw new Error("must not be called"); };
  assert.equal(await verifyCaptcha(undefined, "1.2.3.4", env, f), false);
  assert.equal(await verifyCaptcha("", "1.2.3.4", env, f), false);
  assert.equal(await verifyCaptcha(42, "1.2.3.4", env, f), false);
});

test("configured: an unreachable siteverify fails closed", async () => {
  assert.equal(await verifyCaptcha("tok", "unknown", env, async () => { throw new Error("down"); }), false);
  assert.equal(await verifyCaptcha("tok", "unknown", env, reply({}, false)), false);
});

test("the remote IP is left out when unknown", async () => {
  let body;
  await verifyCaptcha("tok", "unknown", env, async (_u, i) => { body = i.body; return { ok: true, json: async () => ({ success: true }) }; });
  assert.equal(new URLSearchParams(body).has("remoteip"), false);
});

test("production without the check configured refuses; elsewhere it is off (#464)", async () => {
  const { captchaMissing } = await import("../lib/captcha.ts");
  assert.equal(captchaMissing({ NODE_ENV: "production" }), true);
  assert.equal(captchaMissing({ NODE_ENV: "production", ABUSE_CAPTCHA_PROVIDER: "turnstile" }), true);
  assert.equal(captchaMissing({ NODE_ENV: "production", ...env }), false);
  assert.equal(captchaMissing({ NODE_ENV: "development" }), false);
  assert.equal(captchaMissing({}), false);
});

test("the contact route answers 503 when production lacks the check, before reading the token (#464)", async () => {
  const { readFileSync } = await import("node:fs");
  const route = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
  assert.match(route, /if \(captchaMissing\(\)\)[\s\S]*contact\.captcha_unconfigured[\s\S]*status: 503/);
  assert.ok(route.indexOf("captchaMissing()") < route.indexOf("verifyCaptcha(token"));
});
