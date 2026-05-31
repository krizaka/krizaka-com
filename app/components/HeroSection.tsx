"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Server, GitBranch, Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "./I18nProvider";
import KrizakaChatShowcase from "./KrizakaChatShowcase";
import KrizakaLandscape from "./illustrations/KrizakaLandscape";

const TRUST_ICONS = [Server, Boxes, GitBranch, ShieldCheck] as const;

export default function HeroSection() {
  const { t, locale } = useI18n();
  const h = t.homeHero;

  return (
    <section id="hero">
      {/* Ambient accent glow */}
      <div className="hero-glow" aria-hidden />
      {/* Signature horizon (brand continuity), faded far below the fold */}
      <div className="hero-landscape-container" aria-hidden>
        <KrizakaLandscape relative={false} />
      </div>

      <div className="hero-inner">
        {/* ─── Left · copy ─── */}
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            {h.badge}
          </span>

          <h1 className="hero-title">
            {h.titleLead}{" "}
            <span className="hero-title-accent">{h.titleAccent}</span>{" "}
            {h.titleTail}
          </h1>

          <p className="hero-sub">{h.sub}</p>

          <div className="hero-cta">
            <Link href="/products/orazaka/ingenierie-cognitive" className="hero-btn hero-btn-primary btn-sheen">
              {h.ctaPrimary}
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link href="/architecture" className="hero-btn hero-btn-ghost">
              {h.ctaSecondary}
            </Link>
          </div>

          <ul className="hero-trust">
            {h.trust.map((label, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <li key={label} className="hero-trust-item">
                  <Icon size={13} strokeWidth={2.2} />
                  {label}
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* ─── Right · sovereign AI chat ─── */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <KrizakaChatShowcase key={locale} />
        </motion.div>
      </div>

      <style>{`
        #hero {
          position: relative;
          width: 100%;
          padding: 96px 0 120px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          #hero { padding: 120px 0 200px; }
        }
        #hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--kz-grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--kz-grid-color) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(circle at 50% 20%, black 45%, transparent 90%);
          -webkit-mask-image: radial-gradient(circle at 50% 20%, black 45%, transparent 90%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-glow {
          position: absolute;
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          width: min(1000px, 96vw);
          height: 460px;
          background: radial-gradient(ellipse at center, var(--kz-accent-soft) 0%, transparent 66%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-landscape-container {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 300px;
          opacity: 0.5;
          pointer-events: none;
          z-index: 0;
          mask-image: linear-gradient(to top, black 0%, transparent 100%);
          -webkit-mask-image: linear-gradient(to top, black 0%, transparent 100%);
        }
        @media (min-width: 768px) {
          .hero-landscape-container { height: 420px; }
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          align-items: center;
        }
        @media (min-width: 960px) {
          .hero-inner {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
            gap: 48px;
          }
        }

        /* Copy */
        .hero-copy { max-width: 600px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 13px 6px 11px;
          border-radius: var(--kz-radius-full);
          border: 1px solid var(--kz-border-default);
          background: color-mix(in srgb, var(--kz-surface-1) 70%, transparent);
          backdrop-filter: blur(8px);
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: var(--kz-text-secondary);
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--kz-accent);
          box-shadow: 0 0 0 3px var(--kz-accent-soft);
        }
        .hero-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(2rem, 5.2vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.05;
          background: var(--kz-sheen);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-top: 22px;
        }
        .hero-title-accent {
          background: linear-gradient(120deg, var(--kz-accent), color-mix(in srgb, var(--kz-accent) 55%, var(--kz-text-primary)));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero-sub {
          font-size: clamp(15px, 1.4vw, 17px);
          line-height: 1.65;
          color: var(--kz-text-secondary);
          margin-top: 20px;
          max-width: 540px;
        }
        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: var(--kz-radius-full);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: transform var(--kz-transition-fast), background var(--kz-transition-fast), border-color var(--kz-transition-fast);
        }
        .hero-btn-primary {
          background: var(--kz-accent);
          color: var(--kz-on-accent);
          box-shadow: 0 6px 16px var(--kz-accent-soft);
        }
        .hero-btn-primary:hover { background: var(--kz-accent-hover); transform: translateY(-1px); }
        .hero-btn-ghost {
          background: color-mix(in srgb, var(--kz-surface-1) 60%, transparent);
          border: 1px solid var(--kz-border-default);
          color: var(--kz-text-primary);
          backdrop-filter: blur(8px);
        }
        .hero-btn-ghost:hover { border-color: var(--kz-border-strong); transform: translateY(-1px); }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 18px;
          margin-top: 34px;
          padding: 0;
          list-style: none;
        }
        .hero-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--kz-text-muted);
        }
        .hero-trust-item svg { color: var(--kz-accent); opacity: 0.85; }

        /* Visual */
        .hero-visual { display: flex; justify-content: center; }
        @media (min-width: 960px) { .hero-visual { justify-content: flex-end; } }
      `}</style>
    </section>
  );
}
