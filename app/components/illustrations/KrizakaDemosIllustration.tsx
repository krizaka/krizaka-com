"use client";

export default function KrizakaDemosIllustration() {

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "280px",
        borderRadius: "var(--kz-radius-lg)",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Blueprint Grid Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          {/* Hologram projection gradient */}
          <radialGradient id="holo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Sun background glow */}
          <radialGradient id="illustration-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backdrop Sun & Mountains */}
        <circle cx="250" cy="120" r="140" fill="url(#illustration-sun)" />
        <path d="M 80 230 L 190 120 L 300 230 Z" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="0.8" opacity="0.3" />
        <path d="M 240 230 L 350 110 L 460 230 Z" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="0.8" opacity="0.3" />

        {/* ─── WINDING DATA STREAM (Middle ground) ─── */}
        <path
          d="M 120 230 C 180 230, 220 200, 250 200 C 280 200, 320 230, 380 230"
          fill="none"
          stroke="var(--kz-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
          style={{ strokeDasharray: "10, 10" }}
        />

        {/* ─── DEVELOPER DUCK MASCOT (Sitting in Center) ─── */}
        <g
          transform="translate(225, 120)"
          className="mascot-bird developer-duck-illustration"
          style={{ pointerEvents: "auto", cursor: "pointer" }}
        >
          {/* Sitting body */}
          <path
            d="M 5 45 C 5 30, 45 30, 45 45 C 45 62, 38 72, 25 72 C 12 72, 5 62, 5 45 Z"
            fill="hsl(343, 90%, 60%)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.5"
          />
          {/* Belly light */}
          <path
            d="M 12 48 C 12 40, 38 40, 38 48 C 38 60, 32 64, 25 64 C 18 64, 12 60, 12 48 Z"
            fill="hsl(343, 90%, 75%)"
            opacity="0.85"
          />

          {/* Wings typing */}
          <path
            d="M -2 40 C -8 46, -4 55, 10 52"
            fill="none"
            stroke="hsl(343, 85%, 50%)"
            strokeWidth="8"
            strokeLinecap="round"
            className="wing-left-type-ill"
          />
          <path
            d="M 52 40 C 58 46, 54 55, 40 52"
            fill="none"
            stroke="hsl(343, 85%, 50%)"
            strokeWidth="8"
            strokeLinecap="round"
            className="wing-right-type-ill"
          />

          {/* Head */}
          <g className="head-group-ill" style={{ transformOrigin: "25px 32px" }}>
            <circle cx="25" cy="24" r="16" fill="hsl(343, 90%, 60%)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
            {/* Beak */}
            <path
              d="M 12 24 C 12 20, 22 18, 25 18 C 28 18, 38 20, 38 24 C 38 28, 28 32, 25 32 C 22 32, 12 28, 12 24 Z"
              fill="hsl(38, 95%, 55%)"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.2"
            />
            {/* Eyes & Glasses */}
            <circle cx="19" cy="16" r="2" fill="var(--kz-text-primary)" />
            <circle cx="31" cy="16" r="2" fill="var(--kz-text-primary)" />
            <circle cx="19" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <circle cx="31" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <line x1="23.5" y1="16" x2="26.5" y2="16" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          </g>

          {/* Laptop */}
          <g transform="translate(10, 52)">
            <polygon points="-8,16 38,16 30,22 -14,22" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <polygon points="-4,14 34,14 30,-2 -8,-2" fill="var(--kz-accent-soft)" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.8" className="laptop-screen-ill" />
          </g>
        </g>

        {/* ─── HOLOGRAPHIC FLOATING MODULES (Popping from laptop) ─── */}
        <g transform="translate(250, 150)">
          {/* Hologram base light cone */}
          <polygon points="-10,20 -60,-60 60,-60" fill="url(#holo-glow)" opacity="0.4" />

          {/* Floating UI Elements (Dashed boxes & icons) */}
          {/* Bubble Chat Widget (Top-Left) */}
          <g className="floating-ui-1" opacity="0.85">
            <rect x="-70" y="-70" width="45" height="24" rx="6" fill="var(--kz-surface-2)" stroke="var(--kz-accent)" strokeWidth="1" />
            {/* Small text lines inside */}
            <line x1="-62" y1="-60" x2="-35" y2="-60" stroke="var(--kz-text-muted)" strokeWidth="1.5" />
            <line x1="-62" y1="-54" x2="-45" y2="-54" stroke="var(--kz-text-muted)" strokeWidth="1.5" />
          </g>

          {/* Code brackets Widget (Center-Top) */}
          <g className="floating-ui-2" opacity="0.85">
            <rect x="-15" y="-95" width="30" height="24" rx="6" fill="var(--kz-surface-2)" stroke="var(--kz-accent)" strokeWidth="1" />
            {/* Code bracket symbol: < /> */}
            <path d="M -7 -86 L -11 -83 L -7 -80 M 7 -86 L 11 -83 L 7 -80 M 2 -88 L -2 -78" stroke="var(--kz-accent)" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Settings Vector Stack Widget (Right) */}
          <g className="floating-ui-3" opacity="0.85">
            <rect x="25" y="-60" width="40" height="24" rx="6" fill="var(--kz-surface-2)" stroke="var(--kz-accent)" strokeWidth="1" />
            <circle cx="37" cy="-48" r="4.5" fill="none" stroke="var(--kz-text-secondary)" strokeWidth="1" />
            <line x1="45" y1="-48" x2="58" y2="-48" stroke="var(--kz-text-muted)" strokeWidth="1.5" />
          </g>

          {/* Floating particle stars */}
          <circle cx="-35" cy="-80" r="1.5" fill="var(--kz-accent)" className="star-flicker-1" />
          <circle cx="20" cy="-75" r="2" fill="var(--kz-accent)" className="star-flicker-2" />
        </g>
      </svg>

      <style>{`
        /* --- Duck typing animations --- */
        .developer-duck-illustration {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .developer-duck-illustration:hover {
          transform: scale(1.05) translateY(-3px);
        }
        .developer-duck-illustration:hover .head-group-ill {
          animation: duck-look-ill 1.4s ease infinite;
        }
        .developer-duck-illustration:hover .wing-left-type-ill {
          animation: wing-type-l-ill 0.12s ease infinite;
        }
        .developer-duck-illustration:hover .wing-right-type-ill {
          animation: wing-type-r-ill 0.12s ease infinite;
        }
        .developer-duck-illustration:hover .laptop-screen-ill {
          fill: var(--kz-accent-soft);
          filter: drop-shadow(0 0 6px var(--kz-accent));
        }

        @keyframes duck-look-ill {
          0%, 100% { transform: rotate(0deg); }
          30%      { transform: rotate(-7deg); }
          70%      { transform: rotate(7deg); }
        }
        @keyframes wing-type-l-ill {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px) translateX(1px); }
        }
        @keyframes wing-type-r-ill {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px) translateX(-1px); }
        }

        /* --- Floating UI widgets animation --- */
        @keyframes float-ui-widget-1 {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-ui-widget-2 {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50%      { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes float-ui-widget-3 {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50%      { transform: translateY(-6px) rotate(-1deg); }
        }
        .floating-ui-1 { animation: float-ui-widget-1 3.5s ease-in-out infinite; }
        .floating-ui-2 { animation: float-ui-widget-2 4.2s ease-in-out infinite 0.5s; }
        .floating-ui-3 { animation: float-ui-widget-3 3.8s ease-in-out infinite 1s; }

        @keyframes star-flicker {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
        .star-flicker-1 { animation: star-flicker 2s ease infinite; }
        .star-flicker-2 { animation: star-flicker 2s ease infinite 1s; }
      `}</style>
    </div>
  );
}
