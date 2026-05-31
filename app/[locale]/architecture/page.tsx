import type { Metadata } from "next";
import architecture from "@/app/data/architecture.json";
import ArchitectureMesh from "../../components/illustrations/ArchitectureMesh";
import PageShell from "../../components/PageShell";

export const metadata: Metadata = {
  title: "Architecture — Krizaka",
  description:
    "An interactive view of the Orasaka platform architecture — modules, hexagonal dependencies and ports, generated directly from the code.",
};

export default function ArchitecturePage() {
  const moduleCount = architecture.modules.length;
  const edgeCount = architecture.dependencies.length;
  const stageCount = architecture.pipeline.length;

  return (
    <PageShell max="7xl">
      <header
        style={{
          maxWidth: "640px",
          marginInline: "auto",
          marginBottom: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--kz-accent)",
            margin: 0,
          }}
        >
          Architecture
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            margin: "12px 0 0",
          }}
        >
          A hexagon you can read.
        </h1>
        <p style={{ fontSize: "14.5px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "16px 0 0" }}>
          Orasaka&apos;s modules and their ports &amp; adapters, rendered live from{" "}
          <code style={{ color: "var(--kz-text-primary)" }}>architecture.json</code> — generated from
          the source, never hand-drawn. Hover a module to reveal its layer and its inbound &amp;
          outbound ports.
        </p>
      </header>

      <ArchitectureMesh modules={architecture.modules} dependencies={architecture.dependencies} />

      <dl
        style={{
          maxWidth: "440px",
          marginInline: "auto",
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          textAlign: "center",
        }}
      >
        {[
          { k: "Modules", v: moduleCount },
          { k: "Dependencies", v: edgeCount },
          { k: "Pipeline stages", v: stageCount },
        ].map((s) => (
          <div
            key={s.k}
            style={{
              padding: "12px",
              borderRadius: "var(--kz-radius-lg)",
              border: "1px solid var(--kz-border-default)",
              background: "var(--kz-surface-1)",
            }}
          >
            <dt style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--kz-text-muted)" }}>
              {s.k}
            </dt>
            <dd style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "var(--kz-text-primary)" }}>
              {s.v}
            </dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
