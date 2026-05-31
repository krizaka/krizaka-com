"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessagesSquare, CircleDot } from "lucide-react";
import TopNavBar from "../../components/TopNavBar";
import SiteFooter from "../../components/SiteFooter";
import { useI18n } from "../../components/I18nProvider";
import {
  GITHUB_DISCUSSIONS_URL,
  GITHUB_ISSUES_URL,
} from "@/lib/site";

/* ─── Mascot: Owl (Questions & help) ─── */
function OwlMascot() {
  return (
    <svg width="64" height="64" viewBox="0 0 60 60" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="contact-owl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <g>
        {/* Body */}
        <path
          d="M 18 22 C 18 10, 42 10, 42 22 C 42 38, 36 45, 30 45 C 24 45, 18 38, 18 22 Z"
          fill="url(#contact-owl-grad)"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
        />
        {/* Eyes */}
        <circle cx="24" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
        <circle cx="36" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
        <motion.circle
          cx="24" cy="18" r="1.5" fill="#00ff66"
          animate={{ opacity: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.43, 0.46, 0.5, 1] }}
        />
        <motion.circle
          cx="36" cy="18" r="1.5" fill="#00ff66"
          animate={{ opacity: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.43, 0.46, 0.5, 1] }}
        />
        {/* Beak */}
        <polygon points="28,20 32,20 30,25" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
        {/* Ears */}
        <motion.polygon
          points="20,11 24,14 18,18"
          fill="#7c3aed"
          stroke="var(--kz-border-strong)" strokeWidth="1"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "24px 14px" }}
        />
        <motion.polygon
          points="40,11 36,14 42,18"
          fill="#7c3aed"
          stroke="var(--kz-border-strong)" strokeWidth="1"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "36px 14px" }}
        />
      </g>
    </svg>
  );
}

/* ─── Mascot: Falcon (Bugs & features) ─── */
function FalconMascot() {
  return (
    <svg width="64" height="64" viewBox="0 0 60 60" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="contact-falcon-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9f00" />
          <stop offset="100%" stopColor="#ff2a00" />
        </linearGradient>
      </defs>
      <g>
        {/* Legs */}
        <line x1="24" y1="38" x2="21" y2="48" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="38" x2="39" y2="48" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body */}
        <path
          d="M 15 24 C 15 12, 45 12, 45 24 C 45 38, 38 45, 30 45 C 22 45, 15 38, 15 24 Z"
          fill="url(#contact-falcon-grad)"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
        />
        {/* Head */}
        <circle cx="30" cy="15" r="11" fill="url(#contact-falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
        <polygon points="27,16 33,16 30,24" fill="#ffb300" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
        {/* Visor */}
        <rect x="20" y="7" width="20" height="7" rx="2" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
        <motion.g
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="25" cy="10.5" r="1.5" fill="#00f2fe" />
          <circle cx="35" cy="10.5" r="1.5" fill="#00f2fe" />
        </motion.g>
        {/* Wings */}
        <motion.path
          d="M 14 22 C 6 28, 8 40, 18 38"
          fill="none" stroke="#d84315" strokeWidth="3.5" strokeLinecap="round"
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "18px 38px" }}
        />
        <motion.path
          d="M 46 22 C 54 28, 52 40, 42 38"
          fill="none" stroke="#d84315" strokeWidth="3.5" strokeLinecap="round"
          animate={{ rotate: [4, -4, 4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "42px 38px" }}
        />
      </g>
    </svg>
  );
}

/* ─── Channel data ─── */
const CHANNELS = [
  {
    id: "discussions",
    Icon: MessagesSquare,
    Mascot: OwlMascot,
    accent: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.08)",
    href: GITHUB_DISCUSSIONS_URL,
    external: true,
  },
  {
    id: "issues",
    Icon: CircleDot,
    Mascot: FalconMascot,
    accent: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.08)",
    href: GITHUB_ISSUES_URL,
    external: true,
  },
];

export default function ContactClient() {
  const { t, locale } = useI18n();

  // Only keep the first 2 channels (Questions & Bugs), skip "Partenariats & presse"
  const channels = t.contact.channels.slice(0, 2);

  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "140px 24px 80px",
        }}
      >
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "56px" }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--kz-accent)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            {locale === "fr" ? "COMMUNAUTÉ" : "COMMUNITY"}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            {locale === "fr" ? "Échangeons en public" : "Let's talk in public"}
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--kz-text-secondary)",
              lineHeight: 1.7,
              maxWidth: "560px",
            }}
          >
            {locale === "fr"
              ? "Orazaka est un projet open source. La transparence est un principe fondamental — chaque question, bogue ou idée se discute publiquement sur GitHub."
              : "Orazaka is an open-source project. Transparency is a core principle — every question, bug, or idea is discussed publicly on GitHub."}
          </p>
        </motion.div>

        {/* ─── Two Channel Cards ─── */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          {channels.map((ch, index) => {
            const channelDef = CHANNELS[index];
            if (!channelDef) return null;
            const { Mascot, Icon, accent, glow, href, external } = channelDef;

            return (
              <motion.a
                key={ch.kind}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="contact-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.1 }}
                whileHover={{
                  y: -4,
                  borderColor: accent,
                  boxShadow: `0 16px 40px rgba(0,0,0,0.12), 0 0 24px ${glow}`,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "40px 28px 32px",
                  borderRadius: "20px",
                  border: "1px solid var(--kz-border-subtle)",
                  background: "color-mix(in srgb, var(--kz-surface-1) 70%, transparent)",
                  backdropFilter: "blur(16px)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "border-color 250ms ease, box-shadow 250ms ease",
                }}
              >
                {/* Mascot */}
                <div style={{ marginBottom: "20px" }}>
                  <Mascot />
                </div>

                {/* Icon + Category */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: accent, display: "flex" }}>
                    <Icon size={15} strokeWidth={2} />
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
                    GitHub
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {ch.title}
                </h2>

                {/* Description */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--kz-text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "20px",
                    flex: 1,
                  }}
                >
                  {ch.desc}
                </p>

                {/* CTA */}
                <span
                  className="contact-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: accent,
                    transition: "gap 200ms ease",
                  }}
                >
                  {ch.cta}
                  <ArrowRight size={14} strokeWidth={2} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>

      <SiteFooter />

      <style>{`
        .contact-card:hover .contact-cta {
          gap: 10px !important;
        }

        @media (max-width: 640px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
