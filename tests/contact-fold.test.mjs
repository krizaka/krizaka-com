import { test } from "node:test";
import assert from "node:assert/strict";
import { opensContactFold, SUPPORT_FALLBACK_PRESET } from "../lib/contact-fold.ts";
import { contactHref } from "../lib/contact.ts";

const none = { hash: "", topic: null, source: null };

test("the plain nav link leaves the business form folded", () => {
  assert.equal(opensContactFold(none), false);
  assert.equal(opensContactFold({ ...none, source: "home" }), false);
  assert.equal(opensContactFold({ ...none, hash: "#public" }), false);
});

test("#business opens the fold", () => {
  assert.equal(opensContactFold({ ...none, hash: "#business" }), true);
});

test("an explicit topic opens the fold, whatever the kind", () => {
  assert.equal(opensContactFold({ ...none, topic: "support" }), true);
  assert.equal(opensContactFold({ ...none, topic: "business" }), true);
  assert.equal(opensContactFold({ ...none, topic: "" }), false);
});

test("the demo source opens the fold (the Verikora campaign lands on an open form)", () => {
  assert.equal(opensContactFold({ ...none, source: "volee" }), true);
});

test("existing contactHref links keep opening the form they always did", () => {
  const open = (href) => {
    const u = new URL(href, "https://x.test");
    return opensContactFold({ hash: u.hash, topic: u.searchParams.get("topic"), source: u.searchParams.get("source") });
  };
  assert.equal(open(contactHref("home")), false);
  assert.equal(open(contactHref("volee")), true);
  assert.equal(open(contactHref("open-source", "business")), true);
  assert.equal(open(contactHref("verikora-com", "support", "verikora")), true);
});

test("the no-account link preselects Support and no product", () => {
  assert.deepEqual(SUPPORT_FALLBACK_PRESET, { kind: "support", product: null });
});

import { readFileSync } from "node:fs";

const client = readFileSync(new URL("../app/[locale]/contact/ContactClient.tsx", import.meta.url), "utf8");

test("the GitHub block comes before the business form on the page", () => {
  assert.ok(client.indexOf('id="public"') < client.indexOf('id="business"'));
  assert.ok(client.indexOf("<PublicChannelList") < client.indexOf("<ContactForm"));
});

test("the fold is a disclosure button wired to its panel, never <details>", () => {
  assert.match(client, /aria-expanded=\{open\}/);
  assert.match(client, /aria-controls="business-panel"/);
  assert.match(client, /id="business-panel"/);
  assert.ok(!client.includes("<details"));
});

test("the sorter points at the three anchors that exist", () => {
  const messages = JSON.parse(readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"));
  const hrefs = messages.site.contactPage.sorter.map((row) => row.href);
  assert.deepEqual(hrefs, ["#questions", "#bugs", "#business"]);
  for (const id of ["questions", "bugs", "business"]) assert.ok(client.includes(`"${id}"`), id);
});
