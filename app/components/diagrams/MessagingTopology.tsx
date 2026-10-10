"use client";

/* ─────────────────────────────────────────────────────────────────────────
   MESSAGING TOPOLOGY — who talks to whom over RabbitMQ
   One card per exchange, read left to right: publishers → queues (with
   their bindings and dead-letter queue) → the services that drain them.
   Selecting a publisher lights the queues its routing keys reach (AMQP topic
   matching, `*` one word, `#` any). The kit's retry-then-DLQ policy sits on
   top, with its defaults read from krizaka-messaging. Data:
   app/data/architecture.json → messaging. Text version: the same as tables.
   ───────────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react";
import { ClockIcon, ForwardIcon, MessageIcon, WarningIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import { useI18n } from "@/app/components/I18nProvider";
import type { MessagingData } from "@/lib/architecture-model";
import s from "./diagrams.module.css";

/** AMQP topic matching: `*` is exactly one word, `#` zero or more; `{…}` (a runtime value) is one word. */
function topicMatches(binding: string, key: string): boolean {
  const b = binding.split("."), k = key.split(".");
  const go = (i: number, j: number): boolean => {
    if (i === b.length) return j === k.length;
    if (b[i] === "#") return go(i + 1, j) || (j < k.length && go(i, j + 1));
    if (j === k.length) return false;
    return (b[i] === "*" || b[i] === k[j] || k[j] === "{…}") && go(i + 1, j + 1);
  };
  return go(0, 0);
}

const exchangeKind = (name: string) => (name.endsWith(".jobs") ? "jobs" : name.endsWith(".dlx") ? "dlx" : "events");

export default function MessagingTopology({ data }: { data: MessagingData }) {
  const { t } = useI18n();
  const text = t.diagrams.messaging;
  const [selected, setSelected] = useState<string | null>(null); // `${module}|${exchange}`

  const capabilityKeys = useMemo(() => [...new Set(data.capabilityRoutes.map((r) => r.routingKey))], [data.capabilityRoutes]);
  const keysOf = (routingKey: string) => (routingKey === "(capability route)" ? capabilityKeys : routingKey === "(dynamic)" ? [] : [routingKey]);
  const keyLabel = (routingKey: string) =>
    routingKey === "(capability route)" ? text.capabilityRoute : routingKey === "(dynamic)" ? text.dynamicKey : routingKey;

  const reached = useMemo(() => {
    if (!selected) return null;
    const [module, exchange] = selected.split("|");
    const keys = data.producers.filter((p) => p.module === module && p.exchange === exchange).flatMap((p) => keysOf(p.routingKey));
    return new Set(data.queues.filter((q) => q.exchange === exchange && q.bindings.some((b) => keys.some((k) => topicMatches(b, k)))).map((q) => q.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data]);

  const r = data.retry;
  const busExchanges = data.exchanges.filter((e) => exchangeKind(e.name) !== "dlx");
  const dlx = data.exchanges.find((e) => exchangeKind(e.name) === "dlx");

  return (
    <section className={s.root} aria-label={text.label}>
      {/* ── Retry, then dead letter ── */}
      <div className={s.retry}>
        <strong>{text.retry.title}</strong>
        <span className={s.retryStep}><ForwardIcon size={13} /> {format(text.retry.attempts, { count: r.maxAttempts })}</span>
        <span aria-hidden="true">→</span>
        <span className={s.retryStep}><ClockIcon size={13} /> {format(text.retry.wait, { initial: r.initialMs, multiplier: r.multiplier, max: r.maxMs / 1000 })}</span>
        <span aria-hidden="true">→</span>
        <span className={s.retryStep} data-warn="true"><WarningIcon size={13} /> {dlx ? `${dlx.name} → ` : ""}{text.retry.parked}</span>
        <span style={{ flexBasis: "100%", fontSize: 12.5 }}>{format(text.retry.note, { module: r.module, property: r.property })}</span>
      </div>
      <p className={s.hint}>{text.hint}</p>

      {busExchanges.map((ex) => {
        const producers = [...new Set(data.producers.filter((p) => p.exchange === ex.name).map((p) => p.module))];
        const queues = data.queues.filter((q) => q.exchange === ex.name);
        return (
          <div key={ex.name} className={s.exchange}>
            <div className={s.exchangeHead}>
              <MessageIcon size={16} />
              <h4>{ex.name}</h4>
              <span className={s.badge}>{text.types[ex.type as keyof typeof text.types] ?? ex.type}</span>
              <p>{text.exchanges[exchangeKind(ex.name)]}</p>
            </div>
            <div className={s.col}>
              <p className={s.colTitle}>{text.cols.producers}</p>
              {producers.map((module) => {
                const id = `${module}|${ex.name}`;
                const keys = data.producers.filter((p) => p.module === module && p.exchange === ex.name).map((p) => p.routingKey);
                return (
                  <button
                    key={id}
                    type="button"
                    className={s.card}
                    aria-pressed={selected === id}
                    data-state={selected === id ? "on" : selected ? "dim" : undefined}
                    onClick={() => setSelected((cur) => (cur === id ? null : id))}
                  >
                    <span className={s.cardTitle}>{module}</span>
                    <span className={s.keys}>
                      {keys.map((k) => <span key={k} className={s.key}>{keyLabel(k)}</span>)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className={s.arrowCol} aria-hidden="true"><ForwardIcon size={18} /></div>
            <div className={s.col}>
              <p className={s.colTitle}>{text.cols.queues} → {text.cols.consumers}</p>
              {queues.map((q) => (
                <div key={q.name} className={s.queueRow}>
                  <div className={s.card} data-state={reached ? (reached.has(q.name) ? "on" : "dim") : undefined}>
                    <div className={s.cardTitle}>{q.name}</div>
                    <div className={s.keys}>{q.bindings.map((b) => <span key={b} className={s.key}>{b}</span>)}</div>
                    {q.dlq && <div className={s.dlq}><WarningIcon size={11} /> {format(text.dlq, { dlq: q.dlq })}</div>}
                  </div>
                  <span aria-hidden="true" style={{ color: "var(--kz-text-muted)" }}>→</span>
                  <div className={s.col} style={{ opacity: reached && !reached.has(q.name) ? 0.36 : 1 }}>
                    {q.consumers.map((c) => (
                      <span key={c.module} className={s.consumer}>
                        <i aria-hidden="true" />
                        {c.module}
                        {!c.kitRetry && <span className={s.badge}>{text.ownRetry}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <details className={s.textVersion}>
        <summary>{t.diagrams.textVersion} — {text.label}</summary>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0 8px" }}>{text.table.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{text.table.queue}</th>
                <th scope="col">{text.table.exchange}</th>
                <th scope="col">{text.table.bindings}</th>
                <th scope="col">{text.table.consumers}</th>
                <th scope="col">{text.table.dlq}</th>
              </tr>
            </thead>
            <tbody>
              {data.queues.map((q) => (
                <tr key={q.name}>
                  <th scope="row"><code>{q.name}</code></th>
                  <td><code>{q.exchange}</code></td>
                  <td>{q.bindings.map((b) => <code key={b} style={{ marginRight: 6 }}>{b}</code>)}</td>
                  <td>{q.consumers.map((c) => c.module).join(", ") || "—"}</td>
                  <td>{q.dlq ? <code>{q.dlq}</code> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0 8px" }}>{text.table.producersCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{text.table.module}</th>
                <th scope="col">{text.table.exchange}</th>
                <th scope="col">{text.table.routingKey}</th>
              </tr>
            </thead>
            <tbody>
              {data.producers.map((p, i) => (
                <tr key={i}>
                  <td><code>{p.module}</code></td>
                  <td><code>{p.exchange}</code></td>
                  <td>{keyLabel(p.routingKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0 8px" }}>{text.capabilities.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{text.capabilities.capability}</th>
                <th scope="col">{text.capabilities.handler}</th>
                <th scope="col">{text.capabilities.routingKey}</th>
              </tr>
            </thead>
            <tbody>
              {data.capabilityRoutes.map((c) => (
                <tr key={c.feature}>
                  <td><code>{c.feature}</code></td>
                  <td>{c.handler ? <code>{c.handler}</code> : "—"}</td>
                  <td><code>{c.routingKey}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
