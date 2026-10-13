"use client";

/* /story — bonus stage: how Orochia stays live (the bus, Server-Sent Events, LISTEN/NOTIFY, push). Told with the story
   kit of @krizaka/ui like every stage — the banner, the why, the path as an ordered list (the text version of the
   picture), measured figures, the special move carried by the pigeon (it delivers). Structure in lib/story-live.ts,
   words in site.story.live. */

import React from "react";
import { ForwardIcon } from "@krizaka/icons";
import { OrochiaLogo } from "@krizaka/ui";
import { Mascot } from "@krizaka/ui/mascots";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { PromiseCard } from "@krizaka/ui/promise-card";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { StageBanner } from "@krizaka/ui/stage-banner";
import Link from "next/link";
import { useI18n } from "@/app/components/I18nProvider";
import Rich from "@/app/components/Rich";
import { LIVE_BIRD, LIVE_FIGURES, LIVE_PATH } from "@/lib/story-live";

export default function LiveChapter({ birdName }: { birdName?: string }) {
  const { t, locale } = useI18n();
  const st = t.site.story;
  const w = st.live;

  return (
    <SectionBackdrop as="section" className="st-stage st-live brand-orochia" dome={false} aria-labelledby="st-live" data-kzs-scene="">
      <div className="st-live-inner">
        <StageBanner stage={w.label} name="Orochia" />
        <div data-kzs-reveal>
          <h2 id="st-live" tabIndex={-1}>
            {w.title}
          </h2>
          {w.body.map((line) => (
            <p key={line}>
              <Rich text={line} />
            </p>
          ))}
        </div>

        <div className="st-live-grid">
          <figure className="st-live-path" data-kzs-reveal style={{ "--kzs-delay": ".3s" } as React.CSSProperties}>
            <figcaption>
              <OrochiaLogo size={18} animated={false} />
              {w.pathTitle}
            </figcaption>
            <ol>
              {LIVE_PATH.map((id, i) => (
                <li key={id}>
                  <span className="st-live-step" aria-hidden>
                    {i + 1}
                  </span>
                  <span>
                    <strong>{w.path[id].title}</strong> <Rich text={w.path[id].body} />
                  </span>
                </li>
              ))}
            </ol>
          </figure>

          <div className="st-live-side" data-kzs-reveal style={{ "--kzs-delay": ".5s" } as React.CSSProperties}>
            <dl className="st-figures st-live-figures" aria-label={w.figuresAria}>
              {LIVE_FIGURES.map((f) => (
                <div key={f.id}>
                  <dt>{w.figures[f.id]}</dt>
                  <dd>
                    {f.id === "memory" ? "≈ " : ""}
                    <NumberTicker value={f.value} locale={locale} format={f.unit === "s" ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : undefined} />
                    <span className="st-live-unit"> {f.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="st-live-source">{w.source}</p>
            <PromiseCard
              label={st.arcade.specialMove}
              promise={w.move}
              keys={LIVE_BIRD.combo}
              bearer={<Mascot bird={LIVE_BIRD.bird} mood="success" size={48} animated={false} />}
              bearerLabel={st.arcade.corner}
              bearerName={birdName}
            />
            <p className="st-live-docs">
              <Link href="/docs/orochia/realtime" className="kz-link-strong">
                {w.docsRealtime} <ForwardIcon size={14} />
              </Link>
              <Link href="/docs/orochia/notifications" className="kz-link-strong">
                {w.docsPush} <ForwardIcon size={14} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </SectionBackdrop>
  );
}
