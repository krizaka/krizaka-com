"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Cpu,
  Play,
  Check,
  Boxes,
} from "lucide-react";
import { useI18n } from "../../../../components/I18nProvider";
import { PACKAGES } from "@/lib/packages-data";
import KrizakaComplianceIllustration from "../../../../components/illustrations/KrizakaComplianceIllustration";
import KrizakaDemosIllustration from "../../../../components/illustrations/KrizakaDemosIllustration";

/* ─── Tech stack items ─── */
const STACK = [
  { label: "Java", version: "21", color: "hsl(25, 95%, 53%)" },
  { label: "Spring Boot", version: "3.5", color: "hsl(140, 60%, 48%)" },
  { label: "Spring AI", version: "1.1.6", color: "hsl(140, 60%, 48%)" },
  { label: "Next.js", version: "16", color: "hsl(0, 0%, 80%)" },
  { label: "Expo SDK", version: "53", color: "hsl(250, 60%, 60%)" },
  { label: "macOS", version: "Apple Silicon", color: "hsl(0, 0%, 65%)" },
];

/* ─── Module cards ─── */
const MODULES = [
  {
    id: "core",
    name: { fr: "Moteur de Cognition", en: "Cognitive Engine" },
    desc: { fr: "Pipeline d'orchestration avec 15 intercepteurs", en: "Orchestration pipeline with 15 interceptors" },
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
    href: "/products/orazaka/architecture/core",
  },
  {
    id: "identity",
    name: { fr: "Identité & Sécurité", en: "Identity & Security" },
    desc: { fr: "OAuth2, RBAC, BCrypt local — zéro tiers", en: "Local OAuth2, RBAC, BCrypt — zero dependencies" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    href: "/products/orazaka/core-features/auth",
  },
  {
    id: "gateway",
    name: { fr: "BFF Gateway", en: "BFF Gateway" },
    desc: { fr: "GraphQL, REST, SSE — frontière des hexagones", en: "GraphQL, REST, SSE — hexagons boundary" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    href: "/products/orazaka/architecture/architecture",
  },
  {
    id: "tools",
    name: { fr: "Registre d'Outils", en: "Tool Registry" },
    desc: { fr: "Clients MCP, cache Caffeine, adaptateurs API", en: "MCP clients, Caffeine cache, API adapters" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    href: "/products/orazaka/core-features/automation",
  },
  {
    id: "cli",
    name: { fr: "Developer CLI", en: "Developer CLI" },
    desc: { fr: "Wizard de configuration, diagnostics locaux", en: "Setup wizard, local diagnostics" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    href: "/products/orazaka/api/cli",
  },
  {
    id: "ui",
    name: { fr: "Cinematic UI", en: "Cinematic UI" },
    desc: { fr: "Client Next.js + App Mobile Expo", en: "Next.js client + Expo mobile app" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    href: "/products/orazaka/ui-guidelines/ui_reference",
  },
];

/* ─── Copy constants ─── */
const COPY = {
  fr: {
    heroLead: "Créez des applications d'IA souveraines en production — Chat · Image · Vidéo · Voix · RAG · MCP — hébergées à 100 % chez vous.",
    quickstart: "Démarrage rapide",
    quickstartSteps: [
      { step: "01", title: "Configurer", cmd: "npx orazaka install", desc: "Interactive wizard — détecte le matériel, configure la topologie locale" },
      { step: "02", title: "Lancer les conteneurs", cmd: "npx orazaka start", desc: "Postgres, Redis, RabbitMQ, Ollama — conteneurs hermétiques" },
      { step: "03", title: "Développement", cmd: "npx orazaka dev", desc: "Lance BFF Gateway, clients web/mobiles et moteurs IA en parallèle" },
    ],
    architecture: "Modules d'Architecture",
    documentation: "Documentation",
    principles: "Principes de Design",
    principlesItems: [
      { title: "Zéro Dépendance Cloud", desc: "Toutes les requêtes d'inférence, recherche sémantique et exécution de code tournent en local.", icon: ShieldCheck },
      { title: "Gouvernance par Compilation", desc: "Des garde-fous ArchUnit garantissent le respect strict des frontières hexagonales.", icon: Cpu },
      { title: "Commande Unique", desc: "Un script orchestrateur léger gère les topologies locales sans complexité Kubernetes.", icon: Layers },
    ],
    solutionsEyebrow: "SOUVERAINETÉ & COMPLIANCE",
    solutionsTitle: "L'IA locale résout le fardeau de la Loi 25",
    solutionsDesc: "L'envoi de renseignements personnels (PII) vers des API cloud tierces déclenche de lourdes contraintes juridiques. Exécuté on-premise, Orazaka élimine ces risques réglementaires à la source.",
    riskTitle: "Le risque cloud",
    shieldTitle: "Le bouclier Orazaka",
    risks: [
      "Amendes de la CAI jusqu'à 25 M$ CAD.",
      "Évaluations des facteurs de vie privée (EFVP) obligatoires.",
    ],
    shields: [
      "Exécution 100% locale : modèles et données restent chez vous.",
      "Pas de transit hors-Québec : dispense de la Loi 25.",
      "Logs d'audit locaux pour prouver la conformité.",
    ],
    packagesEyebrow: "PACKAGES DE DOMAINE",
    packagesTitle: "Topologies prêtes à configurer",
    packagesDesc: "Chaque package assemble et configure des intercepteurs Orazaka pour répondre à un cas d'usage précis.",
    packagesCta: "Voir la démo",
    visualizeEyebrow: "VISUALISATION & INTERACTION",
    visualizeTitle: "Explorez le moteur en action",
    visualizeDesc: "Visualisez et pilotez le moteur Orazaka à travers nos outils de diagnostic en temps réel.",
    demoCard: "Démos Interactives",
    demoCardDesc: "Simulez l'intercepteur de flux, testez les prompts et inspectez les logs d'exécution.",
    demoCardCta: "Lancer les démos",
    archCard: "Architecture 3D",
    archCardDesc: "Explorez le graphe hexagonal 3D de dépendances et le flux de messages en temps réel.",
    archCardCta: "Explorer en 3D",
  },
  en: {
    heroLead: "Ship production-grade, sovereign AI applications — Chat · Image · Video · Voice · RAG · MCP — hosted 100% on your own infrastructure.",
    quickstart: "Quick Start",
    quickstartSteps: [
      { step: "01", title: "Configure", cmd: "npx orazaka install", desc: "Interactive wizard — detects local hardware and sets up private configs" },
      { step: "02", title: "Start containers", cmd: "npx orazaka start", desc: "Postgres, Redis, RabbitMQ, Ollama — all running in hermetic containers" },
      { step: "03", title: "Start development", cmd: "npx orazaka dev", desc: "Launches the BFF gateway, web/mobile clients, and AI engines in parallel" },
    ],
    architecture: "Architecture Modules",
    documentation: "Documentation",
    principles: "Design Principles",
    principlesItems: [
      { title: "Zero Cloud Dependencies", desc: "All model inference, vector queries, and sandbox code execution run on-premise.", icon: ShieldCheck },
      { title: "Compile-Time Governance", desc: "ArchUnit tests strictly enforce hexagonal boundaries, preventing structural leakage.", icon: Cpu },
      { title: "Single Command Setup", desc: "A clean orchestrator CLI handles the local infrastructure stack without Kubernetes overhead.", icon: Layers },
    ],
    solutionsEyebrow: "SOVEREIGNTY & COMPLIANCE",
    solutionsTitle: "On-Premises AI Lifts the Law 25 Burden",
    solutionsDesc: "Sending personal data (PII) to third-party clouds triggers heavy legal constraints. By running on-premise, Orazaka removes these compliance risks at the source.",
    riskTitle: "The cloud risk",
    shieldTitle: "Orazaka's shield",
    risks: [
      "Penalties up to $25M CAD.",
      "Mandatory Privacy Impact Assessments (PIA).",
    ],
    shields: [
      "100% local: models and vectors run on your bare metal.",
      "No out-of-province transit: satisfies Law 25 instantly.",
      "Signed local audit logs for continuous compliance.",
    ],
    packagesEyebrow: "DOMAIN PACKAGES",
    packagesTitle: "Ready-to-Configure Topologies",
    packagesDesc: "Each package bundles and configures a subset of Orazaka's 15 interceptors to answer a specific industry case.",
    packagesCta: "View Use Case",
    visualizeEyebrow: "VISUALIZATION & DIAGNOSTICS",
    visualizeTitle: "Explore the Engine in Real-Time",
    visualizeDesc: "Visualize and control the Orazaka engine through our real-time diagnostics.",
    demoCard: "Interactive Demos",
    demoCardDesc: "Simulate the runtime interceptor flow, run prompt tests, and watch console traces.",
    demoCardCta: "Launch Demos",
    archCard: "3D Architecture",
    archCardDesc: "Rotate the interactive 3D hexagonal graph of classes and monitor messages flow.",
    archCardCta: "Explore in 3D",
  },
} as const;

export default function OrazakaOverview() {
  const { locale } = useI18n();
  const c = COPY[locale];

  const DOCS = [
    { title: "Developer Onboarding (101)", href: "/products/orazaka/getting-started/101", category: locale === "fr" ? "Démarrer" : "Start" },
    { title: "Architecture Reference", href: "/products/orazaka/architecture/architecture", category: locale === "fr" ? "Cœur" : "Core" },
    { title: "API Reference", href: "/products/orazaka/api/api_reference", category: locale === "fr" ? "Cœur" : "Core" },
    { title: "Auth & Security", href: "/products/orazaka/core-features/auth", category: locale === "fr" ? "Cœur" : "Core" },
    { title: "Model Catalog", href: "/products/orazaka/architecture/models", category: locale === "fr" ? "Cœur" : "Core" },
    { title: "CLI Reference", href: "/products/orazaka/api/cli", category: locale === "fr" ? "Ops" : "Ops" },
    { title: "Deployment (IaC)", href: "/products/orazaka/operations/deploy", category: locale === "fr" ? "Ops" : "Ops" },
    { title: "Feature Matrix", href: "/products/orazaka/core-features/master_features", category: locale === "fr" ? "Ops" : "Ops" },
  ];

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", paddingBottom: "64px" }}>
      {/* ═══ HERO ═══ */}
      <section
        className="overview-hero"
        style={{
          textAlign: "center",
          padding: "48px 0 40px",
        }}
      >
        {/* Orazaka mark */}
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
          Orazaka
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
          {c.heroLead}
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

      <hr style={{ border: "none", height: 1, background: "var(--kz-border-subtle)", margin: "0 0 40px" }} />

      {/* ═══ SECTION: COMPLIANCE & LAW 25 ═══ */}
      <section style={{ marginBottom: 40 }} id="solutions">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px",
            alignItems: "center",
          }}
          className="grid-2col"
        >
          {/* Left Column: Description & Illustration */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--kz-accent)",
                }}
              >
                {c.solutionsEyebrow}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--kz-text-primary)",
                  marginTop: 6,
                  marginBottom: 12,
                }}
              >
                {c.solutionsTitle}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--kz-text-secondary)",
                  margin: 0,
                }}
              >
                {c.solutionsDesc}
              </p>
            </div>
            <KrizakaComplianceIllustration />
          </div>

          {/* Right Column: Risk & Shield stacked vertically */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Risk Card */}
            <div
              style={{
                padding: "20px",
                borderRadius: "var(--kz-radius-lg)",
                background: "color-mix(in srgb, var(--kz-status-error) 4%, var(--kz-surface-1))",
                border: "1px solid color-mix(in srgb, var(--kz-status-error) 18%, var(--kz-border-subtle))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "color-mix(in srgb, var(--kz-status-error) 12%, transparent)",
                    color: "var(--kz-status-error)",
                  }}
                >
                  <ShieldAlert size={16} />
                </span>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--kz-text-primary)" }}>
                  {c.riskTitle}
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.risks.map((item, idx) => (
                  <li key={idx} style={{ display: "flex", gap: 8, fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.45 }}>
                    <span style={{ color: "var(--kz-status-error)", fontWeight: 700 }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shield Card */}
            <div
              style={{
                padding: "20px",
                borderRadius: "var(--kz-radius-lg)",
                background: "color-mix(in srgb, var(--kz-status-success) 4%, var(--kz-surface-1))",
                border: "1px solid color-mix(in srgb, var(--kz-status-success) 18%, var(--kz-border-subtle))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "color-mix(in srgb, var(--kz-status-success) 12%, transparent)",
                    color: "var(--kz-status-success)",
                  }}
                >
                  <ShieldCheck size={16} />
                </span>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--kz-text-primary)" }}>
                  {c.shieldTitle}
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.shields.map((item, idx) => (
                  <li key={idx} style={{ display: "flex", gap: 8, fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.45 }}>
                    <Check size={14} style={{ color: "var(--kz-status-success)", flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border: "none", height: 1, background: "var(--kz-border-subtle)", margin: "40px 0" }} />

      {/* ═══ SECTION: DOMAIN PACKAGES ═══ */}
      <section style={{ marginBottom: 40 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--kz-accent)",
          }}
        >
          {c.packagesEyebrow}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--kz-text-primary)",
            marginTop: 6,
            marginBottom: 12,
          }}
        >
          {c.packagesTitle}
        </h2>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--kz-text-secondary)",
            marginBottom: 20,
          }}
        >
          {c.packagesDesc}
        </p>

        {/* Packages Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
          className="grid-2col"
        >
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                borderRadius: "var(--kz-radius-lg)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--kz-accent-soft)",
                    color: "var(--kz-accent)",
                  }}
                >
                  <Boxes size={16} />
                </span>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--kz-text-primary)" }}>
                  {pkg.name[locale]}
                </h3>
              </div>
              <p
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.5,
                  color: "var(--kz-text-secondary)",
                  marginBottom: 16,
                  flex: 1,
                }}
              >
                {pkg.problem[locale]}
              </p>
              {/* Interceptors tag flow */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                {pkg.interceptors.map((it) => (
                  <span
                    key={it.name}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "8.5px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "var(--kz-surface-2)",
                      border: "1px solid var(--kz-border-subtle)",
                      color: "var(--kz-text-secondary)",
                    }}
                  >
                    {it.name}
                  </span>
                ))}
              </div>
              <Link
                href={`/products/orazaka/usecases/${pkg.useCaseSlug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "12.5px",
                  fontWeight: 650,
                  color: "var(--kz-accent)",
                  textDecoration: "none",
                  marginTop: "auto",
                }}
              >
                {c.packagesCta} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* ═══ SECTION: VISUALIZATION & DIAGNOSTICS ═══ */}
      <section style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px",
            alignItems: "center",
          }}
          className="grid-2col"
        >
          {/* Left Column: Description & Illustration */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--kz-accent)",
                }}
              >
                {c.visualizeEyebrow}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--kz-text-primary)",
                  marginTop: 6,
                  marginBottom: 12,
                }}
              >
                {c.visualizeTitle}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--kz-text-secondary)",
                  margin: 0,
                }}
              >
                {c.visualizeDesc}
              </p>
            </div>
            <KrizakaDemosIllustration />
          </div>

          {/* Right Column: Demos and 3D stacked vertically */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Demos Callout */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--kz-radius-lg)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Play size={16} style={{ color: "var(--kz-accent)" }} />
                {c.demoCard}
              </h3>
              <p
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.55,
                  color: "var(--kz-text-secondary)",
                  marginBottom: "20px",
                }}
              >
                {c.demoCardDesc}
              </p>
              <Link
                href="/products/orazaka/demos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: "9999px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  background: "var(--kz-accent)",
                  color: "var(--kz-on-accent)",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "background 150ms ease",
                }}
              >
                {c.demoCardCta} <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>

            {/* 3D Architecture Callout */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--kz-radius-lg)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Cpu size={16} style={{ color: "var(--kz-accent)" }} />
                {c.archCard}
              </h3>
              <p
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.55,
                  color: "var(--kz-text-secondary)",
                  marginBottom: "20px",
                }}
              >
                {c.archCardDesc}
              </p>
              <Link
                href="/products/orazaka/architecture"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: "9999px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  background: "var(--kz-surface-2)",
                  color: "var(--kz-text-primary)",
                  border: "1px solid var(--kz-border-subtle)",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
              >
                {c.archCardCta} <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border: "none", height: 1, background: "var(--kz-border-subtle)", margin: "40px 0" }} />

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
          {c.quickstart}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {c.quickstartSteps.map((s) => (
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
          {c.architecture}
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
                  {m.name[locale]}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--kz-text-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  {m.desc[locale]}
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
          {c.documentation}
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
          {c.principles}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {c.principlesItems.map((p) => {
            const PIcon = p.icon;
            return (
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
                  <PIcon size={18} strokeWidth={1.5} />
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
            );
          })}
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
