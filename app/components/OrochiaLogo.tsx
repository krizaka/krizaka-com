import { useId } from "react";

/* Orochia mark — the serpent (Orochi) coiled into an "O" around the product's flame.
   Same construction as KrizakaLogo: ambient glow, slow dashed orbit, fine rings, pulsing core.
   Motion (orbit spin, scale shimmer along the body, flame/eye pulse) is CSS-driven and
   switched off under prefers-reduced-motion (globals.css). The gradient is Orochia's identity
   (violet → fuchsia → pink) and reads on both themes; rings use --kz-* tokens. */
export default function OrochiaLogo({ size = 32, animated = true }: { size?: number; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  const body = `oro-body-${id}`;
  const flame = `oro-flame-${id}`;
  const glow = `oro-glow-${id}`;
  const motion = (cls: string) => (animated ? cls : undefined);

  // Small sizes crop to the serpent and its flame: the orbits would only add hairlines.
  return (
    <svg width={size} height={size} viewBox={size < 48 ? "86 82 228 228" : "0 0 400 400"} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={body} gradientUnits="userSpaceOnUse" x1="70" y1="290" x2="290" y2="70">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id={flame} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d946ef" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(20, 20)">
        {/* Ambient glow + orbits (Krizaka family) */}
        <circle cx="180" cy="180" r="170" fill={`url(#${glow})`} />
        <circle
          cx="180" cy="180" r="160" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.6"
          className={motion("logo-spin")} style={{ transformOrigin: "180px 180px" }}
        />
        <circle cx="180" cy="180" r="134" fill="none" stroke="var(--kz-border-default)" strokeWidth="1" opacity="0.35" />

        {/* Serpent body: an open "O" — tapering tail, head at the gap */}
        <path d="M259.8,142.8 A88,88 0 1 1 142.8,100.2" stroke={`url(#${body})`} strokeWidth="22" strokeLinecap="round" />
        {/* Scales: a dashed highlight that slides along the body */}
        <path
          d="M259.8,142.8 A88,88 0 1 1 142.8,100.2" stroke="#fdf4ff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round"
          strokeDasharray="2 14" className={motion("oro-slither")}
        />
        <path d="M142.8,100.2 A88,88 0 0 1 187.7,92.3" stroke={`url(#${body})`} strokeWidth="14" strokeLinecap="round" />
        <path d="M187.7,92.3 A88,88 0 0 1 221.3,102.3" stroke={`url(#${body})`} strokeWidth="6" strokeLinecap="round" />

        {/* Head, facing the gap, with a forked tongue and a pulsing eye */}
        <ellipse cx="253.9" cy="130.1" rx="13" ry="20" transform="rotate(-25 253.9 130.1)" fill={`url(#${body})`} />
        <path d="M245.4,112.0 L242.0,104.8 L235.0,101.5 M242.0,104.8 L244.0,97.3" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="256.3" cy="123.5" r="4.5" fill="#fdf4ff" className={motion("oro-pulse")} style={{ transformOrigin: "256.3px 123.5px" }} />

        {/* The flame the serpent guards — Orochia's emblem */}
        <path
          transform="translate(127 120) scale(4.4)"
          d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          fill={`url(#${flame})`} className={motion("oro-pulse")} style={{ transformOrigin: "180px 185px", transformBox: "view-box" }}
        />
      </g>
    </svg>
  );
}
