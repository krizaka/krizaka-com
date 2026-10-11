#!/usr/bin/env node
// Records the Orazaka CLI's quick start — `install`, `start`, `dev` — from the published package, for the terminal
// replay of /docs/orazaka/cli. What the replay shows is what the CLI printed: its colours become the tones of the lines,
// the machine's paths become ~/projects. Nothing is written by hand.
//
//   node scripts/record-cli.mjs --scratch <empty dir> [--version <x.y.z>]
//
// It runs on a fresh machine: .github/workflows/record-cli.yml (Actions → "Record the CLI" → Run workflow) records it on
// an Ubuntu runner and uploads session.json, which is committed here. Never on a machine whose Orazaka infrastructure
// is in use: `start` brings up the `orazaka` compose project, and would recreate containers another workspace runs.
//
// The recording says where it is trimmed:
//   install  runs in <scratch>: it clones the platform (git, depth 1) and configures it. Its media-worker phase would
//            install PyTorch and diffusers (gigabytes): the run stops there, an empty venv is created, and a second run
//            of the same command in the new workspace records the rest ("venv already exists").
//   start    runs in the cloned workspace: the Docker services come up and are checked; it stops before the AI
//            engines (Ollama, LocalAI, the media worker), which it would launch as background processes.
//   dev      runs in the cloned workspace: the banner of the stack, then Ctrl+C — never nine JVMs.
//   The clone lines of the 20 repositories are elided after the first two (`elided: n`), and the boxes the CLI
//   draws are re-padded once the machine's paths are shortened to ~/projects.
//
// Output: public/assets/orazaka/cli/session.json ({ package, version, recordedAt, steps: [{ command, output, trimmed }] }).

import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const scratch = arg("scratch") && resolve(arg("scratch"));
if (!scratch) {
  console.error("usage: node scripts/record-cli.mjs --scratch <empty dir> [--version <x.y.z>]");
  process.exit(2);
}
mkdirSync(scratch, { recursive: true });
if (readdirSync(scratch).length) {
  console.error(`${scratch} is not empty.`);
  process.exit(2);
}

const PKG = "orazaka";
const VERSION = arg("version") ?? execFileSync("npm", ["view", PKG, "version"], { encoding: "utf8" }).trim();
const CLI = ["-y", `${PKG}@${VERSION}`];
const cloned = join(scratch, "orazaka");

/** The SGR colour of a line → its tone (the first colour it carries). */
const TONES = { 31: "danger", 91: "danger", 32: "success", 92: "success", 33: "warning", 93: "warning", 36: "accent", 96: "accent", 34: "accent", 90: "muted", 2: "muted" };
const ANSI = /\x1b\[[0-9;?]*[A-Za-z]/g;
function toLine(raw) {
  let tone;
  for (const m of raw.matchAll(/\x1b\[([0-9;]+)m/g)) {
    const code = m[1].split(";").map(Number).find((c) => c in TONES);
    if (code !== undefined) {
      tone = TONES[code];
      break;
    }
  }
  const text = raw
    .replace(ANSI, "")
    .replace(/[\x00-\x08\x0b-\x1f]/g, "")
    .replaceAll(cloned, "~/projects/orazaka")
    .replaceAll(scratch, "~/projects")
    .replaceAll(homedir(), "~")
    .trimEnd();
  return tone && text.trim() ? { text, tone } : { text };
}
/** Terminal output → lines: a spinner rewrites its line with \r — keep what it ended on. */
const toLines = (out) =>
  out
    .split("\n")
    .map((l) => l.split("\r").filter((s) => s.replace(ANSI, "").trim()).at(-1) ?? "")
    .map(toLine);

/**
 * Runs the CLI; stops it (SIGINT, then SIGKILL) when `stopAt` matches the output, or `after` ms after `stopWhen`.
 * Returns the output up to the stop marker (excluded).
 */
function run(args, cwd, { stopAt, stopAfter, timeout = 600_000 } = {}) {
  return new Promise((done) => {
    const child = spawn("nice", ["-n", "15", "npx", ...CLI, ...args], {
      cwd,
      env: { ...process.env, FORCE_COLOR: "1", CI: "", COLUMNS: "96" },
      detached: true,
    });
    let out = "";
    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      try {
        process.kill(-child.pid, "SIGINT");
      } catch {}
      setTimeout(() => {
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch {}
      }, 4000);
    };
    const onData = (chunk) => {
      out += chunk;
      process.stdout.write(chunk);
      const plain = out.replace(ANSI, "");
      if (stopAt && stopAt.test(plain) && !stopped) {
        const cut = out.slice(0, out.search(new RegExp(`(?:\\x1b\\[[0-9;]*m)*[^\\n]*${stopAt.source}`)));
        out = cut;
        stop();
        stopAt = undefined;
        child.stdout.off("data", onData);
        child.stderr.off("data", onData);
      } else if (stopAfter && !stopped) {
        // Through the end of the line that matches, then stop.
        const m = new RegExp(`${stopAfter.source}[^\\n]*\\n`).exec(out);
        if (m) {
          out = out.slice(0, m.index + m[0].length);
          stop();
          stopAfter = undefined;
          child.stdout.off("data", onData);
          child.stderr.off("data", onData);
        }
      }
    };
    child.stdout.setEncoding("utf8").on("data", onData);
    child.stderr.setEncoding("utf8").on("data", onData);
    const timer = setTimeout(stop, timeout);
    child.on("close", () => {
      clearTimeout(timer);
      done(out);
    });
  });
}

const trimBlank = (lines) => {
  const out = [...lines];
  while (out.length && !out[0].text.trim()) out.shift();
  while (out.length && !out.at(-1).text.trim()) out.pop();
  return out;
};

console.log(`\n● orazaka@${VERSION} install --yes (in ${scratch})`);
const installA = await run(["install", "--yes"], scratch, { stopAt: /Phase 3/ });
if (!existsSync(join(cloned, "orazaka.workspace.json"))) throw new Error("install did not clone the workspace");
const venv = join(cloned, "orazaka-apps", "workers", "orazaka-worker-media", ".venv");
if (!existsSync(venv)) execFileSync("python3", ["-m", "venv", venv]);
console.log(`\n● orazaka@${VERSION} install --yes (again, in ${cloned})`);
const installB = await run(["install", "--yes"], cloned);
const rest = installB.slice(installB.replace(ANSI, "").includes("Phase 3") ? installB.search(/(?:\x1b\[[0-9;]*m)*[^\n]*Phase 3/) : installB.length);
const restLines = toLines(rest);
// From Phase 3 to the summary: the second run's lines (the line that holds "Phase 3" and what follows).
const start3 = restLines.findIndex((l) => l.text.includes("Phase 3"));

console.log(`\n● orazaka@${VERSION} start (in ${cloned})`);
const start = await run(["start"], cloned, { stopAt: /Phase 2/ });

console.log(`\n● orazaka@${VERSION} dev (in ${cloned})`);
const dev = await run(["dev"], cloned, { stopAfter: /Press Ctrl\+C/, timeout: 60_000 });

/** After the first two repositories, the clone lines say how many more there were. */
function elideClones(lines) {
  const starts = lines.flatMap((l, i) => (/^\$ git clone /.test(l.text) ? [i] : []));
  if (starts.length <= 3) return lines;
  const from = starts[2];
  const to = starts.at(-1);
  return [...lines.slice(0, from), { text: "", elided: starts.length - 3 }, ...lines.slice(to)];
}
/** The boxes the CLI draws (╮ … ╯), re-padded to their widest line once the paths are shortened. */
function repadBoxes(lines) {
  const out = [...lines];
  for (let i = 0; i < out.length; i++) {
    if (!/─+╮$/.test(out[i].text)) continue;
    const end = out.findIndex((l, j) => j > i && /─+╯$/.test(l.text));
    if (end < 0) break;
    const body = out.slice(i + 1, end).map((l) => l.text.replace(/\s*│$/, ""));
    const width = Math.max(...body.map((t) => [...t].length)) + 2;
    const title = out[i].text.replace(/─+╮$/, "");
    out[i] = { ...out[i], text: title + "─".repeat(Math.max(2, width - [...title].length)) + "╮" };
    body.forEach((t, k) => (out[i + 1 + k] = { ...out[i + 1 + k], text: t + " ".repeat(width - [...t].length) + "│" }));
    out[end] = { ...out[end], text: "├" + "─".repeat(width - 1) + "╯" };
    i = end;
  }
  return out;
}
const clean = (lines) => repadBoxes(elideClones(trimBlank(lines)));

const session = {
  package: "@krizaka/orazaka-cli",
  version: VERSION,
  machine: `${process.platform} ${process.arch}`,
  recordedAt: new Date().toISOString().slice(0, 10),
  steps: [
    { command: "npx orazaka install --yes", output: clean([...toLines(installA), ...restLines.slice(Math.max(0, start3))]) },
    { command: "npx orazaka start", output: clean(toLines(start)), trimmed: "ai-engines" },
    { command: "npx orazaka dev", output: clean(toLines(dev)), trimmed: "interrupted" },
  ],
};
const file = join(import.meta.dirname, "..", "public", "assets", "orazaka", "cli", "session.json");
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(session, null, 2) + "\n");
console.log(`\n✓ ${file} — ${session.steps.map((s) => `${s.command}: ${s.output.length} lines`).join(", ")}`);
