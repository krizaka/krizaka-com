"use client";

/* Orochia documentation home — the same composition as Orazaka's (OrazakaOverview): hero with the
   animated mark and the stack, illustrated sections cast from the Krizaka mascots, quick start,
   modules (from the generated architecture data), the docs and the design principles. */

import Link from "next/link";
import { ArrowRight, Check, CreditCard, Database, Film, PlayCircle, ShieldAlert, ShieldCheck, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/app/components/I18nProvider";
import { format } from "@/lib/i18n";
import { ComplianceSentryScene, SignedDeliveryScene, WatchPartyScene } from "@/app/components/illustrations/OrochiaScenes";
import { OrochiaLogo } from "@krizaka/ui";

interface Props {
  docs: { slug: string; title: string; category: string }[];
  modules: { id: string; name: string; path: string; features?: string[]; tables?: string[] }[];
  stack: string[];
  endpoints: number;
}

const MODULE_ICON: Record<string, LucideIcon> = { media: Film, payments: CreditCard, data: Database, compliance: ShieldCheck };
const CATEGORY_TAG: Record<string, string> = { "getting-started": "START", architecture: "CORE", api: "API", operations: "OPS" };

export default function OrochiaDocsOverview({ docs, modules, stack, endpoints }: Props) {
  const { t } = useI18n();
  const c = t.site.orochiaDocs;

  return (
    <div className="odo">
      {/* Hero */}
      <header className="odo-hero">
        <div className="odo-hero-logo"><OrochiaLogo size={88} /></div>
        <h1>Orochia</h1>
        <p className="odo-kicker">{c.kicker}</p>
        <p className="odo-tagline">{c.tagline}</p>
        <div className="odo-stack">
          {stack.map((s) => (
            <span key={s}><i aria-hidden /> {s}</span>
          ))}
        </div>
        <p className="odo-facts">{format(c.facts, { count: endpoints })}</p>
      </header>

      {/* Payments & trust */}
      <section className="odo-section">
        <div className="odo-split">
          <div>
            <p className="odo-eyebrow">{c.pay.eyebrow}</p>
            <h2>{c.pay.title}</h2>
            <p className="odo-body">{c.pay.body}</p>
            <div className="odo-scene"><SignedDeliveryScene /></div>
          </div>
          <div className="odo-cards">
            <div className="odo-card is-risk">
              <h3><ShieldAlert size={16} aria-hidden /> {c.pay.risk}</h3>
              <ul>{c.pay.risks.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="odo-card is-ok">
              <h3><ShieldCheck size={16} aria-hidden /> {c.pay.shield}</h3>
              <ul>{c.pay.shields.map((r) => <li key={r}><Check size={13} aria-hidden /> {r}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="odo-section">
        <div className="odo-split is-flipped">
          <div>
            <p className="odo-eyebrow">{c.comp.eyebrow}</p>
            <h2>{c.comp.title}</h2>
            <p className="odo-body">{c.comp.body}</p>
            <div className="odo-scene"><ComplianceSentryScene /></div>
          </div>
          <div className="odo-cards">
            {c.comp.cards.map(([t, d]) => (
              <div key={t} className="odo-card">
                <h3><ShieldCheck size={16} aria-hidden /> {t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See it run */}
      <section className="odo-section">
        <div className="odo-split">
          <div>
            <p className="odo-eyebrow">{c.run.eyebrow}</p>
            <h2>{c.run.title}</h2>
            <p className="odo-body">{c.run.body}</p>
            <div className="odo-scene"><WatchPartyScene /></div>
          </div>
          <div className="odo-cards">
            <div className="odo-card">
              <h3><PlayCircle size={16} aria-hidden /> {c.run.tour[0]}</h3>
              <p>{c.run.tour[1]}</p>
              <Link href="/products/orochia#tour" className="odo-btn is-primary">{c.run.tourCta} <ArrowRight size={14} /></Link>
            </div>
            <div className="odo-card">
              <h3><Workflow size={16} aria-hidden /> {c.run.arch[0]}</h3>
              <p>{c.run.arch[1]}</p>
              <Link href="/products/orochia#architecture" className="odo-btn">{c.run.archCta} <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="odo-section">
        <h2 className="odo-h3">{c.quick}</h2>
        <ol className="odo-steps">
          {c.steps.map(([t, cmd, d], i) => (
            <li key={t}>
              <span className="odo-step-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{t}</strong>
                <code>{cmd}</code>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Modules */}
      <section className="odo-section">
        <h2 className="odo-h3">{c.modules}</h2>
        <div className="odo-modules">
          {modules.map((m) => {
            const Icon = MODULE_ICON[m.id] ?? Database;
            return (
              <div key={m.id} className="odo-module">
                <Icon size={18} aria-hidden />
                <div>
                  <strong>{m.name}</strong>
                  <code>{m.path}</code>
                  <p>{m.features ? m.features.slice(0, 3).join(" · ") : format(c.tables, { count: m.tables?.length ?? 0 })}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Docs */}
      <section className="odo-section">
        <h2 className="odo-h3">{c.docs}</h2>
        <div className="odo-doclist">
          {docs.map((d) => (
            <Link key={d.slug} href={`/products/orochia/docs/${d.slug}`}>
              <span className="odo-tag">{CATEGORY_TAG[d.category] ?? "DOC"}</span>
              <span>{d.title}</span>
              <ArrowRight size={14} aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="odo-section">
        <h2 className="odo-h3">{c.principles}</h2>
        <div className="odo-princ">
          {c.princ.map(([t, d]) => (
            <div key={t} className="odo-card">
              <h3><ShieldCheck size={16} aria-hidden /> {t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .odo { --o: #d946ef; }
        .odo-hero { text-align: center; padding: 8px 0 40px; border-bottom: 1px solid var(--kz-border-subtle); }
        .odo-hero-logo { display: inline-flex; padding: 10px; border-radius: 24px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle);
          box-shadow: 0 0 60px color-mix(in srgb, var(--o) 20%, transparent); }
        .odo-hero h1 { margin: 18px 0 0; font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2rem, 5vw, 2.6rem); font-weight: 800; letter-spacing: -.03em; color: var(--kz-text-primary); }
        .odo-kicker { margin: 6px 0 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--kz-text-muted); }
        .odo-tagline { max-width: 560px; margin: 14px auto 0; font-size: 15px; line-height: 1.7; color: var(--kz-text-secondary); }
        .odo-stack { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 18px; }
        .odo-stack span { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; font-family: var(--font-mono); font-size: 11px;
          color: var(--kz-text-secondary); background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .odo-stack i { width: 6px; height: 6px; border-radius: 50%; background: var(--o); }
        .odo-facts { margin: 14px 0 0; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }
        .odo-section { padding: 40px 0; border-bottom: 1px solid var(--kz-border-subtle); }
        .odo-section:last-child { border-bottom: 0; }
        .odo-split { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 24px; align-items: start; }
        .odo-split.is-flipped > :first-child { order: 2; }
        @media (max-width: 900px) { .odo-split { grid-template-columns: 1fr; } .odo-split.is-flipped > :first-child { order: 0; } }
        .odo-eyebrow { margin: 0; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--kz-accent); }
        .odo h2 { margin: 10px 0 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -.02em; color: var(--kz-text-primary); }
        .odo .odo-h3 { margin: 0 0 18px; font-size: 19px; }
        .odo-body { margin: 10px 0 18px; font-size: 14px; line-height: 1.7; color: var(--kz-text-secondary); }
        .odo-scene { height: 230px; }
        .odo-cards { display: grid; gap: 14px; }
        .odo-card { padding: 18px; border-radius: 16px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .odo-card h3 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 14.5px; font-weight: 700; color: var(--kz-text-primary); }
        .odo-card h3 svg { color: var(--kz-accent); flex-shrink: 0; }
        .odo-card p { margin: 8px 0 0; font-size: 13px; line-height: 1.6; color: var(--kz-text-secondary); }
        .odo-card ul { margin: 10px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
        .odo-card li { display: flex; gap: 8px; align-items: baseline; font-size: 13px; line-height: 1.5; color: var(--kz-text-secondary); }
        .odo-card.is-risk { border-color: color-mix(in srgb, #f43f5e 35%, transparent); background: color-mix(in srgb, #f43f5e 5%, var(--kz-surface-1)); }
        .odo-card.is-risk h3 svg, .odo-card.is-risk li::before { color: #f43f5e; }
        .odo-card.is-risk li::before { content: "•"; }
        .odo-card.is-ok { border-color: color-mix(in srgb, #10b981 35%, transparent); background: color-mix(in srgb, #10b981 5%, var(--kz-surface-1)); }
        .odo-card.is-ok h3 svg, .odo-card.is-ok li svg { color: #10b981; flex-shrink: 0; }
        .odo-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 9px 14px; border-radius: 10px; font-size: 13px; font-weight: 700;
          text-decoration: none; color: var(--kz-text-primary); background: var(--kz-surface-2); border: 1px solid var(--kz-border-default); }
        .odo-btn.is-primary { background: var(--kz-accent); color: var(--kz-on-accent); border-color: transparent; }
        .odo-steps { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
        .odo-steps li { display: flex; gap: 14px; padding: 16px 18px; border-radius: 14px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .odo-step-n { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--kz-accent); }
        .odo-steps strong { display: block; font-size: 14px; color: var(--kz-text-primary); }
        .odo-steps code, .odo-module code { display: inline-block; margin-top: 8px; padding: 4px 8px; border-radius: 6px; font-family: var(--font-mono); font-size: 12px;
          color: var(--kz-accent); background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle); overflow-wrap: anywhere; }
        .odo-steps p { margin: 8px 0 0; font-size: 12.5px; color: var(--kz-text-muted); }
        .odo-modules { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 12px; }
        .odo-module { display: flex; gap: 12px; padding: 16px; border-radius: 14px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .odo-module > svg { color: var(--o); flex-shrink: 0; margin-top: 2px; }
        .odo-module strong { display: block; font-size: 13.5px; color: var(--kz-text-primary); }
        .odo-module code { margin-top: 6px; font-size: 10.5px; color: var(--kz-text-muted); }
        .odo-module p { margin: 8px 0 0; font-size: 12px; line-height: 1.5; color: var(--kz-text-secondary); }
        .odo-doclist { display: grid; border-radius: 14px; overflow: hidden; border: 1px solid var(--kz-border-subtle); }
        .odo-doclist a { display: flex; align-items: center; gap: 12px; padding: 13px 16px; text-decoration: none; font-size: 13.5px; color: var(--kz-text-primary);
          background: var(--kz-surface-1); border-bottom: 1px solid var(--kz-border-subtle); transition: background 150ms ease; }
        .odo-doclist a:last-child { border-bottom: 0; }
        .odo-doclist a:hover { background: var(--kz-surface-2); }
        .odo-doclist a > span:nth-child(2) { flex: 1; }
        .odo-doclist svg { color: var(--kz-text-muted); }
        .odo-tag { min-width: 48px; text-align: center; padding: 2px 6px; border-radius: 6px; font-family: var(--font-mono); font-size: 9.5px; font-weight: 700;
          letter-spacing: .06em; color: var(--kz-text-muted); border: 1px solid var(--kz-border-default); }
        .odo-princ { display: grid; gap: 12px; }
      `}</style>
    </div>
  );
}
