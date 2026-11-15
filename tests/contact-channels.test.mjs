import { test } from "node:test";
import assert from "node:assert/strict";
import { deliverContact, postMailgun } from "../lib/contact.ts";

const message = {
  name: "Ada",
  email: "ada@example.com",
  company: "Analytical",
  kind: "support",
  product: null,
  timeline: "now",
  message: "A real question.",
  locale: "fr",
  source: "home",
};
const mail = {
  MAIL_PROVIDER: "mailgun",
  MAIL_API_KEY: "k",
  MAIL_DOMAIN: "mg.example.test",
  MAIL_CONTACT_TO: "a@x.test",
};

/** `fetch` replaced for one call; every request is recorded. `reply` answers each one (or throws). */
async function withFetch(reply, run) {
  const real = globalThis.fetch;
  const calls = [];
  const quiet = console.error;
  console.error = () => {};
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return reply(url);
  };
  try {
    return { result: await run(), calls };
  } finally {
    globalThis.fetch = real;
    console.error = quiet;
  }
}

test("postMailgun posts to the domain's messages endpoint, whatever trailing slashes the base carries", async () => {
  const { result, calls } = await withFetch(
    () => ({ ok: true, status: 200, text: async () => "" }),
    () => postMailgun(new FormData(), { ...mail, MAIL_API_URL: "https://api.eu.mailgun.net//" }),
  );
  assert.equal(result, true);
  assert.equal(calls[0].url, "https://api.eu.mailgun.net/v3/mg.example.test/messages");
  assert.equal(calls[0].init.headers.Authorization, `Basic ${Buffer.from("api:k").toString("base64")}`);
});

test("postMailgun reports a refusal and an unreachable service as false, never as a throw", async () => {
  const refused = await withFetch(
    () => ({ ok: false, status: 401, text: async () => "Forbidden" }),
    () => postMailgun(new FormData(), mail),
  );
  assert.equal(refused.result, false);
  const down = await withFetch(
    () => {
      throw new Error("offline");
    },
    () => postMailgun(new FormData(), mail),
  );
  assert.equal(down.result, false);
});

test("the webhook channel carries the subject, the text and the structured message", async () => {
  const { result, calls } = await withFetch(
    () => ({ ok: true, status: 200 }),
    () => deliverContact(message, { MAIL_CONTACT_WEBHOOK_URL: "https://hooks.example.test/x" }),
  );
  assert.equal(result, 1);
  const body = JSON.parse(calls[0].init.body);
  assert.match(body.text, /^\*.+\*\n/);
  assert.ok(body.content.length <= 2000);
  assert.equal(body.contact.email, "ada@example.com");
});

test("a failing channel is not counted, the other still is", async () => {
  const { result } = await withFetch(
    (url) =>
      String(url).includes("hooks") ? { ok: false, status: 500 } : { ok: true, status: 200, text: async () => "" },
    () => deliverContact(message, { ...mail, MAIL_CONTACT_WEBHOOK_URL: "https://hooks.example.test/x" }),
  );
  assert.equal(result, 1);
});
