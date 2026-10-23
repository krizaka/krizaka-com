import test from "node:test";
import assert from "node:assert/strict";
import { validateContact, isValidContactField } from "../lib/contact.ts";

const ok = { name: "Ada", email: "ada@example.com", topic: "other", message: "Hello there, friend." };

test("valid message passes", () => assert.equal(validateContact(ok).ok, true));
test("field rules are shared with the client", () => {
  assert.equal(isValidContactField("name", " A "), false);
  assert.equal(isValidContactField("email", "a@b"), false);
  assert.equal(isValidContactField("message", "short"), false);
  assert.equal(isValidContactField("email", " ada@example.com "), true);
});
test("server reports the failing field", () => {
  assert.deepEqual(validateContact({ ...ok, email: "nope" }), { ok: false, field: "email" });
  assert.deepEqual(validateContact({ ...ok, message: "x".repeat(5001) }), { ok: false, field: "message" });
  assert.deepEqual(validateContact({ ...ok, message: "x".repeat(5000) + " more" }), { ok: false, field: "message" });
  assert.deepEqual(validateContact({ ...ok, company: "x".repeat(161) }), { ok: false, field: "company" });
});
test("the full trimmed value is validated: nothing is truncated to the limit first", () => {
  // Whitespace right at the cutoff must not turn an over-long value into a valid one.
  assert.deepEqual(validateContact({ ...ok, name: "x".repeat(120) + " more" }), { ok: false, field: "name" });
  assert.deepEqual(validateContact({ ...ok, email: `${"a".repeat(188)}@example.com more` }), { ok: false, field: "email" });
  assert.deepEqual(validateContact({ ...ok, company: "x".repeat(160) + " more" }), { ok: false, field: "company" });
  // At the limit exactly, the value passes and is returned whole.
  const atLimit = validateContact({ ...ok, name: "x".repeat(120), email: `${"a".repeat(188)}@example.com`, company: "x".repeat(160), message: "x".repeat(5000) });
  assert.equal(atLimit.ok, true);
  assert.equal(atLimit.value.message.length, 5000);
  assert.equal(atLimit.value.email.length, 200);
  // Surrounding whitespace is trimmed, never counted.
  const padded = validateContact({ ...ok, message: `  ${"x".repeat(5000)}  ` });
  assert.equal(padded.ok, true);
  assert.equal(padded.value.message.length, 5000);
});
