/* The Orazaka CLI as /docs/orazaka/cli draws it — read from generated data, never written by hand (AGENTS.md §2):
   - architecture.json · cli        `orazaka docs sync` (products/orazaka/scripts/generate-docs.mjs, from the CLI's code):
                                    its packages, its commands with their arguments and options, the quick-start journey;
   - public/assets/orazaka/cli/session.json   scripts/record-cli.mjs (the published CLI, recorded on a fresh machine by
                                    .github/workflows/record-cli.yml): what install, start and dev print.
   The shape the components rely on is checked at build time: a model that lost a field fails the build. Server-side:
   the client components receive the slice they draw. */

import architecture from "@/app/data/architecture.json";
import session from "@/public/assets/orazaka/cli/session.json";

export interface CliArgument {
  name: string;
  desc: string;
}
export interface CliOption {
  flag: string;
  desc: string;
  default: string | null;
}
export interface CliCommand {
  /** `pack install`: the top command, then the subcommand. */
  name: string;
  top: string;
  isTop: boolean;
  description: string;
  args: CliArgument[];
  aliases: string[];
  options: CliOption[];
}
export interface CliPhase {
  /** `1`, `3b`, `5a` — or `workspace` for the clone of an empty directory. */
  id: string;
  title: string;
  /** What it depends on (`--mode full`), or what the CLI says about it (`no Orazaka workspace here`). */
  detail: string;
}
export interface CliProcess {
  key: string;
  label: string;
  port: number | null;
}
export interface CliJourneyStep {
  command: "install" | "start" | "dev";
  description: string;
  phases?: CliPhase[];
  processes?: CliProcess[];
}
export interface CliModel {
  package: string;
  alias: string | null;
  version: string;
  bin: string;
  node: string | null;
  commands: CliCommand[];
  journey: CliJourneyStep[];
}

export type SessionTone = "muted" | "accent" | "success" | "warning" | "danger";
export interface SessionLine {
  text: string;
  tone?: SessionTone;
  /** A run of similar lines the recording left out (the clones of the 20 repositories after the first two). */
  elided?: number;
}
export interface SessionStep {
  command: string;
  output: SessionLine[];
  /** Where the recording stopped: before the AI engines (`ai-engines`), or after the banner (`interrupted`). */
  trimmed?: "ai-engines" | "interrupted";
}
export interface CliSession {
  package: string;
  version: string;
  machine?: string;
  recordedAt: string;
  steps: SessionStep[];
}

function check(condition: unknown, what: string): asserts condition {
  if (!condition) throw new Error(`lib/cli-model.ts: ${what} — re-sync the docs (orazaka docs sync) or re-record the session (scripts/record-cli.mjs).`);
}

export function cliModel(): CliModel {
  const cli = (architecture as { cli?: CliModel }).cli;
  check(cli && Array.isArray(cli.commands) && cli.commands.length > 0, "architecture.json has no cli.commands");
  check(typeof cli.bin === "string" && typeof cli.package === "string", "architecture.json · cli lacks its bin or package");
  for (const command of ["install", "start", "dev"] as const) {
    const step = cli.journey?.find((s) => s.command === command);
    check(step && (step.phases?.length || step.processes?.length), `architecture.json · cli.journey lacks ${command}`);
  }
  for (const c of cli.commands) check(typeof c.name === "string" && Array.isArray(c.options) && Array.isArray(c.args), `cli command ${c.name} is malformed`);
  return cli;
}

export function cliSession(): CliSession {
  const s = session as CliSession;
  check(Array.isArray(s.steps) && s.steps.length > 0, "session.json has no steps");
  for (const step of s.steps) check(typeof step.command === "string" && Array.isArray(step.output), `session step ${step.command} is malformed`);
  return s;
}
