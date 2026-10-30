import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRANCH, RELEASE_TAG, decide } from "../scripts/promote-production.mjs";

const SCRIPT = fileURLToPath(new URL("../scripts/promote-production.mjs", import.meta.url));
const SWITCH = fileURLToPath(new URL("../scripts/do-app-production-branch.sh", import.meta.url));
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const base = {
  tag: "v0.2.0",
  onMain: true,
  productionSha: "a",
  tagSha: "b",
  productionIsAncestor: true,
  tagIsAncestor: false,
};

test("the decision: create, fast-forward, never backwards, refuse a stray tag or a diverged branch", () => {
  assert.equal(BRANCH, "production");
  assert.ok(RELEASE_TAG.test("v1.2.3"));
  for (const t of ["1.2.3", "v1.2", "v1.2.3-rc.1", "main", "krizaka-com-v1.2.3"])
    assert.equal(decide({ ...base, tag: t }).action, "refuse", t);
  assert.equal(decide({ ...base, onMain: false }).action, "refuse");
  assert.equal(decide({ ...base, productionSha: null }).action, "create");
  assert.equal(decide(base).action, "forward");
  assert.equal(decide({ ...base, productionSha: "b" }).action, "noop");
  assert.equal(decide({ ...base, productionIsAncestor: false, tagIsAncestor: true }).action, "noop");
  assert.equal(decide({ ...base, productionIsAncestor: false, tagIsAncestor: false }).action, "refuse");
});

/** A bare « origin » and a clone with commits on main, like the runner's checkout. */
function fixture() {
  const dir = mkdtempSync(path.join(tmpdir(), "promote-"));
  const origin = path.join(dir, "origin.git");
  const work = path.join(dir, "work");
  const git = (cwd, ...a) =>
    execFileSync("git", a, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git(dir, "init", "--quiet", "--bare", "--initial-branch=main", origin);
  git(dir, "clone", "--quiet", origin, work);
  for (const [k, v] of [
    ["user.name", "t"],
    ["user.email", "t@t"],
    ["commit.gpgsign", "false"],
    ["tag.gpgsign", "false"],
  ])
    git(work, "config", k, v);
  git(work, "checkout", "--quiet", "-b", "main");
  const commit = (msg) => {
    writeFileSync(path.join(work, "f.txt"), msg);
    git(work, "add", "f.txt");
    git(work, "commit", "--quiet", "--no-verify", "-m", msg);
    git(work, "push", "--quiet", "origin", "main");
    return git(work, "rev-parse", "HEAD");
  };
  const tag = (name) => {
    git(work, "tag", name);
    git(work, "push", "--quiet", "origin", name);
  };
  const run = (...a) => spawnSync(process.execPath, [SCRIPT, ...a], { cwd: work, encoding: "utf8" });
  const production = () => git(origin, "rev-parse", "--verify", "--quiet", `refs/heads/${BRANCH}`);
  return { dir, work, git, commit, tag, run, production, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test("the script against a real repository: created, fast-forwarded, kept, dry-run changes nothing, divergence refused", (t) => {
  const r = fixture();
  t.after(r.cleanup);
  const first = r.commit("one");
  r.tag("v0.2.0");

  let out = r.run("v0.2.0", "--dry-run");
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /\[dry-run\] create/);
  assert.throws(() => r.production(), "a dry run pushes nothing");

  out = r.run("v0.2.0");
  assert.equal(out.status, 0, out.stderr);
  assert.equal(r.production(), first);

  const second = r.commit("two");
  r.commit("three (not released yet)");
  r.git(r.work, "tag", "v0.3.0", second);
  r.git(r.work, "push", "--quiet", "origin", "v0.3.0");
  out = r.run("v0.3.0");
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /forward/);
  assert.equal(r.production(), second, "production is at the tag, not at main's head");

  out = r.run("v0.2.0");
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /noop/);
  assert.equal(r.production(), second, "an older release never moves production backwards");

  out = r.run("v0.3.0");
  assert.match(out.stdout, /noop/, "the same release twice is a no-op");

  out = r.run("0.3.0");
  assert.equal(out.status, 1);
  assert.match(out.stdout, /not a release tag/);

  // A tag that is not on main (a side branch) is refused.
  r.git(r.work, "checkout", "--quiet", "-b", "side", first);
  writeFileSync(path.join(r.work, "g.txt"), "side");
  r.git(r.work, "add", "g.txt");
  r.git(r.work, "commit", "--quiet", "--no-verify", "-m", "side");
  r.git(r.work, "tag", "v9.9.9");
  r.git(r.work, "push", "--quiet", "origin", "v9.9.9");
  out = r.run("v9.9.9");
  assert.equal(out.status, 1);
  assert.match(out.stdout, /not on main/);

  // Someone pushed to production directly: the next release is refused, never forced over it.
  r.git(r.work, "push", "--quiet", "--force", "origin", `HEAD:refs/heads/${BRANCH}`);
  const diverged = r.production();
  r.git(r.work, "checkout", "--quiet", "main");
  r.commit("four");
  r.tag("v0.4.0");
  out = r.run("v0.4.0");
  assert.equal(out.status, 1);
  assert.match(out.stdout, /diverged/);
  assert.equal(r.production(), diverged);
});

test("the workflows: release-please pinned, production on release published, never a force push", () => {
  const rp = read(".github/workflows/release-please.yml");
  assert.match(rp, /googleapis\/release-please-action@[0-9a-f]{40} /);
  assert.match(rp, /branches: \[main\]/);
  assert.match(rp, /gh workflow run production\.yml/);
  const prod = read(".github/workflows/production.yml");
  assert.match(prod, /release:\n\s+types: \[published\]/);
  assert.match(prod, /node scripts\/promote-production\.mjs "\$TAG"/);
  assert.match(prod, /create-github-app-token@[0-9a-f]{40} /);
  for (const f of [rp, prod, read("scripts/promote-production.mjs")])
    assert.doesNotMatch(f.replace(/Never --force\./, ""), /--force\b|push -f\b|\+refs\/heads\/production/);
});

/** The switch script with a fake doctl (serves the spec, records `update`) and a fake git (production branch or not). */
function doSwitch(spec, { productionExists = true, args = [] } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "do-switch-"));
  const bin = path.join(dir, "bin");
  mkdirSync(bin);
  writeFileSync(path.join(dir, "spec.yaml"), spec);
  writeFileSync(
    path.join(bin, "doctl"),
    [
      "#!/usr/bin/env bash",
      'case "$1 $2 $3" in',
      `  "apps spec get") cat "${dir}/spec.yaml" ;;`,
      '  "apps spec validate") exit 0 ;;',
      `  "apps update "*) shift 3; cp "$2" "${dir}/applied.yaml" ;;`,
      "  *) exit 9 ;;",
      "esac",
      "",
    ].join("\n"),
  );
  writeFileSync(path.join(bin, "git"), `#!/usr/bin/env bash\nexit ${productionExists ? 0 : 2}\n`);
  for (const f of ["doctl", "git"]) chmodSync(path.join(bin, f), 0o755);
  const out = spawnSync("bash", [SWITCH, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
  });
  const appliedFile = path.join(dir, "applied.yaml");
  const applied = existsSync(appliedFile) ? readFileSync(appliedFile, "utf8") : null;
  rmSync(dir, { recursive: true, force: true });
  return { ...out, applied };
}

// The live spec sorts its keys (branch before repo); another repository's block is never touched.
const LIVE = `name: krizaka-com
services:
- name: web
  github:
    branch: main
    deploy_on_push: true
    repo: krizaka/krizaka-com
  http_port: 3000
- name: other
  github:
    branch: main
    repo: krizaka/elsewhere
`;

test("the DigitalOcean switch: main → production for this repository only, dry-run, idempotent, never to a missing branch", () => {
  const dry = doSwitch(LIVE, { args: ["--dry-run"] });
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /-    branch: main\n\+    branch: production/);
  assert.match(dry.stdout, /\[dry-run\] nothing applied/);
  assert.equal(dry.applied, null);

  const done = doSwitch(LIVE);
  assert.equal(done.status, 0, done.stderr);
  assert.equal(
    done.applied,
    LIVE.replace("    branch: main\n    deploy_on_push", "    branch: production\n    deploy_on_push"),
  );
  assert.match(done.applied, /branch: main\n    repo: krizaka\/elsewhere/);

  const again = doSwitch(done.applied);
  assert.equal(again.status, 0, again.stderr);
  assert.match(again.stdout, /already deploys from production/);
  assert.equal(again.applied, null);

  const early = doSwitch(LIVE, { productionExists: false });
  assert.equal(early.status, 1);
  assert.match(early.stderr, /does not exist/);
  assert.equal(early.applied, null, "never applied before the first release");

  assert.match(read("deploy/digitalocean/app.yaml"), /branch: production/);
});
