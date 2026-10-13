"use client";

/* Yazakia's own composition: a batch of three ProfileCards, each with the reasons "why you two" (never a score), the
   countdown to the first intro and the debrief chips. The faces are Yazakia's (lib/people.json). The cards are
   krizaka-ui's ProfileCard until the people kit (#150: SwipeDeck, MatchDialog, TagSelect) is published. */

import { useState } from "react";
import { Avatar } from "@krizaka/ui/avatar";
import { Chip } from "@krizaka/ui/chip";
import { Countdown } from "@krizaka/ui/countdown";
import { ProfileCard } from "@krizaka/ui/profile-card";
import { HeartIcon } from "@krizaka/icons";
import { useI18n } from "../../I18nProvider";
import { KIT_YAZAKIA } from "@/lib/kit-live";
import { useTargetIn } from "./shared";

export default function YazakiaKit({ portraits }: { portraits: Record<string, string> }) {
  const { t } = useI18n();
  const k = t.site.home.build.kit.yazakia;
  const [debrief, setDebrief] = useState<string>("");
  const intro = useTargetIn(KIT_YAZAKIA.introInMs);

  return (
    <>
      <div className="bk-col kl-wide">
        <h4 className="kl-heading">{k.heading}</h4>
        <ul className="kl-matches">
          {KIT_YAZAKIA.matches.map((m) => {
            const text = k.matches[m.id];
            return (
              <li key={m.id} className="kl-match">
                <ProfileCard
                  visual={<Avatar src={portraits[`yazakia/${m.id}`]} alt="" fallback={text.name.slice(0, 1)} size="xl" />}
                  visualSize={88}
                  name={text.name}
                  nameAs="h4"
                  caption={text.caption}
                />
                <div className="kl-why">
                  <p className="kl-why-title"><HeartIcon size={14} aria-hidden /> {k.why}</p>
                  <ul>
                    {m.reasons.map((r) => (
                      <li key={r}>{text.reasons[r]}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bk-col kl-wide kl-after">
        <div className="bk-card kl-intro">
          <p className="bk-card-label">{k.intro.label}</p>
          {intro !== null ? <Countdown target={intro} units={k.intro.units} label={k.intro.countdown} showLabel={false} size="md" /> : <span className="kl-time-rest" aria-hidden />}
        </div>
        <div className="bk-card kl-debrief">
          <p className="bk-card-label">{k.debrief.label}</p>
          <Chip.Group type="single" label={k.debrief.label} value={debrief} onValueChange={setDebrief} size="sm" className="kl-chips">
            {KIT_YAZAKIA.debrief.map((id) => (
              <Chip key={id} value={id}>{k.debrief[id]}</Chip>
            ))}
          </Chip.Group>
        </div>
      </div>
    </>
  );
}
