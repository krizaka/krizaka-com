/* « Where we are going »: now / next / later, no dates (founder, 2026-10-30). Since krizaka-internal#3243 it is a static
   numbered list, every station open: the page's second self-moving block (the loop) is retired, nothing here moves or
   pauses. « Now » carries the products with their honest statuses, read from lib/products.ts; the rest is the stated order
   (lib/direction.ts), its details are messages. One action: our story. No ruled paper. */

import { Section } from "@krizaka/ui/page";
import { Stamp } from "@krizaka/ui/specimen-tag";
import ButtonLink from "@/app/components/ButtonLink";
import { DIRECTION_STEPS, nowProducts } from "@/lib/direction";
import { format, getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import "./direction.css";

export default function Direction({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const d = t.site.home.direction;
  const names = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(
    nowProducts(PRODUCTS).map((p) => p.name),
  );
  const now = (
    <ul className="kz-dir-points kz-dir-now">
      {nowProducts(PRODUCTS).map((p) => (
        <li key={p.id}>
          {p.name}{" "}
          <Stamp tone={p.status === "devPreview" ? "ok" : "wip"} size="sm">
            {t.site.nav.status[p.status].label}
          </Stamp>
        </li>
      ))}
    </ul>
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
      <ol className="kz-dir-line" aria-label={d.title}>
        {DIRECTION_STEPS.map((id) => (
          <li key={id} className="kz-dir-station" data-step={id}>
            <h3 className="kz-dir-title">{d.steps[id].title}</h3>
            <p className="kz-dir-body">{format(d.steps[id].body, { names })}</p>
            {id === "now" ? now : points(d.steps[id].points)}
          </li>
        ))}
      </ol>
    </Section>
  );
}
