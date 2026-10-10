"use client";

/* ── /story — the arcade nods ───────────────────────────────────────────────────────────
   The page borrows the grammar of a 1990s arcade fighting game — a select screen, power gauges, a stage
   announcement, a boss gauge, the continue screen — and nothing else: every shape here is ours (the three
   brand marks, the sacred treasures of the myth, the flock). No sprite, character, name, logo, typeface or
   sound from any game.

   Motion budget (the contract the PR describes):
   - each section plays its entrance ONCE, when it first enters the viewport (`data-in`), in sequence —
     visual first, announcement next, text last; nothing replays;
   - at most ONE slow, low-contrast loop per section (`.an-loop`), and it only runs while the section is on
     screen (`data-live`); never behind a paragraph;
   - the mascots and marks move on hover only;
   - no canvas, no requestAnimationFrame loop, no pointer tracking: one IntersectionObserver for the page;
   - prefers-reduced-motion: the director never switches motion on — everything is static and fully visible.
   Colours: tokens only. Each clan section carries `brand-<id>` (@krizaka/tokens/brands/scoped.css), so
   --kz-accent, --kz-accent-2 and the brand gradient are that brand's — the same values as its mark.
──────────────────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { ChapterId } from "@/lib/story";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ── The director: one observer, sets data-in (once) and data-live (while visible) ─────── */

export function ArcadeDirector({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.motion = "on";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const t = e.target as HTMLElement;
          if (e.isIntersecting) {
            t.dataset.in = "";
            t.dataset.live = "";
          } else {
            delete t.dataset.live;
          }
        }
      },
      { threshold: 0.2 },
    );
    el.querySelectorAll<HTMLElement>("[data-arena]").forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);
  return (
    <div ref={root} className="st">
      {children}
    </div>
  );
}

/* ── The three sacred treasures of the myth, one per clan ─────────────────────────────── */

export function TreasureIcon({ id, size = 20 }: { id: ChapterId; size?: number }) {
  const common = {
    viewBox: "0 0 48 48",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (id === "krizaka")
    return (
      <svg {...common}>
        <path d="M24 3 L27 28 L24 36 L21 28 Z" />
        <path d="M15 30 H33 M24 36 V45" />
      </svg>
    );
  if (id === "orazaka")
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="17" />
        <circle cx="24" cy="24" r="9" />
        <path d="M24 2 V6 M24 42 V46 M2 24 H6 M42 24 H46" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M31 10 a13 13 0 1 1 -15 19 a8 8 0 0 0 8 -9 a8 8 0 0 1 7 -10 Z" />
      <circle cx="29" cy="17" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Hero: the select screen — three slots lock in, one after the other ─────────────────── */

export function ClanSelect({
  clans,
  head,
  aria,
}: {
  clans: { id: ChapterId; mark: ReactNode; name: string; title: string }[];
  head: { tag: string; synergy: string };
  aria: string;
}) {
  return (
    <div className="an-select" role="group" aria-label={aria} data-arena>
      <div className="an-crt-lines" aria-hidden />
      <div className="an-scan an-loop" aria-hidden />
      <div className="an-select-head" aria-hidden>
        <span className="an-select-tag">{head.tag}</span>
        <span className="an-select-synergy">{head.synergy}</span>
      </div>
      <ul className="an-select-grid">
        {clans.map((c, i) => (
          <li key={c.id} className={`an-slot brand-${c.id}`} style={{ "--i": i } as Vars}>
            <div className="an-slot-frame">
              <span className="an-slot-aura" aria-hidden />
              <span className="an-corner is-tl" aria-hidden />
              <span className="an-corner is-tr" aria-hidden />
              <span className="an-corner is-bl" aria-hidden />
              <span className="an-corner is-br" aria-hidden />
              <span className="an-slot-mark">{c.mark}</span>
            </div>
            <span className="an-slot-name text-fg-accent">
              <TreasureIcon id={c.id} size={13} />
              {c.name}
            </span>
            <span className="an-slot-title">{c.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── A clan stage: the same fighter card for all three ─────────────────────────────────── */

export function FighterCard({
  id,
  mark,
  clanName,
  powerLabel,
  roots,
}: {
  id: ChapterId;
  mark: ReactNode;
  clanName: string;
  powerLabel: string;
  roots: string;
}) {
  return (
    <div className="an-fighter bg-linear-to-b from-brand-from via-brand-via to-brand-to">
      <div className="an-crt-lines" aria-hidden />
      <div className="an-fighter-disc">
        <span className="an-fighter-aura an-loop" aria-hidden />
        <span className="an-fighter-flash" aria-hidden />
        <span className="an-fighter-mark">{mark}</span>
      </div>
      <div className="an-gauge-head">
        <span className="an-gauge-name text-fg-accent">
          <TreasureIcon id={id} size={16} />
          {clanName}
        </span>
        <span className="an-gauge-label">{powerLabel}</span>
      </div>
      <div className="an-gauge" aria-hidden>
        <span className="an-gauge-fill bg-linear-to-r from-accent to-accent-2" />
      </div>
      <p className="an-roots">{roots}</p>
    </div>
  );
}

/* ── The stage announcement (STAGE 01 · KRIZAKA) ───────────────────────────────────────── */

export function StageCall({ stage, name }: { stage: string; name: string }) {
  return (
    <p className="an-stage">
      <span className="an-stage-num text-fg-accent">{stage}</span>
      <span className="an-stage-name">{name}</span>
    </p>
  );
}

/* ── The boss gauge: eight segments, one drained per sealed head ───────────────────────── */

export function BossGauge({ label, count }: { label: string; count: number }) {
  return (
    <div className="an-boss-gauge" aria-hidden>
      <span className="an-boss-gauge-label">{label}</span>
      <div className="an-boss-cells">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="an-boss-cell bg-linear-to-r from-accent to-accent-2" style={{ "--i": i } as Vars} />
        ))}
      </div>
    </div>
  );
}

/* ── Continue? — the cabinet at the end of the page ────────────────────────────────────── */

export function ContinuePrompt({
  label,
  insertCoin,
  coinEntry,
  creditLabel,
  cabinetLabel,
  playerStart,
  restartBtn,
}: {
  label: string;
  insertCoin: string;
  coinEntry: string;
  creditLabel: string;
  cabinetLabel: string;
  playerStart: string;
  restartBtn: string;
}) {
  return (
    <div className="an-bezel brand-krizaka" data-arena>
      <div className="an-bezel-top" aria-hidden>
        <span className="an-screw" />
        <span className="an-bezel-label">{cabinetLabel}</span>
        <span className="an-screw" />
      </div>
      <div className="an-coin-deck" aria-hidden>
        <span className="an-coin-lit text-fg-accent">{insertCoin}</span>
        <span className="an-coin-entry">{coinEntry}</span>
        <span className="an-credit">
          <span className="an-credit-led" />
          {creditLabel}
        </span>
      </div>
      <div className="an-crt theme-dark brand-krizaka" aria-hidden>
        <div className="an-crt-lines" />
        <div className="an-scan an-loop" />
        <div className="an-crt-content">
          <span className="an-crt-title">{label}</span>
          <span className="an-crt-digit text-fg-accent">9</span>
        </div>
      </div>
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="an-start">
        <span className="an-start-key bg-accent text-on-accent">{playerStart}</span>
        <span className="an-start-label">{restartBtn}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" className="an-start-arrow text-fg-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}

/* ── Styles & keyframes ────────────────────────────────────────────────────────────────── */

export function ArcadeStyles() {
  return (
    <style>{`
      /* Shared textures: scanlines (static, 4% ink) and a slow CRT band (the section's one loop). */
      .an-crt-lines { position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
        background: repeating-linear-gradient(to bottom, color-mix(in srgb, var(--kz-text-primary) 4%, transparent) 0 1px, transparent 1px 4px); }
      .an-scan { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; }
      .an-scan::before { content: ""; position: absolute; left: 0; right: 0; height: 30%; top: -30%;
        background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--kz-text-primary) 5%, transparent), transparent); }

      /* ── Select screen (hero) ── */
      .an-select { position: relative; max-width: 720px; margin: 36px auto 0; padding: 18px clamp(12px, 3vw, 28px) 24px;
        border-radius: 22px; border: 1px solid var(--kz-border-subtle);
        background: color-mix(in srgb, var(--kz-surface-1) 70%, transparent); overflow: hidden; }
      .an-select-head { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 12px; margin-bottom: 18px;
        font-family: var(--font-mono); font-size: 10px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
      .an-select-tag { color: var(--kz-accent-text); }
      .an-select-synergy { color: var(--kz-text-secondary); }
      .an-select-grid { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(10px, 3vw, 28px); }
      .an-slot { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
      .an-slot-frame { position: relative; width: clamp(76px, 18vw, 112px); aspect-ratio: 1; display: grid; place-items: center;
        border-radius: 16px; border: 1px solid var(--kz-border-subtle);
        background: radial-gradient(circle at 50% 40%, var(--kz-surface-2), var(--kz-surface-0) 80%);
        transition: transform .3s var(--kz-ease), border-color .3s ease; }
      .an-slot-aura { position: absolute; inset: 10%; border-radius: 50%; background: var(--kz-accent); opacity: .16; filter: blur(16px); transition: opacity .3s ease; }
      .an-slot-mark { position: relative; display: grid; place-items: center; transition: transform .3s var(--kz-ease); }
      .an-corner { position: absolute; width: 14px; height: 14px; border: 2px solid var(--kz-accent); opacity: .9; }
      .an-corner.is-tl { top: -1px; left: -1px; border-right: 0; border-bottom: 0; border-top-left-radius: 8px; }
      .an-corner.is-tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; border-top-right-radius: 8px; }
      .an-corner.is-bl { bottom: -1px; left: -1px; border-right: 0; border-top: 0; border-bottom-left-radius: 8px; }
      .an-corner.is-br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; border-bottom-right-radius: 8px; }
      .an-slot:hover .an-slot-frame { transform: translateY(-4px); border-color: var(--kz-accent); }
      .an-slot:hover .an-slot-aura { opacity: .34; }
      .an-slot:hover .an-slot-mark { transform: scale(1.08); }
      .an-slot-name { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      .an-slot-title { font-size: 12px; color: var(--kz-text-secondary); line-height: 1.4; }
      @media (max-width: 480px) { .an-slot-title { font-size: 11px; } .an-slot-name { letter-spacing: .1em; } }

      /* ── Fighter card (the same visual for the three stages) ── */
      .an-fighter { position: relative; display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 320px;
        padding: 28px 24px 22px; border-radius: 24px; border: 1px solid var(--kz-border-subtle); overflow: hidden; }
      .an-fighter-disc { position: relative; width: 176px; height: 176px; display: grid; place-items: center; border-radius: 50%;
        background: radial-gradient(circle at 50% 40%, var(--kz-surface-2), var(--kz-surface-0) 72%);
        border: 1px solid color-mix(in srgb, var(--kz-accent) 45%, var(--kz-border-subtle)); transition: transform .4s var(--kz-ease); }
      .an-fighter-aura { position: absolute; inset: -6px; border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--kz-accent) 30%, transparent), transparent 70%); opacity: .45; filter: blur(10px); }
      .an-fighter-flash { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--kz-accent); opacity: 0; pointer-events: none; }
      .an-fighter-mark { position: relative; display: grid; place-items: center; transition: transform .4s var(--kz-ease); }
      .an-fighter:hover .an-fighter-mark { transform: scale(1.05); }
      .an-gauge-head { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 8px; }
      .an-gauge-name { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-mono); font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      .an-gauge-label { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-text-secondary); }
      .an-gauge { position: relative; width: 100%; height: 8px; border-radius: 3px; overflow: hidden; transform: skewX(-14deg);
        background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle); }
      .an-gauge-fill { position: absolute; inset: 0; transform-origin: left center; }
      .an-roots { margin: 2px 0 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-secondary); }

      /* ── Stage announcement ── */
      .an-stage { display: inline-flex; align-items: center; gap: 10px; margin: 0; padding: 5px 14px; border-radius: 6px; transform: skewX(-8deg);
        border: 1px solid var(--kz-border-subtle); border-left: 3px solid var(--kz-accent); background: var(--kz-surface-1); position: relative; overflow: hidden; }
      .an-stage > span { transform: skewX(8deg); }
      .an-stage-num { font-family: var(--font-mono); font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
      .an-stage-name { font-family: var(--font-mono); font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--kz-text-secondary); }
      .an-stage::after { content: ""; position: absolute; inset: 0; width: 40%; opacity: 0; pointer-events: none;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--kz-accent) 35%, transparent), transparent); }

      /* ── Boss gauge ── */
      .an-boss-gauge { display: grid; gap: 8px; max-width: 520px; margin: 18px auto 28px; }
      .an-boss-gauge-label { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--kz-text-secondary); text-align: center; }
      .an-boss-cells { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; padding: 3px; border-radius: 4px; transform: skewX(-14deg);
        border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-1); }
      .an-boss-cell { height: 10px; border-radius: 1px; opacity: .14; }

      /* ── Continue cabinet ── */
      .an-bezel { position: relative; max-width: 420px; margin: 44px auto 20px; padding: 16px; border-radius: 20px;
        background: var(--kz-surface-1); border: 1px solid var(--kz-border-strong); box-shadow: var(--kz-shadow-lg); }
      .an-bezel-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px; }
      .an-screw { width: 7px; height: 7px; border-radius: 50%; background: var(--kz-border-strong); }
      .an-bezel-label { font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-text-secondary); }
      .an-coin-deck { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 12px; padding: 8px 12px; margin-bottom: 12px;
        border-radius: 12px; background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle);
        font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
      .an-coin-lit { font-weight: 800; letter-spacing: .2em; }
      .an-coin-entry { color: var(--kz-text-secondary); }
      .an-credit { display: inline-flex; align-items: center; gap: 6px; color: var(--kz-text-secondary); }
      .an-credit-led { width: 6px; height: 6px; border-radius: 50%; background: var(--kz-success); }
      .an-crt { position: relative; overflow: hidden; border-radius: 14px; padding: 16px 20px; margin-bottom: 14px;
        background: var(--kz-surface-0); color: var(--kz-text-primary); border: 1px solid color-mix(in srgb, var(--kz-accent) 40%, transparent); }
      .an-crt-content { position: relative; display: flex; align-items: center; justify-content: space-between; }
      .an-crt-title { font-family: var(--font-mono); font-size: 14px; font-weight: 800; letter-spacing: .25em; text-transform: uppercase; }
      .an-crt-digit { display: inline-grid; place-items: center; min-width: 44px; height: 44px; border-radius: 8px;
        font-family: var(--font-mono); font-size: 26px; font-weight: 900;
        background: var(--kz-accent-soft); border: 1px solid color-mix(in srgb, var(--kz-accent) 35%, transparent); }
      .an-start { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 18px; border-radius: 12px;
        border: 1px solid var(--kz-border-strong); background: var(--kz-surface-2); color: var(--kz-text-primary);
        transition: transform .2s var(--kz-ease), border-color .2s ease; }
      .an-start:hover { border-color: var(--kz-accent); transform: translateY(-2px); }
      .an-start:active { transform: translateY(1px); }
      .an-start-key { font-family: var(--font-mono); font-size: 10.5px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; }
      .an-start-label { font-size: 13.5px; font-weight: 600; }
      .an-start-arrow { transition: transform .2s ease; }
      .an-start:hover .an-start-arrow { transform: translateY(-2px); }

      /* ════ Motion — only when the user hasn't asked for less ════ */
      @keyframes an-up { from { opacity: 0; transform: translateY(14px); } }
      @keyframes an-in-left { from { opacity: 0; transform: translateX(-32px); } }
      @keyframes an-lock { 0% { opacity: 0; transform: scale(1.6); } 70% { opacity: 1; transform: scale(.94); } 100% { opacity: .9; transform: scale(1); } }
      @keyframes an-slam { 0% { opacity: 0; transform: skewX(-8deg) scale(1.4); } 60% { opacity: 1; transform: skewX(-8deg) scale(.97); } 100% { opacity: 1; transform: skewX(-8deg) scale(1); } }
      @keyframes an-sweep { 0% { opacity: 0; transform: translateX(-120%); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateX(260%); } }
      @keyframes an-flash { 0% { opacity: .9; transform: scale(.7); } 100% { opacity: 0; transform: scale(1.45); } }
      @keyframes an-fill { from { transform: scaleX(0); } }
      @keyframes an-drain { from { opacity: 1; } }
      @keyframes an-stamp { 0% { opacity: 0; transform: scale(1.9) rotate(-10deg); } 70% { opacity: 1; transform: scale(.95) rotate(0); } 100% { opacity: 1; transform: none; } }
      @keyframes an-crt-on { 0% { opacity: 0; transform: scale(.7, .02); } 45% { opacity: 1; transform: scale(1, .02); } 100% { opacity: 1; transform: none; } }
      @keyframes an-scan { from { transform: translateY(0); } to { transform: translateY(450%); } }
      @keyframes an-breathe { from { opacity: .35; transform: scale(1); } to { opacity: .6; transform: scale(1.04); } }

      @media (prefers-reduced-motion: no-preference) {
        /* Loops: one per section, slow and faint, and only while the section is on screen. */
        .an-scan.an-loop::before { animation: an-scan 9s linear infinite; animation-play-state: paused; }
        .an-fighter-aura.an-loop { animation: an-breathe 6s ease-in-out 2.2s infinite alternate; animation-play-state: paused; }
        [data-live] .an-scan.an-loop::before, [data-live] .an-fighter-aura.an-loop { animation-play-state: running; }

        /* Hero select screen: visible at load, so it plays on mount (pure CSS, no observer needed).
           The slots come in, then the selection locks on each clan, left to right. */
        .an-slot { animation: an-up .6s var(--kz-ease) both; animation-delay: calc(.25s + var(--i) * .12s); }
        .an-corner { animation: an-lock .45s var(--kz-ease) both; animation-delay: calc(.9s + var(--i) * .28s); }
        .an-slot-aura { animation: an-breathe .6s ease-out calc(.9s + var(--i) * .28s) 2 alternate; }

        /* Below the hero: hidden only once the director is on, played once on data-in. */
        [data-motion="on"] [data-arena]:not([data-in]) :is(.an-fighter, .an-stage, .an-reveal, .an-boss-call, .an-boss-cell, .an-vat-stamp, .an-bird-in, .an-bezel-in) { opacity: 0; }

        [data-in] .an-fighter { animation: an-in-left .6s var(--kz-ease) both; }
        [data-in] .an-fighter-flash { animation: an-flash .7s ease-out .45s both; }
        [data-in] .an-gauge-fill { animation: an-fill 1.1s var(--kz-ease) .55s both; }
        [data-in] .an-stage { animation: an-slam .5s var(--kz-ease) .35s both; }
        [data-in] .an-stage::after { animation: an-sweep .7s ease-out .8s both; }
        [data-in] .an-reveal { animation: an-up .6s var(--kz-ease) .6s both; }

        [data-in] .an-boss-call { animation: an-slam .5s var(--kz-ease) both; }
        [data-in] .an-boss-cell { animation: an-drain .35s ease-out both; animation-delay: calc(.7s + var(--i) * .16s); }
        [data-in] .an-vat-stamp { animation: an-stamp .4s var(--kz-ease) both; animation-delay: calc(.7s + var(--i) * .16s); }

        [data-in] .an-bird-in { animation: an-up .55s var(--kz-ease) both; animation-delay: calc(var(--i) * .08s); }

        [data-in] .an-crt { animation: an-crt-on .6s var(--kz-ease) .2s both; }
      }

      @media (prefers-reduced-motion: reduce) {
        .an-slot-frame, .an-slot-mark, .an-fighter-disc, .an-fighter-mark, .an-start, .an-start-arrow { transition: none !important; }
        .an-slot:hover .an-slot-frame, .an-slot:hover .an-slot-mark, .an-fighter:hover .an-fighter-mark,
        .an-start:hover, .an-start:hover .an-start-arrow { transform: none !important; }
      }
    `}</style>
  );
}
