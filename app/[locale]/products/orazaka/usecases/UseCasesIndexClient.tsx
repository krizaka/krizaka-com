"use client";

/* The Orazaka use cases, in the Krizaka page language: the sub-page hero (back to the product, the falcon that watches
   compliance), then one card per sector — lit by the brand under the pointer (GlowCard), rising once as it arrives. */

import Link from "next/link";
import { ChatIcon, CreditsIcon, HeartIcon, KnowledgeIcon, ShieldIcon, UsersIcon } from "@krizaka/icons";
import { ForwardIcon } from "@krizaka/icons";
import { GlowCard } from "@krizaka/ui/glow-card";
import { useI18n } from "../../../../components/I18nProvider";
import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";
import { PageHero } from "@krizaka/ui/page-hero";
import { Mascot } from "@krizaka/ui/mascots";
import { USE_CASES, getLocalizedField } from "@/lib/use-cases-data";
import { reveal } from "@/lib/motion";

const ICONS = [ChatIcon, CreditsIcon, ShieldIcon, UsersIcon, KnowledgeIcon, HeartIcon];

export default function UseCasesIndexClient() {
  const { t, locale } = useI18n();

  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />

      <PageHero
        back={{ href: "/products/orazaka", label: "Orazaka" }}
        eyebrow={t.useCases.sectionLabel}
        title={t.useCases.sectionTitle}
        lead={t.useCases.sectionDesc}
        aside={<Mascot bird="falcon" mood="welcome" size={112} />}
        linkAs={Link}
      />

      <section className="kz-frame ucidx">
        <ul className="ucidx-grid">
          {USE_CASES.map((uc, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <li key={uc.slug} {...reveal(idx % 3)}>
                <GlowCard asChild className="ucidx-card">
                  <Link href={`/products/orazaka/usecases/${uc.slug}`}>
                    <span className="ucidx-head">
                      <span className="ucidx-icon">
                        <Icon size={18} aria-hidden />
                      </span>
                      <span className="ucidx-industry">{getLocalizedField(uc.industry, locale)}</span>
                    </span>
                    <h2>{getLocalizedField(uc.title, locale)}</h2>
                    <p>{getLocalizedField(uc.metaDescription, locale)}</p>
                    <span className="ucidx-more">
                      {t.useCases.learnMore} <ForwardIcon size={14} aria-hidden />
                    </span>
                  </Link>
                </GlowCard>
              </li>
            );
          })}
        </ul>
      </section>

      <SiteFooter />

      <style>{`
        .ucidx { padding-block: 56px 96px; }
        .ucidx-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 16px; }
        .ucidx-grid > li { display: flex; }
        .ucidx-card { display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 26px 24px 22px; border-radius: 20px; text-decoration: none;
          background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); color: var(--kz-text-primary); }
        .ucidx-card:focus-visible { outline: 2px solid var(--kz-accent); outline-offset: 3px; }
        .ucidx-head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .ucidx-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 11px; color: var(--kz-accent-text);
          background: color-mix(in srgb, var(--kz-accent) 14%, var(--kz-surface-1)); border: 1px solid color-mix(in srgb, var(--kz-accent) 30%, transparent); }
        .ucidx-industry { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--kz-accent-text); }
        .ucidx-card h2 { margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 18px; font-weight: 750; letter-spacing: -.02em; line-height: 1.3; }
        .ucidx-card p { flex: 1; margin: 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }
        .ucidx-more { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 13.5px; font-weight: 700; color: var(--kz-accent-text); }
      `}</style>
    </main>
  );
}
