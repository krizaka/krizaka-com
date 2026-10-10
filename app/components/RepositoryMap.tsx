/* ─────────────────────────────────────────────────────────────────────────
   REPOSITORY MAP — where each Orazaka component lives on GitHub
   ─────────────────────────────────────────────────────────────────────────
   Orazaka is one repository per component in the krizaka organisation, so an
   application can take only what it needs (users, notifications, billing…).
   The list is NOT hand-authored: it is `repositories` in the generated
   app/data/architecture.json, itself read from orazaka.workspace.json by
   `orazaka docs build` and copied here by `orazaka docs sync` (AGENTS.md §2).
   Server component · tokens only (var(--kz-*)) · per-layer mid-tone accents.
   ───────────────────────────────────────────────────────────────────────── */

import { ArrowUpRight, Boxes, Cpu, LayoutGrid, Layers, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GITHUB_ORG_URL } from "@/lib/site";
import { getDictionary, format } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { Card } from "@krizaka/ui/card";


export interface RepositoryEntry {
  name: string;
  url: string;
  path: string;
  kind: string;
  layer: string;
  description: string;
  dependsOn: string[];
}

/** Title and intro: messages → pages.repositoryMap.layers.<layer>. */
interface LayerMeta {
  icon: LucideIcon;
  color: string;
}

/* Order = how a reader meets the platform: reusable bricks first. */
const LAYERS: [string, LayerMeta][] = [
  [
    "foundation",
    {
      icon: Layers,
      color: "#0ea5e9",
    },
  ],
  [
    "domain",
    {
      icon: Boxes,
      color: "#10b981",
    },
  ],
  [
    "ai",
    {
      icon: Cpu,
      color: "#6366f1",
    },
  ],
  [
    "worker",
    {
      icon: Cpu,
      color: "#f59e0b",
    },
  ],
  [
    "app",
    {
      icon: LayoutGrid,
      color: "#8b5cf6",
    },
  ],
  [
    "content",
    {
      icon: Package,
      color: "#f43f5e",
    },
  ],
];

const KIND_LABEL: Record<string, string> = {
  maven: "Spring · Maven",
  npm: "Next.js · npm",
  python: "Python",
  packs: "Packs",
};

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

/** A repository: the @krizaka/ui card, as a link. */
function RepositoryCard({ repo, color }: { repo: RepositoryEntry; color: string }) {
  return (
    <Card.Root asChild interactive radius="xl">
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        gap: "10px",
        padding: "18px 18px 16px",
        textDecoration: "none",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "13.5px",
            fontWeight: 700,
            overflowWrap: "anywhere",
          }}
        >
          {repo.name}
        </span>
        <ArrowUpRight size={16} aria-hidden="true" style={{ flexShrink: 0, color: "var(--kz-text-muted)" }} />
      </div>
      <span
        style={{
          alignSelf: "flex-start",
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          padding: "3px 8px",
          borderRadius: "999px",
          color: "var(--kz-text-secondary)",
          background: mix(color, 12),
          border: `1px solid ${mix(color, 30)}`,
        }}
      >
        {KIND_LABEL[repo.kind] ?? repo.kind}
      </span>
      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>
        {repo.description}
      </p>
      {repo.dependsOn.length > 0 && (
        <p
          style={{
            margin: "auto 0 0",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "10.5px",
            lineHeight: 1.6,
            color: "var(--kz-text-muted)",
            overflowWrap: "anywhere",
          }}
        >
          ← {repo.dependsOn.join(" · ")}
        </p>
      )}
    </a>
    </Card.Root>
  );
}

export default function RepositoryMap({
  repositories,
  locale,
}: {
  repositories: RepositoryEntry[];
  locale: string;
}) {
  const text = getDictionary(locale).pages.repositoryMap;
  if (repositories.length === 0) return null;

  return (
    <section
      id="repositories"
      aria-labelledby="repositories-title"
      style={{ maxWidth: "80rem", margin: "0 auto", padding: "8px 20px 96px" }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto 40px", textAlign: "center" }} {...reveal()}>
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
          {text.sourceCode}
        </p>
        <h2
          id="repositories-title"
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "12px 0 0",
          }}
        >
          {text.oneRepositoryPerComponent}
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "14px 0 0" }}>
          {format(text.openSourceRepositoriesApache2, { p0: repositories.length })}
          <a href={`${GITHUB_ORG_URL}/orazaka`} style={{ color: "var(--kz-accent)" }}>
            krizaka/orazaka
          </a>
          .
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {LAYERS.map(([layer, meta]) => {
          const inLayer = repositories.filter((r) => r.layer === layer);
          if (inLayer.length === 0) return null;
          const Icon = meta.icon;
          return (
            <div key={layer} {...reveal(0, "soft")}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", margin: "0 0 14px" }}>
                <Icon size={16} aria-hidden="true" style={{ color: meta.color, alignSelf: "center" }} />
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  {text.layers[layer as keyof typeof text.layers].title}
                </h3>
                <span style={{ fontSize: "13px", color: "var(--kz-text-muted)" }}>{text.layers[layer as keyof typeof text.layers].intro}</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
                  gap: "14px",
                }}
              >
                {inLayer.map((repo) => (
                  <RepositoryCard key={repo.name} repo={repo} color={meta.color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
