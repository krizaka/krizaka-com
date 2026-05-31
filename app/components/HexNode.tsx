"use client";

import { Handle, Position } from "@xyflow/react";

interface HexNodeProps {
  data: {
    label: string;
    active?: boolean;
    phase?: "ingress" | "core" | "egress";
  };
}

/* Phase identity — semantic accents that read on both light and dark surfaces
   (mid-tone 500s), mirroring the layer palette of the 3D architecture scene. */
const PHASE = {
  ingress: { accent: "#6366f1", grad: ["#818cf8", "#4f46e5"] },
  core: { accent: "#3b82f6", grad: ["#60a5fa", "#2563eb"] },
  egress: { accent: "#a855f7", grad: ["#c084fc", "#9333ea"] },
} as const;

export default function HexNode({ data }: HexNodeProps) {
  const isActive = data.active;
  const phase = data.phase || "core";
  const p = PHASE[phase];
  const hexPath = "M 36,4 L 108,4 L 140,64 L 108,124 L 36,124 L 4,64 Z";

  return (
    <div 
      className="relative w-36 h-32 flex items-center justify-center select-none group transition-all duration-500 hover:scale-108 hover:z-30 cursor-pointer"
      style={{
        filter: isActive 
          ? `drop-shadow(0 0 14px ${p.accent}88) drop-shadow(0 0 4px ${p.accent}44)` 
          : `drop-shadow(0 0 3px rgba(0, 0, 0, 0.15))`,
      }}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" style={{ left: "8px" }} />
      <Handle type="source" position={Position.Right} className="opacity-0" style={{ right: "8px" }} />

      {/* Hexagon SVG frame — glass surface + phase border */}
      <svg
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-out group-hover:scale-102"
        viewBox="0 0 144 128"
      >
        <defs>
          {(["ingress", "core", "egress"] as const).map((ph) => (
            <linearGradient key={ph} id={`glow-${ph}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={PHASE[ph].grad[0]} />
              <stop offset="50%" stopColor={PHASE[ph].grad[0]} stopOpacity={0.8} />
              <stop offset="100%" stopColor={PHASE[ph].grad[1]} />
            </linearGradient>
          ))}
          <linearGradient id="sheen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Glass backdrop — theme-aware surface */}
        <path
          d={hexPath}
          fill="color-mix(in srgb, var(--kz-surface-1) 85%, transparent)"
          className="transition-colors duration-300 group-hover:fill-[color-mix(in srgb,var(--kz-surface-2)_90%,transparent)]"
        />

        {/* Sheen sweep effect */}
        <path
          d={hexPath}
          fill="url(#sheen-grad)"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        />

        {/* Phase border (gradient when active, faint accent otherwise) */}
        <path
          d={hexPath}
          fill="none"
          stroke={isActive ? `url(#glow-${phase})` : `color-mix(in srgb, ${p.accent} 25%, transparent)`}
          strokeWidth={isActive ? 2.5 : 1.2}
          className="transition-all duration-300 group-hover:stroke-width-[2px] group-hover:stroke-[url(#glow-ingress)]"
          style={{
            stroke: isActive ? undefined : `color-mix(in srgb, ${p.accent} 35%, transparent)`
          }}
        />
      </svg>

      {/* Node content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "animate-pulse" : ""}`}
            style={{ 
              background: isActive ? p.accent : "var(--kz-text-muted)",
              boxShadow: isActive ? `0 0 8px ${p.accent}` : "none" 
            }}
          />
          <span
            className="font-mono text-[8.5px] uppercase tracking-widest transition-colors duration-300"
            style={{ color: isActive ? "var(--kz-text-primary)" : "var(--kz-text-muted)" }}
          >
            {phase}
          </span>
        </div>

        <div
          className="font-display text-[10.5px] leading-tight tracking-tight px-1 break-words max-w-[115px] transition-all duration-300"
          style={{
            color: isActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)",
            fontWeight: isActive ? 700 : 500,
            textShadow: isActive ? `0 0 10px color-mix(in srgb, ${p.accent} 30%, transparent)` : "none",
          }}
        >
          {data.label}
        </div>
      </div>
    </div>
  );
}
