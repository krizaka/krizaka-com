"use client";

/* Home hero — Krizaka as an organisation: what we build (two products) and how. */

import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { useI18n } from "../I18nProvider";
import { format } from "@/lib/i18n";
import KrizakaLandscape from "../illustrations/KrizakaLandscape";
import RotatingWord from "./RotatingWord";
import { PRODUCTS } from "@/lib/org-data";
import { GITHUB_ORG_URL } from "@/lib/site";
import { ProductLogo } from "@krizaka/ui";

export default function OrgHero({ repositoryCount }: { repositoryCount: number }) {
  const { t, locale } = useI18n();
  const h = t.site.home.hero;

  return (
    <section id="hero" className="org-hero">
      <div className="org-hero-glow" aria-hidden />
      <div className="org-hero-landscape" aria-hidden>
        <KrizakaLandscape relative={false} />
      </div>
      <div className="org-hero-inner">
        <span className="org-hero-badge">
          {h.badge}
        </span>
        <h1 className="org-hero-title" aria-label={h.titleAria}>
          <span className="org-hero-line">Open source.</span>
          <span className="org-hero-line">
            {h.closedTo}
            <RotatingWord
              key={locale}
              className="org-hero-accent"
              words={h.words}
            />
          </span>
        </h1>
        <p className="org-hero-sub">
          {format(h.sub, { count: repositoryCount })}
        </p>

        <div className="org-hero-products">
          {PRODUCTS.map((p) => (
            <Link key={p.id} href={p.href} className="org-hero-product">
              <ProductLogo id={p.id} size={34} />
              <span>
                <strong>{p.name}</strong>
                <span className="org-hero-product-tag">{t.site.products[p.id].tagline}</span>
              </span>
              <ArrowRight size={15} aria-hidden />
            </Link>
          ))}
        </div>

        <div className="org-hero-cta">
          <Link href="/products" className="org-btn org-btn-primary btn-sheen">
            {h.cta} <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
          <a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" className="org-btn org-btn-ghost">
            <GitBranch size={15} /> github.com/krizaka
          </a>
        </div>
      </div>

      <style>{`
        .org-hero { position: relative; overflow: hidden; padding: clamp(120px, 15vw, 168px) 20px clamp(280px, 30vw, 400px); }
        .org-hero-glow { position:absolute; top:-120px; /* px, not %: the glow must not move when the hero grows (CLS) */ left:50%; transform:translateX(-50%); width:min(820px,95vw); height:420px;
          background: radial-gradient(ellipse at center, var(--kz-accent-soft) 0%, transparent 66%); pointer-events:none; }
        /* The signature landscape at its original scale (mascots whole), fading only at its top edge. */
        .org-hero-landscape { position:absolute; inset:auto 0 0 0; height:300px; opacity:.6; pointer-events:none;
          -webkit-mask-image: linear-gradient(to top, black 60%, transparent); mask-image: linear-gradient(to top, black 60%, transparent); }
        @media (min-width: 768px) { .org-hero-landscape { height:420px; } }
        .org-hero-inner { position:relative; z-index:1; max-width:880px; margin:0 auto; text-align:center; }
        .org-hero-badge { display:inline-block; padding:6px 12px; border-radius:999px; font-family:var(--font-mono); font-size:11px; font-weight:600;
          letter-spacing:.08em; text-transform:uppercase; color:var(--kz-accent); background:var(--kz-accent-soft);
          border:1px solid color-mix(in srgb, var(--kz-accent) 25%, transparent); }
        .org-hero-title { font-family:var(--font-display), system-ui, sans-serif; font-size:clamp(2.3rem,6.4vw,3.9rem); font-weight:800;
          letter-spacing:-.035em; line-height:1.05; margin:20px 0 0; color:var(--kz-text-primary); }
        .org-hero-line { display:block; }
        .org-hero-accent { background:var(--kz-sheen); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .org-hero-sub { font-size:clamp(15px,1.8vw,17px); line-height:1.7; color:var(--kz-text-secondary); max-width:660px; margin:20px auto 0; }
        .org-hero-products { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr)); gap:12px; margin:32px auto 0; max-width:720px; text-align:left; }
        .org-hero-product { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:14px; text-decoration:none;
          color:var(--kz-text-primary); background:color-mix(in srgb, var(--kz-surface-1) 85%, transparent); border:1px solid var(--kz-border-subtle);
          transition:border-color var(--kz-transition-fast), transform var(--kz-transition-fast); }
        .org-hero-product:hover { border-color:var(--kz-accent); transform:translateY(-1px); }
        .org-hero-product > span:nth-child(2) { flex:1; display:flex; flex-direction:column; gap:2px; font-size:15px; }
        .org-hero-product-tag { font-size:12.5px; color:var(--kz-text-secondary); font-weight:400; }
        .org-hero-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .org-hero-cta { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:28px; }
        .org-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:12px; font-weight:700; font-size:14px; text-decoration:none; }
        .org-btn-primary { background:var(--kz-accent); color:var(--kz-on-accent); }
        .org-btn-ghost { border:1px solid var(--kz-border-default); color:var(--kz-text-primary); font-weight:600; }
        @media (prefers-reduced-motion: reduce) { .org-hero-product, .org-hero-product:hover { transition:none; transform:none; } }
      `}</style>
    </section>
  );
}
