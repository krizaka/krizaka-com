"use client";

/* One kit, four identities: real @krizaka/ui components (the cut button, ProfileCard, ChoiceGrid, a Sparkline of
   @krizaka/charts, the Calendar of the date picker) on a stage that wears the chosen product's brand
   (`.brand-<id>`, @krizaka/tokens/brands/scoped.css). Nothing here is drawn by the site: change a component in
   krizaka-ui, release it, and this stage shows it. Words: site.home.build.kit. */

import { useState, useSyncExternalStore } from "react";
import { Avatar } from "@krizaka/ui/avatar";
import { Emblem } from "@krizaka/ui/achievement";
import { Chip } from "@krizaka/ui/chip";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { Calendar } from "@krizaka/ui/date-picker";
import { ProductLogo } from "@krizaka/ui";
import { ProfileCard } from "@krizaka/ui/profile-card";
import { Sparkline } from "@krizaka/charts/sparkline";
import { ForwardIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import ButtonLink from "../ButtonLink";
import { useI18n } from "../I18nProvider";
import { useContactHref } from "../useContactHref";
import { NAV_PRODUCTS } from "@/lib/nav";

/** The identities the showcase switches between: the products, in the site's order (lib/nav.ts). */
const SHOWCASE_BRANDS = NAV_PRODUCTS.map((p) => ({ id: p.id, name: p.name }));
type ShowcaseBrand = (typeof SHOWCASE_BRANDS)[number]["id"];

/** Views of a creator's videos, 30 days — the demo series of the chart. */
const VIEWS = [820, 760, 910, 880, 1020, 990, 1130, 1210, 1090, 1340, 1280, 1420, 1390, 1510, 1620, 1580, 1700, 1640, 1810, 1760, 1930, 2040, 1980, 2150, 2090, 2260, 2340, 2280, 2410, 2520];
const CALENDAR_LOCALE = { en: "en-CA", fr: "fr-CA" } as const;

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const weekend = (day: string) => [0, 6].includes(new Date(`${day}T12:00:00`).getDay());
const noop = () => () => {};

export default function KitShowcase() {
  const { t, locale } = useI18n();
  const k = t.site.home.build.kit;
  const contact = useContactHref("blocks");
  const [brand, setBrand] = useState<ShowcaseBrand>(SHOWCASE_BRANDS[0].id);
  const [plan, setPlan] = useState("creator");
  const [day, setDay] = useState<string | null>(null);
  // The calendar marks today: it is drawn once the page runs in the reader's browser (a static page has no "today").
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const today = hydrated ? iso(new Date()) : undefined;
  const brandName = SHOWCASE_BRANDS.find((b) => b.id === brand)?.name ?? brand;

  return (
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

      <div className={"bk-stage brand-" + brand} role="group" aria-label={format(k.stageLabel, { brand: brandName })}>
        <div className="bk-col">
          <div className="bk-actions">
            <ButtonLink href="/docs/ui" variant="primary" shimmer>
              {k.primary} <ForwardIcon size={14} aria-hidden />
            </ButtonLink>
            <ButtonLink href={contact}>{k.secondary}</ButtonLink>
          </div>
          <ProfileCard
            visual={<Avatar fallback="EM" size="xl" />}
            visualSize={88}
            name={k.profile.name}
            nameAs="p"
            statLabel={k.profile.statLabel}
            value={80}
            stats={[
              { label: k.profile.challenges, value: 12, max: 15, valueText: k.profile.challengesValue },
              { label: k.profile.replies, value: 94 },
            ]}
            caption={k.profile.caption}
          />
          <div className="bk-card bk-chart">
            <p className="bk-card-label">{k.chart.title}</p>
            <p className="bk-figure">{new Intl.NumberFormat(locale).format(VIEWS[VIEWS.length - 1]!)}</p>
            <Sparkline title={k.chart.title} data={VIEWS} variant="area" trendTone width={260} height={48} format="integer" />
          </div>
        </div>
        <div className="bk-col">
          <ChoiceGrid
            label={k.choice.label}
            tag={k.choice.tag}
            caption={k.choice.caption}
            value={plan}
            onValueChange={setPlan}
            columns={3}
            items={(["starter", "creator", "studio"] as const).map((id, i) => ({
              id,
              visual: <Emblem kind={(["sword", "jewel", "mirror"] as const)[i]} size={30} />,
              name: k.choice[id].name,
              title: k.choice[id].title,
            }))}
          />
          <div className="bk-card bk-calendar">
            <p className="bk-card-label">{k.calendar.title}</p>
            {hydrated ? (
              <Calendar
                locale={CALENDAR_LOCALE[locale]}
                value={day}
                onSelect={setDay}
                min={today}
                today={today}
                isDateDisabled={weekend}
                labels={{ previousMonth: k.calendar.previousMonth, nextMonth: k.calendar.nextMonth }}
              />
            ) : (
              <div className="bk-calendar-rest" aria-hidden />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
