"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../../components/I18nProvider";
import PageShell from "../../components/PageShell";
import { ROADMAP, ROADMAP_VERSION, type LocalizedText, type RoadmapStatus } from "@/lib/roadmap-data";
import { CheckCircle2, CircleDot, HelpCircle, Cpu } from "lucide-react";

const STATUS_ORDER: RoadmapStatus[] = ["stable", "in-progress", "research"];

const STATUS_COLOR: Record<RoadmapStatus, string> = {
  stable: "var(--kz-status-success)",
  "in-progress": "var(--kz-accent)",
  research: "var(--kz-text-muted)",
};

const COPY = {
  fr: {
    eyebrow: "Roadmap",
    title: "Où va le moteur.",
    subtitle: "Construit au grand jour. Filtre par maturité — chaque item est aligné sur le code réel.",
    all: "Tout",
    status: { stable: "Stable", "in-progress": "En cours", research: "Recherche" } as Record<RoadmapStatus, string>,
    version: "Version",
    impacted: "Intercepteurs impactés",
  },
  en: {
    eyebrow: "Roadmap",
    title: "Where the engine is going.",
    subtitle: "Built in the open. Filter by maturity — every item is aligned with the real code.",
    all: "All",
    status: { stable: "Stable", "in-progress": "In progress", research: "Research" } as Record<RoadmapStatus, string>,
    version: "Version",
    impacted: "Impacted Interceptors",
  },
} as const;

// Mapping roadmap items to concrete Orasaka engine components/interceptors
const itemInterceptors: Record<string, string[]> = {
  "sovereign-chat": ["UserContextResolver", "SystemContextInjector", "RagInterceptor"],
  "capability-registry": ["RouterInterceptor", "SystemContextInjector"],
  "hexagonal-arch": ["OrasakaCore", "PipelineMesh"],
  "identity-rbac": ["UserContextResolver", "AuditInterceptor"],
  "app-factory": ["RouterInterceptor", "SystemContextInjector"],
  "intention-ingress": ["UserContextResolver", "RouterInterceptor"],
  "media-generation": ["MediaInterceptor"],
  "agentic-planning": ["ToolInterceptor", "RefinerInterceptor"],
  "krizaka-cloud": ["CostShieldInterceptor", "AuditInterceptor"],
  "enterprise-packages": ["ValidationLoopInterceptor", "SafetyGuardrailsInterceptor"],
};

export default function RoadmapClient() {
  const { locale } = useI18n();
  const L = (x: LocalizedText) => x[locale];
  const c = COPY[locale];
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<RoadmapStatus | "all">("all");

  const items = useMemo(
    () => (filter === "all" ? ROADMAP : ROADMAP.filter((i) => i.status === filter)),
    [filter]
  );

  const tabs: Array<RoadmapStatus | "all"> = ["all", ...STATUS_ORDER];

  return (
    <PageShell max="5xl">
      <header
        style={{
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
        className="roadmap-header"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--kz-accent)",
              margin: 0,
            }}
          >
            {c.eyebrow}
          </p>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "9999px",
              border: "1px solid var(--kz-border-subtle)",
              background: "var(--kz-surface-2)",
              color: "var(--kz-text-muted)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              fontWeight: 600,
            }}
          >
            {c.version} {ROADMAP_VERSION}
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3rem)",
            fontWeight: 850,
            letterSpacing: "-0.035em",
            color: "var(--kz-text-primary)",
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "var(--kz-text-secondary)",
            margin: "0 0 40px",
            maxWidth: "600px",
          }}
        >
          {c.subtitle}
        </p>
      </header>

      {/* Dev Progress Telemetry Widgets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          maxWidth: "860px",
          margin: "0 auto 40px",
          width: "100%"
        }}
      >
        <div style={{ padding: "20px", borderRadius: "14px", background: "var(--kz-surface-1)", border: "1px solid var(--kz-border-subtle)", display: "flex", alignItems: "center", gap: "16px", boxShadow: "var(--kz-shadow-sm)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", backgroundImage: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <span style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.08)", color: "var(--kz-status-success)", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={20} />
          </span>
          <div>
            <div style={{ fontSize: "10px", fontFamily: "var(--font-mono, monospace)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Stable</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--kz-text-primary)", marginTop: "2px" }}>4 {locale === "fr" ? "Modules" : "Modules"}</div>
          </div>
        </div>

        <div style={{ padding: "20px", borderRadius: "14px", background: "var(--kz-surface-1)", border: "1px solid var(--kz-border-subtle)", display: "flex", alignItems: "center", gap: "16px", boxShadow: "var(--kz-shadow-sm)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", backgroundImage: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <span style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "10px", background: "var(--kz-accent-soft)", color: "var(--kz-accent)", alignItems: "center", justifyContent: "center" }} className="animate-pulse">
            <CircleDot size={20} />
          </span>
          <div>
            <div style={{ fontSize: "10px", fontFamily: "var(--font-mono, monospace)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{locale === "fr" ? "En développement" : "In Development"}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--kz-text-primary)", marginTop: "2px" }}>3 {locale === "fr" ? "Modules" : "Modules"}</div>
          </div>
        </div>

        <div style={{ padding: "20px", borderRadius: "14px", background: "var(--kz-surface-1)", border: "1px solid var(--kz-border-subtle)", display: "flex", alignItems: "center", gap: "16px", boxShadow: "var(--kz-shadow-sm)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", backgroundImage: "radial-gradient(circle, rgba(156, 163, 175, 0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <span style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "10px", background: "var(--kz-surface-2)", color: "var(--kz-text-muted)", alignItems: "center", justifyContent: "center" }}>
            <HelpCircle size={20} />
          </span>
          <div>
            <div style={{ fontSize: "10px", fontFamily: "var(--font-mono, monospace)", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{locale === "fr" ? "R&D / Recherche" : "R&D / Research"}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--kz-text-primary)", marginTop: "2px" }}>3 {locale === "fr" ? "Concepts" : "Concepts"}</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "48px",
        }}
        role="tablist"
        aria-label={c.eyebrow}
      >
        {tabs.map((tab) => {
          const active = filter === tab;
          const label = tab === "all" ? c.all : c.status[tab];
          const dot = tab === "all" ? "var(--kz-accent)" : STATUS_COLOR[tab];
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid",
                borderColor: active ? "var(--kz-accent)" : "var(--kz-border-default)",
                background: active ? "var(--kz-accent-soft)" : "var(--kz-surface-1)",
                color: active ? "var(--kz-text-primary)" : "var(--kz-text-secondary)",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              className="roadmap-filter-btn"
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: dot,
                }}
              />
              {label}
            </button>
          );
        })}
      </div>

      {/* Timeline Layout */}
      <div className="roadmap-timeline-container" style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>
        
        {/* Animated SMIL SVG Fiber Conduit in the background (Desktop) */}
        <svg
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "10px",
            bottom: "10px",
            width: "4px",
            height: "calc(100% - 20px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
          className="hidden md:block"
        >
          <line x1="2" y1="0" x2="2" y2="100%" stroke="var(--kz-border-strong)" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="2" cy="0" r="3.5" fill="var(--kz-accent)" filter="drop-shadow(0 0 4px var(--kz-accent))">
            <animate attributeName="cy" from="0%" to="100%" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="2" cy="0" r="3" fill="#f59e0b" filter="drop-shadow(0 0 4px #f59e0b)">
            <animate attributeName="cy" from="0%" to="100%" dur="11s" begin="3s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Animated SMIL SVG Fiber Conduit in the background (Mobile) */}
        <svg
          style={{
            position: "absolute",
            left: "8px",
            transform: "translateX(-50%)",
            top: "10px",
            bottom: "10px",
            width: "4px",
            height: "calc(100% - 20px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
          className="block md:hidden"
        >
          <line x1="2" y1="0" x2="2" y2="100%" stroke="var(--kz-border-strong)" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="2" cy="0" r="3.5" fill="var(--kz-accent)" filter="drop-shadow(0 0 4px var(--kz-accent))">
            <animate attributeName="cy" from="0%" to="100%" dur="5s" repeatCount="indefinite" />
          </circle>
        </svg>

        {items.map((item, i) => {
          const isLeft = i % 2 === 0;
          const interceptors = itemInterceptors[item.id] || [];
          
          // Generate a mock hex PID for tech aesthetics (stable per item)
          const mockPID = (() => {
            const sum = item.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hex = ((sum * 17) % 65535).toString(16).toUpperCase();
            return `0x${hex.padStart(4, "0")}`;
          })();

          return (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 15 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
              className={`roadmap-item-wrapper ${isLeft ? "left-item" : "right-item"}`}
            >
              {/* Timeline Bullet Ring */}
              <div
                className="roadmap-bullet"
                style={{
                  borderColor: STATUS_COLOR[item.status],
                  boxShadow: `0 0 12px ${STATUS_COLOR[item.status]}`,
                }}
              />

              {/* Timeline Item Card */}
              <article
                className="roadmap-card"
                style={{
                  padding: "24px 28px",
                  borderRadius: "var(--kz-radius-lg)",
                  background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid var(--kz-border-subtle)",
                  position: "relative",
                  transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                  overflow: "hidden",
                }}
              >
                {/* Thin top accent border */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: STATUS_COLOR[item.status],
                    opacity: 0.8,
                  }}
                />

                {/* Telemetry info header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.04)", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "var(--kz-radius-sm)",
                        fontSize: "9px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: STATUS_COLOR[item.status],
                        background: `color-mix(in srgb, ${STATUS_COLOR[item.status]} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${STATUS_COLOR[item.status]} 20%, transparent)`,
                      }}
                    >
                      {c.status[item.status]}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "9.5px", color: "var(--kz-text-muted)", opacity: 0.7 }}>
                      PID: {mockPID}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--kz-text-muted)",
                      background: "var(--kz-surface-2)",
                      border: "1px solid var(--kz-border-subtle)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {L(item.area)}
                  </span>
                </div>

                {/* Main content */}
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "17px",
                    fontWeight: 800,
                    color: "var(--kz-text-primary)",
                    margin: "0 0 8px 0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {L(item.title)}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    lineHeight: 1.65,
                    color: "var(--kz-text-secondary)",
                    margin: "0 0 16px 0",
                  }}
                >
                  {L(item.desc)}
                </p>

                {/* Technical interceptors mapping */}
                {interceptors.length > 0 && (
                  <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.04)", paddingTop: "12px", marginTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <Cpu size={12} style={{ color: STATUS_COLOR[item.status] }} />
                      <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "9px", fontWeight: 700, color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {c.impacted}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {interceptors.map((inc) => (
                        <span
                          key={inc}
                          style={{
                            fontFamily: "var(--font-mono, monospace)",
                            fontSize: "9.5px",
                            fontWeight: 700,
                            background: "var(--kz-surface-2)",
                            border: "1px solid var(--kz-border-subtle)",
                            color: "var(--kz-text-secondary)",
                            padding: "2px 8px",
                            borderRadius: "5px",
                            transition: "all 150ms ease",
                          }}
                          className="hover:border-[var(--kz-accent)] hover:text-[var(--kz-text-primary)]"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .roadmap-filter-btn:hover {
          border-color: var(--kz-accent) !important;
          color: var(--kz-text-primary) !important;
        }
        .roadmap-timeline-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }
        /* Central vertical line on desktop */
        @media (min-width: 769px) {
          .roadmap-timeline-container::before {
            content: "";
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 10px;
            bottom: 10px;
            width: 2px;
            background: linear-gradient(to bottom, var(--kz-border-strong), var(--kz-border-subtle) 90%, transparent);
            z-index: 1;
            display: none; /* replaced by SVG conduit */
          }
        }
        .roadmap-item-wrapper {
          position: relative;
          width: 100%;
          display: flex;
        }
        .roadmap-bullet {
          position: absolute;
          left: 50%;
          top: 24px;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--kz-surface-0);
          border-width: 3px;
          border-style: solid;
          z-index: 2;
          transition: all 200ms ease;
        }
        .roadmap-item-wrapper:hover .roadmap-bullet {
          transform: translate(-50%, -50%) scale(1.3) !important;
        }
        /* Desktop alignment */
        @media (min-width: 769px) {
          .left-item {
            justify-content: flex-start;
          }
          .left-item .roadmap-card {
            width: calc(50% - 24px);
          }
          .left-item .roadmap-card:hover {
            transform: translateX(-4px) translateY(-2px);
          }
          .right-item {
            justify-content: flex-end;
          }
          .right-item .roadmap-card {
            width: calc(50% - 24px);
          }
          .right-item .roadmap-card:hover {
            transform: translateX(4px) translateY(-2px);
          }
        }
        .roadmap-card {
          box-shadow: var(--kz-shadow-sm);
        }
        .roadmap-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 12px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.08));
        }
        /* Mobile alignment */
        @media (max-width: 768px) {
          .roadmap-timeline-container::before {
            content: "";
            position: absolute;
            left: 8px;
            top: 10px;
            bottom: 10px;
            width: 2px;
            background: linear-gradient(to bottom, var(--kz-border-strong), var(--kz-border-subtle) 90%, transparent);
            z-index: 1;
            display: none; /* replaced by SVG conduit */
          }
          .roadmap-item-wrapper {
            justify-content: flex-start !important;
            padding-left: 28px !important;
          }
          .roadmap-bullet {
            left: 8px !important;
            transform: translate(-50%, -50%) !important;
          }
          .left-item .roadmap-card,
          .right-item .roadmap-card {
            width: 100% !important;
          }
          .left-item .roadmap-card:hover,
          .right-item .roadmap-card:hover {
            transform: translateX(4px) translateY(-2px) !important;
          }
        }
      `}</style>
    </PageShell>
  );
}
