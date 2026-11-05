/* « Your project, on our building blocks » (§ 6): Krizaka Entreprise in one sentence and one secondary action to /services,
   near the foot of the home (founder, 2026-10-30; back to it on 2026-11-05, krizaka-internal#2445: three same-shaped cards
   with three « Learn more » to the same page said less than one line). The offer itself lives on /services. Words:
   site.home.services. */

import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { getDictionary } from "@/lib/i18n";

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
    />
  );
}
