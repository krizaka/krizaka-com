"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Play, Pause, RotateCcw, ShieldAlert, Cpu, Network } from "lucide-react";
import { useI18n } from "../I18nProvider";
import HexNode from "../HexNode";
import CustomEdge from "../CustomEdge";

// Node registry
const nodeTypes = {
  hex: HexNode,
};

// Edge registry
const edgeTypes = {
  custom: CustomEdge,
};

// Definitive 15 Interceptors Data Schema
const INTERCEPTOR_DATA: Record<
  string,
  {
    name: string;
    phase: "ingress" | "core" | "egress";
    desc: { fr: string; en: string };
    details: {
      title: { fr: string; en: string };
      params: Record<string, unknown>;
    };
  }
> = {
  "node-1": {
    name: "UserContextResolver",
    phase: "ingress",
    desc: {
      fr: "Résout le profil utilisateur, ses rôles RBAC et son tier de rate-limiting.",
      en: "Resolves user profiles, RBAC roles, and rate-limiting tier.",
    },
    details: {
      title: { fr: "Résolution Contexte Utilisateur", en: "User Context Resolution" },
      params: {
        userId: "usr_9x2f8b",
        tier: "GOVERNANCE",
        rbac: ["DEVOPS_LEAD", "COMPLIANCE_AUDITOR"],
        rateLimit: "1000 req/min",
        consumed: "0.4%",
        sessionSecure: true,
      },
    },
  },
  "node-2": {
    name: "SystemContextInjector",
    phase: "ingress",
    desc: {
      fr: "Injecte les signaux système, les contraintes matérielles et les variables d'environnement.",
      en: "Injects environmental variables, hardware constraints, and system metadata.",
    },
    details: {
      title: { fr: "Injection Contexte Système", en: "System Context Injection" },
      params: {
        environment: "production-us-east-1",
        podId: "orazaka-pod-88a",
        availableMemory: "32GB (Virtual Threads safe)",
        activeEnvVars: 14,
        cpuUsage: "18.4%",
      },
    },
  },
  "node-3": {
    name: "LanguageAlignmentInterceptor",
    phase: "ingress",
    desc: {
      fr: "Assure la traduction du raisonnement et maintient l'alignement sémantique du dictionnaire.",
      en: "Ensures reasoning translation and dictionary mapping consistency.",
    },
    details: {
      title: { fr: "Alignement Linguistique", en: "Language Alignment" },
      params: {
        sourceLang: "fr-CA",
        reasoningTarget: "en-US",
        translationConfidence: "99.85%",
        activeDictionaryMappings: 1420,
      },
    },
  },
  "node-4": {
    name: "MemoryInterceptor",
    phase: "ingress",
    desc: {
      fr: "Récupère et formate la fenêtre de conversation historique FIFO (glissante).",
      en: "Retrieves and formats the FIFO sliding history window.",
    },
    details: {
      title: { fr: "Fenêtre Mémoire Conversationnelle", en: "Conversation Memory Window" },
      params: {
        windowType: "Sliding FIFO",
        maxHistoryMessages: 50,
        activeHistoryCount: 12,
        tokensPreserved: 3410,
        evictionQueueSize: 0,
      },
    },
  },
  "node-5": {
    name: "RagInterceptor",
    phase: "ingress",
    desc: {
      fr: "Enrichit le prompt avec des contextes pertinents récupérés de pgvector.",
      en: "Enriches the prompt with context fetched from pgvector database.",
    },
    details: {
      title: { fr: "Enrichissement Vectoriel RAG", en: "RAG Vector Context Retrieval" },
      params: {
        vectorDb: "pgvector (hybrid-search)",
        similarityThreshold: 0.82,
        retrievedChunks: 5,
        injectedChunks: 3,
        injectedTokens: 1240,
      },
    },
  },
  "node-6": {
    name: "McpInterceptor",
    phase: "core",
    desc: {
      fr: "Résout les outils externes et les serveurs Model Context Protocol connectés.",
      en: "Resolves Model Context Protocol servers and connected external tools.",
    },
    details: {
      title: { fr: "Résolution de Protocole MCP", en: "Model Context Protocol Resolver" },
      params: {
        activeMcpServers: ["codegraph", "pinecone-mcp"],
        availableTools: 12,
        connectionState: "CONNECTED",
        latencyMs: 14,
      },
    },
  },
  "node-7": {
    name: "RefinerInterceptor",
    phase: "core",
    desc: {
      fr: "Re-formule les instructions floues en commandes précises et structurées.",
      en: "Reformulates fuzzy user inputs into structured system commands.",
    },
    details: {
      title: { fr: "Raffinement Sémantique", en: "Semantic Query Refinement" },
      params: {
        originalQuery: "vérifier build",
        refinedPrompt: "Locate compilation outputs in workspace and execute npm run build --check",
        semanticShiftRatio: "14.2%",
      },
    },
  },
  "node-8": {
    name: "RouterInterceptor",
    phase: "core",
    desc: {
      fr: "Analyse l'intention de la requête et la route vers le modèle LLM optimal.",
      en: "Analyzes user intent and routes the query to the optimal LLM.",
    },
    details: {
      title: { fr: "Routage Intentionnel", en: "Intent-Based LLM Router" },
      params: {
        intentClass: "SYSTEM_CODEGEN",
        routedModel: "claude-3-5-sonnet-v2",
        temperature: 0.0,
        fallbackStrategy: "local-llama-3-70b",
      },
    },
  },
  "node-9": {
    name: "ToolInterceptor",
    phase: "core",
    desc: {
      fr: "Exécute les callbacks d'outils dynamiques et valide les schémas d'entrée.",
      en: "Executes dynamic tool callbacks and checks schema safety constraints.",
    },
    details: {
      title: { fr: "Exécution des Outils / Callbacks", en: "Tool Execution & Dispatcher" },
      params: {
        registeredToolsCount: 8,
        activeInvocation: "run_command",
        validationStatus: "PASS",
        sandboxContext: "isolated-virtual-thread-12",
      },
    },
  },
  "node-10": {
    name: "CostShieldInterceptor",
    phase: "core",
    desc: {
      fr: "Surveille le budget de jetons et bloque les requêtes hors limite financière.",
      en: "Monitors token budgets and blocks requests exceeding cost allocation limits.",
    },
    details: {
      title: { fr: "Bouclier Anti-Surcoût", en: "Cost & Token Resource Shield" },
      params: {
        maxTokenLimit: 16384,
        estimatedTokens: 4850,
        costThreshold: "$0.02 / req",
        shieldState: "GREEN_SECURE",
      },
    },
  },
  "node-11": {
    name: "QuantumValidationAdvisor",
    phase: "core",
    desc: {
      fr: "Exécute des validations multi-agents rigoureuses sur la réponse produite.",
      en: "Runs multi-agent validations on LLM outputs prior to output streaming.",
    },
    details: {
      title: { fr: "Validation Multi-Agents de Sortie", en: "Output Validation Matrix" },
      params: {
        validationTiers: ["json-schema", "ast-syntax", "types-compilation"],
        validationStatus: "SUCCESS",
        confidenceScore: 0.985,
      },
    },
  },
  "node-12": {
    name: "MediaInterceptor",
    phase: "ingress",
    desc: {
      fr: "Décode et vérifie l'intégrité des entrées multi-modales (Base64).",
      en: "Decodes and verifies Base64 multi-modal input payloads.",
    },
    details: {
      title: { fr: "Extraction Média Multi-Modale", en: "Multi-Modal Payload Extractor" },
      params: {
        detectedMime: "image/png",
        payloadBytes: 1258291,
        dimensions: "1024x1024",
        secOpsCheck: "CLEAN_PASS",
      },
    },
  },
  "node-13": {
    name: "AuditLogInterceptor",
    phase: "ingress",
    desc: {
      fr: "Enregistre des journaux chiffrés pour la conformité Loi 25 (anonymisés).",
      en: "Records encrypted, anonymized audit logs for compliance tracking.",
    },
    details: {
      title: { fr: "Journalisation SecOps & Loi 25", en: "Compliance & Audit Logger" },
      params: {
        complianceTarget: "Loi 25 (Quebec)",
        encryptionType: "AES-GCM-256",
        anonymizedFields: ["userIp", "personalIdentifiableData"],
        logHash: "sha256:4ae32f01fbc...",
      },
    },
  },
  "node-14": {
    name: "SafetyGuardrailsInterceptor",
    phase: "ingress",
    desc: {
      fr: "Filtre les contenus toxiques ou inappropriés via des filtres système locaux.",
      en: "Applies content filters and toxic language blocklists locally.",
    },
    details: {
      title: { fr: "Garde-Fous de Sécurité", en: "Safety Guardrails Filter" },
      params: {
        moderationEngine: "Llama-Guard-3-local",
        inputSafety: "SAFE",
        toxicityScore: 0.002,
        blockedKeywordsCount: 420,
      },
    },
  },
  "node-15": {
    name: "ResponseAssemblyInterceptor",
    phase: "egress",
    desc: {
      fr: "Assemble, compresse et formate la réponse finale pour le client BFF.",
      en: "Assembles, compresses, and packages the output for client BFF streaming.",
    },
    details: {
      title: { fr: "Assemblage & Streaming BFF", en: "BFF Response Assembly Stream" },
      params: {
        streamProtocol: "Server-Sent Events (SSE)",
        compression: "gzip",
        bffHandshake: "COMPLETED",
        totalPipelineLatency: "142ms",
      },
    },
  },
};

// Initial state nodes configuration for dagre layout
const initialNodes: Node[] = [
  // Top Ingress branch
  { id: "node-1", type: "hex", data: { label: "UserContextResolver", phase: "ingress" }, position: { x: 0, y: 0 } },
  { id: "node-2", type: "hex", data: { label: "SystemContextInjector", phase: "ingress" }, position: { x: 0, y: 0 } },
  { id: "node-3", type: "hex", data: { label: "LanguageAlignmentInterceptor", phase: "ingress" }, position: { x: 0, y: 0 } },
  { id: "node-4", type: "hex", data: { label: "MemoryInterceptor", phase: "ingress" }, position: { x: 0, y: 0 } },
  // Bottom Ingress branch
  { id: "node-12", type: "hex", data: { label: "MediaInterceptor", phase: "ingress" }, position: { x: 0, y: 0 } },
  { id: "node-13", type: "hex", data: { label: "AuditLogInterceptor", phase: "ingress" }, position: { x: 0, y: 0 } },
  { id: "node-14", type: "hex", data: { label: "SafetyGuardrailsInterceptor", phase: "ingress" }, position: { x: 0, y: 0 } },
  { id: "node-5", type: "hex", data: { label: "RagInterceptor", phase: "ingress" }, position: { x: 0, y: 0 } },
  // Center Intersection
  { id: "node-8", type: "hex", data: { label: "RouterInterceptor", phase: "core" }, position: { x: 0, y: 0 } },
  // Top Egress branch (Worker Dispatch routing)
  { id: "node-6", type: "hex", data: { label: "McpInterceptor", phase: "core" }, position: { x: 0, y: 0 } },
  { id: "node-7", type: "hex", data: { label: "RefinerInterceptor", phase: "core" }, position: { x: 0, y: 0 } },
  { id: "node-9", type: "hex", data: { label: "ToolInterceptor", phase: "core" }, position: { x: 0, y: 0 } },
  // Bottom Egress branch (Response Assembly routing)
  { id: "node-10", type: "hex", data: { label: "CostShieldInterceptor", phase: "core" }, position: { x: 0, y: 0 } },
  { id: "node-11", type: "hex", data: { label: "QuantumValidationAdvisor", phase: "core" }, position: { x: 0, y: 0 } },
  { id: "node-15", type: "hex", data: { label: "ResponseAssemblyInterceptor", phase: "egress" }, position: { x: 0, y: 0 } },
];

const initialEdges: Edge[] = [
  // Top Ingress branch
  { id: "e-1-2", source: "node-1", target: "node-2", type: "custom", data: { phase: "ingress" } },
  { id: "e-2-3", source: "node-2", target: "node-3", type: "custom", data: { phase: "ingress" } },
  { id: "e-3-4", source: "node-3", target: "node-4", type: "custom", data: { phase: "ingress" } },
  { id: "e-4-8", source: "node-4", target: "node-8", type: "custom", data: { phase: "ingress" } },
  // Bottom Ingress branch
  { id: "e-12-13", source: "node-12", target: "node-13", type: "custom", data: { phase: "ingress" } },
  { id: "e-13-14", source: "node-13", target: "node-14", type: "custom", data: { phase: "ingress" } },
  { id: "e-14-5", source: "node-13", target: "node-14", type: "custom", data: { phase: "ingress" } }, // Fallback standard duplicate
  { id: "e-5-8", source: "node-5", target: "node-8", type: "custom", data: { phase: "ingress" } },
  // Upper split from Router (Worker Dispatch)
  { id: "e-8-6", source: "node-8", target: "node-6", type: "custom", data: { phase: "core" } },
  { id: "e-6-7", source: "node-6", target: "node-7", type: "custom", data: { phase: "core" } },
  { id: "e-7-9", source: "node-7", target: "node-9", type: "custom", data: { phase: "core" } },
  // Lower split from Router (Response Assembly)
  { id: "e-8-10", source: "node-8", target: "node-10", type: "custom", data: { phase: "core" } },
  { id: "e-10-11", source: "node-10", target: "node-11", type: "custom", data: { phase: "core" } },
  { id: "e-11-15", source: "node-11", target: "node-15", type: "custom", data: { phase: "egress" } },
];

// Correct some specific typos in source nodes if required
initialEdges[6] = { id: "e-14-5", source: "node-14", target: "node-5", type: "custom", data: { phase: "ingress" } };

// Timeline active configurations mapping
const stepToActiveNodes: Record<number, string[]> = {
  0: ["node-1", "node-12"],
  1: ["node-2", "node-13"],
  2: ["node-3", "node-14"],
  3: ["node-4", "node-5"],
  4: ["node-8"],
  5: ["node-6", "node-10"],
  6: ["node-7", "node-11"],
  7: ["node-9", "node-15"],
};

const edgeActiveStepMap: Record<string, number> = {
  "e-1-2": 0,
  "e-12-13": 0,
  "e-2-3": 1,
  "e-13-14": 1,
  "e-3-4": 2,
  "e-14-5": 2,
  "e-4-8": 3,
  "e-5-8": 3,
  "e-8-6": 4,
  "e-8-10": 4,
  "e-6-7": 5,
  "e-10-11": 5,
  "e-7-9": 6,
  "e-11-15": 6,
};

// Layout calculations utilizing Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "LR") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 45,
    ranksep: 90,
    marginx: 40,
    marginy: 45,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 144, height: 128 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 72,
        y: nodeWithPosition.y - 64,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function InterceptorMesh({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1200); // ms per step

  // Generate layouted elements once at mount
  const layouted = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, "LR");
  }, []);

  const [nodes, setNodes] = useNodesState(layouted.nodes);
  const [edges, setEdges] = useEdgesState(layouted.edges);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Timer loop for sequential "cognitive wave" animations
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 8);
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  // Synchronize state-driven props to node and edge states
  useEffect(() => {
    const currentActiveNodeIds = stepToActiveNodes[activeStep] || [];

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          active: currentActiveNodeIds.includes(n.id),
        },
      }))
    );

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: {
          ...e.data,
          firing: edgeActiveStepMap[e.id] === activeStep,
        },
      }))
    );
  }, [activeStep, setNodes, setEdges]);

  const onNodeMouseEnter = (_: unknown, node: Node) => {
    setHoveredNodeId(node.id);
  };

  const onNodeMouseLeave = () => {
    setHoveredNodeId(null);
  };

  const currentActiveNodeId = useMemo(() => {
    const activeList = stepToActiveNodes[activeStep];
    return activeList ? activeList[0] : null;
  }, [activeStep]);

  const selectedNodeId = hoveredNodeId || currentActiveNodeId || "node-1";
  const selectedData = INTERCEPTOR_DATA[selectedNodeId];

  const handleReset = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  if (!mounted) {
    return (
      <div 
        style={{ height: compact ? "460px" : "550px" }}
        className="w-full bg-[var(--kz-surface-0)] border border-[var(--kz-border-default)] rounded-2xl flex flex-col items-center justify-center gap-3 animate-pulse"
      >
        <Cpu className="w-8 h-8 text-[var(--kz-accent)] animate-spin" />
        <span className="text-xs font-mono text-[var(--kz-text-muted)] tracking-wider">
          INITIALIZING COGNITIVE INTERCEPTORMESH ENGINE...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Mesh Controls Panel — Elegant alignment & Krizaka colors */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px 24px",
          background: "color-mix(in srgb, var(--kz-surface-1) 80%, transparent)",
          border: "1px solid var(--kz-border-default)",
          borderRadius: "var(--kz-radius-lg)",
          boxShadow: "var(--kz-shadow-sm)",
          transform: "none", // Avoid translate hover of standard glass-card
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              padding: "8px",
              background: "var(--kz-accent-soft)",
              borderRadius: "8px",
              border: "1px solid color-mix(in srgb, var(--kz-accent) 20%, transparent)",
              color: "var(--kz-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Network size={18} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "var(--kz-text-primary)",
                margin: 0,
              }}
            >
              {locale === "fr" ? "Console Cognitive Interactive" : "Interactive Cognitive Console"}
            </h3>
            <p style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", margin: "2px 0 0" }}>
              STATUS: <span style={{ color: isPlaying ? "var(--kz-status-success)" : "var(--kz-status-warning)" }}>{isPlaying ? "WAVE_PROPAGATION_ACTIVE" : "ENGINE_PAUSED"}</span> | STEP: 0{activeStep + 1}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-text-secondary)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--kz-accent)";
              e.currentTarget.style.color = "var(--kz-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--kz-border-subtle)";
              e.currentTarget.style.color = "var(--kz-text-secondary)";
            }}
          >
            {isPlaying ? (
              <>
                <Pause size={12} />
                {locale === "fr" ? "PAUSE" : "PAUSE"}
              </>
            ) : (
              <>
                <Play size={12} style={{ color: "var(--kz-accent)" }} fill="var(--kz-accent-soft)" />
                {locale === "fr" ? "LANCER" : "RESUME"}
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-text-secondary)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--kz-accent)";
              e.currentTarget.style.color = "var(--kz-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--kz-border-subtle)";
              e.currentTarget.style.color = "var(--kz-text-secondary)";
            }}
            title="Reset wave sequence"
          >
            <RotateCcw size={12} />
            {locale === "fr" ? "RÉINITIALISER" : "RESET"}
          </button>

          {/* Speed settings */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              borderRadius: "9999px",
              padding: "2px 8px 2px 2px",
            }}
          >
            <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--kz-text-muted)", paddingLeft: "6px" }}>SPEED:</span>
            {[
              { label: "0.5x", val: 2000 },
              { label: "1.0x", val: 1200 },
              { label: "2.0x", val: 600 },
            ].map((sp) => (
              <button
                key={sp.label}
                onClick={() => setAnimationSpeed(sp.val)}
                style={{
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  fontSize: "9px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: animationSpeed === sp.val ? "var(--kz-accent)" : "transparent",
                  color: animationSpeed === sp.val ? "var(--kz-on-accent)" : "var(--kz-text-muted)",
                  transition: "all 150ms ease",
                }}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Flow Canvas Left, JSON Console Right */}
      <div 
        style={{ height: compact ? "500px" : "600px", display: "grid", gap: "24px" }}
        className={`w-full ${compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-10"}`}
      >
        {/* Flow Canvas Pane */}
        <div
          style={{
            position: "relative",
            background: "color-mix(in srgb, var(--kz-surface-1) 50%, transparent)",
            border: "1px solid var(--kz-border-subtle)",
            borderRadius: "var(--kz-radius-lg)",
            overflow: "hidden",
            backdropFilter: "blur(4px)",
            height: "100%",
          }}
          className={`${compact ? "w-full" : "lg:col-span-7"}`}
        >
          {/* Legend indicators styled as horizontal glass capsules */}
          <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10, display: "flex", flexWrap: "wrap", gap: "8px", pointerEvents: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "color-mix(in srgb, var(--kz-surface-0) 90%, transparent)", border: "1px solid var(--kz-border-subtle)", padding: "4px 10px", borderRadius: "6px", backdropFilter: "blur(8px)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 6px rgba(99, 102, 241, 0.4)" }} />
              <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--kz-text-secondary)", letterSpacing: "0.02em" }}>INGRESS PHASES</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "color-mix(in srgb, var(--kz-surface-0) 90%, transparent)", border: "1px solid var(--kz-border-subtle)", padding: "4px 10px", borderRadius: "6px", backdropFilter: "blur(8px)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 6px rgba(59, 130, 246, 0.4)" }} />
              <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--kz-text-secondary)", letterSpacing: "0.02em" }}>ORAZAKA CORE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "color-mix(in srgb, var(--kz-surface-0) 90%, transparent)", border: "1px solid var(--kz-border-subtle)", padding: "4px 10px", borderRadius: "6px", backdropFilter: "blur(8px)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 6px rgba(168, 85, 247, 0.4)" }} />
              <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--kz-text-secondary)", letterSpacing: "0.02em" }}>EGRESS OUTPUT</span>
            </div>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.3}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            zoomOnScroll={false}
            panOnDrag={true}
            preventScrolling={true}
          >
            <Background
              color="var(--kz-accent)"
              gap={24}
              size={1}
              style={{ opacity: 0.04 }}
            />
            <Controls
              style={{
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-default)",
                boxShadow: "none",
                margin: "16px",
              }}
              showInteractive={false}
            />
          </ReactFlow>

          {/* Compact Mode HUD Panel absolute positioned */}
          {compact && (
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                zIndex: 10,
                width: "300px",
                maxHeight: "280px",
                display: "flex",
                flexDirection: "column",
                background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
                border: "1px solid var(--kz-border-strong)",
                borderRadius: "var(--kz-radius-lg)",
                backdropFilter: "blur(12px)",
                padding: "16px",
                boxShadow: "var(--kz-shadow-lg)",
                pointerEvents: "auto",
                transition: "all 300ms ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid var(--kz-border-subtle)", paddingBottom: "8px" }}>
                <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, color: "var(--kz-accent)", letterSpacing: "0.05em" }}>
                  {locale === "fr" ? "HUD: LOGS DE RAISONNEMENT" : "HUD: REASONING LOGS"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8.5px",
                    fontWeight: 700,
                    color: "var(--kz-accent)",
                    background: "var(--kz-accent-soft)",
                    border: "1px solid color-mix(in srgb, var(--kz-accent) 30%, transparent)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  STAGE: {selectedNodeId.replace("node-", "")}
                </span>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 800, color: "var(--kz-text-primary)", marginBottom: "4px" }}>
                {selectedData?.name}
              </h4>
              <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "var(--kz-text-secondary)", marginBottom: "12px" }}>
                {locale === "fr" ? selectedData?.desc.fr : selectedData?.desc.en}
              </p>
              
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9.5px",
                  background: "var(--kz-surface-0)",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid var(--kz-border-subtle)",
                  overflowX: "auto",
                  color: "var(--kz-text-secondary)",
                  lineHeight: "1.4",
                  maxHeight: "100px",
                  overflowY: "auto",
                }}
              >
                <div style={{ color: "var(--kz-accent)", fontWeight: 700, marginBottom: "4px" }}>
                  {"// "}
                  {locale === "fr" ? selectedData?.details.title.fr : selectedData?.details.title.en}
                </div>
                <pre style={{ color: "color-mix(in srgb, var(--kz-accent) 70%, var(--kz-text-primary))", margin: 0 }}>
                  {JSON.stringify(selectedData?.details.params, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Large Details Panel (only shown when NOT compact) */}
        {!compact && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
              border: "1px solid var(--kz-border-strong)",
              borderRadius: "var(--kz-radius-lg)",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}
            className="lg:col-span-3"
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--kz-border-subtle)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9.5px", fontWeight: 700, color: "var(--kz-accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {locale === "fr" ? "LOGS D'ENRICHISSEMENT CONTEXTUEL" : "CONTEXT ENRICHMENT LOGS"}
              </span>
              {hoveredNodeId ? (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8.5px",
                    fontWeight: 700,
                    color: "var(--kz-accent)",
                    background: "var(--kz-accent-soft)",
                    border: "1px solid color-mix(in srgb, var(--kz-accent) 30%, transparent)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                >
                  INSPECT
                </span>
              ) : (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "8.5px", color: "var(--kz-text-muted)", background: "var(--kz-surface-2)", padding: "2px 6px", borderRadius: "4px" }}>
                  LIVE_STREAM
                </span>
              )}
            </div>

            {/* Details Content */}
            <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "24px", overflowY: "auto" }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--kz-text-primary)", marginBottom: "4px" }}>
                  {selectedData?.name}
                </h4>
                <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "99px", fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid var(--kz-border-subtle)", background: "var(--kz-surface-2)", color: "var(--kz-text-secondary)", marginBottom: "16px" }}>
                  STAGE: {selectedNodeId.replace("node-", "")} | {selectedData?.phase}
                </span>
                <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--kz-text-secondary)", marginBottom: "20px", margin: 0 }}>
                  {locale === "fr" ? selectedData?.desc.fr : selectedData?.desc.en}
                </p>

                {/* JSON Mock Inspector Parameters */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9.5px", color: "var(--kz-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {locale === "fr" ? "Paramètres d'enrichissement :" : "Enrichment parameters:"}
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      background: "var(--kz-surface-0)",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "1px solid var(--kz-border-subtle)",
                      overflowX: "auto",
                      color: "var(--kz-text-secondary)",
                      lineHeight: "1.4",
                    }}
                  >
                    <div style={{ color: "var(--kz-accent)", fontWeight: 700, marginBottom: "6px" }}>
                      {"// "}
                      {locale === "fr" ? selectedData?.details.title.fr : selectedData?.details.title.en}
                    </div>
                    <pre style={{ color: "color-mix(in srgb, var(--kz-accent) 70%, var(--kz-text-primary))", margin: 0 }}>
                      {JSON.stringify(selectedData?.details.params, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Micro-warning for Loi 25 context */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  background: "rgba(59, 130, 246, 0.03)",
                  border: "1px solid var(--kz-accent-soft)",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "10.5px",
                  color: "var(--kz-text-secondary)",
                  fontFamily: "var(--font-mono)",
                  lineHeight: "1.4",
                }}
              >
                <ShieldAlert size={14} style={{ color: "var(--kz-accent)", flexShrink: 0, marginTop: "2px" }} />
                <span>
                  {locale === "fr"
                    ? "Conformément à la Loi 25, les données personnelles de l'utilisateur sont anonymisées au niveau de l'intercepteur AuditLog avant d'entrer dans le pipeline central d'inférence."
                    : "In compliance with Loi 25, personal user context fields are anonymized at the AuditLog interceptor phase prior to entering the core inference pipeline."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
