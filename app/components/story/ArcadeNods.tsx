"use client";

/* ── Krizaka /story — King of Fighters 90s Arcade Heritage ─────────────────────────────
   Homage to the golden arcade fighting game era (1994–2000):
   Two rival flames (Solar Crimson Forge vs Deep Violet Moon Serpent),
   the Three Sacred Treasures (Kusanagi blade, Yata mirror, Yasakani magatama),
   "3 vs 3" team synergy, "STAGE 01..03" battle entrances, eight sealed heads of Orochi,
   and the iconic "CONTINUE?" screen.
   100% original artwork in SVG and CSS. Zero copyrighted assets.
   Calm by design: everything here is static — no canvas, no particles, no loops. The only motion
   is hover feedback, itself off under reduced motion. Dual theme safe (dark and light).
──────────────────────────────────────────────────────────────────────────────────────── */

import type React from "react";

/* ── The 3 vs 3 Team Synergy Arc in Hero ─────────────────────────────────────────────── */

export function ArcadeTeamBadge({ tag, synergy }: { tag?: string; synergy?: string }) {
  return (
    <div className="an-team-badge" aria-hidden>
      <span className="an-team-tag">{tag ?? "TEAM BATTLE · 3 VS 3"}</span>
      <span className="an-team-synergy">{synergy ?? "THE THREE SACRED CLANS"}</span>
    </div>
  );
}

/* ── Fighting Game Stage Badge (STAGE 01, STAGE 02, STAGE 03) ────────────────────────── */

export function ArcadeStageCut({ stage, name }: { stage: string; name: string }) {
  return (
    <div className="an-stage-cut" aria-hidden>
      <div className="an-stage-pill">
        <span className="an-stage-num">{stage}</span>
        <span className="an-stage-name">{name}</span>
        <span className="an-stage-slash" />
      </div>
    </div>
  );
}

/* ── The Three Sacred Treasures: Sword, Jewel (Magatama), Mirror ─────────────────────── */

export function Treasures() {
  return (
    <div className="an-treasures" aria-hidden>
      {/* 1. Kusanagi no Tsurugi — Totsuka Sacred Sword */}
      <div className="an-treasure-item group" title="Kusanagi no Tsurugi — The Sacred Sword">
        <div className="an-treasure-aura is-crimson" />
        <svg viewBox="0 0 48 48" width="38" height="38" className="an-svg-sword">
          <path d="M24 3 L27 28 L24 36 L21 28 Z" />
          <path d="M15 30 H33 M24 36 V45" />
          <path d="M24 10 L24 24" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* 2. Yasakani no Magatama — The Curved Jewel */}
      <div className="an-treasure-item group" title="Yasakani no Magatama — The Sacred Jewel">
        <div className="an-treasure-aura is-violet" />
        <svg viewBox="0 0 48 48" width="38" height="38" className="an-svg-jewel">
          <path d="M31 10 a13 13 0 1 1 -15 19 a8 8 0 0 0 8 -9 a8 8 0 0 1 7 -10 Z" />
          <circle cx="29" cy="17" r="2.8" />
        </svg>
      </div>

      {/* 3. Yata no Kagami — The Sacred Mirror */}
      <div className="an-treasure-item group" title="Yata no Kagami — The Eight-Span Mirror">
        <div className="an-treasure-aura is-gold" />
        <svg viewBox="0 0 48 48" width="38" height="38" className="an-svg-mirror">
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="11" />
          <circle cx="24" cy="24" r="5" opacity="0.5" />
          <path d="M24 2 V6 M24 42 V46 M2 24 H6 M42 24 H46" />
        </svg>
      </div>
    </div>
  );
}

/* ── Continue? 9 … 0 Arcade Countdown Cabinet Bezel ───────────────────────────────── */

export function ContinuePrompt({
  label,
  insertCoin,
  creditLabel,
  restartBtn,
}: {
  label: string;
  insertCoin?: string;
  creditLabel?: string;
  restartBtn?: string;
}) {
  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="an-bezel-wrap" aria-label="Neo-Geo Arcade Continue Prompt">
      <div className="an-bezel">
        {/* Bezel frame header with brass screws & specs */}
        <div className="an-bezel-top">
          <span className="an-screw" />
          <span className="an-mvs-badge">NEO·GEO MVS · 100-MEGA PRO-GEAR SPEC</span>
          <span className="an-screw" />
        </div>

        {/* Dual Coin Intake Slot & LED credit indicator */}
        <div className="an-coin-deck">
          <div className="an-coin-slot-unit">
            <span className="an-coin-lit-label">{insertCoin ?? "INSERT COIN"}</span>
            <span className="an-coin-entry">[ 25¢ / 100¥ ]</span>
          </div>
          <div className="an-credit-pill">
            <span className="an-credit-led" />
            <span>{creditLabel ?? "CREDIT 01"}</span>
          </div>
        </div>

        {/* CRT countdown display screen with scanlines */}
        <div className="an-crt-screen">
          <div className="an-crt-scanlines" />
          <div className="an-crt-content">
            <span className="an-crt-title">{label}</span>
            <span className="an-crt-digit">9</span>
          </div>
        </div>

        {/* Ergonomic Tactile 1P Start / Restart Button */}
        <button
          type="button"
          onClick={handleRestart}
          className="an-restart-bar group"
          aria-label={restartBtn ?? "Press to restart story"}
        >
          <span className="an-start-key">1P START</span>
          <span className="an-start-label">{restartBtn ?? "Press to restart story"}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" className="an-start-arrow" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── KOF '96 / '97 Three Sacred Clans Hero Marks ────────────────────────────────────── */

export function ClanHeroMarks({
  krizakaLogo,
  orazakaLogo,
  orochiaLogo,
  clans,
}: {
  krizakaLogo: React.ReactNode;
  orazakaLogo: React.ReactNode;
  orochiaLogo: React.ReactNode;
  clans?: {
    krizaka: string;
    orazaka: string;
    orochia: string;
  };
}) {
  return (
    <div className="an-clan-marks" aria-label="The Three Sacred Clans: Kusanagi, Yata, Yasakani">
      {/* Hyper-drive energy conduit bridging the 3 clans */}
      <div className="an-clan-bridge" aria-hidden>
        <span className="an-bridge-beam" />
      </div>

      <div className="an-clan-grid">
        {/* 1. KUSANAGI (Krizaka) — Ancestral Solar Crimson Fire */}
        <div
          className="an-clan-item is-kusanagi"
        >
          <div className="an-clan-flame-wrap">
            <div className="an-clan-aura is-kusanagi-aura" />
            <div className="an-flame-tongues is-crimson-flame" />
            <div className="an-clan-disc">{krizakaLogo}</div>
          </div>
          <div className="an-clan-meta">
            <span className="an-clan-badge is-crimson">KUSANAGI</span>
            <span className="an-clan-title">{clans?.krizaka ?? "Kusanagi · Solar Crimson Fire"}</span>
          </div>
        </div>

        {/* 2. YATA (Orazaka) — Sacred Golden Mirror */}
        <div
          className="an-clan-item is-yata"
        >
          <div className="an-clan-flame-wrap">
            <div className="an-clan-aura is-yata-aura" />
            <div className="an-mirror-halo" />
            <div className="an-clan-disc">{orazakaLogo}</div>
          </div>
          <div className="an-clan-meta">
            <span className="an-clan-badge is-gold">YATA</span>
            <span className="an-clan-title">{clans?.orazaka ?? "Yata · Sacred Golden Mirror"}</span>
          </div>
        </div>

        {/* 3. YASAKANI (Orochia) — Iori Yagami Violet Moon Serpent Fire */}
        <div
          className="an-clan-item is-yasakani"
        >
          <div className="an-clan-flame-wrap">
            <div className="an-clan-aura is-yasakani-aura" />
            <div className="an-flame-tongues is-violet-flame" />
            <div className="an-moon-crescent" />
            <div className="an-clan-disc">{orochiaLogo}</div>
          </div>
          <div className="an-clan-meta">
            <span className="an-clan-badge is-violet">YASAKANI</span>
            <span className="an-clan-title">{clans?.orochia ?? "Yasakani · Violet Moon Serpent"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Master Arcade Styles & Keyframes ────────────────────────────────────────────────── */

export function ArcadeStyles() {
  return (
    <style>{`
      /* Arcade Team Synergy Badge */
      .an-team-badge {
        display: inline-flex; align-items: center; gap: 8px; margin: 0 auto 16px;
        padding: 5px 14px; border-radius: 9999px;
        background: linear-gradient(90deg, rgba(249, 115, 22, 0.15), rgba(168, 85, 247, 0.15));
        border: 1px solid rgba(249, 115, 22, 0.3);
        box-shadow: 0 0 20px -4px rgba(249, 115, 22, 0.25);
      }
      .an-team-tag {
        font-family: var(--font-mono); font-size: 10px; font-weight: 800;
        letter-spacing: 0.2em; text-transform: uppercase;
        color: #f97316;
      }
      .an-team-synergy {
        font-family: var(--font-mono); font-size: 10px; font-weight: 700;
        letter-spacing: 0.15em; text-transform: uppercase;
        color: #a855f7;
      }

      /* Fighting Game Stage Cut */
      .an-stage-cut {
        display: flex; align-items: center; margin-bottom: 12px;
      }
      .an-stage-pill {
        position: relative; display: inline-flex; align-items: center; gap: 8px;
        padding: 4px 14px; border-radius: 6px;
        background: linear-gradient(135deg, color-mix(in srgb, var(--kz-surface-2) 90%, transparent), color-mix(in srgb, var(--kz-surface-0) 90%, transparent));
        border-left: 3px solid var(--kz-accent);
        border-top: 1px solid var(--kz-border-subtle);
        border-right: 1px solid var(--kz-border-subtle);
        border-bottom: 1px solid var(--kz-border-subtle);
        transform: skewX(-8deg);
        box-shadow: 0 2px 10px -2px rgba(0,0,0,0.3);
      }
      .an-stage-num {
        font-family: var(--font-mono); font-size: 11px; font-weight: 900;
        color: var(--kz-accent); letter-spacing: 0.15em;
        transform: skewX(8deg);
      }
      .an-stage-name {
        font-family: var(--font-display), system-ui, sans-serif; font-size: 11px; font-weight: 800;
        letter-spacing: 0.1em; text-transform: uppercase; color: var(--kz-text-secondary);
        transform: skewX(8deg);
      }
      .an-stage-slash {
        position: absolute; right: -8px; top: 0; bottom: 0; width: 4px;
        background: var(--kz-accent); opacity: 0.7; transform: skewX(-8deg);
      }

      /* Sacred Treasures with Radiant Energy */
      .an-treasures {
        display: flex; justify-content: center; align-items: center; gap: 28px; margin-top: 24px;
      }
      .an-treasure-item {
        position: relative; display: flex; align-items: center; justify-content: center;
        width: 48px; height: 48px; border-radius: 50%;
        background: color-mix(in srgb, var(--kz-surface-1) 85%, transparent);
        border: 1px solid var(--kz-border-subtle);
        transition: transform 0.3s ease, border-color 0.3s ease;
      }
      .an-treasure-item:hover {
        transform: translateY(-3px) scale(1.08);
        border-color: #d946ef;
      }
      .an-treasure-aura {
        position: absolute; inset: -4px; border-radius: 50%; opacity: 0;
        transition: opacity 0.3s ease; filter: blur(6px);
      }
      .an-treasure-aura.is-crimson { background: rgba(249, 115, 22, 0.4); }
      .an-treasure-aura.is-violet { background: rgba(168, 85, 247, 0.4); }
      .an-treasure-aura.is-gold { background: rgba(234, 179, 8, 0.4); }
      .an-treasure-item:hover .an-treasure-aura { opacity: 1; }

      .an-treasures svg {
        fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.6;
        transition: stroke 0.3s ease;
      }
      .an-svg-sword {
        stroke: #f97316; filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.4));
      }
      .an-svg-jewel {
        stroke: #a855f7; filter: drop-shadow(0 0 5px rgba(168, 85, 247, 0.4));
      }
      .an-svg-jewel circle {
        fill: #a855f7; stroke: none;
      }
      .an-svg-mirror {
        stroke: #eab308; filter: drop-shadow(0 0 5px rgba(234, 179, 8, 0.4));
      }
      /* Continue 9..0 Arcade Cabinet Bezel */
      .an-bezel-wrap {
        margin: 44px auto 20px; max-width: 420px; position: relative; z-index: 2;
      }
      .an-bezel {
        position: relative; padding: 16px; border-radius: 20px;
        background: linear-gradient(160deg, color-mix(in srgb, var(--kz-surface-2) 90%, transparent), color-mix(in srgb, var(--kz-surface-0) 90%, transparent));
        border: 1px solid var(--kz-border-strong);
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.08), 0 18px 40px -10px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(12px);
      }
      .an-bezel-top {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px;
      }
      .an-screw {
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--kz-border-strong); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6);
      }
      .an-mvs-badge {
        font-family: var(--font-mono); font-size: 8.5px; font-weight: 800; letter-spacing: 0.18em;
        text-transform: uppercase; color: var(--kz-text-muted);
      }
      .an-coin-deck {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px; margin-bottom: 12px; border-radius: 12px;
        background: color-mix(in srgb, var(--kz-surface-1) 80%, transparent);
        border: 1px solid var(--kz-border-subtle);
      }
      .an-coin-slot-unit {
        display: flex; align-items: center; gap: 8px;
      }
      .an-coin-lit-label {
        font-family: var(--font-mono); font-size: 10px; font-weight: 800;
        letter-spacing: 0.22em; text-transform: uppercase; color: #f97316;
        text-shadow: 0 0 8px rgba(249, 115, 22, 0.7);
      }
      .an-coin-entry {
        font-family: var(--font-mono); font-size: 10px; font-weight: 700;
        letter-spacing: 0.1em; color: var(--kz-text-muted);
      }
      .an-credit-pill {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: var(--font-mono); font-size: 10px; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase; color: var(--kz-text-secondary);
      }
      .an-credit-led {
        width: 6px; height: 6px; border-radius: 50%;
        background: #22c55e; box-shadow: 0 0 8px #22c55e;
      }
      .an-crt-screen {
        position: relative; overflow: hidden; border-radius: 14px;
        padding: 16px 20px; margin-bottom: 14px;
        background: #08090d; border: 1px solid rgba(249, 115, 22, 0.35);
        box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.9), 0 0 16px -4px rgba(249, 115, 22, 0.25);
      }
      .an-crt-scanlines {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%);
        background-size: 100% 4px; opacity: 0.75;
      }
      .an-crt-content {
        position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between;
      }
      .an-crt-title {
        font-family: var(--font-mono); font-size: 14px; font-weight: 800;
        letter-spacing: 0.25em; text-transform: uppercase; color: var(--kz-text-primary);
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }
      .an-crt-digit {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 44px; height: 44px; border-radius: 8px;
        font-family: var(--font-mono); font-size: 26px; font-weight: 900;
        color: #f97316; text-shadow: 0 0 14px rgba(249, 115, 22, 0.9), 0 0 28px rgba(249, 115, 22, 0.5);
        background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3);
      }
      .an-restart-bar {
        width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
        padding: 12px 18px; border-radius: 12px; border: 1px solid var(--kz-border-strong);
        background: var(--kz-surface-1); color: var(--kz-text-primary); cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .an-restart-bar:hover {
        background: color-mix(in srgb, var(--kz-surface-2) 90%, transparent);
        border-color: #f97316;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px -4px rgba(249, 115, 22, 0.3);
      }
      .an-restart-bar:active {
        transform: translateY(1px);
      }
      .an-start-key {
        font-family: var(--font-mono); font-size: 10.5px; font-weight: 900;
        letter-spacing: 0.16em; text-transform: uppercase;
        padding: 3px 8px; border-radius: 6px;
        background: #f97316; color: #000;
      }
      .an-start-label {
        font-size: 13.5px; font-weight: 600; color: var(--kz-text-primary);
      }
      .an-start-arrow {
        color: #f97316; transition: transform 0.2s ease;
      }
      .an-restart-bar:hover .an-start-arrow {
        transform: translateY(-2px);
      }

      /* ── KOF Three Sacred Clans Hero Marks ── */
      .an-clan-marks {
        position: relative; max-width: 680px; margin: 32px auto 0; padding: 20px 10px;
      }
      .an-clan-bridge {
        position: absolute; top: 58px; left: 14%; right: 14%; height: 2px;
        background: linear-gradient(90deg, rgba(249, 115, 22, 0.6) 0%, rgba(234, 179, 8, 0.7) 50%, rgba(168, 85, 247, 0.7) 100%);
        pointer-events: none; z-index: 0;
      }
      .an-bridge-beam {
        position: absolute; inset: -2px; border-radius: 2px;
        background: inherit; filter: blur(4px); opacity: 0.7;
      }
      .an-clan-grid {
        position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(12px, 3vw, 28px);
      }
      .an-clan-item {
        display: flex; flex-direction: column; align-items: center; text-align: center;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: default;
      }
      .an-clan-item:hover {
        transform: translateY(-4px);
      }
      .an-clan-flame-wrap {
        position: relative; width: 78px; height: 78px; display: flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
      }
      .an-clan-disc {
        position: relative; z-index: 2; width: 68px; height: 68px; border-radius: 50%;
        background: radial-gradient(circle at 50% 40%, var(--kz-surface-2), var(--kz-surface-0) 80%);
        border: 1.5px solid var(--kz-border-strong);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.4);
        transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
      }
      .an-clan-item:hover .an-clan-disc {
        transform: scale(1.08);
      }
      .an-clan-aura {
        position: absolute; inset: -10px; border-radius: 50%; pointer-events: none;
        opacity: 0.55; filter: blur(10px); transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .an-clan-item:hover .an-clan-aura {
        opacity: 0.95; transform: scale(1.25);
      }
      .is-kusanagi-aura {
        background: radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.3) 60%, transparent 80%);
      }
      .is-yata-aura {
        background: radial-gradient(circle, rgba(234, 179, 8, 0.6) 0%, rgba(202, 138, 4, 0.3) 60%, transparent 80%);
      }
      .is-yasakani-aura {
        background: radial-gradient(circle, rgba(168, 85, 247, 0.65) 0%, rgba(147, 51, 234, 0.35) 60%, transparent 80%);
      }
      .an-flame-tongues {
        position: absolute; inset: -14px; border-radius: 50%; pointer-events: none; opacity: 0.6;
      }
      .is-crimson-flame {
        box-shadow: 0 -8px 24px -2px rgba(249, 115, 22, 0.7);
      }
      .is-violet-flame {
        box-shadow: 0 -8px 26px -2px rgba(168, 85, 247, 0.75);
      }
      .an-mirror-halo {
        position: absolute; inset: -6px; border-radius: 50%; pointer-events: none;
        border: 1px dashed rgba(234, 179, 8, 0.6);
      }
      .an-moon-crescent {
        position: absolute; top: -6px; right: -4px; width: 14px; height: 14px; border-radius: 50%;
        box-shadow: 2px 2px 0 0 #c084fc; pointer-events: none; opacity: 0.8;
      }
      .an-clan-item.is-kusanagi:hover .an-clan-disc { border-color: #f97316; box-shadow: 0 0 24px rgba(249, 115, 22, 0.5); }
      .an-clan-item.is-yata:hover .an-clan-disc { border-color: #eab308; box-shadow: 0 0 24px rgba(234, 179, 8, 0.5); }
      .an-clan-item.is-yasakani:hover .an-clan-disc { border-color: #a855f7; box-shadow: 0 0 26px rgba(168, 85, 247, 0.55); }

      .an-clan-meta { display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .an-clan-badge {
        font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.16em;
        text-transform: uppercase; padding: 2px 8px; border-radius: 9999px;
      }
      .an-clan-badge.is-crimson { background: rgba(249, 115, 22, 0.15); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.35); }
      .an-clan-badge.is-gold { background: rgba(234, 179, 8, 0.15); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.35); }
      .an-clan-badge.is-violet { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.35); }
      .an-clan-title {
        font-family: var(--font-mono); font-size: 11px; font-weight: 600;
        color: var(--kz-text-secondary); line-height: 1.4; max-width: 170px;
      }

      @media (max-width: 600px) {
        .an-clan-title { font-size: 10px; }
        .an-clan-flame-wrap { width: 64px; height: 64px; }
        .an-clan-disc { width: 56px; height: 56px; }
      }

      /* Hover feedback only — nothing on this page moves on its own. */
      @media (prefers-reduced-motion: reduce) {
        .an-treasure-item, .an-clan-item, .an-clan-disc, .an-clan-aura, .an-restart-bar, .an-start-arrow { transition: none !important; }
        .an-treasure-item:hover, .an-clan-item:hover, .an-clan-item:hover .an-clan-disc, .an-clan-item:hover .an-clan-aura,
        .an-restart-bar:hover, .an-restart-bar:hover .an-start-arrow { transform: none !important; }
      }
    `}</style>
  );
}
