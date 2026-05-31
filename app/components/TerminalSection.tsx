"use client";

import { motion } from "framer-motion";
import {
  Server,
  Monitor,
  Shield,
  Smartphone,
  Terminal,
  Database,
  Layers,
  ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   ARCHITECTURE SECTION — System topology from ARCHITECTURE.md
   Properly centered with generous spacing.
   ───────────────────────────────────────────────────────────────────── */

const clients = [
  { label: "Web Client",     detail: "Next.js 16 · :3000",    Icon: Monitor },
  { label: "Admin Console",  detail: "SecOps · :3001",        Icon: Shield },
  { label: "Mobile App",     detail: "Expo SDK 53 · :8081",   Icon: Smartphone },
  { label: "CLI",            detail: "SQLite · SSE Tunnel",   Icon: Terminal },
];

const modules = [
  { label: "Core Engine",   detail: "Stateless AI orchestration" },
  { label: "Identity",      detail: "RBAC + OAuth2 + BCrypt" },
  { label: "Tools",         detail: "MCP + API adapters + cache" },
  { label: "Interceptors",  detail: "15 pipeline filters (SPI)" },
  { label: "Business",      detail: "Persona templates + context" },
  { label: "Persistence",   detail: "JPA + PGVector + Redis" },
];

const features = [
  {
    title: "Hexagonal Architecture",
    desc: "Ports & Adapters enforced at compile time by ArchUnit. 15+ ring rules on every build.",
    Icon: Layers,
  },
  {
    title: "BFF Proxy Pattern",
    desc: "Browser never connects directly to the Gateway or Ollama. All traffic proxied through Next.js.",
    Icon: Shield,
  },
  {
    title: "Virtual Threads",
    desc: "All blocking I/O on Java 21 Virtual Threads. No synchronized blocks over I/O.",
    Icon: Server,
  },
  {
    title: "Sovereign DNS",
    desc: "Ollama destinations verified against localhost and RFC 1918 subnets. No data leaves your network.",
    Icon: Database,
  },
];

export default function ArchitectureSection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-[1100px] mx-auto space-y-16">
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--kz-accent)" }}
          >
            Architecture
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            System Topology
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--kz-text-secondary)" }}>
            A strict hexagonal boundary between business intent and execution
            mechanics, with the Gateway as the sole translation layer.
          </p>
        </motion.div>

        {/* Topology Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-10"
        >
          <div className="grid md:grid-cols-[1fr_60px_1.4fr] gap-6 items-start">
            {/* Client Tier */}
            <div className="space-y-3">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.15em] block mb-4"
                style={{ color: "var(--kz-text-muted)" }}
              >
                Client Tier
              </span>
              {clients.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-xl"
                  style={{
                    background: "var(--kz-surface-2)",
                    border: "1px solid var(--kz-border-subtle)",
                  }}
                >
                  <c.Icon size={14} strokeWidth={1.5} style={{ color: "var(--kz-accent)" }} />
                  <div>
                    <span className="text-sm font-medium">{c.label}</span>
                    <span className="text-[10px] ml-2" style={{ color: "var(--kz-text-muted)" }}>{c.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* BFF Arrow */}
            <div className="hidden md:flex flex-col items-center justify-center gap-2 pt-10">
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--kz-text-muted)" }}
              >
                BFF
              </span>
              {[0, 1, 2, 3].map((i) => (
                <ArrowRight key={i} size={14} strokeWidth={1.5} style={{ color: "var(--kz-accent)", opacity: 0.3 }} />
              ))}
            </div>

            {/* Gateway Modules */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--kz-text-muted)" }}
                >
                  Gateway
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: "var(--kz-status-success)" }}>
                  <span className="status-dot" style={{ color: "var(--kz-status-success)" }} />
                  :8080
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {modules.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                    className="py-3 px-4 rounded-xl"
                    style={{
                      border: "1px solid var(--kz-border-subtle)",
                      background: "color-mix(in srgb, var(--kz-surface-1) 60%, transparent)",
                    }}
                  >
                    <span className="text-xs font-semibold block">{m.label}</span>
                    <span className="text-[10px]" style={{ color: "var(--kz-text-muted)" }}>{m.detail}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Architecture Features — 2x2 grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-card p-7 flex gap-5"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--kz-accent-soft)" }}
              >
                <f.Icon size={18} strokeWidth={1.5} style={{ color: "var(--kz-accent)" }} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--kz-text-muted)" }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
