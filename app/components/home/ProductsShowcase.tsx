"use client";

/* The two Krizaka products, presented the same way: animated mark, promise, proof points, stack,
   a recording of the real product, and the same five entry points as the navigation (lib/nav.ts). */

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, GitBranch } from "lucide-react";
import { useI18n } from "../I18nProvider";
import ProductLogo from "../ProductLogo";
import { NAV_ICONS } from "../ProductsMenu";
import { PRODUCTS } from "@/lib/org-data";
import { NAV_PRODUCTS } from "@/lib/nav";

const noop = () => () => {};

export default function ProductsShowcase() {
  const { locale } = useI18n();
  const loc = locale === "fr" ? "fr" : "en";
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const prefersReduced = useReducedMotion();
  const still = !mounted || !!prefersReduced;

  return (
    <section id="products" className="kz-section">
      <p className="kz-eyebrow">{loc === "fr" ? "Nos produits" : "Our products"}</p>
      <h2 className="kz-h2">{loc === "fr" ? "Deux plateformes, une même rigueur." : "Two platforms, one standard."}</h2>

      <div className="kz-spots">
        {PRODUCTS.map((p, i) => {
          const nav = NAV_PRODUCTS.find((n) => n.id === p.id)!;
          return (
            <article key={p.id} className={`kz-spot${i % 2 ? " is-flipped" : ""}`} style={{ ["--product-accent" as string]: p.accent }}>
              <div className="kz-spot-copy">
                <div className="kz-spot-head">
                  <ProductLogo id={p.id} size={56} />
                  <div>
                    <h3>{p.name}</h3>
                    <span className="kz-spot-badge">{nav.badge[loc]} · open source</span>
                  </div>
                </div>
                <p className="kz-spot-tagline">{p.tagline[loc]}</p>
                <p className="kz-spot-summary">{p.summary[loc]}</p>
                <ul className="kz-spot-points">
                  {p.points.map((point) => (
                    <li key={point.en}>
                      <Check size={14} aria-hidden /> {point[loc]}
                    </li>
                  ))}
                </ul>
                <p className="kz-spot-stack">{p.stack}</p>
                <nav className="kz-spot-links" aria-label={p.name}>
                  {nav.links.map((l) => {
                    const Icon = NAV_ICONS[l.icon];
                    return (
                      <Link key={l.href} href={l.href} className={l.icon === "overview" ? "kz-spot-primary" : "kz-spot-chip"}>
                        <Icon size={14} aria-hidden /> {l.label[loc]}
                      </Link>
                    );
                  })}
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="kz-spot-chip">
                    <GitBranch size={14} aria-hidden /> GitHub
                  </a>
                </nav>
              </div>

              <figure className="kz-spot-media">
                <div className="kz-spot-chrome" aria-hidden>
                  <span /><span /><span /> <em>{p.media.frame}</em>
                </div>
                <video
                  muted
                  loop
                  playsInline
                  autoPlay={!still}
                  controls={still}
                  preload={still ? "none" : "metadata"}
                  poster={`${p.media.src}.jpg`}
                  style={{ aspectRatio: p.media.aspect }}
                  aria-label={`${p.name} — ${loc === "fr" ? "démonstration" : "demo"}`}
                >
                  <source src={`${p.media.src}.webm`} type="video/webm" />
                  <source src={`${p.media.src}.mp4`} type="video/mp4" />
                </video>
              </figure>
            </article>
          );
        })}
      </div>

      <style>{`
        .kz-spots { display: grid; gap: clamp(40px, 6vw, 72px); }
        .kz-spot { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: clamp(24px, 4vw, 48px); align-items: center; }
        .kz-spot.is-flipped .kz-spot-copy { order: 2; }
        @media (max-width: 900px) { .kz-spot { grid-template-columns: 1fr; } .kz-spot.is-flipped .kz-spot-copy { order: 0; } }
        .kz-spot-copy { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .kz-spot-head { display: flex; align-items: center; gap: 14px; }
        .kz-spot-head h3 { margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -.02em; color: var(--kz-text-primary); }
        .kz-spot-badge { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--product-accent); }
        .kz-spot-tagline { margin: 4px 0 0; font-size: 18px; font-weight: 700; color: var(--kz-text-primary); }
        .kz-spot-summary { margin: 0; font-size: 14.5px; line-height: 1.7; color: var(--kz-text-secondary); }
        .kz-spot-points { list-style: none; padding: 0; margin: 2px 0 0; display: grid; gap: 8px; }
        .kz-spot-points li { display: flex; gap: 8px; align-items: baseline; font-size: 14px; color: var(--kz-text-secondary); }
        .kz-spot-points svg { color: var(--product-accent); flex-shrink: 0; transform: translateY(2px); }
        .kz-spot-stack { margin: 2px 0 0; font-family: var(--font-mono); font-size: 11.5px; color: var(--kz-text-muted); }
        .kz-spot-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
        .kz-spot-primary, .kz-spot-chip { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none; }
        .kz-spot-primary { background: var(--kz-text-primary); color: var(--kz-surface-0); }
        .kz-spot-chip { color: var(--kz-text-secondary); background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color 150ms ease, color 150ms ease; }
        .kz-spot-chip:hover { color: var(--kz-text-primary); border-color: var(--product-accent); }
        .kz-spot-media { margin: 0; border-radius: 18px; overflow: hidden; border: 1px solid var(--kz-border-default); background: #09090b;
          box-shadow: var(--kz-shadow-lg), 0 0 70px color-mix(in srgb, var(--product-accent) 18%, transparent); }
        .kz-spot-chrome { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: var(--kz-surface-2); border-bottom: 1px solid var(--kz-border-subtle); }
        .kz-spot-chrome span { width: 9px; height: 9px; border-radius: 50%; background: var(--kz-border-strong); }
        .kz-spot-chrome em { margin-left: 8px; font-style: normal; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }
        .kz-spot-media video { display: block; width: 100%; height: auto; object-fit: cover; }
      `}</style>
    </section>
  );
}
