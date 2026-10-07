"use client";

/* Closing call to action — the same on the home page and every product page: write to the team. */

import { useI18n } from "../I18nProvider";
import ContactForm from "../ContactForm";
import type { ContactTopic } from "@/lib/contact";

export default function ContactCta({ topic = "other" }: { topic?: ContactTopic }) {
  const { t } = useI18n();
  const c = t.site.home.contact;
  return (
    <section id="contact" className="kz-section kz-cta">
      <div className="kz-cta-copy">
        <p className="kz-eyebrow">{c.eyebrow}</p>
        <h2 className="kz-h2">{c.title}</h2>
        <p>
          {c.body}
        </p>
        <ul>
          {c.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      <ContactForm defaultTopic={topic} />
      <style>{`
        .kz-cta { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); gap: clamp(24px, 4vw, 48px); align-items: start; }
        .kz-cta-copy p:not(.kz-eyebrow) { font-size: 15px; line-height: 1.7; color: var(--kz-text-secondary); margin: 0; }
        .kz-cta-copy ul { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
        .kz-cta-copy li { position: relative; padding-left: 18px; font-size: 14px; color: var(--kz-text-secondary); }
        .kz-cta-copy li::before { content: ""; position: absolute; left: 0; top: .55em; width: 7px; height: 7px; border-radius: 50%; background: var(--kz-accent); }
      `}</style>
    </section>
  );
}
