import { test } from "node:test";
import assert from "node:assert/strict";
import {
  foldFromAddress,
  opensContactFold,
  subscribeToBusinessAnchor,
  subscribeToHash,
  SUPPORT_FALLBACK_PRESET,
} from "../lib/contact-fold.ts";
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

function withGlobalLocation(location, fn) {
  const hadLocation = Object.hasOwn(globalThis, "location");
  const prevLocation = globalThis.location;
  try {
    Object.defineProperty(globalThis, "location", { value: location, configurable: true, writable: true });
    fn();
  } finally {
    if (hadLocation) {
      Object.defineProperty(globalThis, "location", { value: prevLocation, configurable: true, writable: true });
    } else {
      delete globalThis.location;
    }
  }
}

function withGlobalHashBus(bus, fn) {
  const prevAdd = globalThis.addEventListener;
  const prevRemove = globalThis.removeEventListener;
  try {
    globalThis.addEventListener = bus.addEventListener.bind(bus);
    globalThis.removeEventListener = bus.removeEventListener.bind(bus);
    fn();
  } finally {
    if (prevAdd === undefined) {
      delete globalThis.addEventListener;
    } else {
      globalThis.addEventListener = prevAdd;
    }
    if (prevRemove === undefined) {
      delete globalThis.removeEventListener;
    } else {
      globalThis.removeEventListener = prevRemove;
    }
  }
}

test("foldFromAddress reads search and hash from the browser location (defaulting to globalThis)", () => {
  assert.equal(foldFromAddress({ search: "", hash: "" }), false);
  assert.equal(foldFromAddress({ search: "?source=home", hash: "#public" }), false);
  assert.equal(foldFromAddress({ search: "", hash: "#business" }), true);
  assert.equal(foldFromAddress({ search: "?topic=business", hash: "" }), true);
  assert.equal(foldFromAddress({ search: "?source=volee", hash: "" }), true);
  assert.equal(foldFromAddress({ search: "?source=NOT_A_SLUG!", hash: "" }), false);

  withGlobalLocation({ search: "?source=volee", hash: "" }, () => {
    assert.equal(foldFromAddress(), true);
  });
});

test("subscribeToHash listens for hashchange and unsubscribes cleanly", () => {
  const target = new EventTarget();
  let calls = 0;
  const off = subscribeToHash(() => {
    calls += 1;
  }, target);
  target.dispatchEvent(new Event("hashchange"));
  assert.equal(calls, 1);
  off();
  target.dispatchEvent(new Event("hashchange"));
  assert.equal(calls, 1);

  const bus = new EventTarget();
  withGlobalHashBus(bus, () => {
    let globalCalls = 0;
    const offGlobal = subscribeToHash(() => {
      globalCalls += 1;
    });
    bus.dispatchEvent(new Event("hashchange"));
    assert.equal(globalCalls, 1);
    offGlobal();
    bus.dispatchEvent(new Event("hashchange"));
    assert.equal(globalCalls, 1);
  });
});

test("subscribeToBusinessAnchor opens only when the hash lands on #business", () => {
  const bus = new EventTarget();
  const location = { search: "", hash: "#questions" };
  const target = {
    location,
    addEventListener: bus.addEventListener.bind(bus),
    removeEventListener: bus.removeEventListener.bind(bus),
  };
  let opens = 0;
  const off = subscribeToBusinessAnchor(() => {
    opens += 1;
  }, target);

  bus.dispatchEvent(new Event("hashchange"));
  assert.equal(opens, 0);

  location.hash = "#business";
  bus.dispatchEvent(new Event("hashchange"));
  assert.equal(opens, 1);

  off();
  bus.dispatchEvent(new Event("hashchange"));
  assert.equal(opens, 1);

  withGlobalHashBus(bus, () => {
    withGlobalLocation({ search: "", hash: "#business" }, () => {
      let globalOpens = 0;
      const offGlobal = subscribeToBusinessAnchor(() => {
        globalOpens += 1;
      });
      bus.dispatchEvent(new Event("hashchange"));
      assert.equal(globalOpens, 1);
      offGlobal();
    });
  });
});

test("ContactClient uses globalThis rather than window (Sonar typescript:S7764)", () => {
  assert.doesNotMatch(client, /\bwindow\b/);
});
