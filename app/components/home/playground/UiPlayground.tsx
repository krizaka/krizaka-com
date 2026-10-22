"use client";

/* Krizaka UI, live, in the « Build with our open source » section: real components of @krizaka/ui (Button and its
   styles, Switch, Chip.Group) and of @krizaka/charts (a Sparkline of @krizaka/ui's real weekly npm downloads, read at
   build), with a theme preview scoped to the tile (`.theme-light` / `.theme-dark` of @krizaka/tokens) — the page's own
   theme is never touched. Words arrive as props (messages site.home.stack.ui). */

import { useState } from "react";
import { Sparkline } from "@krizaka/charts/sparkline";
import { Button } from "@krizaka/ui/button";
import { Chip } from "@krizaka/ui/chip";
import { Switch } from "@krizaka/ui/switch";

export type UiVariant = "primary" | "secondary" | "ghost";
export const UI_VARIANTS: readonly UiVariant[] = ["primary", "secondary", "ghost"];

export interface UiPlaygroundWords {
  label: string;
  variant: string;
  variants: Record<UiVariant, string>;
  button: string;
  switch: string;
  theme: string;
  themes: Record<"dark" | "light", string>;
  downloads?: string;
  trend: string;
}

export default function UiPlayground({ w, series }: { w: UiPlaygroundWords; series?: number[] }) {
  const [variant, setVariant] = useState<UiVariant>("primary");
  const [theme, setTheme] = useState<"dark" | "light" | "">("");
  const [on, setOn] = useState(true);
  return (
    <div className={"kz-play" + (theme ? ` theme-${theme}` : "")} role="group" aria-label={w.label}>
      <div className="kz-play-stage">
        <Button variant={variant}>
          {w.button}
        </Button>
        <Switch label={w.switch} checked={on} onCheckedChange={setOn} />
        <span className="kz-play-switch-label" aria-hidden>
          {w.switch}
        </span>
      </div>
      {/* @ephemeral: the home's UI playground: a control of a live demo, never an address */}
      <Chip.Group type="single" required size="sm" label={w.variant} value={variant} onValueChange={(v) => v && setVariant(v as UiVariant)}>
        {UI_VARIANTS.map((v) => (
          <Chip key={v} value={v}>
            {w.variants[v]}
          </Chip>
        ))}
      </Chip.Group>
      {/* @ephemeral: the home's UI playground: a control of a live demo, never an address */}
      <Chip.Group type="single" size="sm" label={w.theme} value={theme} onValueChange={(v) => setTheme(v as "dark" | "light" | "")}>
        <Chip value="dark">{w.themes.dark}</Chip>
        <Chip value="light">{w.themes.light}</Chip>
      </Chip.Group>
      {series && w.downloads ? (
        <div className="kz-play-trend">
          <Sparkline data={series} variant="area" width={96} height={26} title={w.trend} />
          <span>{w.downloads}</span>
        </div>
      ) : null}
    </div>
  );
}
