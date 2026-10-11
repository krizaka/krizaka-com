"use client";

/* Know-how: what Krizaka is good at, as it shows in both products. */

import { AiIcon, BillingIcon, PackIcon, ShieldIcon, VideoIcon, KnowledgeIcon, type IconProps } from "@krizaka/icons";
import type { ComponentType } from "react";
import { useI18n } from "../I18nProvider";
import { reveal } from "@/lib/motion";
import { GlowCard } from "@krizaka/ui/glow-card";

/* Sovereign AI · modular architecture · compliance · media · payments · governance (texts: site.expertise.items). */
const ICONS: ComponentType<IconProps>[] = [AiIcon, PackIcon, ShieldIcon, VideoIcon, BillingIcon, KnowledgeIcon];

export default function ExpertiseSection() {
  const { t } = useI18n();
  const e = t.site.expertise;

  return (
    <section id="expertise" className="kz-section">
      <div {...reveal()}>
        <p className="kz-eyebrow">{e.eyebrow}</p>
        <h2 className="kz-h2">
          {e.title}
        </h2>
      </div>
      <ul className="kz-expertise">
        {e.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <li key={item.title} {...reveal(i % 3)}>
              {/* Lit by the brand under the pointer (GlowCard): the light says where you are, the node of the icon wakes. */}
              <GlowCard glow="spotlight" className="kz-expertise-item" data-kz-lights="">
                <span className="kz-expertise-icon">
                  <Icon size={22} nodeColor="var(--kz-accent)" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </GlowCard>
            </li>
          );
        })}
      </ul>
      <style>{`
        .kz-expertise { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 14px; }
        .kz-expertise > li { display: flex; }
        .kz-expertise-item { width: 100%; padding: 24px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .kz-expertise-icon { display: inline-grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; color: var(--kz-text-primary);
          background: color-mix(in srgb, var(--kz-accent) 10%, var(--kz-surface-0)); border: 1px solid color-mix(in srgb, var(--kz-accent) 28%, transparent); }
        .kz-expertise-item h3 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; color: var(--kz-text-primary); }
        .kz-expertise-item p { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
      `}</style>
    </section>
  );
}
