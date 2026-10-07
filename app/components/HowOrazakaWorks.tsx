"use client";

/* ─────────────────────────────────────────────────────────────────────────
   HOW ORAZAKA WORKS — the evangelist's teaching layer
   ─────────────────────────────────────────────────────────────────────────
   Sits between the page hero and the interactive ArchitectureMesh. Its job is
   pedagogy, not decoration: give the mental model in one breath, then walk a
   real request through the six stages (what happens · why it matters), and
   finally hand the reader off to the live map with a "how to read it" cue.

   Narration is grounded in the real component descriptions from
   ArchitectureMesh — no invented facts. Stage colors are kept identical so
   the story and the board read as one system. Tokens only (var(--kz-*)),
   theme-aware, reduced-motion safe.
   ───────────────────────────────────────────────────────────────────────── */

import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Workflow,
  Boxes,
  MousePointerClick,
  Search,
  CornerDownLeft,
  ArrowDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "./I18nProvider";


/* Same six accents as ArchitectureMesh, so the narrative maps 1:1 onto the board. */
const STAGE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#6366f1", "#10b981", "#f43f5e"];

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

interface Principle {
  icon: LucideIcon;
  color: string;
}

const PRINCIPLES: Principle[] = [
  {
    icon: ShieldCheck,
    color: "#10b981",
  },
  {
    icon: Workflow,
    color: "#6366f1",
  },
  {
    icon: Boxes,
    color: "#8b5cf6",
  },
];

interface Step {
  num: string;
  color: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    color: STAGE_COLORS[0],
  },
  {
    num: "02",
    color: STAGE_COLORS[1],
  },
  {
    num: "03",
    color: STAGE_COLORS[2],
  },
  {
    num: "04",
    color: STAGE_COLORS[3],
  },
  {
    num: "05",
    color: STAGE_COLORS[4],
  },
  {
    num: "06",
    color: STAGE_COLORS[5],
  },
];

export default function HowOrazakaWorks() {
  const { t } = useI18n();
  const text = t.pages.howOrazakaWorks;
  // Structure here, words in messages → pages.howOrazakaWorks.
  const principles = PRINCIPLES.map((p, i) => ({ ...p, ...text.principles[i] }));
  const steps = STEPS.map((s, i) => ({ ...s, ...text.steps[i] }));
  const reduce = useReducedMotion();

  // Same markup on the server and the client (useReducedMotion is unknown during SSR, and
  // branching on it caused a hydration mismatch); reduced motion only zeroes the transition.
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section
      aria-labelledby="how-it-works-heading"
      style={{ maxWidth: "820px", margin: "0 auto", padding: "8px 20px 24px" }}
    >
      {/* ── Mental model ── */}
      <motion.div {...reveal()} style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--kz-accent)",
            margin: 0,
          }}
        >
          {t.pages.howOrazakaWorks.readingGuide}
        </p>
        <h2
          id="how-it-works-heading"
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "var(--kz-text-primary)",
            margin: "12px 0 0",
          }}
        >
          {t.pages.howOrazakaWorks.orazakaExplainedSimply}
        </h2>
        <p style={{ fontSize: "15.5px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "14px 0 0" }}>
          {t.pages.howOrazakaWorks.beforeYouDiveIntoThe}
        </p>
      </motion.div>

      {/* ── Three principles ── */}
      <div className="how-principles" style={{ display: "grid", gap: "12px", margin: "32px 0 8px" }}>
        {principles.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              {...reveal(0.06 * i)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid var(--kz-border-subtle)",
                background: "color-mix(in srgb, var(--kz-surface-1) 60%, transparent)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  background: mix(p.color, 14),
                  border: `1px solid ${mix(p.color, 34)}`,
                  color: p.color,
                }}
              >
                <Icon size={19} strokeWidth={2} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                }}
              >
                {p.title}
              </span>
              <span style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>
                {p.desc}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Worked example: follow one request ── */}
      <motion.div {...reveal()} style={{ margin: "44px 0 0" }}>
        <h3
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            fontWeight: 750,
            letterSpacing: "-0.02em",
            color: "var(--kz-text-primary)",
            margin: 0,
          }}
        >
          {t.pages.howOrazakaWorks.letSFollowOneReal}
        </h3>

        {/* the sample question */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            margin: "16px 0 0",
            padding: "13px 15px",
            borderRadius: "13px",
            border: `1px solid ${mix("var(--kz-accent)", 40)}`,
            background: "var(--kz-accent-soft)",
          }}
        >
          <CornerDownLeft size={15} strokeWidth={2.2} style={{ color: "var(--kz-accent)", marginTop: "2px", flexShrink: 0 }} />
          <p
            style={{
              margin: 0,
              fontSize: "14.5px",
              lineHeight: 1.55,
              fontStyle: "italic",
              color: "var(--kz-text-primary)",
            }}
          >
            {t.pages.howOrazakaWorks.summarizeThisContractAndFlag}
          </p>
        </div>
        <p style={{ fontSize: "14.5px", lineHeight: 1.65, color: "var(--kz-text-secondary)", margin: "12px 2px 0" }}>
          {t.pages.howOrazakaWorks.hereSWhatHappensTo}
        </p>
      </motion.div>

      {/* ── The narrated timeline ── */}
      <ol style={{ listStyle: "none", padding: 0, margin: "24px 0 0" }}>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <motion.li key={s.num} {...reveal(0.04 * Math.min(i, 5))} style={{ display: "flex", gap: "16px" }}>
              {/* spine + badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: s.color,
                    background: mix(s.color, 13),
                    border: `1.5px solid ${mix(s.color, 45)}`,
                  }}
                >
                  {s.num}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 1,
                      width: "2px",
                      minHeight: "22px",
                      margin: "6px 0",
                      borderRadius: "2px",
                      background: `linear-gradient(180deg, ${mix(s.color, 55)}, ${mix(STEPS[i + 1].color, 55)})`,
                    }}
                  />
                )}
              </div>

              {/* content */}
              <div style={{ paddingBottom: last ? 0 : "22px", minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </div>
                <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: 1.65, color: "var(--kz-text-secondary)" }}>
                  {s.what}
                </p>
                <p
                  style={{
                    display: "flex",
                    gap: "7px",
                    alignItems: "baseline",
                    margin: "8px 0 0",
                    fontSize: "13px",
                    lineHeight: 1.55,
                    color: s.color,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      opacity: 0.85,
                      flexShrink: 0,
                    }}
                  >
                    {t.pages.howOrazakaWorks.why}
                  </span>
                  <span>{s.why}</span>
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* ── The answer returns ── */}
      <motion.p
        {...reveal()}
        style={{
          margin: "4px 0 0",
          paddingLeft: "54px",
          fontSize: "14.5px",
          lineHeight: 1.65,
          color: "var(--kz-text-primary)",
          fontWeight: 500,
        }}
      >
        {t.pages.howOrazakaWorks.theLocallyValidatedAnswerComes}
      </motion.p>

      {/* ── Hand-off to the live map ── */}
      <motion.div
        {...reveal()}
        style={{
          margin: "40px 0 0",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid var(--kz-border-subtle)",
          background: "color-mix(in srgb, var(--kz-surface-1) 55%, transparent)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--kz-text-primary)",
          }}
        >
          {t.pages.howOrazakaWorks.nowExploreTheLiveMap}
        </div>
        <div
          className="how-handoff-hints"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 20px",
            margin: "14px 0 0",
          }}
        >
          {[
            { icon: MousePointerClick, text: text.hints[0] },
            { icon: MousePointerClick, text: text.hints[1] },
            { icon: Search, text: text.hints[2] },
          ].map((h, i) => {
            const Icon = h.icon;
            return (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "12.5px",
                  color: "var(--kz-text-secondary)",
                }}
              >
                <Icon size={14} strokeWidth={2} style={{ color: "var(--kz-accent)", flexShrink: 0 }} />
                {h.text}
              </span>
            );
          })}
        </div>
        <ArrowDown
          size={18}
          strokeWidth={2.2}
          aria-hidden="true"
          className="how-bounce"
          style={{ color: "var(--kz-text-muted)", margin: "16px 0 0" }}
        />
      </motion.div>

      <style>{`
        .how-principles { grid-template-columns: 1fr; }
        @media (min-width: 720px) {
          .how-principles { grid-template-columns: repeat(3, 1fr); }
        }
        @keyframes how-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
        .how-bounce { animation: how-bounce 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .how-bounce { animation: none; }
        }
      `}</style>
    </section>
  );
}
