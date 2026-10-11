"use client";

/* Closing call to action — the same on the home page and every product page: one line and a link to
   the contact page, where the form lives (pre-set on the page's product). */

import { ForwardIcon } from "@krizaka/icons";
import { useI18n } from "../I18nProvider";
import type { ContactTopic } from "@/lib/contact";
import { reveal } from "@/lib/motion";
import { useContactHref } from "../useContactHref";
import ButtonLink from "../sections/ButtonLink";

export default function ContactCta({ topic }: { topic?: ContactTopic }) {
  const { t } = useI18n();
  const c = t.site.home.contact;
  const href = useContactHref(topic);
  return (
    <section id="contact" className="kz-section kz-cta" {...reveal()}>
      <h2 className="kz-h2">{c.title}</h2>
      <ButtonLink href={href} prefetch={false} variant="primary" size="lg">
        {c.cta} <ForwardIcon size={17} />
      </ButtonLink>
      <style>{`
        .kz-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px 32px;
          border-top: 1px solid var(--kz-border-subtle); }
        .kz-cta .kz-h2 { margin: 0; }
      `}</style>
    </section>
  );
}
