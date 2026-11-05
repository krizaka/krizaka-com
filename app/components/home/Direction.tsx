/* « Where we are going »: now / next / later, no dates (founder, 2026-10-30), redrawn on 2026-11-05 (krizaka-internal#2450:
   the Stepper broke on a phone; « smarter, more ergonomic, a looping animation that gives more detail of each target »).
   DirectionLoop draws the three stations and rests on one at a time, opening what it holds; still under reduced motion,
   with every station open. « Now » carries the products with their honest statuses, read from lib/products.ts; the rest is
   the stated order (lib/direction.ts), its details are messages. One action: our story. No ruled paper. */

import { Facts, Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { DIRECTION_STEPS, nowProducts } from "@/lib/direction";
import { format, getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import DirectionLoop from "./DirectionLoop";
import "./direction.css";

export default function Direction({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const d = t.site.home.direction;
  const names = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(
    nowProducts(PRODUCTS).map((p) => p.name),
  );
  const now = (
    <Facts
      items={nowProducts(PRODUCTS).map((p) => ({
        label: `${p.name} · ${t.site.nav.status[p.status].label}`,
        tone: p.status === "devPreview" ? ("ok" as const) : ("wip" as const),
      }))}
    />
  );
  const points = (items: readonly string[]) => (
    <ul className="kz-dir-points">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
  return (
    <Section
      id="direction"
      number={d.number}
      title={d.title}
      lead={d.lead}
      reveal
      divider
      margin
      actions={
        <ButtonLink href="/story" variant="secondary" size="md">
          {d.story}
        </ButtonLink>
      }
    >
      <DirectionLoop
        labels={{ pause: d.pause, play: d.play, list: d.title }}
        stations={DIRECTION_STEPS.map((id) => ({
          id,
          title: d.steps[id].title,
          body: format(d.steps[id].body, { names }),
          details: id === "now" ? now : points(d.steps[id].points),
        }))}
      />
    </Section>
  );
}
