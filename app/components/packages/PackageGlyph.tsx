/* The glyphs of the @krizaka packages — one drawing per layer, in the marks' motion grammar (slow, looping, stilled
   under prefers-reduced-motion). Accent colours are each product's identity and read on both themes; neutral
   strokes use --kz-* tokens.
   ui            folded steel: layers of the kris, a light running along them
   orochiaDs     the kit: tiles in the serpent's gradient, one at a time lighting up
   orazakaDs     the kit: Orazaka's hexagon, its shards turning
   orazakaShared the contracts: braces holding a chain of typed nodes */

import { useId } from "react";
import type { PackageId } from "@/lib/npm-packages";

const CSS = `
.pg-run { stroke-dasharray: 10 90; animation: pg-run 3.6s linear infinite; }
.pg-tile { animation: pg-tile 3.2s ease-in-out infinite; }
.pg-turn { transform-box: fill-box; transform-origin: center; animation: pg-turn 24s linear infinite; }
.pg-node { animation: pg-node 2.4s ease-in-out infinite; }
@keyframes pg-run { to { stroke-dashoffset: -100; } }
@keyframes pg-tile { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes pg-turn { to { transform: rotate(360deg); } }
@keyframes pg-node { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .pg-run, .pg-tile, .pg-turn, .pg-node { animation: none; } }
`;

export default function PackageGlyph({ id, size = 56 }: { id: PackageId; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = (name: string) => `pg-${name}-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <style>{CSS}</style>
      <defs>
        <linearGradient id={g("blue")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id={g("serpent")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset=".55" stopColor="#d946ef" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id={g("amber")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="16" fill="var(--kz-surface-2)" stroke="var(--kz-border-default)" />
      {id === "ui" && (
        <g strokeLinecap="round">
          {[20, 28, 36, 44].map((y, i) => {
            const d = `M12 ${y} C 22 ${y - 6}, 30 ${y + 6}, 40 ${y} S 50 ${y - 4}, 52 ${y}`;
            return (
              <g key={y}>
                <path d={d} stroke={i % 2 ? "var(--kz-text-muted)" : `url(#${g("blue")})`} strokeWidth="2.6" opacity={i % 2 ? 0.7 : 1} />
                {i % 2 === 0 && <path d={d} pathLength={100} stroke="#e0f2fe" strokeWidth="2.6" className="pg-run" style={{ animationDelay: `${i * 0.45}s` }} />}
              </g>
            );
          })}
        </g>
      )}
      {id === "orochiaDs" && (
        <g>
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => {
              const k = r * 3 + c;
              return (
                <rect
                  key={k}
                  x={14 + c * 13}
                  y={14 + r * 13}
                  width="10"
                  height="10"
                  rx="3"
                  fill={`url(#${g("serpent")})`}
                  className="pg-tile"
                  style={{ animationDelay: `${(k * 0.35) % 3.2}s` }}
                />
              );
            }),
          )}
        </g>
      )}
      {id === "orazakaDs" && (
        <g>
          <path d="M32 11 L50 21.5 V42.5 L32 53 L14 42.5 V21.5 Z" stroke="var(--kz-border-strong)" strokeWidth="1.6" strokeLinejoin="round" />
          <g className="pg-turn">
            <path d="M24 22 L32 17.4 L40 22 V28" stroke="var(--kz-text-muted)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 34 L24 41 L32 45.6" stroke="var(--kz-text-secondary)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M44 34 L40 41 L32 45.6" stroke={`url(#${g("amber")})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <circle cx="32" cy="32" r="4.5" fill={`url(#${g("amber")})`} />
        </g>
      )}
      {id === "orazakaShared" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 14 C 15 14, 17 26, 12 32 C 17 38, 15 50, 22 50" stroke="var(--kz-text-secondary)" strokeWidth="2.4" />
          <path d="M42 14 C 49 14, 47 26, 52 32 C 47 38, 49 50, 42 50" stroke="var(--kz-text-secondary)" strokeWidth="2.4" />
          <path d="M24 32 H40" stroke="var(--kz-border-strong)" strokeWidth="1.6" />
          {[24, 32, 40].map((x, i) => (
            <circle key={x} cx={x} cy="32" r="3.6" fill={`url(#${g("amber")})`} className="pg-node" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}
