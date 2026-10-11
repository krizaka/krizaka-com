"use client";

/* Closing call to action — the same on the home page and every product page: one line and a link to
   the contact page, where the form lives (pre-set on the page's product). */

import { ForwardIcon } from "@krizaka/icons";
import { useI18n } from "../I18nProvider";
import type { ContactTopic } from "@/lib/contact";
import { useContactHref } from "../useContactHref";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Section } from "@krizaka/ui/page";
import ButtonLink from "../ButtonLink";

export default function ContactCta({ topic }: { topic?: ContactTopic }) {
  const { t } = useI18n();
  const c = t.site.home.contact;
  const href = useContactHref(topic);
  return (
    <Section id="contact" aria-labelledby="contact-title" spacing="sm">
      <CtaPanel id="contact-title" title={c.title} reveal>
        <ButtonLink href={href} prefetch={false} variant="primary" size="lg">
          {c.cta} <ForwardIcon size={17} />
        </ButtonLink>
      </CtaPanel>
    </Section>
  );
}
