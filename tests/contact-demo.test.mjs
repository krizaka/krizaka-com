import { test } from "node:test";
import assert from "node:assert/strict";
import { asksSegment, deliverContact, validateContact } from "../lib/contact.ts";
import { presetFromQuery } from "../lib/contact-products.ts";
import { demoResumeDate } from "../lib/contact-pause.ts";

const base = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there, a real message." };

test("?source=volee preselects the demo kind and Verikora", () => {
  assert.deepEqual(presetFromQuery({ topic: null, product: null, source: "volee" }), {
    kind: "demo",
    product: "verikora",
  });
  assert.equal(asksSegment("volee"), true);
  assert.equal(asksSegment("story"), false);
  assert.equal(asksSegment(null), false);
});

test("a campaign request must say who it is: owner, tenant, shop or SME", () => {
  const v = { ...base, kind: "demo", product: "verikora", source: "volee" };
  assert.deepEqual(validateContact(v), { ok: false, field: "segment" });
  assert.deepEqual(validateContact({ ...v, segment: "nope" }), { ok: false, field: "segment" });
  for (const segment of ["owner", "tenant", "shop", "smb"]) {
    const r = validateContact({ ...v, segment });
    assert.equal(r.ok === true && r.value.segment, segment);
  }
  // Any other source never asks.
  const other = validateContact({ ...v, source: "story" });
  assert.equal(other.ok === true && other.value.segment, null);
});

test("the founder's e-mail carries the segment and says it is a demo", async () => {
  const real = globalThis.fetch;
  const sent = [];
  globalThis.fetch = async (_u, init) => (sent.push(init.body), { ok: true, status: 200, text: async () => "" });
  try {
    const r = validateContact({ ...base, kind: "demo", product: "verikora", source: "volee", segment: "tenant" });
    assert.equal(r.ok, true);
    await deliverContact(r.value, {
      MAIL_PROVIDER: "mailgun",
      MAIL_API_KEY: "k",
      MAIL_DOMAIN: "mg.example.test",
      MAIL_CONTACT_TO: "team@example.test",
    });
  } finally {
    globalThis.fetch = real;
  }
  assert.equal(sent[0].get("subject"), "[demo · Verikora] Ada Lovelace");
  assert.match(String(sent[0].get("text")), /^Segment: Tenant$/m);
});

test("during 21 Dec – 3 Jan the demos resume on the 4th, otherwise there is no pause", () => {
  assert.equal(demoResumeDate(new Date(2026, 11, 20, 23)), null);
  assert.equal(
    demoResumeDate(new Date(2026, 11, 21, 0, 1))
      ?.toISOString()
      .slice(0, 10),
    "2027-01-04",
  );
  assert.equal(
    demoResumeDate(new Date(2027, 0, 3, 22))
      ?.toISOString()
      .slice(0, 10),
    "2027-01-04",
  );
  assert.equal(demoResumeDate(new Date(2027, 0, 4, 1)), null);
  assert.equal(demoResumeDate(new Date(2026, 5, 1)), null);
  assert.equal(
    demoResumeDate(new Date(2027, 11, 25))
      ?.toISOString()
      .slice(0, 10),
    "2028-01-04",
  );
});
