/* Montréal & the company — where Krizaka is, what it wants to be, and the way to its story and its open source. */

import { ForwardIcon } from "@krizaka/icons";
import { Section, SectionHeading } from "@krizaka/ui/page";
import { getDictionary } from "@/lib/i18n";
import ButtonLink from "@/app/components/ButtonLink";

export default function Company({ locale }: { locale: string }) {
  const c = getDictionary(locale).site.home.company;
  return (
    <Section id="company" aria-labelledby="company-title" divider>
      <SectionHeading
        id="company-title"
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.body}
        reveal
        actions={
          <>
            <ButtonLink href="/story">
              {c.story} <ForwardIcon size={14} />
            </ButtonLink>
            <ButtonLink href="/open-source" variant="ghost">
              {c.openSource}
            </ButtonLink>
          </>
        }
      />
    </Section>
  );
}
