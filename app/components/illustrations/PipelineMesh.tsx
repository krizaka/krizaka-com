"use client";

import { useState, useMemo } from "react";
import {
  User,
  Terminal,
  Activity,
  Database,
  Shuffle,
  FileCode,
  Wrench,
  Sliders,
  Shield,
  DollarSign,
  Globe,
  Layers,
  Grid,
  CheckCircle2,
  Cpu,
  MessageSquare,
} from "lucide-react";
import { useI18n } from "../I18nProvider";
import {
  MESH_NODES,
  MESH_EDGES,
  MESH_TITLE,
} from "../../../lib/pipeline-mesh-data";

const ICONS = {
  user: User,
  terminal: Terminal,
  activity: Activity,
  database: Database,
  shuffle: Shuffle,
  filecode: FileCode,
  wrench: Wrench,
  sliders: Sliders,
  shield: Shield,
  dollar: DollarSign,
  globe: Globe,
  layers: Layers,
  grid: Grid,
  check: CheckCircle2,
  cpu: Cpu,
  message: MessageSquare,
} as const;

/* SVG canvas size */
const VW = 1000;
const VH = 560;

// Layer-based color and visual theme mapping for each node
const getNodeTheme = (id: string) => {
  // Context Layer (Cyan/Sky)
  if (["user-context", "system-injection", "semantic-refinement"].includes(id)) {
    return { color: "#0ea5e9", name: "context", glow: "rgba(14, 165, 233, 0.35)", bg: "rgba(14, 165, 233, 0.04)" };
  }
  // Knowledge Layer (Violet/Purple)
  if (["rag", "mcp-tools"].includes(id)) {
    return { color: "#a855f7", name: "knowledge", glow: "rgba(168, 85, 247, 0.35)", bg: "rgba(168, 85, 247, 0.04)" };
  }
  // Control / Governance (Amber/Gold)
  if (["guardrails", "cost-shield", "audit-log"].includes(id)) {
    return { color: "#f59e0b", name: "control", glow: "rgba(245, 158, 11, 0.35)", bg: "rgba(245, 158, 11, 0.04)" };
  }
  // Processing (Teal/Emerald)
  if (["memory-fifo", "multimodal", "context-enrichment", "translation"].includes(id)) {
    return { color: "#10b981", name: "processing", glow: "rgba(16, 185, 129, 0.35)", bg: "rgba(16, 185, 129, 0.04)" };
  }
  // Core Orchestration (Indigo/Blue)
  if (["intent-routing", "orchestration-core"].includes(id)) {
    return { color: "#3b82f6", name: "orchestrate", glow: "rgba(59, 130, 246, 0.35)", bg: "rgba(59, 130, 246, 0.06)" };
  }
  // Output (Pink/Fuchsia)
  if (["final-response"].includes(id)) {
    return { color: "#d946ef", name: "output", glow: "rgba(217, 70, 239, 0.45)", bg: "rgba(217, 70, 239, 0.08)" };
  }
  return { color: "var(--kz-accent)", name: "default", glow: "rgba(59, 130, 246, 0.25)", bg: "var(--kz-surface-2)" };
};

export default function PipelineMesh() {
  const { locale } = useI18n();
  const [active, setActive] = useState<string | null>(null);

  // Map and center coordinates to take up the full canvas width & height with nice breathing room
  const nodes = useMemo(() => {
    const minX = 4;
    const maxX = 90;
    const minY = 10;
    const maxY = 90;
    return MESH_NODES.map((n) => {
      // Map X from [4, 90] to [8, 92] — full width utilization
      const newX = 8 + ((n.x - minX) / (maxX - minX)) * (92 - 8);
      // Map Y from [10, 90] to [12, 88] — vertically centered
      const newY = 12 + ((n.y - minY) / (maxY - minY)) * (88 - 12);
      return { ...n, x: newX, y: newY };
    });
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof nodes[0]>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const nodeById = (id: string) => nodeMap.get(id)!;

  // Curved quadratic paths between nodes
  function edgePath(a: typeof nodes[0], b: typeof nodes[0]): string {
    const x1 = (a.x / 100) * VW;
    const y1 = (a.y / 100) * VH;
    const x2 = (b.x / 100) * VW;
    const y2 = (b.y / 100) * VH;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + (y2 === y1 ? 0 : y2 > y1 ? -16 : 16);
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  /* Edges connected to the hovered node (for highlight) */
  const activeEdges = useMemo(() => {
    if (!active) return new Set<number>();
    const s = new Set<number>();
    MESH_EDGES.forEach((e, i) => {
      if (e.from === active || e.to === active) s.add(i);
    });
    return s;
  }, [active]);

  const activeNode = active ? nodeById(active) : null;

  return (
    <figure
      aria-label={MESH_TITLE[locale]}
      style={{
        margin: 0,
        padding: "48px 0",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Radial accent glow background directly under the canvas */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "90%",
          background: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 68%)",
          opacity: 0.15,
          filter: "blur(54px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Canvas */}
      <div
        className="kz-mesh-canvas"
        style={{ position: "relative", width: "100%", aspectRatio: `${VW} / ${VH}`, zIndex: 1 }}
        onMouseLeave={() => setActive(null)}
      >
        {/* ── Edge layer (SVG) ── */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          <defs>
            {/* Neon Glow Filter */}
            <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid Pattern inside the canvas for tech blueprint vibe */}
          <g opacity="0.08">
            <path d={`M 0,${VH/2} L ${VW},${VH/2} M ${VW/2},0 L ${VW/2},${VH}`} stroke="var(--kz-text-primary)" strokeWidth="0.5" />
            <circle cx={VW/2} cy={VH/2} r="150" fill="none" stroke="var(--kz-text-primary)" strokeWidth="0.5" strokeDasharray="3,3" />
            <circle cx={VW/2} cy={VH/2} r="300" fill="none" stroke="var(--kz-text-primary)" strokeWidth="0.5" strokeDasharray="5,5" />
          </g>

          {MESH_EDGES.map((e, i) => {
            const fromNode = nodeById(e.from);
            const toNode = nodeById(e.to);
            if (!fromNode || !toNode) return null;
            const d = edgePath(fromNode, toNode);
            const isActive = activeEdges.has(i);
            const edgeColor = getNodeTheme(e.from).color;

            return (
              <g key={i}>
                {/* Underlay glow path (when hovered) */}
                {isActive && (
                  <path
                    d={d}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth="5"
                    opacity="0.45"
                    filter="url(#neon-glow-filter)"
                  />
                )}
                {/* Main connector path */}
                <path
                  d={d}
                  fill="none"
                  stroke={isActive ? edgeColor : "var(--kz-border-strong)"}
                  strokeWidth={isActive ? 2.5 : 1.2}
                  opacity={active ? (isActive ? 1.0 : 0.06) : 0.25}
                  style={{ transition: "opacity 300ms ease, stroke-width 300ms ease, stroke 300ms ease" }}
                />
                {/* Animated dash flow path */}
                <path
                  d={d}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={isActive ? 2.5 : 1.2}
                  strokeDasharray="6 12"
                  className="flowing-path"
                  opacity={active ? (isActive ? 1.0 : 0.0) : 0.35}
                  style={{ transition: "opacity 300ms ease, stroke-width 300ms ease" }}
                />
              </g>
            );
          })}

          {/* Flow particles with layer-coded colors */}
          <g className="kz-mesh-particles">
            {MESH_EDGES.map((e, i) => {
              const fromNode = nodeById(e.from);
              const toNode = nodeById(e.to);
              if (!fromNode || !toNode) return null;
              const d = edgePath(fromNode, toNode);
              const isActive = activeEdges.has(i);
              const edgeColor = getNodeTheme(e.from).color;

              return (
                <circle
                  key={i}
                  r={isActive ? "4" : "2.5"}
                  fill={edgeColor}
                  opacity={active ? (isActive ? 1.0 : 0.12) : 0.6}
                  filter={isActive ? "url(#neon-glow-filter)" : undefined}
                  style={{ transition: "opacity 300ms ease, r 300ms ease" }}
                >
                  <animateMotion
                    dur={`${2.4 + (i % 4) * 0.6}s`}
                    begin={`${(i * 0.4).toFixed(1)}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              );
            })}
          </g>
        </svg>

        {/* ── Hex node layer (HTML) ── */}
        {nodes.map((n, idx) => {
          const Icon = ICONS[n.icon];
          const isActive = active === n.id;
          const isInput = n.role === "input";
          const theme = getNodeTheme(n.id);

          return (
            <div
              key={n.id}
              className={`kz-mesh-node ${isInput ? "kz-node-start" : ""}`}
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="img"
              aria-label={`${n.label[locale]} — ${n.desc[locale]}`}
              style={{
                position: "absolute",
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isActive ? 4 : 2,
                cursor: "pointer",
                outline: "none",
                // Staggered floating animation using organic 3D float keyframes
                animation: `mesh-float-${(idx % 3) + 1} ${6 + (idx % 4)}s ease-in-out infinite`,
                animationDelay: `${idx * -0.45}s`,
                filter: isActive
                  ? `drop-shadow(0 8px 24px ${theme.glow})`
                  : `drop-shadow(0 2px 8px ${theme.glow})`,
                transition: "filter 300ms ease",
              }}
            >
              {/* Pulsing Sonar Beacon for User Context (Starting point / Intent) */}
              {isInput && (
                <>
                  <div className="beacon-ring beacon-ring-1" style={{ borderColor: theme.color }} />
                  <div className="beacon-ring beacon-ring-2" style={{ borderColor: theme.color }} />
                  <div className="beacon-ring beacon-ring-3" style={{ borderColor: theme.color }} />
                </>
              )}

              {/* Special Tag for Start node */}
              {isInput && (
                <span
                  style={{
                    position: "absolute",
                    top: "-22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: theme.color,
                    background: "var(--kz-surface-3)",
                    border: `1px solid ${theme.color}`,
                    padding: "3px 8px",
                    borderRadius: "var(--kz-radius-sm)",
                    whiteSpace: "nowrap",
                    boxShadow: `0 4px 12px ${theme.glow}`,
                  }}
                >
                  {locale === "fr" ? "DÉPART / INTENTION UTILISATEUR" : "START / USER INTENTION"}
                </span>
              )}

              {/* Hex border (outer) + surface (inner) via clip-path */}
              <div
                className="kz-hex-outer"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  background: isActive
                    ? theme.color
                    : `linear-gradient(135deg, ${theme.color} 75%, var(--kz-border-strong) 100%)`,
                  padding: "1.5px",
                  transition: "background 300ms ease, transform 300ms ease",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              >
                <div
                  className="kz-hex-inner"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: isActive
                      ? "var(--kz-surface-1)"
                      : `color-mix(in srgb, var(--kz-surface-2) 90%, ${theme.color} 10%)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    textAlign: "center",
                    padding: "20px 10px",
                    transition: "background 300ms ease",
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={2.0}
                    style={{
                      color: theme.color,
                      filter: `drop-shadow(0 0 4px ${theme.color}40)`,
                      transition: "color 300ms ease, transform 300ms ease",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  <span
                    className="kz-hex-label"
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      letterSpacing: "-0.015em",
                      color: "var(--kz-text-primary)",
                      transition: "color 300ms ease",
                      maxWidth: "96px",
                    }}
                  >
                    {n.label[locale]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Tooltip ── */}
        {activeNode && (
          <div
            role="tooltip"
            style={{
              position: "absolute",
              left: `${Math.min(Math.max(activeNode.x, 15), 85)}%`,
              top: activeNode.y > 55 ? `${activeNode.y - 22}%` : `${activeNode.y + 18}%`,
              transform: "translateX(-50%)",
              zIndex: 10,
              width: "280px",
              padding: "16px",
              borderRadius: "16px",
              background: "var(--kz-surface-3)",
              border: `1px solid ${getNodeTheme(activeNode.id).color}`,
              backdropFilter: "blur(12px)",
              boxShadow: `var(--kz-shadow-lg), 0 10px 30px ${getNodeTheme(activeNode.id).glow}`,
              pointerEvents: "none",
              animation: "tooltip-fade 200ms ease-out",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "10px",
                fontWeight: 700,
                color: getNodeTheme(activeNode.id).color,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              {activeNode.label[locale]}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "12.5px",
                lineHeight: 1.6,
                color: "var(--kz-text-secondary)",
              }}
            >
              {activeNode.desc[locale]}
            </span>
          </div>
        )}
      </div>

      <style>{`
        /* Organic asynchronous float keyframes */
        @keyframes mesh-float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
          50%      { transform: translate(-50%, -50%) translateY(-6px) rotate(0.4deg); }
        }
        @keyframes mesh-float-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
          50%      { transform: translate(-50%, -50%) translateY(-4px) translateX(2px) rotate(-0.4deg); }
        }
        @keyframes mesh-float-3 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
          50%      { transform: translate(-50%, -50%) translateY(-5px) translateX(-2px) rotate(0.2deg); }
        }

        /* Tooltip fade-in */
        @keyframes tooltip-fade {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Flowing path animation */
        @keyframes flow-dash {
          to { stroke-dashoffset: -36; }
        }
        .flowing-path {
          animation: flow-dash 1.8s linear infinite;
        }

        /* Pulsing Sonar Beacon */
        @keyframes beacon-pulse {
          0% { transform: translate(-50%, -50%) scale(0.65); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
        .beacon-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          border: 1.5px solid var(--kz-accent);
          pointer-events: none;
          z-index: -1;
          width: 110px;
          height: 110px;
        }
        .beacon-ring-1 {
          animation: beacon-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .beacon-ring-2 {
          animation: beacon-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          animation-delay: 1s;
        }
        .beacon-ring-3 {
          animation: beacon-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          animation-delay: 2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .flowing-path { display: none; }
          .kz-mesh-node { animation: none !important; }
          .beacon-ring { display: none !important; }
        }
        .kz-mesh-node .kz-hex-outer { width: 124px; }
        @media (max-width: 900px) {
          .kz-mesh-node .kz-hex-outer { width: 96px; }
          .kz-mesh-node .kz-hex-label { font-size: 9.5px !important; max-width: 74px !important; }
          .beacon-ring { width: 84px; height: 84px; }
        }
        @media (max-width: 600px) {
          .kz-mesh-node .kz-hex-outer { width: 68px; }
          .kz-mesh-node .kz-hex-label { display: none !important; }
          .kz-mesh-node .kz-hex-inner { padding: 16px 8px !important; }
          .beacon-ring { width: 60px; height: 60px; }
        }
      `}</style>
    </figure>
  );
}

