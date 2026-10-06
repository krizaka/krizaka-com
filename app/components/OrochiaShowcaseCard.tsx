"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Video, ShieldCheck, Wallet } from "lucide-react";
import { useI18n } from "./I18nProvider";

export function OrochiaShowcaseCard() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="showcase-card"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "36px",
        alignItems: "center",
        padding: "32px 40px",
        borderRadius: "20px",
        border: "1px solid var(--kz-border-subtle)",
        background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
        backdropFilter: "blur(20px)",
        transition: "border-color 300ms ease, box-shadow 300ms ease",
        marginBottom: "32px",
      }}
    >
      {/* Mascot / Icon column */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "var(--kz-surface-2)",
            border: "1.5px solid color-mix(in srgb, var(--kz-accent) 60%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px color-mix(in srgb, var(--kz-accent) 20%, transparent)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, var(--kz-accent), #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 16px color-mix(in srgb, var(--kz-accent) 40%, transparent)",
            }}
          >
            <Flame size={32} fill="#ffffff" />
          </div>
        </motion.div>
      </div>

      {/* Content column */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ color: "var(--kz-accent)", display: "flex" }}>
            <Video size={16} strokeWidth={2} />
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--kz-text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {isFr ? "PRODUIT PHARE • STREAMING SOUVERAIN" : "FLAGSHIP PRODUCT • SOVEREIGN STREAMING"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "9px",
              padding: "2px 8px",
              borderRadius: "var(--kz-radius-full)",
              background: "color-mix(in srgb, var(--kz-status-success) 15%, transparent)",
              color: "var(--kz-status-success)",
              fontWeight: 700,
            }}
          >
            v1.0 Ready
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--kz-text-primary)",
            marginBottom: "10px",
            letterSpacing: "-0.01em",
          }}
        >
          {isFr
            ? "Orochia — Streaming Vidéo 4K & Communauté Créateur"
            : "Orochia — Sovereign 4K Video Streaming & Creator Platform"}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "var(--kz-text-secondary)",
            lineHeight: 1.6,
            marginBottom: "18px",
            maxWidth: "560px",
          }}
        >
          {isFr
            ? "Moteur de diffusion HLS adaptatif 4K sans censure branché sur Bunny.net Anycast, coffre-fort de conformité 18 U.S.C. § 2257, stockage double-mode et 4 flux de monétisation administrateur."
            : "Open-source adult-friendly 4K HLS streaming platform powered by Bunny.net Anycast, 18 U.S.C. § 2257 compliance vault, dual-mode DevX storage, and 4-tier admin monetization."}
        </p>

        {/* Feature badges pill */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              padding: "3px 10px",
              borderRadius: "var(--kz-radius-sm)",
              background: "var(--kz-surface-2)",
              color: "var(--kz-text-secondary)",
              border: "1px solid var(--kz-border-subtle)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Video size={11} />
            <span>Bunny Anycast 4K HLS</span>
          </span>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              padding: "3px 10px",
              borderRadius: "var(--kz-radius-sm)",
              background: "var(--kz-surface-2)",
              color: "var(--kz-text-secondary)",
              border: "1px solid var(--kz-border-subtle)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldCheck size={11} />
            <span>18 U.S.C. § 2257 Vault</span>
          </span>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              padding: "3px 10px",
              borderRadius: "var(--kz-radius-sm)",
              background: "var(--kz-surface-2)",
              color: "var(--kz-text-secondary)",
              border: "1px solid var(--kz-border-subtle)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Wallet size={11} />
            <span>10% Protocol Rake</span>
          </span>
        </div>

        {/* CTA */}
        <motion.div initial="initial" whileHover="hover" style={{ display: "inline-block" }}>
          <Link
            href="/products/orochia"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              position: "relative",
              padding: "6px 0",
              cursor: "pointer",
            }}
          >
            <motion.span
              variants={{
                initial: { color: "var(--kz-accent)" },
                hover: { color: "var(--kz-accent-hover)" },
              }}
              transition={{ duration: 0.2 }}
            >
              {isFr ? "Découvrir l'Architecture Orochia" : "Explore Orochia Architecture"}
            </motion.span>
            <motion.span
              variants={{
                initial: { x: 0, color: "var(--kz-accent)" },
                hover: { x: 4, color: "var(--kz-accent-hover)" },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ArrowRight size={14} strokeWidth={2.2} />
            </motion.span>
            <motion.span
              variants={{
                initial: { scaleX: 0 },
                hover: { scaleX: 1 },
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1.5px",
                background: "var(--kz-accent)",
                transformOrigin: "left",
              }}
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
