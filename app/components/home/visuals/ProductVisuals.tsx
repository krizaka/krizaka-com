"use client";

/* The live mini-visuals of the product cards (Oussama, 2026-10-17): each card SHOWS its field, made of @krizaka/ui's own
   components, with demo data said as such (messages → site.home.visuals). Decorative: the wrapper (ProductVisual) is
   `inert` and hidden from assistive technology — the card's text says the same in words.
   Each one is still at rest (its final frame); it moves only while `playing` (on screen, 2026-10-20: no hover needed),
   never under reduced motion. Timers run only while playing; no animation
   frame, no canvas. This module is loaded only when the first card comes near the viewport (next/dynamic). */

import { useEffect, useState, type ReactNode } from "react";
import { MessageBubble, TypingIndicator } from "@krizaka/ui/chat";
import { Chip } from "@krizaka/ui/chip";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Progress } from "@krizaka/ui/progress";
import { VerifiedBadge } from "@krizaka/ui/verified-badge";
import { Sparkline } from "@krizaka/charts/sparkline";
import type { ProductId } from "@/lib/products";
import { useI18n } from "../../I18nProvider";
import { KACHIZAKA_POINTS, AKINAZA_SLOTS, OROCHIA_RENDITIONS, YORORIS_PEAKS } from "@/lib/product-visuals";

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
  const v = useI18n().t.site.home.visuals.yomizaka;
  return (
    <div className="pv-doc" data-play={playing ? "" : undefined}>
      <p className="pv-doc-title">{v.document}</p>
      <p className="pv-doc-clause">{v.before}</p>
      <p className="pv-doc-passage">
        <mark>{v.quote}</mark>
      </p>
      <p className="pv-doc-clause">{v.after}</p>
      <p className="pv-doc-check">
        <VerifiedBadge label={v.checked} showLabel size="sm" /> <span>{v.source}</span>
      </p>
    </div>
  );
}

function Orochia({ playing }: { playing: boolean }) {
  // Upload → encode → stream, said with a progress bar and the renditions lighting one by one (no clip: Orochia's card
  // stays neutral, AGENTS §2).
  const v = useI18n().t.site.home.visuals.orochia;
  const step = useStep(playing, OROCHIA_RENDITIONS.length + 1, 900, OROCHIA_RENDITIONS.length);
  return (
    <div className="pv-media">
      <div className="pv-media-frame" aria-hidden>
        <span className="pv-media-play" />
      </div>
      <div className="pv-media-side">
        <Progress value={Math.round((step / OROCHIA_RENDITIONS.length) * 100)} label={v.encoding} size="sm" />
        <ul className="pv-media-renditions">
          {OROCHIA_RENDITIONS.map((r, i) => (
            <li key={r} data-on={i < step ? "" : undefined}>
              {r}
            </li>
          ))}
        </ul>
        <p className="pv-media-state">{step >= OROCHIA_RENDITIONS.length ? v.ready : v.encoding}</p>
      </div>
    </div>
  );
}

function Kachizaka({ playing }: { playing: boolean }) {
  const { t, locale } = useI18n();
  const v = t.site.home.visuals.kachizaka;
  const step = useStep(playing, KACHIZAKA_POINTS.length - 7, 1600, KACHIZAKA_POINTS.length - 8);
  const window8 = KACHIZAKA_POINTS.slice(step, step + 8);
  const total = window8.reduce((a, b) => a + b, 0);
  return (
    <div className="pv-live">
      <p className="pv-live-head">
        <span className="pv-live-dot" data-play={playing ? "" : undefined} /> {v.live}
      </p>
      <p className="pv-live-value">
        <NumberTicker value={total} locale={locale} trigger="change" duration={600} /> <span className="pv-live-unit">{v.points}</span>
      </p>
      <Sparkline data={window8} title={v.title} variant="area" height={44} />
    </div>
  );
}

function Akinaza({ playing }: { playing: boolean }) {
  const v = useI18n().t.site.home.visuals.akinaza;
  const step = useStep(playing, AKINAZA_SLOTS.length, 1300, 2);
  return (
    <div className="pv-day">
      <p className="pv-day-head">{v.day}</p>
      <Chip.Group type="single" value={AKINAZA_SLOTS[step]} label={v.day} size="sm" className="pv-day-slots">
        {AKINAZA_SLOTS.map((slot) => (
          <Chip key={slot} value={slot}>
            {slot}
          </Chip>
        ))}
      </Chip.Group>
      <p className="pv-day-booked">{v.booked}</p>
    </div>
  );
}

function Yasakia({ playing }: { playing: boolean }) {
  // Their message is always there (the box is never empty); then the other one types, then answers, and it holds.
  const v = useI18n().t.site.home.visuals.yasakia;
  const step = useStep(playing, 4, 1100, 3);
  return (
    <div className="pv-chat">
      <MessageBubble text={v.theirs} time="18:02" grouped="single" />
      {step === 1 ? <TypingIndicator label={v.typing} /> : null}
      {step >= 2 && <MessageBubble text={v.mine} time="18:03" mine grouped="single" />}
    </div>
  );
}

function Yororis({ playing }: { playing: boolean }) {
  // A voice's waveform (interim: drawn here until @krizaka/ui ships a decorative Waveform; AudioPlayer needs a sound).
  const v = useI18n().t.site.home.visuals.yororis;
  return (
    <div className="pv-voice" data-play={playing ? "" : undefined}>
      <ul className="pv-voice-bars">
        {YORORIS_PEAKS.map((p, i) => (
          <li key={i} style={{ height: `${Math.round(p * 100)}%`, animationDelay: `${(i % 7) * 0.11}s` }} />
        ))}
      </ul>
      <p className="pv-voice-label">{v.label}</p>
    </div>
  );
}

/** Orazaka's card draws the engine flow instead (@krizaka/ui/engine-flow, EngineFlowView). */
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
