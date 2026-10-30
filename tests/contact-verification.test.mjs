import { test } from "node:test";
import assert from "node:assert/strict";
import {
  codeMailConfigured,
  confirmContactVerification,
  startContactVerification,
} from "../lib/contact-verification.ts";

const NOW = () => new Date();
const env = {
  MAIL_PROVIDER: "mailgun",
  MAIL_API_KEY: "k",
  MAIL_DOMAIN: "mg.example.test",
  MAIL_CONTACT_TO: "team@example.test",
};
const message = (email = "ada@example.com", locale = "en") => ({
  name: "Ada",
  email,
  company: "",
  topic: "other",
  timeline: null,
  message: "Hello, a real question here.",
  locale,
  source: null,
});

/** Mailgun is replaced for the test: the code mail is read from the form that would be posted. */
function withMailgun(answer, run) {
  const real = globalThis.fetch;
  const sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push({ url: String(url), form: init.body });
    return { ok: answer, status: answer ? 200 : 500, text: async () => "" };
  };
  return Promise.resolve(run(sent)).finally(() => {
    globalThis.fetch = real;
  });
}
const codeOf = (form) => /\d{6}/.exec(String(form.get("text")))[0];

test("the code mail needs the e-mail provider; without it nothing is held", async () => {
  assert.equal(codeMailConfigured({}), false);
  assert.equal(codeMailConfigured(env), true);
  assert.deepEqual(await startContactVerification(message(), NOW, {}), { ok: false, error: "unavailable" });
});

test("the code goes to the message's author, in the visitor's language, and nothing goes to the team", async () => {
  await withMailgun(true, async (sent) => {
    const started = await startContactVerification(message("fr1@example.com", "fr"), NOW, env);
    assert.equal(started.ok, true);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].form.get("to"), "fr1@example.com");
    assert.match(String(sent[0].form.get("subject")), /^Votre code Krizaka : \d{6}$/);
    assert.equal(sent[0].form.getAll("to").includes("team@example.test"), false);
  });
});

test("the message is released once, only with the right code, and it is the held one", async () => {
  await withMailgun(true, async (sent) => {
    const started = await startContactVerification(message("ada2@example.com"), NOW, env);
    const code = codeOf(sent[0].form);
    const wrong = code === "000000" ? "111111" : "000000";
    assert.deepEqual(
      await confirmContactVerification(
        { challengeId: started.challengeId, email: "ada2@example.com", code: wrong },
        NOW,
      ),
      { ok: false, reason: "invalid", attemptsLeft: 4 },
    );
    // another address cannot use the code
    assert.equal(
      (await confirmContactVerification({ challengeId: started.challengeId, email: "eve@example.com", code }, NOW)).ok,
      false,
    );
    const ok = await confirmContactVerification(
      { challengeId: started.challengeId, email: "ada2@example.com", code },
      NOW,
    );
    assert.equal(ok.ok, true);
    assert.equal(ok.message.email, "ada2@example.com");
    assert.equal(ok.message.message, "Hello, a real question here.");
    // single use
    assert.deepEqual(
      await confirmContactVerification({ challengeId: started.challengeId, email: "ada2@example.com", code }, NOW),
      { ok: false, reason: "unknown" },
    );
  });
});

test("five wrong codes destroy the challenge", async () => {
  await withMailgun(true, async (sent) => {
    const started = await startContactVerification(message("ada3@example.com"), NOW, env);
    const code = codeOf(sent[0].form);
    const wrong = code === "000000" ? "111111" : "000000";
    let last;
    for (let i = 0; i < 5; i += 1)
      last = await confirmContactVerification(
        { challengeId: started.challengeId, email: "ada3@example.com", code: wrong },
        NOW,
      );
    assert.deepEqual(last, { ok: false, reason: "locked" });
    assert.equal(
      (await confirmContactVerification({ challengeId: started.challengeId, email: "ada3@example.com", code }, NOW)).ok,
      false,
    );
  });
});

test("an address gets at most three codes per window (a mailbox cannot be flooded)", async () => {
  await withMailgun(true, async () => {
    for (let i = 0; i < 3; i += 1)
      assert.equal((await startContactVerification(message("flood@example.com"), NOW, env)).ok, true);
    assert.deepEqual(await startContactVerification(message("flood@example.com"), NOW, env), {
      ok: false,
      error: "rate_limited",
    });
    assert.equal(
      (await startContactVerification(message("Flood@Example.com"), NOW, env)).ok,
      false,
      "case does not dodge the limit",
    );
  });
});

test("a refused code mail is reported, not hidden", async () => {
  await withMailgun(false, async () => {
    const realError = console.error;
    console.error = () => {};
    try {
      assert.deepEqual(await startContactVerification(message("down@example.com"), NOW, env), {
        ok: false,
        error: "code_mail_failed",
      });
    } finally {
      console.error = realError;
    }
  });
});

test("verify first: /api/contact never delivers; only /api/contact/verify does, and only from the held message", async () => {
  const { readFileSync } = await import("node:fs");
  const start = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
  const verify = readFileSync(new URL("../app/api/contact/verify/route.ts", import.meta.url), "utf8");
  assert.doesNotMatch(start, /deliverContact/);
  assert.match(start, /startContactVerification/);
  assert.match(verify, /deliverContact\(confirmed\.message\)/);
  assert.doesNotMatch(verify, /deliverContact\(body|validateContact/);
});

test("the form and the messages carry the code step in both languages", async () => {
  const { readFileSync } = await import("node:fs");
  for (const locale of ["en", "fr"]) {
    const c = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")).site.contactForm;
    for (const key of ["verifyTitle", "verifyBody", "codeLabel", "verifyButton", "verifying", "verifyBack"])
      assert.ok(c[key], `${locale}: ${key}`);
    for (const key of ["code_invalid", "code_expired", "code_locked", "code_unknown", "code_mail_failed"])
      assert.ok(c.errors[key], `${locale}: errors.${key}`);
  }
});
