/* « Who we are » (§ 5, krizaka-internal#2445): the company in one sentence for the property manager who checks who is behind
   Verikora — where we are, and that we build in the open (public code, dated releases). Two quiet actions: our story and
   the release notes. Words: site.home.about. */

import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { getDictionary } from "@/lib/i18n";

export default function HomeAbout({ locale }: { locale: string }) {
  const a = getDictionary(locale).site.home.about;
  return (
    <Section
      id="about"
      number={a.number}
      title={a.title}
      lead={a.lead}
      reveal
      divider
      margin
      actions={
        <>
          <ButtonLink href={`/${locale}/story`} variant="secondary" size="md">
            {a.story}
          </ButtonLink>
          <ButtonLink href={`/${locale}/changelog`} variant="ghost" size="md">
            {a.changelog}
          </ButtonLink>
        </>
      }
    />
  );
}
