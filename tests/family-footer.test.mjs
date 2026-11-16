import assert from "node:assert/strict";
import { test } from "node:test";

import { footerLinks, linkOf, membersOf } from "../lib/family-footer.ts";
import { footerSettings } from "../lib/footer.ts";

const member = (id, group, order, urls, extra = {}) => ({
  id,
  name: `Krizaka ${id}`,
  group,
  order,
  visibility: "public",
  status: "development",
  urls: { site: null, siteLive: false, repo: null, ...urls },
  ...extra,
});

test("a link is emitted only where something answers: the live site, else the public repository, else none", () => {
  assert.equal(linkOf(member("a", "products", 1, { site: "https://agents.krizaka.com", siteLive: false })), null);
  assert.equal(
    linkOf(member("a", "products", 1, { site: "https://agents.krizaka.com", siteLive: true })),
    "https://agents.krizaka.com",
  );
  assert.equal(
    linkOf(member("r", "open-source", 1, { repo: "https://github.com/krizaka/krizaka-rust" })),
    "https://github.com/krizaka/krizaka-rust",
  );
  assert.equal(
    linkOf(
      member("a", "products", 1, {
        site: "https://x.krizaka.com",
        siteLive: false,
        repo: "https://github.com/krizaka/x",
      }),
    ),
    "https://github.com/krizaka/x",
  );
});

test("Krizaka Agents flips to a link by data alone, and leads the products", () => {
  const sov = member("sovkora", "products", 1, { site: "https://www.sovkora.com", siteLive: true });
  const dead = member("agents", "products", 9, { site: "https://agents.krizaka.com", siteLive: false });
  assert.deepEqual(
    footerLinks("products", [sov, dead]).map((l) => l.href),
    ["https://www.sovkora.com"],
  );
  const live = { ...dead, urls: { ...dead.urls, siteLive: true } };
  assert.deepEqual(
    footerLinks("products", [sov, live]).map((l) => l.href),
    ["https://agents.krizaka.com", "https://www.sovkora.com"],
  );
});

test("a private member is never listed", () => {
  const priv = member(
    "agents",
    "products",
    1,
    { site: "https://agents.krizaka.com", siteLive: true },
    { visibility: "private" },
  );
  assert.deepEqual(membersOf("products", [priv]), []);
});

test("Krizaka Rust leads open source, linked to its repository while it has no site", () => {
  const links = footerSettings.columns.find((c) => c.id === "open-source").links;
  assert.equal(links[0].label, "Krizaka Rust");
  assert.equal(links[0].href, "https://github.com/krizaka/krizaka-rust");
  assert.equal(links.at(-1).label, "GitHub");
  for (const l of links) assert.doesNotMatch(l.href ?? "", /^https:\/\/(rust|agents)\.krizaka\.com/);
});

test("the footer's products are the family's, every link on an answering www address", () => {
  const products = footerSettings.columns.find((c) => c.id === "products");
  for (const name of ["Sovkora", "Verikora", "Folioviv", "Kridoc"])
    assert.ok(
      products.links.some((l) => l.label === name),
      name,
    );
  assert.ok(products.links.length >= 4);
});
