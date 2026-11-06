import { test } from "node:test";
import assert from "node:assert/strict";
import { contactSubject, deliverContact } from "../lib/contact.ts";

const message = (over = {}) => ({
  name: "Ada",
  email: "ada@example.com",
  company: "",
  kind: "support",
  product: "verikora",
  timeline: null,
  message: "Hello, a real question here.",
  locale: "en",
  source: "verikora-footer",
  ...over,
});
const env = {
  MAIL_PROVIDER: "mailgun",
  MAIL_API_KEY: "k",
  MAIL_DOMAIN: "mg.example.test",
  MAIL_CONTACT_TO: "team@example.test",
};

/** Mailgun is replaced for the test: what the team's inbox would receive is read from the posted form. */
async function delivered(m, extra = {}) {
  const real = globalThis.fetch;
  const sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push(init.body);
    return { ok: true, status: 200, text: async () => "" };
  };
  try {
    assert.equal(await deliverContact(m, { ...env, ...extra }), 1);
  } finally {
    globalThis.fetch = real;
  }
  return sent[0];
}

test("the subject names the kind and the product, so the inbox sorts itself", () => {
  assert.equal(contactSubject(message()), "[support · Verikora] Ada");
  assert.equal(
    contactSubject(message({ kind: "business", product: "folioviv", company: "Acme" })),
    "[business · Folioviv] Ada (Acme)",
  );
  assert.equal(contactSubject(message({ kind: "business", product: null })), "[business] Ada");
  assert.equal(contactSubject(message({ kind: "other", product: "blocks" })), "[other · Building blocks] Ada");
});

test("the team's e-mail carries the kind and the product in its subject and its body", async () => {
  const form = await delivered(message());
  assert.equal(form.get("subject"), "[support · Verikora] Ada");
  assert.match(String(form.get("text")), /^Kind: support$/m);
  assert.match(String(form.get("text")), /^Product: Verikora$/m);
  assert.match(String(form.get("text")), /^Source: verikora-footer$/m);
});

test("without a product the body says so", async () => {
  const form = await delivered(message({ kind: "business", product: null }));
  assert.match(String(form.get("text")), /^Product: —$/m);
});
