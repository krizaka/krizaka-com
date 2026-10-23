/* The stack Krizaka open-sources — the pieces every product is built on, each on its own site, built from its own
   repository (ui.krizaka.com, java.krizaka.com, ts.krizaka.com). Structure only: the words are messages → site.stack.<id>; the versions
   and counts shown beside them are read at build (lib/registry-versions.ts), never typed here. */

import { GITHUB_ORG_URL, KRIZAKA_UI_REPO_URL } from "./site";

export type StackId = "ui" | "java" | "ts";

export interface StackPart {
  id: StackId;
  name: string;
  /** Its own site. */
  url: string;
  /** Where its source lives. */
  repoUrl: string;
  /** Where it is published. */
  registry: "npm" | "maven";
  /** The coordinate whose published version the site shows; none for a set of packages released one by one (Krizaka TypeScript). */
  coordinate?: string;
}

export const STACK: StackPart[] = [
  { id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com", repoUrl: KRIZAKA_UI_REPO_URL, registry: "npm", coordinate: "@krizaka/ui" },
  { id: "java", name: "Krizaka Java", url: "https://java.krizaka.com", repoUrl: `${GITHUB_ORG_URL}/krizaka-build`, registry: "maven", coordinate: "com.krizaka:krizaka-bom" },
  { id: "ts", name: "Krizaka TypeScript", url: "https://ts.krizaka.com", repoUrl: `${GITHUB_ORG_URL}/krizaka-ts`, registry: "npm" },
];

/** `ui.krizaka.com` — an address as it reads in a sentence. */
export const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Krizaka Motion — the motion lab (krizaka/krizaka-motion): experimental generative visuals played on GitHub Pages. Not
    a package: what proves itself moves into Krizaka UI (the engine flow is @krizaka/ui/engine-flow). */
export const MOTION_LAB = {
  name: "Krizaka Motion",
  url: "https://krizaka.github.io/krizaka-motion/orazaka",
  repoUrl: `${GITHUB_ORG_URL}/krizaka-motion`,
} as const;
