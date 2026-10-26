"use client";

/* The visuals of the publication rows — one chunk, loaded by StackVisual when the row is near the viewport. A visual is
   a name in lib/stack.ts (STACK_VISUALS); this is its only table. Pieces are @krizaka/ui's, the data is read at build and
   arrives as props. */

import { Badge } from "@krizaka/ui/badge";
import { CodeBlock } from "@krizaka/ui/code-block";
import type { StackVisual as VisualId } from "@/lib/stack";
import MotionPlayground, { type MotionPlaygroundWords } from "../playground/MotionPlayground";
import UiShowcase, { type UiShowcaseWords } from "../playground/UiShowcase";

/** What a row's visual needs, whatever its kind (the unused parts stay empty). */
export interface StackVisualData {
  /** The real names of the set of packages (read at build). */
  names: string[];
  /** The install snippet of `code`. */
  snippet: string;
  /** The words of the sample and of the flow. */
  ui: UiShowcaseWords;
  motion: MotionPlaygroundWords;
}

/* How many names the picture of a set of packages shows: what fits its box on two or three lines. */
const CLOUD_MAX = 9;

function Cloud({ names }: { names: string[] }) {
  if (names.length === 0) {
    return (
      <div className={"kz-build-still-mark kz-build-ts-mark"}>
        <span />
        <span />
        <span />
      </div>
    );
  }
  return (
    <div className="kz-build-cloud">
      {names.slice(0, CLOUD_MAX).map((name) => (
        <Badge key={name} tone="neutral" size="md">
          {name}
        </Badge>
      ))}
    </div>
  );
}

export default function StackVisuals({ visual, data }: { visual: VisualId; data: StackVisualData }) {
  switch (visual) {
    case "ui-showcase":
      return <UiShowcase w={data.ui} />;
    case "engine-flow":
      return <MotionPlayground calm w={data.motion} />;
    case "package-cloud":
      return <Cloud names={data.names} />;
    case "code":
      return <CodeBlock code={data.snippet} language="bash" file="terminal" />;
  }
}
