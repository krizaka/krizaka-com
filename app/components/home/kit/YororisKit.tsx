"use client";

/* Yororis's own composition: the moment screen (the crane mark as the presence, always marked "AI", the time left, a
   subtitles line), two self-reported 1-to-5 sliders (the person says it; nothing is inferred) and the "what I keep"
   card. Its words follow the Yororis lexicon (scripts/lexicon.mjs checks every key under `yororis`). */

import { useState } from "react";
import { Badge } from "@krizaka/ui/badge";
import { Countdown } from "@krizaka/ui/countdown";
import { Mascot } from "@krizaka/ui/mascots";
import { Slider } from "@krizaka/ui/slider";
import { BookmarkIcon } from "@krizaka/icons";
import { useI18n } from "../../I18nProvider";
import { KIT_YORORIS } from "@/lib/kit-live";
import { useTargetIn } from "./shared";


export default function YororisKit() {
  const { t } = useI18n();
  const k = t.site.home.build.kit.yororis;
  const y = KIT_YORORIS;
  const [before, setBefore] = useState<number>(y.mood.before);
  const [after, setAfter] = useState<number>(y.mood.after);
  const end = useTargetIn(y.leftMs);
  const marks = [{ value: y.mood.min, label: k.mood.marks.low }, { value: y.mood.max, label: k.mood.marks.high }];

  return (
    <>
      <div className="bk-col">
        <div className="bk-card kl-moment" role="group" aria-label={k.moment.label}>
          <div className="kl-presence">
            <Mascot bird="crane" mood="welcome" size={112} title={k.moment.markTitle} />
            <Badge className="kl-ai">{k.moment.ai}</Badge>
          </div>
          <p className="kl-title">{k.moment.presence}</p>
          <div className="kl-time">
            <span className="kl-muted">{k.moment.left}</span>
            {end !== null ? <Countdown target={end} units={k.moment.units} label={k.moment.left} showLabel={false} size="md" /> : <span className="kl-time-rest" aria-hidden />}
          </div>
          <p className="kl-subtitle" role="status">{k.moment.subtitle}</p>
          <p className="kl-muted">{k.moment.stops}</p>
        </div>
      </div>
      <div className="bk-col">
        <div className="bk-card kl-mood">
          <p className="bk-card-label">{k.mood.title}</p>
          <Slider label={k.mood.before} showLabel min={y.mood.min} max={y.mood.max} step={1} ticks marks={marks} value={before} onValueChange={setBefore} />
          <Slider label={k.mood.after} showLabel min={y.mood.min} max={y.mood.max} step={1} ticks marks={marks} value={after} onValueChange={setAfter} />
          <p className="kl-muted">{k.mood.caption}</p>
        </div>
        <div className="bk-card kl-keep">
          <p className="kl-receipt-title"><BookmarkIcon size={16} aria-hidden /> {k.keep.title}</p>
          <p className="kl-muted">{k.keep.lead}</p>
          <ol>
            <li>{k.keep.one}</li>
            <li>{k.keep.two}</li>
            <li>{k.keep.three}</li>
          </ol>
        </div>
      </div>
    </>
  );
}
