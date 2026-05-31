"use client";

import { useMemo, useState } from "react";
import {
  Hexagon,
  Database,
  ShieldCheck,
  Briefcase,
  Layers,
  Wrench,
  FlaskConical,
  Network,
  Cog,
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Folder,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "../I18nProvider";
import {
  ARCH_NODES,
  LAYER_THEME,
  HUB_THEME,
  canonicalModuleId,
  type ArchIconName,
  type ArchLayer,
} from "../../../lib/architecture-mesh-data";

export interface ArchModule {
  id: string;
  layer: string;
  path: string;
  ports: { inbound: string[]; outbound: string[] };
}
export interface ArchDep {
  from: string;
  to: string;
}

const ICONS: Record<ArchIconName, LucideIcon> = {
  core: Hexagon,
  database: Database,
  identity: ShieldCheck,
  business: Briefcase,
  interceptors: Layers,
  tools: Wrench,
  test: FlaskConical,
  router: Network,
  workers: Cog,
  aggregate: Boxes,
};

/* SVG canvas dimensions */
const VW = 1000;
const VH = 600;

function themeFor(id: string, layer: ArchLayer) {
  const meta = ARCH_NODES[id];
  if (meta?.hub) return HUB_THEME;
  return LAYER_THEME[layer];
}

export default function ArchitectureMesh({
  modules,
  dependencies,
}: {
  modules: ArchModule[];
  dependencies: ArchDep[];
}) {
  const { locale } = useI18n();
  
  // State variables for search, layer filtering, and inspected node
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>("orasaka-core");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayer, setSelectedLayer] = useState<ArchLayer | null>(null);

  // The active node is either the hovered node, or if none is hovered, the clicked/selected one.
  const activeNodeId = hoveredNode || selectedNode || "orasaka-core";

  /* Only the modules we have a layout for, decorated with their generated facts. */
  const nodes = useMemo(() => {
    return modules
      .filter((m) => ARCH_NODES[m.id])
      .map((m) => {
        const meta = ARCH_NODES[m.id];
        return {
          id: m.id,
          ...meta,
          path: m.path,
          inboundPorts: m.ports.inbound,
          outboundPorts: m.ports.outbound,
          inbound: m.ports.inbound.length,
          outbound: m.ports.outbound.length,
        };
      });
  }, [modules]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, (typeof nodes)[number]>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  /* Collapse split persistence ids, drop self-loops / unknown nodes, dedupe. */
  const edges = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ from: string; to: string }> = [];
    for (const d of dependencies) {
      const from = canonicalModuleId(d.from);
      const to = canonicalModuleId(d.to);
      if (from === to) continue;
      if (!nodeMap.has(from) || !nodeMap.has(to)) continue;
      const key = `${from}->${to}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ from, to });
    }
    return out;
  }, [dependencies, nodeMap]);

  function edgePath(a: (typeof nodes)[number], b: (typeof nodes)[number]): string {
    const x1 = (a.x / 100) * VW;
    const y1 = (a.y / 100) * VH;
    const x2 = (b.x / 100) * VW;
    const y2 = (b.y / 100) * VH;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + (y2 === y1 ? 0 : y2 > y1 ? -18 : 18);
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  const activeEdges = useMemo(() => {
    if (!activeNodeId) return new Set<number>();
    const s = new Set<number>();
    edges.forEach((e, i) => {
      if (e.from === activeNodeId || e.to === activeNodeId) s.add(i);
    });
    return s;
  }, [activeNodeId, edges]);

  const activeNode = activeNodeId ? nodeMap.get(activeNodeId) ?? null : null;

  // Compute dependencies for the active node
  const activeIncomingDeps = useMemo(() => {
    if (!activeNodeId) return [];
    return edges
      .filter((e) => e.to === activeNodeId)
      .map((e) => nodeMap.get(e.from)!)
      .filter(Boolean);
  }, [activeNodeId, edges, nodeMap]);

  const activeOutgoingDeps = useMemo(() => {
    if (!activeNodeId) return [];
    return edges
      .filter((e) => e.from === activeNodeId)
      .map((e) => nodeMap.get(e.to)!)
      .filter(Boolean);
  }, [activeNodeId, edges, nodeMap]);

  // Handle module filtering based on search and layer selection
  const filteredNodes = useMemo(() => {
    return nodes.map((n) => {
      const matchesSearch = searchQuery
        ? n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.desc[locale].toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesLayer = selectedLayer ? n.layer === selectedLayer : true;
      return {
        ...n,
        isDimmed: !matchesSearch || !matchesLayer,
        isSearchHighlight: searchQuery && matchesSearch,
      };
    });
  }, [nodes, searchQuery, selectedLayer, locale]);

  const filteredNodeMap = useMemo(() => {
    const map = new Map<string, (typeof filteredNodes)[number]>();
    filteredNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [filteredNodes]);

  return (
    <div className="kz-architecture-workspace" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ── Control Bar: Search & Layer Filter Pills ── */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          padding: "12px 18px",
          background: "color-mix(in srgb, var(--kz-surface-1) 70%, transparent)",
          border: "1px solid var(--kz-border-subtle)",
          borderRadius: "var(--kz-radius-lg)",
          boxShadow: "var(--kz-shadow-sm)",
          transform: "none", // Avoid translate hover from .glass-card
        }}
      >
        {/* Layer Filters */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedLayer(null)}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--kz-radius-sm)",
              fontSize: "12px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              cursor: "pointer",
              background: selectedLayer === null ? "var(--kz-accent)" : "transparent",
              color: selectedLayer === null ? "var(--kz-on-accent)" : "var(--kz-text-muted)",
              border: "1px solid " + (selectedLayer === null ? "var(--kz-accent)" : "var(--kz-border-subtle)"),
              transition: "all 150ms ease",
            }}
          >
            {locale === "fr" ? "Tous" : "All"}
          </button>
          {(["framework", "app", "aggregate"] as ArchLayer[]).map((layer) => {
            const theme = LAYER_THEME[layer];
            const isActive = selectedLayer === layer;
            return (
              <button
                key={layer}
                onClick={() => setSelectedLayer(layer)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "var(--kz-radius-sm)",
                  fontSize: "12px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: isActive ? theme.color : "transparent",
                  color: isActive ? "var(--kz-on-accent)" : "var(--kz-text-secondary)",
                  border: `1px solid ${isActive ? theme.color : "var(--kz-border-subtle)"}`,
                  transition: "all 150ms ease",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isActive ? "var(--kz-on-accent)" : theme.color,
                    boxShadow: isActive ? "none" : `0 0 6px ${theme.glow}`,
                  }}
                />
                {theme.label[locale]}
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "320px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              color: "var(--kz-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder={locale === "fr" ? "Rechercher un module..." : "Search module..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              fontSize: "13px",
              fontFamily: "var(--font-display)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              borderRadius: "var(--kz-radius-sm)",
              color: "var(--kz-text-primary)",
              outline: "none",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--kz-accent)";
              e.currentTarget.style.boxShadow = "var(--kz-accent-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--kz-border-subtle)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* ── Main Workspace: SVG Canvas & Inspector Panel ── */}
      <div className="workspace-layout" style={{ display: "flex", gap: "24px", minHeight: "600px" }}>
        
        {/* Left Side: SVG Hex Canvas Container */}
        <div
          className="canvas-container"
          style={{
            flex: 1,
            position: "relative",
            background: "color-mix(in srgb, var(--kz-surface-1) 50%, transparent)",
            borderRadius: "var(--kz-radius-lg)",
            border: "1px solid var(--kz-border-subtle)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              background: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)",
              opacity: 0.14,
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            className="kz-arch-mesh-canvas"
            style={{ position: "relative", width: "100%", aspectRatio: `${VW} / ${VH}`, zIndex: 1 }}
          >
            {/* SVG Connections & Particles */}
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              aria-hidden="true"
            >
              <defs>
                <filter id="arch-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Backdrop */}
              <g opacity="0.05">
                <path
                  d={`M 0,${VH / 2} L ${VW},${VH / 2} M ${VW / 2},0 L ${VW / 2},${VH}`}
                  stroke="var(--kz-text-primary)"
                  strokeWidth="0.5"
                />
                <circle cx={VW / 2} cy={VH / 2} r="140" fill="none" stroke="var(--kz-text-primary)" strokeWidth="0.5" strokeDasharray="3,3" />
                <circle cx={VW / 2} cy={VH / 2} r="280" fill="none" stroke="var(--kz-text-primary)" strokeWidth="0.5" strokeDasharray="5,5" />
              </g>

              {edges.map((e, i) => {
                const fromNode = filteredNodeMap.get(e.from);
                const toNode = filteredNodeMap.get(e.to);
                if (!fromNode || !toNode) return null;

                const d = edgePath(fromNode, toNode);
                const isActive = activeEdges.has(i);
                
                // If any node is dimmed due to search/layer selection, or if we filter and these don't belong, dim the edge
                const isEdgeDimmed = fromNode.isDimmed || toNode.isDimmed;
                
                const edgeColor = themeFor(fromNode.id, fromNode.layer).color;

                return (
                  <g key={i}>
                    {/* Glow Underlay: double trace element 1 */}
                    <path
                      d={d}
                      fill="none"
                      stroke={edgeColor}
                      strokeWidth={isActive ? 7 : 3.5}
                      opacity={activeNodeId ? (isActive ? 0.35 : 0.02) : (isEdgeDimmed ? 0.01 : 0.08)}
                      filter="url(#arch-neon-glow)"
                      style={{ transition: "opacity 300ms ease, stroke-width 300ms ease" }}
                    />
                    {/* Core Line: double trace element 2 */}
                    <path
                      d={d}
                      fill="none"
                      stroke={isActive ? edgeColor : "var(--kz-border-strong)"}
                      strokeWidth={isActive ? 2 : 1}
                      opacity={activeNodeId ? (isActive ? 1 : 0.04) : (isEdgeDimmed ? 0.03 : 0.22)}
                      style={{ transition: "opacity 300ms ease, stroke-width 300ms ease, stroke 300ms ease" }}
                    />
                    {/* Animated Flow Dash */}
                    <path
                      d={d}
                      fill="none"
                      stroke={edgeColor}
                      strokeWidth={isActive ? 2 : 1}
                      strokeDasharray="6 12"
                      className="arch-flowing-path"
                      opacity={activeNodeId ? (isActive ? 1 : 0) : (isEdgeDimmed ? 0 : 0.25)}
                      style={{ transition: "opacity 300ms ease" }}
                    />
                  </g>
                );
              })}

              {/* Flow particles */}
              <g>
                {edges.map((e, i) => {
                  const fromNode = filteredNodeMap.get(e.from);
                  const toNode = filteredNodeMap.get(e.to);
                  if (!fromNode || !toNode) return null;

                  const d = edgePath(fromNode, toNode);
                  const isActive = activeEdges.has(i);
                  const isEdgeDimmed = fromNode.isDimmed || toNode.isDimmed;
                  const edgeColor = themeFor(fromNode.id, fromNode.layer).color;

                  return (
                    <circle
                      key={i}
                      r={isActive ? "3.5" : "2"}
                      fill={edgeColor}
                      opacity={activeNodeId ? (isActive ? 1 : 0.05) : (isEdgeDimmed ? 0.02 : 0.45)}
                      filter={isActive ? "url(#arch-neon-glow)" : undefined}
                      style={{ transition: "opacity 300ms ease, r 300ms ease" }}
                    >
                      <animateMotion dur={`${2.6 + (i % 4) * 0.6}s`} begin={`${(i * 0.35).toFixed(1)}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  );
                })}
              </g>
            </svg>

            {/* Hex Nodes */}
            {filteredNodes.map((n, idx) => {
              const Icon = ICONS[n.icon];
              const isHovered = hoveredNode === n.id;
              const isSelected = selectedNode === n.id;
              const isInspected = activeNodeId === n.id;
              const theme = themeFor(n.id, n.layer);

              return (
                <div
                  key={n.id}
                  className={`kz-arch-node ${n.hub ? "kz-arch-hub" : ""} ${n.isDimmed ? "dimmed" : ""} ${n.isSearchHighlight ? "search-highlight" : ""}`}
                  onMouseEnter={() => setHoveredNode(n.id)}
                  onClick={() => setSelectedNode(n.id)}
                  onFocus={() => setHoveredNode(n.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label} — ${n.desc[locale]}`}
                  style={{
                    position: "absolute",
                    left: `${n.x}%`,
                    top: `${n.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isInspected ? 6 : n.hub ? 3 : 2,
                    cursor: "pointer",
                    outline: "none",
                    animation: `arch-float-${(idx % 3) + 1} ${6 + (idx % 4)}s ease-in-out infinite`,
                    animationDelay: `${idx * -0.4}s`,
                    opacity: n.isDimmed ? 0.18 : 1,
                    filter: isInspected
                      ? `drop-shadow(0 8px 24px ${theme.glow})`
                      : n.isSearchHighlight
                      ? `drop-shadow(0 0 16px var(--kz-accent))`
                      : `drop-shadow(0 2px 8px ${theme.glow})`,
                    transition: "filter 300ms ease, opacity 300ms ease",
                  }}
                >
                  {/* Sonar beacon on the hub */}
                  {n.hub && (
                    <>
                      <div className="arch-beacon arch-beacon-1" style={{ borderColor: theme.color }} />
                      <div className="arch-beacon arch-beacon-2" style={{ borderColor: theme.color }} />
                      <div className="arch-beacon arch-beacon-3" style={{ borderColor: theme.color }} />
                    </>
                  )}

                  {/* Hex border + surface */}
                  <div
                    className="kz-arch-hex-outer"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: isInspected
                        ? theme.color
                        : n.isSearchHighlight
                        ? "var(--kz-accent)"
                        : `linear-gradient(135deg, ${theme.color} 75%, var(--kz-border-strong) 100%)`,
                      padding: "1.5px",
                      transition: "background 300ms ease, transform 300ms ease",
                      transform: isHovered || isSelected ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <div
                      className="kz-arch-hex-inner"
                      style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        background: isInspected
                          ? "var(--kz-surface-1)"
                          : `color-mix(in srgb, var(--kz-surface-2) 90%, ${theme.color} 10%)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        textAlign: "center",
                        padding: "20px 8px",
                        transition: "background 300ms ease",
                      }}
                    >
                      <Icon
                        size={n.hub ? 20 : 16}
                        strokeWidth={1.8}
                        style={{
                          color: theme.color,
                          filter: `drop-shadow(0 0 4px ${theme.color}30)`,
                          transition: "transform 300ms ease",
                          transform: isHovered || isSelected ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                      <span
                        className="kz-arch-label"
                        style={{
                          fontFamily: "var(--font-display), system-ui, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          letterSpacing: "-0.015em",
                          color: "var(--kz-text-primary)",
                          maxWidth: "90px",
                        }}
                      >
                        {n.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Glassmorphic Telemetry Inspector Panel */}
        <aside
          className="glass-card telemetry-inspector"
          style={{
            width: "340px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
            backdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid var(--kz-border-strong)",
            borderRadius: "var(--kz-radius-lg)",
            padding: "20px",
            boxShadow: "var(--kz-shadow-lg)",
            transition: "all 300ms ease",
            transform: "none", // Avoid hover float of standard glass-card
            alignSelf: "stretch",
          }}
        >
          {activeNode ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px" }}>
              {/* Telemetry Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--kz-border-subtle)", paddingBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: "var(--kz-surface-2)",
                    border: `1px solid ${themeFor(activeNode.id, activeNode.layer).color}`,
                    color: themeFor(activeNode.id, activeNode.layer).color,
                    boxShadow: `0 0 10px ${themeFor(activeNode.id, activeNode.layer).glow}`,
                  }}
                >
                  {(() => {
                    const IconComp = ICONS[activeNode.icon];
                    return <IconComp size={20} />;
                  })()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--kz-text-primary)",
                      margin: 0,
                    }}
                  >
                    {activeNode.label}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      textTransform: "uppercase",
                      color: "var(--kz-text-muted)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {activeNode.id}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: themeFor(activeNode.id, activeNode.layer).color,
                    background: themeFor(activeNode.id, activeNode.layer).glow,
                    border: `1px solid ${themeFor(activeNode.id, activeNode.layer).color}40`,
                    padding: "2px 8px",
                    borderRadius: "99px",
                  }}
                >
                  {LAYER_THEME[activeNode.layer].label[locale]}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>
                  {locale === "fr" ? "DESCRIPTION" : "DESCRIPTION"}
                </h4>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--kz-text-secondary)", margin: 0 }}>
                  {activeNode.desc[locale]}
                </p>
              </div>

              {/* Module Path */}
              <div>
                <h4 style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Folder size={11} /> {locale === "fr" ? "RÉPERTOIRE SOURCE" : "SOURCE PATH"}
                </h4>
                <code
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "var(--kz-surface-2)",
                    border: "1px solid var(--kz-border-subtle)",
                    color: "var(--kz-text-primary)",
                    wordBreak: "break-all",
                  }}
                >
                  {activeNode.path}
                </code>
              </div>

              {/* Ports section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ArrowDownRight size={12} style={{ color: "var(--kz-status-success)" }} /> {locale === "fr" ? "ENTRANTS" : "INBOUND"}
                  </h4>
                  {activeNode.inboundPorts.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {activeNode.inboundPorts.map((p) => (
                        <span
                          key={p}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            color: "var(--kz-text-secondary)",
                            background: "var(--kz-surface-2)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            borderLeft: "2px solid var(--kz-status-success)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={p}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "11px", color: "var(--kz-text-muted)", fontStyle: "italic" }}>Aucun</span>
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ArrowUpRight size={12} style={{ color: "var(--kz-accent)" }} /> {locale === "fr" ? "SORTANTS" : "OUTBOUND"}
                  </h4>
                  {activeNode.outboundPorts.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {activeNode.outboundPorts.map((p) => (
                        <span
                          key={p}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            color: "var(--kz-text-secondary)",
                            background: "var(--kz-surface-2)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            borderLeft: "2px solid var(--kz-accent)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={p}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "11px", color: "var(--kz-text-muted)", fontStyle: "italic" }}>Aucun</span>
                  )}
                </div>
              </div>

              {/* Active Connections */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <h4 style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Activity size={11} style={{ color: "var(--kz-accent)" }} /> {locale === "fr" ? "DÉPENDANCES ACTIVES" : "ACTIVE DEPENDENCIES"}
                </h4>
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingRight: "4px",
                  }}
                >
                  {activeIncomingDeps.length > 0 && (
                    <div>
                      <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", display: "block", marginBottom: "4px" }}>
                        {locale === "fr" ? "UTILISÉ PAR :" : "USED BY:"}
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {activeIncomingDeps.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              setSelectedNode(d.id);
                              setHoveredNode(null);
                            }}
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-display)",
                              background: "var(--kz-surface-2)",
                              border: "1px solid var(--kz-border-subtle)",
                              borderRadius: "4px",
                              padding: "2px 6px",
                              color: "var(--kz-text-primary)",
                              cursor: "pointer",
                            }}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeOutgoingDeps.length > 0 && (
                    <div style={{ marginTop: activeIncomingDeps.length > 0 ? "8px" : 0 }}>
                      <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", display: "block", marginBottom: "4px" }}>
                        {locale === "fr" ? "DÉPEND DE :" : "DEPENDS ON:"}
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {activeOutgoingDeps.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              setSelectedNode(d.id);
                              setHoveredNode(null);
                            }}
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-display)",
                              background: "var(--kz-surface-2)",
                              border: "1px solid var(--kz-border-subtle)",
                              borderRadius: "4px",
                              padding: "2px 6px",
                              color: "var(--kz-text-primary)",
                              cursor: "pointer",
                            }}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeIncomingDeps.length === 0 && activeOutgoingDeps.length === 0 && (
                    <span style={{ fontSize: "11px", color: "var(--kz-text-muted)", fontStyle: "italic" }}>
                      Aucune dépendance active
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--kz-text-muted)", fontSize: "13px", fontStyle: "italic" }}>
              {locale === "fr" ? "Sélectionnez un module pour l'inspecter" : "Select a module to inspect"}
            </div>
          )}
        </aside>

      </div>

      {/* ── Legend ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "18px",
          marginTop: "4px",
        }}
      >
        {(["framework", "app", "aggregate"] as ArchLayer[]).map((layer) => (
          <span key={layer} style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--kz-text-muted)" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: LAYER_THEME[layer].color, boxShadow: `0 0 8px ${LAYER_THEME[layer].glow}` }} />
            {LAYER_THEME[layer].label[locale]}
          </span>
        ))}
        <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--kz-text-muted)" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: HUB_THEME.color, boxShadow: `0 0 8px ${HUB_THEME.glow}` }} />
          {locale === "fr" ? "Cœur (hub)" : "Core (hub)"}
        </span>
      </div>

      <style>{`
        @keyframes arch-float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
          50%      { transform: translate(-50%, -50%) translateY(-6px) rotate(0.4deg); }
        }
        @keyframes arch-float-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
          50%      { transform: translate(-50%, -50%) translateY(-4px) translateX(2px) rotate(-0.4deg); }
        }
        @keyframes arch-float-3 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
          50%      { transform: translate(-50%, -50%) translateY(-5px) translateX(-2px) rotate(0.2deg); }
        }
        @keyframes arch-tooltip-fade {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes arch-flow-dash { to { stroke-dashoffset: -36; } }
        .arch-flowing-path { animation: arch-flow-dash 1.8s linear infinite; }

        @keyframes arch-beacon-pulse {
          0%   { transform: translate(-50%, -50%) scale(0.65); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
        .arch-beacon {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          width: 120px;
          height: 120px;
          border-width: 1.5px;
          border-style: solid;
        }
        .arch-beacon-1 { animation: arch-beacon-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        .arch-beacon-2 { animation: arch-beacon-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; animation-delay: 1s; }
        .arch-beacon-3 { animation: arch-beacon-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; animation-delay: 2s; }

        .kz-arch-node .kz-arch-hex-outer { width: 104px; }
        .kz-arch-node.kz-arch-hub .kz-arch-hex-outer { width: 124px; }

        @media (prefers-reduced-motion: reduce) {
          .arch-flowing-path { display: none; }
          .kz-arch-node { animation: none !important; }
          .arch-beacon { display: none !important; }
        }
        
        @media (max-width: 1023px) {
          .workspace-layout {
            flex-direction: column !important;
          }
          .telemetry-inspector {
            width: 100% !important;
            height: auto !important;
          }
        }
        @media (max-width: 900px) {
          .kz-arch-node .kz-arch-hex-outer { width: 84px; }
          .kz-arch-node.kz-arch-hub .kz-arch-hex-outer { width: 100px; }
          .kz-arch-label { font-size: 9px !important; max-width: 68px !important; }
          .arch-beacon { width: 90px; height: 90px; }
        }
        @media (max-width: 600px) {
          .kz-arch-node .kz-arch-hex-outer { width: 62px; }
          .kz-arch-node.kz-arch-hub .kz-arch-hex-outer { width: 74px; }
          .kz-arch-label { display: none !important; }
          .kz-arch-hex-inner { padding: 14px 6px !important; }
          .arch-beacon { width: 66px; height: 66px; }
        }
      `}</style>
    </div>
  );
}
