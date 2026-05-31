"use client";

/* ─────────────────────────────────────────────────────────────────────
   KRIZAKA — Sovereign AI Chat Showcase
   ─────────────────────────────────────────────────────────────────────
   A code-driven, self-playing mockup of the Orazaka engine answering a
   query *locally*. Not a real chat — it dramatizes the value prop:
   deterministic interceptor pipeline + on-prem inference + zero data
   egress. Theme-aware (var(--kz-*) only) and reduced-motion safe.
   ───────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Send, Check, Lock } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { OwlSVG } from "./OwlSVG";

export default function KrizakaChatShowcase() {
  const { t } = useI18n();
  const c = t.homeHero.chat;
  const reduce = useReducedMotion();

  // 0: idle · 1: user msg · 2: typing dots · 3: answer typing · 4: done
  // Lazy init keeps reduced-motion static from the first paint. The parent
  // remounts this component on locale change (key={locale}) so no in-effect reset.
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(() => (reduce ? 4 : 0));
  const [typed, setTyped] = useState(() => (reduce ? c.answer : ""));

  // Orchestrate the scripted sequence (state updates happen in async callbacks).
  useEffect(() => {
    if (reduce) return;
    const timers = [
      setTimeout(() => setPhase(1), 650),
      setTimeout(() => setPhase(2), 1350),
      setTimeout(() => setPhase(3), 2450),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  // Character-by-character reveal of the assistant answer.
  useEffect(() => {
    if (phase !== 3 || reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(c.answer.slice(0, i));
      if (i >= c.answer.length) {
        clearInterval(id);
        setPhase(4);
      }
    }, 16);
    return () => clearInterval(id);
  }, [phase, reduce, c.answer]);

  return (
    <div className="kz-chat-wrap">
      {/* Ambient accent glow behind the card */}
      <div className="kz-chat-glow" aria-hidden />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="kz-chat-card"
        role="img"
        aria-label={`${c.question} — ${c.answer}`}
      >
        {/* ─── Header ─── */}
        <div className="kz-chat-head">
          <div className="kz-chat-id">
            <span className="kz-chat-avatar">
              <OwlSVG size={22} />
            </span>
            <span className="kz-chat-idtext">
              <span className="kz-chat-name">Orazaka</span>
              <span className="kz-chat-status">
                <span className="kz-dot" />
                {c.status}
              </span>
            </span>
          </div>
          <span className="kz-chat-model">
            <Lock size={11} strokeWidth={2.4} />
            {c.model}
          </span>
        </div>

        {/* ─── Conversation ─── */}
        <div className="kz-chat-body">
          {/* User bubble */}
          <motion.div
            className="kz-row kz-row-user"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="kz-bubble kz-bubble-user">{c.question}</div>
          </motion.div>

          {/* Typing indicator */}
          {phase === 2 && (
            <div className="kz-row kz-row-ai">
              <div className="kz-bubble kz-bubble-ai kz-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {/* Assistant bubble */}
          {phase >= 3 && (
            <motion.div
              className="kz-row kz-row-ai"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="kz-bubble kz-bubble-ai">
                <span className="kz-routed">
                  <ShieldCheck size={11} strokeWidth={2.4} />
                  {c.routed}
                </span>
                <p className="kz-answer">
                  {phase === 4 ? c.answer : typed}
                  {phase === 3 && <span className="kz-caret" />}
                </p>

                {/* Interceptor pipeline chips */}
                <motion.div
                  className="kz-pipeline"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {c.pipeline.map((step, i) => (
                    <span key={step} className="kz-chip">
                      <Check size={10} strokeWidth={3} />
                      {step}
                      {i < c.pipeline.length - 1 && <span className="kz-chip-arrow">→</span>}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── Footer (decorative input) ─── */}
        <div className="kz-chat-foot">
          <div className="kz-fakeinput" aria-hidden>
            <span className="kz-fakeinput-text">{c.placeholder}</span>
            <span className="kz-send">
              <Send size={13} strokeWidth={2.4} />
            </span>
          </div>
          <span className="kz-privacy">
            <ShieldCheck size={12} strokeWidth={2.2} />
            {c.privacy}
          </span>
        </div>
      </motion.div>

      <style>{`
        .kz-chat-wrap {
          position: relative;
          width: 100%;
          max-width: 440px;
        }
        .kz-chat-glow {
          position: absolute;
          inset: -14% -10% -22%;
          background: radial-gradient(60% 55% at 60% 35%, var(--kz-accent-soft) 0%, transparent 70%);
          filter: blur(8px);
          pointer-events: none;
          z-index: 0;
        }
        .kz-chat-card {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          border-radius: var(--kz-radius-xl);
          border: 1px solid var(--kz-border-default);
          background: color-mix(in srgb, var(--kz-surface-1) 88%, transparent);
          backdrop-filter: blur(20px);
          box-shadow: var(--kz-shadow-lg);
          overflow: hidden;
        }

        /* Header */
        .kz-chat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--kz-border-subtle);
          background: color-mix(in srgb, var(--kz-surface-2) 55%, transparent);
        }
        .kz-chat-id { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .kz-chat-avatar {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: var(--kz-radius-full);
          background: var(--kz-surface-1);
          border: 1px solid var(--kz-border-strong);
          flex-shrink: 0;
        }
        .kz-chat-idtext { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .kz-chat-name {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--kz-text-primary);
          letter-spacing: -0.01em;
        }
        .kz-chat-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          color: var(--kz-text-secondary);
        }
        .kz-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--kz-status-success);
          box-shadow: 0 0 0 0 color-mix(in srgb, var(--kz-status-success) 60%, transparent);
          animation: kz-pulse 2s ease-out infinite;
        }
        .kz-chat-model {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: var(--kz-radius-full);
          border: 1px solid var(--kz-border-subtle);
          background: var(--kz-surface-2);
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          font-weight: 600;
          color: var(--kz-text-secondary);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Body */
        .kz-chat-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px 16px;
          min-height: 268px;
        }
        .kz-row { display: flex; }
        .kz-row-user { justify-content: flex-end; }
        .kz-row-ai { justify-content: flex-start; }
        .kz-bubble {
          max-width: 84%;
          padding: 10px 13px;
          font-size: 13px;
          line-height: 1.55;
          border-radius: 16px;
        }
        .kz-bubble-user {
          background: var(--kz-accent);
          color: var(--kz-on-accent);
          border-bottom-right-radius: 5px;
          font-weight: 500;
        }
        .kz-bubble-ai {
          background: var(--kz-surface-2);
          border: 1px solid var(--kz-border-subtle);
          color: var(--kz-text-primary);
          border-bottom-left-radius: 5px;
        }
        .kz-routed {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 7px;
          font-family: var(--font-mono), monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--kz-status-success);
        }
        .kz-answer { margin: 0; }
        .kz-caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          margin-left: 1px;
          vertical-align: text-bottom;
          background: var(--kz-accent);
          animation: kz-blink 1s steps(2) infinite;
        }
        .kz-pipeline {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 11px;
          padding-top: 11px;
          border-top: 1px solid var(--kz-border-subtle);
        }
        .kz-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--kz-radius-full);
          background: var(--kz-accent-soft);
          color: var(--kz-accent);
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          font-weight: 600;
        }
        .kz-chip-arrow { margin-left: 3px; opacity: 0.5; }

        /* Typing dots */
        .kz-typing { display: inline-flex; align-items: center; gap: 4px; }
        .kz-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--kz-text-muted);
          animation: kz-typing 1.1s ease-in-out infinite;
        }
        .kz-typing span:nth-child(2) { animation-delay: 0.18s; }
        .kz-typing span:nth-child(3) { animation-delay: 0.36s; }

        /* Footer */
        .kz-chat-foot {
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding: 13px 16px 15px;
          border-top: 1px solid var(--kz-border-subtle);
          background: color-mix(in srgb, var(--kz-surface-2) 40%, transparent);
        }
        .kz-fakeinput {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 8px 8px 14px;
          border-radius: var(--kz-radius-full);
          border: 1px solid var(--kz-border-default);
          background: var(--kz-surface-1);
        }
        .kz-fakeinput-text { font-size: 12.5px; color: var(--kz-text-muted); }
        .kz-send {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: var(--kz-radius-full);
          background: var(--kz-accent);
          color: var(--kz-on-accent);
          flex-shrink: 0;
        }
        .kz-privacy {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 500;
          color: var(--kz-text-secondary);
        }
        .kz-privacy svg { color: var(--kz-status-success); }

        @keyframes kz-pulse {
          0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--kz-status-success) 55%, transparent); }
          70%  { box-shadow: 0 0 0 6px color-mix(in srgb, var(--kz-status-success) 0%, transparent); }
          100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--kz-status-success) 0%, transparent); }
        }
        @keyframes kz-typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes kz-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .kz-dot, .kz-typing span, .kz-caret { animation: none; }
        }
      `}</style>
    </div>
  );
}
