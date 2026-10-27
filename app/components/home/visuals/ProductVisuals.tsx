"use client";

/* The live plates of the products' field-guide entries (Cahier, krizaka-ui ADR-004, #417): each one SHOWS what the product
   does, made of @krizaka/ui's own components, with demo data said as such (messages → site.home.visuals). Decorative:
   the wrapper (ProductVisual) is `inert` and hidden from assistive technology — the entry's caption and tag say the same
   in words. Each one is still at rest (its final frame); it moves only while `playing` (on screen), never under reduced
   motion. Timers run only while playing; no animation frame, no canvas. This module is loaded only when the first entry
   comes near the viewport (next/dynamic). */

import { useEffect, useState, type ReactNode } from "react";
import { Chip } from "@krizaka/ui/chip";
import { CheckIcon } from "@krizaka/icons";
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
  // The lease and its finding, as the app shows them (dev.yomizaka.com, 2026-10-26): « The lease » — its lines, the passage
  // underlined — an arrow, then « The finding »: the rule broken, a badge, the quoted passage, the article of law. While
  // playing, the pen reads the lines one by one and the finding lands last; at rest, everything is read.
  const v = useI18n().t.site.home.visuals.yomizaka;
  const step = useStep(playing, 5, 800, 4);
  return (
    <div className="pv-lease" data-step={step}>
      <p className="pv-label">{v.document}</p>
      <p className="pv-lease-lines">
        <span data-read={step >= 1 ? "" : undefined}>{v.term}</span>
        <span data-read={step >= 2 ? "" : undefined}>{v.rent}</span>
        <span data-read={step >= 3 ? "" : undefined}>
          {v.before}
          <mark>{v.quote}</mark>
          {v.after}
        </span>
      </p>
      <p className="pv-lease-arrow" aria-hidden>
        ↓
      </p>
      <p className="pv-label">{v.finding}</p>
      <div className="pv-finding" data-found={step >= 4 ? "" : undefined}>
        <p className="pv-finding-title">{v.title}</p>
        <p className="pv-finding-meta">
          <span className="pv-badge">{v.badge}</span>
          <span>{v.demo}</span>
        </p>
        <p className="pv-finding-quote">{v.passage}</p>
        <p className="pv-finding-law">{v.law}</p>
      </div>
    </div>
  );
}

function Akinaza({ playing }: { playing: boolean }) {
  // What the storefront shows (dev.akinaza.com, a demo salon): a service card — name, minutes, what is included, the price —,
  // the day's free slots booked one by one, and the receipt of the chosen service with GST and QST to the cent.
  const { t, locale } = useI18n();
  const v = t.site.home.visuals.akinaza;
  const step = useStep(playing, AKINAZA_SLOTS.length, 1300, 1);
  const r = receipt(AKINAZA_PRICE);
  const money = new Intl.NumberFormat(`${locale}-CA`, { style: "currency", currency: "CAD" });
  return (
    <div className="pv-shop">
      <div className="pv-service">
        <p className="pv-service-name">{v.service}</p>
        <p className="pv-service-min">{v.minutes}</p>
        <ul>
          {v.includes.map((item) => (
            <li key={item}>
              <CheckIcon size={12} aria-hidden /> {item}
            </li>
          ))}
        </ul>
        <p className="pv-service-foot">
          <b>{money.format(AKINAZA_PRICE)}</b>
          <span>{v.choose} →</span>
        </p>
      </div>
      <div className="pv-shop-day">
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
