"use client";

import React, { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useI18n } from "../I18nProvider";

/* ─────────────────────────────────────────────────────────────────────
   SovereigntyPerimeter — the single signature schema of the home page.
   Shows how the Orazaka PRODUCT runs: a request flows Ingress → Core →
   Local, and the whole thing stays inside your sovereign perimeter
   (Law 25 / GDPR). Clean, aligned, single-accent — no HUD chrome.
   Custom hexagonal node glyphs echo the Krizaka / Orazaka identity.
   Theme-aware (var(--kz-*) only), reduced-motion safe, keyboard-inspectable.
   ───────────────────────────────────────────────────────────────────── */

type NodeId = "router" | "core" | "llm" | "vector" | "sandbox";
type Glyph = NodeId;

/* ── Custom Krizaka hexagonal glyphs (pointy-top hex frame + per-node mark) ── */
function HexGlyph({ kind, active }: { kind: Glyph; active: boolean }) {
  const stroke = active ? "var(--kz-accent)" : "var(--kz-text-muted)";
  const mark = active ? "var(--kz-accent)" : "var(--kz-text-secondary)";
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transition: "all 200ms ease" }}>
      <path
        d="M12 2.6 L20.1 7.3 L20.1 16.7 L12 21.4 L3.9 16.7 L3.9 7.3 Z"
        stroke={stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={active ? "var(--kz-accent-soft)" : "none"}
      />
      {kind === "router" && (
        <g stroke={mark} strokeWidth="1.3" strokeLinecap="round">
          <circle cx="12" cy="12" r="1.4" fill={mark} stroke="none" />
          <path d="M12 12 L8.5 9 M12 12 L15.5 9 M12 12 L12 16" />
        </g>
      )}
      {kind === "core" && (
        <g>
          <circle cx="12" cy="12" r="4.1" fill="none" stroke={mark} strokeWidth="1.3" />
          <circle cx="12" cy="12" r="1.9" fill={mark} />
        </g>
      )}
      {kind === "llm" && (
        <g stroke={mark} strokeWidth="1.2" strokeLinecap="round">
          <path d="M9 10.2 L15 10.2 M9 10.2 L12 15 M15 10.2 L12 15" />
          <circle cx="9" cy="10.2" r="1.2" fill={mark} stroke="none" />
          <circle cx="15" cy="10.2" r="1.2" fill={mark} stroke="none" />
          <circle cx="12" cy="15" r="1.2" fill={mark} stroke="none" />
        </g>
      )}
      {kind === "vector" && (
        <g stroke={mark} strokeWidth="1.3" strokeLinecap="round">
          <path d="M8.6 9.3 H15.4 M8.6 12 H15.4 M8.6 14.7 H13" />
        </g>
      )}
      {kind === "sandbox" && (
        <path
          d="M12 7.4 L15.8 9.6 L15.8 14 L12 16.2 L8.2 14 L8.2 9.6 Z"
          stroke={mark}
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeDasharray="2 2"
          fill="none"
        />
      )}
    </svg>
  );
}

/* ── Official Orazaka isotype (the logo part of public/assets/.../orazaka.svg) ── */
function OrazakaMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-62 -62 124 124" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="oz-schema-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="0" cy="0" r="52" stroke="hsla(217, 92%, 60%, 0.15)" strokeWidth="1" fill="none" />
      <path d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2" stroke="hsla(217, 92%, 60%, 0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2" stroke="hsla(217, 92%, 60%, 0.3)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2" stroke="url(#oz-schema-mark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="0" cy="0" r="8" fill="url(#oz-schema-mark)" opacity="0.9" />
    </svg>
  );
}

/* ── Custom shield-hex badge glyph (Law 25 / GDPR boundary) ── */
function ShieldHex() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.6 L20.1 7.3 L20.1 16.7 L12 21.4 L3.9 16.7 L3.9 7.3 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M8.6 11.8 L11.2 14.4 L15.6 9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ChipProps {
  id: NodeId;
  emphasized?: boolean;
  active: NodeId | null;
  setActive: (id: NodeId | null) => void;
  c: {
    nodes: Record<NodeId, { name: string; sub?: string; role: string }>;
  };
}

const chipBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "9px 14px",
  borderRadius: "12px",
  background: "var(--kz-surface-1)",
  border: "1px solid var(--kz-border-subtle)",
  cursor: "default",
  transition: "border-color 200ms ease, transform 200ms ease, background 200ms ease",
  outline: "none",
};

function Chip({ id, emphasized = false, active, setActive, c }: ChipProps) {
  const n = c.nodes[id];
  const isActive = active === id;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${n.name} — ${n.role}`}
      className="sp-chip"
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(id)}
      onBlur={() => setActive(null)}
      style={{
        ...chipBase,
        background: emphasized || isActive ? "var(--kz-surface-2)" : "var(--kz-surface-1)",
        borderColor: emphasized ? "color-mix(in srgb, var(--kz-accent) 45%, var(--kz-border-subtle))" : isActive ? "var(--kz-accent)" : "var(--kz-border-subtle)",
        transform: isActive ? "translateY(-1px)" : "none",
      }}
    >
      {id === "core" ? <OrazakaMark size={26} /> : <HexGlyph kind={id} active={emphasized || isActive} />}
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25, textAlign: "left" }}>
        <span style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "12.5px", fontWeight: 650, color: "var(--kz-text-primary)", whiteSpace: "nowrap" }}>
          {n.name}
        </span>
        {"sub" in n && n.sub && (
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", color: "var(--kz-text-muted)" }}>{n.sub}</span>
        )}
      </span>
    </div>
  );
}

function Spine({ reduce }: { reduce: boolean | null }) {
  return (
    <div aria-hidden="true" style={{ position: "relative", width: "2px", height: "26px", margin: "0 auto", background: "linear-gradient(var(--kz-border-default), color-mix(in srgb, var(--kz-accent) 30%, transparent))" }}>
      {!reduce && (
        <span
          className="sp-packet"
          style={{ position: "absolute", left: "-2px", top: 0, width: "6px", height: "6px", borderRadius: "50%", background: "var(--kz-accent)", boxShadow: "0 0 8px var(--kz-accent)" }}
        />
      )}
    </div>
  );
}

export default function SovereigntyPerimeter({
  className = "",
  width = 360,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  const { locale } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<NodeId | null>(null);

  const COPY = {
    fr: {
      product: "le produit, sur ton infra",
      badge: "Loi 25 · RGPD",
      perimeter: "Périmètre souverain",
      stages: { ingress: "Entrée", core: "Cœur", local: "Local" },
      idle: "Tout s'exécute sur ton infra — rien ne sort de ton réseau.",
      nodes: {
        router: { name: "App Router · BFF", role: "Passerelle locale : distribue chaque requête au moteur." },
        core: { name: "Orazaka Core", sub: "15 intercepteurs", role: "Le moteur : enrichit, route et valide chaque requête en boucle fermée." },
        llm: { name: "LLM local", role: "Inférence locale (Llama, Mistral) — 100% hors-ligne." },
        vector: { name: "Base vectorielle", role: "Mémoire pgvector, sur ton infrastructure physique." },
        sandbox: { name: "Sandbox", role: "Exécution de code et MCP en environnement étanche." },
      },
    },
    en: {
      product: "the product, on your infra",
      badge: "Law 25 · GDPR",
      perimeter: "Sovereign perimeter",
      stages: { ingress: "Ingress", core: "Core", local: "Local" },
      idle: "Everything runs on your infra — nothing leaves your network.",
      nodes: {
        router: { name: "App Router · BFF", role: "Local gateway: routes every request to the engine." },
        core: { name: "Orazaka Core", sub: "15 interceptors", role: "The engine: enriches, routes and validates every request in a closed loop." },
        llm: { name: "Local LLM", role: "Local inference (Llama, Mistral) — 100% offline." },
        vector: { name: "Vector store", role: "pgvector memory, on your own hardware." },
        sandbox: { name: "Sandbox", role: "Code and MCP execution in a sealed environment." },
      },
    },
  } as const;

  const c = COPY[locale];

  return (
    <div
      className={`${className}`}
      role="group"
      aria-label={locale === "fr" ? "Schéma : le produit Orazaka tourne entièrement dans ton périmètre souverain." : "Diagram: the Orazaka product runs entirely inside your sovereign perimeter."}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        borderRadius: "var(--kz-radius-xl)",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        boxShadow: "var(--kz-shadow-md)",
        overflow: "hidden",
      }}
    >
      {/* Header — product identity + sovereignty badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "14px 16px", borderBottom: "1px solid var(--kz-border-subtle)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
          <OrazakaMark size={26} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "13.5px", fontWeight: 750, color: "var(--kz-text-primary)", letterSpacing: "-0.01em" }}>Orazaka</span>
            <span style={{ fontSize: "10.5px", color: "var(--kz-text-muted)" }}>{c.product}</span>
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 9px", borderRadius: "9999px", background: "var(--kz-accent-soft)", color: "var(--kz-accent)", fontFamily: "var(--font-mono, monospace)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.02em" }}>
          <ShieldHex />
          {c.badge}
        </span>
      </div>

      {/* Sovereign perimeter frame */}
      <div style={{ padding: "20px 16px 16px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "16px",
            border: "1px dashed color-mix(in srgb, var(--kz-accent) 35%, var(--kz-border-default))",
            padding: "26px 16px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "color-mix(in srgb, var(--kz-accent-soft) 25%, transparent)",
          }}
        >
          {/* perimeter tab */}
          <span style={{ position: "absolute", top: "-9px", left: "50%", transform: "translateX(-50%)", padding: "2px 10px", borderRadius: "9999px", background: "var(--kz-surface-1)", border: "1px solid color-mix(in srgb, var(--kz-accent) 35%, var(--kz-border-default))", fontFamily: "var(--font-mono, monospace)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--kz-accent)", whiteSpace: "nowrap" }}>
            {c.perimeter}
          </span>

          <Chip id="router" active={active} setActive={setActive} c={c} />
          <Spine reduce={reduce} />
          <Chip id="core" emphasized active={active} setActive={setActive} c={c} />
          <Spine reduce={reduce} />
          <div className="sp-local-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <Chip id="llm" active={active} setActive={setActive} c={c} />
            <Chip id="vector" active={active} setActive={setActive} c={c} />
            <Chip id="sandbox" active={active} setActive={setActive} c={c} />
          </div>
        </div>
      </div>

      {/* Inspect caption — updates on hover/focus, defaults to the sovereignty promise */}
      <div aria-live="polite" style={{ minHeight: "40px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px 14px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: active ? "var(--kz-accent)" : "var(--kz-status-success)" }} className={reduce ? "" : "sp-dot"} />
        <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.45, color: active ? "var(--kz-text-secondary)" : "var(--kz-text-muted)" }}>
          {active ? c.nodes[active].role : c.idle}
        </p>
      </div>

      <style>{`
        .sp-chip:hover { border-color: var(--kz-accent) !important; }
        .sp-chip:focus-visible { outline: 2px solid var(--kz-accent); outline-offset: 2px; }
        @keyframes sp-travel { 0% { transform: translateY(-2px); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(24px); opacity: 0; } }
        .sp-packet { animation: sp-travel 2.4s ease-in-out infinite; }
        @keyframes sp-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .sp-dot { animation: sp-pulse 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sp-packet, .sp-dot { animation: none !important; } }
      `}</style>
    </div>
  );
}
