"use client";

/* ─────────────────────────────────────────────────────────────────────────
   ARCHITECTURE MESH — "The journey of a request"
   A calm, premium, fully theme-aware schema of the Orazaka platform.

   The architecture reads as a left→right (desktop) / top→bottom (mobile)
   request journey across six numbered stages. Each component is a clean
   card with a semantic Lucide icon; each stage carries a discreet mascot
   guide as a brand touch. One accent color per stage groups the flow.

   Only `var(--kz-*)` tokens are used for surfaces / text / borders; the
   six stage colors are semantic mid-tone accents that read on dark & light.
   ───────────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  ChevronDown,
  Folder,
  Monitor,
  SlidersHorizontal,
  Smartphone,
  Terminal,
  Network,
  ShieldCheck,
  Workflow,
  Cpu,
  Layers,
  Boxes,
  Film,
  Plug,
  Database,
} from "lucide-react";
import { useI18n } from "../I18nProvider";

type Loc = "fr" | "en";
type IconType = React.ComponentType<{
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}>;

/* ─── DISCREET BRAND MASCOTS (guides, static) ─────────────────────────── */

function DuckAvatar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <defs>
        <linearGradient id="mz-duck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#mz-duck)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      <rect x="8" y="14" width="28" height="10" rx="5" fill="#0f172a" opacity="0.85" />
      <circle cx="15" cy="19" r="3.5" fill="#e2e8f0" /><circle cx="29" cy="19" r="3.5" fill="#e2e8f0" />
      <path d="M 16 25 Q 22 31 28 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
    </svg>
  );
}

function FalconAvatar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <defs>
        <linearGradient id="mz-falcon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#mz-falcon)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      <rect x="10" y="15" width="24" height="8" rx="4" fill="#1e293b" opacity="0.9" />
      <circle cx="16" cy="19" r="2.5" fill="#e2e8f0" /><circle cx="28" cy="19" r="2.5" fill="#e2e8f0" />
      <polygon points="20,24 24,24 22,29" fill="#fef3c7" />
    </svg>
  );
}

function OwlAvatar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <defs>
        <linearGradient id="mz-owl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#mz-owl)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      <polygon points="12,12 16,6 18,13" fill="#3730a3" /><polygon points="32,12 28,6 26,13" fill="#3730a3" />
      <circle cx="16" cy="20" r="4.5" fill="#e2e8f0" /><circle cx="28" cy="20" r="4.5" fill="#e2e8f0" />
      <circle cx="16" cy="20" r="2" fill="#1e1b4b" /><circle cx="28" cy="20" r="2" fill="#1e1b4b" />
      <polygon points="20,22 24,22 22,26" fill="#fbbf24" />
    </svg>
  );
}

function FlamingoAvatar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <defs>
        <linearGradient id="mz-flam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#mz-flam)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      <path d="M 22 28 Q 14 18 20 12" stroke="url(#mz-flam)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="12" r="5" fill="#6ee7b7" />
      <path d="M 23 13 L 28 12 L 23 15 Z" fill="#fbbf24" />
    </svg>
  );
}

const MASCOTS: Record<string, (p: { size?: number }) => React.ReactElement> = {
  duck: DuckAvatar,
  falcon: FalconAvatar,
  owl: OwlAvatar,
  flamingo: FlamingoAvatar,
};

/* ─── STAGES (the six-step request journey) ───────────────────────────── */

interface Stage {
  id: number;
  num: string;
  title: Record<Loc, string>;
  subtitle: Record<Loc, string>;
  color: string;
  mascot?: keyof typeof MASCOTS;
  hub?: boolean;
}

const STAGES: Stage[] = [
  { id: 1, num: "01", color: "#0ea5e9", mascot: "duck",
    title: { fr: "Présentation", en: "Presentation" },
    subtitle: { fr: "Points d'entrée", en: "Entry points" } },
  { id: 2, num: "02", color: "#8b5cf6",
    title: { fr: "Portail d'entrée", en: "Entry Gate" },
    subtitle: { fr: "Routage REST · SSE", en: "REST · SSE routing" } },
  { id: 3, num: "03", color: "#f59e0b", mascot: "falcon",
    title: { fr: "Sécurité & Métier", en: "Security & Logic" },
    subtitle: { fr: "RBAC · règles", en: "RBAC · rules" } },
  { id: 4, num: "04", color: "#6366f1", mascot: "owl", hub: true,
    title: { fr: "Moteur Cognitif", en: "Cognitive Engine" },
    subtitle: { fr: "Le cœur hexagonal", en: "The hexagonal core" } },
  { id: 5, num: "05", color: "#10b981", mascot: "flamingo",
    title: { fr: "Workers & Pipeline", en: "Workers & Pipeline" },
    subtitle: { fr: "Async · intercepteurs", en: "Async · interceptors" } },
  { id: 6, num: "06", color: "#f43f5e",
    title: { fr: "Stockage", en: "Persistence" },
    subtitle: { fr: "Données souveraines", en: "Sovereign data" } },
];

/* ─── NODES (15 components, grouped by stage) ─────────────────────────── */

interface Node {
  id: string;
  stage: number;
  icon: IconType;
  tag: Record<Loc, string>;
  layer: Record<Loc, string>;
  label: Record<Loc, string>;
  desc: Record<Loc, string>;
  path: string;
  hub?: boolean;
}

const NODES: Node[] = [
  // ── Stage 1 · Presentation ──
  {
    id: "orazaka-web-client", stage: 1, icon: Monitor,
    tag: { fr: "Web", en: "Web" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "Console Client Web", en: "Web Client Console" },
    desc: {
      fr: "Application client Next.js principale : chat, génération d'images/vidéos et interaction avec l'IA.",
      en: "Main Next.js client application: chat, image/video generation and AI interaction.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-web-client",
  },
  {
    id: "orazaka-web-admin", stage: 1, icon: SlidersHorizontal,
    tag: { fr: "Admin", en: "Admin" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "Console d'Administration", en: "Administration Console" },
    desc: {
      fr: "Console SecOps isolée (port 3001) pour gérer les modèles, le pipeline et la conformité.",
      en: "Isolated SecOps console (port 3001) for model, pipeline and compliance management.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-web-admin",
  },
  {
    id: "orazaka-mobile-client", stage: 1, icon: Smartphone,
    tag: { fr: "Mobile", en: "Mobile" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "Application Mobile", en: "Mobile Application" },
    desc: {
      fr: "Application mobile cross-platform (Expo SDK 53) pour l'accès à l'IA en déplacement.",
      en: "Cross-platform mobile app (Expo SDK 53) for on-the-go access to the AI engine.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-mobile-client",
  },
  {
    id: "orazaka-cli", stage: 1, icon: Terminal,
    tag: { fr: "CLI", en: "CLI" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "CLI Orazaka", en: "Orazaka CLI" },
    desc: {
      fr: "Interface en ligne de commande pour l'automatisation, avec file d'attente locale SQLite.",
      en: "Command-line interface for automation, with a local SQLite job queue.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-cli",
  },

  // ── Stage 2 · Entry Gate ──
  {
    id: "orazaka-router", stage: 2, icon: Network,
    tag: { fr: "API", en: "API" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "Portail d'entrée", en: "Entry Gate" },
    desc: {
      fr: "Réceptionne les requêtes (API REST & SSE) et les achemine vers le moteur d'orchestration.",
      en: "Receives requests (REST & SSE API) and routes them into the orchestration engine.",
    },
    path: "orazaka-apps/orazaka-router",
  },

  // ── Stage 3 · Security & Logic ──
  {
    id: "orazaka-identity", stage: 3, icon: ShieldCheck,
    tag: { fr: "RBAC", en: "RBAC" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Sécurité & RBAC", en: "Security & RBAC" },
    desc: {
      fr: "Authentifie les requêtes, valide les permissions (RBAC) et applique les quotas par locataire.",
      en: "Authenticates requests, validates permissions (RBAC) and enforces per-tenant quotas.",
    },
    path: "orazaka-framework/orazaka-identity",
  },
  {
    id: "orazaka-business", stage: 3, icon: Workflow,
    tag: { fr: "Métier", en: "Logic" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Gouvernance Métier", en: "Business Logic" },
    desc: {
      fr: "Règles d'affaires, gabarits de prompts et structuration des cas d'usage cognitifs.",
      en: "Business rules, prompt templates and structuring of cognitive use-cases.",
    },
    path: "orazaka-framework/orazaka-business",
  },

  // ── Stage 4 · Cognitive Engine (hub) ──
  {
    id: "orazaka-core", stage: 4, icon: Cpu, hub: true,
    tag: { fr: "Core", en: "Core" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Moteur Cognitif", en: "Cognitive Engine" },
    desc: {
      fr: "Le cœur d'Orazaka. Coordonne l'exécution sans état des requêtes IA et orchestre le flux de données.",
      en: "The heart of Orazaka. Coordinates stateless AI request execution and orchestrates the data flow.",
    },
    path: "orazaka-framework/orazaka-core",
  },

  // ── Stage 5 · Workers & Pipeline ──
  {
    id: "orazaka-interceptors", stage: 5, icon: Layers,
    tag: { fr: "Pipeline", en: "Pipeline" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Pipeline de Cognition", en: "Cognitive Pipeline" },
    desc: {
      fr: "Assemble les 15 intercepteurs (contexte système, mémoire, RAG, sécurité) pour enrichir la requête.",
      en: "Assembles the 15 interceptors (system context, memory, RAG, safety) to enrich requests.",
    },
    path: "orazaka-framework/orazaka-interceptors",
  },
  {
    id: "orazaka-worker-integrations", stage: 5, icon: Boxes,
    tag: { fr: "Intégrations", en: "Integrations" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "Worker Intégrations", en: "Integrations Worker" },
    desc: {
      fr: "Service d'arrière-plan asynchrone : files d'intégration et tâches système.",
      en: "Asynchronous background service running integration queues and system tasks.",
    },
    path: "orazaka-apps/orazaka-workers/orazaka-worker-integrations",
  },
  {
    id: "orazaka-worker-media", stage: 5, icon: Film,
    tag: { fr: "Médias", en: "Media" }, layer: { fr: "Application", en: "Application" },
    label: { fr: "Worker Médias", en: "Media Worker" },
    desc: {
      fr: "Traitement lourd d'images, vidéos et voix, hors du thread d'API principal.",
      en: "Heavy image, video and audio generation, off the main API thread.",
    },
    path: "orazaka-apps/orazaka-workers/orazaka-worker-media",
  },
  {
    id: "orazaka-tools", stage: 5, icon: Plug,
    tag: { fr: "MCP", en: "MCP" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Intégrations MCP", en: "MCP Integrations" },
    desc: {
      fr: "Connexion sécurisée aux outils externes (bases, APIs) via le Model Context Protocol.",
      en: "Secure connections to external tools (databases, APIs) via the Model Context Protocol.",
    },
    path: "orazaka-framework/orazaka-tools",
  },

  // ── Stage 6 · Persistence ──
  {
    id: "orazaka-persistence-identity", stage: 6, icon: Database,
    tag: { fr: "Identité", en: "Identity" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Base de Données Identité", en: "Identity Database" },
    desc: {
      fr: "Stockage sécurisé et isolé des identités, clés d'accès et politiques RBAC.",
      en: "Secure, isolated store for identities, credentials and RBAC policies.",
    },
    path: "orazaka-framework/orazaka-persistence/identity",
  },
  {
    id: "orazaka-persistence-app", stage: 6, icon: Database,
    tag: { fr: "App · RAG", en: "App · RAG" }, layer: { fr: "Framework", en: "Framework" },
    label: { fr: "Base de Données Applicative", en: "Application Database" },
    desc: {
      fr: "Base relationnelle et vectorielle (pgvector) : sessions, contextes et données RAG.",
      en: "Relational and vector database (pgvector): sessions, contexts and RAG data.",
    },
    path: "orazaka-framework/orazaka-persistence/app",
  },
];

/* ─── helpers ──────────────────────────────────────────────────────────── */

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const stageOf = (n: Node) => STAGES.find((s) => s.id === n.stage)!;
const nodesInStage = (id: number) => NODES.filter((n) => n.stage === id);
const leaf = (path: string) => path.split("/").pop() || path;

/* ─── Component card ───────────────────────────────────────────────────── */

function NodeCard({
  node,
  active,
  dimmed,
  reduce,
  locale,
  index,
  expandable = false,
  expanded = false,
  onSelect,
  onHover,
}: {
  node: Node;
  active: boolean;
  dimmed: boolean;
  reduce: boolean | null;
  locale: Loc;
  index: number;
  expandable?: boolean;
  expanded?: boolean;
  onSelect: () => void;
  onHover: (v: string | null) => void;
}) {
  const stage = stageOf(node);
  const c = stage.color;
  const Icon = node.icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      aria-label={node.label[locale]}
      aria-expanded={expandable ? expanded : undefined}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(index, 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 12px 10px 15px",
        borderRadius: 14,
        cursor: "pointer",
        overflow: "hidden",
        background: active
          ? "color-mix(in srgb, var(--kz-surface-1) 92%, transparent)"
          : "color-mix(in srgb, var(--kz-surface-2) 55%, transparent)",
        border: `1px solid ${active ? mix(c, 55) : "var(--kz-border-subtle)"}`,
        boxShadow: active ? `0 8px 26px ${mix(c, 22)}, inset 0 0 0 1px ${mix(c, 22)}` : "var(--kz-shadow-sm)",
        opacity: dimmed ? 0.28 : 1,
        transition: "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, opacity 250ms ease, transform 200ms ease",
        transform: active ? "translateY(-1px)" : "none",
      }}
      className="arch-node-card"
    >
      {/* stage color rail */}
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c, opacity: active ? 1 : 0.65 }} />

      <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
        {/* icon chip */}
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 10,
            background: mix(c, active ? 16 : 11),
            border: `1px solid ${mix(c, active ? 40 : 24)}`,
            color: c,
          }}
        >
          <Icon size={18} strokeWidth={1.9} color={c} />
        </span>

        {/* text */}
        <span style={{ minWidth: 0, flex: 1 }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 650,
              lineHeight: 1.25,
              color: "var(--kz-text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {node.label[locale]}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: c,
              }}
            >
              {node.tag[locale]}
            </span>
            <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "var(--kz-border-strong)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--kz-text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {leaf(node.path)}
            </span>
          </span>
        </span>

        {node.hub && (
          <span
            style={{
              flexShrink: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: c,
              padding: "2px 6px",
              borderRadius: 999,
              background: mix(c, 14),
              border: `1px solid ${mix(c, 34)}`,
            }}
          >
            HUB
          </span>
        )}

        {expandable && (
          <ChevronDown
            size={16}
            color="var(--kz-text-muted)"
            style={{ flexShrink: 0, transition: "transform 220ms ease", transform: expanded ? "rotate(180deg)" : "none" }}
          />
        )}
      </span>

      {/* inline detail (mobile journey) */}
      {expandable && expanded && (
        <motion.span
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={reduce ? undefined : { opacity: 1, height: "auto" }}
          style={{ display: "block", overflow: "hidden" }}
        >
          <span style={{ display: "block", height: 1, background: "var(--kz-border-subtle)", margin: "12px 0 10px" }} />
          <span style={{ display: "block", fontSize: 12.5, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>
            {node.desc[locale]}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 10,
              padding: "6px 9px",
              borderRadius: 8,
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
            }}
          >
            <Folder size={11} color="var(--kz-text-muted)" style={{ flexShrink: 0 }} />
            <code
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--kz-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.path}
            </code>
          </span>
        </motion.span>
      )}
    </motion.button>
  );
}

/* ─── Stage header (shared) ────────────────────────────────────────────── */

function StageHeader({ stage, locale, count }: { stage: Stage; locale: Loc; count: number }) {
  const c = stage.color;
  const Mascot = stage.mascot ? MASCOTS[stage.mascot] : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40 }}>
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: 9,
          background: mix(c, 14),
          border: `1px solid ${mix(c, 38)}`,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 700,
          color: c,
        }}
      >
        {stage.num}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--kz-text-primary)",
            lineHeight: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stage.title[locale]}</span>
          <span
            style={{
              flexShrink: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 600,
              color: "var(--kz-text-muted)",
              padding: "1px 5px",
              borderRadius: 999,
              border: "1px solid var(--kz-border-subtle)",
            }}
          >
            {count}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--kz-text-muted)",
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {stage.subtitle[locale]}
        </div>
      </div>
      {Mascot && (
        <span style={{ flexShrink: 0, opacity: 0.9 }}>
          <Mascot size={22} />
        </span>
      )}
    </div>
  );
}

/* ─── Flow connector (desktop, horizontal) ─────────────────────────────── */

function FlowConnectorH({ from, to, reduce, delay }: { from: string; to: string; reduce: boolean | null; delay: number }) {
  return (
    <div style={{ width: 30, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 12 }}>
      <div style={{ position: "relative", width: 28, height: 16 }}>
        <div
          style={{
            position: "absolute",
            top: 7,
            left: 0,
            right: 0,
            height: 2,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${mix(from, 55)}, ${mix(to, 55)})`,
          }}
        />
        <ArrowRight size={12} color={to} style={{ position: "absolute", right: -3, top: 2 }} strokeWidth={2.4} />
        {!reduce && (
          <motion.span
            style={{ position: "absolute", top: 5, left: 0, width: 6, height: 6, borderRadius: "50%", background: to, boxShadow: `0 0 6px ${to}` }}
            animate={{ x: [0, 22], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────────── */

export default function ArchitectureMesh({
  modules,
  dependencies,
}: {
  modules?: unknown[];
  dependencies?: unknown[];
}) {
  const { locale } = useI18n();
  const loc = (locale === "fr" ? "fr" : "en") as Loc;
  const reduce = useReducedMotion();

  void modules;
  void dependencies;

  const [selected, setSelected] = useState<string>("orazaka-core");
  const [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return null;
    const set = new Set<string>();
    for (const n of NODES) {
      if (
        n.label[loc].toLowerCase().includes(q) ||
        n.desc[loc].toLowerCase().includes(q) ||
        n.tag[loc].toLowerCase().includes(q) ||
        n.path.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q)
      ) {
        set.add(n.id);
      }
    }
    return set;
  }, [q, loc]);

  const activeId = hovered || selected;
  const active = NODES.find((n) => n.id === activeId) || NODES.find((n) => n.id === "orazaka-core")!;
  const activeStage = stageOf(active);
  const isDimmed = (id: string) => (matches ? !matches.has(id) : false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--kz-accent)",
            }}
          >
            {loc === "fr" ? "Parcours d'une requête" : "Request journey"}
          </span>
          <span
            style={{
              display: "none",
              fontSize: 12,
              color: "var(--kz-text-muted)",
            }}
            className="arch-flow-hint"
          >
            {loc === "fr" ? "de gauche à droite →" : "left to right →"}
          </span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320, display: "flex", alignItems: "center" }}>
          <Search size={15} style={{ position: "absolute", left: 12, color: "var(--kz-text-muted)", pointerEvents: "none" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={loc === "fr" ? "Rechercher un composant…" : "Search a component…"}
            aria-label={loc === "fr" ? "Rechercher un composant" : "Search a component"}
            style={{
              width: "100%",
              padding: "9px 32px 9px 34px",
              fontSize: 13,
              fontFamily: "var(--font-display), system-ui, sans-serif",
              background: "color-mix(in srgb, var(--kz-surface-2) 70%, transparent)",
              border: "1px solid var(--kz-border-subtle)",
              borderRadius: 10,
              color: "var(--kz-text-primary)",
              outline: "none",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={loc === "fr" ? "Effacer" : "Clear"}
              style={{ position: "absolute", right: 8, display: "grid", placeItems: "center", width: 20, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
            >
              <X size={14} color="var(--kz-text-muted)" />
            </button>
          )}
        </div>
      </div>

      {/* ═══ DESKTOP BOARD (≥ 1024px) ═══ */}
      <div
        className="arch-board-desktop"
        style={{
          position: "relative",
          borderRadius: 18,
          border: "1px solid var(--kz-border-subtle)",
          background: "color-mix(in srgb, var(--kz-surface-1) 45%, transparent)",
          padding: 22,
          overflowX: "auto",
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {/* subtle backdrop: grid + engine glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 18,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(var(--kz-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--kz-grid-color) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
            maskImage: "radial-gradient(120% 100% at 60% 40%, black 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(120% 100% at 60% 40%, black 55%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "42%",
            left: "58%",
            width: 420,
            height: 420,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${mix("#6366f1", 16)} 0%, transparent 68%)`,
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", minWidth: 940 }}>
          {STAGES.map((stage, si) => {
            const items = nodesInStage(stage.id);
            return (
              <div key={stage.id} style={{ display: "contents" }}>
                <div style={{ flex: "1 1 0", minWidth: 148, display: "flex", flexDirection: "column", gap: 14 }}>
                  <StageHeader stage={stage} locale={loc} count={items.length} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((n, i) => (
                      <NodeCard
                        key={n.id}
                        node={n}
                        index={i}
                        active={activeId === n.id}
                        dimmed={isDimmed(n.id)}
                        reduce={reduce}
                        locale={loc}
                        onSelect={() => setSelected(n.id)}
                        onHover={setHovered}
                      />
                    ))}
                  </div>
                </div>
                {si < STAGES.length - 1 && (
                  <FlowConnectorH from={stage.color} to={STAGES[si + 1].color} reduce={reduce} delay={si * 0.3} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ MOBILE JOURNEY (< 1024px) ═══ */}
      <div className="arch-journey-mobile" style={{ display: "none", flexDirection: "column" }}>
        {STAGES.map((stage, si) => {
          const items = nodesInStage(stage.id);
          const c = stage.color;
          return (
            <div key={stage.id}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 16,
                  border: "1px solid var(--kz-border-subtle)",
                  background: "color-mix(in srgb, var(--kz-surface-1) 55%, transparent)",
                  padding: "16px 16px 18px",
                  overflow: "hidden",
                }}
              >
                {/* top accent line */}
                <span style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: `linear-gradient(90deg, ${c}, ${mix(c, 20)})` }} />
                <StageHeader stage={stage} locale={loc} count={items.length} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                  {items.map((n, i) => (
                    <NodeCard
                      key={n.id}
                      node={n}
                      index={i}
                      active={activeId === n.id}
                      dimmed={isDimmed(n.id)}
                      reduce={reduce}
                      locale={loc}
                      expandable
                      expanded={selected === n.id}
                      onSelect={() => setSelected((cur) => (cur === n.id ? "" : n.id))}
                      onHover={() => {}}
                    />
                  ))}
                </div>
              </div>

              {/* vertical connector to next stage */}
              {si < STAGES.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", height: 34, position: "relative" }}>
                  <span style={{ position: "absolute", top: 0, bottom: 8, width: 2, borderRadius: 2, background: `linear-gradient(180deg, ${mix(c, 55)}, ${mix(STAGES[si + 1].color, 55)})` }} />
                  <ChevronDown size={15} color={STAGES[si + 1].color} strokeWidth={2.4} style={{ position: "absolute", bottom: 2 }} />
                  {!reduce && (
                    <motion.span
                      style={{ position: "absolute", top: 2, width: 6, height: 6, borderRadius: "50%", background: STAGES[si + 1].color, boxShadow: `0 0 6px ${STAGES[si + 1].color}` }}
                      animate={{ y: [0, 22], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: si * 0.2 }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ DETAIL PANEL (desktop only — mobile expands inline) ═══ */}
      <div
        className="arch-detail-desktop"
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 18,
          padding: "16px 18px",
          borderRadius: 16,
          background: "color-mix(in srgb, var(--kz-surface-1) 80%, transparent)",
          border: `1px solid ${mix(activeStage.color, 30)}`,
          boxShadow: `0 8px 30px ${mix(activeStage.color, 10)}`,
          transition: "border-color 300ms ease, box-shadow 300ms ease",
        }}
      >
        {/* left: identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 210, maxWidth: 260 }}>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 12,
              background: mix(activeStage.color, 15),
              border: `1px solid ${mix(activeStage.color, 40)}`,
            }}
          >
            <active.icon size={22} strokeWidth={1.9} color={activeStage.color} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--kz-text-primary)", lineHeight: 1.2 }}>
              {active.label[loc]}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: activeStage.color }}>
                {activeStage.num} · {activeStage.title[loc]}
              </span>
              <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "var(--kz-border-strong)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--kz-text-muted)" }}>{active.layer[loc]}</span>
            </div>
          </div>
        </div>

        {/* center: description */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", borderLeft: "1px solid var(--kz-border-subtle)", paddingLeft: 18 }}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>{active.desc[loc]}</p>
        </div>

        {/* right: source */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 5, minWidth: 210, maxWidth: 280 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 8.5, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--kz-text-muted)" }}>
            <Folder size={10} /> Source
          </span>
          <code
            title={active.path}
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              padding: "6px 9px",
              borderRadius: 8,
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {active.path}
          </code>
        </div>
      </div>

      {/* ── responsive + interaction styles ── */}
      <style>{`
        .arch-node-card:focus-visible {
          outline: 2px solid var(--kz-accent);
          outline-offset: 2px;
        }

        @media (min-width: 1024px) {
          .arch-flow-hint { display: inline !important; }
          .arch-board-desktop { display: block !important; }
          .arch-journey-mobile { display: none !important; }
          .arch-detail-desktop { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .arch-board-desktop { display: none !important; }
          .arch-journey-mobile { display: flex !important; }
          .arch-detail-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}
