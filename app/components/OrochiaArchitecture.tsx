"use client";

/* Orochia — animated, interactive architecture. Three request journeys (playback, paid unlock,
   upload) play step by step across the components: the active hop carries a packet, the nodes it
   joins light up, and the step card names the real endpoint (checked at build time against the
   generated architecture data, lib/orochia-journeys.ts).
   Autoplays while visible; pauses on hover/focus; fully driven by the controls under
   prefers-reduced-motion (no autoplay, no travelling packet). Tokens only, except the per-journey
   identity colours (mid-tones that read on both themes). */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { ARCH_NODES, type ArchNode, type Journey, type NodeId } from "@/lib/orochia-journeys";
import type { TranslationDictionary } from "@/lib/i18n";

type ArchText = TranslationDictionary["site"]["orochia"]["arch"];

const STEP_MS = 3200;
const noop = () => () => {};
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

type Layout = { w: number; h: number; pos: Record<NodeId, [number, number]>; bend: (a: NodeId, b: NodeId) => number; nodeW: number };

const WIDE: Layout = {
  w: 1000,
  h: 440,
  nodeW: 180,
  pos: Object.fromEntries(ARCH_NODES.map((n) => [n.id, [n.x, n.y]])) as Layout["pos"],
  bend: (a, b) => (pair(a, b) === "bunny|viewer" ? -70 : pair(a, b) === "bunny|creator" ? 70 : 0),
};
const NARROW: Layout = {
  w: 400,
  h: 660,
  nodeW: 168,
  pos: { viewer: [105, 60], creator: [295, 60], app: [200, 240], gateway: [100, 420], db: [300, 420], bunny: [200, 600] },
  bend: (a, b) => (pair(a, b) === "bunny|viewer" ? -150 : pair(a, b) === "bunny|creator" ? 150 : 0),
};

function pair(a: NodeId, b: NodeId) {
  return [a, b].sort().join("|");
}

/** Quadratic curve between two nodes, bent sideways by `bend` px. */
function curve(l: Layout, a: NodeId, b: NodeId) {
  const [x1, y1] = l.pos[a];
  const [x2, y2] = l.pos[b];
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  // The bend is defined for the sorted pair so a→b and b→a share the same curve.
  const sign = [a, b].sort()[0] === a ? 1 : -1;
  const k = l.bend(a, b) * sign;
  const cx = mx + (-(y2 - y1) / len) * k, cy = my + ((x2 - x1) / len) * k;
  return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, at: (t: number) => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2] };
}

function Diagram({ layout, journey, step, travel, text, className }: { layout: Layout; journey: Journey; step: number; travel: boolean; text: ArchText; className: string }) {
  const jt = text.journeys[journey.id];
  const s = journey.steps[step];
  const pairs = useMemo(() => [...new Set(journey.steps.map((x) => pair(x.from, x.to)))], [journey]);
  const done = new Set(journey.steps.slice(0, step).map((x) => pair(x.from, x.to)));
  const active = curve(layout, s.from, s.to);
  const nodeH = 64;

  return (
    <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className={className} role="img" aria-label={`${jt.name} — ${jt.steps[step].title}`}>
      {/* Every hop of the journey, quiet; the ones already travelled keep a trace. */}
      {pairs.map((p) => {
        const [a, b] = p.split("|") as [NodeId, NodeId];
        const c = curve(layout, a, b);
        return (
          <path key={p} d={c.d} fill="none" strokeWidth={done.has(p) ? 2 : 1.5} strokeDasharray={done.has(p) ? undefined : "5 7"}
            stroke={done.has(p) ? journey.color : "var(--kz-border-strong)"} opacity={done.has(p) ? 0.45 : 0.7} />
        );
      })}
      {/* The active hop */}
      <path d={active.d} fill="none" stroke={journey.color} strokeWidth={3} strokeLinecap="round" />
      {/* The packet travels the active hop (1.3 s, a 0.7 s rest) — SVG animateMotion, so no script runs per frame, and
          only while the schema is on screen and motion is welcome. */}
      {travel && (
        <circle key={`${journey.id}-${step}-${layout.w}`} r={8} fill={journey.color} style={{ filter: `drop-shadow(0 0 8px ${journey.color})` }}>
          <animateMotion dur="2s" repeatCount="indefinite" path={active.d} calcMode="spline" keyPoints="0;1;1" keyTimes="0;0.65;1"
            keySplines="0.42 0 0.58 1;0 0 1 1" />
        </circle>
      )}

      {ARCH_NODES.map((n: ArchNode) => {
        const [x, y] = layout.pos[n.id];
        const on = n.id === s.from || n.id === s.to;
        const used = journey.steps.some((st) => st.from === n.id || st.to === n.id);
        return (
          <g key={n.id} transform={`translate(${x - layout.nodeW / 2}, ${y - nodeH / 2})`} opacity={used ? 1 : 0.35} style={{ transition: "opacity 300ms ease" }}>
            {/* The chip of every schema of the site (diagrams.module.css): opaque card, 11px radius, a rail in the group colour. */}
            <rect width={layout.nodeW} height={nodeH} rx={11} fill="var(--kz-surface-1)"
              stroke={on ? journey.color : "var(--kz-border-default)"} strokeWidth={on ? 2 : 1}
              style={{ filter: on ? `drop-shadow(0 6px 16px color-mix(in srgb, ${journey.color} 30%, transparent))` : undefined, transition: "stroke 250ms ease" }} />
            <rect x={0} y={10} width={3} height={nodeH - 20} rx={1.5} fill={used ? journey.color : "var(--kz-border-strong)"} />
            <text x={layout.nodeW / 2} y={27} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--kz-text-primary)" fontFamily="var(--font-display), system-ui, sans-serif">
              {text.nodes[n.id].label}
            </text>
            <text x={layout.nodeW / 2} y={47} textAnchor="middle" fontSize={11.5} fill="var(--kz-text-secondary)" fontFamily="var(--font-mono), monospace">
              {text.nodes[n.id].sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function OrochiaArchitecture({ journeys }: { journeys: Journey[] }) {
  const { t } = useI18n();
  const text = t.site.orochia.arch;
  // Unknown during SSR: honour the preference only once mounted (no hydration mismatch).
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);

  const [j, setJ] = useState(0);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const journey = journeys[j];
  const s = journey.steps[step];
  const playing = mounted && !reduce && !paused && visible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step < journey.steps.length - 1) setStep(step + 1);
      else {
        setStep(0);
        setJ((j + 1) % journeys.length);
      }
    }, step === journey.steps.length - 1 ? STEP_MS + 1200 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, j, journey.steps.length, journeys.length]);

  const go = (d: number) => setStep((x) => Math.min(journey.steps.length - 1, Math.max(0, x + d)));

  return (
    <div
      ref={ref}
      className="oa"
      style={{ ["--j" as string]: journey.color }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="oa-tabs" role="tablist" aria-label={t.site.menu.journeysAria}>
        {journeys.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === j} className="oa-tab" style={{ ["--c" as string]: x.color }}
            onClick={() => { setJ(i); setStep(0); }}>
            <span className="oa-dot" aria-hidden /> {text.journeys[x.id].name}
          </button>
        ))}
      </div>
      <p className="oa-summary">{text.journeys[journey.id].summary}</p>

      <div className="oa-stage">
        <Diagram layout={WIDE} journey={journey} step={step} travel={mounted && !reduce && visible} text={text} className="oa-svg oa-wide" />
        <Diagram layout={NARROW} journey={journey} step={step} travel={mounted && !reduce && visible} text={text} className="oa-svg oa-narrow" />
      </div>

      <div className="oa-card" aria-live="polite">
        <div className="oa-card-head">
          <span className="oa-num">{String(step + 1).padStart(2, "0")}<span>/{String(journey.steps.length).padStart(2, "0")}</span></span>
          <strong>{text.journeys[journey.id].steps[step].title}</strong>
          {s.endpoint && <code className="oa-endpoint">{s.endpoint}</code>}
        </div>
        <p>{text.journeys[journey.id].steps[step].detail}</p>
        <div className="oa-controls">
          <button onClick={() => go(-1)} disabled={step === 0} aria-label={text.stepPrev}><ChevronLeft size={16} /></button>
          <div className="oa-steps">
            {journey.steps.map((_, i) => (
              <button key={i} className={`oa-step${i === step ? " is-on" : ""}${i < step ? " is-done" : ""}`} onClick={() => setStep(i)}
                aria-label={`${text.step} ${i + 1}`} aria-current={i === step ? "step" : undefined} />
            ))}
          </div>
          <button onClick={() => go(1)} disabled={step === journey.steps.length - 1} aria-label={text.stepNext}><ChevronRight size={16} /></button>
          {!reduce && (
            <button className="oa-play" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"}>
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Text version: every journey, every step, every endpoint. */}
      <details className="oa-text">
        <summary>{text.textVersion}</summary>
        {journeys.map((x) => (
          <div key={x.id}>
            <h4>{text.journeys[x.id].name}</h4>
            <p>{text.journeys[x.id].summary}</p>
            <ol>
              {x.steps.map((st, i) => (
                <li key={i}>
                  <strong>{text.nodes[st.from].label} → {text.nodes[st.to].label}</strong> — {text.journeys[x.id].steps[i].title}
                  {st.endpoint && <> (<code>{st.endpoint}</code>)</>}: {text.journeys[x.id].steps[i].detail}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </details>

      <style>{`
        .oa-text { margin-top: 14px; border-top: 1px solid var(--kz-border-subtle); padding-top: 12px; font-size: 13.5px; color: var(--kz-text-secondary); }
        .oa-text summary { cursor: pointer; font-weight: 600; font-size: 13px; }
        .oa-text h4 { margin: 14px 0 4px; font-size: 14px; color: var(--kz-text-primary); }
        .oa-text p { margin: 0 0 6px; }
        .oa-text ol { margin: 0; padding-left: 20px; line-height: 1.6; }
        .oa-text code { font-family: var(--font-mono); font-size: 12px; }
        .oa { border-radius: 22px; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-0); padding: clamp(16px, 3vw, 28px); }
        .oa-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
        .oa-tab { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 600;
          color: var(--kz-text-secondary); background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color 150ms ease, color 150ms ease; }
        .oa-tab[aria-selected="true"] { color: var(--kz-text-primary); border-color: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 18%, transparent); }
        .oa-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
        .oa-summary { margin: 14px 0 0; font-size: 14px; color: var(--kz-text-secondary); }
        .oa-stage { margin-top: 10px; }
        .oa-svg { display: block; width: 100%; height: auto; }
        .oa-narrow { display: none; max-width: 420px; margin: 0 auto; }
        @media (max-width: 640px) { .oa-wide { display: none; } .oa-narrow { display: block; } }
        .oa-card { margin-top: 8px; padding: 16px 18px; border-radius: 16px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle);
          border-left: 3px solid var(--j); }
        .oa-card-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; }
        .oa-card-head strong { font-family: var(--font-display), system-ui, sans-serif; font-size: 16px; color: var(--kz-text-primary); }
        .oa-num { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--j); }
        .oa-num span { color: var(--kz-text-secondary); font-weight: 500; }
        .oa-endpoint { font-family: var(--font-mono); font-size: 11.5px; padding: 3px 8px; border-radius: 6px; color: var(--kz-text-secondary);
          background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle); overflow-wrap: anywhere; }
        .oa-card p { margin: 8px 0 0; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); min-height: 3.2em; }
        .oa-controls { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
        .oa-controls > button { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 9px; cursor: pointer;
          color: var(--kz-text-secondary); background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle); }
        .oa-controls > button:disabled { opacity: .4; cursor: default; }
        .oa-play { margin-left: auto; }
        .oa-steps { display: flex; gap: 6px; }
        .oa-step { width: 22px; height: 6px; border-radius: 999px; border: 0; padding: 0; cursor: pointer; background: var(--kz-border-default); transition: background 200ms ease, width 200ms ease; }
        .oa-step.is-done { background: color-mix(in srgb, var(--j) 50%, transparent); }
        .oa-step.is-on { width: 34px; background: var(--j); }
      `}</style>
    </div>
  );
}
