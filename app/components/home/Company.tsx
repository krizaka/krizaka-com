/* Montréal & the company — where Krizaka is, what it wants to be, and the way to its story (one action). */

import { ForwardIcon } from "@krizaka/icons";
import { Stamp } from "@krizaka/ui/specimen-tag";
import { Section, SectionHeading } from "@krizaka/ui/page";
import { getDictionary } from "@/lib/i18n";
import ButtonLink from "@/app/components/ButtonLink";

export default function Company({ locale }: { locale: string }) {
  const c = getDictionary(locale).site.home.company;
  return (
    <Section id="company" aria-labelledby="company-title" paper="lines" divider margin>
      <SectionHeading
        id="company-title"
        number={c.number}
        title={c.title}
        lead={c.body}
        reveal
        actions={
          <ButtonLink href="/story" variant="primary">
            {c.story} <ForwardIcon size={14} />
          </ButtonLink>
        }
      />
      <p className="kz-company-stamp">
        <Stamp>{c.stamp}</Stamp>
      </p>
      <p className="kz-folio">{c.folio}</p>
    </Section>
  );
}
