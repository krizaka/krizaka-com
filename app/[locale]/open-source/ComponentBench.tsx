"use client";

/* /open-source, « Play with it » — real @krizaka/ui components the visitor drives, and the code that draws them,
   written as they play (the CTO's direction, 2026-10-30: a living showcase, not a picture). The controls are
   components of the kit too (Chip groups, a Slider, a Switch); the specimen is a Button and a Meter. Nothing is
   fetched, nothing is stored: the state is the page's, gone on reload. The code is generated from the same state
   (benchCode, lib/bench-code.ts), so what is shown is always what is drawn. Words arrive as props. */

import { useState } from "react";
import { Button } from "@krizaka/ui/button";
import { Chip, ChipGroup } from "@krizaka/ui/chip";
import { CodeBlock } from "@krizaka/ui/code-block";
import { Meter } from "@krizaka/ui/meter";
import { Slider } from "@krizaka/ui/slider";
import { Switch } from "@krizaka/ui/switch";
import { BENCH_SHAPES, BENCH_VARIANTS, benchCode, type BenchShape, type BenchVariant } from "@/lib/bench-code";

export interface BenchWords {
  label: string;
  variant: string;
  shape: string;
  shapes: Record<BenchShape, string>;
  progress: string;
  disabled: string;
  /** The specimen button's label. */
  action: string;
  /** The specimen meter's name. */
  meter: string;
  code: string;
  copy: string;
  copied: string;
}

const INITIAL_PROGRESS = 64;

export default function ComponentBench({ w }: { w: BenchWords }) {
  const [variant, setVariant] = useState<BenchVariant>("primary");
  const [shape, setShape] = useState<BenchShape>("rounded");
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [disabled, setDisabled] = useState(false);
  const code = benchCode({ variant, shape, progress, disabled, action: w.action, meter: w.meter });
  return (
    <div className="os-bench">
      <div className="os-bench-stage" role="group" aria-label={w.label}>
        <div className="os-bench-specimen">
          <Button variant={variant} shape={shape} size="lg" disabled={disabled} type="button">
            {w.action}
          </Button>
          <Meter label={w.meter} value={progress} valueText={`${progress} %`} showLabel className="os-bench-meter" />
        </div>
        <div className="os-bench-controls">
          {/* @ephemeral: the bench's settings — a live demo's state, never an address */}
          <ChipGroup
            type="single"
            required
            size="sm"
            label={w.variant}
            value={variant}
            onValueChange={(v) => v && setVariant(v as BenchVariant)}
          >
            {BENCH_VARIANTS.map((v) => (
              <Chip key={v} value={v}>
                {v}
              </Chip>
            ))}
          </ChipGroup>
          {/* @ephemeral: the bench's settings — a live demo's state, never an address */}
          <ChipGroup
            type="single"
            required
            size="sm"
            label={w.shape}
            value={shape}
            onValueChange={(v) => v && setShape(v as BenchShape)}
          >
            {BENCH_SHAPES.map((s) => (
              <Chip key={s} value={s}>
                {w.shapes[s]}
              </Chip>
            ))}
          </ChipGroup>
          <Slider
            label={w.progress}
            value={progress}
            onValueChange={(v) => setProgress(v)}
            min={0}
            max={100}
            step={1}
            showLabel
          />
          <div className="os-bench-switch">
            <span>{w.disabled}</span>
            <Switch label={w.disabled} checked={disabled} onCheckedChange={setDisabled} size="sm" />
          </div>
        </div>
      </div>
      <CodeBlock code={code} language="tsx" file={w.code} copyLabel={w.copy} copiedLabel={w.copied} />
    </div>
  );
}
