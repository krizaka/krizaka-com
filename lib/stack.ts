/* The stack Krizaka open-sources — the pieces every product is built on, each on its own site, built from its own
   repository (ui.krizaka.com, motion.krizaka.com, java.krizaka.com, ts.krizaka.com). ONE list: adding a publication is one
   entry here plus its messages (site.home.stack.<id>.line) — no component changes. Structure only: the words are messages,
   and the versions and counts shown beside them are read at build (lib/registry-versions.ts), never typed here. */

import { GITHUB_ORG_URL, KRIZAKA_UI_REPO_URL } from "./site.ts";

export type StackId = "ui" | "motion" | "java" | "ts";

/** The live mini-visual of a publication's row (app/components/home/stack/StackVisuals.tsx): Krizaka UI's own card, the
    engine flow (calm), the real names of a set of packages read at build, or its install snippet. */
export const STACK_VISUALS = ["ui-showcase", "engine-flow", "package-cloud", "code"] as const;
export type StackVisual = (typeof STACK_VISUALS)[number];

export interface StackPart {
  id: StackId;
  name: string;
  /** Its own site. */
  url: string;
  /** Where its source lives. */
  repoUrl: string;
  /** Where it is published: a package registry, or `none` (Krizaka Motion is a lab, not a package). */
  registry: "npm" | "maven" | "none";
  /** The coordinate whose published version the site shows; none for a set of packages released one by one (Krizaka TypeScript). */
  coordinate?: string;
  /** Its mini-visual. */
  visual: StackVisual;
  /** `released` once published; `development` while it is being built in the open (a lab). */
  status: "released" | "development";
  /** The first action: its documentation (`docs`, the site) or its lab (`lab`, a scene of the site at `actionPath`). */
  action: "docs" | "lab";
  actionPath?: string;
}

/* The lab's site, served over HTTPS since krizaka-motion#55 — one value here, and every card's host follows: no host is
   ever typed in a component. */
const MOTION_SITE = "https://motion.krizaka.com";

/** Krizaka Motion (krizaka/krizaka-motion) is the motion lab: experimental generative visuals played from its site. Not
    a package: what proves itself moves into Krizaka UI (the engine flow is @krizaka/ui/engine-flow). */
export const STACK: StackPart[] = [
  { id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com", repoUrl: KRIZAKA_UI_REPO_URL, registry: "npm", coordinate: "@krizaka/ui", visual: "ui-showcase", status: "released", action: "docs" },
  { id: "motion", name: "Krizaka Motion", url: MOTION_SITE, repoUrl: `${GITHUB_ORG_URL}/krizaka-motion`, registry: "none", visual: "engine-flow", status: "development", action: "lab", actionPath: "/orazaka" },
  { id: "java", name: "Krizaka Java", url: "https://java.krizaka.com", repoUrl: `${GITHUB_ORG_URL}/krizaka-build`, registry: "maven", coordinate: "com.krizaka:krizaka-bom", visual: "package-cloud", status: "released", action: "docs" },
  { id: "ts", name: "Krizaka TypeScript", url: "https://ts.krizaka.com", repoUrl: `${GITHUB_ORG_URL}/krizaka-ts`, registry: "npm", visual: "package-cloud", status: "released", action: "docs" },
];

/** The licence of everything the stack publishes. */
export const STACK_LICENCE = "Apache-2.0";

/** The library code of a publication — `KZ-L01…` from its place in the list (the products' are `KZ-0n`), never typed. */
export const stackCode = (part: StackPart) => `KZ-L${String(STACK.indexOf(part) + 1).padStart(2, "0")}`;

/** Where the first action goes: the site, or a scene of it. */
export const stackActionUrl = (part: StackPart) => `${part.url}${part.actionPath ?? ""}`;

/** `ui.krizaka.com` — an address as it reads in a sentence. */
export const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
