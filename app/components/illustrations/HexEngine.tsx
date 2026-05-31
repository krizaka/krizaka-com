/**
 * Original brand illustration — the hexagonal engine (ports & adapters), the
 * Orasaka architecture as a calm, layered hexagon with a slowly turning core.
 * Anti-cliché, theme-aware, reduced-motion-safe.
 */
export default function HexEngine({
  className,
  size = 220,
}: {
  className?: string;
  size?: number;
}) {
  const accent = "var(--kz-accent)";
  const hex = (r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${(60 + r * Math.cos(a)).toFixed(2)},${(60 + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="The hexagonal Orasaka engine"
    >
      <polygon points={hex(50)} stroke={accent} strokeWidth="1.2" opacity="0.35" />
      <polygon points={hex(38)} stroke={accent} strokeWidth="1.2" opacity="0.55" />
      <g className="kz-hex-spin" style={{ transformOrigin: "60px 60px" }}>
        <polygon points={hex(24)} stroke={accent} strokeWidth="1.4" opacity="0.9" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          return (
            <circle
              key={i}
              cx={60 + 38 * Math.cos(a)}
              cy={60 + 38 * Math.sin(a)}
              r="3"
              fill={accent}
            />
          );
        })}
      </g>
      <circle cx="60" cy="60" r="5" fill={accent} className="kz-hex-core" />
    </svg>
  );
}
