"use client";

/* One kit, four identities: a gallery of Krizaka UI's own components — each with its name, a hint of its variants and
   a link to its page — and the phone that shows their native versions. The product switch only re-themes the stage
   (`.brand-<id>`, @krizaka/tokens/brands/scoped.css) and picks the phone's loop. Nothing here is drawn by the site:
   change a component in krizaka-ui, release it, and this stage shows it. Words: site.home.build.kit. */

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { Chip } from "@krizaka/ui/chip";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { Countdown } from "@krizaka/ui/countdown";
import { Calendar } from "@krizaka/ui/date-picker";
import { Emblem } from "@krizaka/ui/achievement";
import { GoalGauge } from "@krizaka/ui/goal-gauge";
import { ProductLogo } from "@krizaka/ui";
import { ProfileCard } from "@krizaka/ui/profile-card";
import { Progress } from "@krizaka/ui/progress";
import { Slider } from "@krizaka/ui/slider";
import { Switch } from "@krizaka/ui/switch";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import { Toaster, toast } from "@krizaka/ui/toast";
import { Sparkline } from "@krizaka/charts/sparkline";
import { ForwardIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import type { Video } from "@/lib/cdn";
import ButtonLink from "../ButtonLink";
import { useI18n } from "../I18nProvider";
import { useContactHref } from "../useContactHref";
import { NAV_PRODUCTS } from "@/lib/nav";
import { KIT_COUNTDOWN_MS, KIT_CURRENCY, KIT_GOAL, KIT_PEOPLE, KIT_SERIES_CENTS, KIT_TILES, type KitTileId } from "@/lib/kit-live";
import MapTile from "./kit/MapTile";
import NativePhone from "./kit/NativePhone";
import { money, useHydrated, useTargetIn } from "./kit/shared";
import "./kit/kit.css";

/** The identities the showcase switches between: the products, in the site's order (lib/nav.ts). */
const SHOWCASE_BRANDS = NAV_PRODUCTS.map((p) => ({ id: p.id, name: p.name }));
type ShowcaseBrand = (typeof SHOWCASE_BRANDS)[number]["id"];

const CALENDAR_LOCALE = { en: "en-CA", fr: "fr-CA" } as const;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const weekend = (day: string) => [0, 6].includes(new Date(`${day}T12:00:00`).getDay());

export default function KitShowcase({ portraits, phones }: { portraits: Record<string, string>; phones: Record<string, Video> }) {
  const { t, locale } = useI18n();
  const k = t.site.home.build.kit;
  const contact = useContactHref("blocks");
  const [brand, setBrand] = useState<ShowcaseBrand>(SHOWCASE_BRANDS[0].id);
  const [choice, setChoice] = useState("b");
  const [chip, setChip] = useState("label");
  const [range, setRange] = useState<[number, number]>([25, 70]);
  const [step, setStep] = useState(3);
  const [on, setOn] = useState(true);
  const [day, setDay] = useState<string | null>(null);
  const hydrated = useHydrated();
  const today = hydrated ? iso(new Date()) : undefined;
  const countdownTarget = useTargetIn(KIT_COUNTDOWN_MS);
  const brandName = SHOWCASE_BRANDS.find((b) => b.id === brand)?.name ?? brand;
  const s = k.sample;
  const face = (id: string) => portraits[id];

  const tile = (id: KitTileId): React.ReactNode => {
    switch (id) {
      case "button":
        return (
          <div className="kl-row">
            <Button variant="primary" shape="cut">{s.label}</Button>
            <Button variant="secondary">{s.label}</Button>
            <Button variant="outline">{s.label}</Button>
          </div>
        );
      case "slider":
        return (
          <>
            <Slider<[number, number]> label={k.slider.range} showLabel min={0} max={100} value={range} onValueChange={setRange} thumbLabels={[s.label, s.other]} />
            <Slider label={k.slider.steps} showLabel min={1} max={5} step={1} ticks value={step} onValueChange={setStep} />
          </>
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
      case "date-picker":
        return hydrated ? (
          <Calendar locale={CALENDAR_LOCALE[locale]} value={day} onSelect={setDay} min={today} today={today} isDateDisabled={weekend} labels={{ previousMonth: k.calendar.previousMonth, nextMonth: k.calendar.nextMonth }} />
        ) : (
          <div className="kl-calendar-rest" aria-hidden />
        );
      case "choice-grid":
        return (
          <ChoiceGrid
            label={k.choice.label}
            tag={k.choice.tag}
            caption={k.choice.caption}
            value={choice}
            onValueChange={setChoice}
            columns={3}
            items={(["a", "b", "c"] as const).map((id, i) => ({ id, visual: <Emblem kind={(["sword", "jewel", "mirror"] as const)[i]} size={30} />, name: k.choice[id].name, title: k.choice[id].title }))}
          />
        );
      case "sparkline":
        return (
          <>
            <p className="kl-figure">{money(KIT_SERIES_CENTS[KIT_SERIES_CENTS.length - 1]!, locale, KIT_CURRENCY)}</p>
            <Sparkline title={k.chart.title} data={KIT_SERIES_CENTS} variant="area" trendTone width={240} height={48} format={{ style: "money", currency: KIT_CURRENCY }} />
          </>
        );
      case "goal-gauge":
        return <GoalGauge label={k.gauge.label} segments={KIT_GOAL.segments} value={KIT_GOAL.reached} valueText={format(k.gauge.text, { raised: money(KIT_GOAL.raisedCents, locale, KIT_CURRENCY), target: money(KIT_GOAL.targetCents, locale, KIT_CURRENCY) })} />;
      case "countdown":
        return countdownTarget !== null ? <Countdown target={countdownTarget} units={k.countdown.units} label={k.countdown.label} size="md" /> : <span className="kl-countdown-rest" aria-hidden />;
      case "progress":
        return (
          <>
            <Progress label={k.progress.label} value={64} showLabel />
            <Progress variant="ring" label={k.progress.label} value={64} size="md" />
          </>
        );
      case "profile-card":
        return <ProfileCard visual={<Avatar src={face("camille")} alt="" fallback="C" size="xl" />} visualSize={88} name={s.name} nameAs="p" statLabel={s.statLabel} value={80} caption={s.caption} />;
      case "map":
        return <MapTile brand={brand} />;
      case "avatar":
        return (
          <Avatar.Group max={3} size="lg">
            {KIT_PEOPLE.map((id) => (
              <Avatar key={id} src={face(id)} alt="" fallback={id[0]!.toUpperCase()} size="lg" />
            ))}
          </Avatar.Group>
        );
      case "toast":
        return <Button variant="secondary" onClick={() => toast.success(k.toast.title, { description: k.toast.description })}>{k.toast.button}</Button>;
    }
  };

  return (
    <div className="bk-grid">
      <div className="bk-kit">
        <div className="bk-kit-bar">
          <h3>{k.title}</h3>
          <Chip.Group type="single" required label={k.brandLabel} value={brand} onValueChange={(v) => v && setBrand(v as ShowcaseBrand)} size="sm" className="bk-brands">
            {SHOWCASE_BRANDS.map((b) => (
              <Chip key={b.id} value={b.id}>
                <ProductLogo id={b.id} size={14} animated={false} />
                {b.name}
              </Chip>
            ))}
          </Chip.Group>
        </div>

        <div className={"kl-stage brand-" + brand} role="group" aria-label={format(k.stageLabel, { brand: brandName })}>
          {KIT_TILES.map((c) => (
            <section key={c.id} className="bk-card kl-tile" data-tile={c.id}>
              <header className="kl-tile-head">
                <Link href={`/docs/ui/${c.id}`} className="kl-tile-name" aria-label={format(k.open, { name: c.name })}>{c.name}</Link>
                <span className="kl-muted">{k.tiles[c.id]}</span>
              </header>
              {tile(c.id)}
            </section>
          ))}
          <Toaster label={k.toast.label} closeLabel={k.toast.close} />
        </div>
        <div className="bk-actions kl-foot">
          <ButtonLink href="/docs/ui" variant="primary" shimmer>
            {k.primary} <ForwardIcon size={14} aria-hidden />
          </ButtonLink>
          <ButtonLink href={contact}>{k.secondary}</ButtonLink>
        </div>
      </div>
      <div className={"brand-" + brand}>
        <NativePhone phones={phones} brand={brand} brandName={brandName} />
      </div>
    </div>
  );
}
