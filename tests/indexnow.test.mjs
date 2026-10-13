import { test } from "node:test";
import assert from "node:assert/strict";

test("IndexNow: one public key file, a payload the protocol accepts", async () => {
  const { findKey, payload, sitemapUrls } = await import("../scripts/indexnow.mjs");
  const key = findKey();
  assert.match(key, /^[0-9a-f]{32}$/);
  const body = payload("https://www.krizaka.com", key, sitemapUrls("<urlset><url><loc>https://www.krizaka.com/en</loc></url></urlset>"));
  assert.deepEqual(body.urlList, ["https://www.krizaka.com/en"]);
  assert.equal(body.host, "www.krizaka.com");
  assert.equal(body.keyLocation, `https://www.krizaka.com/${key}.txt`);
});
