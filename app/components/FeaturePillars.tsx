"use client";

/* ─────────────────────────────────────────────────────────────────────
   KRIZAKA — Feature Pillars (bento)
   ─────────────────────────────────────────────────────────────────────
   Modern bento grid built from t.pillars. One featured card + a 4-up
   grid. Theme-aware (var(--kz-*) only), reduced-motion safe via
   whileInView + Framer's global reducer.
   ───────────────────────────────────────────────────────────────────── */

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Layers, KeyRound, GitBranch, CircleCheckBig } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "./I18nProvider";

/* Write the pointer position onto the card as CSS vars so the spotlight
   (.kz-spotlight::after) can follow the cursor. */
function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
}

const ICONS: LucideIcon[] = [ShieldCheck, Layers, KeyRound, GitBranch, CircleCheckBig];

export default function FeaturePillars() {
  const { t } = useI18n();
  const p = t.pillars;
  const [featured, ...rest] = p.items;
  const FeaturedIcon = ICONS[0];

  return (
    <section id="pillars" className="pillars">
      <motion.div
        className="pillars-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="pillars-label">{p.sectionLabel}</span>
        <h2 className="pillars-title">{p.sectionTitle}</h2>
      </motion.div>

      <div className="pillars-grid">
        {/* Featured pillar */}
        <motion.article
          className="pillar pillar-featured kz-spotlight"
          onMouseMove={trackSpotlight}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pillar-glow" aria-hidden />
          <span className="pillar-icon">
            <FeaturedIcon size={22} strokeWidth={2} />
          </span>
          <span className="pillar-keyword">{featured.keyword}</span>
          <h3 className="pillar-title pillar-title-lg">{featured.title}</h3>
          <p className="pillar-desc pillar-desc-lg">{featured.desc}</p>
        </motion.article>

        {/* Remaining pillars */}
        {rest.map((item, i) => {
          const Icon = ICONS[(i + 1) % ICONS.length];
          return (
            <motion.article
              key={item.keyword}
              className="pillar kz-spotlight"
              onMouseMove={trackSpotlight}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.06 * (i + 1) }}
            >
              <span className="pillar-icon">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="pillar-keyword">{item.keyword}</span>
              <h3 className="pillar-title">{item.title}</h3>
              <p className="pillar-desc">{item.desc}</p>
            </motion.article>
          );
        })}
      </div>

      <style>{`
        .pillars {
          max-width: 1120px;
          margin: 0 auto;
          padding: 80px 24px 40px;
        }
        .pillars-head { max-width: 620px; margin-bottom: 40px; }
        .pillars-label {
          display: block;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          font-weight: 700;
          color: var(--kz-accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .pillars-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.12;
          background: var(--kz-sheen);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 640px) { .pillars-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1000px) { .pillars-grid { grid-template-columns: repeat(4, 1fr); } }

        .pillar {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 22px;
          border-radius: var(--kz-radius-lg);
          border: 1px solid var(--kz-border-subtle);
          background: color-mix(in srgb, var(--kz-surface-1) 70%, transparent);
          backdrop-filter: blur(10px);
          transition: border-color var(--kz-transition-smooth), transform var(--kz-transition-smooth), box-shadow var(--kz-transition-smooth);
          overflow: hidden;
        }
        .pillar:hover {
          border-color: var(--kz-border-strong);
          transform: translateY(-3px);
          box-shadow: var(--kz-shadow-md);
        }
        .pillar-featured {
          grid-column: 1 / -1;
          padding: 30px;
        }
        @media (min-width: 1000px) {
          .pillar-featured { grid-column: span 2; grid-row: span 2; }
        }
        .pillar-glow {
          position: absolute;
          inset: auto -20% -40% -10%;
          height: 60%;
          background: radial-gradient(60% 60% at 30% 100%, var(--kz-accent-soft) 0%, transparent 70%);
          pointer-events: none;
        }
        .pillar-icon {
          display: grid;
          place-items: center;
          width: 42px; height: 42px;
          border-radius: var(--kz-radius-md);
          background: var(--kz-accent-soft);
          color: var(--kz-accent);
          margin-bottom: 16px;
        }
        .pillar-featured .pillar-icon { width: 50px; height: 50px; }
        .pillar-keyword {
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--kz-text-muted);
          margin-bottom: 8px;
        }
        .pillar-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--kz-text-primary);
          margin-bottom: 8px;
        }
        .pillar-title-lg { font-size: clamp(1.25rem, 2.4vw, 1.6rem); margin-bottom: 12px; }
        .pillar-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--kz-text-secondary);
          margin: 0;
        }
        .pillar-desc-lg { font-size: 15px; max-width: 440px; }
      `}</style>
    </section>
  );
}
