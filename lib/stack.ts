/* The stack Krizaka open-sources — the pieces every product is built on, each on its own site, built from its own
   repository (ui.krizaka.com, lab.krizaka.com, java.krizaka.com, ts.krizaka.com). ONE list, read by /open-source and /story (the home no longer
   carries the libraries). Structure only: the words are messages,
   and the versions and counts shown beside them are read at build (lib/registry-versions.ts), never typed here. */

import { GITHUB_ORG_URL, KRIZAKA_UI_REPO_URL } from "./site.ts";

export type StackId = "ui" | "motion" | "java" | "ts";

export interface StackPart {
  id: StackId;
  name: string;
  /** Its own site. */
  url: string;
  /** Where its source lives. */
  repoUrl: string;
  /** Where it is published: a package registry, or `none` (Krizaka Lab is a lab, not a package). */
  registry: "npm" | "maven" | "none";
  /** The coordinate whose published version the site shows; none for a set of packages released one by one (Krizaka TypeScript). */
  coordinate?: string;
  /** `released` once published; `development` while it is being built in the open (a lab). */
  status: "released" | "development";
  /** The first action: its documentation (`docs`, the site) or its lab (`lab`, a scene of the site at `actionPath`). */
  action: "docs" | "lab";
  actionPath?: string;
}

/* The lab's site, served over HTTPS since krizaka-lab#55 — one value here, and every card's host follows: no host is
   ever typed in a component. */
const LAB_SITE = "https://lab.krizaka.com";

/** Krizaka Lab (krizaka/krizaka-lab) is the motion lab: experimental generative visuals played from its site. Not
    a package: what proves itself moves into Krizaka UI (the engine flow is @krizaka/ui/engine-flow). */
export const STACK: StackPart[] = [
  { id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com", repoUrl: KRIZAKA_UI_REPO_URL, registry: "npm", coordinate: "@krizaka/ui", status: "released", action: "docs" },
  { id: "motion", name: "Krizaka Lab", url: LAB_SITE, repoUrl: `${GITHUB_ORG_URL}/krizaka-lab`, registry: "none", status: "development", action: "lab", actionPath: "/orazaka" },
  { id: "java", name: "Krizaka Java", url: "https://java.krizaka.com", repoUrl: `${GITHUB_ORG_URL}/krizaka-build`, registry: "maven", coordinate: "com.krizaka:krizaka-bom", status: "released", action: "docs" },
  { id: "ts", name: "Krizaka TypeScript", url: "https://ts.krizaka.com", repoUrl: `${GITHUB_ORG_URL}/krizaka-ts`, registry: "npm", status: "released", action: "docs" },
];

/** The licence of everything the stack publishes. */
export const STACK_LICENCE = "Apache-2.0";

/** Where the first action goes: the site, or a scene of it. */
export const stackActionUrl = (part: StackPart) => `${part.url}${part.actionPath ?? ""}`;

/** `ui.krizaka.com` — an address as it reads in a sentence. */
export const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
