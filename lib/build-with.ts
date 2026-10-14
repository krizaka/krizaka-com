/* "Build with Krizaka" — the home section under the products (#109): one kit, four identities, and the CLI.
   Structure only: the words live in messages/<locale>.json under site.home.build; the figures are read from the
   registries at build (lib/ui-registry.ts, lib/registry-versions.ts); the gallery and its phone are lib/kit-live.ts.

   The CLI session is the recording /docs/orazaka/cli replays (lib/cli-model.ts: the published CLI on a fresh machine,
   scripts/record-cli.mjs), cut short. `npx @krizaka/create` joins the session as soon as the package is on npm. */

import type { TerminalStep } from "@krizaka/ui/terminal-replay";
import type { CliSession } from "./cli-model";

/** The package that scaffolds a Krizaka app — shown in the session once it is published. */
export const CREATE_PACKAGE = "@krizaka/create";

/** The lines of the recorded session the home keeps: the phases, the health checks, the services' banner. */
const HOME_LINES = /Setup Wizard|Phase \d|Workspace ready|Orazaka ready|Dev Infrastructure|healthy \(port|Orazaka Dev Stack|● (EDGE|ROUTER|KNOWLEDGE|WEB-CLIENT|WEB-ADMIN|MOBILE) |Press Ctrl\+C/;

/**
 * The session the terminal plays: install, start, dev — and create once it exists. The lines are the real recording of
 * /docs/orazaka/cli (lib/cli-model.ts, recorded from the published CLI), cut to what a home page has room for: the
 * box borders the CLI draws are dropped, nothing is written here.
 */
export function cliSession(recorded: CliSession, createPublished: boolean): TerminalStep[] {
  const steps: TerminalStep[] = recorded.steps.map((step) => ({
    command: step.command,
    output: step.output
      .filter((line) => !line.elided && HOME_LINES.test(line.text))
      .map((line) => ({ text: line.text.replace(/\s*│\s*$/, "").replace(/^(\s*)│\s{2}/, "$1"), tone: line.tone })),
  }));
  if (createPublished) steps.push({ command: `npx ${CREATE_PACKAGE} my-app`, output: [] });
  return steps;
}
