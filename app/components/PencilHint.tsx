"use client";

/* The hidden hint, in the margin of the last page of the notebook (Principles): a tiny pen-nib and, beside it, the code
   in pencil — ink of the ruled lines, almost not there. It shows under the pointer or when the text around it is selected
   (focus.css). Decoration only: `aria-hidden`, not focusable, not announced, nothing depends on it. On a phone five quick
   taps on it open the notebook, the touch twin of the keyboard code (lib/focus.ts tapStep). Where it lives is told in the
   pull request and orchestration.md, never on the site. */

import { useRef } from "react";
import { tapStep } from "@/lib/focus";
import { setCarnet } from "./useCarnet";

const CODE = "↑↑↓↓←→←→ B A";

export default function PencilHint() {
  const taps = useRef<number[]>([]);
  return (
    <span
      className="kz-pencil"
      aria-hidden
      onClick={() => {
        const step = tapStep(taps.current, Date.now());
        taps.current = step.taps;
        if (step.done) setCarnet(true);
      }}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 13.5l.7-3L11 2.7a1.3 1.3 0 011.8 0l.5.5a1.3 1.3 0 010 1.8L5.5 12.8l-3 .7zM9.8 3.9l2.3 2.3" />
      </svg>
      <span className="kz-pencil-code">{CODE}</span>
    </span>
  );
}
