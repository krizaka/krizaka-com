"use client";

import React, { useState } from "react";

/**
 * SovereigntyPerimeter — An ultra-premium, 3D isometric layered AI architecture schema.
 * Visualizes the Orasaka sovereign boundary.
 * Renders stacked glass platform layers (App Router, Engine, Local Hardware)
 * with animated data packets traveling vertically and horizontally.
 */
export default function SovereigntyPerimeter({
  className = "",
  width = 340,
  height = 260,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const accent = "var(--kz-accent)";
  const accentSoft = "var(--kz-accent-soft)";
  const borderDefault = "var(--kz-border-default)";
  const borderSubtle = "var(--kz-border-subtle)";

  // Details for HUD display based on hovered node
  const nodeDetails: Record<string, { title: string; desc: string }> = {
    router: { title: "App Router / BFF", desc: "Passerelle locale. Distribue les requêtes aux agents." },
    core: { title: "Orasaka Core", desc: "Moteur à 15 intercepteurs avec boucles de validation fermées." },
    sandbox: { title: "Isolated Sandbox", desc: "Exécution de code et requêtes MCP en environnement étanche." },
    llm: { title: "Local LLM", desc: "Modèle d'inférence (Llama, Mistral) tournant 100% hors-ligne." },
    vector: { title: "Vector Database", desc: "Stockage pgvector sécurisé sur l'infrastructure physique." },
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: "20px",
        borderRadius: "var(--kz-radius-xl)",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        boxShadow: "var(--kz-shadow-lg)",
        overflow: "hidden",
      }}
      className={`group/perim ${className} glow-card-cyber`}
    >
      {/* Blueprint Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          opacity: 0.8,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <svg
        width={width}
        height={height}
        viewBox="0 0 340 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="3D Isometric Sovereign AI Perimeter"
        style={{ position: "relative", zIndex: 1 }}
      >
        <defs>
          {/* Glowing Filters */}
          <filter id="shield-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Amber Gradient */}
          <linearGradient id="ozAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Blue/Indigo Gradient */}
          <linearGradient id="kzBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--kz-accent)" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        {/* ─── LAYER 1: Sovereign Hardware Boundary (Bottom) ─── */}
        {/* Plate Rhombus */}
        <polygon
          points="170,150 290,190 170,230 50,190"
          fill="color-mix(in srgb, var(--kz-surface-0) 80%, transparent)"
          stroke="var(--kz-border-subtle)"
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Layer title */}
        <text
          x="75"
          y="218"
          fill="var(--kz-text-muted)"
          fontFamily="var(--font-mono, monospace)"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          L1: HARDWARE SOUVERAIN
        </text>

        {/* ─── LAYER 2: Core Engine Orchestration (Middle) ─── */}
        {/* Plate Rhombus */}
        <polygon
          points="170,90 290,130 170,170 50,130"
          fill="color-mix(in srgb, var(--kz-surface-2) 40%, transparent)"
          stroke="color-mix(in srgb, var(--kz-accent) 20%, var(--kz-border-subtle))"
          strokeWidth="1.2"
          opacity="0.8"
        />
        <text
          x="75"
          y="158"
          fill="var(--kz-text-muted)"
          fontFamily="var(--font-mono, monospace)"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          L2: MOTEUR ORASAKA CORE
        </text>

        {/* ─── LAYER 3: Ingress / Gateway App Router (Top) ─── */}
        {/* Plate Rhombus */}
        <polygon
          points="170,30 290,70 170,110 50,70"
          fill="color-mix(in srgb, var(--kz-surface-2) 60%, transparent)"
          stroke="color-mix(in srgb, var(--kz-accent) 30%, var(--kz-border-subtle))"
          strokeWidth="1.5"
          opacity="0.75"
        />
        <text
          x="75"
          y="98"
          fill="var(--kz-text-muted)"
          fontFamily="var(--font-mono, monospace)"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          L3: GATEWAY & INGRESS
        </text>

        {/* ─── VERTICAL CONDUIT LINES (Connecting the 3 levels) ─── */}
        {/* Center column */}
        <line x1="170" y1="70" x2="170" y2="190" stroke={accent} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        {/* Left column */}
        <line x1="110" y1="90" x2="110" y2="210" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.3" />
        {/* Right column */}
        <line x1="230" y1="90" x2="230" y2="210" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.3" />

        {/* ─── INTERACTIVE NODES ─── */}

        {/* Node 1: Local LLM (Bottom Left) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("llm")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Glowing pedestal */}
          <ellipse cx="110" cy="190" rx="18" ry="8" fill={accentSoft} opacity={hoveredNode === "llm" ? 0.7 : 0} style={{ transition: "all 0.3s" }} />
          <ellipse cx="110" cy="190" rx="14" ry="6" fill="none" stroke="url(#ozAmber)" strokeWidth={hoveredNode === "llm" ? 2 : 1} opacity="0.8" />
          {/* Active node dot */}
          <circle cx="110" cy="186" r="4" fill="url(#ozAmber)" className="oz-core" filter="url(#shield-glow)" />
          {/* Connector wire */}
          <line x1="110" y1="190" x2="170" y2="210" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.4" />
          {/* Title label */}
          <text x="110" y="206" textAnchor="middle" fill={hoveredNode === "llm" ? "var(--kz-text-primary)" : "var(--kz-text-secondary)"} fontFamily="var(--font-mono, monospace)" fontSize="8" fontWeight="600">
            Local LLM
          </text>
        </g>

        {/* Node 2: Vector DB (Bottom Right) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("vector")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <ellipse cx="230" cy="190" rx="18" ry="8" fill={accentSoft} opacity={hoveredNode === "vector" ? 0.7 : 0} style={{ transition: "all 0.3s" }} />
          <ellipse cx="230" cy="190" rx="14" ry="6" fill="none" stroke={accent} strokeWidth={hoveredNode === "vector" ? 2 : 1} opacity="0.8" />
          <circle cx="230" cy="186" r="4" fill={accent} filter="url(#shield-glow)" />
          <line x1="230" y1="190" x2="170" y2="210" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.4" />
          <text x="230" y="206" textAnchor="middle" fill={hoveredNode === "vector" ? "var(--kz-text-primary)" : "var(--kz-text-secondary)"} fontFamily="var(--font-mono, monospace)" fontSize="8" fontWeight="600">
            Vector DB
          </text>
        </g>

        {/* Node 3: Orasaka Core (Middle Center) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("core")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <ellipse cx="170" cy="130" rx="22" ry="10" fill={accentSoft} opacity={hoveredNode === "core" ? 0.85 : 0.2} style={{ transition: "all 0.3s" }} />
          <ellipse cx="170" cy="130" rx="16" ry="7" fill="none" stroke="url(#kzBlue)" strokeWidth={hoveredNode === "core" ? 2.5 : 1.5} filter="url(#shield-glow)" />
          <circle cx="170" cy="126" r="5" fill="url(#kzBlue)" className="oz-core" />
          <text x="170" y="147" textAnchor="middle" fill={hoveredNode === "core" ? "var(--kz-text-primary)" : "var(--kz-text-secondary)"} fontFamily="var(--font-display), system-ui" fontSize="8.5" fontWeight="700">
            Orasaka Core
          </text>
        </g>

        {/* Node 4: App Router (Top Left) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("router")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <ellipse cx="110" cy="70" rx="18" ry="8" fill={accentSoft} opacity={hoveredNode === "router" ? 0.7 : 0} style={{ transition: "all 0.3s" }} />
          <ellipse cx="110" cy="70" rx="14" ry="6" fill="none" stroke={accent} strokeWidth={hoveredNode === "router" ? 2 : 1} opacity="0.8" />
          <circle cx="110" cy="66" r="4" fill={accent} />
          <line x1="110" y1="70" x2="170" y2="90" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.4" />
          <text x="110" y="86" textAnchor="middle" fill={hoveredNode === "router" ? "var(--kz-text-primary)" : "var(--kz-text-secondary)"} fontFamily="var(--font-mono, monospace)" fontSize="8" fontWeight="600">
            App Router
          </text>
        </g>

        {/* Node 5: Sandbox (Top Right) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("sandbox")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <ellipse cx="230" cy="70" rx="18" ry="8" fill={accentSoft} opacity={hoveredNode === "sandbox" ? 0.7 : 0} style={{ transition: "all 0.3s" }} />
          <ellipse cx="230" cy="70" rx="14" ry="6" fill="none" stroke="url(#ozAmber)" strokeWidth={hoveredNode === "sandbox" ? 2 : 1} opacity="0.8" />
          <circle cx="230" cy="66" r="4" fill="url(#ozAmber)" />
          <line x1="230" y1="70" x2="170" y2="90" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.4" />
          <text x="230" y="86" textAnchor="middle" fill={hoveredNode === "sandbox" ? "var(--kz-text-primary)" : "var(--kz-text-secondary)"} fontFamily="var(--font-mono, monospace)" fontSize="8" fontWeight="600">
            Sandbox
          </text>
        </g>

        {/* ─── ANIMATED DATA FLOW PACKETS (Vertical & Horizontal) ─── */}
        {/* Packet 1: App Router -> Core */}
        <circle cx="110" cy="70" r="2.5" fill={accent} filter="url(#shield-glow)">
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            path="M 110 70 L 170 130"
          />
        </circle>
        
        {/* Packet 2: Core -> LLM */}
        <circle cx="170" cy="130" r="2.5" fill="#f59e0b" filter="url(#shield-glow)">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path="M 170 130 L 110 186"
          />
        </circle>

        {/* Packet 3: Core -> Vector DB */}
        <circle cx="170" cy="130" r="2.5" fill="var(--kz-accent)" filter="url(#shield-glow)">
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            path="M 170 130 L 230 186"
          />
        </circle>

        {/* Outer security label box (Top Center) */}
        <rect x="50" y="8" width="240" height="18" rx="4" fill="var(--kz-surface-0)" stroke="var(--kz-border-subtle)" strokeWidth="1" opacity="0.95" />
        <circle cx="62" cy="17" r="3" fill="var(--kz-status-success)" className="oz-core" />
        <text
          x="175"
          y="20"
          textAnchor="middle"
          fill={accent}
          fontFamily="var(--font-mono, monospace)"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          LIMITE DE SOUVERAINETÉ (LOI 25 & RGPD)
        </text>

        {/* High-tech shield perimeter bracket corners */}
        <path d="M 25,45 L 25,25 L 45,25" stroke={accent} strokeWidth="1.5" opacity="0.65" />
        <path d="M 315,45 L 315,25 L 295,25" stroke={accent} strokeWidth="1.5" opacity="0.65" />
        <path d="M 25,215 L 25,235 L 45,235" stroke={accent} strokeWidth="1.5" opacity="0.65" />
        <path d="M 315,215 L 315,235 L 295,235" stroke={accent} strokeWidth="1.5" opacity="0.65" />
      </svg>

      {/* Dynamic HUD info detail block at the bottom */}
      <div
        style={{
          height: "44px",
          width: "100%",
          marginTop: "12px",
          padding: "8px 12px",
          background: "var(--kz-surface-0)",
          border: "1px solid var(--kz-border-subtle)",
          borderRadius: "var(--kz-radius-sm)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 1,
          position: "relative",
          transition: "all 300ms ease",
        }}
      >
        {hoveredNode ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: hoveredNode === "llm" || hoveredNode === "sandbox" ? "url(#ozAmber)" : "var(--kz-accent)" }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", fontWeight: 700, color: "var(--kz-text-primary)" }}>
                {nodeDetails[hoveredNode].title.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: "10px", color: "var(--kz-text-secondary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {nodeDetails[hoveredNode].desc}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--kz-status-success)] animate-pulse" />
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "9px", color: "var(--kz-text-muted)" }} className="tracking-wide">
              SURVOLEZ UN COMPOSANT POUR L&apos;INSPECTER
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes oz-core-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .oz-core {
          animation: oz-core-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
