import { OROCHIA_APP_URL } from "./site";
/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — organisation-level data for the home page and /open-source.
   Repository lists are NOT written here: they come from the generated
   architecture files of each product (app/data/*.json).
   ═══════════════════════════════════════════════════════════════════ */

import orazaka from "@/app/data/architecture.json";
import orochia from "@/app/data/orochia-architecture.json";

export type Loc = "fr" | "en";
export type L = Record<Loc, string>;

export interface OrgRepository {
  name: string;
  url: string;
  description: string;
  product: "orazaka" | "orochia";
  group: string;
}

const ORAZAKA_GROUP: Record<string, string> = {
  foundation: "foundation",
  domain: "domain",
  ai: "ai",
  worker: "ai",
  app: "apps",
  content: "apps",
};

/** Every public repository of the organisation, from the generated product data. */
export function orgRepositories(): OrgRepository[] {
  const oz = ((orazaka as { repositories?: { name: string; url: string; description: string; layer: string }[] }).repositories ?? []).map(
    (r) => ({ name: r.name, url: r.url, description: r.description, product: "orazaka" as const, group: ORAZAKA_GROUP[r.layer] ?? "apps" }),
  );
  const workspace: OrgRepository = {
    name: "orazaka",
    url: "https://github.com/krizaka/orazaka",
    description:
      "Orazaka platform workspace: governance contract, workspace manifest, local infrastructure, end-to-end tests and architecture docs. Clones and builds every Orazaka repository.",
    product: "orazaka",
    group: "workspace",
  };
  const oc = orochia.repositories.map((r) => ({
    name: r.name,
    url: r.url,
    description: r.description,
    product: "orochia" as const,
    group: "orochia",
  }));
  return [workspace, ...oz, ...oc];
}

export interface Product {
  id: "orazaka" | "orochia";
  name: string;
  href: string;
  docsHref: string;
  repoUrl: string;
  /** The running application, when there is one to open (OROCHIA_APP_URL). */
  appUrl?: string;
  accent: string;
  /* Tagline, summary and points: messages → site.products.<id>. */
  stack: string;
  /** Screen recording of the product: `${src}.webm|.mp4|.jpg` under /public. */
  media: { src: string; aspect: string; frame: string };
}

export const PRODUCTS: Product[] = [
  {
    id: "orazaka",
    name: "Orazaka",
    href: "/products/orazaka",
    docsHref: "/products/orazaka/getting-started/101",
    repoUrl: "https://github.com/krizaka/orazaka",
    accent: "#6366f1",
    stack: "Java 21 · Spring Boot 4 · Spring AI 2 · Next.js · Ollama",
    media: { src: "/assets/orazaka/tour/chat", aspect: "1000 / 497", frame: "orazaka · web client" },
  },
  {
    id: "orochia",
    name: "Orochia",
    href: "/products/orochia",
    docsHref: "/products/orochia/docs",
    repoUrl: "https://github.com/krizaka/orochia",
    appUrl: OROCHIA_APP_URL,
    accent: "#a855f7",
    stack: "Next.js 16 · PostgreSQL · Drizzle · Bunny Stream",
    media: { src: "/assets/orochia/tour/feed", aspect: "16 / 10", frame: "orochia · web" },
  },
];
