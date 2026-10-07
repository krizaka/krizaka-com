import { useId } from "react";

/* Orazaka hexagonal isotype — the official mark (products/orazaka/docs/assets/logo.svg):
   three shards orbiting slowly around an amber core that breathes. Same motion grammar as
   KrizakaLogo / OrochiaLogo, switched off under prefers-reduced-motion (globals.css).
   Neutral strokes use --kz-* tokens so the mark reads on both themes. */
export default function OrazakaLogo({ size = 28, animated = true }: { size?: number; animated?: boolean }) {
  const amber = `oz-amber-${useId().replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="-66 -66 132 132" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={amber} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle r="62" stroke="var(--kz-border-strong)" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
      <circle r="48" stroke="var(--kz-border-default)" strokeWidth="1" opacity="0.3" />
      <g className={animated ? "oz-orbit" : undefined}>
        <path d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2" stroke="var(--kz-text-muted)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2" stroke="var(--kz-text-secondary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2" stroke={`url(#${amber})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle r="10" fill={`url(#${amber})`} className={animated ? "oz-core" : undefined} />
    </svg>
  );
}
