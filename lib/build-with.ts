/* "Build with Krizaka" — the home section under the products (#109): one kit, four identities, and the CLI.
   Structure only: the words live in messages/<locale>.json under site.home.build; the figures are read from the
   registries at build (lib/ui-registry.ts, lib/registry-versions.ts); the native screenshots are the stories of the
   published registries (public/ui-examples, written by scripts/gen-ui-docs.mjs) — nothing drawn or typed here.

   The CLI session is the one the Orazaka CLI really prints (krizaka/orazaka-cli, src/commands/install · start · dev):
   install's first phase as `npx orazaka install` printed it on 2026-10-12, start's health checks and dev's banner
   (ports from src/utils/config.ts). `npx @krizaka/create` joins the session as soon as the package is on npm. */

import type { TerminalStep } from "@krizaka/ui/terminal-replay";

/** The native examples shown in the phone, by registry name and example name — the same pieces as the web stage. */
export const NATIVE_SHOTS = [
  { component: "profile-card", example: "default" },
  { component: "line-chart", example: "creator-earnings" },
  { component: "chip", example: "single" },
] as const;

/** The width, in points, of a native story's column inside its 992-point canvas: the phone shows that column. */
export const NATIVE_COLUMN = 352;

/** The package that scaffolds a Krizaka app — shown in the session once it is published. */
export const CREATE_PACKAGE = "@krizaka/create";

/** The session the terminal plays: install, start, dev — and create once it exists. */
export function cliSession(createPublished: boolean): TerminalStep[] {
  const steps: TerminalStep[] = [
    {
      command: "npx orazaka install",
      output: [
        { text: "┌  🥷 Orazaka Setup Wizard", tone: "accent" },
        "◇  Phase 1 — Tool Verification",
        { text: "   ✔ Docker · Java 21 · Node.js · Python 3 · Ollama · FFmpeg · Git", tone: "success" },
        { text: "◆  All critical tools are available ✔", tone: "success" },
        "◇  Phase 4 — Deployment Topology Configuration",
        { text: "└  Orazaka ready. Happy building! 🚀", tone: "success" },
      ],
    },
    {
      command: "orazaka start",
      output: [
        { text: "┌  🥷 Orazaka Dev Infrastructure", tone: "accent" },
        "◇  Docker containers launched.",
        { text: "│  ✔ PostgreSQL healthy (port 5432)", tone: "success" },
        { text: "│  ✔ Redis healthy (port 6379)", tone: "success" },
        { text: "│  ✔ RabbitMQ healthy (port 5672)", tone: "success" },
        { text: "└  Dev infrastructure ready! Run `npx orazaka dev` 🚀", tone: "success" },
      ],
    },
    {
      command: "orazaka dev",
      output: [
        { text: "  🥷  Orazaka Dev Stack", tone: "accent" },
        "  ● EDGE           :8088  http://localhost:8088",
        "  ● ROUTER         :8080  http://localhost:8080",
        "  ● KNOWLEDGE      :8084  http://localhost:8084",
        "  ● WEB-CLIENT     :3000  http://localhost:3000",
        "  ● WEB-ADMIN      :3001  http://localhost:3001",
        "  ● MOBILE         :8081  http://localhost:8081",
        { text: "  Press Ctrl+C to stop all processes", tone: "muted" },
      ],
    },
  ];
  if (createPublished) steps.push({ command: `npx ${CREATE_PACKAGE} my-app`, output: [] });
  return steps;
}
