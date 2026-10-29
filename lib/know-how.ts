/* What Krizaka knows how to do, each capability backed by evidence a visitor can open — its source or its site — and
   by figures read at build (Krizaka UI's registries, npm, Maven Central, GitHub). Structure only: the words are
   messages (site.home.knowhow.items.<id>). A figure that cannot be read is dropped, never replaced by a typed number. */

import { AKINAZA_REPO_URL, GITHUB_REPO_URL, YOMIZAKA_REPO_URL } from "./site.ts";
import { STACK } from "./stack.ts";

type ProductId = "orazaka" | "yomizaka" | "akinaza";

export type KnowHowId = "engine" | "documents" | "shops" | "design" | "java" | "open";

export interface KnowHow {
  id: KnowHowId;
  /** Where the proof is: a product's source, a stack site, or the open-source view. */
  href: string;
  /** The product whose honest status the card shows (a capability of the stack shows its figures instead). */
  product?: ProductId;
}

const stack = (id: (typeof STACK)[number]["id"]) => STACK.find((p) => p.id === id)!.url;

export const KNOW_HOW: readonly KnowHow[] = [
  { id: "engine", href: GITHUB_REPO_URL, product: "orazaka" },
  { id: "documents", href: YOMIZAKA_REPO_URL, product: "yomizaka" },
  { id: "shops", href: AKINAZA_REPO_URL, product: "akinaza" },
  { id: "design", href: stack("ui") },
  { id: "java", href: stack("java") },
  { id: "open", href: "/open-source" },
];

export interface KnowHowFigures {
  components: number;
  native: number;
  maven: number;
  repositories: number;
  npm: number;
  downloads?: number;
}

/** The facts of a capability as `[messageKey, count]` pairs, only those whose figure was read (> 0). */
export function knowHowFacts(
  id: KnowHowId,
  f: KnowHowFigures,
): [key: "components" | "native" | "maven" | "repositories" | "npm" | "downloads", count: number][] {
  const all: Record<KnowHowId, [string, number | undefined][]> = {
    engine: [],
    documents: [],
    shops: [],
    design: [
      ["components", f.components],
      ["native", f.native],
    ],
    java: [["maven", f.maven]],
    open: [
      ["repositories", f.repositories],
      ["npm", f.npm],
      ["downloads", f.downloads],
    ],
  };
  return all[id].filter((x): x is [never, number] => typeof x[1] === "number" && x[1] > 0);
}
