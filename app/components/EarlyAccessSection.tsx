"use client";
 
 import { useI18n } from "./I18nProvider";
import WaitlistInline from "./WaitlistInline";
import { motion } from "framer-motion";

const COPY = {
  fr: {
    label: "Accès anticipé",
    title: "Rejoindre Orasaka Cloud",
    desc: "Un hébergement géré avec la même souveraineté des données : white-label sous votre marque, activation de Packages d'intercepteurs en un clic, et support de production de Krizaka.",
  },
  en: {
    label: "Early access",
    title: "Join Orasaka Cloud",
    desc: "Managed hosting with the exact same data sovereignty: white-label branding, one-click interceptor Package activation, and production support from Krizaka.",
  },
} as const;

export default function EarlyAccessSection() {
  const { locale } = useI18n();
  const c = COPY[locale];

  return (
    <motion.section
      id="early-access"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ padding: "112px 24px", maxWidth: "800px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 600, color: "var(--kz-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
          {c.label}
        </span>
        <h2 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--kz-text-primary)", marginBottom: "16px" }}>
          {c.title}
        </h2>
        <p style={{ fontSize: "15px", color: "var(--kz-text-secondary)", maxWidth: "560px", lineHeight: 1.65, margin: "0 0 16px" }}>
          {c.desc}
        </p>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <WaitlistInline defaultEdition="cloud" hideTitleDesc={true} />
      </div>
    </motion.section>
  );
}

