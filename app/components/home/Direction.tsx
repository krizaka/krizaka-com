/* « Where we are going » (§ 5): now / next / later, no dates, as @krizaka/ui's Stepper (horizontal): « now » is the
   current step and carries the products with their honest statuses, read from lib/products.ts; the rest is the stated
   order (lib/direction.ts). One action: our story. No ruled paper (founder, 2026-10-30). */

import { Facts, Section } from "@krizaka/ui/page";
import { Stepper } from "@krizaka/ui/stepper";
import ButtonLink from "@/app/components/ButtonLink";
import { DIRECTION_STEPS, nowProducts } from "@/lib/direction";
import { format, getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";

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
      <Stepper
        className="kz-direction"
        orientation="horizontal"
        current={0}
        labels={d.labels}
        steps={DIRECTION_STEPS.map((id) => ({
          title: d.steps[id].title,
          description: format(d.steps[id].body, { names }),
          content: id === "now" ? now : undefined,
        }))}
      />
    </Section>
  );
}
