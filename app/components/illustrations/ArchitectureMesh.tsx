"use client";

import { useMemo, useState } from "react";
import {
  Folder,
  Search,
} from "lucide-react";
import { useI18n } from "../I18nProvider";

/* ─── CUSTOM MASCOT AVATARS (SVG) ─── */

function DuckAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="duck-avatar-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#duck-avatar-glow)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      {/* Glasses */}
      <rect x="8" y="14" width="28" height="10" rx="5" fill="#1e293b" opacity="0.85" />
      <circle cx="15" cy="19" r="3.5" fill="#22c55e" />
      <circle cx="29" cy="19" r="3.5" fill="#22c55e" />
      {/* Beak */}
      <path d="M 16 25 Q 22 31 28 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
    </svg>
  );
}

function FalconAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="falcon-avatar-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9f00" />
          <stop offset="100%" stopColor="#ff2a00" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#falcon-avatar-glow)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      {/* Visor */}
      <rect x="10" y="15" width="24" height="8" rx="4" fill="#1e293b" opacity="0.9" />
      <circle cx="16" cy="19" r="2.5" fill="#00f2fe" />
      <circle cx="28" cy="19" r="2.5" fill="#00f2fe" />
      {/* Beak */}
      <polygon points="20,24 24,24 22,29" fill="#fbbf24" />
    </svg>
  );
}

function OwlAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="owl-avatar-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#owl-avatar-glow)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      {/* Horns */}
      <polygon points="12,12 16,6 18,13" fill="#5b21b6" />
      <polygon points="32,12 28,6 26,13" fill="#5b21b6" />
      {/* Eyes */}
      <circle cx="16" cy="20" r="4.5" fill="white" />
      <circle cx="28" cy="20" r="4.5" fill="white" />
      <circle cx="16" cy="20" r="2" fill="#00ff66" />
      <circle cx="28" cy="20" r="2" fill="#00ff66" />
      {/* Beak */}
      <polygon points="20,22 24,22 22,26" fill="#fbbf24" />
    </svg>
  );
}

function FlamingoAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="flamingo-avatar-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#flamingo-avatar-glow)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
      {/* Curved neck */}
      <path d="M 22 28 Q 14 18 20 12" stroke="url(#flamingo-avatar-glow)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Head */}
      <circle cx="20" cy="12" r="5" fill="#60a5fa" />
      {/* Beak */}
      <path d="M 23 13 L 28 12 L 23 15 Z" fill="#fbbf24" />
    </svg>
  );
}

/* ─── DATA SCHEMAS & CONFIGS ─── */

interface FlowNode {
  id: string;
  label: Record<string, string>;
  desc: Record<string, string>;
  path: string;
  x: number; // % coordinates on canvas
  y: number;
  layer: "framework" | "app";
  mascot: "duck" | "falcon" | "owl" | "flamingo";
  color: string;
  glow: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: "orazaka-web-client",
    label: { fr: "Console Client Web", en: "Web Client Console" },
    desc: {
      fr: "Application client Next.js principale permettant aux utilisateurs de chatter, générer des images/vidéos et interagir avec l'IA.",
      en: "Main Next.js client application allowing users to chat, generate images/videos, and interact with the AI.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-web-client",
    x: 10,
    y: 16.07,
    layer: "app",
    mascot: "duck",
    color: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    id: "orazaka-web-admin",
    label: { fr: "Console d'Administration", en: "Administration Console" },
    desc: {
      fr: "Interface d'administration SecOps isolée (port 3001) pour gérer les modèles, le pipeline et la conformité.",
      en: "Isolated SecOps administration console (port 3001) for model, pipeline, and compliance management.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-web-admin",
    x: 10,
    y: 37.5,
    layer: "app",
    mascot: "falcon",
    color: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.35)",
  },
  {
    id: "orazaka-mobile-client",
    label: { fr: "Application Mobile", en: "Mobile Application" },
    desc: {
      fr: "Application mobile cross-platform (Expo SDK 53) pour l'accès mobile à l'IA en déplacement.",
      en: "Cross-platform mobile application (Expo SDK 53) providing on-the-go access to the AI engine.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-mobile-client",
    x: 10,
    y: 58.93,
    layer: "app",
    mascot: "flamingo",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.35)",
  },
  {
    id: "orazaka-cli",
    label: { fr: "CLI Orazaka", en: "Orazaka CLI" },
    desc: {
      fr: "Interface en ligne de commande pour l'automatisation des tâches de développement avec file d'attente locale SQLite.",
      en: "Command-line interface for developer task automation with a local SQLite job queue.",
    },
    path: "orazaka-apps/orazaka-ui/orazaka-cli",
    x: 10,
    y: 80.36,
    layer: "app",
    mascot: "owl",
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.35)",
  },
  {
    id: "orazaka-router",
    label: { fr: "Portail d'entrée", en: "Entry Gate" },
    desc: {
      fr: "Réceptionne les requêtes utilisateur (API REST & SSE) et les achemine vers le moteur d'orchestration.",
      en: "Receives user requests (REST & SSE API) and routes them into the orchestration engine.",
    },
    path: "orazaka-apps/orazaka-router",
    x: 26,
    y: 48.21,
    layer: "app",
    mascot: "duck",
    color: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    id: "orazaka-identity",
    label: { fr: "Sécurité & RBAC", en: "Security & RBAC" },
    desc: {
      fr: "Authentifie les requêtes, valide les permissions (RBAC) et applique les limitations de débit par locataire.",
      en: "Authenticates requests, validates permissions (RBAC), and enforces tenant rate-limiting.",
    },
    path: "orazaka-framework/orazaka-identity",
    x: 42,
    y: 28.57,
    layer: "framework",
    mascot: "falcon",
    color: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.35)",
  },
  {
    id: "orazaka-business",
    label: { fr: "Gouvernance Métier", en: "Business Logic" },
    desc: {
      fr: "Gère les règles d'affaires, charge les gabarits de prompts et structure les cas d'usage cognitifs.",
      en: "Manages business rules, loads prompt templates, and structures cognitive use-cases.",
    },
    path: "orazaka-framework/orazaka-business",
    x: 42,
    y: 67.86,
    layer: "framework",
    mascot: "duck",
    color: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    id: "orazaka-core",
    label: { fr: "Moteur Cognitif", en: "Cognitive Engine" },
    desc: {
      fr: "Le cœur central d'Orazaka. Coordonne l'exécution des requêtes IA sans état et orchestre le passage de l'information.",
      en: "The heart of Orazaka. Coordinates stateless AI request execution and orchestrates the flow of data.",
    },
    path: "orazaka-framework/orazaka-core",
    x: 58,
    y: 48.21,
    layer: "framework",
    mascot: "owl",
    color: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.45)",
  },
  {
    id: "orazaka-interceptors",
    label: { fr: "Pipeline de Cognition", en: "Cognitive Pipeline" },
    desc: {
      fr: "Assemble en boucle fermée les 15 filtres configurés (contexte système, mémoire, RAG, sécurité) pour enrichir la requête.",
      en: "Assembles the 15 configured filters (system context, memory, RAG, safety) in a closed loop to enrich requests.",
    },
    path: "orazaka-framework/orazaka-interceptors",
    x: 74,
    y: 16.07,
    layer: "framework",
    mascot: "owl",
    color: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.35)",
  },
  {
    id: "orazaka-worker-integrations",
    label: { fr: "Worker Intégrations", en: "Integrations Worker" },
    desc: {
      fr: "Service d'arrière-plan asynchrone pour la synchronisation et le traitement des messages et des tâches de fond.",
      en: "Asynchronous background service running job integration queues and handling system tasks.",
    },
    path: "orazaka-apps/orazaka-workers/orazaka-worker-integrations",
    x: 74,
    y: 37.5,
    layer: "app",
    mascot: "falcon",
    color: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.35)",
  },
  {
    id: "orazaka-worker-media",
    label: { fr: "Worker Médias", en: "Media Worker" },
    desc: {
      fr: "Gère le traitement lourd d'images, de vidéos et de voix de façon asynchrone hors du thread d'API principal.",
      en: "Handles heavy image, video, and audio generation tasks asynchronously outside the main API thread.",
    },
    path: "orazaka-apps/orazaka-workers/orazaka-worker-media",
    x: 74,
    y: 58.93,
    layer: "app",
    mascot: "flamingo",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.35)",
  },
  {
    id: "orazaka-tools",
    label: { fr: "Intégrations MCP", en: "MCP Integrations" },
    desc: {
      fr: "Gère la connexion sécurisée aux outils externes (bases de données, APIs) via le protocole Model Context Protocol.",
      en: "Manages secure connections to external tools (databases, APIs) via the open Model Context Protocol.",
    },
    path: "orazaka-framework/orazaka-tools",
    x: 74,
    y: 80.36,
    layer: "framework",
    mascot: "flamingo",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.35)",
  },
  {
    id: "orazaka-persistence-identity",
    label: { fr: "Base de Données Identité", en: "Identity Database" },
    desc: {
      fr: "Stockage sécurisé pour les identités, clés d'accès et politiques de contrôle d'accès RBAC.",
      en: "Secure state database isolating authentication details, credentials, and RBAC policies.",
    },
    path: "orazaka-framework/orazaka-persistence/identity",
    x: 90,
    y: 28.57,
    layer: "framework",
    mascot: "falcon",
    color: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.35)",
  },
  {
    id: "orazaka-persistence-app",
    label: { fr: "Base de Données Applicative", en: "Application Database" },
    desc: {
      fr: "Base de données relationnelle locale et vectorielle (pgvector) pour stocker les sessions, contextes et RAG.",
      en: "Local relational database and vector store (pgvector) for chat sessions, contexts, and RAG data.",
    },
    path: "orazaka-framework/orazaka-persistence/app",
    x: 90,
    y: 67.86,
    layer: "framework",
    mascot: "flamingo",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.35)",
  },
];

interface FlowEdge {
  from: string;
  to: string;
  path: string; // SVG path definition
}

const FLOW_EDGES: FlowEdge[] = [
  // Interface nodes to Router
  { from: "orazaka-web-client", to: "orazaka-router", path: "M 100 90 L 164 90 Q 180 90, 180 106 L 180 254 Q 180 270, 196 270 L 260 270" },
  { from: "orazaka-web-admin", to: "orazaka-router", path: "M 100 210 L 164 210 Q 180 210, 180 226 L 180 254 Q 180 270, 196 270 L 260 270" },
  { from: "orazaka-mobile-client", to: "orazaka-router", path: "M 100 330 L 164 330 Q 180 330, 180 314 L 180 286 Q 180 270, 196 270 L 260 270" },
  { from: "orazaka-cli", to: "orazaka-router", path: "M 100 450 L 164 450 Q 180 450, 180 434 L 180 286 Q 180 270, 196 270 L 260 270" },

  // Router connections
  { from: "orazaka-router", to: "orazaka-identity", path: "M 260 270 L 324 270 Q 340 270, 340 254 L 340 176 Q 340 160, 356 160 L 420 160" },
  { from: "orazaka-router", to: "orazaka-business", path: "M 260 270 L 324 270 Q 340 270, 340 286 L 340 364 Q 340 380, 356 380 L 420 380" },
  { from: "orazaka-router", to: "orazaka-core", path: "M 260 270 L 580 270" },
  { from: "orazaka-router", to: "orazaka-tools", path: "M 260 270 L 484 270 Q 500 270, 500 286 L 500 434 Q 500 450, 516 450 L 740 450" },
  { from: "orazaka-router", to: "orazaka-interceptors", path: "M 260 270 L 484 270 Q 500 270, 500 254 L 500 106 Q 500 90, 516 90 L 740 90" },
  { from: "orazaka-router", to: "orazaka-persistence-app", path: "M 260 270 L 644 270 Q 660 270, 660 286 L 660 364 Q 660 380, 676 380 L 900 380" },
  { from: "orazaka-router", to: "orazaka-worker-media", path: "M 260 270 L 484 270 Q 500 270, 500 286 L 500 314 Q 500 330, 516 330 L 740 330" },

  // Core / Logic connections
  { from: "orazaka-business", to: "orazaka-core", path: "M 420 380 L 484 380 Q 500 380, 500 364 L 500 286 Q 500 270, 516 270 L 580 270" },
  { from: "orazaka-core", to: "orazaka-interceptors", path: "M 580 270 L 644 270 Q 660 270, 660 254 L 660 106 Q 660 90, 676 90 L 740 90" },
  { from: "orazaka-interceptors", to: "orazaka-tools", path: "M 740 90 L 740 450" },

  // Persistence submodules
  { from: "orazaka-identity", to: "orazaka-persistence-identity", path: "M 420 160 L 900 160" },
  { from: "orazaka-persistence-app", to: "orazaka-identity", path: "M 900 380 L 676 380 Q 660 380, 660 364 L 660 176 Q 660 160, 644 160 L 420 160" },
  { from: "orazaka-core", to: "orazaka-persistence-app", path: "M 580 270 L 644 270 Q 660 270, 660 286 L 660 364 Q 660 380, 676 380 L 900 380" },
  { from: "orazaka-tools", to: "orazaka-persistence-app", path: "M 740 450 L 804 450 Q 820 450, 820 434 L 820 396 Q 820 380, 836 380 L 900 380" },

  // Workers
  { from: "orazaka-worker-integrations", to: "orazaka-identity", path: "M 740 210 L 676 210 Q 660 210, 660 194 L 660 176 Q 660 160, 644 160 L 420 160" },
  { from: "orazaka-worker-media", to: "orazaka-persistence-app", path: "M 740 330 L 804 330 Q 820 330, 820 346 L 820 364 Q 820 380, 836 380 L 900 380" },
];

export default function ArchitectureMesh({
  modules,
  dependencies,
}: {
  modules?: unknown[];
  dependencies?: unknown[];
}) {
  const { locale } = useI18n();

  // Suppress unused variables warnings if needed
  void modules;
  void dependencies;

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>("orazaka-core");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayer, setSelectedLayer] = useState<"framework" | "app" | null>(null);

  const activeNodeId = hoveredNode || selectedNode || "orazaka-core";

  const activeNode = useMemo(() => {
    return FLOW_NODES.find((n) => n.id === activeNodeId) || FLOW_NODES.find((n) => n.id === "orazaka-core") || FLOW_NODES[0];
  }, [activeNodeId]);

  // Determine active edges connected to the highlighted/hovered node
  const activeEdges = useMemo(() => {
    const s = new Set<number>();
    FLOW_EDGES.forEach((e, idx) => {
      if (e.from === activeNodeId || e.to === activeNodeId) {
        s.add(idx);
      }
    });
    return s;
  }, [activeNodeId]);

  const filteredNodes = useMemo(() => {
    return FLOW_NODES.map((n) => {
      const matchesSearch = searchQuery
        ? n.label[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.desc[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.id.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesLayer = selectedLayer ? n.layer === selectedLayer : true;

      return {
        ...n,
        isDimmed: !matchesSearch || !matchesLayer,
        isSearchHighlight: !!(searchQuery && matchesSearch),
      };
    });
  }, [searchQuery, selectedLayer, locale]);

  const filteredNodeMap = useMemo(() => {
    const map = new Map<string, typeof filteredNodes[number]>();
    filteredNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [filteredNodes]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          transform: "none",
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
          <button
            onClick={() => setSelectedLayer("app")}
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
              background: selectedLayer === "app" ? "#f43f5e" : "transparent",
              color: selectedLayer === "app" ? "var(--kz-on-accent)" : "var(--kz-text-secondary)",
              border: `1px solid ${selectedLayer === "app" ? "#f43f5e" : "var(--kz-border-subtle)"}`,
              transition: "all 150ms ease",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: selectedLayer === "app" ? "var(--kz-on-accent)" : "#f43f5e",
              }}
            />
            {locale === "fr" ? "Portails d'entrée" : "Entry Gates"}
          </button>
          <button
            onClick={() => setSelectedLayer("framework")}
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
              background: selectedLayer === "framework" ? "var(--kz-accent)" : "transparent",
              color: selectedLayer === "framework" ? "var(--kz-on-accent)" : "var(--kz-text-secondary)",
              border: `1px solid ${selectedLayer === "framework" ? "var(--kz-accent)" : "var(--kz-border-subtle)"}`,
              transition: "all 150ms ease",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: selectedLayer === "framework" ? "var(--kz-on-accent)" : "var(--kz-accent)",
              }}
            />
            {locale === "fr" ? "Moteur & Framework" : "Engine & Framework"}
          </button>
        </div>

        {/* Search Field */}
        <div style={{ position: "relative", width: "100%", maxWidth: "320px", display: "flex", alignItems: "center" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", color: "var(--kz-text-muted)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder={locale === "fr" ? "Rechercher un composant..." : "Search component..."}
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
          />
        </div>
      </div>

      {/* ─── REDESIGNED COMPACT TELEMETRY CARD ─── */}
      <div
        className="arch-telemetry-card glass-card"
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
          backdropFilter: "blur(20px) saturate(160%)",
          border: `1px solid ${activeNode.color}33`,
          borderRadius: "var(--kz-radius-md)",
          padding: "16px 20px",
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.05), 0 0 16px ${activeNode.color}08`,
          transition: "all 350ms ease",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          textAlign: "left",
        }}
      >
        {/* Left column: Mascot & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "200px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--kz-surface-2)",
              border: `1px solid ${activeNode.color}`,
              color: activeNode.color,
              boxShadow: `0 0 10px ${activeNode.glow}`,
              flexShrink: 0,
            }}
          >
            {activeNode.mascot === "duck" && <DuckAvatar size={26} />}
            {activeNode.mascot === "falcon" && <FalconAvatar size={26} />}
            {activeNode.mascot === "owl" && <OwlAvatar size={26} />}
            {activeNode.mascot === "flamingo" && <FlamingoAvatar size={26} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--kz-text-primary)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activeNode.label[locale]}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8.5px",
                textTransform: "uppercase",
                color: "var(--kz-text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              {activeNode.id}
            </span>
          </div>
        </div>

        {/* Center column: Description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--kz-text-secondary)", margin: 0 }}>
            {activeNode.desc[locale]}
          </p>
        </div>

        {/* Right column: Source Path */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "220px", maxWidth: "280px" }}>
          <span
            style={{
              fontSize: "8px",
              fontFamily: "var(--font-mono)",
              color: "var(--kz-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Folder size={10} /> {locale === "fr" ? "SOURCE" : "SOURCE"}
          </span>
          <code
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "9.5px",
              padding: "4px 8px",
              borderRadius: "4px",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-text-primary)",
              wordBreak: "break-all",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={activeNode.path}
          >
            {activeNode.path}
          </code>
        </div>
      </div>

      {/* ─── DESKTOP FLOW CANVAS (hidden on mobile) ─── */}
      <div
        className="arch-flow-desktop-canvas"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1000 / 560",
          background: "color-mix(in srgb, var(--kz-surface-1) 50%, transparent)",
          borderRadius: "var(--kz-radius-lg)",
          border: "1px solid var(--kz-border-subtle)",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Futuristic Ambient Glow behind canvas */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "70%",
            background: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)",
            opacity: 0.12,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {/* SVG Connection Paths */}
          <svg
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            <defs>
              <filter id="mesh-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Tiled engineering blueprint grid pattern */}
              <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="0.6" opacity="0.65" />
              </pattern>

              {/* Radial gradient centered at Cognitive Engine (580, 270) */}
              <radialGradient id="engine-sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.20" />
                <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.10" />
                <stop offset="70%" stopColor="#ec4899" stopOpacity="0.03" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Aurora background glows */}
              <radialGradient id="aurora-left" cx="20%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="aurora-right" cx="80%" cy="25%" r="50%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Mountain gradients */}
              <linearGradient id="mtn-back" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="mtn-front" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.14" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Interactive Laser scan gradient */}
              <linearGradient id="laser-scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff5a00" stopOpacity="0.38" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Interactive Laptop hologram gradient */}
              <linearGradient id="holo-grad-arch" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Mascot colors */}
              <linearGradient id="owl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
              <linearGradient id="falcon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9f00" />
                <stop offset="100%" stopColor="#ff2a00" />
              </linearGradient>
              <linearGradient id="duck-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="flamingo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>

            {/* Immersive cyber landscape backgrounds */}
            <g pointerEvents="none">
              {/* Tiled engineering blueprint grid pattern */}
              <rect x="0" y="0" width="1000" height="560" fill="url(#blueprint-grid)" opacity="0.3" />

              {/* Aurora background glows */}
              <circle cx="150" cy="200" r="400" fill="url(#aurora-left)" />
              <circle cx="850" cy="200" r="400" fill="url(#aurora-right)" />

              {/* Radial gradient centered at Cognitive Engine (580, 270) */}
              <circle cx="580" cy="270" r="320" fill="url(#engine-sun-glow)" />

              {/* Constellation grid lines in the sky */}
              <g opacity="0.12" stroke="var(--kz-accent)" strokeWidth="0.8">
                <line x1="180" y1="60" x2="260" y2="40" />
                <line x1="260" y1="40" x2="340" y2="70" />
                <line x1="340" y1="70" x2="180" y2="60" />
                <line x1="660" y1="50" x2="740" y2="30" />
                <line x1="740" y1="30" x2="820" y2="70" />
                <line x1="820" y1="70" x2="660" y2="50" />
              </g>
              {/* Constellation points */}
              <g fill="var(--kz-accent)" opacity="0.35">
                <circle cx="180" cy="60" r="2" />
                <circle cx="260" cy="40" r="3" />
                <circle cx="340" cy="70" r="1.5" />
                <circle cx="660" cy="50" r="2" />
                <circle cx="740" cy="30" r="3" />
                <circle cx="820" cy="70" r="1.5" />
              </g>

              {/* Layered Mountains (with Digital Contours) */}
              {/* Far Peaks */}
              <path d="M 280 540 L 450 340 L 620 540 Z" fill="url(#mtn-back)" stroke="var(--kz-accent)" strokeWidth="0.8" opacity="0.25" />
              {/* Front Peaks */}
              <path d="M 540 540 L 710 370 L 880 540 Z" fill="url(#mtn-front)" stroke="#ec4899" strokeWidth="0.8" opacity="0.2" />

              {/* Wireframe grids on mountains (Contour lines) */}
              <g stroke="var(--kz-border-subtle)" strokeWidth="0.8" opacity="0.3">
                <line x1="325" y1="490" x2="575" y2="490" />
                <line x1="370" y1="440" x2="530" y2="440" />
                <line x1="415" y1="390" x2="485" y2="390" />
                <line x1="585" y1="490" x2="835" y2="490" />
                <line x1="630" y1="440" x2="790" y2="440" />
                <line x1="675" y1="390" x2="745" y2="390" />
              </g>
            </g>

            {/* Column swimlanes in background */}
            <g opacity="0.85">
              {/* Column 1: Presentation */}
              <rect x="15" y="20" width="170" height="520" rx="16" fill="color-mix(in srgb, var(--kz-surface-2) 20%, transparent)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
              <text x="100" y="38" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">
                {locale === "fr" ? "1. PRÉSENTATION" : "1. PRESENTATION"}
              </text>
              <line x1="20" y1="270" x2="180" y2="270" stroke="var(--kz-border-subtle)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
              <line x1="20" y1="390" x2="180" y2="390" stroke="var(--kz-border-subtle)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
              <text x="100" y="55" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600" opacity="0.6" letterSpacing="0.04em">
                {locale === "fr" ? "APPLICATIONS WEB" : "WEB PORTALS"}
              </text>
              <text x="100" y="295" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600" opacity="0.6" letterSpacing="0.04em">
                {locale === "fr" ? "SUPPORT MOBILE" : "MOBILE APP"}
              </text>
              <text x="100" y="415" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600" opacity="0.6" letterSpacing="0.04em">
                {locale === "fr" ? "INTERFACE CONSOLE" : "DEVELOPER CLI"}
              </text>

              {/* Column 2: Gateway */}
              <rect x="195" y="20" width="130" height="520" rx="16" fill="color-mix(in srgb, var(--kz-surface-2) 20%, transparent)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
              <text x="260" y="38" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">
                {locale === "fr" ? "2. PORTAIL" : "2. GATEWAY"}
              </text>

              {/* Column 3: Security & Policies */}
              <rect x="335" y="20" width="170" height="520" rx="16" fill="color-mix(in srgb, var(--kz-surface-2) 20%, transparent)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
              <text x="420" y="38" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">
                {locale === "fr" ? "3. CONTRÔLE & RÈGLES" : "3. SECURITY & RBAC"}
              </text>

              {/* Column 4: Engine */}
              <rect x="515" y="20" width="130" height="520" rx="16" fill="color-mix(in srgb, var(--kz-surface-2) 20%, transparent)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
              <text x="580" y="38" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">
                {locale === "fr" ? "4. MOTEUR CENTRAL" : "4. COGNITIVE ENGINE"}
              </text>

              {/* Column 5: Workers & Pipelines */}
              <rect x="655" y="20" width="170" height="520" rx="16" fill="color-mix(in srgb, var(--kz-surface-2) 20%, transparent)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
              <text x="740" y="38" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">
                {locale === "fr" ? "5. WORKERS & PIPELINES" : "5. WORKERS & PIPELINE"}
              </text>

              {/* Column 6: Persistence */}
              <rect x="835" y="20" width="150" height="520" rx="16" fill="color-mix(in srgb, var(--kz-surface-2) 20%, transparent)" stroke="var(--kz-border-subtle)" strokeWidth="1" />
              <text x="910" y="38" textAnchor="middle" fill="var(--kz-text-muted)" fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">
                {locale === "fr" ? "6. STOCKAGE" : "6. PERSISTENCE"}
              </text>
            </g>

            {/* Interactive database monolith servers */}
            <g opacity={activeNodeId.includes("persistence") ? 0.35 : 0.15} style={{ transition: "opacity 300ms ease" }} pointerEvents="none">
              {/* Server Monolith 1 (Behind Identity DB) */}
              <rect x="880" y="80" width="80" height="150" rx="8" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <line x1="890" y1="100" x2="950" y2="100" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <line x1="890" y1="120" x2="950" y2="120" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <line x1="890" y1="140" x2="950" y2="140" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <line x1="890" y1="160" x2="950" y2="160" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <circle cx="895" cy="100" r="1.5" fill="#00ff66" className="server-led-blink-1" />
              <circle cx="895" cy="120" r="1.5" fill="#00ff66" className="server-led-blink-2" />
              <circle cx="895" cy="140" r="1.5" fill="#ffaa00" className="server-led-blink-3" />
              <circle cx="895" cy="160" r="1.5" fill="#00f2fe" className="server-led-blink-4" />

              {/* Server Monolith 2 (Behind App DB) */}
              <rect x="880" y="300" width="80" height="150" rx="8" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <line x1="890" y1="320" x2="950" y2="320" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <line x1="890" y1="340" x2="950" y2="340" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <line x1="890" y1="360" x2="950" y2="360" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <line x1="890" y1="380" x2="950" y2="380" stroke="var(--kz-border-subtle)" strokeWidth="2" />
              <circle cx="895" cy="320" r="1.5" fill="#00f2fe" className="server-led-blink-4" />
              <circle cx="895" cy="340" r="1.5" fill="#00ff66" className="server-led-blink-1" />
              <circle cx="895" cy="360" r="1.5" fill="#00ff66" className="server-led-blink-2" />
              <circle cx="895" cy="380" r="1.5" fill="#ffaa00" className="server-led-blink-3" />
            </g>

            {/* ─── DEVELOPER DUCK (Column 1 - Presentation) ─── */}
            <g transform="translate(55, 465) scale(0.95)" opacity={activeNodeId.includes("client") || activeNodeId.includes("admin") || activeNodeId === "orazaka-cli" ? 1 : 0.55} style={{ transition: "opacity 300ms ease" }} pointerEvents="none">
              {/* Body */}
              <path d="M 5 45 C 5 30, 45 30, 45 45 C 45 62, 38 72, 25 72 C 12 72, 5 62, 5 45 Z" fill="url(#duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              {/* Belly */}
              <path d="M 12 48 C 12 40, 38 40, 38 48 C 38 60, 32 64, 25 64 C 18 64, 12 60, 12 48 Z" fill="#f472b6" opacity="0.8" />
              {/* Wings typing */}
              <path d="M -2 40 C -8 46, -4 55, 10 52" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" className="duck-wing-type-l" />
              <path d="M 52 40 C 58 46, 54 55, 40 52" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" className="duck-wing-type-r" />
              {/* Head */}
              <g>
                <circle cx="25" cy="24" r="16" fill="url(#duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <path d="M 12 24 C 12 20, 22 18, 25 18 C 28 18, 38 20, 38 24 C 38 28, 28 32, 25 32 C 22 32, 12 28, 12 24 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <circle cx="19" cy="16" r="1.8" fill="var(--kz-text-primary)" />
                <circle cx="31" cy="16" r="1.8" fill="var(--kz-text-primary)" />
                <circle cx="19" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <circle cx="31" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <line x1="23.5" y1="16" x2="26.5" y2="16" stroke="var(--kz-border-strong)" strokeWidth="1" />
              </g>
              {/* Laptop & Hologram */}
              <g transform="translate(10, 50)">
                <polygon points="-8,16 38,16 30,22 -14,22" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
                <polygon points="-4,14 34,14 30,-2 -8,-2" fill="var(--kz-accent-soft)" stroke="var(--kz-accent)" strokeWidth="0.8" opacity="0.75" />
                {/* Glowing line */}
                <line x1="-2" y1="4" x2="24" y2="4" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.8" />
                {/* Holographic Projection */}
                <polygon points="12,-2 -30,-60 55,-60" fill="url(#holo-grad-arch)" opacity={activeNodeId.includes("client") || activeNodeId.includes("admin") || activeNodeId === "orazaka-cli" ? 0.65 : 0} className="holo-projection-beam" style={{ pointerEvents: "none", transition: "opacity 300ms ease" }} />
              </g>
            </g>

            {/* ─── SENTRY FALCON (Column 3 - Security & Policies) ─── */}
            <g transform="translate(345, 230) scale(0.9)" opacity={activeNodeId === "orazaka-identity" || activeNodeId === "orazaka-business" ? 1 : 0.55} style={{ transition: "opacity 300ms ease" }} pointerEvents="none">
              {/* Watchtower support */}
              <path d="M 25 65 L 25 150 M 15 150 L 35 150" stroke="var(--kz-border-strong)" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Falcon legs */}
              <line x1="16" y1="65" x2="12" y2="85" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="34" y1="65" x2="38" y2="85" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Body */}
              <path d="M 5 35 C 5 20, 45 20, 45 35 C 45 58, 38 68, 25 68 C 12 68, 5 58, 5 35 Z" fill="url(#falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              <path d="M 12 38 C 12 28, 38 28, 38 38 C 38 52, 32 58, 25 58 C 18 58, 12 52, 12 38 Z" fill="#ff9800" opacity="0.8" />
              
              {/* Wings */}
              <path d="M 2 30 C -6 40, -3 55, 10 52 C 5 45, 4 35, 2 30 Z" fill="#d84315" stroke="var(--kz-border-strong)" strokeWidth="1" className="falcon-wing-l" style={{ transformOrigin: "2px 30px" }} />
              <path d="M 48 30 C 56 40, 53 55, 38 52 C 43 45, 44 35, 48 30 Z" fill="#d84315" stroke="var(--kz-border-strong)" strokeWidth="1" className="falcon-wing-r" style={{ transformOrigin: "48px 30px" }} />

              {/* Head */}
              <g>
                <circle cx="25" cy="22" r="16" fill="url(#falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <polygon points="21,24 29,24 25,34" fill="#ffb300" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <rect x="9" y="10" width="32" height="9" rx="2" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <circle cx="17" cy="14.5" r="2" fill="#00f2fe" className="falcon-eye-glow" />
                <circle cx="33" cy="14.5" r="2" fill="#00f2fe" className="falcon-eye-glow" />
              </g>

              {/* Sentry Scan Laser Overlay */}
              <polygon points="25,24 -80,240 130,240" fill="url(#laser-scan-grad)" opacity={activeNodeId === "orazaka-identity" || activeNodeId === "orazaka-business" ? 0.45 : 0} className="sentry-scan-beam" style={{ transformOrigin: "25px 24px", pointerEvents: "none", transition: "opacity 300ms ease" }} />
            </g>

            {/* ─── CYBER OWL (Column 4 - Cognitive Engine) ─── */}
            <g transform="translate(580, 145) scale(0.9)" opacity={activeNodeId === "orazaka-core" ? 1 : 0.55} style={{ transition: "opacity 300ms ease" }} pointerEvents="none">
              {/* Perch rail */}
              <line x1="-30" y1="45" x2="30" y2="45" stroke="var(--kz-border-strong)" strokeWidth="2" strokeLinecap="round" />
              {/* Body */}
              <path d="M -15,10 C -15,-10, 15,-10, 15,10 C 15,30, 10,45, 0,45 C -10,45, -15,30, -15,10 Z" fill="url(#owl-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              <path d="M -8,15 C -8,5, 8,5, 8,15 C 8,28, 5,35, 0,35 C -5,35, -8,28, -8,15 Z" fill="#00f2fe" opacity="0.25" />
              {/* Eyes */}
              <circle cx="-6" cy="2" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <circle cx="6" cy="2" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <circle cx="-6" cy="2" r="1.8" fill="#00ff66" className="owl-eye-glow" />
              <circle cx="6" cy="2" r="1.8" fill="#00ff66" className="owl-eye-glow" />
              {/* Beak */}
              <polygon points="-2,4 2,4 0,9" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
              {/* Horns */}
              <polygon points="-12,-7 -6,-3 -13,1" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
              <polygon points="12,-7 6,-3 13,1" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
            </g>

            {/* ─── FLAMINGO BOT (Column 5 - Workers) ─── */}
            <g transform="translate(810, 395) scale(0.9)" opacity={activeNodeId.includes("worker") || activeNodeId === "orazaka-tools" || activeNodeId === "orazaka-interceptors" ? 1 : 0.55} style={{ transition: "opacity 300ms ease" }} pointerEvents="none">
              {/* Legs */}
              <line x1="12" y1="105" x2="12" y2="155" stroke="var(--kz-border-strong)" strokeWidth="2" />
              <line x1="26" y1="105" x2="28" y2="155" stroke="var(--kz-border-strong)" strokeWidth="2" />
              <circle cx="12" cy="128" r="2" fill="#3b82f6" />
              <circle cx="27" cy="128" r="2" fill="#3b82f6" />
              {/* Body */}
              <path d="M 2 80 C 2 68, 38 68, 38 80 C 38 108, 28 112, 20 112 C 12 112, 2 108, 2 80 Z" fill="url(#flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              {/* Wing */}
              <path d="M 8 82 L 20 74 L 32 82 L 32 94 L 20 102 L 8 94 Z" fill="#ec4899" stroke="var(--kz-border-strong)" strokeWidth="0.8" className="flamingo-wing-flap" />
              {/* Neck & Head */}
              <path d="M 20 74 C 20 60, -2 40, 8 18" fill="none" stroke="url(#flamingo-grad)" strokeWidth="5" strokeLinecap="round" />
              <g transform="translate(8, 12)">
                <circle cx="0" cy="0" r="9" fill="url(#flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <circle cx="-3" cy="-2" r="1.2" fill="var(--kz-surface-0)" />
                <circle cx="-3" cy="-2" r="0.5" fill="#f43f5e" />
                <path d="M -8 -2 C -18 2, -16 14, -22 18 C -14 10, -8 4, -8 -2 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
              </g>
            </g>

            {FLOW_EDGES.map((edge, idx) => {
              const fromNode = filteredNodeMap.get(edge.from);
              const toNode = filteredNodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const isEdgeDimmed = fromNode.isDimmed || toNode.isDimmed;
              const isEdgeActive = activeEdges.has(idx);
              const edgeColor = fromNode.color;

              return (
                <g key={idx}>
                  {/* Permanent Structure Trace (PCB Channel) */}
                  <path
                    d={edge.path}
                    fill="none"
                    stroke="var(--kz-border-strong)"
                    strokeWidth={2.4}
                    opacity={0.12}
                  />
                  {/* Neon Glow Underlay */}
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={isEdgeActive ? 6 : 3}
                    opacity={activeNodeId ? (isEdgeActive ? 0.35 : 0.02) : (isEdgeDimmed ? 0.01 : 0.08)}
                    filter="url(#mesh-glow)"
                    style={{ transition: "opacity 300ms ease, stroke-width 300ms ease" }}
                  />
                  {/* Solid Base Trace */}
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={isEdgeActive ? edgeColor : "var(--kz-border-strong)"}
                    strokeWidth={isEdgeActive ? 1.8 : 0.8}
                    opacity={activeNodeId ? (isEdgeActive ? 0.95 : 0.03) : (isEdgeDimmed ? 0.02 : 0.22)}
                    style={{ transition: "opacity 300ms ease, stroke 300ms ease, stroke-width 300ms ease" }}
                  />
                  {/* Flow Dash Animation */}
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={isEdgeActive ? 1.8 : 0.8}
                    strokeDasharray="6 14"
                    className="mesh-flow-dash"
                    opacity={activeNodeId ? (isEdgeActive ? 0.9 : 0) : (isEdgeDimmed ? 0 : 0.35)}
                    style={{ transition: "opacity 300ms ease" }}
                  />
                </g>
              );
            })}

            {/* Floating Flow Particles */}
            <g>
              {FLOW_EDGES.map((edge, idx) => {
                const fromNode = filteredNodeMap.get(edge.from);
                const toNode = filteredNodeMap.get(edge.to);
                if (!fromNode || !toNode) return null;

                const isEdgeDimmed = fromNode.isDimmed || toNode.isDimmed;
                const isEdgeActive = activeEdges.has(idx);

                return (
                  <circle
                    key={idx}
                    r={isEdgeActive ? "3.5" : "2"}
                    fill={fromNode.color}
                    opacity={activeNodeId ? (isEdgeActive ? 0.95 : 0.03) : (isEdgeDimmed ? 0.01 : 0.45)}
                    filter={isEdgeActive ? "url(#mesh-glow)" : undefined}
                    style={{ transition: "opacity 300ms ease" }}
                  >
                    <animateMotion
                      dur={`${2 + (idx % 3) * 0.5}s`}
                      begin={`${(idx * 0.25).toFixed(2)}s`}
                      repeatCount="indefinite"
                      path={edge.path}
                    />
                  </circle>
                );
              })}
            </g>

            {/* PCB Joint Junction Dots */}
            <g pointerEvents="none">
              {[
                // Input Bus Joints
                { x: 180, y: 90, color: "#f43f5e" },
                { x: 180, y: 210, color: "#ff9f00" },
                { x: 180, y: 330, color: "#3b82f6" },
                { x: 180, y: 450, color: "#a855f7" },
                { x: 180, y: 270, color: "#f43f5e" }, // input merge

                // Router split 1
                { x: 340, y: 270, color: "#ff9f00" },
                { x: 340, y: 160, color: "#ff9f00" },
                { x: 340, y: 380, color: "#f43f5e" },

                // Router split 2
                { x: 500, y: 270, color: "#a78bfa" },
                { x: 500, y: 90, color: "#a78bfa" },
                { x: 500, y: 330, color: "#3b82f6" },
                { x: 500, y: 450, color: "#3b82f6" },

                // Router split 3 & Core
                { x: 660, y: 270, color: "#a78bfa" },
                { x: 660, y: 364, color: "#3b82f6" },
                { x: 660, y: 160, color: "#ff9f00" },

                // DB bus joints
                { x: 820, y: 380, color: "#3b82f6" },
                { x: 820, y: 450, color: "#3b82f6" },
                { x: 820, y: 330, color: "#3b82f6" },
              ].map((joint, jIdx) => {
                const isJointActive = activeNode.color === joint.color || activeNode.id === "orazaka-router";
                return (
                  <g key={jIdx} style={{ transition: "all 300ms ease" }}>
                    {/* Glowing ring */}
                    <circle
                      cx={joint.x}
                      cy={joint.y}
                      r={isJointActive ? 4.5 : 3}
                      fill="none"
                      stroke={isJointActive ? joint.color : "var(--kz-border-strong)"}
                      strokeWidth={1}
                      opacity={isJointActive ? 0.85 : 0.25}
                      style={{ transition: "all 300ms ease" }}
                    />
                    {/* Inner core */}
                    <circle
                      cx={joint.x}
                      cy={joint.y}
                      r={isJointActive ? 2 : 1.2}
                      fill={isJointActive ? joint.color : "var(--kz-border-subtle)"}
                      opacity={isJointActive ? 1 : 0.4}
                      style={{ transition: "all 300ms ease" }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* HTML Node Cards overlay */}
        {filteredNodes.map((n) => {
          const isInspected = activeNodeId === n.id;
          const isHovered = hoveredNode === n.id;
          const isSelected = selectedNode === n.id;

          // Find the unique index of the node
          const idx = FLOW_NODES.findIndex((x) => x.id === n.id);
          const indexStr = (idx + 1).toString().padStart(2, "0");

          return (
            <div
              key={n.id}
              onMouseEnter={() => setHoveredNode(n.id)}
              onClick={() => setSelectedNode(n.id)}
              tabIndex={0}
              role="button"
              aria-label={n.label[locale]}
              style={{
                position: "absolute",
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isInspected ? 10 : 5,
                cursor: "pointer",
                outline: "none",
                opacity: n.isDimmed ? 0.15 : 1,
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            >
              {/* Core beacon sonar rings */}
              {n.id === "orazaka-core" && (
                <>
                  <div className="mesh-beacon beacon-1" style={{ borderColor: n.color }} />
                  <div className="mesh-beacon beacon-2" style={{ borderColor: n.color }} />
                  {/* Slow rotating dashed ring around core engine card */}
                  <div
                    className="core-engine-dash-ring"
                    style={{
                      position: "absolute",
                      inset: "-6px",
                      borderRadius: "20px",
                      border: `1.5px dashed ${n.color}`,
                      opacity: isInspected ? 0.95 : 0.35,
                      boxShadow: isInspected ? `0 0 12px ${n.glow}` : "none",
                      transition: "all 300ms ease",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Slow rotating reverse dotted outer ring */}
                  <div
                    className="core-engine-dash-ring-outer"
                    style={{
                      position: "absolute",
                      inset: "-12px",
                      borderRadius: "26px",
                      border: `1px dotted ${n.color}`,
                      opacity: isInspected ? 0.65 : 0.2,
                      transition: "all 300ms ease",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}

              {/* Node Card Box */}
              <div
                className={`mesh-node-card ${isInspected ? "is-inspected" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px 8px 15px", // Extra padding left for the color vertical bar
                  borderRadius: "14px",
                  background: isInspected
                    ? "color-mix(in srgb, var(--kz-surface-1) 95%, transparent)"
                    : "color-mix(in srgb, var(--kz-surface-2) 65%, transparent)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`,
                  boxShadow: isInspected
                    ? `0 0 20px ${n.glow}, inset 0 0 6px ${n.glow}`
                    : isHovered || isSelected
                    ? `0 4px 12px ${n.glow}`
                    : "var(--kz-shadow-sm)",
                  transform: isHovered || isSelected ? "scale(1.06)" : "scale(1)",
                  transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                  width: n.id === "orazaka-core" ? "190px" : "175px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* HUD Corner Brackets */}
                <div style={{ position: "absolute", inset: "4px", pointerEvents: "none" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: "5px", height: "5px", borderLeft: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, borderTop: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, opacity: isInspected ? 0.8 : 0.25, transition: "all 250ms ease" }} />
                  <div style={{ position: "absolute", right: 0, top: 0, width: "5px", height: "5px", borderRight: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, borderTop: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, opacity: isInspected ? 0.8 : 0.25, transition: "all 250ms ease" }} />
                  <div style={{ position: "absolute", left: 0, bottom: 0, width: "5px", height: "5px", borderLeft: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, borderBottom: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, opacity: isInspected ? 0.8 : 0.25, transition: "all 250ms ease" }} />
                  <div style={{ position: "absolute", right: 0, bottom: 0, width: "5px", height: "5px", borderRight: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, borderBottom: `1px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`, opacity: isInspected ? 0.8 : 0.25, transition: "all 250ms ease" }} />
                </div>

                {/* Left vertical Accent bar with wrap-around notches */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3.5px",
                    background: n.color,
                    borderRadius: "2px 0 0 2px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "10px",
                    height: "3.5px",
                    background: n.color,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "10px",
                    height: "3.5px",
                    background: n.color,
                  }}
                />

                {/* Top right pulsing LED dot */}
                <div
                  className="card-led-blink"
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "8px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: n.color,
                    opacity: isInspected ? 1 : 0.4,
                    boxShadow: isInspected ? `0 0 6px ${n.color}` : "none",
                  }}
                />

                {/* Avatar render based on mascot mapping */}
                <div style={{ transform: isHovered || isSelected ? "scale(1.1) rotate(-2deg)" : "none", transition: "transform 250ms ease" }}>
                  {n.mascot === "duck" && <DuckAvatar size={34} />}
                  {n.mascot === "falcon" && <FalconAvatar size={34} />}
                  {n.mascot === "owl" && <OwlAvatar size={34} />}
                  {n.mascot === "flamingo" && <FlamingoAvatar size={34} />}
                </div>

                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, textAlign: "left" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: n.id === "orazaka-core" ? "12px" : "11px",
                      fontWeight: 700,
                      color: isInspected ? n.color : "var(--kz-text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.label[locale]}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "8.5px",
                        color: "var(--kz-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {n.layer}
                    </span>
                    <span style={{ width: "2.5px", height: "2.5px", borderRadius: "50%", background: "var(--kz-border-strong)", opacity: 0.5 }} />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "8.5px",
                        color: "var(--kz-text-muted)",
                        opacity: 0.8,
                      }}
                    >
                      #{indexStr}
                    </span>

                    {/* Micro-telemetry bar cpu meter */}
                    <div style={{ display: "flex", gap: "1.5px", alignItems: "flex-end", marginLeft: "auto", paddingRight: "4px", height: "10px" }}>
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`card-telemetry-bar bar-${i}`}
                          style={{
                            width: "1.5px",
                            height: `${3 + i * 2}px`,
                            background: isInspected ? n.color : "var(--kz-border-strong)",
                            opacity: isInspected ? 0.95 : 0.35,
                            borderRadius: "0.5px",
                            transition: "all 150ms ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MOBILE SCROLLABLE LIST FLOW (Alternative for small screens) ─── */}
      <div className="arch-flow-mobile-list" style={{ display: "none", flexDirection: "column", gap: "12px" }}>
        {filteredNodes.map((n) => {
          const isInspected = activeNodeId === n.id;
          return (
            <div
              key={n.id}
              onClick={() => setSelectedNode(n.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: isInspected
                  ? "color-mix(in srgb, var(--kz-surface-1) 90%, transparent)"
                  : "var(--kz-surface-2)",
                border: `1.2px solid ${isInspected ? n.color : "var(--kz-border-subtle)"}`,
                boxShadow: isInspected ? `0 0 12px ${n.glow}` : "none",
                cursor: "pointer",
                opacity: n.isDimmed ? 0.4 : 1,
              }}
            >
              <div>
                {n.mascot === "duck" && <DuckAvatar size={32} />}
                {n.mascot === "falcon" && <FalconAvatar size={32} />}
                {n.mascot === "owl" && <OwlAvatar size={32} />}
                {n.mascot === "flamingo" && <FlamingoAvatar size={32} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--kz-text-primary)", margin: 0 }}>
                  {n.label[locale]}
                </h4>
                <code style={{ fontSize: "10px", color: "var(--kz-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {n.path}
                </code>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        /* Slow rotating core engine dashed ring */
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotate-slow-reverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        .core-engine-dash-ring {
          animation: rotate-slow 20s linear infinite;
        }
        .core-engine-dash-ring-outer {
          animation: rotate-slow-reverse 30s linear infinite;
        }

        /* Component Card LED blinking */
        @keyframes card-led-glow {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        .card-led-blink {
          animation: card-led-glow 2s ease-in-out infinite;
        }

        /* Telemetry signal/CPU bar flickers */
        @keyframes telemetry-flicker-0 {
          0%, 100% { height: 3px; opacity: 0.35; }
          50%      { height: 8px; opacity: 1; }
        }
        @keyframes telemetry-flicker-1 {
          0%, 100% { height: 5px; opacity: 0.4; }
          50%      { height: 3px; opacity: 1; }
        }
        @keyframes telemetry-flicker-2 {
          0%, 100% { height: 7px; opacity: 0.3; }
          50%      { height: 9px; opacity: 1; }
        }
        @keyframes telemetry-flicker-3 {
          0%, 100% { height: 9px; opacity: 0.5; }
          50%      { height: 4px; opacity: 1; }
        }
        .mesh-node-card:hover .bar-0, .mesh-node-card:focus-within .bar-0, .mesh-node-card.is-inspected .bar-0 { animation: telemetry-flicker-0 0.7s infinite ease-in-out; }
        .mesh-node-card:hover .bar-1, .mesh-node-card:focus-within .bar-1, .mesh-node-card.is-inspected .bar-1 { animation: telemetry-flicker-1 0.5s infinite ease-in-out; }
        .mesh-node-card:hover .bar-2, .mesh-node-card:focus-within .bar-2, .mesh-node-card.is-inspected .bar-2 { animation: telemetry-flicker-2 0.6s infinite ease-in-out; }
        .mesh-node-card:hover .bar-3, .mesh-node-card:focus-within .bar-3, .mesh-node-card.is-inspected .bar-3 { animation: telemetry-flicker-3 0.8s infinite ease-in-out; }

        /* Animated Flow Lines */
        @keyframes flowDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .mesh-flow-dash {
          animation: flowDash 1s linear infinite;
        }

        /* Beacon pulsations */
        @keyframes beaconPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
        .mesh-beacon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 80px;
          border-radius: 20px;
          border: 1px solid transparent;
          pointer-events: none;
          z-index: 1;
        }
        .beacon-1 {
          animation: beaconPulse 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .beacon-2 {
          animation: beaconPulse 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.25s;
        }

        /* --- Mascot Typing Wing Animations (Developer Duck) --- */
        @keyframes duck-wing-type-l {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-5deg) translateY(-1px); }
        }
        @keyframes duck-wing-type-r {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(5deg) translateY(-1px); }
        }
        .duck-wing-type-l {
          animation: duck-wing-type-l 0.3s ease-in-out infinite;
          transform-origin: 10px 42px;
        }
        .duck-wing-type-r {
          animation: duck-wing-type-r 0.3s ease-in-out infinite 0.15s;
          transform-origin: 40px 42px;
        }

        /* Hologram projection beam pulsing */
        @keyframes holo-projection-beam-flicker {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 0.45; filter: drop-shadow(0 0 5px #10b981); }
        }
        .holo-projection-beam {
          animation: holo-projection-beam-flicker 2s ease-in-out infinite;
        }

        /* --- Mascot Wing Flapping (Sentry Falcon) --- */
        @keyframes falcon-wing-l-flap {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-6deg); }
        }
        @keyframes falcon-wing-r-flap {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(6deg); }
        }
        .falcon-wing-l {
          animation: falcon-wing-l-flap 2.5s ease-in-out infinite;
        }
        .falcon-wing-r {
          animation: falcon-wing-r-flap 2.5s ease-in-out infinite;
        }

        /* Sentry Laser sweep animation */
        @keyframes sentry-laser-sweep {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        .sentry-scan-beam {
          animation: sentry-laser-sweep 5s ease-in-out infinite;
        }

        /* Visor Eye LEDs pulsing */
        @keyframes falcon-eye-pulse-glow {
          0%, 100% { fill: #00f2fe; filter: drop-shadow(0 0 1px #00f2fe); }
          50%      { fill: #00ff66; filter: drop-shadow(0 0 3px #00ff66); }
        }
        .falcon-eye-glow {
          animation: falcon-eye-pulse-glow 1.5s ease-in-out infinite;
        }

        /* --- Mascot Eye Pulsing (Cyber Owl) --- */
        @keyframes owl-eye-pulse-glow {
          0%, 100% { fill: #00ff66; opacity: 0.85; }
          50%      { fill: #00ff66; opacity: 1; filter: drop-shadow(0 0 3px #00ff66); }
        }
        .owl-eye-glow {
          animation: owl-eye-pulse-glow 1.2s ease-in-out infinite;
        }

        /* --- Mascot Wing Flapping (Flamingo Bot) --- */
        @keyframes flamingo-wing-flap-motion {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-10deg) translateY(-2px); }
        }
        .flamingo-wing-flap {
          animation: flamingo-wing-flap-motion 2.5s ease-in-out infinite;
          transform-origin: 20px 74px;
        }

        /* --- Persistence Server LEDs blinking --- */
        @keyframes led-blink-fast {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        .server-led-blink-1 { animation: led-blink-fast 0.6s step-end infinite; }
        .server-led-blink-2 { animation: led-blink-fast 0.8s step-end infinite 0.2s; }
        .server-led-blink-3 { animation: led-blink-fast 1.1s step-end infinite 0.4s; }
        .server-led-blink-4 { animation: led-blink-fast 1.4s step-end infinite 0.1s; }

        /* Float motions for desktop nodes */
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50%      { transform: translate(-50%, -50%) translateY(-3px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50%      { transform: translate(-50%, -50%) translateY(3px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(-50%, -50%) translateX(-2px); }
          50%      { transform: translate(-50%, -50%) translateX(2px); }
        }

        /* Dual responsive display toggle */
        @media (min-width: 768px) {
          .arch-flow-desktop-canvas {
            display: flex !important;
          }
          .arch-flow-mobile-list {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .arch-flow-desktop-canvas {
            display: none !important;
          }
          .arch-flow-mobile-list {
            display: flex !important;
          }
          .arch-telemetry-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 14px 16px !important;
          }
          .arch-telemetry-card > div {
            min-width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
