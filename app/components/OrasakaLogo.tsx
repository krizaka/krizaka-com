"use client";

/* ─────────────────────────────────────────────────────────────────────
   OrasakaLogo — animated isotype for the flagship product Orasaka.
   Faithful to public/assets/orasaka/orasaka/orasaka.svg: a 3-fragment
   hexagonal assembly (two neutral structural shards + one amber signature
   shard) rotating around a pulsing amber core, framed by dashed precision
   guides. The wordmark is dropped here — the banner H2 already reads
   "Orasaka", so only the symbol sits in the square slot.

   Neutral structure uses var(--kz-*) tokens so it reads in dark AND light;
   amber is the fixed product-identity accent. Reduced-motion safe via the
   global prefers-reduced-motion rule in globals.css.
   ───────────────────────────────────────────────────────────────────── */

export default function OrasakaLogo({ size = 220, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`oz-logo ${className}`}
      role="img"
      aria-label="Orasaka"
    >
      <defs>
        {/* Amber signature gradient — Orasaka identity */}
        <linearGradient id="ozAmber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Discreet warm halo behind the core */}
        <radialGradient id="ozHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(80, 80)">
        {/* Warm ambient halo — discreet, seats the amber mark on the blue site */}
        <circle cx="0" cy="0" r="58" fill="url(#ozHalo)" className="oz-halo" style={{ transformBox: "fill-box", transformOrigin: "center" }} />

        {/* Precision infrastructure guides */}
        <circle cx="0" cy="0" r="62" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
        <circle cx="0" cy="0" r="48" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.35" />

        {/* Hexagonal shard assembly — slow rotation */}
        <g className="oz-orbit" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {/* Upper fragment (neutral) */}
          <path
            d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2"
            fill="none"
            stroke="var(--kz-text-muted)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lower-left fragment (neutral) */}
          <path
            d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2"
            fill="none"
            stroke="var(--kz-text-secondary)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lower-right fragment — Orasaka amber signature */}
          <path
            d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2"
            fill="none"
            stroke="url(#ozAmber)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Luminous amber core — pulse */}
        <circle cx="0" cy="0" r="10" fill="url(#ozAmber)" className="oz-core" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      </g>

      {/* Local animations (neutralized under prefers-reduced-motion via globals.css) */}
      <style>{`
        @keyframes oz-orbit { to { transform: rotate(360deg); } }
        @keyframes oz-core-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.92; filter: drop-shadow(0 0 4px rgba(245,158,11,0.45)); }
          50%      { transform: scale(1.15); opacity: 1;    filter: drop-shadow(0 0 14px rgba(245,158,11,0.7)); }
        }
        @keyframes oz-halo-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1);    }
          50%      { opacity: 1;   transform: scale(1.08); }
        }
        .oz-orbit { animation: oz-orbit 35s linear infinite; }
        .oz-core  { animation: oz-core-pulse 2.5s ease-in-out infinite; }
        .oz-halo  { animation: oz-halo-pulse 4s ease-in-out infinite; }
      `}</style>
    </svg>
  );
}
