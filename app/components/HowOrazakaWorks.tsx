"use client";

/* ─────────────────────────────────────────────────────────────────────────
   HOW ORAZAKA WORKS — the evangelist's teaching layer
   ─────────────────────────────────────────────────────────────────────────
   Sits between the page hero and the interactive ArchitectureMesh. Its job is
   pedagogy, not decoration: give the mental model in one breath, then walk a
   real request through the six stages (what happens · why it matters), and
   finally hand the reader off to the live map with a "how to read it" cue.

   Narration is grounded in the real component descriptions from
   ArchitectureMesh — no invented facts. Stage colors are kept identical so
   the story and the board read as one system. Tokens only (var(--kz-*)),
   theme-aware, reduced-motion safe.
   ───────────────────────────────────────────────────────────────────────── */

import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Workflow,
  Boxes,
  MousePointerClick,
  Search,
  CornerDownLeft,
  ArrowDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "./I18nProvider";

type Loc = "fr" | "en";

/* Same six accents as ArchitectureMesh, so the narrative maps 1:1 onto the board. */
const STAGE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#6366f1", "#10b981", "#f43f5e"];

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

interface Principle {
  icon: LucideIcon;
  color: string;
  title: Record<Loc, string>;
  desc: Record<Loc, string>;
}

const PRINCIPLES: Principle[] = [
  {
    icon: ShieldCheck,
    color: "#10b981",
    title: { fr: "Souverain", en: "Sovereign" },
    desc: {
      fr: "Tout s'exécute sur ton infrastructure. Aucune donnée n'est envoyée à un cloud tiers — conforme Loi 25 & RGPD.",
      en: "Everything runs on your infrastructure. No data is sent to a third-party cloud — Law 25 & GDPR compliant.",
    },
  },
  {
    icon: Workflow,
    color: "#6366f1",
    title: { fr: "Déterministe", en: "Deterministic" },
    desc: {
      fr: "Pas de boîte noire : chaque requête suit un ordre d'intercepteurs explicite, reproductible et auditable.",
      en: "No black box: each request follows an explicit, reproducible, auditable order of interceptors.",
    },
  },
  {
    icon: Boxes,
    color: "#8b5cf6",
    title: { fr: "Modulaire", en: "Modular" },
    desc: {
      fr: "Une architecture hexagonale : chaque responsabilité — sécurité, mémoire, médias — est un module remplaçable.",
      en: "A hexagonal architecture: every responsibility — security, memory, media — is a swappable module.",
    },
  },
];

interface Step {
  num: string;
  color: string;
  title: Record<Loc, string>;
  what: Record<Loc, string>;
  why: Record<Loc, string>;
}

const STEPS: Step[] = [
  {
    num: "01",
    color: STAGE_COLORS[0],
    title: { fr: "Présentation", en: "Presentation" },
    what: {
      fr: "Tu poses ta question depuis le client web, l'app mobile, le CLI ou la console d'administration.",
      en: "You ask from the web client, the mobile app, the CLI or the admin console.",
    },
    why: {
      fr: "Quatre portes d'entrée, un seul moteur derrière.",
      en: "Four front doors, a single engine behind them.",
    },
  },
  {
    num: "02",
    color: STAGE_COLORS[1],
    title: { fr: "Portail d'entrée", en: "Entry Gate" },
    what: {
      fr: "Le portail réceptionne la requête et l'achemine vers le moteur — en streaming (SSE) quand la réponse arrive au fil de l'eau.",
      en: "The gate receives the request and routes it into the engine — streaming (SSE) when the answer arrives token by token.",
    },
    why: {
      fr: "Un point d'entrée unique et contrôlé : rien n'accède directement aux modèles.",
      en: "One controlled entry point: nothing touches the models directly.",
    },
  },
  {
    num: "03",
    color: STAGE_COLORS[2],
    title: { fr: "Sécurité & Métier", en: "Security & Logic" },
    what: {
      fr: "Avant tout calcul, Orazaka t'authentifie, vérifie tes permissions (RBAC), applique les quotas et les règles métier.",
      en: "Before any compute, Orazaka authenticates you, checks permissions (RBAC), and enforces quotas and business rules.",
    },
    why: {
      fr: "La sécurité et la gouvernance passent avant l'inférence — pas après.",
      en: "Security and governance happen before inference — not after.",
    },
  },
  {
    num: "04",
    color: STAGE_COLORS[3],
    title: { fr: "Moteur Cognitif", en: "Cognitive Engine" },
    what: {
      fr: "Le cœur hexagonal, sans état, orchestre l'exécution de la requête et coordonne le flux de données.",
      en: "The stateless hexagonal core orchestrates the request and coordinates the data flow.",
    },
    why: {
      fr: "Le chef d'orchestre : reproductible à chaque appel.",
      en: "The conductor: reproducible on every single call.",
    },
  },
  {
    num: "05",
    color: STAGE_COLORS[4],
    title: { fr: "Workers & Pipeline", en: "Workers & Pipeline" },
    what: {
      fr: "La requête traverse les 15 intercepteurs (contexte système, mémoire, RAG, garde-fous), pendant que les workers asynchrones gèrent médias et intégrations MCP.",
      en: "The request flows through 15 interceptors (system context, memory, RAG, safety), while async workers handle media and MCP integrations.",
    },
    why: {
      fr: "C'est ici que la « cognition » s'assemble, étape ordonnée après étape ordonnée.",
      en: "This is where “cognition” is assembled, one ordered step after another.",
    },
  },
  {
    num: "06",
    color: STAGE_COLORS[5],
    title: { fr: "Stockage", en: "Persistence" },
    what: {
      fr: "Sessions, mémoire vectorielle (pgvector) et identités sont stockées dans tes propres bases de données.",
      en: "Sessions, vector memory (pgvector) and identities are stored in your own databases.",
    },
    why: {
      fr: "Ta donnée reste chez toi, du premier au dernier octet.",
      en: "Your data stays home, from the first byte to the last.",
    },
  },
];

export default function HowOrazakaWorks() {
  const { locale } = useI18n();
  const loc: Loc = locale === "fr" ? "fr" : "en";
  const reduce = useReducedMotion();

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-12%" },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay },
        };

  return (
    <section
      aria-labelledby="how-it-works-heading"
      style={{ maxWidth: "820px", margin: "0 auto", padding: "8px 20px 24px" }}
    >
      {/* ── Mental model ── */}
      <motion.div {...reveal()} style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--kz-accent)",
            margin: 0,
          }}
        >
          {loc === "fr" ? "Guide de lecture" : "Reading guide"}
        </p>
        <h2
          id="how-it-works-heading"
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "var(--kz-text-primary)",
            margin: "12px 0 0",
          }}
        >
          {loc === "fr" ? "Orazaka, expliqué simplement." : "Orazaka, explained simply."}
        </h2>
        <p style={{ fontSize: "15.5px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "14px 0 0" }}>
          {loc === "fr"
            ? "Avant de plonger dans la carte, voici le modèle mental. Orazaka est un moteur d'orchestration d'IA que tu héberges toi-même : chaque requête traverse un pipeline déterministe, étape par étape, sans jamais quitter ton réseau."
            : "Before you dive into the map, here's the mental model. Orazaka is an AI orchestration engine you host yourself: every request flows through a deterministic pipeline, step by step, and never leaves your network."}
        </p>
      </motion.div>

      {/* ── Three principles ── */}
      <div className="how-principles" style={{ display: "grid", gap: "12px", margin: "32px 0 8px" }}>
        {PRINCIPLES.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title.en}
              {...reveal(reduce ? 0 : 0.06 * i)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid var(--kz-border-subtle)",
                background: "color-mix(in srgb, var(--kz-surface-1) 60%, transparent)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  background: mix(p.color, 14),
                  border: `1px solid ${mix(p.color, 34)}`,
                  color: p.color,
                }}
              >
                <Icon size={19} strokeWidth={2} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                }}
              >
                {p.title[loc]}
              </span>
              <span style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>
                {p.desc[loc]}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Worked example: follow one request ── */}
      <motion.div {...reveal()} style={{ margin: "44px 0 0" }}>
        <h3
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            fontWeight: 750,
            letterSpacing: "-0.02em",
            color: "var(--kz-text-primary)",
            margin: 0,
          }}
        >
          {loc === "fr" ? "Suivons une vraie requête." : "Let's follow one real request."}
        </h3>

        {/* the sample question */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            margin: "16px 0 0",
            padding: "13px 15px",
            borderRadius: "13px",
            border: `1px solid ${mix("var(--kz-accent)", 40)}`,
            background: "var(--kz-accent-soft)",
          }}
        >
          <CornerDownLeft size={15} strokeWidth={2.2} style={{ color: "var(--kz-accent)", marginTop: "2px", flexShrink: 0 }} />
          <p
            style={{
              margin: 0,
              fontSize: "14.5px",
              lineHeight: 1.55,
              fontStyle: "italic",
              color: "var(--kz-text-primary)",
            }}
          >
            {loc === "fr"
              ? "« Résume ce contrat et signale les clauses non conformes à la Loi 25. »"
              : "“Summarize this contract and flag the clauses that don't comply with Law 25.”"}
          </p>
        </div>
        <p style={{ fontSize: "14.5px", lineHeight: 1.65, color: "var(--kz-text-secondary)", margin: "12px 2px 0" }}>
          {loc === "fr"
            ? "Voici ce qui lui arrive, de ta question jusqu'à la réponse :"
            : "Here's what happens to it, from your question to the answer:"}
        </p>
      </motion.div>

      {/* ── The narrated timeline ── */}
      <ol style={{ listStyle: "none", padding: 0, margin: "24px 0 0" }}>
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          return (
            <motion.li key={s.num} {...reveal(reduce ? 0 : 0.04 * Math.min(i, 5))} style={{ display: "flex", gap: "16px" }}>
              {/* spine + badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: s.color,
                    background: mix(s.color, 13),
                    border: `1.5px solid ${mix(s.color, 45)}`,
                  }}
                >
                  {s.num}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 1,
                      width: "2px",
                      minHeight: "22px",
                      margin: "6px 0",
                      borderRadius: "2px",
                      background: `linear-gradient(180deg, ${mix(s.color, 55)}, ${mix(STEPS[i + 1].color, 55)})`,
                    }}
                  />
                )}
              </div>

              {/* content */}
              <div style={{ paddingBottom: last ? 0 : "22px", minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title[loc]}
                </div>
                <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: 1.65, color: "var(--kz-text-secondary)" }}>
                  {s.what[loc]}
                </p>
                <p
                  style={{
                    display: "flex",
                    gap: "7px",
                    alignItems: "baseline",
                    margin: "8px 0 0",
                    fontSize: "13px",
                    lineHeight: 1.55,
                    color: s.color,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      opacity: 0.85,
                      flexShrink: 0,
                    }}
                  >
                    {loc === "fr" ? "Pourquoi" : "Why"}
                  </span>
                  <span>{s.why[loc]}</span>
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* ── The answer returns ── */}
      <motion.p
        {...reveal()}
        style={{
          margin: "4px 0 0",
          paddingLeft: "54px",
          fontSize: "14.5px",
          lineHeight: 1.65,
          color: "var(--kz-text-primary)",
          fontWeight: 500,
        }}
      >
        {loc === "fr"
          ? "→ La réponse, validée localement, te revient. Zéro donnée n'a quitté ton réseau."
          : "→ The locally-validated answer comes back to you. Zero data left your network."}
      </motion.p>

      {/* ── Hand-off to the live map ── */}
      <motion.div
        {...reveal()}
        style={{
          margin: "40px 0 0",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid var(--kz-border-subtle)",
          background: "color-mix(in srgb, var(--kz-surface-1) 55%, transparent)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--kz-text-primary)",
          }}
        >
          {loc === "fr" ? "À toi d'explorer la carte vivante." : "Now explore the live map."}
        </div>
        <div
          className="how-handoff-hints"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 20px",
            margin: "14px 0 0",
          }}
        >
          {[
            { icon: MousePointerClick, fr: "Survole une carte pour l'éclairer", en: "Hover a card to light it up" },
            { icon: MousePointerClick, fr: "Clique pour épingler le détail", en: "Click to pin its detail" },
            { icon: Search, fr: "Recherche un composant par nom", en: "Search a component by name" },
          ].map((h, i) => {
            const Icon = h.icon;
            return (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "12.5px",
                  color: "var(--kz-text-secondary)",
                }}
              >
                <Icon size={14} strokeWidth={2} style={{ color: "var(--kz-accent)", flexShrink: 0 }} />
                {loc === "fr" ? h.fr : h.en}
              </span>
            );
          })}
        </div>
        <ArrowDown
          size={18}
          strokeWidth={2.2}
          aria-hidden="true"
          className={reduce ? undefined : "how-bounce"}
          style={{ color: "var(--kz-text-muted)", margin: "16px 0 0" }}
        />
      </motion.div>

      <style>{`
        .how-principles { grid-template-columns: 1fr; }
        @media (min-width: 720px) {
          .how-principles { grid-template-columns: repeat(3, 1fr); }
        }
        @keyframes how-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
        .how-bounce { animation: how-bounce 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .how-bounce { animation: none; }
        }
      `}</style>
    </section>
  );
}
