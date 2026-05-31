"use client";

import { useI18n } from "./I18nProvider";

const STACK_ITEMS = [
  { label: "Java", version: "21", color: "hsl(25, 95%, 53%)" },
  { label: "Spring Boot", version: "3.5", color: "hsl(140, 60%, 48%)" },
  { label: "Spring AI", version: "1.1", color: "hsl(140, 60%, 48%)" },
  { label: "Ollama", version: "", color: "hsl(210, 12%, 60%)" },
  { label: "Next.js", version: "16", color: "hsl(0, 0%, 80%)" },
  { label: "Expo SDK", version: "53", color: "hsl(250, 60%, 60%)" },
  { label: "PostgreSQL", version: "+ pgvector", color: "hsl(210, 60%, 55%)" },
  { label: "Redis", version: "", color: "hsl(0, 65%, 55%)" },
  { label: "RabbitMQ", version: "", color: "hsl(25, 90%, 55%)" },
  { label: "Docker", version: "", color: "hsl(207, 82%, 55%)" },
];

export default function TechStackSection() {
  const { t } = useI18n();

  return (
    <section
      id="tech-stack"
      style={{
        padding: "64px 24px",
        maxWidth: "1120px",
        margin: "0 auto",
      }}
    >
      {/* ─── Section header ─── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "36px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--kz-accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {t.techStack.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            marginBottom: "8px",
          }}
        >
          {t.techStack.sectionTitle}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--kz-text-muted)",
            maxWidth: "480px",
            lineHeight: 1.6,
          }}
        >
          {t.techStack.sectionDesc}
        </p>
      </div>

      {/* ─── Tech pills ─── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {STACK_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "12px",
              color: "var(--kz-text-secondary)",
              letterSpacing: "0.02em",
              transition: "border-color 150ms ease, box-shadow 150ms ease",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 6px ${item.color}40`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 500, color: "var(--kz-text-primary)" }}>
              {item.label}
            </span>
            {item.version && (
              <span style={{ color: "var(--kz-text-muted)", fontSize: "11px" }}>
                {item.version}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
