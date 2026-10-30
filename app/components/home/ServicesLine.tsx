/* « For companies » (§ 4): Krizaka Entreprise in brief — its three parts as cards that lead to /services, one action.
   The offer itself (what you get, the steps, the questions) lives on /services, not here. No ruled paper: a section
   with content, not an empty page (founder, 2026-10-30). Words: site.home.services. */

import { AutomationIcon, LockIcon, PackIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { getDictionary } from "@/lib/i18n";

/** The parts of the offer, in /services' order. */
const PARTS = ["modules", "ai", "maintenance"] as const;
const ICON = { modules: PackIcon, ai: LockIcon, maintenance: AutomationIcon } as const;

export default function ServicesLine({ locale }: { locale: string }) {
  const s = getDictionary(locale).site.home.services;
  return (
    <Section
      id="services"
      number={s.number}
      title={s.title}
      lead={s.lead}
      reveal
      divider
      margin
      actions={
        <ButtonLink href="/services" variant="secondary" size="md">
          {s.cta}
        </ButtonLink>
      }
    >
      <CardGrid min={240} columns={3} fit="fit">
        {PARTS.map((id) => {
          const Icon = ICON[id];
          return (
            <LinkCard
              key={id}
              href="/services"
              title={s.parts[id].title}
              description={s.parts[id].line}
              icon={<Icon size={20} aria-hidden />}
              cta={s.partCta}
              titleAs="h3"
            />
          );
        })}
      </CardGrid>
    </Section>
  );
}
