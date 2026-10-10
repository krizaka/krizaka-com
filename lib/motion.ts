/* The site's motion vocabulary, as props for server or client components (app/motion.css, SiteMotion).

   reveal(i)        — a block that rises into place once, as it enters the viewport; `i` staggers siblings
                      (70 ms apart, capped so a long list never makes the reader wait).
   reveal(i, "soft") — the same, shorter and without blur: schemas and dense content (architecture diagrams).

   Never on the first screen (hero, h1, lead): what the visitor sees on arrival is painted at once (LCP, CLS). */

import type { CSSProperties } from "react";

const STEP_MS = 70;
const MAX_STEPS = 5;

export type RevealVariant = "rise" | "soft";

export function reveal(i = 0, variant: RevealVariant = "rise"): { "data-reveal": string; style?: CSSProperties } {
  const delay = Math.min(i, MAX_STEPS) * STEP_MS;
  return {
    "data-reveal": variant === "soft" ? "soft" : "",
    ...(delay ? { style: { "--kz-delay": `${delay}ms` } as CSSProperties } : {}),
  };
}
