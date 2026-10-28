/* « Where we are going » (§ 5): now / next / later, no dates. « Now » names the products and their honest statuses,
   read from lib/products.ts; the rest is the stated order (lib/direction.ts). One action: our story. */

import { Facts, Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { DIRECTION_STEPS, nowProducts } from "@/lib/direction";
import { format, getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import { reveal } from "@/lib/motion";

export default function Direction({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const d = t.site.home.direction;
  const names = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(nowProducts(PRODUCTS).map((p) => p.name));
  return (
    <Section id="direction" number={d.number} title={d.title} lead={d.lead} paper="lines" reveal divider margin actions={<ButtonLink href="/story" variant="secondary" size="md">{d.story}</ButtonLink>}>
      <ol className="kz-notebook-list">
        {DIRECTION_STEPS.map((id, i) => (
          <li key={id} {...reveal(i % 3)}>
            <h3>{d.steps[id].title}</h3>
            <p>{format(d.steps[id].body, { names })}</p>
            {id === "now" && (
              <Facts items={nowProducts(PRODUCTS).map((p) => ({ label: `${p.name} · ${t.site.nav.status[p.status].label}`, tone: p.status === "devPreview" ? ("ok" as const) : ("wip" as const) }))} />
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
