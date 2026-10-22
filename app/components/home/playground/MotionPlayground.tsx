"use client";

/* Krizaka Motion, live, in the « Build with our open source » section: the engine flow of @krizaka/ui in a small frame,
   with two of the lab's settings — the layout and what travels. Four apps around one engine, drawn neutrally (the
   home's real flow is on Orazaka's card); the lab has the rest. Words arrive as props (site.home.stack.motion). */

import { useState } from "react";
import { EngineFlow, type FlowLayout } from "@krizaka/ui/engine-flow";
import { Chip } from "@krizaka/ui/chip";
import { KrizakaLogo } from "@krizaka/ui";

export type FlowMode = "in" | "out" | "both";
export const FLOW_LAYOUTS: readonly FlowLayout[] = ["radial", "top-to-bottom", "left-to-right"];
export const FLOW_MODES: readonly FlowMode[] = ["in", "out", "both"];

export interface MotionPlaygroundWords {
  label: string;
  hint: string;
  /** The hub's name (« Engine »). */
  hub: string;
  /** An app's name, `{id}` replaced (« App {id} »). */
  app: string;
  layout: string;
  layouts: Record<FlowLayout, string>;
  mode: string;
  modes: Record<FlowMode, string>;
}

const APPS = ["A", "B", "C", "D"];

export default function MotionPlayground({ w }: { w: MotionPlaygroundWords }) {
  const [layout, setLayout] = useState<FlowLayout>("radial");
  const [mode, setMode] = useState<FlowMode>("both");
  return (
    <div className="kz-play kz-play-motion">
      <EngineFlow
        className="kz-play-flow"
        label={w.label}
        layout={layout}
        compactLayout={false}
        hub={{ label: w.hub, mark: <KrizakaLogo size={30} animated={false} /> }}
        nodes={APPS.map((id) => ({ id, label: w.app.replace("{id}", id), flow: mode, mark: <span className="kz-play-dot">{id}</span> }))}
        hint={w.hint}
      />
      {/* @ephemeral: the home's motion playground: a control of a live demo, never an address */}
      <Chip.Group type="single" required size="sm" label={w.layout} value={layout} onValueChange={(v) => v && setLayout(v as FlowLayout)}>
        {FLOW_LAYOUTS.map((l) => (
          <Chip key={l} value={l}>
            {w.layouts[l]}
          </Chip>
        ))}
      </Chip.Group>
      {/* @ephemeral: the home's motion playground: a control of a live demo, never an address */}
      <Chip.Group type="single" required size="sm" label={w.mode} value={mode} onValueChange={(v) => v && setMode(v as FlowMode)}>
        {FLOW_MODES.map((m) => (
          <Chip key={m} value={m}>
            {w.modes[m]}
          </Chip>
        ))}
      </Chip.Group>
    </div>
  );
}
