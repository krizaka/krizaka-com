"use client";

/* The two Krizaka products, side by side: what each is, why it is solid, where to go next. */

import Link from "next/link";
import { ArrowRight, BookOpen, Check, GitBranch } from "lucide-react";
import { useI18n } from "../I18nProvider";
import { PRODUCTS } from "@/lib/org-data";

export default function ProductsShowcase() {
  const { locale } = useI18n();
  const loc = locale === "en" ? "en" : "fr";

  return (
    <section id="products" className="kz-section">
      <p className="kz-eyebrow">{loc === "fr" ? "Nos produits" : "Our products"}</p>
      <h2 className="kz-h2">{loc === "fr" ? "Deux plateformes, une même rigueur." : "Two platforms, one standard."}</h2>
      <div className="kz-products">
        {PRODUCTS.map((p) => (
          <article key={p.id} className="kz-product" style={{ ["--product-accent" as string]: p.accent }}>
            <div className="kz-product-head">
              <span className="kz-product-mark" aria-hidden />
              <h3>{p.name}</h3>
            </div>
            <p className="kz-product-tagline">{p.tagline[loc]}</p>
            <p className="kz-product-summary">{p.summary[loc]}</p>
            <ul className="kz-product-points">
              {p.points.map((point) => (
                <li key={point.en}>
                  <Check size={14} aria-hidden /> {point[loc]}
                </li>
              ))}
            </ul>
            <p className="kz-product-stack">{p.stack}</p>
            <div className="kz-product-links">
              <Link href={p.href} className="kz-link-strong">
                {loc === "fr" ? "Découvrir" : "Discover"} <ArrowRight size={14} />
              </Link>
              <Link href={p.docsHref} className="kz-link">
                <BookOpen size={14} /> Docs
              </Link>
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="kz-link">
                <GitBranch size={14} /> GitHub
              </a>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .kz-products { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: 18px; }
        .kz-product { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 26px; border-radius: 20px; overflow: hidden;
          background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .kz-product::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 3px; background: var(--product-accent); }
        .kz-product-head { display: flex; align-items: center; gap: 10px; }
        .kz-product-head h3 { margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 22px; font-weight: 800; color: var(--kz-text-primary); }
        .kz-product-mark { width: 12px; height: 12px; border-radius: 4px; background: var(--product-accent); }
        .kz-product-tagline { margin: 0; font-weight: 600; color: var(--kz-text-primary); }
        .kz-product-summary { margin: 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }
        .kz-product-points { list-style: none; padding: 0; margin: 4px 0 0; display: grid; gap: 8px; }
        .kz-product-points li { display: flex; gap: 8px; align-items: baseline; font-size: 13.5px; color: var(--kz-text-secondary); }
        .kz-product-points svg { color: var(--product-accent); flex-shrink: 0; transform: translateY(2px); }
        .kz-product-stack { margin: 6px 0 0; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }
        .kz-product-links { display: flex; flex-wrap: wrap; gap: 16px; margin-top: auto; padding-top: 10px; }
      `}</style>
    </section>
  );
}
