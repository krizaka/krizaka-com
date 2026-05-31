"use client";


import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Shield, Cpu, Database, ChevronRight, MessageSquare, Lock, CheckCircle2, Brain, Globe, AlertTriangle } from "lucide-react";
import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";
import { useI18n } from "../../../../components/I18nProvider";

/* ─── Animated Owl Mascot SVG ─── */
function OwlMascotLarge({ size = 140 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="large-owl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <radialGradient id="owl-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g>
        {/* Ambient Glow */}
        <motion.circle
          cx="30"
          cy="30"
          r="42"
          fill="url(#owl-glow)"
          animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Body */}
        <motion.path
          d="M 18 22 C 18 10, 42 10, 42 22 C 42 38, 36 45, 30 45 C 24 45, 18 38, 18 22 Z"
          fill="url(#large-owl-grad)"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eyes & Pupils */}
        <g>
          <circle cx="24" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
          <circle cx="36" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
          <motion.circle
            cx="24" cy="18" r="1.5" fill="#00ff66"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.47, 0.5, 1] }}
            style={{ transformOrigin: "24px 18px" }}
          />
          <motion.circle
            cx="36" cy="18" r="1.5" fill="#00ff66"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.47, 0.5, 1] }}
            style={{ transformOrigin: "36px 18px" }}
          />
        </g>

        {/* Beak */}
        <polygon points="28,20 32,20 30,25" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />

        {/* Ears / Horns */}
        <motion.polygon
          points="20,11 24,14 18,18"
          fill="#7c3aed"
          stroke="var(--kz-border-strong)" strokeWidth="1"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "24px 14px" }}
        />
        <motion.polygon
          points="40,11 36,14 42,18"
          fill="#7c3aed"
          stroke="var(--kz-border-strong)" strokeWidth="1"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "36px 14px" }}
        />
      </g>
    </svg>
  );
}

const NEUROMORPHIC_ICONS = [Cpu, Database, Shield];
const CARD_COLORS = ["#f43f5e", "#3b82f6", "#10b981"];

export default function CognitiveEngineeringPageClient() {
  const { locale, t } = useI18n();
  const p = t.cognitiveEngineeringPage;

  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)", overflowX: "hidden" }}>
      <TopNavBar />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "120px 24px 100px",
        }}
      >
        {/* ─── Elegant Back Link ─── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--kz-text-muted)",
              textDecoration: "none",
              marginBottom: "40px",
              fontFamily: "var(--font-mono, monospace)",
              transition: "color 150ms ease",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
            className="back-btn"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            {p.backHome}
          </Link>
        </motion.div>

        {/* ─── HERO SECTION: Centered Layout ─── */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "32px",
            marginBottom: "80px",
          }}
          className="hero-section-centered"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "10.5px",
                fontWeight: 800,
                color: "var(--kz-accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "14px",
              }}
            >
              Orazaka Cognitive Infrastructure
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(2rem, 5vw, 2.7rem)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                color: "var(--kz-text-primary)",
                lineHeight: 1.12,
                marginBottom: "24px",
                maxWidth: "800px",
              }}
            >
              {p.introTitle}
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--kz-text-secondary)",
                lineHeight: 1.75,
                maxWidth: "720px",
                margin: "0 auto",
                whiteSpace: "pre-line",
              }}
            >
              {p.introText}
            </p>
          </motion.div>

          {/* Hero Mascot Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "var(--kz-surface-1)",
                border: "1.5px solid var(--kz-border-strong)",
                boxShadow: "var(--kz-shadow-lg), 0 0 40px rgba(167, 139, 250, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <OwlMascotLarge size={140} />
            </div>
          </motion.div>
        </section>

        {/* ─── KRIZAKA VISION PANEL ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            marginBottom: "96px",
            padding: "48px 40px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, var(--kz-surface-1) 0%, rgba(167, 139, 250, 0.02) 100%)",
            border: "1px solid var(--kz-border-default)",
            boxShadow: "var(--kz-shadow-md)",
            position: "relative",
            overflow: "hidden"
          }}
          className="vision-panel"
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(167, 139, 250, 0.08)",
              filter: "blur(50px)",
              pointerEvents: "none"
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <span style={{ color: "var(--kz-accent)" }}>⚡</span>
            {p.visionTitle}
          </h2>
          <p
            style={{
              fontSize: "14.5px",
              color: "var(--kz-text-secondary)",
              lineHeight: 1.75,
              margin: 0,
              whiteSpace: "pre-line"
            }}
          >
            {p.visionText}
          </p>
        </motion.section>

        {/* ─── SECTION: 3 Pillars of Cognition Grid ─── */}
        <section style={{ marginBottom: "96px" }}>
          <div style={{ marginBottom: "40px", maxWidth: "680px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--kz-accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {locale === "fr" ? "COGNITION COMPLÈTE" : "FULL COGNITION"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                fontWeight: 800,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              {p.neuromorphicTitle}
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {p.neuromorphicDesc}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {p.neuromorphicCards.map((card, idx) => {
              const IconComponent = NEUROMORPHIC_ICONS[idx % NEUROMORPHIC_ICONS.length] || Shield;
              const cardColor = CARD_COLORS[idx % CARD_COLORS.length] || "var(--kz-accent)";
              return (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="family-card"
                  style={{
                    padding: "32px 28px 32px 34px",
                    borderRadius: "var(--kz-radius-lg)",
                    background: "var(--kz-surface-1)",
                    border: "1px solid var(--kz-border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* HUD Corner Brackets */}
                  <div style={{ position: "absolute", inset: "4px", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, width: "6px", height: "6px", borderLeft: `1.2px solid ${cardColor}`, borderTop: `1.2px solid ${cardColor}`, opacity: 0.4 }} />
                    <div style={{ position: "absolute", right: 0, top: 0, width: "6px", height: "6px", borderRight: `1.2px solid ${cardColor}`, borderTop: `1.2px solid ${cardColor}`, opacity: 0.4 }} />
                    <div style={{ position: "absolute", left: 0, bottom: 0, width: "6px", height: "6px", borderLeft: `1.2px solid ${cardColor}`, borderBottom: `1.2px solid ${cardColor}`, opacity: 0.4 }} />
                    <div style={{ position: "absolute", right: 0, bottom: 0, width: "6px", height: "6px", borderRight: `1.2px solid ${cardColor}`, borderBottom: `1.2px solid ${cardColor}`, opacity: 0.4 }} />
                  </div>

                  {/* Left Accent vertical bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      background: cardColor,
                    }}
                  />

                  {/* Top-right blinking LED */}
                  <div
                    className="card-led-blink"
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "12px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: cardColor,
                      boxShadow: `0 0 8px ${cardColor}`,
                    }}
                  />

                  <div>
                    {/* Header: Brain region & Icon */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "var(--kz-radius-md)",
                          background: `${cardColor}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: cardColor,
                        }}
                      >
                        <IconComponent size={18} strokeWidth={2.2} />
                      </div>
                      
                      {/* Brain region badge */}
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: cardColor,
                          background: `${cardColor}15`,
                          padding: "3px 8px",
                          borderRadius: "var(--kz-radius-sm)",
                          textTransform: "uppercase",
                          marginRight: "14px"
                        }}
                      >
                        {card.brainRegion}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        fontSize: "17.5px",
                        fontWeight: 700,
                        color: "var(--kz-text-primary)",
                        marginBottom: "6px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {card.title}
                    </h3>
                    
                    {/* Tech Module name */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "11px",
                        color: "var(--kz-text-muted)",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ fontSize: "10px" }}>⚙️</span> {card.moduleName}
                    </div>

                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "var(--kz-text-secondary)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ─── SECTION: 3-Stage Flow Diagram (Horizontal/Vertical) ─── */}
        <section style={{ marginBottom: "96px" }}>
          <div style={{ marginBottom: "40px", maxWidth: "680px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--kz-accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {locale === "fr" ? "ARCHITECTURE DU CONTRÔLE" : "CONTROL ARCHITECTURE"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                fontWeight: 800,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              {p.pipelineTitle}
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {p.pipelineDesc}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
            className="modes-grid"
          >
            {[
              {
                step: "01",
                title: locale === "fr" ? "Perception & Ingestion" : "Perception & Ingestion",
                desc: locale === "fr" ? "La requête est nettoyée, les variables d'environnement sont injectées et l'identité de l'utilisateur (RBAC) est vérifiée localement." : "The query is cleaned, system context variables are injected, and user identity (RBAC) is verified locally.",
                color: "#f43f5e"
              },
              {
                step: "02",
                title: locale === "fr" ? "Raisonnement & Contextualisation" : "Reasoning & Context",
                desc: locale === "fr" ? "Orazaka consulte les connaissances à long terme (RAG), la mémoire récente et route l'instruction vers le modèle idéal (local ou cloud)." : "Orazaka queries long-term context (RAG) and short-term sliding memory, then routes the prompt to the optimal local or cloud model.",
                color: "#a78bfa"
              },
              {
                step: "03",
                title: locale === "fr" ? "Validation & Métacognition" : "Validation & Metacognition",
                desc: locale === "fr" ? "La réponse est auditée en boucle fermée (validation JSON, règles de sécurité, sandbox d'exécution) avant livraison." : "The final output is audited in a closed loop (JSON schema validation, safety rules, execution sandbox) before delivery.",
                color: "#10b981"
              }
            ].map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="registry-card"
                style={{
                  background: "var(--kz-surface-1)",
                  border: "1px solid var(--kz-border-subtle)",
                  borderRadius: "var(--kz-radius-lg)",
                  padding: "32px 28px 32px 34px",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  textAlign: "left"
                }}
              >
                {/* L-brackets corners */}
                <div style={{ position: "absolute", inset: "4px", pointerEvents: "none" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: "6px", height: "6px", borderLeft: `1.2px solid ${stage.color}`, borderTop: `1.2px solid ${stage.color}`, opacity: 0.4 }} />
                  <div style={{ position: "absolute", right: 0, top: 0, width: "6px", height: "6px", borderRight: `1.2px solid ${stage.color}`, borderTop: `1.2px solid ${stage.color}`, opacity: 0.4 }} />
                  <div style={{ position: "absolute", left: 0, bottom: 0, width: "6px", height: "6px", borderLeft: `1.2px solid ${stage.color}`, borderBottom: `1.2px solid ${stage.color}`, opacity: 0.4 }} />
                  <div style={{ position: "absolute", right: 0, bottom: 0, width: "6px", height: "6px", borderRight: `1.2px solid ${stage.color}`, borderBottom: `1.2px solid ${stage.color}`, opacity: 0.4 }} />
                </div>

                {/* Left Accent vertical bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: stage.color,
                  }}
                />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: stage.color,
                      background: `${stage.color}15`,
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {stage.step}
                  </span>
                  
                  {/* Blinking LED */}
                  <div
                    className="card-led-blink"
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: stage.color,
                      boxShadow: `0 0 8px ${stage.color}`,
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    margin: 0,
                  }}
                >
                  {stage.title}
                </h3>
                
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--kz-text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {stage.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── SECTION: DynamicPipelineExecutor (Two-Phase Execution) ─── */}
        <section
          style={{
            marginBottom: "96px",
            padding: "48px 40px",
            borderRadius: "24px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            position: "relative",
          }}
          className="executor-section"
        >
          <div style={{ marginBottom: "36px", maxWidth: "650px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--kz-accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {locale === "fr" ? "PROCESSEUR D'INFÉRENCE" : "INFERENCE PROCESSOR"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight: 800,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              {p.executorTitle}
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {p.executorDesc}
            </p>
          </div>

          {/* Visual Execution Flow Diagram */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "24px",
              alignItems: "center",
            }}
            className="flow-grid"
          >
            {/* Stage 1 Container */}
            <div
              style={{
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "var(--kz-radius-lg)",
                padding: "32px 28px",
                boxShadow: "var(--kz-shadow-md)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                position: "relative",
                overflow: "hidden",
                minHeight: "380px"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "120px",
                  height: "120px",
                  background: "radial-gradient(circle, hsla(217, 92%, 60%, 0.08) 0%, transparent 70%)",
                  pointerEvents: "none"
                }}
              />
              
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "var(--kz-accent)",
                    background: "var(--kz-accent-soft)",
                    padding: "3px 8px",
                    borderRadius: "var(--kz-radius-sm)",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginBottom: "12px",
                  }}
                >
                  PHASE 01
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "17.5px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.executorPhases[0].title}
                </h3>
                <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {p.executorPhases[0].desc}
                </p>
              </div>

              {/* Visual Schema inside Stage 1 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: "color-mix(in srgb, var(--kz-surface-1) 50%, transparent)",
                  border: "1px solid var(--kz-border-subtle)",
                  borderRadius: "var(--kz-radius-md)",
                  padding: "16px",
                  marginTop: "auto",
                  position: "relative"
                }}
              >
                {/* Inputs Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { label: locale === "fr" ? "Mémoire" : "Memory", sub: "FIFO Chat", icon: MessageSquare },
                    { label: locale === "fr" ? "Connaissances" : "Knowledge", sub: "RAG / Vector", icon: Database },
                    { label: locale === "fr" ? "Règles" : "Rules", sub: "RBAC / Env", icon: Shield }
                  ].map((input, i) => {
                    const Icon = input.icon;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          background: "var(--kz-surface-3)",
                          border: "1px solid var(--kz-border-subtle)",
                          borderRadius: "var(--kz-radius-sm)",
                          padding: "10px 4px",
                          gap: "6px"
                        }}
                      >
                        <div style={{ color: "var(--kz-accent)" }}>
                          <Icon size={16} strokeWidth={2} />
                        </div>
                        <div>
                          <div style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--kz-text-primary)", whiteSpace: "nowrap" }}>{input.label}</div>
                          <div style={{ fontSize: "9px", color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)" }}>{input.sub}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Converging connector lines */}
                <div style={{ display: "flex", justifyContent: "center", height: "16px", position: "relative" }}>
                  <svg width="100%" height="16" style={{ overflow: "visible" }}>
                    <path d="M 16.6% 0 L 16.6% 8 L 50% 12" stroke="var(--kz-border-strong)" strokeWidth="1.2" fill="none" />
                    <path d="M 50% 0 L 50% 12" stroke="var(--kz-border-strong)" strokeWidth="1.2" fill="none" />
                    <path d="M 83.3% 0 L 83.3% 8 L 50% 12" stroke="var(--kz-border-strong)" strokeWidth="1.2" fill="none" />
                  </svg>
                </div>

                {/* Converged Node */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "var(--kz-accent-soft)",
                    border: "1px solid var(--kz-accent)",
                    borderRadius: "var(--kz-radius-sm)",
                    padding: "8px 12px",
                    margin: "0 auto",
                    width: "fit-content"
                  }}
                >
                  <Cpu size={14} style={{ color: "var(--kz-accent)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--kz-text-primary)", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {locale === "fr" ? "Contexte Enrichi" : "Enriched Context"}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator / Connector bridge */}
            <div
              className="flow-arrow"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div className="pipeline-bridge">
                <div className="pipeline-dot" />
              </div>
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--kz-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {locale === "fr" ? "TRANSFERT" : "TRANSFER"}
              </div>
            </div>

            {/* Stage 2 Container */}
            <div
              style={{
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "var(--kz-radius-lg)",
                padding: "32px 28px",
                boxShadow: "var(--kz-shadow-md)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                position: "relative",
                overflow: "hidden",
                minHeight: "380px"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "120px",
                  height: "120px",
                  background: "radial-gradient(circle, hsla(160, 84%, 39%, 0.05) 0%, transparent 70%)",
                  pointerEvents: "none"
                }}
              />

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "var(--kz-status-success)",
                    background: "rgba(16, 185, 129, 0.08)",
                    padding: "3px 8px",
                    borderRadius: "var(--kz-radius-sm)",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginBottom: "12px",
                  }}
                >
                  PHASE 02
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "17.5px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.executorPhases[1].title}
                </h3>
                <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {p.executorPhases[1].desc}
                </p>
              </div>

              {/* Visual Schema inside Stage 2 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: "color-mix(in srgb, var(--kz-surface-1) 50%, transparent)",
                  border: "1px solid var(--kz-border-subtle)",
                  borderRadius: "var(--kz-radius-md)",
                  padding: "16px 20px",
                  marginTop: "auto",
                  position: "relative"
                }}
              >
                {/* Vertical line behind the steps */}
                <div 
                  style={{ 
                    position: "absolute", 
                    left: "35px", 
                    top: "30px", 
                    bottom: "30px", 
                    width: "2px", 
                    background: "linear-gradient(to bottom, var(--kz-border-strong), var(--kz-status-success))",
                    zIndex: 0 
                  }} 
                />

                {/* Sequential Flow steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>
                  {[
                    { label: locale === "fr" ? "Bac à sable sécurisé" : "Secure Sandbox", desc: locale === "fr" ? "Raisonnement isolé" : "Isolated reasoning", icon: Lock },
                    { label: locale === "fr" ? "Contrôles de conformité" : "Compliance Checks", desc: locale === "fr" ? "Validation de schéma JSON" : "JSON schema validation", icon: Shield },
                    { label: locale === "fr" ? "Réponse finale validée" : "Secure Delivery", desc: locale === "fr" ? "Hermétique et certifiée" : "Hermetic and certified", icon: CheckCircle2 }
                  ].map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: i === 2 ? "rgba(16, 185, 129, 0.15)" : "var(--kz-surface-3)",
                            border: `1.5px solid ${i === 2 ? "var(--kz-status-success)" : "var(--kz-border-strong)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: i === 2 ? "var(--kz-status-success)" : "var(--kz-text-primary)",
                            flexShrink: 0,
                            boxShadow: i === 2 ? "0 0 10px rgba(16, 185, 129, 0.2)" : "none"
                          }}
                        >
                          <StepIcon size={14} strokeWidth={2.2} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--kz-text-primary)" }}>{step.label}</div>
                          <div style={{ fontSize: "9.5px", color: "var(--kz-text-secondary)" }}>{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION: Operating Modes & Customization ─── */}
        <section style={{ marginBottom: "96px" }}>
          <div style={{ marginBottom: "40px", maxWidth: "680px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--kz-accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {locale === "fr" ? "MODES DE FONCTIONNEMENT" : "OPERATING MODES"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                fontWeight: 800,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              {p.modesTitle}
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {p.modesDesc}
            </p>
          </div>

          {/* Grid layout for modes & configuration */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px",
              marginBottom: "24px",
            }}
            className="modes-grid"
          >
            {/* The 2 Default Modes */}
            {p.modes.map((mode, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="mode-card"
                style={{
                  background: "var(--kz-surface-1)",
                  border: "1px solid var(--kz-border-subtle)",
                  borderRadius: "var(--kz-radius-lg)",
                  padding: "32px 28px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 200ms ease, box-shadow 200ms ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: mode.accent || "var(--kz-accent)",
                  }}
                />
                
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "var(--kz-accent)",
                      background: "var(--kz-accent-soft)",
                      padding: "2px 6px",
                      borderRadius: "var(--kz-radius-sm)",
                      textTransform: "uppercase",
                      display: "inline-block",
                      marginBottom: "14px"
                    }}
                  >
                    {locale === "fr" ? "MODE PAR DÉFAUT" : "DEFAULT MODE"}
                  </span>

                  <h3
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "17.5px",
                      fontWeight: 700,
                      color: "var(--kz-text-primary)",
                      marginBottom: "12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {mode.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "var(--kz-text-secondary)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {mode.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── EFFORT ADJUSTMENT — Full-width card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mode-card"
            style={{
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              borderRadius: "var(--kz-radius-lg)",
              padding: "36px 32px",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #f59e0b, #f97316)",
              }}
            />

            {/* Header Row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--kz-radius-md)",
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Cpu size={20} strokeWidth={1.5} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "var(--kz-status-warning)",
                    background: "rgba(245, 158, 11, 0.08)",
                    padding: "2px 6px",
                    borderRadius: "var(--kz-radius-sm)",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  {locale === "fr" ? "PARAMÈTRE ADAPTATIF" : "ADAPTIVE PARAMETER"}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.01em",
                    marginBottom: "6px",
                  }}
                >
                  {p.effortTitle}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--kz-text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: "640px",
                  }}
                >
                  {p.effortDesc}
                </p>
              </div>
            </div>

            {/* 3-Level Effort Visual */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
              className="modes-grid"
            >
              {[
                {
                  level: locale === "fr" ? "Bas" : "Low",
                  sub: locale === "fr" ? "Réponse directe" : "Direct response",
                  interceptors: locale === "fr" ? "3–5 intercepteurs" : "3–5 interceptors",
                  tokens: locale === "fr" ? "Tokens minimaux" : "Minimal tokens",
                  color: "#22c55e",
                  bar: "25%",
                  icon: "⚡",
                },
                {
                  level: locale === "fr" ? "Moyen" : "Medium",
                  sub: locale === "fr" ? "Analyse standard" : "Standard analysis",
                  interceptors: locale === "fr" ? "7–10 intercepteurs" : "7–10 interceptors",
                  tokens: locale === "fr" ? "Budget équilibré" : "Balanced budget",
                  color: "#f59e0b",
                  bar: "55%",
                  icon: "⚙️",
                },
                {
                  level: locale === "fr" ? "Haut" : "High",
                  sub: locale === "fr" ? "Délibération profonde" : "Deep deliberation",
                  interceptors: locale === "fr" ? "12–15 intercepteurs" : "12–15 interceptors",
                  tokens: locale === "fr" ? "Budget maximal" : "Maximum budget",
                  color: "#ef4444",
                  bar: "90%",
                  icon: "🧠",
                },
              ].map((lv, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--kz-surface-2)",
                    border: "1px solid var(--kz-border-subtle)",
                    borderRadius: "var(--kz-radius-md)",
                    padding: "20px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    transition: "border-color 200ms ease",
                  }}
                >
                  {/* Level header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "22px", lineHeight: 1 }}>{lv.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display), system-ui, sans-serif",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "var(--kz-text-primary)",
                        }}
                      >
                        {lv.level}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--kz-text-muted)",
                          fontFamily: "var(--font-mono, monospace)",
                        }}
                      >
                        {lv.sub}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: "4px", background: "var(--kz-border-subtle)", borderRadius: "2px", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: lv.bar }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: lv.color,
                        borderRadius: "2px",
                        boxShadow: `0 0 6px ${lv.color}40`,
                      }}
                    />
                  </div>

                  {/* Metrics */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: lv.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", color: "var(--kz-text-secondary)" }}>{lv.interceptors}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: lv.color, flexShrink: 0, opacity: 0.5 }} />
                      <span style={{ fontSize: "11px", color: "var(--kz-text-muted)" }}>{lv.tokens}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── EXTENSIBILITY — Full-width visual mode builder ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mode-card"
            style={{
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              borderRadius: "var(--kz-radius-lg)",
              padding: "36px 32px",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
              }}
            />

            {/* Header Row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--kz-radius-md)",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Shield size={20} strokeWidth={1.5} style={{ color: "#10b981" }} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "var(--kz-status-success)",
                    background: "rgba(16, 185, 129, 0.08)",
                    padding: "2px 6px",
                    borderRadius: "var(--kz-radius-sm)",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  {locale === "fr" ? "EXTENSIBILITÉ ACTIVE" : "ACTIVE EXTENSIBILITY"}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.01em",
                    marginBottom: "6px",
                  }}
                >
                  {p.extensibilityTitle}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--kz-text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: "640px",
                  }}
                >
                  {p.extensibilityDesc}
                </p>
              </div>
            </div>

            {/* Visual Mode Builder */}
            <div
              style={{
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "var(--kz-radius-md)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Step 1: Available Interceptors */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "var(--kz-accent)",
                      color: "var(--kz-on-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 800,
                    }}
                  >
                    1
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--kz-text-primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {locale === "fr" ? "Choisissez vos intercepteurs" : "Choose your interceptors"}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[
                    { name: "RAG", active: true },
                    { name: locale === "fr" ? "Audit" : "Audit", active: true },
                    { name: "JSON Schema", active: true },
                    { name: locale === "fr" ? "Mémoire" : "Memory", active: false },
                    { name: locale === "fr" ? "Sécurité" : "Security", active: false },
                    { name: locale === "fr" ? "Métriques" : "Metrics", active: false },
                    { name: locale === "fr" ? "Routage" : "Routing", active: false },
                    { name: locale === "fr" ? "Cache" : "Cache", active: false },
                  ].map((chip, ci) => (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + ci * 0.04 }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "var(--font-mono, monospace)",
                        cursor: "default",
                        transition: "all 200ms ease",
                        ...(chip.active
                          ? {
                              background: "var(--kz-accent)",
                              color: "var(--kz-on-accent)",
                              border: "1px solid transparent",
                              boxShadow: "0 0 10px var(--kz-accent-soft)",
                            }
                          : {
                              background: "transparent",
                              color: "var(--kz-text-muted)",
                              border: "1px dashed var(--kz-border-strong)",
                            }),
                      }}
                    >
                      {chip.active && <Check size={10} strokeWidth={3} style={{ marginRight: "4px", verticalAlign: "middle" }} />}
                      {chip.name}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Arrow */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    color: "var(--kz-text-muted)",
                  }}
                >
                  <div style={{ width: "1px", height: "16px", background: "var(--kz-border-strong)" }} />
                  <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
                </div>
              </div>

              {/* Step 2: Resulting Custom Mode */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "var(--kz-status-success)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 800,
                    }}
                  >
                    2
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--kz-text-primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {locale === "fr" ? "Votre mode personnalisé" : "Your custom mode"}
                  </span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  style={{
                    background: "var(--kz-surface-1)",
                    border: "1.5px solid var(--kz-status-success)",
                    borderRadius: "var(--kz-radius-md)",
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.08)",
                  }}
                >
                  {/* Mode icon */}
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "var(--kz-radius-md)",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={22} strokeWidth={1.5} style={{ color: "var(--kz-status-success)" }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--kz-text-primary)",
                        marginBottom: "4px",
                      }}
                    >
                      AuditSentinelle
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {["RAG", "Audit", "JSON Schema"].map((tag, ti) => (
                        <span
                          key={ti}
                          style={{
                            fontSize: "9px",
                            fontFamily: "var(--font-mono, monospace)",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "var(--kz-status-success)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <div
                      className="card-led-blink"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--kz-status-success)",
                        boxShadow: "0 0 6px var(--kz-status-success)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-mono, monospace)",
                        fontWeight: 700,
                        color: "var(--kz-status-success)",
                        textTransform: "uppercase",
                      }}
                    >
                      {locale === "fr" ? "Actif" : "Active"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── SECTION: Comparison Table ─── */}
        <section style={{ marginBottom: "96px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
              fontWeight: 800,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "24px",
            }}
          >
            {p.diffTitle}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
            }}
            className="modes-grid"
          >
            {/* Cloud API Column */}
            <div
              style={{
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "var(--kz-radius-lg)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Red warning border at top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "var(--kz-status-error)",
                  opacity: 0.6
                }}
              />

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--kz-status-error)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "8px"
                  }}
                >
                  {p.diffLeftSub}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "19px",
                    fontWeight: 800,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.diffLeftTitle}
                </h3>
              </div>

              {/* Visual Flow diagram: Cloud API */}
              <div
                style={{
                  background: "var(--kz-surface-2)",
                  borderRadius: "var(--kz-radius-md)",
                  padding: "20px 16px",
                  border: "1px solid var(--kz-border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                {/* Horizontal connection line */}
                <div style={{ position: "absolute", left: "15%", right: "15%", height: "2px", background: "var(--kz-border-subtle)", zIndex: 0 }} />

                {[
                  { label: "Request", sub: "Raw prompt", icon: MessageSquare },
                  { label: "Public Cloud", sub: "External API", icon: Globe },
                  { label: "Raw Output", sub: "Unchecked text", icon: AlertTriangle }
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative", zIndex: 1, width: "30%", textAlign: "center" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--kz-surface-3)",
                          border: "1px solid var(--kz-border-strong)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: i === 2 ? "var(--kz-status-error)" : "var(--kz-text-muted)"
                        }}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--kz-text-secondary)" }}>{step.label}</span>
                      <span style={{ fontSize: "8px", color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)" }}>{step.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Features List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                {p.diffLeftFeatures.map((feat, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <X
                      size={16}
                      strokeWidth={2.5}
                      style={{
                        color: "var(--kz-status-error)",
                        marginTop: "3px",
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--kz-text-primary)" }}>{feat.title}</h4>
                      <p style={{ fontSize: "12px", color: "var(--kz-text-secondary)", lineHeight: 1.5, marginTop: "2px" }}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orazaka Column */}
            <div
              style={{
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "var(--kz-radius-lg)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px var(--kz-accent-soft)"
              }}
            >
              {/* Electric blue border at top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "var(--kz-accent)",
                }}
              />

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--kz-accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "8px"
                  }}
                >
                  {p.diffRightSub}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "19px",
                    fontWeight: 800,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.diffRightTitle}
                </h3>
              </div>

              {/* Visual Flow diagram: Orazaka Reasoning Engine */}
              <div
                style={{
                  background: "var(--kz-surface-2)",
                  borderRadius: "var(--kz-radius-md)",
                  padding: "20px 16px",
                  border: "1px solid var(--kz-border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                {/* Horizontal connection line */}
                <div style={{ position: "absolute", left: "15%", right: "15%", height: "2px", background: "linear-gradient(90deg, var(--kz-accent), var(--kz-status-success))", zIndex: 0 }} />

                {[
                  { label: locale === "fr" ? "Contexte" : "Context", sub: locale === "fr" ? "Mémoire & RAG" : "Memory & RAG", icon: Database, color: "var(--kz-accent)", shadow: "var(--kz-accent-soft)" },
                  { label: locale === "fr" ? "Réflexion" : "Reasoning", sub: locale === "fr" ? "Local LLM" : "Local LLM", icon: Brain, color: "#a78bfa", shadow: "rgba(167, 139, 250, 0.2)" },
                  { label: locale === "fr" ? "Validation" : "Compliance", sub: locale === "fr" ? "Audit JSON" : "JSON Audit", icon: Shield, color: "var(--kz-status-success)", shadow: "rgba(16, 185, 129, 0.2)" }
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative", zIndex: 1, width: "30%", textAlign: "center" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--kz-surface-3)",
                          border: `1.5px solid ${step.color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: step.color,
                          boxShadow: `0 0 10px ${step.shadow}`
                        }}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--kz-text-primary)" }}>{step.label}</span>
                      <span style={{ fontSize: "8px", color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)" }}>{step.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Features List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                {p.diffRightFeatures.map((feat, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <Check
                      size={16}
                      strokeWidth={2.8}
                      style={{
                        color: "var(--kz-status-success)",
                        marginTop: "2px",
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--kz-text-primary)" }}>{feat.title}</h4>
                      <p style={{ fontSize: "12px", color: "var(--kz-text-secondary)", lineHeight: 1.5, marginTop: "2px" }}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION: Elegant CTA targeting Packages ─── */}
        <section
          style={{
            textAlign: "center",
            padding: "56px 32px",
            borderRadius: "24px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)",
              fontWeight: 800,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}
          >
            {p.ctaTitle}
          </h2>
          <p
            style={{
              fontSize: "14.5px",
              color: "var(--kz-text-secondary)",
              marginBottom: "32px",
              maxWidth: "460px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            {p.ctaDesc}
          </p>
          <Link
            href="/products/orazaka/packages"
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
              transition: "background 150ms ease",
            }}
            className="cta-button"
          >
            {p.ctaButton}
            <ChevronRight size={15} strokeWidth={2.5} />
          </Link>
        </section>
      </div>

      <SiteFooter />

      {/* ─── Interactive styles for premium animations ─── */}
      <style>{`
        .back-btn:hover {
          color: var(--kz-text-primary) !important;
        }

        .family-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: var(--kz-shadow-md), 0 0 20px var(--kz-accent-soft) !important;
        }

        .registry-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: var(--kz-shadow-md), 0 0 14px var(--kz-accent-soft) !important;
        }

        .mode-card:hover {
          border-color: var(--kz-border-strong) !important;
          box-shadow: var(--kz-shadow-md) !important;
          transform: translateY(-2px);
        }

        .table-row:hover {
          background: var(--kz-surface-2) !important;
        }

        .cta-button:hover {
          background: var(--kz-accent-hover) !important;
        }

        /* LED blink animation */
        @keyframes card-led-glow {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        .card-led-blink {
          animation: card-led-glow 2s ease-in-out infinite;
        }

        /* Pipeline bridge and dot animations */
        .pipeline-bridge {
          position: relative;
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, var(--kz-border-subtle), var(--kz-accent), var(--kz-border-subtle));
          border-radius: 99px;
        }
        .pipeline-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--kz-accent);
          box-shadow: 0 0 8px var(--kz-accent);
          top: -3px;
          animation: slide-horizontal 2.5s infinite linear;
        }
        @keyframes slide-horizontal {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes slide-vertical {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @media (max-width: 768px) {
          .hero-section-centered {
            text-align: center;
            gap: 24px !important;
          }
          .flow-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .flow-arrow {
            transform: none !important;
            padding: 16px 0 !important;
          }
          .pipeline-bridge {
            width: 2px !important;
            height: 60px !important;
            background: linear-gradient(180deg, var(--kz-border-subtle), var(--kz-accent), var(--kz-border-subtle)) !important;
            margin: 8px auto !important;
          }
          .pipeline-dot {
            left: -3px !important;
            top: 0% !important;
            animation: slide-vertical 2.5s infinite linear !important;
          }
          .modes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
