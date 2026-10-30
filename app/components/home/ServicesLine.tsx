/* « For companies » (§ 4): one line to Our services, one action. The offer lives on /services, not here. */

import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { getDictionary } from "@/lib/i18n";

export default function ServicesLine({ locale }: { locale: string }) {
  const s = getDictionary(locale).site.home.services;
  return (
    <Section id="services" number={s.number} title={s.title} lead={s.lead} paper="lines" reveal divider margin actions={<ButtonLink href="/services" variant="secondary" size="md">{s.cta}</ButtonLink>} />
  );
}
