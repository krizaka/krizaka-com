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
