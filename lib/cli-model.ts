/* The recorded session of the Orazaka CLI (public/assets/orazaka/cli/session.json: scripts/record-cli.mjs runs the
   published CLI on a fresh machine, .github/workflows/record-cli.yml) — what install, start and dev print. It plays in
   the "Krizaka UI, live" gallery of the home (the terminal-replay component). Its shape is checked at build time. */

import session from "@/public/assets/orazaka/cli/session.json";

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
  if (!condition) throw new Error(`lib/cli-model.ts: ${what} — re-record the session (scripts/record-cli.mjs).`);
}

export function cliSession(): CliSession {
  const s = session as CliSession;
  check(Array.isArray(s.steps) && s.steps.length > 0, "session.json has no steps");
  for (const step of s.steps) check(typeof step.command === "string" && Array.isArray(step.output), `session step ${step.command} is malformed`);
  return s;
}
