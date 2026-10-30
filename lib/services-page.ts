/* The structure of /services (Krizaka Entreprise, the one offer for companies): what it covers, the steps of an
   engagement and the public artefacts it stands on. Words are messages (site.services.*); here only ids and links. */

import { BLOG_URL } from "./site.ts";
import { STACK } from "./stack.ts";
import { PRODUCTS } from "./products.ts";

export const SERVICES_PAGE_ORDER = {
  covers: ["modules", "ai", "maintenance"],
  steps: ["discovery", "proposal", "build", "maintain"],
} as const;

export type ServicesProofId = "ui" | "java" | "orazaka" | "blog";

const stackUrl = (id: string) => STACK.find((s) => s.id === id)!.url;

export const SERVICES_PROOF: ReadonlyArray<{ id: ServicesProofId; href: string }> = [
  { id: "ui", href: stackUrl("ui") },
  { id: "java", href: stackUrl("java") },
  { id: "orazaka", href: PRODUCTS.find((p) => p.id === "orazaka")!.repoUrl },
  { id: "blog", href: BLOG_URL },
];
