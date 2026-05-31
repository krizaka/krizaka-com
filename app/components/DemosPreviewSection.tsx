"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Eye, Image as ImageIcon, Cpu, Database } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { motion } from "framer-motion";

const COPY = {
  fr: {
    label: "Démos & Multimodal",
    title: "Le moteur Orasaka en action",
    desc: "Découvrez l'exécution locale du pipeline de cognition d'Orasaka. Visualisez l'ingestion vectorielle, l'exécution des intercepteurs et les générations d'IA en direct.",
    cta: "Explorer la galerie",
    termTitle: "orasaka-cli — active_session",
    tabs: {
      cli: "Terminal CLI",
      vector: "Ingestion Vectorielle",
      cognitive: "Raisonnement Cognitive",
      creative: "Générations Locales",
    },
    tabDescs: {
      cli: "Interface en ligne de commande démarrant le moteur d'orchestration local.",
      vector: "Indexation RAG en temps réel et injection de connaissances vectorielles (pgvector).",
      cognitive: "Analyse de requêtes et exécution séquentielle à travers le maillage d'intercepteurs.",
      creative: "Livrables, images et visuels générés on-premise (Stable Diffusion).",
    }
  },
  en: {
    label: "Demos & Multimodal",
    title: "Orasaka engine in action",
    desc: "Experience Orasaka's cognitive pipeline running locally. Watch real-time vector ingestion, interceptor routing, and local AI image generation.",
    cta: "Explore gallery",
    termTitle: "orasaka-cli — active_session",
    tabs: {
      cli: "Terminal CLI",
      vector: "Vector Ingestion",
      cognitive: "Cognitive Reasoning",
      creative: "Local Generations",
    },
    tabDescs: {
      cli: "Command line interface starting the local AI orchestration engine.",
      vector: "Real-time RAG indexation and local vector database knowledge injection.",
      cognitive: "Query optimization and sequential execution across the interceptor mesh.",
      creative: "Creative copy and visuals generated entirely on-premise (Stable Diffusion).",
    }
  }
} as const;

type TabKey = "cli" | "vector" | "cognitive" | "creative";

export default function DemosPreviewSection() {
  const { locale } = useI18n();
  const c = COPY[locale];
  const [activeTab, setActiveTab] = useState<TabKey>("cli");

  // Tab configurations matching PipelineMesh colors
  const tabConfig = {
    cli: {
      icon: Terminal,
      color: "#3b82f6",
      glow: "rgba(59, 130, 246, 0.2)",
      src: "/assets/orasaka/orasaka/screenshots/start.gif",
      type: "image"
    },
    vector: {
      icon: Database,
      color: "#a855f7",
      glow: "rgba(168, 85, 247, 0.2)",
      src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204246.mp4",
      type: "video"
    },
    cognitive: {
      icon: Cpu,
      color: "#10b981",
      glow: "rgba(16, 185, 129, 0.2)",
      src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204836.mp4",
      type: "video"
    },
    creative: {
      icon: ImageIcon,
      color: "#d946ef",
      glow: "rgba(217, 70, 239, 0.2)",
      src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_202752.png",
      type: "image"
    }
  } as const;

  const currentTab = tabConfig[activeTab];

  return (
    <motion.section
      id="demos-preview"
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          alignItems: "center",
          gap: "48px",
        }}
        className="demos-preview-grid"
      >
        {/* Left text column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--kz-accent)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {c.label}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {c.title}
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--kz-text-secondary)",
              margin: 0,
            }}
          >
            {c.desc}
          </p>

          {/* Interactive Pills */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            {(Object.keys(tabConfig) as TabKey[]).map((key) => {
              const tab = tabConfig[key];
              const Icon = tab.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="demo-tab-pill"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "var(--kz-radius-md)",
                    border: "1px solid",
                    borderColor: isActive ? tab.color : "var(--kz-border-subtle)",
                    background: isActive ? `color-mix(in srgb, ${tab.color} 10%, var(--kz-surface-1))` : "var(--kz-surface-1)",
                    color: isActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 200ms ease",
                    outline: "none",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      background: isActive ? `color-mix(in srgb, ${tab.color} 20%, transparent)` : "var(--kz-surface-2)",
                      color: isActive ? tab.color : "var(--kz-text-muted)",
                      transition: "all 200ms ease",
                    }}
                  >
                    <Icon size={14} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 650,
                        color: isActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)",
                      }}
                    >
                      {c.tabs[key]}
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        style={{
                          fontSize: "11px",
                          color: "var(--kz-text-muted)",
                          marginTop: "2px",
                          lineHeight: 1.4,
                        }}
                      >
                        {c.tabDescs[key]}
                      </motion.div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "16px" }}>
            <Link
              href="/demos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: 600,
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-strong)",
                color: "var(--kz-text-primary)",
                textDecoration: "none",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                transition: "border-color 150ms ease, background-color 150ms ease",
              }}
              className="demo-preview-cta"
            >
              <Eye size={15} />
              {c.cta}
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </motion.div>

        {/* Right terminal column */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "relative",
            borderRadius: "var(--kz-radius-lg)",
            border: `1px solid ${currentTab.color}33`,
            background: "var(--kz-surface-1)",
            boxShadow: `0 15px 35px -10px ${currentTab.color}15, var(--kz-shadow-lg)`,
            overflow: "hidden",
            transition: "all 300ms ease",
          }}
        >
          {/* Mac window header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "var(--kz-surface-2)",
              borderBottom: "1px solid var(--kz-border-subtle)",
            }}
          >
            {/* Window control dots */}
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "hsl(0, 84%, 60%)" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "hsl(38, 92%, 50%)" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "hsl(160, 84%, 39%)" }} />
            </div>

            {/* Terminal Title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                color: "var(--kz-text-muted)",
              }}
            >
              <Terminal size={11} />
              {c.termTitle}
            </div>
            {/* spacer for alignment */}
            <div style={{ width: "39px" }} />
          </div>

          {/* Terminal Content Box */}
          <div
            style={{
              padding: "16px",
              background: "var(--kz-surface-0)",
              aspectRatio: "1.6 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {currentTab.type === "video" ? (
              <video
                src={currentTab.src}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "var(--kz-radius-sm)",
                  border: "1px solid var(--kz-border-subtle)",
                }}
              />
            ) : (
              <img
                src={currentTab.src}
                alt={c.tabs[activeTab]}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "var(--kz-radius-sm)",
                  border: "1px solid var(--kz-border-subtle)",
                  objectFit: "contain",
                }}
              />
            )}

            {/* Neon active overlay strip */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: currentTab.color,
                boxShadow: `0 0 10px ${currentTab.color}`,
              }}
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        .demo-tab-pill:hover {
          border-color: var(--kz-text-secondary) !important;
          background: var(--kz-surface-2) !important;
        }
        .demo-preview-cta:hover {
          border-color: var(--kz-accent) !important;
          background-color: var(--kz-surface-3) !important;
        }
        @media (max-width: 820px) {
          .demos-preview-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </motion.section>
  );
}
