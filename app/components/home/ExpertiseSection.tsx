"use client";

/* Know-how: what Krizaka is good at, as it shows in both products. */

import { AiIcon, BillingIcon, PackIcon, ShieldIcon, VideoIcon, KnowledgeIcon, type IconProps } from "@krizaka/icons";
import type { ComponentType } from "react";
import { useI18n } from "../I18nProvider";

/* Sovereign AI · modular architecture · compliance · media · payments · governance (texts: site.expertise.items). */
const ICONS: ComponentType<IconProps>[] = [AiIcon, PackIcon, ShieldIcon, VideoIcon, BillingIcon, KnowledgeIcon];

export default function ExpertiseSection() {
  const { t } = useI18n();
  const e = t.site.expertise;

  return (
    <section id="expertise" className="kz-section">
      <p className="kz-eyebrow">{e.eyebrow}</p>
      <h2 className="kz-h2">
        {e.title}
      </h2>
      <div className="kz-expertise">
        {e.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={item.title} className="kz-expertise-item">
              <Icon size={22} nodeColor="var(--kz-accent)" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          );
        })}
      </div>
      <style>{`
        .kz-expertise { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .kz-expertise-item { padding: 24px; background: var(--kz-surface-0); }
        .kz-expertise-item svg { color: var(--kz-text-primary); }
        .kz-expertise-item h3 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; color: var(--kz-text-primary); }
        .kz-expertise-item p { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
      `}</style>
    </section>
  );
}
