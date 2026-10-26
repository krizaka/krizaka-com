"use client";

/* The live plates of the products' field-guide entries (Cahier, krizaka-ui ADR-004, #417): each one SHOWS what the product
   does, made of @krizaka/ui's own components, with demo data said as such (messages → site.home.visuals). Decorative:
   the wrapper (ProductVisual) is `inert` and hidden from assistive technology — the entry's caption and tag say the same
   in words. Each one is still at rest (its final frame); it moves only while `playing` (on screen), never under reduced
   motion. Timers run only while playing; no animation frame, no canvas. This module is loaded only when the first entry
   comes near the viewport (next/dynamic). */

import { useEffect, useState, type ReactNode } from "react";
import { Chip } from "@krizaka/ui/chip";
import { Stamp } from "@krizaka/ui/specimen-tag";
import type { ProductId } from "@/lib/products";
import { useI18n } from "../../I18nProvider";
import { AKINAZA_PRICE, AKINAZA_SLOTS, receipt } from "@/lib/product-visuals";

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
        {/* @ephemeral: a decorative product visual, played by a timer, not a choice */}
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

/** Orazaka's entry draws the engine flow instead (@krizaka/ui/engine-flow, EngineFlowView). */
const VISUALS: Record<Exclude<ProductId, "orazaka">, (p: { playing: boolean }) => ReactNode> = {
  yomizaka: Yomizaka,
  akinaza: Akinaza,
};

export default function ProductVisuals({ id, playing }: { id: ProductId; playing: boolean }) {
  const Visual = id === "orazaka" ? undefined : VISUALS[id];
  return Visual ? <Visual playing={playing} /> : null;
}
