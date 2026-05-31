import Link from "next/link";

/* ─── Tech stack items ─── */
const STACK = [
  { label: "Java", version: "21", color: "hsl(25, 95%, 53%)" },
  { label: "Spring Boot", version: "3.5", color: "hsl(140, 60%, 48%)" },
  { label: "Spring AI", version: "1.1.6", color: "hsl(140, 60%, 48%)" },
  { label: "Next.js", version: "16", color: "hsl(0, 0%, 80%)" },
  { label: "Expo SDK", version: "53", color: "hsl(250, 60%, 60%)" },
  { label: "macOS", version: "Apple Silicon", color: "hsl(0, 0%, 65%)" },
];

/* ─── Quick start steps ─── */
const QUICK_STEPS = [
  {
    step: "01",
    title: "Configure",
    cmd: "npx orasaka install",
    desc: "Interactive wizard — detects hardware, configures topology, generates .env",
  },
  {
    step: "02",
    title: "Launch Infra",
    cmd: "npx orasaka start",
    desc: "Postgres, Redis, RabbitMQ, Ollama, LocalAI — all containerized",
  },
  {
    step: "03",
    title: "Build & Run",
    cmd: "npx orasaka dev",
    desc: "Gateway + 2 web apps + mobile + AI engines — in parallel",
  },
];

/* ─── Module cards ─── */
const MODULES = [
  {
    id: "core",
    name: "Core Engine",
    desc: "Stateless AI orchestration with 15 pipeline interceptors",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
    href: "/products/orasaka/architecture/core",
  },
  {
    id: "identity",
    name: "Identity & Auth",
    desc: "OAuth2, RBAC, BCrypt — zero web dependencies",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    href: "/products/orasaka/core-features/auth",
  },
  {
    id: "gateway",
    name: "Gateway BFF",
    desc: "GraphQL, REST, SSE — sole boundary between hexagons",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    href: "/products/orasaka/architecture/architecture",
  },
  {
    id: "tools",
    name: "Tool Registry",
    desc: "MCP clients, Caffeine cache, external API adapters",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    href: "/products/orasaka/core-features/automation",
  },
  {
    id: "cli",
    name: "Developer CLI",
    desc: "Setup wizard, diagnostics, full-stack orchestrator",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    href: "/products/orasaka/api/cli",
  },
  {
    id: "ui",
    name: "Cinematic UI",
    desc: "Next.js 16 + Expo SDK 53 — glassmorphic dark mode",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    href: "/products/orasaka/ui-guidelines/ui_reference",
  },
];

/* ─── Doc links ─── */
const DOCS = [
  { title: "Developer Onboarding (101)", href: "/products/orasaka/getting-started/101", category: "Start" },
  { title: "Architecture Reference", href: "/products/orasaka/architecture/architecture", category: "Core" },
  { title: "API Reference", href: "/products/orasaka/api/api_reference", category: "Core" },
  { title: "Auth & Security", href: "/products/orasaka/core-features/auth", category: "Core" },
  { title: "Model Catalog", href: "/products/orasaka/architecture/models", category: "Core" },
  { title: "CLI Reference", href: "/products/orasaka/api/cli", category: "Ops" },
  { title: "Deployment (IaC)", href: "/products/orasaka/operations/deploy", category: "Ops" },
  { title: "Feature Matrix", href: "/products/orasaka/core-features/master_features", category: "Ops" },
];

export default function OrasakaOverview() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      {/* ═══ HERO ═══ */}
      <section
        className="overview-hero"
        style={{
          textAlign: "center",
          padding: "48px 0 40px",
        }}
      >
        {/* Orasaka mark */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--kz-radius-md)",
            background: "var(--kz-surface-2)",
            border: "1px solid var(--kz-border-subtle)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg width="28" height="28" viewBox="-56 -56 112 112" fill="none">
            <path d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2" stroke="var(--kz-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            <path d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2" stroke="var(--kz-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
            <path d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2" stroke="var(--kz-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="0" cy="0" r="9" fill="var(--kz-accent)" opacity="0.9" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Orasaka
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--kz-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "0 0 16px",
          }}
        >
          Sovereign AI Orchestration Engine
        </p>
        <p
          style={{
            fontSize: 15,
            color: "var(--kz-text-secondary)",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto 24px",
          }}
        >
          Ship enterprise-grade, multi-modal AI products — Chat · Image · Video
          · Speech · RAG · MCP — entirely on your own infrastructure.
        </p>

        {/* Tech stack pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {STACK.map((s) => (
            <span
              key={s.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--kz-text-muted)",
                letterSpacing: "0.02em",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: s.color,
                  boxShadow: `0 0 4px ${s.color}50`,
                }}
              />
              {s.label}
              <span style={{ color: "var(--kz-text-primary)", fontWeight: 500 }}>
                {s.version}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <hr style={{ border: "none", height: 1, background: "var(--kz-border-subtle)", margin: "0 0 32px" }} />

      {/* ═══ QUICK START ═══ */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 650,
            color: "var(--kz-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Quick Start
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {QUICK_STEPS.map((s) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 16,
                padding: "14px 18px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--kz-accent)",
                  opacity: 0.6,
                  lineHeight: 1,
                  paddingTop: 2,
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--kz-text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {s.title}
                </div>
                <code
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "var(--kz-surface-2)",
                    border: "1px solid var(--kz-border-subtle)",
                    color: "var(--kz-accent)",
                    marginBottom: 4,
                  }}
                >
                  {s.cmd}
                </code>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--kz-text-muted)",
                    margin: "4px 0 0",
                    lineHeight: 1.4,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MODULES ═══ */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 650,
            color: "var(--kz-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Architecture Modules
        </h2>
        <div
          className="overview-modules-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          {MODULES.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 16px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                textDecoration: "none",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--kz-radius-sm)",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--kz-accent)",
                }}
              >
                {m.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--kz-text-primary)",
                    lineHeight: 1.3,
                    marginBottom: 2,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--kz-text-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  {m.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ DOCUMENTATION ═══ */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 650,
            color: "var(--kz-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Documentation
        </h2>
        <div
          style={{
            borderRadius: "var(--kz-radius-md)",
            border: "1px solid var(--kz-border-subtle)",
            overflow: "hidden",
            background: "var(--kz-surface-1)",
          }}
        >
          {DOCS.map((d, i) => (
            <Link
              key={d.href}
              href={d.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom:
                  i < DOCS.length - 1
                    ? "1px solid var(--kz-border-subtle)"
                    : "none",
                textDecoration: "none",
                transition: "background 0.12s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 600,
                    color: "var(--kz-text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "var(--kz-surface-2)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    border: "1px solid var(--kz-border-subtle)",
                    minWidth: 36,
                    textAlign: "center",
                  }}
                >
                  {d.category}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--kz-text-secondary)",
                    fontWeight: 450,
                  }}
                >
                  {d.title}
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--kz-text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, opacity: 0.5 }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PRINCIPLES ═══ */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 650,
            color: "var(--kz-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Design Principles
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              title: "Zero Cloud Dependencies",
              desc: "Every LLM call, vector query, and model inference stays on your network. GDPR/Loi 25 compliant by architecture.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
            },
            {
              title: "Compile-Time Governance",
              desc: "ArchUnit tests enforce hexagonal boundaries. Violations fail the build. No runtime surprises.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              ),
            },
            {
              title: "Single Command Dev",
              desc: "npx orasaka dev launches Gateway, web clients, mobile app, and AI engines in parallel. One command, full stack.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              ),
            },
          ].map((p) => (
            <div
              key={p.title}
              style={{
                display: "flex",
                gap: 14,
                padding: "14px 16px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
              }}
            >
              <div style={{ color: "var(--kz-accent)", flexShrink: 0, paddingTop: 1 }}>
                {p.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--kz-text-primary)",
                    marginBottom: 3,
                  }}
                >
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--kz-text-muted)", lineHeight: 1.5 }}>
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ RESPONSIVE ═══ */}
      <style>{`
        @media (max-width: 480px) {
          .overview-hero {
            padding: 28px 0 24px !important;
          }
          .overview-hero h1 {
            font-size: 22px !important;
          }
          .overview-modules-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .overview-modules-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
