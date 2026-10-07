"use client";

/* Closing call to action — the same on the home page and every product page: one line and a link to
   the contact page, where the form lives (pre-set on the page's product). */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../I18nProvider";
import type { ContactTopic } from "@/lib/contact";

export default function ContactCta({ topic }: { topic?: ContactTopic }) {
  const { t } = useI18n();
  const c = t.site.home.contact;
  return (
    <section id="contact" className="kz-section kz-cta">
      <h2 className="kz-h2">{c.title}</h2>
      <Link href={topic ? `/contact?topic=${topic}` : "/contact"} className="kz-cta-link btn-sheen">
        {c.cta} <ArrowRight size={16} aria-hidden />
      </Link>
      <style>{`
        .kz-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px 32px;
          border-top: 1px solid var(--kz-border-subtle); }
        .kz-cta .kz-h2 { margin: 0; }
        .kz-cta-link { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; border-radius: 12px; font-size: 15px; font-weight: 700;
          text-decoration: none; background: var(--kz-accent); color: var(--kz-on-accent); transition: transform 150ms ease; }
        .kz-cta-link:hover { transform: translateY(-1px); }
        .kz-cta-link svg { transition: transform 150ms ease; }
        .kz-cta-link:hover svg { transform: translateX(3px); }
        @media (prefers-reduced-motion: reduce) { .kz-cta-link, .kz-cta-link svg { transition: none; } }
      `}</style>
    </section>
  );
}
