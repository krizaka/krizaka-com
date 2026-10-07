"use client";

/* Quiet nods for /story — the team grew up on the arcade fighting games of 1994–2000. Everything
   here is drawn for this site: no game asset, logo, character or sound. Two rival flames (orange,
   violet) rise as embers; the three sacred treasures of Japanese myth (sword, jewel, mirror — public
   domain) mark Orochia's chapter; a "3 vs 3" sweep joins the three names; the years scroll behind
   the eight heads; a "continue?" counts down at the very end. Decorative only (aria-hidden), tokens
   for surfaces, fixed mid-tone accents that read on both themes, and nothing moves under
   prefers-reduced-motion. */

import { useEffect, useState } from "react";

/* ── Embers: two flames, rising slowly behind the page ─────────────────────────────────────── */

const EMBERS = Array.from({ length: 22 }, (_, i) => {
  // Deterministic spread (no Math.random → identical server and client markup).
  const x = (i * 37 + 11) % 100;
  return {
    x,
    size: 2 + ((i * 7) % 4),
    delay: (i * 1.7) % 14,
    duration: 14 + ((i * 5) % 10),
    drift: ((i % 5) - 2) * 14,
    violet: i % 2 === 1,
  };
});

export function Embers() {
  return (
    <div className="an-embers" aria-hidden>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className={e.violet ? "is-violet" : undefined}
          style={{
            left: `${e.x}%`,
            width: e.size,
            height: e.size,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            ["--drift" as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── The three sacred treasures: sword, jewel (magatama), mirror ───────────────────────────── */

export function Treasures() {
  return (
    <div className="an-treasures" aria-hidden>
      <svg viewBox="0 0 48 48" width="34" height="34">
        <path d="M24 4 L27 30 L24 36 L21 30 Z" />
        <path d="M16 31 H32 M24 36 V44" />
      </svg>
      <svg viewBox="0 0 48 48" width="34" height="34">
        <path d="M30 10 a12 12 0 1 1 -14 18 a7 7 0 0 0 7 -8 a7 7 0 0 1 7 -10 Z" />
        <circle cx="29" cy="16" r="2.4" />
      </svg>
      <svg viewBox="0 0 48 48" width="34" height="34">
        <circle cx="24" cy="24" r="16" />
        <circle cx="24" cy="24" r="10" />
        <path d="M24 2 V6 M24 42 V46 M2 24 H6 M42 24 H46" />
      </svg>
    </div>
  );
}

/* ── 1994 → 2000, scrolling behind the eight heads ─────────────────────────────────────────── */

const YEARS = ["'94", "'95", "'96", "'97", "'98", "'99", "2000"];

export function YearsMarquee() {
  const run = [...YEARS, ...YEARS];
  return (
    <div className="an-years" aria-hidden>
      <div className="an-years-track">
        {run.map((y, i) => (
          <span key={i}>{y}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Continue? 9 … 0 — only while it is on screen, and never under reduced motion ──────────── */

export function ContinuePrompt({ label }: { label: string }) {
  const [n, setN] = useState(9);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setN((v) => (v === 0 ? 9 : v - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="an-continue" aria-hidden>
      {label} <b>{n}</b>
    </p>
  );
}

export function ArcadeStyles() {
  return (
    <style>{`
      .an-embers { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
      .an-embers span { position: absolute; bottom: -12px; border-radius: 50%; opacity: 0;
        background: #f97316; box-shadow: 0 0 10px 2px color-mix(in srgb, #f97316 55%, transparent);
        animation-name: an-rise; animation-timing-function: linear; animation-iteration-count: infinite; }
      .an-embers span.is-violet { background: #a855f7; box-shadow: 0 0 10px 2px color-mix(in srgb, #a855f7 55%, transparent); }
      @keyframes an-rise {
        0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
        12% { opacity: .55; }
        70% { opacity: .3; }
        100% { transform: translate3d(var(--drift), -105vh, 0) scale(.4); opacity: 0; }
      }
      html.light .an-embers span { opacity: 0; animation-name: an-rise-light; }
      @keyframes an-rise-light {
        0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
        12% { opacity: .35; }
        100% { transform: translate3d(var(--drift), -105vh, 0) scale(.4); opacity: 0; }
      }

      .an-treasures { display: flex; justify-content: center; gap: 22px; margin-top: 18px; }
      .an-treasures svg { fill: none; stroke: color-mix(in srgb, #d946ef 70%, var(--kz-text-muted)); stroke-width: 1.4;
        stroke-linecap: round; stroke-linejoin: round; opacity: .75; }
      .an-treasures svg:nth-child(2) circle { fill: currentColor; stroke: none; color: color-mix(in srgb, #d946ef 70%, var(--kz-text-muted)); }
      .an-treasures svg { animation: an-glint 6s ease-in-out infinite; }
      .an-treasures svg:nth-child(2) { animation-delay: 2s; }
      .an-treasures svg:nth-child(3) { animation-delay: 4s; }
      @keyframes an-glint { 0%, 80%, 100% { opacity: .55; } 88% { opacity: 1; filter: drop-shadow(0 0 6px color-mix(in srgb, #d946ef 60%, transparent)); } }

      .an-years { position: absolute; inset: 50% 0 auto; transform: translateY(-50%); overflow: hidden; pointer-events: none; z-index: 0;
        -webkit-mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
        mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent); }
      .an-years-track { display: flex; gap: 6vw; width: max-content; animation: an-scroll 60s linear infinite;
        font-family: var(--font-display), system-ui, sans-serif; font-weight: 800; font-size: clamp(64px, 11vw, 140px);
        letter-spacing: -.04em; color: transparent; -webkit-text-stroke: 1px var(--kz-border-default); opacity: .55; }
      @keyframes an-scroll { to { transform: translateX(-50%); } }

      .an-continue { margin: 26px 0 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .3em; text-transform: uppercase;
        color: var(--kz-text-muted); opacity: .6; }
      .an-continue b { display: inline-block; min-width: 1.2em; font-weight: 700; color: #f97316; }

      @media (prefers-reduced-motion: reduce) {
        .an-embers { display: none; }
        .an-treasures svg, .an-years-track { animation: none; }
      }
    `}</style>
  );
}
