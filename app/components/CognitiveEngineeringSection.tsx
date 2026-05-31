"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Shuffle, Target, Gauge, Code2, Terminal, Play, RefreshCw, Info } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { motion } from "framer-motion";
import InterceptorMesh from "./demos/InterceptorMesh";

const keyMetadata: Record<string, { type: string; descFr: string; descEn: string; impact: string }> = {
  "orasaka": {
    type: "Object",
    descFr: "Racine de la configuration du moteur d'orchestration.",
    descEn: "Root of the orchestration engine configuration.",
    impact: "Structure globale"
  },
  "engine_mode": {
    type: "Enum (AGNOSTIC | DETERMINISTIC | ADAPTIVE_EFFORT)",
    descFr: "Détermine la stratégie de décision et de routage du moteur.",
    descEn: "Determines the engine's decision and routing strategy.",
    impact: "Contrôle du flux"
  },
  "data_sovereignty": {
    type: "String (strict_on_premise)",
    descFr: "Force le moteur à bloquer toute requête réseau sortante vers des tiers (Loi 25).",
    descEn: "Forces the engine to block any outbound network requests to third parties (Law 25).",
    impact: "Sécurité & Loi 25"
  },
  "allowed_providers": {
    type: "Array<String>",
    descFr: "Liste limitative des infrastructures d'inférence locales autorisées.",
    descEn: "Restrictive list of allowed local inference infrastructures.",
    impact: "Gouvernance"
  },
  "model_fallback": {
    type: "Object",
    descFr: "Règles de redondance locale en cas de panne de modèle.",
    descEn: "Local redundancy rules in case of model failure.",
    impact: "Haute disponibilité"
  },
  "primary": {
    type: "String",
    descFr: "Modèle d'inférence principal à interroger en local.",
    descEn: "Primary inference model to query locally.",
    impact: "Modèle principal"
  },
  "secondary": {
    type: "String",
    descFr: "Modèle secondaire de secours en cas de surcharge locale.",
    descEn: "Secondary fallback model in case of local overload.",
    impact: "Secours"
  },
  "parameters": {
    type: "Object",
    descFr: "Paramètres d'échantillonnage de l'inférence.",
    descEn: "Inference sampling parameters.",
    impact: "Précision"
  },
  "temperature": {
    type: "Float (0.0)",
    descFr: "Fixé à 0.0 pour détruire la créativité stochastique au profit de la précision mathématique.",
    descEn: "Set to 0.0 to eliminate stochastic creativity in favor of mathematical precision.",
    impact: "Zéro hallucination"
  },
  "top_p": {
    type: "Float (1.0)",
    descFr: "Ajuste la sélection de probabilité cumulée des tokens.",
    descEn: "Adjusts token cumulative probability selection.",
    impact: "Cohérence"
  },
  "strict_json_schema": {
    type: "Boolean",
    descFr: "Force le modèle à répondre avec un format JSON strict validé par schéma.",
    descEn: "Forces the model to reply with a strict schema-validated JSON format.",
    impact: "Fiabilité applicative"
  },
  "validation_loop": {
    type: "Object",
    descFr: "Configuration de la boucle fermée d'auto-correction.",
    descEn: "Closed-loop self-correction configuration.",
    impact: "Résilience"
  },
  "interceptor": {
    type: "String",
    descFr: "L'intercepteur responsable d'attraper et corriger les erreurs de format.",
    descEn: "The interceptor responsible for catching and correcting format errors.",
    impact: "Pipeline"
  },
  "validators": {
    type: "Array<String>",
    descFr: "Validateurs appliqués au schéma (ex: bac à sable MCP).",
    descEn: "Validators applied to the schema (e.g. MCP sandbox).",
    impact: "Sécurité"
  },
  "max_retries": {
    type: "Integer",
    descFr: "Nombre maximal de tentatives de correction en boucle fermée.",
    descEn: "Maximum closed-loop self-correction attempts.",
    impact: "Performance"
  },
  "compute_budget": {
    type: "Object",
    descFr: "Allocation dynamique du temps de calcul selon l'intention.",
    descEn: "Dynamic compute allocation based on intention.",
    impact: "Optimisation de coût"
  },
  "routing_analysis": {
    type: "String",
    descFr: "Ressources allouées à la détection d'intention.",
    descEn: "Resources allocated for intent detection.",
    impact: "Latence minimale"
  },
  "complex_deliberation": {
    type: "String",
    descFr: "Budget de réflexion alloué aux tâches multi-agents complexes.",
    descEn: "Reflection budget allocated to complex multi-agent tasks.",
    impact: "Intelligence profonde"
  },
  "stages": {
    type: "Object",
    descFr: "Configuration des chemins d'exécution adaptatifs.",
    descEn: "Adaptive execution path configuration.",
    impact: "Flexibilité"
  },
  "simple_intent": {
    type: "String",
    descFr: "Traitement ultra-rapide sans délibération pour le trivial.",
    descEn: "Ultra-fast processing without deliberation for trivial tasks.",
    impact: "Économie de ressources"
  },
  "complex_intent": {
    type: "String",
    descFr: "Lancement automatique de consensus d'agents pour le complexe.",
    descEn: "Automatic agent consensus invocation for complex tasks.",
    impact: "Raisonnement avancé"
  }
};

export default function CognitiveEngineeringSection() {
  const { locale, t } = useI18n();
  const [activeMode, setActiveMode] = useState<0 | 1 | 2>(1); // 1 = Deterministic as default
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "done">("idle");
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // Auto-scroll the terminal logs
  useEffect(() => {
    const logBox = document.getElementById("simulation-log-box");
    if (logBox) {
      logBox.scrollTop = logBox.scrollHeight;
    }
  }, [simulationLogs]);

  const renderLogLine = (log: string, index: number) => {
    let color = "var(--kz-text-secondary)";
    let prefix = "";
    let rest = log;

    if (log.startsWith("[")) {
      const closingBracketIdx = log.indexOf("]");
      if (closingBracketIdx !== -1) {
        prefix = log.substring(0, closingBracketIdx + 1);
        rest = log.substring(closingBracketIdx + 1);
      }
    }

    if (log.includes("[success]")) {
      color = "var(--kz-status-success)";
    } else if (log.includes("[error]")) {
      color = "var(--kz-status-error)";
    }

    const prefixColors: Record<string, string> = {
      "[sys]": "#a855f7",
      "[auth]": "#3b82f6",
      "[rule]": "#f59e0b",
      "[config]": "#eab308",
      "[route]": "#0ea5e9",
      "[inference]": "#10b981",
      "[audit]": "var(--kz-accent)",
      "[success]": "var(--kz-status-success)",
      "[error]": "var(--kz-status-error)",
      "[intent]": "#f43f5e",
      "[budget]": "#ec4899",
      "[agents]": "#84cc16",
      "[consensus]": "#14b8a6",
      "[validator]": "#f97316",
      "[sandbox]": "#06b6d4",
    };

    const prefixColor = prefixColors[prefix] || "var(--kz-text-muted)";

    return (
      <div key={index} style={{ color, display: "flex", gap: "6px", lineHeight: "1.4" }}>
        {prefix && (
          <span style={{ color: prefixColor, fontWeight: 700, fontFamily: "var(--font-mono, monospace)", flexShrink: 0 }}>
            {prefix}
          </span>
        )}
        <span style={{ fontFamily: "var(--font-mono, monospace)" }}>{rest}</span>
      </div>
    );
  };

  const selectMode = (mode: 0 | 1 | 2) => {
    setActiveMode(mode);
    setSimulationStatus("idle");
    setSimulationLogs([]);
  };

  const runSimulation = () => {
    if (simulationStatus === "running") return;
    setSimulationStatus("running");
    setSimulationLogs([]);

    const frLogs: Record<number, string[]> = {
      0: [
        "[sys] Initialisation du canal cognitif...",
        "[auth] Rôle utilisateur vérifié (RBAC: ADMIN)",
        "[rule] Limitation de souveraineté : strict_on_premise activé",
        "[route] Routage vers provider local : ollama/mistral-large-2026",
        "[inference] Inférence en cours (100% souveraine, données locales)...",
        "[audit] Log d'audit signé cryptographiquement et persisté en DB",
        "[success] Inférence complétée en 420ms. Zéro fuite réseau."
      ],
      1: [
        "[sys] Initialisation du canal cognitif...",
        "[config] Température fixée à 0.0 pour éliminer les hallucinations",
        "[route] Inférence déterministe lancée sur Llama-3-70b local...",
        "[validator] Réponse reçue. Validation du schéma JSON en cours...",
        "[sandbox] Exécution du code dans la sandbox isolée...",
        "[success] Validation stricte réussie. Zéro hallucination détectée."
      ],
      2: [
        "[sys] Initialisation du canal cognitif...",
        "[intent] Analyse de l'intention : Requête complexe détectée",
        "[budget] Allocation budgétaire réflexion : ADAPTIVE_EFFORT",
        "[agents] Lancement du débat multi-agents (3 agents locaux)",
        "[consensus] Consensus validé après 3 tours d'échanges",
        "[success] Solution structurée assemblée et retournée avec succès."
      ]
    };

    const enLogs: Record<number, string[]> = {
      0: [
        "[sys] Initializing cognitive channel...",
        "[auth] User role verified (RBAC: ADMIN)",
        "[rule] Sovereignty limitation: strict_on_premise active",
        "[route] Routing to local provider: ollama/mistral-large-2026",
        "[inference] Inference running (100% sovereign, local data)...",
        "[audit] Audit log cryptographically signed and stored in DB",
        "[success] Inference completed in 420ms. Zero network egress."
      ],
      1: [
        "[sys] Initializing cognitive channel...",
        "[config] Temperature set to 0.0 to eliminate hallucinations",
        "[route] Deterministic inference triggered on local Llama-3-70b...",
        "[validator] Reply received. Validating JSON schema structure...",
        "[sandbox] Running validation tests in isolated sandbox...",
        "[success] Strict validation passed. Zero hallucinations detected."
      ],
      2: [
        "[sys] Initializing cognitive channel...",
        "[intent] Intent analysis: Complex prompt detected",
        "[budget] Compute budget allocation: ADAPTIVE_EFFORT",
        "[agents] Spawning multi-agent debate (3 local agents)",
        "[consensus] Multi-agent consensus approved after 3 rounds",
        "[success] Structured solution assembled and returned successfully."
      ]
    };

    const selectedLogs = locale === "fr" ? frLogs[activeMode] : enLogs[activeMode];
    
    selectedLogs.forEach((log, idx) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, log]);
        if (idx === selectedLogs.length - 1) {
          setSimulationStatus("done");
        }
      }, (idx + 1) * 500);
    });
  };

  const modePayloads = [
    { mode: "agnostic", label: "orasaka_payload_agnostic.json" },
    { mode: "deterministic", label: "orasaka_payload_deterministic.json" },
    { mode: "effort", label: "orasaka_payload_adaptive_effort.json" }
  ];

  const renderHighlightedCode = () => {
    const keyStyle = { color: "#38bdf8", cursor: "help", transition: "color 150ms" };
    const stringStyle = { color: "#a7f3d0" };
    const numStyle = { color: "#c084fc" };
    const boolStyle = { color: "#34d399", fontWeight: 700 };

    const line = (num: string, content: React.ReactNode) => (
      <div key={num} style={{ display: "flex", alignItems: "center", minHeight: "20px" }} className="code-line">
        <span style={{ width: "32px", fontFamily: "var(--font-mono, monospace)", fontSize: "10.5px", color: "var(--kz-text-muted)", opacity: 0.45, userSelect: "none", flexShrink: 0 }}>
          {num}
        </span>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11.5px", color: "var(--kz-text-primary)" }}>
          {content}
        </span>
      </div>
    );

    const wrapKey = (name: string) => (
      <span
        style={keyStyle}
        onMouseEnter={() => setHoveredKey(name)}
        onMouseLeave={() => setHoveredKey(null)}
        className="hover:underline"
      >
        &quot;{name}&quot;
      </span>
    );

    if (activeMode === 0) {
      return [
        line("01", <span style={{ color: "var(--kz-text-muted)" }}>{"{"}</span>),
        line("02", <span>&nbsp;&nbsp;{wrapKey("orasaka")}{": {"}</span>),
        line("03", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("engine_mode")}{": "}<span style={stringStyle}>&quot;AGNOSTIC&quot;</span>{","}</span>),
        line("04", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("data_sovereignty")}{": "}<span style={stringStyle}>&quot;strict_on_premise&quot;</span>{","}</span>),
        line("05", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("allowed_providers")}{": ["}<span style={stringStyle}>&quot;ollama&quot;</span>{", "}<span style={stringStyle}>&quot;local_ai&quot;</span>{", "}<span style={stringStyle}>&quot;vllm&quot;</span>{"],"}</span>),
        line("06", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("model_fallback")}{": {"}</span>),
        line("07", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("primary")}{": "}<span style={stringStyle}>&quot;ollama/mistral-large-2026&quot;</span>{","}</span>),
        line("08", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("secondary")}{": "}<span style={stringStyle}>&quot;ollama/llama-3.1-8b&quot;</span></span>),
        line("09", <span>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</span>),
        line("10", <span>&nbsp;&nbsp;{"}"}</span>),
        line("11", <span style={{ color: "var(--kz-text-muted)" }}>{"}"}</span>)
      ];
    }

    if (activeMode === 1) {
      return [
        line("01", <span style={{ color: "var(--kz-text-muted)" }}>{"{"}</span>),
        line("02", <span>&nbsp;&nbsp;{wrapKey("orasaka")}{": {"}</span>),
        line("03", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("engine_mode")}{": "}<span style={stringStyle}>&quot;DETERMINISTIC&quot;</span>{","}</span>),
        line("04", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("parameters")}{": {"}</span>),
        line("05", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("temperature")}{": "}<span style={numStyle}>0.0</span>{","}</span>),
        line("06", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("top_p")}{": "}<span style={numStyle}>1.0</span>{","}</span>),
        line("07", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("strict_json_schema")}{": "}<span style={boolStyle}>true</span></span>),
        line("08", <span>&nbsp;&nbsp;&nbsp;&nbsp;{"},"}</span>),
        line("09", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("validation_loop")}{": {"}</span>),
        line("10", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("interceptor")}{": "}<span style={stringStyle}>&quot;ValidationLoopInterceptor&quot;</span>{","}</span>),
        line("11", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("validators")}{": ["}<span style={stringStyle}>&quot;json_schema&quot;</span>{", "}<span style={stringStyle}>&quot;mcp_sandbox_eval&quot;</span>{"],"}</span>),
        line("12", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("max_retries")}{": "}<span style={numStyle}>3</span></span>),
        line("13", <span>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</span>),
        line("14", <span>&nbsp;&nbsp;{"}"}</span>),
        line("15", <span style={{ color: "var(--kz-text-muted)" }}>{"}"}</span>)
      ];
    }

    return [
      line("01", <span style={{ color: "var(--kz-text-muted)" }}>{"{"}</span>),
      line("02", <span>&nbsp;&nbsp;{wrapKey("orasaka")}{": {"}</span>),
      line("03", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("engine_mode")}{": "}<span style={stringStyle}>&quot;ADAPTIVE_EFFORT&quot;</span>{","}</span>),
      line("04", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("compute_budget")}{": {"}</span>),
      line("05", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("routing_analysis")}{": "}<span style={stringStyle}>&quot;low_budget&quot;</span>{","}</span>),
      line("06", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("complex_deliberation")}{": "}<span style={stringStyle}>&quot;high_budget&quot;</span></span>),
      line("07", <span>&nbsp;&nbsp;&nbsp;&nbsp;{"},"}</span>),
      line("08", <span>&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("stages")}{": {"}</span>),
      line("09", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("simple_intent")}{": "}<span style={stringStyle}>&quot;direct_path_response&quot;</span>{","}</span>),
      line("10", <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{wrapKey("complex_intent")}{": "}<span style={stringStyle}>&quot;multi_agent_consensus&quot;</span></span>),
      line("11", <span>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</span>),
      line("12", <span>&nbsp;&nbsp;{"}"}</span>),
      line("13", <span style={{ color: "var(--kz-text-muted)" }}>{"}"}</span>)
    ];
  };

  return (
    <motion.section
      id="cognitive-engineering"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        padding: "112px 24px",
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
          marginBottom: "48px",
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
          {t.cognitiveEngineering.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            marginBottom: "4px",
          }}
        >
          {t.cognitiveEngineering.sectionTitle}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontWeight: 500,
            color: "var(--kz-text-muted)",
            marginBottom: "12px",
          }}
        >
          {t.cognitiveEngineering.sectionSub}
        </p>
        <p
          style={{
            fontSize: "14.5px",
            color: "var(--kz-text-secondary)",
            maxWidth: "600px",
            lineHeight: 1.65,
            marginBottom: "24px",
          }}
        >
          {t.cognitiveEngineering.sectionDesc}
        </p>

        {/* ─── 9 Stages vs 15 Interceptors Visual Badges ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "5px 12px",
              borderRadius: "var(--kz-radius-sm)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-accent)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {locale === "fr" ? "9 ÉTAPES DU PIPELINE PAR DÉFAUT" : "9 DEFAULT PIPELINE STAGES"}
          </span>
          <span
            style={{
              padding: "5px 12px",
              borderRadius: "var(--kz-radius-sm)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-text-primary)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {locale === "fr" ? "15 INTERCEPTEURS MODULAIRES DISPONIBLES" : "15 AVAILABLE MODULAR INTERCEPTORS"}
          </span>
        </div>
      </div>

      {/* ─── Interactive 15-interceptor Pipeline Mesh ─── */}
      <div style={{ margin: "40px 0 48px" }}>
        <InterceptorMesh compact={true} />
      </div>

      {/* ─── Execution Modes — Agnostic · Deterministic · Effort ─── */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--kz-accent)",
          }}
        >
          {locale === "fr" ? "Modes d'exécution" : "Execution modes"}
        </span>
      </div>
      <div
        className="cog-modes-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            icon: Shuffle,
            title: t.cognitiveEngineering.agnosticTitle,
            desc: t.cognitiveEngineering.agnosticDesc,
            tag: locale === "fr" ? "Sans verrouillage" : "No lock-in",
            color: "#0ea5e9"
          },
          {
            icon: Target,
            title: t.cognitiveEngineering.deterministicTitle,
            desc: t.cognitiveEngineering.deterministicDesc,
            tag: locale === "fr" ? "Zéro hallucination" : "Zero hallucinations",
            color: "#10b981"
          },
          {
            icon: Gauge,
            title: t.cognitiveEngineering.effortTitle,
            desc: t.cognitiveEngineering.effortDesc,
            tag: locale === "fr" ? "Calcul adaptatif" : "Adaptive compute",
            color: "#f59e0b"
          },
        ].map((mode, idx) => {
          const ModeIcon = mode.icon;
          const isActive = activeMode === idx;
          return (
            <button
              key={idx}
              onClick={() => selectMode(idx as 0 | 1 | 2)}
              className={`cog-mode-card ${isActive ? "active" : ""}`}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "26px 24px",
                borderRadius: "18px",
                background: isActive
                  ? `color-mix(in srgb, ${mode.color} 5%, var(--kz-surface-1))`
                  : "var(--kz-surface-1)",
                border: "1px solid",
                borderColor: isActive ? mode.color : "var(--kz-border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                outline: "none",
                boxShadow: isActive ? `0 10px 25px -5px color-mix(in srgb, ${mode.color} 15%, transparent)` : "none"
              }}
            >
              {/* Top accent hairline */}
              <span
                aria-hidden
                className="cog-mode-hairline"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "18px",
                  right: "18px",
                  height: "1.5px",
                  background: isActive ? mode.color : `linear-gradient(90deg, transparent, var(--kz-accent), transparent)`,
                  opacity: isActive ? 0.95 : 0.45,
                  transition: "all 280ms ease",
                }}
              />
              {/* Soft corner glow */}
              <span
                aria-hidden
                className="cog-mode-glow"
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "120px",
                  height: "120px",
                  background: mode.color,
                  opacity: isActive ? 0.12 : 0.04,
                  filter: "blur(40px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                  transition: "opacity 280ms ease",
                }}
              />

              {/* Header row: icon badge + index */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span
                  className="cog-mode-icon"
                  style={{
                    display: "inline-flex",
                    width: "44px",
                    height: "44px",
                    borderRadius: "13px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive ? `color-mix(in srgb, ${mode.color} 15%, transparent)` : "var(--kz-surface-2)",
                    border: "1px solid",
                    borderColor: isActive ? `color-mix(in srgb, ${mode.color} 30%, transparent)` : "var(--kz-border-subtle)",
                    color: isActive ? mode.color : "var(--kz-text-muted)",
                    transition: "all 280ms ease",
                  }}
                >
                  <ModeIcon size={19} strokeWidth={1.9} />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    color: "var(--kz-text-muted)",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                  <span style={{ opacity: 0.4 }}> / 03</span>
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 750,
                  color: "var(--kz-text-primary)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {mode.title}
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6, margin: 0, flex: 1 }}>
                {mode.desc}
              </p>

              {/* Tag chip */}
              <span
                style={{
                  alignSelf: "flex-start",
                  marginTop: "2px",
                  padding: "4px 11px",
                  borderRadius: "9999px",
                  background: isActive ? `color-mix(in srgb, ${mode.color} 10%, var(--kz-surface-2))` : "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "9.5px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isActive ? mode.color : "var(--kz-text-muted)",
                  transition: "all 280ms ease",
                }}
              >
                {mode.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Premium two-column IDE Editor + HUD telemetry dashboard grid ─── */}
      <div
        className="premium-ide-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
          marginBottom: "56px",
          alignItems: "stretch",
        }}
      >
        {/* Column 1: IDE Code Editor */}
        <div
          style={{
            borderRadius: "var(--kz-radius-lg)",
            background: "var(--kz-surface-0)",
            border: `1px solid color-mix(in srgb, ${activeMode === 1 ? "#10b981" : activeMode === 0 ? "#0ea5e9" : "#f59e0b"} 25%, var(--kz-border-subtle))`,
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.05)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all 300ms ease"
          }}
        >
          {/* File Tabs Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              background: "var(--kz-surface-1)",
              borderBottom: "1px solid var(--kz-border-subtle)",
              height: "42px",
            }}
          >
            {/* File Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 12px",
                  height: "42px",
                  borderRight: "1px solid var(--kz-border-subtle)",
                  borderLeft: "1px solid var(--kz-border-subtle)",
                  background: "var(--kz-surface-0)",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 600,
                  color: "var(--kz-text-primary)",
                  position: "relative",
                  top: "0px",
                }}
              >
                <Code2 size={12} style={{ color: activeMode === 1 ? "#10b981" : activeMode === 0 ? "#0ea5e9" : "#f59e0b" }} />
                <span>{modePayloads[activeMode].label}</span>
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: activeMode === 1 ? "#10b981" : activeMode === 0 ? "#0ea5e9" : "#f59e0b",
                  }}
                />
              </div>
            </div>
            
            <span style={{ fontSize: "9px", fontFamily: "var(--font-mono, monospace)", color: "var(--kz-text-muted)", background: "var(--kz-surface-2)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.08em" }}>
              JSON CONFIG
            </span>
          </div>

          {/* IDE Content */}
          <div style={{ padding: "20px 16px", overflowX: "auto", flex: 1, minHeight: "260px" }}>
            {renderHighlightedCode()}
          </div>
        </div>

        {/* Column 2: Telemetry & Inspector HUD */}
        <div
          style={{
            borderRadius: "var(--kz-radius-lg)",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "var(--kz-shadow-sm)",
          }}
        >
          {/* Neon Telemetry grid decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "120px",
              backgroundImage: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)",
              opacity: 0.15,
              pointerEvents: "none",
            }}
          />

          {/* Status Header Block */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--kz-border-subtle)", paddingBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10.5px", fontWeight: 700, color: "var(--kz-text-primary)", letterSpacing: "0.05em" }}>
                COGNITIVE_INTEGRITY: SECURE
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "9.5px", color: "var(--kz-text-muted)" }}>
              THREADS: 08/08 [QC]
            </span>
          </div>

          {/* Configuration Inspector Block */}
          <div style={{ flex: 1, minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {hoveredKey ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Info size={13} style={{ color: "var(--kz-accent)" }} />
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "12px", fontWeight: 755, color: "var(--kz-text-primary)" }}>
                    &quot;{hoveredKey}&quot;
                  </span>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono, monospace)", background: "var(--kz-surface-2)", color: "var(--kz-text-muted)", padding: "1px 6px", borderRadius: "3px" }}>
                    {keyMetadata[hoveredKey]?.type || "Value"}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {locale === "fr" ? keyMetadata[hoveredKey]?.descFr : keyMetadata[hoveredKey]?.descEn}
                </p>
                <div style={{ display: "inline-flex", alignSelf: "flex-start", fontSize: "9px", fontFamily: "var(--font-mono, monospace)", color: "var(--kz-accent)", background: "var(--kz-accent-soft)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.03em" }}>
                  IMPACT: {keyMetadata[hoveredKey]?.impact.toUpperCase()}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px 0", textAlign: "center" }}>
                <Terminal size={20} style={{ color: "var(--kz-text-muted)", opacity: 0.5 }} />
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", color: "var(--kz-text-muted)", letterSpacing: "0.04em" }}>
                  {locale === "fr" ? "SURVOLEZ UNE CLÉ CONFIG POUR L'INSPECTER" : "HOVER A CONFIG KEY TO INSPECT DETAILS"}
                </span>
              </div>
            )}
          </div>

          {/* Simulation Output Box — Fixed height prevents layout shifts */}
          <div
            id="simulation-log-box"
            style={{
              background: "var(--kz-surface-0)",
              border: "1px solid var(--kz-border-subtle)",
              borderRadius: "12px",
              padding: "16px",
              height: "155px",
              maxHeight: "155px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.5)",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {simulationStatus === "idle" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "14px", color: "var(--kz-text-muted)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.02em" }}>
                  {locale === "fr" ? "Simulateur d'inférence Orasaka" : "Orasaka Inference Simulator"}
                </span>
                <button
                  onClick={runSimulation}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    background: "var(--kz-accent)",
                    border: "none",
                    color: "var(--kz-on-accent)",
                    fontWeight: 700,
                    fontSize: "10px",
                    fontFamily: "var(--font-mono, monospace)",
                    cursor: "pointer",
                    boxShadow: "0 0 12px var(--kz-accent-soft), 0 4px 10px rgba(59, 130, 246, 0.25)",
                    transition: "all 200ms ease"
                  }}
                  className="hover:scale-105 active:scale-95"
                >
                  <Play size={10} fill="currentColor" />
                  {locale === "fr" ? "LANCER L'INFÉRENCE" : "RUN INFERENCE"}
                </button>
              </div>
            )}

            {(simulationStatus === "running" || simulationStatus === "done") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "4px" }}>
                  <span style={{ color: "var(--kz-text-muted)", fontSize: "9px", fontFamily: "var(--font-mono, monospace)", fontWeight: 700, letterSpacing: "0.06em" }}>
                    {simulationStatus === "running" ? "INFÉRENCE EN COURS..." : "CONDUIT TERMINÉ"}
                  </span>
                  {simulationStatus === "done" && (
                    <button
                      onClick={() => setSimulationStatus("idle")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--kz-accent)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "9px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono, monospace)",
                      }}
                      className="hover:underline"
                    >
                      <RefreshCw size={9} />
                      {locale === "fr" ? "RESET" : "RESET"}
                    </button>
                  )}
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  {simulationLogs.map((log, index) => renderLogLine(log, index))}
                  {simulationStatus === "running" && (
                    <span className="animate-pulse" style={{ color: "var(--kz-accent)", fontFamily: "var(--font-mono, monospace)" }}>&gt; _</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Pipeline stages (vertical timeline) ─── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "48px",
          paddingLeft: "32px",
        }}
      >
        {/* Continuous timeline line */}
        <div
          style={{
            position: "absolute",
            left: "11px",
            top: "12px",
            bottom: "12px",
            width: "2px",
            background: "linear-gradient(to bottom, var(--kz-accent), var(--kz-accent-soft) 80%, transparent)",
            opacity: 0.5,
          }}
        />

        {t.cognitiveEngineering.stages.map((stage, idx) => (
          <motion.div
            key={idx}
            className="cog-stage-item"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: idx * 0.05, ease: "easeOut" }}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: "16px",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Timeline node dot */}
            <div
              className="cog-stage-node"
              style={{
                position: "absolute",
                left: "-31px",
                top: "22px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "var(--kz-surface-0)",
                border: "2.5px solid var(--kz-accent)",
                boxShadow: "0 0 8px var(--kz-accent)",
                transition: "all 200ms ease",
                zIndex: 2,
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--kz-accent)",
                  background: "var(--kz-accent-soft)",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  letterSpacing: "0.05em",
                }}
              >
                {stage.order}
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                  margin: 0,
                  letterSpacing: "-0.015em",
                }}
              >
                {stage.name}
              </h4>
            </div>

            <p style={{ fontSize: "13px", color: "var(--kz-text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {stage.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ─── Principles grid ─── */}
      <div
        className="cog-principles-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "10px",
          marginBottom: "40px",
        }}
      >
        {t.cognitiveEngineering.principles.map((principle, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
            style={{
              padding: "24px 22px",
              borderRadius: "14px",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "14.5px",
                fontWeight: 650,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              {principle.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--kz-text-muted)",
                lineHeight: 1.6,
              }}
            >
              {principle.desc}
            </p>
          </motion.article>
        ))}
      </div>

      {/* ─── CTA ─── */}
      <div style={{ textAlign: "center" }}>
        <Link
          id="cog-eng-cta"
          href={t.cognitiveEngineering.ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: 600,
            background: "var(--kz-accent)",
            color: "var(--kz-on-accent)",
            textDecoration: "none",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            transition: "opacity 150ms ease",
          }}
        >
          {t.cognitiveEngineering.ctaLabel}
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
      </div>

      <style>{`
        .cog-stage-item:hover {
          border-color: var(--kz-accent) !important;
          transform: translateX(4px);
          box-shadow: 0 8px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.04));
          background: var(--kz-surface-2) !important;
        }
        .cog-stage-item:hover .cog-stage-node {
          background: var(--kz-accent) !important;
          transform: scale(1.3);
          box-shadow: 0 0 12px var(--kz-accent);
        }
        .cog-mode-card:hover {
          transform: translateY(-6px);
          border-color: var(--kz-accent) !important;
          box-shadow: 0 18px 40px -12px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.18));
        }
        .cog-mode-card:hover .cog-mode-hairline { opacity: 0.9 !important; }
        .cog-mode-card:hover .cog-mode-glow { opacity: 0.12 !important; }
        .cog-mode-card:hover .cog-mode-icon {
          transform: scale(1.06);
          box-shadow: 0 6px 18px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.22));
        }
        @media (min-width: 960px) {
          .premium-ide-grid {
            grid-template-columns: 7fr 5fr !important;
          }
        }
        .code-line {
          transition: background-color 150ms ease;
          border-radius: 4px;
          padding: 0 8px;
          margin: 0 -8px;
        }
        .code-line:hover {
          background-color: var(--kz-surface-1);
        }
        @media (max-width: 860px) {
          .cog-modes-grid {
            grid-template-columns: 1fr !important;
            max-width: 460px;
            margin-left: auto;
            margin-right: auto;
          }
        }
        @media (max-width: 640px) {
          .cog-principles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.section>
  );
}
