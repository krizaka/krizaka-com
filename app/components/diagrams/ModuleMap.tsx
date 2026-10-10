"use client";

/* ─────────────────────────────────────────────────────────────────────────
   MODULE MAP — the Orazaka hexagon, as the code builds it
   Every module of app/data/architecture.json in one band per role (clients
   outside, the domain core in the middle, contracts and the Krizaka kit
   underneath — AGENTS.md §2), labels in full, never truncated. Selecting a
   module isolates it: orthogonal lines to what it depends on and to what
   depends on it (or, in runtime mode, to whom it calls and who calls it).
   Lines are drawn under the chips, through the gutters between bands, and
   bundled at the selected module. Edges that point away from the core are
   dashed in warning colour: the map shows the code as it is.
   Mobile: one column, no lines — relations are listed in the detail panel.
   A11y: chips are buttons (aria-pressed), Escape clears, a live region
   names the selection, and the "Text version" holds every relation as tables.
   ───────────────────────────────────────────────────────────────────────── */

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AgentIcon, AiIcon, GlobeIcon, LinkIcon, LockIcon, PackIcon, SearchIcon, ServerIcon, CloseIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";
import type { MapModule, ModuleMapData, Owner, RoleId } from "@/lib/architecture-model";
import s from "./diagrams.module.css";

const ROLE_ICON: Record<RoleId, typeof AiIcon> = {
  client: GlobeIcon,
  service: ServerIcon,
  adapter: LinkIcon,
  application: AgentIcon,
  domain: AiIcon,
  contract: LockIcon,
  platform: PackIcon,
};

type Mode = "build" | "runtime";
type OwnerFilter = "all" | Owner;
type Rel = "uses" | "usedBy" | "both";
interface Edge {
  from: string;
  to: string;
  warn: boolean;
  dashed: boolean;
}

const RUNTIME_ROLES: RoleId[] = ["client", "service"];
const DEFAULT_SELECTION: Record<Mode, string> = { build: "orazaka-core", runtime: "orazaka-edge" };

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

export default function ModuleMap({ data, compact = false }: { data: ModuleMapData; compact?: boolean }) {
  const { t } = useI18n();
  const text = t.diagrams.moduleMap;
  const roleText = t.diagrams.roles;

  const [mode, setMode] = useState<Mode>("build");
  const [owner, setOwner] = useState<OwnerFilter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<Mode, string | null>>(DEFAULT_SELECTION);
  const [hovered, setHovered] = useState<string | null>(null);

  const byId = useMemo(() => new Map(data.modules.map((m) => [m.id, m])), [data.modules]);
  const roles = mode === "runtime" ? data.roles.filter((r) => RUNTIME_ROLES.includes(r)) : data.roles;

  // Relations of a module in the current mode.
  const relationsOf = useCallback(
    (id: string) => {
      if (mode === "build") {
        const uses = data.dependencies.filter((d) => d.from === id);
        const usedBy = data.dependencies.filter((d) => d.to === id);
        return {
          out: uses.map((d) => ({ id: d.to, warn: d.outward, via: null as string | null, dashed: false })),
          in: usedBy.map((d) => ({ id: d.from, warn: d.outward, via: null as string | null, dashed: false })),
        };
      }
      const calls = data.flows.filter((f) => f.from === id);
      const calledBy = data.flows.filter((f) => f.to === id);
      const collapse = (list: typeof calls, key: "from" | "to") => {
        const map = new Map<string, { id: string; warn: boolean; via: string; dashed: boolean }>();
        for (const f of list) {
          const other = f[key];
          const prev = map.get(other);
          const via = f.kind === "amqp" ? f.via : f.via;
          if (prev) {
            if (!prev.via.split(" · ").includes(via)) prev.via += ` · ${via}`;
            prev.dashed = prev.dashed && f.kind === "amqp";
          } else map.set(other, { id: other, warn: false, via, dashed: f.kind === "amqp" });
        }
        return [...map.values()];
      };
      return { out: collapse(calls, "to"), in: collapse(calledBy, "from") };
    },
    [mode, data.dependencies, data.flows],
  );

  const activeId = hovered ?? selected[mode];
  const active = activeId ? byId.get(activeId) ?? null : null;
  const pinned = selected[mode] ? byId.get(selected[mode]!) ?? null : null;

  const relState = useMemo(() => {
    const state = new Map<string, Rel>();
    if (!active) return state;
    const r = relationsOf(active.id);
    for (const o of r.out) state.set(o.id, "uses");
    for (const i of r.in) state.set(i.id, state.get(i.id) === "uses" ? "both" : "usedBy");
    return state;
  }, [active, relationsOf]);

  const q = query.trim().toLowerCase();
  const matches = (m: MapModule) =>
    !q || m.id.includes(q) || m.repository.includes(q) || (m.description ?? "").toLowerCase().includes(q);
  const visible = (m: MapModule) => owner === "all" || m.owner === owner;

  const chipState = (m: MapModule): string => {
    if (!visible(m)) return "hidden";
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

  const edges: Edge[] = useMemo(() => {
    if (!active || q) return [];
    const r = relationsOf(active.id);
    return [
      ...r.out.map((o) => ({ from: active.id, to: o.id, warn: o.warn, dashed: o.dashed })),
      ...r.in.map((i) => ({ from: i.id, to: active.id, warn: i.warn, dashed: i.dashed })),
    ].filter((e) => visible(byId.get(e.from)!) && visible(byId.get(e.to)!));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, q, relationsOf, owner, byId]);

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
      if (!a || !b || !ba || !bb) return [];
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
  }, [edges, layoutTick, byId, mode, owner]);

  // Escape clears the selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected((cur) => ({ ...cur, [mode]: null }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const select = (id: string) => setSelected((cur) => ({ ...cur, [mode]: cur[mode] === id ? null : id }));
  const jump = (id: string) => {
    setSelected((cur) => ({ ...cur, [mode]: id }));
    chipRefs.current.get(id)?.focus({ preventScroll: false });
  };

  const pinnedRel = pinned ? relationsOf(pinned.id) : null;
  const announce = pinned && pinnedRel
    ? mode === "build"
      ? format(text.announce.build, { module: pinned.id, uses: pinnedRel.out.length, usedBy: pinnedRel.in.length })
      : format(text.announce.runtime, { module: pinned.id, calls: pinnedRel.out.length, calledBy: pinnedRel.in.length })
    : "";

  const relTag = (state: string | undefined) =>
    state === "uses" ? (mode === "build" ? text.rel.uses : text.rel.calls)
    : state === "usedBy" ? (mode === "build" ? text.rel.usedBy : text.rel.calledBy)
    : state === "both" ? text.rel.both
    : null;

  return (
    <section className={s.root} aria-label={text.label}>
      {/* ── Toolbar ── */}
      <div className={s.toolbar}>
        <div className={s.search}>
          <SearchIcon size={16} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={text.search}
            aria-label={text.searchLabel}
          />
        </div>
        <div className={s.segmented} role="group" aria-label={text.modeLabel}>
          {(["build", "runtime"] as Mode[]).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); setHovered(null); }}>
              {text.modes[m]}
            </button>
          ))}
        </div>
        <div className={s.segmented} role="group" aria-label={text.ownerLabel}>
          {(["all", "orazaka", "krizaka"] as OwnerFilter[]).map((o) => (
            <button key={o} type="button" aria-pressed={owner === o} onClick={() => setOwner(o)}>
              {t.diagrams.owners[o]}
            </button>
          ))}
        </div>
      </div>
      <p className={s.hint}>{text.hint[mode]}</p>
      <ul className={s.legend} aria-hidden="true">
        {mode === "build" ? (
          <>
            <li><span className={s.swatchLine} /> {text.legend.dependency}</li>
            <li><span className={s.swatchDash} /> {text.legend.outward}</li>
          </>
        ) : (
          <>
            <li><span className={s.swatchLine} /> {text.legend.http}</li>
            <li><span className={s.swatchAmqp} /> {text.legend.amqp}</li>
          </>
        )}
      </ul>
      <p aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{announce}</p>

      {/* ── Board ── */}
      <div ref={boardRef} className={s.board} onMouseLeave={() => setHovered(null)}>
        <svg className={s.edges} width={geometry.w} height={geometry.h} aria-hidden="true">
          <defs>
            <marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="context-stroke" />
            </marker>
          </defs>
          {geometry.paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              className={s[`g-${p.role}`]}
              stroke={p.warn ? "var(--dg-warn)" : "var(--g)"}
              strokeWidth={1.6}
              strokeDasharray={p.warn || p.dashed ? "5 5" : undefined}
              strokeLinecap="round"
              markerEnd="url(#dg-arrow)"
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
              <div className={`${s.band} ${s[`g-${role}`]}`} ref={(el) => { if (el) bandRefs.current.set(role, el); else bandRefs.current.delete(role); }}>
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
                    const tag = state !== "selected" && state !== "dim" ? relTag(relState.get(m.id)) : null;
                    const warnTag = active && (data.dependencies.some((d) => mode === "build" && d.outward && ((d.from === active.id && d.to === m.id) || (d.to === active.id && d.from === m.id))));
                    return (
                      <button
                        key={m.id}
                        type="button"
                        ref={(el) => { if (el) chipRefs.current.set(m.id, el); else chipRefs.current.delete(m.id); }}
                        className={`${s.chip} ${s[`g-${m.role}`]}`}
                        data-state={state}
                        aria-pressed={selected[mode] === m.id}
                        onClick={() => select(m.id)}
                        onMouseEnter={() => setHovered(m.id)}
                        onFocus={() => setHovered(null)}
                      >
                        <span className={s.chipName}>{m.id}</span>
                        <span className={s.chipMeta}>
                          <span>{t.diagrams.owners[m.owner]}</span>
                          {m.owner === "krizaka" && m.version && <b>{m.version}</b>}
                          {m.runtime !== "jvm" && <span>{m.runtime}</span>}
                        </span>
                        {tag && <span className={s.relTag} data-warn={warnTag ? "true" : undefined}>{tag}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              {pinned && pinned.role === role && visible(pinned) && pinnedRel && (
                <Detail module={pinned} rel={pinnedRel} mode={mode} byId={byId} onJump={jump} onClose={() => setSelected((cur) => ({ ...cur, [mode]: null }))} />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* ── Text version: every module and every relation ── */}
      <details className={s.textVersion}>
        <summary>{t.diagrams.textVersion} — {format(text.count, { count: data.modules.length })}</summary>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0 8px" }}>{text.table.modulesCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{text.table.module}</th>
                <th scope="col">{text.table.role}</th>
                <th scope="col">{text.table.repository}</th>
                <th scope="col">{text.table.dependsOn}</th>
                <th scope="col">{text.table.usedBy}</th>
              </tr>
            </thead>
            <tbody>
              {data.modules.map((m) => (
                <tr key={m.id}>
                  <th scope="row"><code>{m.id}</code></th>
                  <td>{roleText[m.role].title}</td>
                  <td><code>{m.repository}</code></td>
                  <td>{data.dependencies.filter((d) => d.from === m.id).map((d) => d.to).join(", ") || "—"}</td>
                  <td>{data.dependencies.filter((d) => d.to === m.id).map((d) => d.from).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0 8px" }}>{text.table.flowsCaption}</caption>
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
                  <td>{text.kinds[f.kind]}</td>
                  <td><code>{f.via}</code>{f.routingKey ? <> · <code>{f.routingKey}</code></> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function Detail({
  module: m,
  rel,
  mode,
  byId,
  onJump,
  onClose,
}: {
  module: MapModule;
  rel: { out: { id: string; warn: boolean; via: string | null }[]; in: { id: string; warn: boolean; via: string | null }[] };
  mode: Mode;
  byId: Map<string, MapModule>;
  onJump: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const text = t.diagrams.moduleMap;
  const warns = [...rel.out.filter((o) => o.warn).map((o) => [m.id, o.id]), ...rel.in.filter((i) => i.warn).map((i) => [i.id, m.id])];
  const list = (items: { id: string; via: string | null }[]) =>
    items.length ? (
      <ul className={s.relList}>
        {items.map((it) => (
          <li key={it.id}>
            <button type="button" className={`${s.linkButton} ${s[`g-${byId.get(it.id)?.role ?? "contract"}`]}`} onClick={() => onJump(it.id)}>
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
    <div className={`${s.detail} ${s[`g-${m.role}`]}`} role="region" aria-label={m.id}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <h4 className={s.detailTitle}>{m.id}</h4>
            <p className={s.detailRole}>{t.diagrams.roles[m.role].title} · {t.diagrams.owners[m.owner]}</p>
          </div>
          <button type="button" className={s.linkButton} onClick={onClose} aria-label={text.detail.close} style={{ alignSelf: "flex-start" }}>
            <CloseIcon size={14} />
          </button>
        </div>
        {m.description && <p className={s.detailText}>{m.description}</p>}
        <ul className={s.facts}>
          <li>
            {text.detail.repository}{" "}
            <a href={m.repositoryUrl} target="_blank" rel="noreferrer">{m.repository}</a>
          </li>
          {m.version && <li>{format(text.detail.version, { version: m.version })}</li>}
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
