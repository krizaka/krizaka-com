"use client";

export default function KrizakaLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Primary accent gradient */}
        <linearGradient id="primaryBlue" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--kz-accent)" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        {/* Secondary steel/text gradient */}
        <linearGradient id="steelGrey" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--kz-text-secondary)" />
          <stop offset="100%" stopColor="var(--kz-text-muted)" />
        </linearGradient>

        {/* Core radial glow */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
          <stop offset="35%" stopColor="var(--kz-accent)" stopOpacity="0.7" />
          <stop offset="65%" stopColor="var(--kz-accent-soft)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--kz-surface-0)" stopOpacity="0" />
        </radialGradient>

        {/* Outer ambient glow */}
        <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--kz-surface-0)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(20, 20)">
        {/* Ambient background glow */}
        <circle cx="180" cy="180" r="170" fill="url(#ambientGlow)" />

        {/* Outer orbit — dashed rotating ring */}
        <circle
          cx="180"
          cy="180"
          r="160"
          fill="none"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          className="logo-spin"
          style={{ transformOrigin: "180px 180px" }}
          opacity="0.6"
        />

        {/* Middle orbit — solid fine ring */}
        <circle
          cx="180"
          cy="180"
          r="130"
          fill="none"
          stroke="var(--kz-border-default)"
          strokeWidth="1"
          opacity="0.35"
        />

        {/* Inner orbit — dotted ring */}
        <circle
          cx="180"
          cy="180"
          r="100"
          fill="none"
          stroke="var(--kz-border-subtle)"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.3"
        />

        {/* Neural connection lines (subtle) */}
        <line x1="180" y1="20" x2="180" y2="80" stroke="var(--kz-border-strong)" strokeWidth="0.5" opacity="0.2" />
        <line x1="320" y1="100" x2="260" y2="140" stroke="var(--kz-border-strong)" strokeWidth="0.5" opacity="0.2" />
        <line x1="40" y1="100" x2="100" y2="140" stroke="var(--kz-border-strong)" strokeWidth="0.5" opacity="0.2" />

        {/* Core luminous halo */}
        <circle cx="180" cy="180" r="55" fill="url(#coreGlow)" className="logo-pulse" style={{ transformOrigin: "180px 180px" }} />

        {/* HEXAGONAL SHIELD — outer frame (blue) */}
        <path
          d="M180,80 L255,120 L255,200 L180,240 L105,200 L105,120 Z"
          fill="none"
          stroke="url(#primaryBlue)"
          strokeWidth="3"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Inner hexagonal frame (steel) */}
        <path
          d="M180,105 L235,133 L235,187 L180,215 L125,187 L125,133 Z"
          fill="none"
          stroke="url(#steelGrey)"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.5"
        />

        {/* Upper-right angular claw — sovereignty arm (blue) */}
        <path
          d="M255,120 L290,85 L310,100"
          fill="none"
          stroke="url(#primaryBlue)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upper-left angular claw — sovereignty arm (steel) */}
        <path
          d="M105,120 L70,85 L50,100"
          fill="none"
          stroke="url(#steelGrey)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom anchor — stability arm (steel) */}
        <path
          d="M180,240 L180,280 L200,295"
          fill="none"
          stroke="url(#steelGrey)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <path
          d="M180,280 L160,295"
          fill="none"
          stroke="url(#steelGrey)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Neural cross inside shield */}
        <line x1="180" y1="130" x2="180" y2="195" stroke="#60A5FA" strokeWidth="1.5" opacity="0.3" />
        <line x1="145" y1="160" x2="215" y2="160" stroke="#60A5FA" strokeWidth="1.5" opacity="0.3" />

        {/* Neural node dots */}
        <circle cx="180" cy="130" r="3" fill="#60A5FA" opacity="0.5" className="logo-pulse" style={{ transformOrigin: "180px 130px" }} />
        <circle cx="180" cy="195" r="3" fill="#60A5FA" opacity="0.5" className="logo-pulse" style={{ transformOrigin: "180px 195px" }} />
        <circle cx="145" cy="160" r="3" fill="#60A5FA" opacity="0.5" className="logo-pulse" style={{ transformOrigin: "145px 160px" }} />
        <circle cx="215" cy="160" r="3" fill="#60A5FA" opacity="0.5" className="logo-pulse" style={{ transformOrigin: "215px 160px" }} />

        {/* Core nucleus — solid bright circle */}
        <circle cx="180" cy="160" r="18" fill="#1E40AF" className="logo-pulse" style={{ transformOrigin: "180px 160px" }} />
        <circle cx="180" cy="160" r="12" fill="#3B82F6" className="logo-pulse" style={{ transformOrigin: "180px 160px" }} />
        <circle cx="180" cy="160" r="5" fill="#BFDBFE" className="logo-pulse" style={{ transformOrigin: "180px 160px" }} />

        {/* Tiny orbiting accent dots on the outer ring */}
        <circle cx="310" cy="50" r="2.5" fill="#60A5FA" opacity="0.6" />
        <circle cx="50" cy="260" r="2" fill="var(--kz-border-strong)" opacity="0.4" />
      </g>
    </svg>
  );
}
