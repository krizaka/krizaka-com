"use client";

import { motion } from "framer-motion";
import {
  User,
  Settings,
  Languages,
  Brain,
  Database,
  Globe,
  Sparkles,
  GitBranch,
  Wrench,
  Shield,
  CheckCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   PIPELINE STRIP — Animated interceptor chain
   11 canonical nodes. Horizontal scroll, generous spacing.
   ───────────────────────────────────────────────────────────────────── */

const NODES = [
  { id: "user-ctx",  label: "UserCtx",    Icon: User,        active: true,  ai: false },
  { id: "sys-ctx",   label: "SysCtx",     Icon: Settings,    active: true,  ai: false },
  { id: "lang",      label: "Language",   Icon: Languages,   active: true,  ai: false },
  { id: "memory",    label: "Memory",     Icon: Brain,       active: true,  ai: false },
  { id: "rag",       label: "RAG",        Icon: Database,    active: false, ai: false },
  { id: "mcp",       label: "MCP",        Icon: Globe,       active: false, ai: false },
  { id: "refiner",   label: "Refiner",    Icon: Sparkles,    active: true,  ai: true },
  { id: "router",    label: "Router",     Icon: GitBranch,   active: true,  ai: true },
  { id: "tool",      label: "Tool",       Icon: Wrench,      active: false, ai: false },
  { id: "cost",      label: "CostShield", Icon: Shield,      active: true,  ai: false },
  { id: "quantum",   label: "Quantum",    Icon: CheckCircle, active: true,  ai: true },
];

export default function PipelineStrip() {
  return (
    <section id="technology" className="py-32 px-6">
      <div className="max-w-[1100px] mx-auto space-y-12">
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
            Core Technology
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Interceptor Pipeline
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--kz-text-secondary)" }}>
            Every request flows through an 11-node context enrichment chain —
            each interceptor adding intelligence, validation, and security.
          </p>
        </motion.div>

        {/* Pipeline card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Status bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GitBranch size={14} strokeWidth={1.5} style={{ color: "var(--kz-accent)" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--kz-text-muted)" }}
              >
                Interceptor Pipeline
              </span>
            </div>
            <span className="flex items-center gap-2 text-[11px] font-mono" style={{ color: "var(--kz-status-success)" }}>
              <span className="status-dot" style={{ color: "var(--kz-status-success)" }} />
              Operational
            </span>
          </div>

          {/* Node strip */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
            {NODES.map((node, idx) => {
              const { Icon } = node;
              return (
                <div key={node.id} className="contents">
                  {/* Node */}
                  <div
                    className="flex-shrink-0 flex flex-col items-center gap-2.5 px-4 py-3 rounded-xl transition-colors duration-200"
                    style={{ opacity: node.active ? 1 : 0.35 }}
                  >
                    <div
                      className="relative flex items-center justify-center w-11 h-11 rounded-full border"
                      style={{
                        borderColor: node.active ? "var(--kz-status-success)" : "var(--kz-border-default)",
                        background: node.active ? "hsla(160, 84%, 39%, 0.06)" : "transparent",
                      }}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {node.active && (
                        <span
                          className="absolute inset-0 rounded-full border animate-[status-pulse_2s_ease-in-out_infinite]"
                          style={{ borderColor: "var(--kz-status-success)", opacity: 0.3 }}
                        />
                      )}
                      {node.ai && (
                        <span
                          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: "var(--kz-accent)" }}
                        >
                          <Sparkles size={8} strokeWidth={2.5} style={{ color: "var(--kz-on-accent)" }} />
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap"
                      style={{ color: "var(--kz-text-muted)" }}
                    >
                      {node.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {idx < NODES.length - 1 && (
                    <div className="flex-shrink-0 w-4 h-px" style={{ background: "var(--kz-border-default)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
