"use client";

import React, { useState } from "react";
import {
  Flame,
  ShieldCheck,
  Video,
  Wallet,
  ExternalLink,
  Play,
  HardDrive,
  Sparkles,
  Terminal
} from "lucide-react";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { useI18n } from "@/app/components/I18nProvider";
import orochiaArch from "@/app/data/orochia-architecture.json";

export default function OrochiaPageClient() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  const [activeMedia, setActiveMedia] = useState<string>("demo");

  const mediaShowcase = [
    {
      id: "demo",
      title: isFr ? "Démonstration Vidéo Interactive" : "Interactive Live Video Walkthrough",
      src: "/assets/orochia/demo-preview.webp",
      type: "video-anim",
      badge: isFr ? "Animation En Direct" : "Live Video WebP",
      desc: isFr
        ? "Survol complet de la plateforme consommateur, du coffre-fort de conformité 2257 et du design system."
        : "End-to-end traversal across consumer web, compliance vault, and design system showcase.",
    },
    {
      id: "hero",
      title: isFr ? "Sanctuary Streaming 4K & Lecteur HLS" : "Sanctuary 4K Streaming & HLS Player",
      src: "/assets/orochia/hero.png",
      type: "image",
      badge: "Consumer Web :3000",
      desc: isFr
        ? "Expérience cinématographique fluide avec jetons HMAC anti-hotlinking et lecteur HLS adaptatif."
        : "Cinematic fluid streaming experience with signed HMAC tokens and adaptive 4K HLS ladders.",
    },
    {
      id: "streams",
      title: isFr ? "Catalogue de Séries & Collections Bunny" : "Series Catalog & Bunny Collections",
      src: "/assets/orochia/streams.png",
      type: "image",
      badge: "Media Ingest",
      desc: isFr
        ? "Collections thématiques, séries à accès restreint et déverrouillage à la demande (Pay-Per-View)."
        : "Thematic collections, member-only series, and instant pay-per-view video unlocks.",
    },
    {
      id: "dashboard",
      title: isFr ? "Studio Créateur & Moteur d'Upload Double-Mode" : "Creator Studio & Dual-Mode Upload Engine",
      src: "/assets/orochia/dashboard.png",
      type: "image",
      badge: "DevX & Storage",
      desc: isFr
        ? "Bascule fluide entre stockage local rapide (public/uploads) en dev et Bunny Edge Tus en staging/prod."
        : "Seamless switch between zero-latency local folder storage in dev and Bunny Edge Tus in staging/prod.",
    },
    {
      id: "admin",
      title: isFr ? "Console d'Administration & Trésorerie" : "Admin Control Plane & Treasury Desk",
      src: "/assets/orochia/admin-overview.png",
      type: "image",
      badge: "Control Plane :3001",
      desc: isFr
        ? "Pilotage global de la plateforme, suivi en temps réel du GMV et prélèvement automatique de la commission (10%)."
        : "Executive control plane, real-time GMV tracking, and automated 10% protocol rake settlement.",
    },
    {
      id: "compliance",
      title: isFr ? "Coffre-Fort Fédéral 18 U.S.C. § 2257" : "18 U.S.C. § 2257 Performer Compliance Vault",
      src: "/assets/orochia/compliance-vault.png",
      type: "image",
      badge: "Legal Compliance",
      desc: isFr
        ? "Archivage sécurisé des pièces d'identité, contrôle d'âge strict et export certifié pour audit fédéral."
        : "Secure primary producer ID archival, strict age verification, and one-click federal audit export.",
    },
    {
      id: "treasury",
      title: isFr ? "Monétisation Administrateur & Retraits Multi-Rails" : "Platform Monetization & Multi-Rail Payouts",
      src: "/assets/orochia/treasury-desk.png",
      type: "image",
      badge: "Treasury Desk",
      desc: isFr
        ? "4 flux de revenus pour la plateforme (commission 10%, frais d'audit 49$, enchères $25/j, retraits express 1.5%)."
        : "4-tier platform revenue architecture (10% rake, $49 audit fee, $25/day auctions, 1.5% express fee).",
    },
    {
      id: "cdn",
      title: isFr ? "Télémétrie CDN Bunny & 114 PoPs Anycast" : "Bunny CDN Telemetry & 114 Anycast PoPs",
      src: "/assets/orochia/bunny-cdn.png",
      type: "image",
      badge: "Infrastructure",
      desc: isFr
        ? "Latences en direct sur 114 PoPs, taux de cache mondial de 98.6% et purge d'urgence en moins de 250ms."
        : "Live Anycast PoP latencies, 98.6% global cache hit ratio, and emergency CDN cache invalidation.",
    },
    {
      id: "design-system",
      title: isFr ? "Design System Obsidian Velvet Noir" : "Obsidian Velvet Noir Design System",
      src: "/assets/orochia/design-system.png",
      type: "image",
      badge: "Design Tokens :3002",
      desc: isFr
        ? "Composants d'interface haute conversion, tokens de couleur sombres et catalogue interactif partagé."
        : "High-conversion UI components, dark obsidian tokens, and shared interactive component catalog.",
    },
  ];

  const currentMedia = mediaShowcase.find((m) => m.id === activeMedia) || mediaShowcase[0];

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "var(--kz-surface-0)",
        color: "var(--kz-text-primary)",
      }}
    >
      <TopNavBar />

      {/* Hero Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1100px, 95vw)",
          height: "460px",
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--kz-accent) 22%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ height: "40px", zIndex: 1 }} />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--kz-radius-full)",
              background: "var(--kz-accent-soft)",
              border: "1px solid color-mix(in srgb, var(--kz-accent) 30%, transparent)",
              fontSize: "12px",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              color: "var(--kz-accent)",
              letterSpacing: "0.04em",
            }}
          >
            <Flame size={14} />
            <span>
              {isFr
                ? "PRODUIT PHARE KRIZAKA • DIFFUSION VIDÉO SOUVERAINE & COMMUNAUTÉ CRÉATEUR"
                : "KRIZAKA FLAGSHIP • SOVEREIGN VIDEO STREAMING & CREATOR PLATFORM"}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black tracking-tight"
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              lineHeight: 1.15,
            }}
          >
            Orochia —{" "}
            <span
              style={{
                background: "var(--kz-sheen)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {isFr
                ? "Plateforme Streaming 4K & Économie Créateur Open-Source"
                : "Adult-Friendly Open-Source 4K Streaming & Creator Platform"}
            </span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--kz-text-secondary)" }}
          >
            {isFr
              ? "Ingénierie de pointe par Krizaka pour éliminer les risques de censure et de déplateformisation : diffusion Anycast 4K HLS directe sur Bunny.net, coffre-fort de conformité 18 U.S.C. § 2257, stockage DevX double-mode et monétisation administrateur 4 niveaux."
              : "Enterprise-grade architecture engineered by Krizaka: direct Bunny.net Anycast 4K edge streaming, 18 U.S.C. § 2257 performer compliance vault, dual-mode DevX storage engine, and 4-tier platform administrator monetization."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-accent)",
                color: "var(--kz-on-accent)",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                boxShadow: "0 4px 14px var(--kz-accent-soft)",
                transition: "all var(--kz-transition-fast)",
              }}
            >
              <Play size={14} fill="currentColor" />
              <span>{isFr ? "Lancer Orochia Web (:3000)" : "Launch Orochia Web (:3000)"}</span>
              <ExternalLink size={12} />
            </a>

            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-strong)",
                color: "var(--kz-text-primary)",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                transition: "all var(--kz-transition-fast)",
              }}
            >
              <ShieldCheck size={14} />
              <span>{isFr ? "Control Plane 2257 (:3001)" : "Admin Control Plane (:3001)"}</span>
              <ExternalLink size={12} />
            </a>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                color: "var(--kz-text-secondary)",
                fontWeight: 600,
                fontSize: "13px",
                textDecoration: "none",
                transition: "all var(--kz-transition-fast)",
              }}
            >
              <Sparkles size={14} />
              <span>{isFr ? "Design System (:3002)" : "Design System (:3002)"}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MEDIA & SCREENSHOT SHOWCASE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div
          style={{
            borderRadius: "var(--kz-radius-xl)",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-default)",
            padding: "24px",
            boxShadow: "var(--kz-shadow-lg)",
          }}
        >
          {/* Header of showcase */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--kz-border-subtle)]">
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--kz-accent)",
                }}
              >
                {currentMedia.badge}
              </span>
              <h2
                className="text-xl font-bold mt-0.5"
                style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
              >
                {currentMedia.title}
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--kz-text-secondary)" }}>
                {currentMedia.desc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--kz-status-success)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--kz-radius-full)",
                  background: "color-mix(in srgb, var(--kz-status-success) 12%, transparent)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "currentColor",
                  }}
                />
                <span>Live Telemetry Verified</span>
              </span>
            </div>
          </div>

          {/* Media Viewer Frame */}
          <div
            className="my-6 relative overflow-hidden rounded-2xl aspect-video w-full"
            style={{
              background: "var(--kz-surface-0)",
              border: "1px solid var(--kz-border-strong)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentMedia.src}
              alt={currentMedia.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* Media Thumbnails Selector Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {mediaShowcase.map((media) => {
              const isActive = media.id === activeMedia;
              return (
                <button
                  key={media.id}
                  onClick={() => setActiveMedia(media.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "8px 6px",
                    borderRadius: "var(--kz-radius-sm)",
                    background: isActive ? "var(--kz-surface-2)" : "transparent",
                    border: isActive
                      ? "1px solid var(--kz-accent)"
                      : "1px solid var(--kz-border-subtle)",
                    cursor: "pointer",
                    transition: "all var(--kz-transition-fast)",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "var(--font-mono, monospace)",
                      fontWeight: 700,
                      color: isActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {media.id}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: isActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)",
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {media.title.split(":")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 ARCHITECTURAL PILLARS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--kz-accent)",
              letterSpacing: "0.08em",
            }}
          >
            {isFr ? "LES 5 PILIERS ARCHITECTURAUX" : "5 ARCHITECTURAL PILLARS"}
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
          >
            {isFr
              ? "Conçu pour la Haute Performance & l'Immunité Juridique"
              : "Engineered for High-Throughput & Legal Immunity"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div
            style={{
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-accent-soft)",
                color: "var(--kz-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Video size={20} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {isFr ? "1. Streaming 4K HLS Bunny.net Anycast" : "1. Bunny.net 4K HLS Anycast Stream"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {isFr
                ? "Téléversement direct par morceaux sans saturer la RAM du serveur. Encodage matériel adaptatif (AV1, VP9, H.264), jetons HMAC anti-hotlinking et distribution sur 114 PoPs mondiaux avec 98.6% de cache hit."
                : "Chunked direct client-to-edge upload eliminating server RAM proxy bottlenecks. Hardware adaptive ladders (AV1, VP9, H.264), HMAC tokens, and 114 PoPs with 98.6% cache hit."}
            </p>
          </div>

          {/* Pillar 2 */}
          <div
            style={{
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--kz-radius-md)",
                background: "color-mix(in srgb, var(--kz-status-warning) 15%, transparent)",
                color: "var(--kz-status-warning)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {isFr ? "2. Coffre de Conformité Fédérale 2257" : "2. 18 U.S.C. § 2257 Compliance Vault"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {isFr
                ? "Gestion rigoureuse des dossiers de producteurs primaires : pièces d'identité officielles, adresses de dépôt physique, attestations d'âge sous peine de parjure et export certifié d'audit pour le Département de la Justice américain."
                : "Comprehensive primary producer records: government IDs, certified physical custodian addresses, age perjury verification, and DOJ-ready federal audit dossier exports."}
            </p>
          </div>

          {/* Pillar 3 */}
          <div
            style={{
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--kz-radius-md)",
                background: "color-mix(in srgb, var(--kz-status-success) 15%, transparent)",
                color: "var(--kz-status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HardDrive size={20} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {isFr ? "3. Moteur de Stockage DevX Double-Mode" : "3. DevX Dual-Mode Storage Engine"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {isFr
                ? "Expérience de développement locale ultra-fluide avec sauvegarde directe dans le dossier local (public/uploads), basculant automatiquement vers Bunny Edge Storage en staging/prod sans changer une ligne de code."
                : "Ultra-fast local dev workflow saving directly to folder structure (`public/uploads`), automatically switching to Bunny Edge Storage in staging/production without changing code."}
            </p>
          </div>

          {/* Pillar 4 */}
          <div
            style={{
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--kz-radius-md)",
                background: "color-mix(in srgb, var(--kz-accent) 15%, transparent)",
                color: "var(--kz-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wallet size={20} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {isFr ? "4. Trésorerie Administrateur 4 Niveaux" : "4. 4-Tier Admin Monetization Rake"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {isFr
                ? "Commission de protocole de 10% sur chaque pourboire et vidéo payante, 49$ de frais d'audit KYC, enchères Sanctuary Spotlight ($25/j) et 1.5% de frais de retrait instantané (USDC/SEPA)."
                : "10% protocol rake on tips & paywalls, $49 federal KYC onboarding fees, Sanctuary Spotlight auctions ($25/day), and 1.5% fast-lane instant payout rails."}
            </p>
          </div>

          {/* Pillar 5 */}
          <div
            style={{
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--kz-radius-md)",
                background: "color-mix(in srgb, #ec4899 15%, transparent)",
                color: "#ec4899",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {isFr ? "5. Design System Obsidian Velvet Noir" : "5. Obsidian Velvet Noir Design System"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {isFr
                ? "Identité visuelle de luxe cyber-sensuelle partagée : surfaces obsidiennes profondes, micro-animations réactives, modales de majorité et composants de pourboire haute conversion."
                : "Cyber-sensual luxury visual identity: deep obsidian surfaces, reactive micro-animations, legal age gate modals, and high-conversion tip tokens."}
            </p>
          </div>

          {/* Pillar 6 - Code-Driven Sync */}
          <div
            style={{
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-subtle)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--kz-radius-md)",
                background: "color-mix(in srgb, var(--kz-accent) 15%, transparent)",
                color: "var(--kz-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Terminal size={20} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {isFr ? "6. Synchronisation de Doc par le Code" : "6. Code-Driven Doc Generation"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
              {isFr
                ? "Documentation et topologie d'architecture générées directement depuis l'arbre de code (`scripts/generate-docs.mjs`) sans rédaction manuelle, garantissant une fidélité absolue en production."
                : "Architecture topology and contracts generated programmatically from AST / source trees (`scripts/generate-docs.mjs`) ensuring zero documentation drift."}
            </p>
          </div>
        </div>
      </section>

      {/* REPOSITORY TOPOLOGY CARD — CODE GENERATED */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div
          style={{
            borderRadius: "var(--kz-radius-xl)",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-strong)",
            padding: "28px",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--kz-border-subtle)] pb-5">
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 700,
                  color: "var(--kz-accent)",
                  textTransform: "uppercase",
                }}
              >
                {isFr ? "ÉCOSYSTÈME MULTI-DÉPÔTS" : "MULTI-REPO ECOSYSTEM TOPOLOGY"}
              </span>
              <h2
                className="text-xl font-bold mt-0.5"
                style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
              >
                {orochiaArch.title}
              </h2>
              <p className="text-xs text-[var(--kz-text-secondary)] mt-0.5">
                {orochiaArch.source} • {orochiaArch.generatedAt}
              </p>
            </div>

            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-2)",
                color: "var(--kz-text-muted)",
              }}
            >
              3 Repositories Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {orochiaArch.repositories.map((repo) => (
              <div
                key={repo.name}
                style={{
                  borderRadius: "var(--kz-radius-lg)",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "between",
                  gap: "12px",
                }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--kz-accent)",
                      }}
                    >
                      {repo.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "var(--kz-radius-sm)",
                        background: "var(--kz-surface-0)",
                        color: "var(--kz-text-secondary)",
                      }}
                    >
                      Port {repo.port}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--kz-text-primary)",
                      marginTop: "4px",
                    }}
                  >
                    {repo.role}
                  </h4>
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "var(--kz-text-secondary)",
                      marginTop: "6px",
                      lineHeight: 1.5,
                    }}
                  >
                    {repo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--kz-border-subtle)] flex items-center justify-between">
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-mono, monospace)",
                      color: "var(--kz-text-muted)",
                    }}
                  >
                    {repo.stack[0]}
                  </span>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--kz-text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    <span>GitHub</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
