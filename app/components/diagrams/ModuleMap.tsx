"use client";

/* ─────────────────────────────────────────────────────────────────────────
   MODULE MAP — one way to see the architecture, for every product
   Every module of the product's generated model (lib/architecture-model.ts) in one band per role, labels in full,
   never truncated. Three views:
   - Dependencies: select a module, what it depends on and what depends on it stay lit, joined by orthogonal lines.
   - Runtime calls: who it calls and who calls it — requests (HTTP, SQL) solid, events (messages, webhooks, SSE,
     NOTIFY, push) dashed.
   - Journeys: a real request followed step by step. The map stays in place; the modules and links of the step light
     up, the rest dims, and the numbered steps sit beside the map (under it on narrow screens). Optional autoplay —
     never under prefers-reduced-motion, paused off screen, on hover and on focus.
   Lines are drawn under the chips, through the gutters between bands. Orazaka edges that point away from the core
   are dashed in warning colour: the map shows the code as it is.
   Mobile: one column, no lines — relations are listed in the detail panel, the steps under the map.
   A11y: chips are buttons (aria-pressed), Escape clears, a live region names the selection or the step, the steps
   are a list walked with the arrow keys, and the "Text version" holds every module, relation and journey as text.
   ───────────────────────────────────────────────────────────────────────── */

import { Fragment, type KeyboardEvent as ReactKeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  AgentIcon,
  AiIcon,
  AutomationIcon,
  ChevronRightIcon,
  CloseIcon,
  ExternalIcon,
  GlobeIcon,
  KnowledgeIcon,
  LinkIcon,
  LockIcon,
  PackIcon,
  PauseIcon,
  PlayIcon,
  SearchIcon,
  ServerIcon,
  SettingsIcon,
  ThemeIcon,
  BackIcon,
} from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";
import { ASYNC_KINDS, type FlowKind, type Journey, type MapModule, type Mode, type ModuleMapData, type Owner, type RoleId } from "@/lib/architecture-model";
import { cn } from "@krizaka/ui/cn";
import s from "./diagrams.module.css";

const ROLE_ICON: Record<RoleId, typeof AiIcon> = {
  client: GlobeIcon,
  service: ServerIcon,
  adapter: LinkIcon,
  application: AgentIcon,
  domain: AiIcon,
  contract: LockIcon,
  platform: PackIcon,
  starter: AutomationIcon,
  build: SettingsIcon,
  library: PackIcon,
  design: ThemeIcon,
  data: KnowledgeIcon,
  external: ExternalIcon,
};

export type View = Mode | "journey";
type OwnerFilter = "all" | Owner;
type Rel = "uses" | "usedBy" | "both";
interface Edge {
  from: string;
  to: string;
  warn: boolean;
  dashed: boolean;
}
interface Relation {
  id: string;
  warn: boolean;
  via: string | null;
  dashed: boolean;
}

const STEP_MS = 3600;
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const isAsync = (kind: FlowKind) => ASYNC_KINDS.includes(kind);

/** An orthogonal path through the points, with rounded corners. */
function roundedPath(points: [number, number][], r = 8) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1], [x1, y1] = points[i], [x2, y2] = points[i + 1];
    const k1 = Math.min(r, Math.hypot(x1 - x0, y1 - y0) / 2), k2 = Math.min(r, Math.hypot(x2 - x1, y2 - y1) / 2);
    const a: [number, number] = [x1 - Math.sign(x1 - x0) * k1, y1 - Math.sign(y1 - y0) * k1];
    const b: [number, number] = [x1 + Math.sign(x2 - x1) * k2, y1 + Math.sign(y2 - y1) * k2];
    d += ` L${a[0]},${a[1]} Q${x1},${y1} ${b[0]},${b[1]}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}

export interface ModuleMapInitial {
  view?: View;
  /** The module selected first (in the dependency or runtime view). */
  focus?: string | null;
  /** The journey opened first. */
  journey?: string;
  /** Only this owner's modules. */
  owner?: OwnerFilter;
}

export default function ModuleMap({
  data,
  journeys = [],
  compact = false,
  initial,
}: {
  data: ModuleMapData;
  journeys?: Journey[];
  compact?: boolean;
  initial?: ModuleMapInitial;
}) {
  const { t } = useI18n();
  const text = t.diagrams.moduleMap;
  const roleText = t.diagrams.roles[data.product] as Record<string, { title: string; summary: string }>;
  const kindText = text.kinds as Record<FlowKind, string>;
  const ownerText = t.diagrams.owners as Record<OwnerFilter, string>;

  const views: View[] = [...data.modes, ...(journeys.length ? (["journey"] as const) : [])];
  const startView: View = initial?.view && views.includes(initial.view) ? initial.view : views[0];
  const focusMode: Mode | null = startView === "journey" ? null : startView;

  const [view, setView] = useState<View>(startView);
  const [owner, setOwner] = useState<OwnerFilter>(initial?.owner ?? "all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<Mode, string | null>>(() => ({
    ...data.defaults,
    ...(focusMode && initial?.focus !== undefined ? { [focusMode]: initial.focus } : {}),
  }));
  const [hovered, setHovered] = useState<string | null>(null);
  const [journeyId, setJourneyId] = useState<string>(initial?.journey && journeys.some((j) => j.id === initial.journey) ? initial.journey : journeys[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);

  const journey = view === "journey" ? journeys.find((j) => j.id === journeyId) ?? null : null;
  const step = journey ? journey.steps[Math.min(stepIndex, journey.steps.length - 1)] : null;
  const mode: Mode = journey ? journey.mode : (view as Mode);

  const byId = useMemo(() => new Map(data.modules.map((m) => [m.id, m])), [data.modules]);
  const roles = data.modeRoles[mode];
  const owners: Owner[] = data.owners;

  // Relations of a module in the current mode.
  const { dependencies, flows } = data;
  const relationsOf = (id: string): { out: Relation[]; in: Relation[] } => {
      if (mode === "build") {
        return {
          out: dependencies.filter((d) => d.from === id).map((d) => ({ id: d.to, warn: d.outward, via: d.via, dashed: d.dashed })),
          in: dependencies.filter((d) => d.to === id).map((d) => ({ id: d.from, warn: d.outward, via: d.via, dashed: d.dashed })),
        };
      }
      const collapse = (list: ModuleMapData["flows"], key: "from" | "to") => {
        const map = new Map<string, Relation>();
        for (const f of list) {
          const other = f[key];
          const prev = map.get(other);
          const via = prev ? (prev.via!.split(" · ").includes(f.via) ? prev.via : `${prev.via} · ${f.via}`) : f.via;
          map.set(other, { id: other, warn: false, via, dashed: (prev ? prev.dashed : true) && isAsync(f.kind) });
        }
        return [...map.values()];
      };
      return { out: collapse(flows.filter((f) => f.from === id), "to"), in: collapse(flows.filter((f) => f.to === id), "from") };
  };

  const activeId = journey ? null : hovered ?? selected[mode];
  const active = activeId ? byId.get(activeId) ?? null : null;
  const pinned = !journey && selected[mode] ? byId.get(selected[mode]!) ?? null : null;

  const relState = new Map<string, Rel>();
  if (active) {
    const r = relationsOf(active.id);
    for (const o of r.out) relState.set(o.id, "uses");
    for (const i of r.in) relState.set(i.id, relState.get(i.id) === "uses" ? "both" : "usedBy");
  }

  const q = journey ? "" : query.trim().toLowerCase();
  const matches = (m: MapModule) =>
    !q || m.id.includes(q) || (m.name ?? "").toLowerCase().includes(q) || (m.repository ?? "").includes(q) || (m.description ?? "").toLowerCase().includes(q);
  const visible = (m: MapModule) => journey !== null || owner === "all" || m.owner === owner;
  const journeyModules = new Set(journey?.steps.flatMap((st) => st.modules) ?? []);

  const chipState = (m: MapModule): string => {
    if (!visible(m)) return "hidden";
    if (journey && step) return step.modules.includes(m.id) ? "selected" : journeyModules.has(m.id) ? "path" : "dim";
    if (q) return matches(m) ? (active?.id === m.id ? "selected" : "normal") : "dim";
    if (!active) return "normal";
    if (m.id === active.id) return "selected";
    return relState.get(m.id) ?? "dim";
  };

  // ── Edge geometry, measured from the DOM (desktop only; the CSS hides the layer on narrow screens) ──
  const boardRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const bandRefs = useRef(new Map<RoleId, HTMLDivElement>());
  const [geometry, setGeometry] = useState<{ w: number; h: number; paths: { d: string; warn: boolean; dashed: boolean; role: RoleId }[] }>({ w: 0, h: 0, paths: [] });
  const [layoutTick, setLayoutTick] = useState(0);

  const edges: Edge[] = (() => {
    if (step) return step.links.map((l) => ({ from: l.from, to: l.to, warn: false, dashed: isAsync(l.kind) }));
    if (!active || q) return [];
    const r = relationsOf(active.id);
    return [
      ...r.out.map((o) => ({ from: active.id, to: o.id, warn: o.warn, dashed: o.dashed })),
      ...r.in.map((i) => ({ from: i.id, to: active.id, warn: i.warn, dashed: i.dashed })),
    ].filter((e) => visible(byId.get(e.from)!) && visible(byId.get(e.to)!));
  })();
  // The geometry is measured again when the set of edges changes (compared by value: the list is rebuilt each render).
  const edgesKey = edges.map((e) => `${e.from}>${e.to}:${e.warn ? 1 : 0}${e.dashed ? 1 : 0}`).join("|");

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const ro = new ResizeObserver(() => setLayoutTick((n) => n + 1));
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const origin = board.getBoundingClientRect();
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
    };
    const bandOf = (id: string) => bandRefs.current.get(byId.get(id)!.role);
    const paths = edges.flatMap((e) => {
      const a = chipRefs.current.get(e.from), b = chipRefs.current.get(e.to);
      const ba = bandOf(e.from), bb = bandOf(e.to);
      if (!a || !b || !ba || !bb || !a.offsetParent || !b.offsetParent) return [];
      const A = rect(a), B = rect(b), BA = rect(ba), BB = rect(bb);
      const ax = A.x + A.w / 2, bx = B.x + B.w / 2;
      let pts: [number, number][];
      if (BB.y > BA.y) {
        // Down: leave A by its bottom, run along the gutter under A's band, drop into B from above.
        const g = BA.y + BA.h + 11;
        pts = [[ax, A.y + A.h], [ax, g], [bx, g], [bx, B.y]];
      } else if (BB.y < BA.y) {
        const g = BA.y - 11;
        pts = [[ax, A.y], [ax, g], [bx, g], [bx, B.y + B.h]];
      } else {
        const g = BA.y + BA.h + 11;
        pts = [[ax, A.y + A.h], [ax, g], [bx, g], [bx, B.y + B.h]];
      }
      if (Math.abs(ax - bx) < 1) pts = [pts[0], pts[pts.length - 1]];
      return [{ d: roundedPath(pts), warn: e.warn, dashed: e.dashed, role: byId.get(e.to)!.role }];
    });
    const r = board.getBoundingClientRect();
    setGeometry({ w: r.width, h: r.height, paths });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `edges` is read through `edgesKey`, its value
  }, [edgesKey, layoutTick, byId, view, owner, stepIndex]);

  // Escape clears the selection.
  useEffect(() => {
    if (journey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected((cur) => ({ ...cur, [mode]: null }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, journey]);

  const select = (id: string) => {
    if (journey) {
      const at = journey.steps.findIndex((st) => st.modules.includes(id));
      if (at >= 0) setStepIndex(at);
      return;
    }
    setSelected((cur) => ({ ...cur, [mode]: cur[mode] === id ? null : id }));
  };
  const jump = (id: string) => {
    setSelected((cur) => ({ ...cur, [mode]: id }));
    chipRefs.current.get(id)?.focus({ preventScroll: false });
  };

  const pinnedRel = pinned ? relationsOf(pinned.id) : null;
  const announce = journey && step
    ? format(text.journey.announce, { n: stepIndex + 1, title: step.title })
    : pinned && pinnedRel
      ? mode === "build"
        ? format(text.announce.build, { module: pinned.id, uses: pinnedRel.out.length, usedBy: pinnedRel.in.length })
        : format(text.announce.runtime, { module: pinned.id, calls: pinnedRel.out.length, calledBy: pinnedRel.in.length })
      : "";

  const relTag = (state: string | undefined) =>
    state === "uses" ? (mode === "build" ? text.rel.uses : text.rel.calls)
    : state === "usedBy" ? (mode === "build" ? text.rel.usedBy : text.rel.calledBy)
    : state === "both" ? text.rel.both
    : null;

  // Legend: what the lines of this view mean, from what the data actually holds.
  const legend = (() => {
    if (!journey && mode === "build") {
      return [
        { swatch: s.swatchLine, label: text.legend.dependency },
        ...(data.dependencies.some((d) => d.outward) ? [{ swatch: s.swatchDash, label: text.legend.outward }] : []),
        ...(data.dependencies.some((d) => d.dashed && !d.outward) ? [{ swatch: s.swatchAmqp, label: text.legend.indirect }] : []),
      ];
    }
    const kinds = [...new Set((journey ? journey.steps.flatMap((st) => st.links.map((l) => l.kind)) : data.flows.map((f) => f.kind)))];
    const sync = kinds.filter((k) => !isAsync(k)), events = kinds.filter(isAsync);
    return [
      ...(sync.length ? [{ swatch: s.swatchLine, label: format(text.legend.sync, { kinds: sync.map((k) => kindText[k]).join(" · ") }) }] : []),
      ...(events.length ? [{ swatch: s.swatchAmqp, label: format(text.legend.async, { kinds: events.map((k) => kindText[k]).join(" · ") }) }] : []),
    ];
  })();

  const hint =
    view === "journey" ? text.hint.journey
    : view === "runtime" ? text.hint.runtime
    : data.product === "java" ? text.hint.buildJava
    : data.product === "orochia" ? text.hint.buildOrochia
    : text.hint.build;

  const board = (
    <div ref={boardRef} className={s.board} onMouseLeave={() => setHovered(null)}>
      <svg className={s.edges} width={geometry.w} height={geometry.h} aria-hidden="true">
        <defs>
          <marker id={`dg-arrow-${data.product}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,1 L9,5 L0,9 z" fill="context-stroke" />
          </marker>
        </defs>
        {geometry.paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            className={cn(s[`g-${p.role}`], journey && s.journeyEdge)}
            stroke={p.warn ? "var(--dg-warn)" : "var(--g)"}
            strokeWidth={journey ? 2 : 1.6}
            strokeDasharray={p.warn || p.dashed ? "5 5" : undefined}
            strokeLinecap="round"
            markerEnd={`url(#dg-arrow-${data.product})`}
            opacity={0.9}
          />
        ))}
      </svg>

      {roles.map((role) => {
        const mods = data.modules.filter((m) => m.role === role);
        const shown = mods.filter(visible);
        const Icon = ROLE_ICON[role];
        return (
          <Fragment key={role}>
            <div className={cn(s.band, s[`g-${role}`])} ref={(el) => { if (el) bandRefs.current.set(role, el); else bandRefs.current.delete(role); }}>
              <div className={s.bandHead}>
                <span className={s.bandIcon}><Icon size={17} /></span>
                <div>
                  <h3 className={s.bandTitle}>
                    {roleText[role].title}
                    <span>{shown.length}</span>
                  </h3>
                  {!compact && <p className={s.bandSub}>{roleText[role].summary}</p>}
                </div>
              </div>
              <div className={s.chips}>
                {shown.length === 0 && <span className={s.none}>{text.empty}</span>}
                {mods.map((m) => {
                  const state = chipState(m);
                  const stepNo = journey && state === "selected" ? stepIndex + 1 : null;
                  const tag = !journey && state !== "selected" && state !== "dim" ? relTag(relState.get(m.id)) : null;
                  const warnTag = active && mode === "build" && data.dependencies.some((d) => d.outward && ((d.from === active.id && d.to === m.id) || (d.to === active.id && d.from === m.id)));
                  return (
                    <button
                      key={m.id}
                      type="button"
                      ref={(el) => { if (el) chipRefs.current.set(m.id, el); else chipRefs.current.delete(m.id); }}
                      className={cn(s.chip, s[`g-${m.role}`])}
                      data-state={state}
                      aria-pressed={journey ? state === "selected" : selected[mode] === m.id}
                      onClick={() => select(m.id)}
                      onMouseEnter={() => !journey && setHovered(m.id)}
                      onFocus={() => setHovered(null)}
                    >
                      <span className={s.chipName}>{m.id}</span>
                      <span className={s.chipMeta}>
                        <span>{ownerText[m.owner]}</span>
                        {m.badge && <b>{m.badge}</b>}
                        {m.central && m.central !== m.badge && <span>{format(text.detail.central, { version: m.central })}</span>}
                        {!["jvm", "library", "saas", "pom"].includes(m.runtime) && <span>{m.runtime}</span>}
                      </span>
                      {tag && <span className={s.relTag} data-warn={warnTag ? "true" : undefined}>{tag}</span>}
                      {stepNo && <span className={s.relTag}>{String(stepNo).padStart(2, "0")}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {pinned && pinned.role === role && visible(pinned) && pinnedRel && (
              <Detail module={pinned} roleTitle={roleText[pinned.role].title} rel={pinnedRel} mode={mode} byId={byId} onJump={jump} onClose={() => setSelected((cur) => ({ ...cur, [mode]: null }))} />
            )}
          </Fragment>
        );
      })}
    </div>
  );

  return (
    <section className={s.root} aria-label={(text.label as Record<string, string>)[data.product]}>
      {/* ── Toolbar ── */}
      <div className={s.toolbar}>
        {view !== "journey" && (
          <div className={s.search}>
            <SearchIcon size={16} />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text.search} aria-label={text.searchLabel} />
          </div>
        )}
        {views.length > 1 && (
          <div className={s.segmented} role="group" aria-label={text.modeLabel}>
            {views.map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => { setView(v); setHovered(null); }}>
                {text.modes[v]}
              </button>
            ))}
          </div>
        )}
        {view === "journey" && journeys.length > 1 && (
          <div className={s.segmented} role="group" aria-label={text.journey.label}>
            {journeys.map((j) => (
              <button key={j.id} type="button" aria-pressed={journeyId === j.id} onClick={() => { setJourneyId(j.id); setStepIndex(0); }}>
                {j.name}
              </button>
            ))}
          </div>
        )}
        {view !== "journey" && owners.length > 1 && (
          <div className={s.segmented} role="group" aria-label={text.ownerLabel}>
            {(["all", ...owners] as OwnerFilter[]).map((o) => (
              <button key={o} type="button" aria-pressed={owner === o} onClick={() => setOwner(o)}>
                {ownerText[o]}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className={s.hint}>{hint}</p>
      {legend.length > 0 && (
        <ul className={s.legend} aria-hidden="true">
          {legend.map((l) => (
            <li key={l.label}><span className={l.swatch} /> {l.label}</li>
          ))}
        </ul>
      )}
      <p aria-live="polite" className={s.srOnly}>{announce}</p>

      {journey ? (
        <div className={s.journeyLayout}>
          {board}
          <JourneyPanel journey={journey} index={Math.min(stepIndex, journey.steps.length - 1)} onIndex={setStepIndex} />
        </div>
      ) : (
        board
      )}

      {/* ── Text version: every module, every relation, every journey ── */}
      <details className={s.textVersion}>
        <summary>{t.diagrams.textVersion} — {format(text.count, { count: data.modules.length })}</summary>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption className={s.caption}>{text.table.modulesCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{text.table.module}</th>
                <th scope="col">{text.table.role}</th>
                <th scope="col">{text.table.repository}</th>
                <th scope="col">{text.table.version}</th>
                <th scope="col">{text.table.dependsOn}</th>
                <th scope="col">{text.table.usedBy}</th>
              </tr>
            </thead>
            <tbody>
              {data.modules.map((m) => (
                <tr key={m.id}>
                  <th scope="row"><code>{m.id}</code></th>
                  <td>{roleText[m.role].title}</td>
                  <td>{m.repository ? <code>{m.repository}</code> : ownerText[m.owner]}</td>
                  <td>{m.version ?? "—"}{m.central && m.central !== m.version ? ` (${format(text.detail.central, { version: m.central })})` : ""}</td>
                  <td>{data.dependencies.filter((d) => d.from === m.id).map((d) => (d.via ? `${d.to} (${d.via})` : d.to)).join(", ") || "—"}</td>
                  <td>{data.dependencies.filter((d) => d.to === m.id).map((d) => d.from).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.flows.length > 0 && (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className={s.caption}>{text.table.flowsCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{text.table.from}</th>
                  <th scope="col">{text.table.to}</th>
                  <th scope="col">{text.table.kind}</th>
                  <th scope="col">{text.table.via}</th>
                </tr>
              </thead>
              <tbody>
                {data.flows.map((f, i) => (
                  <tr key={i}>
                    <td><code>{f.from}</code></td>
                    <td><code>{f.to}</code></td>
                    <td>{kindText[f.kind]}</td>
                    <td><code>{f.via}</code>{f.routingKey ? <> · <code>{f.routingKey}</code></> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {journeys.map((j) => (
          <div key={j.id} className={s.tableWrap}>
            <p className={s.caption}>{text.journey.label} — {j.name}</p>
            <ol className={s.textSteps}>
              {j.steps.map((st, i) => (
                <li key={i}>
                  <strong>{st.title}</strong> — {st.detail}
                  {st.links.length > 0 && <> ({st.links.map((l) => `${l.from} → ${l.to}`).join(", ")})</>}
                  {st.endpoint && <> · <code>{st.endpoint}</code></>}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </details>
    </section>
  );
}

/** The numbered steps of a journey, beside the map (under it on narrow screens). */
function JourneyPanel({ journey, index, onIndex }: { journey: Journey; index: number; onIndex: (i: number) => void }) {
  const { t } = useI18n();
  const text = t.diagrams.moduleMap.journey;
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => true);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = journey.steps.length - 1;

  // Off screen, the loop waits.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && !reduce && !held && onScreen;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => onIndex(index >= last ? 0 : index + 1), STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, index, last, onIndex]);

  const go = (i: number, focus = false) => {
    const next = Math.max(0, Math.min(last, i));
    onIndex(next);
    if (focus) itemRefs.current[next]?.focus();
  };
  const onKey = (e: ReactKeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: last };
    if (e.key in keys) {
      e.preventDefault();
      setPlaying(false);
      go(keys[e.key], true);
    }
  };

  return (
    <div
      ref={rootRef}
      className={s.journey}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}
    >
      <div className={s.journeyHead}>
        <h3 className={s.journeyName}>{journey.name}</h3>
        <p className={s.journeySummary}>{journey.summary}</p>
      </div>
      <div className={s.journeyControls}>
        <button type="button" className={s.linkButton} onClick={() => { setPlaying(false); go(index - 1); }} disabled={index === 0} aria-label={text.prev}>
          <BackIcon size={14} />
        </button>
        {!reduce && (
          <button type="button" className={s.linkButton} onClick={() => setPlaying((p) => !p)} aria-pressed={playing} aria-label={playing ? text.pause : text.play}>
            {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          </button>
        )}
        <button type="button" className={s.linkButton} onClick={() => { setPlaying(false); go(index + 1); }} disabled={index === last} aria-label={text.next}>
          <ChevronRightIcon size={14} />
        </button>
        <span className={s.journeyCount}>{format(text.step, { n: index + 1, total: journey.steps.length })}</span>
      </div>
      <ol className={s.journeySteps} aria-label={text.steps} onKeyDown={onKey}>
        {journey.steps.map((st, i) => (
          <li key={i}>
            <button
              type="button"
              ref={(el) => { itemRefs.current[i] = el; }}
              className={s.journeyStep}
              aria-current={i === index ? "step" : undefined}
              tabIndex={i === index ? 0 : -1}
              onClick={() => { setPlaying(false); go(i); }}
            >
              <span className={s.journeyNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.journeyBody}>
                <span className={s.journeyTitle}>{st.title}</span>
                {st.endpoint && <code className={s.journeyEndpoint}>{st.endpoint}</code>}
                <span className={s.journeyDetail}>{st.detail}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Detail({
  module: m,
  roleTitle,
  rel,
  mode,
  byId,
  onJump,
  onClose,
}: {
  module: MapModule;
  roleTitle: string;
  rel: { out: Relation[]; in: Relation[] };
  mode: Mode;
  byId: Map<string, MapModule>;
  onJump: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const text = t.diagrams.moduleMap;
  const ownerText = t.diagrams.owners as Record<string, string>;
  const warns = [...rel.out.filter((o) => o.warn).map((o) => [m.id, o.id]), ...rel.in.filter((i) => i.warn).map((i) => [i.id, m.id])];
  const list = (items: Relation[]) =>
    items.length ? (
      <ul className={s.relList}>
        {items.map((it) => (
          <li key={it.id}>
            <button type="button" className={cn(s.linkButton, s[`g-${byId.get(it.id)?.role ?? "contract"}`])} onClick={() => onJump(it.id)}>
              <i aria-hidden="true" />
              {it.id}
              {it.via && <small>{it.via}</small>}
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <span className={s.none}>{text.detail.none}</span>
    );
  return (
    <div className={cn(s.detail, s[`g-${m.role}`])} role="region" aria-label={m.id}>
      <div>
        <div className={s.detailHead}>
          <div style={{ minWidth: 0 }}>
            <h4 className={s.detailTitle}>{m.id}</h4>
            <p className={s.detailRole}>{roleTitle} · {ownerText[m.owner]}</p>
          </div>
          <button type="button" className={s.linkButton} onClick={onClose} aria-label={text.detail.close} style={{ alignSelf: "flex-start" }}>
            <CloseIcon size={14} />
          </button>
        </div>
        {m.description && <p className={s.detailText}>{m.description}</p>}
        <ul className={s.facts}>
          {m.repository && m.repositoryUrl && (
            <li>
              {text.detail.repository}{" "}
              <a href={m.repositoryUrl} target="_blank" rel="noreferrer">{m.repository}</a>
            </li>
          )}
          {m.name && <li>{format(text.detail.package, { name: m.name })}</li>}
          {m.version && <li>{format(text.detail.version, { version: m.version })}</li>}
          {m.central && <li>{format(text.detail.central, { version: m.central })}</li>}
          {(m.inboundPorts > 0 || m.outboundPorts > 0) && <li>{format(text.detail.ports, { inbound: m.inboundPorts, outbound: m.outboundPorts })}</li>}
        </ul>
        {warns.map(([from, to]) => (
          <p key={`${from}-${to}`} className={s.warnNote} style={{ marginTop: 10 }}>{format(text.detail.outward, { from, to })}</p>
        ))}
      </div>
      <div className={s.relations}>
        <div>
          <h4>{mode === "build" ? text.detail.uses : text.detail.calls}</h4>
          {list(rel.out)}
        </div>
        <div>
          <h4>{mode === "build" ? text.detail.usedBy : text.detail.calledBy}</h4>
          {list(rel.in)}
        </div>
      </div>
    </div>
  );
}
