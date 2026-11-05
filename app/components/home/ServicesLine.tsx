/* « For companies »: Krizaka Entreprise in brief — its three parts as a numbered list (founder, 2026-11-05,
   krizaka-internal#2450: « a list, not three squares »), each entry leading to its part on /services, one action. The
   offer itself (what it covers, the questions) lives on /services, not here. No ruled paper: a section with content, not
   an empty page (founder, 2026-10-30). Words: site.home.services. */

import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { OfferList } from "@/app/components/lists/OfferList";
import { getDictionary } from "@/lib/i18n";
import { SERVICES_PAGE_ORDER } from "@/lib/services-page";

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
      <OfferList
        compact
        label={s.title}
        items={SERVICES_PAGE_ORDER.offers.map((id) => ({
          id,
          name: s.parts[id].title,
          hook: s.parts[id].line,
          href: `/${locale}/services#offer-${id}`,
        }))}
      />
    </Section>
  );
}
