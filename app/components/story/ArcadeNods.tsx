"use client";

/* ── Krizaka /story — King of Fighters 90s Arcade Heritage ─────────────────────────────
   Homage to the golden arcade fighting game era (1994–2000):
   Two rival flames (Solar Crimson Forge vs Deep Violet Moon Serpent),
   the Three Sacred Treasures (Kusanagi blade, Yata mirror, Yasakani magatama),
   "3 vs 3" team synergy, "STAGE 01..03" battle entrances, eight sealed heads of Orochi,
   and the iconic countdown "CONTINUE? 9… 0".
   100% original procedural artwork, shaders and CSS. Zero copyrighted assets.
   Tokens only, dual theme safe (dark and light), reduced-motion respectful.
──────────────────────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";

/* ── Interactive Arcade Flame & Embers Canvas ───────────────────────────────────────── */

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  hue: "crimson" | "violet" | "gold";
  wobbleSpeed: number;
  wobbleAmp: number;
}

export function ArcadeFlameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: FlameParticle[] = [];
    const maxParticles = Math.min(48, Math.floor(width / 28));

    const mouse = { x: width / 2, y: height / 2, moved: false };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moved = true;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn arcade spark burst on click
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 2 + Math.random() * 3,
          alpha: 1,
          maxLife: 40 + Math.random() * 30,
          life: 0,
          hue: i % 2 === 0 ? "crimson" : "violet",
          wobbleSpeed: 0.1,
          wobbleAmp: 0.5,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    function createParticle(fromBottom = true): FlameParticle {
      const isViolet = Math.random() > 0.45;
      const isGold = !isViolet && Math.random() > 0.6;
      const hue = isGold ? "gold" : isViolet ? "violet" : "crimson";
      
      // Solar crimson leans slightly left, violet serpent leans slightly right
      let x = Math.random() * width;
      if (hue === "crimson") x = Math.random() * (width * 0.65);
      if (hue === "violet") x = width * 0.35 + Math.random() * (width * 0.65);

      return {
        x,
        y: fromBottom ? height + Math.random() * 20 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(1.2 + Math.random() * 2.2),
        size: 2 + Math.random() * 3.5,
        alpha: 0.3 + Math.random() * 0.6,
        maxLife: 120 + Math.random() * 90,
        life: 0,
        hue,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmp: 0.8 + Math.random() * 1.5,
      };
    }

    // Pre-populate
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(false));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Manage particle pool
      while (particles.length < maxParticles) {
        particles.push(createParticle(true));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmp;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        let currentAlpha = p.alpha;
        if (progress < 0.15) currentAlpha = (progress / 0.15) * p.alpha;
        else if (progress > 0.7) currentAlpha = (1 - (progress - 0.7) / 0.3) * p.alpha;

        if (p.life >= p.maxLife || p.y < -30) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

        let colorCore = "#ffffff";
        let colorGlow = "#f97316";

        if (p.hue === "crimson") {
          colorCore = "#ffedd5";
          colorGlow = "rgba(249, 115, 22, 0.8)";
        } else if (p.hue === "violet") {
          colorCore = "#f3e8ff";
          colorGlow = "rgba(168, 85, 247, 0.8)";
        } else {
          colorCore = "#fef08a";
          colorGlow = "rgba(234, 179, 8, 0.8)";
        }

        // Particle Glow
        const rad = p.size * 2.8;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        grad.addColorStop(0, colorCore);
        grad.addColorStop(0.4, colorGlow);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80 light:opacity-50"
    />
  );
}

/* ── Fallback Embers Component ───────────────────────────────────────────────────────── */

const EMBERS = Array.from({ length: 28 }, (_, i) => {
  const x = (i * 37 + 11) % 100;
  return {
    x,
    size: 2 + ((i * 7) % 4),
    delay: (i * 1.5) % 12,
    duration: 12 + ((i * 5) % 8),
    drift: ((i % 5) - 2) * 18,
    violet: i % 2 === 1,
    gold: i % 5 === 0,
  };
});

export function Embers() {
  return (
    <>
      <ArcadeFlameCanvas />
      <div className="an-embers" aria-hidden>
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className={e.gold ? "is-gold" : e.violet ? "is-violet" : undefined}
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
    </>
  );
}

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

/* ── 1994 → 2000 Golden Arcade Marquee ──────────────────────────────────────────────── */

const YEARS = ["'94", "'95", "'96", "'97", "'98", "'99", "2000"];

export function YearsMarquee() {
  const run = [...YEARS, ...YEARS];
  return (
    <div className="an-years" aria-hidden>
      <div className="an-years-track">
        {run.map((y, i) => (
          <span key={i} className="an-year-node">
            <span className="an-year-text">{y}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Continue? 9 … 0 Arcade Countdown ───────────────────────────────────────────────── */

export function ContinuePrompt({ label, insertCoin }: { label: string; insertCoin?: string }) {
  const [n, setN] = useState(9);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setN((v) => (v === 0 ? 9 : v - 1));
      setPulsing(true);
      setTimeout(() => setPulsing(false), 300);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="an-continue-wrap" aria-hidden>
      <button type="button" onClick={handleRestart} className="an-continue-btn group">
        <span className="an-coin-slot">{insertCoin ?? "INSERT COIN"}</span>
        <p className="an-continue">
          {label} <b className={pulsing ? "is-pulse" : ""}>{n}</b>
        </p>
      </button>
    </div>
  );
}

/* ── Master Arcade Styles & Keyframes ────────────────────────────────────────────────── */

export function ArcadeStyles() {
  return (
    <style>{`
      /* Floating Embers */
      .an-embers { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
      .an-embers span {
        position: absolute; bottom: -12px; border-radius: 50%; opacity: 0;
        background: #f97316;
        box-shadow: 0 0 12px 3px rgba(249, 115, 22, 0.7);
        animation-name: an-rise; animation-timing-function: linear; animation-iteration-count: infinite;
      }
      .an-embers span.is-violet {
        background: #a855f7;
        box-shadow: 0 0 12px 3px rgba(168, 85, 247, 0.7);
      }
      .an-embers span.is-gold {
        background: #eab308;
        box-shadow: 0 0 12px 3px rgba(234, 179, 8, 0.7);
      }
      @keyframes an-rise {
        0% { transform: translate3d(0, 0, 0) scale(0.8); opacity: 0; }
        15% { opacity: 0.75; }
        70% { opacity: 0.45; }
        100% { transform: translate3d(var(--drift), -105vh, 0) scale(0.3); opacity: 0; }
      }
      html.light .an-embers span { opacity: 0; animation-name: an-rise-light; }
      @keyframes an-rise-light {
        0% { transform: translate3d(0, 0, 0) scale(0.8); opacity: 0; }
        15% { opacity: 0.45; }
        100% { transform: translate3d(var(--drift), -105vh, 0) scale(0.3); opacity: 0; }
      }

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
      .an-treasures svg { animation: an-glint 5s ease-in-out infinite; }
      .an-treasure-item:nth-child(2) svg { animation-delay: 1.6s; }
      .an-treasure-item:nth-child(3) svg { animation-delay: 3.2s; }
      @keyframes an-glint {
        0%, 80%, 100% { opacity: 0.75; transform: scale(1); }
        88% { opacity: 1; transform: scale(1.12); filter: drop-shadow(0 0 10px currentColor); }
      }

      /* 1994-2000 Marquee */
      .an-years {
        position: absolute; inset: 50% 0 auto; transform: translateY(-50%);
        overflow: hidden; pointer-events: none; z-index: 0;
        -webkit-mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
        mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
      }
      .an-years-track {
        display: flex; gap: 5vw; width: max-content; animation: an-scroll 50s linear infinite;
        font-family: var(--font-display), system-ui, sans-serif; font-weight: 900;
        font-size: clamp(68px, 12vw, 150px); letter-spacing: -0.05em;
        color: transparent; -webkit-text-stroke: 1.5px var(--kz-border-strong);
        opacity: 0.45;
      }
      @keyframes an-scroll { to { transform: translateX(-50%); } }

      /* Continue 9..0 Countdown Button */
      .an-continue-wrap {
        margin: 32px 0 0; display: flex; justify-content: center;
      }
      .an-continue-btn {
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        background: transparent; border: none; cursor: pointer; padding: 12px 24px;
        border-radius: 16px; transition: transform 0.2s ease, background 0.2s ease;
      }
      .an-continue-btn:hover {
        background: color-mix(in srgb, var(--kz-surface-2) 40%, transparent);
        transform: scale(1.05);
      }
      .an-coin-slot {
        font-family: var(--font-mono); font-size: 10px; font-weight: 800;
        letter-spacing: 0.25em; text-transform: uppercase; color: #f97316;
        animation: an-blink 1.2s infinite;
      }
      @keyframes an-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.3; } }
      .an-continue {
        margin: 0; font-family: var(--font-mono); font-size: 13px; font-weight: 700;
        letter-spacing: 0.2em; text-transform: uppercase; color: var(--kz-text-muted);
      }
      .an-continue b {
        display: inline-block; min-width: 1.2em; font-weight: 900; font-size: 18px;
        color: #f97316; text-shadow: 0 0 10px rgba(249, 115, 22, 0.6);
        transition: transform 0.15s ease;
      }
      .an-continue b.is-pulse {
        transform: scale(1.3);
      }

      @media (prefers-reduced-motion: reduce) {
        .an-embers, .an-flame-canvas { display: none; }
        .an-treasures svg, .an-years-track, .an-coin-slot { animation: none !important; }
      }
    `}</style>
  );
}
