"use client";

/* The plates of the home's entries (founder, 2026-11-01, krizaka-internal#683: « show what the tool really does, as a modern,
   sober product moment »): each one is a small screen of the app, in the app's own language and its brand colour (the
   entry's `.brand-<id>`), made of @krizaka/ui pieces, and tells one moment, input then result:
   - the engine: a request goes in, the answer comes back;
   - the reader: a lease is read and the clause the law forbids is flagged, with its passage and its article;
   - the shop: a booking becomes a paid invoice, GST and QST to the cent.
   The subject is what the tool does for the person (founder rule, 2026-11-01); the model and the run id are a small
   caption under the result, never the subject — no dashboard, no « completed » badge, no run list.
   The product's name is read from lib/products.ts by the caller (`name`), never written here; the words are messages
   (site.home.visuals.<id>) and the demo data says it is demo. Decorative: the frame (ProductVisual) is `inert` and hidden
   from assistive technology, the entry's caption says the same in words. At rest and under reduced motion it shows its
   last step, the result in; it steps only while `playing` (on screen). One timer while playing, no animation frame, no
   canvas, nothing under the pointer. Loaded only when the entry comes near the viewport (next/dynamic). */

import { useEffect, useState, type ReactNode } from "react";
import { AiIcon, BillingIcon, CalendarIcon, KnowledgeIcon, LocalIcon, WarningIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { Badge } from "@krizaka/ui/badge";
import { format } from "@/lib/i18n";
import type { ProductId } from "@/lib/products";
import {
  AKINAZA_INVOICE,
  AKINAZA_PRICE,
  DEMO_RUNS,
  PLATE_REST,
  PLATE_STEP_MS,
  PLATE_STEPS,
  receipt,
} from "@/lib/product-visuals";
import { useI18n } from "../../I18nProvider";

/** The step of a plate: 0 the input alone, 1 the run under way, 2 the result in (held longest). At rest: PLATE_REST. */
function useStep(playing: boolean): number {
  const [step, setStep] = useState(PLATE_REST);
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % PLATE_STEPS), PLATE_STEP_MS[step]);
    return () => window.clearTimeout(id);
  }, [playing, step]);
  return playing ? step : PLATE_REST;
}

interface PlateProps {
  id: ProductId;
  name: string;
  playing: boolean;
}

/** The screen every plate shares: the app's bar (mark, name, « demo »), the input, the run, the result. */
function Screen({
  id,
  name,
  demo,
  step,
  input,
  running,
  caption,
  result,
}: Readonly<{
  id: ProductId;
  name: string;
  demo: string;
  step: number;
  input: ReactNode;
  running: string;
  caption: ReactNode;
  result: ReactNode;
}>) {
  return (
    <div className="pv-app" data-step={step}>
      <p className="pv-app-bar">
        <ProductLogo id={id} size={18} animated={false} />
        <span className="pv-app-name">{name}</span>
        <Badge size="sm">{demo}</Badge>
      </p>
      <div className="pv-in">{input}</div>
      <p className="pv-run" data-done={step >= 2 ? "" : undefined}>
        <span className="pv-run-track" aria-hidden>
          <span className="pv-run-bar" />
        </span>
        <span className="pv-run-label">{running}</span>
      </p>
      <div className="pv-out" data-in={step >= 2 ? "" : undefined}>
        {result}
        <p className="pv-caption">{caption}</p>
      </div>
    </div>
  );
}

function Orazaka({ id, name, playing }: PlateProps) {
  const v = useI18n().t.site.home.visuals.orazaka;
  const step = useStep(playing);
  const run = format(v.run, { run: DEMO_RUNS.orazaka });
  return (
    <Screen
      id={id}
      name={name}
      demo={v.demo}
      step={step}
      running={v.running}
      caption={
        <>
          <LocalIcon size={12} aria-hidden /> {v.model} · {run}
        </>
      }
      input={
        <p className="pv-prompt">
          <AiIcon size={14} aria-hidden />
          <span>
            <span className="pv-label">{v.promptLabel}</span> {v.prompt}
          </span>
        </p>
      }
      result={
        <>
          <ul className="pv-answer pv-points">
            {v.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </>
      }
    />
  );
}

function Yomizaka({ id, name, playing }: PlateProps) {
  const v = useI18n().t.site.home.visuals.yomizaka;
  const step = useStep(playing);
  return (
    <Screen
      id={id}
      name={name}
      demo={v.demo}
      step={step}
      running={v.running}
      caption={format(v.run, { run: DEMO_RUNS.yomizaka })}
      input={
        <p className="pv-file">
          <KnowledgeIcon size={16} aria-hidden />
          <span className="pv-file-name">{v.file}</span>
          <span className="pv-file-meta">{v.pages}</span>
        </p>
      }
      result={
        <div className="pv-finding">
          <p className="pv-finding-head">
            <WarningIcon size={14} aria-hidden />
            <span className="pv-finding-title">{v.title}</span>
            <Badge tone="danger" size="sm">
              {v.badge}
            </Badge>
          </p>
          <p className="pv-finding-detail">{v.detail}</p>
          <p className="pv-proof">
            <span className="pv-label">{v.proofLabel}</span>
            <q>{v.passage}</q>
            <span className="pv-meta">{v.where}</span>
          </p>
          <p className="pv-meta">{v.law}</p>
        </div>
      }
    />
  );
}

function Akinaza({ id, name, playing }: PlateProps) {
  const { t, locale } = useI18n();
  const v = t.site.home.visuals.akinaza;
  const step = useStep(playing);
  const r = receipt(AKINAZA_PRICE);
  const money = new Intl.NumberFormat(`${locale}-CA`, { style: "currency", currency: "CAD" });
  return (
    <Screen
      id={id}
      name={name}
      demo={v.demo}
      step={step}
      running={v.running}
      caption={format(v.run, { run: DEMO_RUNS.akinaza })}
      input={
        <p className="pv-booking">
          <CalendarIcon size={16} aria-hidden />
          <span>
            <span className="pv-booking-service">{v.service}</span>
            <span className="pv-meta">{v.when}</span>
          </span>
          <Badge tone="accent" size="sm">
            {v.confirmed}
          </Badge>
        </p>
      }
      result={
        <div className="pv-invoice">
          <p className="pv-invoice-head">
            <BillingIcon size={14} aria-hidden />
            <span className="pv-invoice-title">{format(v.invoice, { no: AKINAZA_INVOICE })}</span>
            <Badge tone="success" size="sm" dot>
              {v.paid}
            </Badge>
          </p>
          <dl className="pv-invoice-lines">
            {(
              [
                [v.service, r.price],
                [v.gst, r.gst],
                [v.qst, r.qst],
                [v.total, r.total],
              ] as const
            ).map(([label, amount]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{money.format(amount)}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    />
  );
}

const VISUALS: Record<ProductId, (p: PlateProps) => ReactNode> = {
  orazaka: Orazaka,
  yomizaka: Yomizaka,
  akinaza: Akinaza,
};

export default function ProductVisuals({ id, name, playing }: PlateProps) {
  const Visual = VISUALS[id];
  return <Visual id={id} name={name} playing={playing} />;
}
