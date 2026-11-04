import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// next.config.ts is loaded by Next's CommonJS loader: a module it imports that pulls an ESM-only package (as @krizaka/org is)
// fails the build with ERR_PACKAGE_PATH_NOT_EXPORTED, which no unit test of the module itself sees (krizaka-com#606).
// The guard loads the config the way `next build` does and reads its redirects.
const require = createRequire(import.meta.url);

test("next.config.ts loads through Next's own loader and gives its redirects", async () => {
  const loadConfig = require("next/dist/server/config").default;
  const config = await loadConfig("phase-production-build", fileURLToPath(new URL("..", import.meta.url)));
  const redirects = await config.redirects();
  assert.ok(redirects.length > 0);
  assert.equal(redirects.find((r) => r.source === "/docs/yomizaka/:path*")?.destination, "https://www.verikora.com/");
});
