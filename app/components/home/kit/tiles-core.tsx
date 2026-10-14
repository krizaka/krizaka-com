"use client";

/* The common core of the gallery (kept short): Button, Switch, Chip, Progress, Slider, Tabs, Toast, Card. */

import { useState } from "react";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { Chip } from "@krizaka/ui/chip";
import { Progress } from "@krizaka/ui/progress";
import { Slider } from "@krizaka/ui/slider";
import { Switch } from "@krizaka/ui/switch";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import { toast } from "@krizaka/ui/toast";
import { useI18n } from "../../I18nProvider";
import { KIT_MOOD } from "@/lib/kit-live";
import type { KitTileProps } from "./types";

export default function CoreTile({ id, brand }: KitTileProps) {
  const { t } = useI18n();
  const k = t.site.home.build.kit;
  const s = k.sample;
  const [on, setOn] = useState(true);
  const [chip, setChip] = useState("label");
  const [range, setRange] = useState<[number, number]>([25, 70]);
  const [mood, setMood] = useState<number>(KIT_MOOD.after);
  const [before, setBefore] = useState<number>(KIT_MOOD.before);
  const [step, setStep] = useState(3);

  switch (id) {
    case "button":
      return (
        <div className="kl-row">
          <Button variant="primary" shape="cut">{s.label}</Button>
          <Button variant="secondary">{s.label}</Button>
          <Button variant="outline">{s.label}</Button>
        </div>
      );
    case "switch":
      return <Switch label={s.label} checked={on} onCheckedChange={setOn} />;
    case "chip":
      return (
        <Chip.Group type="single" required label={k.tiles.chip} value={chip} onValueChange={(v) => v && setChip(v)} size="sm" className="kl-row">
          <Chip value="label">{s.label}</Chip>
          <Chip value="value">{s.value}</Chip>
          <Chip value="tag">{s.tag}</Chip>
        </Chip.Group>
      );
    case "progress":
      return (
        <>
          <Progress label={k.progress.label} value={64} showLabel />
          <Progress variant="ring" label={k.progress.label} value={64} size="md" />
        </>
      );
    case "slider":
      return (
        brand === "yororis" ? (
          <>
            <p className="kl-muted">{k.yororis.mood}</p>
            <Slider label={k.yororis.before} showLabel min={KIT_MOOD.min} max={KIT_MOOD.max} step={1} ticks value={before} onValueChange={setBefore} />
            <Slider label={k.yororis.after} showLabel min={KIT_MOOD.min} max={KIT_MOOD.max} step={1} ticks value={mood} onValueChange={setMood} />
          </>
        ) : (
          <>
            <Slider<[number, number]> label={k.slider.range} showLabel min={0} max={100} value={range} onValueChange={setRange} thumbLabels={[s.label, s.other]} />
            <Slider label={k.slider.steps} showLabel min={1} max={5} step={1} ticks value={step} onValueChange={setStep} />
          </>
        )
      );
    case "tabs":
      return (
        <TabsRoot defaultValue="one" variant="segmented">
          <TabsList>
            <TabsTrigger value="one">{k.tabs.one}</TabsTrigger>
            <TabsTrigger value="two">{k.tabs.two}</TabsTrigger>
            <TabsTrigger value="three">{k.tabs.three}</TabsTrigger>
          </TabsList>
          {(["one", "two", "three"] as const).map((v) => (
            <TabsContent key={v} value={v} className="kl-muted">{k.tabs.panel}</TabsContent>
          ))}
        </TabsRoot>
      );
    case "toast":
      return <Button variant="secondary" onClick={() => toast.success(k.toast.title, { description: k.toast.description })}>{k.toast.button}</Button>;
    case "card":
      return (
        <Card.Root>
          <Card.Body>
            <p className="kl-title">{k.yororis.keep}</p>
            <p className="kl-muted">{k.yororis.savedHint}</p>
            <ol className="kl-list">
              <li>{k.yororis.one}</li>
              <li>{k.yororis.two}</li>
              <li>{k.yororis.three}</li>
            </ol>
          </Card.Body>
        </Card.Root>
      );
    default:
      return null;
  }
}
