/* The code of the bench on /open-source (ComponentBench): the JSX that draws its specimen, from the bench's state —
   so the sample a visitor copies is exactly what they see. Pure, tested by tests/open-source-showcase.test.mjs. The
   imports are the package's real entry points (@krizaka/ui/button, @krizaka/ui/meter). */

export const BENCH_VARIANTS = ["primary", "secondary", "outline", "ghost"] as const;
export const BENCH_SHAPES = ["rounded", "cut", "pill"] as const;
export type BenchVariant = (typeof BENCH_VARIANTS)[number];
export type BenchShape = (typeof BENCH_SHAPES)[number];

export interface BenchState {
  variant: BenchVariant;
  shape: BenchShape;
  progress: number;
  disabled: boolean;
  action: string;
  meter: string;
}

const attr = (s: string) => JSON.stringify(s);

export function benchCode(s: BenchState): string {
  const button = [`variant=${attr(s.variant)}`, `shape=${attr(s.shape)}`, `size="lg"`, s.disabled ? "disabled" : ""]
    .filter(Boolean)
    .join(" ");
  return [
    `import { Button } from "@krizaka/ui/button";`,
    `import { Meter } from "@krizaka/ui/meter";`,
    ``,
    `<Button ${button}>${s.action}</Button>`,
    `<Meter label=${attr(s.meter)} value={${s.progress}} showLabel />`,
  ].join("\n");
}
