/* « A file to check? Write to us. » (§ 7, krizaka-internal#2445): the home ends where its reader acts — one primary action,
   the contact form on the home product's topic (HOME_PRODUCT, lib/home-sections.ts), the same as the hero's. Words:
   site.home.contact. */

import { ForwardIcon } from "@krizaka/icons";
import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { contactHref } from "@/lib/contact";
import { HOME_PRODUCT } from "@/lib/home-sections";
import { getDictionary } from "@/lib/i18n";

export default function HomeContact({ locale }: { locale: string }) {
  const dict = getDictionary(locale).site.home;
  const c = dict.contact;
  return (
    <Section
      id="contact"
      number={c.number}
      title={c.title}
      lead={c.lead}
      reveal
      divider
      margin
      actions={
        <ButtonLink href={`/${locale}${contactHref("home", HOME_PRODUCT)}`} variant="primary" size="lg">
          {dict.hero.primary} <ForwardIcon size={16} strokeWidth={2.25} />
        </ButtonLink>
      }
    />
  );
}
