"use client";

export default function KrizakaComplianceIllustration() {
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
          {/* Glowing Shield Dome */}
          <radialGradient id="shield-dome-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
          </radialGradient>

          {/* Cloud Threat Gradient */}
          <linearGradient id="cloud-threat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--kz-status-error)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Server Node Gradient */}
          <linearGradient id="server-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--kz-surface-3)" />
            <stop offset="100%" stopColor="var(--kz-surface-2)" />
          </linearGradient>
        </defs>

        {/* Background Mountain Contours (Trace from Hero) */}
        <path d="M 50 240 L 150 140 L 250 240 Z" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="0.8" opacity="0.3" />
        <path d="M 220 240 L 320 120 L 420 240 Z" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="0.8" opacity="0.3" />

        {/* ─── OUTSIDE: Cloud Threats (GDPR/Law 25 Audit Pressure) ─── */}
        <g transform="translate(60, 40)" opacity="0.8">
          {/* Cloud symbol */}
          <path d="M 10 20 C 10 10, 25 5, 35 12 C 42 2, 60 5, 62 15 C 70 15, 75 25, 70 32 C 65 38, 15 38, 10 32 C 5 28, 5 22, 10 20 Z" fill="url(#cloud-threat)" stroke="var(--kz-status-error)" strokeWidth="1" opacity="0.6" />
          
          {/* Animated incoming packet ray (Stops at shield) */}
          <path d="M 50 35 L 120 115" stroke="var(--kz-status-error)" strokeWidth="2" strokeDasharray="6,6" opacity="0.6" className="threat-ray-1" />
          <circle cx="120" cy="115" r="4" fill="var(--kz-status-error)" opacity="0.8" className="threat-burst" />
        </g>

        {/* ─── SOVEREIGN SHIELD DOME (Local Infrastructure Boundary) ─── */}
        <g transform="translate(250, 180)" className="sovereign-dome" style={{ pointerEvents: "auto", cursor: "pointer" }}>
          {/* Semi-transparent shield overlay */}
          <path d="M -130 60 A 130 130 0 0 1 130 60 Z" fill="url(#shield-dome-grad)" stroke="#10b981" strokeWidth="2" strokeDasharray="5,3" className="dome-pulse" />
          <line x1="-130" y1="60" x2="130" y2="60" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />

          {/* Secure database stacks inside the shield */}
          <g transform="translate(-40, 10)">
            <rect x="-25" y="0" width="50" height="12" rx="2" fill="url(#server-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <rect x="-25" y="16" width="50" height="12" rx="2" fill="url(#server-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <rect x="-25" y="32" width="50" height="12" rx="2" fill="url(#server-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            {/* LED indicators */}
            <circle cx="-16" cy="6" r="1.2" fill="#10b981" />
            <circle cx="-16" cy="22" r="1.2" fill="#10b981" />
            <circle cx="-16" cy="38" r="1.2" fill="#10b981" />
            <circle cx="16" cy="6" r="1.2" fill="var(--kz-accent)" />
            <circle cx="16" cy="22" r="1.2" fill="var(--kz-accent)" />
            <circle cx="16" cy="38" r="1.2" fill="var(--kz-accent)" />
          </g>

          {/* Local storage vault (Hexagon) */}
          <g transform="translate(40, 26)">
            <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="var(--kz-surface-3)" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4" fill="#10b981" className="vault-glow" />
          </g>

          {/* Secure localized data flows */}
          <path d="M -40 26 C -20 45, 0 45, 20 26" fill="none" stroke="var(--kz-accent)" strokeWidth="1.5" strokeDasharray="4,4" className="local-flow" />
        </g>

        {/* ─── MASCOT SENTRY FALCON (Guarding on Left console) ─── */}
        <g transform="translate(60, 150)" className="mascot-bird falcon-sentry" style={{ pointerEvents: "auto", cursor: "pointer" }}>
          {/* Leg console box */}
          <rect x="0" y="70" width="46" height="24" rx="4" fill="var(--kz-surface-2)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          <circle cx="12" cy="82" r="2" fill="var(--kz-accent)" />
          <circle cx="20" cy="82" r="2" fill="#10b981" />
          <line x1="28" y1="82" x2="38" y2="82" stroke="var(--kz-border-subtle)" strokeWidth="1.5" />

          {/* Legs */}
          <line x1="16" y1="52" x2="16" y2="70" stroke="var(--kz-accent)" strokeWidth="2.5" />
          <line x1="30" y1="52" x2="30" y2="70" stroke="var(--kz-accent)" strokeWidth="2.5" />

          {/* Falcon Body */}
          <path
            d="M 5 25 C 5 12, 41 12, 41 25 C 41 44, 34 52, 23 52 C 12 52, 5 44, 5 25 Z"
            fill="hsl(28, 95%, 53%)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
          />
          {/* Belly */}
          <path d="M 12 28 C 12 20, 34 20, 34 28 C 34 38, 29 44, 23 44 C 17 44, 12 38, 12 28 Z" fill="hsl(28, 95%, 68%)" opacity="0.8" />

          {/* Falcon wings */}
          <path d="M 3 20 C -4 28, -2 44, 8 42" fill="none" stroke="hsl(28, 90%, 45%)" strokeWidth="4" strokeLinecap="round" className="falcon-wing-sentry" />
          <path d="M 43 20 C 50 28, 48 44, 38 42" fill="none" stroke="hsl(28, 90%, 45%)" strokeWidth="4" strokeLinecap="round" className="falcon-wing-sentry" />

          {/* Head */}
          <g className="head-group-sentry" style={{ transformOrigin: "23px 20px" }}>
            <circle cx="23" cy="14" r="14" fill="hsl(28, 95%, 53%)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <polygon points="19,16 27,16 23,26" fill="hsl(38, 95%, 55%)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            {/* Glasses */}
            <rect x="10" y="6" width="26" height="8" rx="2.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="16" cy="10" r="2" fill="var(--kz-accent)" />
            <circle cx="30" cy="10" r="2" fill="var(--kz-accent)" />
          </g>

          {/* Sentry Scan Laser Cone */}
          <polygon points="23,16 110,80 110,130" fill="var(--kz-accent-soft)" opacity="0" className="falcon-scan" style={{ pointerEvents: "none" }} />
        </g>
      </svg>

      <style>{`
        /* --- Shield Pulse Animation --- */
        @keyframes dome-pulsate {
          0%, 100% { opacity: 0.85; stroke-width: 2px; filter: drop-shadow(0 0 2px #10b981); }
          50%      { opacity: 1; stroke-width: 2.5px; filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4)); }
        }
        .sovereign-dome:hover .dome-pulse {
          animation: dome-pulsate 1.8s ease-in-out infinite;
        }

        /* --- Secure Vault Glow --- */
        @keyframes vault-glow-pulsate {
          0%, 100% { filter: drop-shadow(0 0 1px #10b981); opacity: 0.8; }
          50%      { filter: drop-shadow(0 0 5px #10b981); opacity: 1; }
        }
        .sovereign-dome:hover .vault-glow {
          animation: vault-glow-pulsate 1.2s ease-in-out infinite;
        }

        /* --- Local Data Flow Dash --- */
        @keyframes flow-dash {
          to { strokeDashoffset: -20; }
        }
        .local-flow {
          animation: flow-dash 1.2s linear infinite;
        }

        /* --- Cloud Threat Ray flow --- */
        @keyframes ray-flow {
          0% { strokeDashoffset: 24; opacity: 0.2; }
          50% { opacity: 0.7; }
          100% { strokeDashoffset: 0; opacity: 0.2; }
        }
        .threat-ray-1 {
          animation: ray-flow 3s linear infinite;
        }

        @keyframes burst-glow {
          0%, 100% { transform: scale(0.9); opacity: 0.4; }
          50%      { transform: scale(1.3); opacity: 0.8; }
        }
        .threat-burst {
          animation: burst-glow 1.5s ease-in-out infinite;
          transform-origin: 120px 115px;
        }

        /* --- Falcon Guard Sentry animations --- */
        .falcon-sentry {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .falcon-sentry:hover {
          transform: scale(1.05) translateY(-3px);
        }
        .falcon-sentry:hover .head-group-sentry {
          animation: guard-look 1.8s ease-in-out infinite;
        }
        .falcon-sentry:hover .falcon-wing-sentry {
          animation: wing-shiver 0.15s ease infinite;
        }
        .falcon-sentry:hover .falcon-scan {
          animation: scan-flicker-compliance 1.4s ease-in-out infinite;
        }

        @keyframes guard-look {
          0%, 100% { transform: rotate(0); }
          25%      { transform: rotate(-8deg) translateY(-1px); }
          75%      { transform: rotate(8deg) translateY(-1px); }
        }
        @keyframes wing-shiver {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
        @keyframes scan-flicker-compliance {
          0%, 100% { opacity: 0; }
          30%, 70% { opacity: 0.18; }
          50%      { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
