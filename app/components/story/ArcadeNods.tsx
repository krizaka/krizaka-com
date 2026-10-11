"use client";

/* ── /story — the arcade nods ───────────────────────────────────────────────────────────
   The page borrows the grammar of a 1990s arcade fighting game — a select screen, fighter cards, power gauges, a
   stage announcement, a special-move input, a boss gauge, the continue screen — and nothing else: every shape here
   is ours (the three brand marks, the sacred treasures of the myth, the Krizaka flock). No sprite, character, name,
   logo, typeface or sound from any game. Silent: no audio anywhere.

   Motion contract (/story keeps its own system, AGENTS.md §4):
   - each section plays ONE strong entrance, once, when it first enters the viewport (`data-in`): visual first,
     announcement next, text last — then it is calm to read; nothing replays;
   - at most ONE slow, faint loop per section (`.an-loop`), running only while the section is on screen (`data-live`,
     and the site conductor's `data-offscreen` on SectionBackdrop scopes); never behind a paragraph;
   - pointer and focus answer at once (a clan card is "selected": it rises, its aura flares, a flash crosses it);
   - no canvas, no requestAnimationFrame loop, no pointer tracking: one IntersectionObserver for the page;
   - prefers-reduced-motion: the director never switches motion on — everything is static, composed and visible.
   Colours: tokens only. Each clan scope carries `brand-<id>` (@krizaka/tokens/brands/scoped.css), so --kz-accent,
   --kz-accent-2 and the brand gradient are that brand's — the same values as its mark. Styles: story.css.
──────────────────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@krizaka/ui/button";
import { Mascot, type MascotBird } from "@krizaka/ui/mascots";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { cn } from "@krizaka/ui/cn";
import type { ChapterId } from "@/lib/story";
import "./story.css";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ── The director: one observer, sets data-in (once) and data-live (while visible) ─────── */

export function ArcadeDirector({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.motion = "on";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const t = e.target as HTMLElement;
          if (e.isIntersecting) {
            t.dataset.in = "";
            t.dataset.live = "";
          } else {
            delete t.dataset.live;
          }
        }
      },
      { threshold: 0.18 },
    );
    el.querySelectorAll<HTMLElement>("[data-arena]").forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);
  return (
    <div ref={root} className="st">
      {children}
    </div>
  );
}

/* ── The three sacred treasures of the myth, one per clan ─────────────────────────────── */

export function TreasureIcon({ id, size = 20 }: { id: ChapterId; size?: number }) {
  const common = {
    viewBox: "0 0 48 48",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (id === "krizaka")
    return (
      <svg {...common}>
        <path d="M24 3 L27 28 L24 36 L21 28 Z" />
        <path d="M15 30 H33 M24 36 V45" />
      </svg>
    );
  if (id === "orazaka")
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="17" />
        <circle cx="24" cy="24" r="9" />
        <path d="M24 2 V6 M24 42 V46 M2 24 H6 M42 24 H46" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M31 10 a13 13 0 1 1 -15 19 a8 8 0 0 0 8 -9 a8 8 0 0 1 7 -10 Z" />
      <circle cx="29" cy="17" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── A gauge that fills at the entrance, with its figure climbing (NumberTicker) ───────── */

function StatGauge({ label, value, locale }: { label: string; value: number; locale: string }) {
  return (
    <div className="an-stat" style={{ "--v": value } as Vars}>
      <div className="an-stat-head">
        <span className="an-stat-label">{label}</span>
        <NumberTicker className="an-stat-value" value={value} locale={locale} format={{ style: "percent" }} />
      </div>
      <div className="an-gauge" aria-hidden>
        <span className="an-gauge-fill" />
      </div>
    </div>
  );
}

/* ── Hero: the select screen — three fighter cards; choosing one jumps to its stage ────── */

export type SelectClan = {
  id: ChapterId;
  mark: ReactNode;
  clanName: string;
  product: string;
  tagline: string;
  stage: string;
  stat: { label: string; value: number };
};

export function ClanSelect({
  clans,
  head,
  prompt,
  aria,
  locale,
}: {
  clans: SelectClan[];
  head: { tag: string; synergy: string };
  prompt: string;
  aria: string;
  locale: string;
}) {
  return (
    <div className="an-select" role="group" aria-label={aria}>
      <div className="an-select-head" aria-hidden>
        <span className="an-select-tag">{head.tag}</span>
        <span className="an-select-sep" />
        <span className="an-select-synergy">{head.synergy}</span>
      </div>
      <p className="an-select-prompt">
        <span className="an-select-caret" aria-hidden>▶</span>
        {prompt}
      </p>
      <ul className="an-select-grid">
        {clans.map((c, i) => (
          <li key={c.id} className={cn("an-slot", "brand-" + c.id)} style={{ "--i": i } as Vars}>
            <Link href={`#st-${c.id}`} className="an-card">
              <span className="an-card-aura" aria-hidden />
              <span className="an-card-flash" aria-hidden />
              <span className="an-corner is-tl" aria-hidden />
              <span className="an-corner is-tr" aria-hidden />
              <span className="an-corner is-bl" aria-hidden />
              <span className="an-corner is-br" aria-hidden />
              <span className="an-card-top">
                <span className="an-card-slot" aria-hidden>
                  P{i + 1}
                </span>
                <span className="an-card-clan text-fg-accent">
                  <TreasureIcon id={c.id} size={13} />
                  {c.clanName}
                </span>
              </span>
              <span className="an-card-stage" aria-hidden>
                <span className="an-card-floor" />
                <span className="an-card-mark">{c.mark}</span>
              </span>
              <span className="an-card-name">{c.product}</span>
              <span className="an-card-tag">{c.tagline}</span>
              <StatGauge label={c.stat.label} value={c.stat.value} locale={locale} />
              <span className="an-card-go">
                {c.stage}
                <span aria-hidden>↓</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── A clan stage: the same fighter card for all three ─────────────────────────────────── */

export function FighterCard({
  id,
  mark,
  clanName,
  roots,
  stat,
  locale,
}: {
  id: ChapterId;
  mark: ReactNode;
  clanName: string;
  roots: string;
  stat: { label: string; value: number };
  locale: string;
}) {
  return (
    <div className="an-fighter">
      <div className="an-crt-lines" aria-hidden />
      <div className="an-fighter-disc">
        <span className="an-fighter-ring" aria-hidden />
        <span className="an-fighter-aura an-loop" aria-hidden />
        <span className="an-fighter-flash" aria-hidden />
        <span className="an-fighter-mark">{mark}</span>
      </div>
      <span className="an-fighter-clan text-fg-accent">
        <TreasureIcon id={id} size={16} />
        {clanName}
      </span>
      <StatGauge label={stat.label} value={stat.value} locale={locale} />
      <p className="an-roots">{roots}</p>
    </div>
  );
}

/* ── The stage announcement (STAGE 01 · KRIZAKA) ───────────────────────────────────────── */

export function StageCall({ stage, name }: { stage: string; name: string }) {
  return (
    <p className="an-stage">
      <span className="an-stage-num text-fg-accent">{stage}</span>
      <span className="an-stage-name">{name}</span>
    </p>
  );
}

/* ── The special move, as a combo card: the input lights key by key, then the move lands. The bird in the clan's
      corner carries the promise (one bird per idea: the duck builds, the owl reads, the flamingo gets paid). ──── */

export function ComboCard({
  label,
  move,
  combo,
  bird,
  corner,
  birdName,
  birdRole,
}: {
  label: string;
  move: string;
  combo: readonly string[];
  bird: MascotBird;
  corner: string;
  birdName: string;
  birdRole: string;
}) {
  return (
    <div className="an-combo">
      <span className="an-combo-flash" aria-hidden />
      <div className="an-combo-head">
        <span className="an-combo-label text-fg-accent">{label}</span>
        <span className="an-combo-input" aria-hidden>
          {combo.map((k, i) => (
            <kbd key={i} className="an-key" style={{ "--k": i } as Vars}>
              {k}
            </kbd>
          ))}
        </span>
      </div>
      <p className="an-combo-move">{move}</p>
      <div className="an-combo-corner">
        <span className="an-combo-bird" aria-hidden>
          <Mascot bird={bird} mood="success" size={48} animated={false} />
        </span>
        <span className="an-combo-who">
          <span className="an-combo-cornerlabel">{corner}</span>
          <span className="an-combo-name">
            {birdName} · <span className="text-fg-accent">{birdRole}</span>
          </span>
        </span>
      </div>
    </div>
  );
}

/* ── The boss gauge: eight segments, one drained per sealed head ───────────────────────── */

export function BossGauge({ label, count }: { label: string; count: number }) {
  return (
    <div className="an-boss-gauge" aria-hidden>
      <span className="an-boss-gauge-label">{label}</span>
      <div className="an-boss-cells">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="an-boss-cell" style={{ "--i": i } as Vars} />
        ))}
      </div>
    </div>
  );
}

/* ── Continue? — a real CRT: the closing call lives on the screen, the cabinet's deck under it ─ */

export function ContinueScreen({
  label,
  insertCoin,
  coinEntry,
  creditLabel,
  cabinetLabel,
  playerStart,
  restartBtn,
  children,
}: {
  label: string;
  insertCoin: string;
  coinEntry: string;
  creditLabel: string;
  cabinetLabel: string;
  playerStart: string;
  restartBtn: string;
  children: ReactNode;
}) {
  return (
    <div className="an-cabinet brand-krizaka" data-arena>
      <div className="an-bezel-top" aria-hidden>
        <span className="an-screw" />
        <span className="an-bezel-label">{cabinetLabel}</span>
        <span className="an-screw" />
      </div>
      <div className="an-crt theme-dark">
        <div className="an-crt-lines" aria-hidden />
        <div className="an-scan an-loop" aria-hidden />
        <div className="an-crt-glass" aria-hidden />
        <div className="an-crt-content">
          <div className="an-crt-count" aria-hidden>
            <span className="an-crt-title">{label}</span>
            <span className="an-crt-digit">9</span>
          </div>
          {children}
        </div>
      </div>
      <div className="an-deck">
        <div className="an-coin-deck" aria-hidden>
          <span className="an-coin-lit">{insertCoin}</span>
          <span className="an-coin-entry">{coinEntry}</span>
          <span className="an-credit">
            <span className="an-credit-led" />
            {creditLabel}
          </span>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          shape="cut"
          className="an-start"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
        >
          <span className="an-start-key">{playerStart}</span>
          {restartBtn}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
