"use client";

/* Orochia's own composition: the creator's profile with her earnings in Canadian dollars, a live auction (countdown,
   current bid), the tip and unlock buttons, the challenge's GoalGauge and the ring of the stories. The faces are
   Orochia's (lib/people.json), resolved on the server and passed as `portraits`. */

import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { Countdown } from "@krizaka/ui/countdown";
import { GoalGauge } from "@krizaka/ui/goal-gauge";
import { ProfileCard } from "@krizaka/ui/profile-card";
import { Sparkline } from "@krizaka/charts/sparkline";
import { LockIcon, TipIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import { useI18n } from "../../I18nProvider";
import { KIT_OROCHIA, KIT_PORTRAITS } from "@/lib/kit-live";
import { money, useTargetIn } from "./shared";

export default function OrochiaKit({ portraits }: { portraits: Record<string, string> }) {
  const { t, locale } = useI18n();
  const k = t.site.home.build.kit.orochia;
  const o = KIT_OROCHIA;
  const end = useTargetIn(o.auction.endsInMs);
  const face = (id: string) => portraits[`orochia/${id}`];
  const month = o.earningsCents.reduce((sum, v) => sum + v, 0);
  const today = o.earningsCents[o.earningsCents.length - 1]!;

  return (
    <>
      <div className="bk-col">
        <ProfileCard
          visual={<Avatar src={face(KIT_PORTRAITS.orochia.creator)} alt="" fallback="EV" size="xl" />}
          visualSize={88}
          name={k.profile.name}
          nameAs="p"
          statLabel={k.profile.statLabel}
          value={80}
          stats={[
            { label: k.profile.challenges, value: o.challenges.met, max: o.challenges.of, valueText: format(k.profile.challengesValue, o.challenges) },
            { label: k.profile.replies, value: 94 },
          ]}
          caption={k.profile.caption}
        />
        <div className="bk-card bk-chart">
          <p className="bk-card-label">{k.earnings.title}</p>
          <p className="bk-figure">{money(month, locale, o.currency, 0)}</p>
          <Sparkline
            title={k.earnings.title}
            data={o.earningsCents}
            variant="area"
            trendTone
            width={260}
            height={48}
            format={{ style: "money", currency: o.currency }}
          />
          <p className="kl-line kl-muted">{format(k.earnings.total, { amount: money(today, locale, o.currency, 0) })}</p>
        </div>
        <div className="bk-card kl-stories" role="group" aria-label={k.stories.label}>
          <p className="bk-card-label">{k.stories.label}</p>
          <ul>
            {KIT_PORTRAITS.orochia.stories.map((id) => (
              <li key={id}>
                <span className="kl-ring" role="img" aria-label={format(k.stories.open, { name: k.stories[id] })}>
                  <Avatar src={face(id)} alt="" fallback={k.stories[id].slice(0, 1)} size="lg" />
                </span>
                <span>{k.stories[id]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bk-col">
        <div className="bk-card kl-auction">
          <p className="bk-card-label"><span className="kl-dot" aria-hidden /> {k.auction.label}</p>
          <p className="kl-title">{k.auction.item}</p>
          <div className="kl-bid">
            <div>
              <p className="kl-muted">{k.auction.bid}</p>
              <p className="bk-figure">{money(o.auction.currentBidCents, locale, o.currency)}</p>
            </div>
            <Avatar src={face(KIT_PORTRAITS.orochia.bidder)} alt="" fallback="AV" size="md" />
          </div>
          <p className="kl-muted">{format(k.auction.bidder, { name: k.auction.bidderName })}</p>
          <div className="kl-time">
            <span className="kl-muted">{k.auction.endsIn}</span>
            {end !== null ? <Countdown target={end} units={k.auction.units} label={k.auction.countdown} showLabel={false} size="md" /> : <span className="kl-time-rest" aria-hidden />}
          </div>
          <div className="kl-buttons">
            <Button variant="primary"><TipIcon size={14} aria-hidden /> {format(k.tip, { amount: money(o.tipCents, locale, o.currency, 0) })}</Button>
            <Button variant="secondary"><LockIcon size={14} aria-hidden /> {format(k.unlock, { amount: money(o.unlockCents, locale, o.currency, 0) })}</Button>
          </div>
        </div>
        <div className="bk-card kl-goal">
          <p className="bk-card-label">{k.challenge.label}</p>
          <GoalGauge
            label={k.challenge.gauge}
            segments={o.goal.segments}
            value={Math.round((o.goal.raisedCents / o.goal.targetCents) * o.goal.segments)}
            valueText={format(k.challenge.gaugeText, { raised: money(o.goal.raisedCents, locale, o.currency, 0), target: money(o.goal.targetCents, locale, o.currency, 0) })}
          />
        </div>
      </div>
    </>
  );
}
