"use client";

/* The live plates of the products' field-guide entries (Cahier, krizaka-ui ADR-004, #417): each one SHOWS what the product
   does, made of @krizaka/ui's own components, with demo data said as such (messages → site.home.visuals). Decorative:
   the wrapper (ProductVisual) is `inert` and hidden from assistive technology — the entry's caption and tag say the same
   in words. Each one is still at rest (its final frame); it moves only while `playing` (on screen), never under reduced
   motion. Timers run only while playing; no animation frame, no canvas. This module is loaded only when the first entry
   comes near the viewport (next/dynamic). */

import { useEffect, useState, type ReactNode } from "react";
import { MessageBubble, TypingIndicator } from "@krizaka/ui/chat";
import { Chip } from "@krizaka/ui/chip";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Progress } from "@krizaka/ui/progress";
import { Stamp } from "@krizaka/ui/specimen-tag";
import { Waveform } from "@krizaka/ui/waveform";
import type { ProductId } from "@/lib/products";
import { useI18n } from "../../I18nProvider";
import { AKINAZA_PRICE, AKINAZA_SLOTS, OROCHIA_RENDITIONS, receipt, standings, YORORIS_PEAKS } from "@/lib/product-visuals";

/** Steps a counter while `playing` (one timer, cleared at rest); at rest it shows `rest`. */
function useStep(playing: boolean, count: number, everyMs: number, rest: number): number {
  const [step, setStep] = useState(rest);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % count), everyMs);
    return () => window.clearInterval(id);
  }, [playing, count, everyMs]);
  return playing ? step : rest;
}

function Yomizaka({ playing }: { playing: boolean }) {
  // A lease on lined paper: the owl reads line by line (the pen moves down while playing), the clause to review is
  // marked and numbered in the margin, and its passage is quoted.
  const v = useI18n().t.site.home.visuals.yomizaka;
  const line = useStep(playing, 4, 900, 3);
  const lines = [v.before, v.quote, v.after];
  return (
    <div className="pv-lease" data-line={line}>
      <p className="pv-lease-title">{v.document}</p>
      <ol className="pv-lease-lines" start={4}>
        {lines.map((text, i) => (
          <li key={i} data-hit={i === 1 ? "" : undefined} data-read={i < line ? "" : undefined}>
            {i === 1 && <span className="pv-lease-n">1</span>}
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <p className="pv-lease-foot">
        <Stamp tone="construction">{v.review}</Stamp>
        <span>
          {v.line} 5 · {v.source}
        </span>
      </p>
    </div>
  );
}

function Orochia({ playing }: { playing: boolean }) {
  // Upload → encode → stream, the renditions written one by one as they are ready. No media: Orochia's entry stays
  // neutral on krizaka.com (AGENTS §2).
  const v = useI18n().t.site.home.visuals.orochia;
  const step = useStep(playing, OROCHIA_RENDITIONS.length + 1, 900, OROCHIA_RENDITIONS.length);
  const done = step >= OROCHIA_RENDITIONS.length;
  return (
    <div className="pv-encode">
      <ol className="pv-encode-steps">
        {v.steps.map((s, i) => (
          <li key={s} data-on={i === 0 || (i === 1 && step > 0) || (i === 2 && done) ? "" : undefined}>
            {s}
          </li>
        ))}
      </ol>
      <Progress value={Math.round((step / OROCHIA_RENDITIONS.length) * 100)} label={v.encoding} size="sm" />
      <ul className="pv-encode-ladder">
        {OROCHIA_RENDITIONS.map((r, i) => (
          <li key={r} data-on={i < step ? "" : undefined}>
            <span>{r}</span>
            <span className="pv-leader" />
            <span>{i < step ? "✓" : "…"}</span>
          </li>
        ))}
      </ul>
      <p className="pv-encode-state">{done ? <Stamp tone="ok">{v.ready}</Stamp> : v.encoding}</p>
    </div>
  );
}

function Kachizaka({ playing }: { playing: boolean }) {
  // The standings of a friends' league, a ledger: match day after match day the totals roll; points only.
  const { t, locale } = useI18n();
  const v = t.site.home.visuals.kachizaka;
  const day = useStep(playing, 8, 1400, 7) + 1;
  const points = standings(day);
  return (
    <div className="pv-score">
      <p className="pv-score-head">{v.league}</p>
      <ol className="pv-score-rows">
        {v.players.map((name, i) => (
          <li key={name}>
            <span className="pv-score-rank">{i + 1}</span>
            <span>{name}</span>
            <span className="pv-leader" />
            <span className="pv-score-value">
              <NumberTicker value={points[i]} locale={locale} trigger="change" duration={600} align="start" /> <span className="pv-score-unit">{v.points}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Akinaza({ playing }: { playing: boolean }) {
  // A salon's day booked slot by slot, and the receipt of the chosen service: GST and QST to the cent (lib/product-visuals).
  const { t, locale } = useI18n();
  const v = t.site.home.visuals.akinaza;
  const step = useStep(playing, AKINAZA_SLOTS.length, 1300, 1);
  const r = receipt(AKINAZA_PRICE);
  const money = new Intl.NumberFormat(`${locale}-CA`, { style: "currency", currency: "CAD" });
  return (
    <div className="pv-shop">
      <div>
        <p className="pv-shop-head">{v.day}</p>
        <Chip.Group type="single" value={AKINAZA_SLOTS[step]} label={v.day} size="sm" className="pv-shop-slots">
          {AKINAZA_SLOTS.map((slot) => (
            <Chip key={slot} value={slot}>
              {slot}
            </Chip>
          ))}
        </Chip.Group>
        <p className="pv-shop-booked">{v.booked}</p>
      </div>
      <dl className="pv-receipt">
        {[
          [v.service, r.price],
          [v.gst, r.gst],
          [v.qst, r.qst],
          [v.total, r.total],
        ].map(([label, amount]) => (
          <div key={String(label)}>
            <dt>{label}</dt>
            <dd>{money.format(Number(amount))}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Yasakia({ playing }: { playing: boolean }) {
  // Their message is always there; the other one types, then answers — and the agent's introduction is said above.
  const v = useI18n().t.site.home.visuals.yasakia;
  const step = useStep(playing, 4, 1100, 3);
  return (
    <div className="pv-chat">
      <p className="pv-chat-intro">
        <Stamp tone="ok">{v.intro}</Stamp>
      </p>
      <MessageBubble text={v.theirs} time="18:02" grouped="single" />
      {step === 1 ? <TypingIndicator label={v.typing} /> : null}
      {step >= 2 && <MessageBubble text={v.mine} time="18:03" mine grouped="single" />}
    </div>
  );
}

function Yororis({ playing }: { playing: boolean }) {
  // A voice, listened to: @krizaka/ui's Waveform, breathing while it plays.
  const v = useI18n().t.site.home.visuals.yororis;
  return (
    <div className="pv-voice">
      <Waveform peaks={YORORIS_PEAKS} bars={28} size="lg" playing={playing} />
      <p className="pv-voice-label">{v.label}</p>
    </div>
  );
}

/** Orazaka's entry draws the engine flow instead (@krizaka/ui/engine-flow, EngineFlowView). */
const VISUALS: Record<Exclude<ProductId, "orazaka">, (p: { playing: boolean }) => ReactNode> = {
  yomizaka: Yomizaka,
  orochia: Orochia,
  kachizaka: Kachizaka,
  akinaza: Akinaza,
  yasakia: Yasakia,
  yororis: Yororis,
};

export default function ProductVisuals({ id, playing }: { id: ProductId; playing: boolean }) {
  const Visual = id === "orazaka" ? undefined : VISUALS[id];
  return Visual ? <Visual playing={playing} /> : null;
}
