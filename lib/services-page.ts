/* The structure of /services (Krizaka Entreprise, the one offer for companies, on the pricing template): its three
   parts, the steps of an engagement, the public artefacts it stands on and the questions people ask. Words are
   messages (site.services.*); here only ids and links. */

import { BLOG_URL } from "./site.ts";
import { STACK, type StackId } from "./stack.ts";
import { PRODUCTS } from "./products.ts";

export const SERVICES_PAGE_ORDER = {
  offers: ["modules", "ai", "maintenance"],
  steps: ["discovery", "proposal", "build", "maintain"],
  faq: ["price", "code", "data", "stack", "start"],
} as const;

export type ServicesProofId = StackId | "orazaka" | "blog";

/* Everything the stack publishes (lib/stack.ts, in its order), then the engine's source and the blog: a new part of
   the stack appears here by itself. */
export const SERVICES_PROOF: ReadonlyArray<{ id: ServicesProofId; href: string }> = [
  ...STACK.map((part) => ({ id: part.id, href: part.url })),
  { id: "orazaka", href: PRODUCTS.find((p) => p.id === "orazaka")!.repoUrl },
  { id: "blog", href: BLOG_URL },
];

/** The step's number as the timeline shows it (`01`): from its place, never typed in a message. */
export const stepNumber = (i: number): string => String(i + 1).padStart(2, "0");
