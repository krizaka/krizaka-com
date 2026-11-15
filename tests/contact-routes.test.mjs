import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

// The routes import `@/lib/...`: a resolve hook maps the alias onto the repository, as tsconfig does.
const root = new URL("../", import.meta.url).href;
const hook = `export async function resolve(s, c, next) {
  if (s.startsWith("@/")) return next(new URL(s.slice(2) + ".ts", ${JSON.stringify(root)}).href, c);
  return next(s === "next/server" ? "next/server.js" : s, c);
}`;
register(`data:text/javascript,${encodeURIComponent(hook)}`);

const { POST: send } = await import("../app/api/contact/route.ts");
const { POST: verify } = await import("../app/api/contact/verify/route.ts");

const post = (url, body, raw = false) =>
  new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 250)}` },
    body: raw ? body : JSON.stringify(body),
  });

test("POST /api/contact: a body that is not JSON is refused with 400", async () => {
  const res = await send(post("http://t/api/contact", "{nope", true));
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "invalid_json" });
});

test("POST /api/contact: an invalid message names the field", async () => {
  const res = await send(post("http://t/api/contact", { name: "", email: "x" }));
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error, "invalid");
  assert.equal(typeof body.field, "string");
});

test("POST /api/contact/verify: bad JSON, wrong types and oversized fields are refused with 400", async () => {
  const bad = await verify(post("http://t/api/contact/verify", "{nope", true));
  assert.equal(bad.status, 400);
  assert.deepEqual(await bad.json(), { error: "invalid_json" });
  for (const body of [
    {},
    { challengeId: 1, email: "a@b.c", code: "123456" },
    { challengeId: "x".repeat(201), email: "a@b.c", code: "1" },
    { challengeId: "x", email: "a".repeat(321), code: "1" },
    { challengeId: "x", email: "a@b.c", code: "1".repeat(21) },
  ]) {
    const res = await verify(post("http://t/api/contact/verify", body));
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "invalid" });
  }
});

test("POST /api/contact/verify: an unknown challenge is a refused code, not a delivery", async () => {
  const res = await verify(
    post("http://t/api/contact/verify", { challengeId: "nope", email: "a@b.co", code: "123456" }),
  );
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /^contact\.code_/);
});
