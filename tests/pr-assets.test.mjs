import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  assertPlainNewMedia,
  contentTypeFor,
  listFiles,
  loadConfig,
  main,
  markdownBlock,
  parseArgs,
  parseEnvFile,
  rewriteLinks,
  slug,
  upload,
} from "../scripts/pr-assets.mjs";

const cfg = { apiKey: "secret-key", zone: "kz-zone", endpoint: "storage.bunnycdn.com", pullZone: "cdn.example.net" };

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "pr-assets-"));
  mkdirSync(join(dir, "after"));
  writeFileSync(join(dir, "before-dark.png"), "png");
  writeFileSync(join(dir, "after", "home mobile.webm"), "webm");
  writeFileSync(join(dir, ".DS_Store"), "x");
  return dir;
}

test("content types follow the extension", () => {
  assert.equal(contentTypeFor("a/B.PNG"), "image/png");
  assert.equal(contentTypeFor("clip.webm"), "video/webm");
  assert.equal(contentTypeFor("film-en.vtt"), "text/vtt; charset=utf-8");
  assert.equal(contentTypeFor("m.json"), "application/json");
  assert.equal(contentTypeFor("blob.bin"), "application/octet-stream");
});

test("arguments, env files and slugs", () => {
  assert.deepEqual(parseArgs(["upload", "d", "--repo", "r", "--key=43", "--dry-run", "--env-file", "x"]), {
    _: ["upload", "d"],
    dryRun: true,
    write: false,
    repo: "r",
    key: "43",
    envFile: "x",
  });
  assert.deepEqual(parseEnvFile('A=1\n# c\nexport B="two words"\nC=3 # note\nD=\n'), {
    A: "1",
    B: "two words",
    C: "3",
    D: "",
  });
  assert.equal(slug("feat/menu story", "key"), "feat-menu-story");
  assert.throws(() => slug("", "repo"), /--repo is required/);
});

test("configuration names what is missing, never the key", () => {
  assert.throws(() => loadConfig({ MEDIA_STORAGE_API_KEY: "s" }), /MEDIA_STORAGE_ZONE, MEDIA_CDN_HOSTNAME/);
  assert.deepEqual(loadConfig({ MEDIA_CDN_HOSTNAME: "https://cdn.example.net/" }, { requireKey: false }), {
    apiKey: "",
    zone: "",
    endpoint: "storage.bunnycdn.com",
    pullZone: "cdn.example.net",
  });
});

test("files are listed recursively, hidden files skipped", () => {
  const dir = fixture();
  try {
    assert.deepEqual(
      listFiles(dir).map((f) => f.rel),
      ["after/home mobile.webm", "before-dark.png"],
    );
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("upload PUTs each file with its type and checksum, then checks the pull zone", async () => {
  const dir = fixture();
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, ...init });
    return { ok: true, status: 200 };
  };
  try {
    const entries = await upload({ dir, repo: "krizaka-com", key: "43", cfg, fetchImpl, log: () => {} });
    const puts = calls.filter((c) => c.method === "PUT");
    assert.equal(puts.length, 2);
    assert.equal(puts[0].url, "https://storage.bunnycdn.com/kz-zone/pr-assets/krizaka-com/43/after/home%20mobile.webm");
    assert.equal(puts[0].headers["Content-Type"], "video/webm");
    assert.equal(puts[0].headers.AccessKey, "secret-key");
    assert.match(puts[0].headers.Checksum, /^[0-9A-F]{64}$/);
    assert.equal(calls.at(-1).method, "HEAD");
    assert.equal(entries[1].url, "https://cdn.example.net/pr-assets/krizaka-com/43/before-dark.png");
    assert.equal(
      markdownBlock(entries),
      [
        "- [after/home mobile.webm](https://cdn.example.net/pr-assets/krizaka-com/43/after/home%20mobile.webm)",
        "![before-dark.png](https://cdn.example.net/pr-assets/krizaka-com/43/before-dark.png)",
      ].join("\n"),
    );
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("a pull zone that refuses public reads fails the upload", async () => {
  const dir = fixture();
  const fetchImpl = async (_url, init) => ({ ok: init.method === "PUT", status: init.method === "PUT" ? 201 : 403 });
  try {
    await assert.rejects(
      upload({ dir, repo: "r", key: "k", cfg, fetchImpl, log: () => {} }),
      /HTTP 403: check the pull zone/,
    );
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("dry-run needs no key and sends nothing; output never contains the key", async () => {
  const dir = fixture();
  const out = [];
  let sent = 0;
  try {
    const code = await main(["upload", dir, "--repo", "folioviv", "--key", "feat/x", "--dry-run"], {
      env: { MEDIA_CDN_HOSTNAME: "cdn.example.net", MEDIA_STORAGE_API_KEY: "secret-key" },
      fetchImpl: async () => (sent++, { ok: true }),
      log: (l) => out.push(l),
    });
    assert.equal(code, 0);
    assert.equal(sent, 0);
    const text = out.join("\n");
    assert.match(text, /\[dry-run\] https:\/\/cdn\.example\.net\/pr-assets\/folioviv\/feat-x\/before-dark\.png/);
    assert.match(text, /2 file\(s\) would be sent/);
    assert.doesNotMatch(text, /secret-key/);
  } finally {
    rmSync(dir, { recursive: true });
  }
});

const before = () => Date.now() - 1000;
const okFetch = async () => ({ ok: true, status: 200 });

function folder(files) {
  const dir = mkdtempSync(join(tmpdir(), "pr-assets-"));
  for (const name of files) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), "x");
  }
  return dir;
}

test("a folder of new images and videos passes", () => {
  const dir = folder(["a.png", "sub/b.webm", ".DS_Store"]);
  assert.doesNotThrow(() => assertPlainNewMedia(dir, before()));
});

test("a folder holding a .json is refused with its fix", () => {
  const dir = folder(["a.png", "metrics.json"]);
  assert.throws(() => assertPlainNewMedia(dir, before()), /metrics\.json.*mktemp/s);
});

test("a folder older than the run is refused with its fix", () => {
  const dir = folder(["a.png"]);
  assert.throws(() => assertPlainNewMedia(dir, Date.now() + 60_000), /existed before this run.*mktemp/s);
});

test("upload sends nothing when the folder is refused", async () => {
  const dir = folder(["a.png", "m.json"]);
  const calls = [];
  const fetchImpl = async (...a) => (calls.push(a), okFetch());
  await assert.rejects(
    upload({ dir, repo: "r", key: "1", cfg, startedAt: before(), fetchImpl, log: () => {} }),
    /m\.json/,
  );
  assert.equal(calls.length, 0);
});

test("a dry run refuses a non-media folder too", async () => {
  const dir = folder(["a.png", "run.log"]);
  await assert.rejects(upload({ dir, repo: "r", key: "1", cfg, dryRun: true, log: () => {} }), /run\.log/);
});

test("main refuses an old folder and names the fix", async () => {
  const dir = folder(["a.png"]);
  const env = { MEDIA_STORAGE_API_KEY: "k", MEDIA_STORAGE_ZONE: "z", MEDIA_CDN_HOSTNAME: "cdn.example.net" };
  await assert.rejects(
    main(["upload", dir, "--repo", "r", "--key", "1"], {
      env,
      fetchImpl: okFetch,
      log: () => {},
      startedAt: Date.now() + 60_000,
    }),
    /existed before this run.*mktemp/s,
  );
});

test("rewrite turns committed capture links into CDN URLs", async () => {
  const body = [
    "Before/after in `docs/screenshots/story/before-dark.png` and ./docs/screenshots/story/after.webm",
    "![x](https://github.com/krizaka/krizaka-com/blob/main/docs/screenshots/motion/a.png?raw=true)",
    "![y](https://raw.githubusercontent.com/krizaka/krizaka-com/abc123/docs/screenshots/motion/b.png)",
    "untouched: https://github.com/other/krizaka-com/blob/main/docs/screenshots/z.png and mydocs/screenshots/q.png",
  ].join("\n");
  const { text, count } = rewriteLinks(body, { repo: "krizaka-com", cfg });
  assert.equal(count, 4);
  assert.match(text, /`https:\/\/cdn\.example\.net\/pr-assets\/krizaka-com\/story\/before-dark\.png`/);
  assert.match(text, / https:\/\/cdn\.example\.net\/pr-assets\/krizaka-com\/story\/after\.webm/);
  assert.match(text, /\(https:\/\/cdn\.example\.net\/pr-assets\/krizaka-com\/motion\/a\.png\)/);
  assert.match(text, /\(https:\/\/cdn\.example\.net\/pr-assets\/krizaka-com\/motion\/b\.png\)/);
  assert.match(text, /github\.com\/other\/krizaka-com\/blob\/main\/docs\/screenshots\/z\.png/);
  assert.match(text, /mydocs\/screenshots\/q\.png/);

  const dir = mkdtempSync(join(tmpdir(), "pr-assets-"));
  const file = join(dir, "body.md");
  writeFileSync(file, body);
  try {
    await main(["rewrite", file, "--repo", "krizaka-com", "--write"], {
      env: { MEDIA_CDN_HOSTNAME: "cdn.example.net" },
      log: () => {},
    });
    assert.equal(readFileSync(file, "utf8"), text);
  } finally {
    rmSync(dir, { recursive: true });
  }
});
