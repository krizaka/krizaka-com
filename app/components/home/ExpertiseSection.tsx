"use client";

/* Know-how: what Krizaka is good at, as it shows in both products. */

import { Bot, Boxes, CreditCard, Film, Scale, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../I18nProvider";
import { EXPERTISE } from "@/lib/org-data";

const ICONS: LucideIcon[] = [Bot, Boxes, Scale, Film, CreditCard, ShieldCheck];

export default function ExpertiseSection() {
  const { locale } = useI18n();
  const loc = locale === "en" ? "en" : "fr";

  return (
    <section id="expertise" className="kz-section">
      <p className="kz-eyebrow">{loc === "fr" ? "Savoir-faire" : "Know-how"}</p>
      <h2 className="kz-h2">
        {loc === "fr" ? "Ce dont on s'occupe, pour que vous n'ayez pas à y penser." : "What we take care of, so you don't have to think about it."}
      </h2>
      <div className="kz-expertise">
        {EXPERTISE.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={item.title.en} className="kz-expertise-item">
              <Icon size={18} aria-hidden />
              <h3>{item.title[loc]}</h3>
              <p>{item.body[loc]}</p>
            </div>
          );
        })}
      </div>
      <style>{`
        .kz-expertise { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .kz-expertise-item { padding: 24px; background: var(--kz-surface-0); }
        .kz-expertise-item svg { color: var(--kz-accent); }
        .kz-expertise-item h3 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; color: var(--kz-text-primary); }
        .kz-expertise-item p { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
      `}</style>
    </section>
  );
}
