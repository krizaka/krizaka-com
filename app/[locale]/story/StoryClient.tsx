"use client";

/* /story — why Krizaka, Orazaka and Orochia exist, told like the poster of a 1990s arcade fighting game.
   Hero: an arena in depth (the three clan lights crossing over a perspective floor, a few motes of light) under a
   display title, then the select screen — three fighter cards, the mark in relief, a gauge that fills; choosing one
   jumps to its stage. Stages 01–03: each bathes in its brand (SectionBackdrop `brand-<id>`), built and played
   identically — fighter card, stage call, the why, then the special move as a combo card called by the bird in the
   clan's corner. The boss: eight heads sealed one by one while its gauge drains. The flock. Bonus stage: everything
   is open. Continue? — a real CRT that carries the closing call.
   One strong entrance per section, then calm to read; reduced motion = a still, composed page. The motion and
   visual contract lives in app/components/story/ArcadeNods.tsx and story.css. */

import React from "react";
import { ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { cn } from "@krizaka/ui/cn";
import { contactHref } from "@/lib/contact";
import { useI18n } from "@/app/components/I18nProvider";
import Rich from "@/app/components/Rich";
import KrizakaLandscape from "@/app/components/illustrations/KrizakaLandscape";
import { BirdPortrait } from "@/app/components/story/Flock";
import { CHAPTERS, DUST, FLOCK, type ChapterId } from "@/lib/story";
import {
  ArcadeDirector,
  BossGauge,
  ClanSelect,
  ComboCard,
  ContinueScreen,
  FighterCard,
  StageCall,
} from "@/app/components/story/ArcadeNods";
import ButtonLink from "@/app/components/sections/ButtonLink";

/* One mark per size, the same for the three clans: the stages must read alike. */
const mark = (id: ChapterId, size: number) => <ProductLogo id={id} size={size} animated={false} />;

export default function StoryClient() {
  const { t, locale } = useI18n();
  const st = t.site.story;
  const stageLabel = (i: number) => `${st.arcade.stage} 0${i + 1}`;

  return (
    <ArcadeDirector>
      <SectionBackdrop as="header" className="st-hero brand-krizaka" grid data-arena>
        <div data-backdrop-layer aria-hidden className="st-halos">
          <span className="st-halo brand-krizaka" />
          <span className="st-halo brand-orazaka" />
          <span className="st-halo brand-orochia" />
        </div>
        <div data-backdrop-layer aria-hidden className="st-dust">
          {DUST.map(([x, y, s], i) => (
            <span key={i} className="st-mote an-loop" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, "--d": i } as React.CSSProperties} />
          ))}
        </div>

        <div data-backdrop-layer aria-hidden className="st-hero-fade" />

        <div className="st-hero-inner">
          <p className="st-eyebrow">
            <span className="st-eyebrow-rule" aria-hidden />
            {st.intro.eyebrow}
            <span className="st-eyebrow-rule" aria-hidden />
          </p>
          <h1 className="st-hero-title">
            <Rich text={st.intro.title} renderBold={(c) => <span className="st-hero-accent">{c}</span>} />
          </h1>
          <p className="st-lead">{st.intro.lead}</p>

          <ClanSelect
            aria={st.arcade.selectAria}
            locale={locale}
            prompt={st.arcade.selectPrompt}
            head={{ tag: st.arcade.teamTag, synergy: st.arcade.teamSynergy }}
            clans={CHAPTERS.map((ch, i) => ({
              id: ch.id,
              mark: mark(ch.id, 84),
              clanName: st.arcade.clanNames[ch.id],
              product: ch.name,
              tagline: st.arcade.clans[ch.id],
              stage: stageLabel(i),
              stat: { label: st.arcade.stats[ch.id], value: ch.stat },
            }))}
          />
        </div>
      </SectionBackdrop>

      {CHAPTERS.map((ch, i) => (
        <SectionBackdrop
          key={ch.id}
          className={cn("st-stage", "brand-" + ch.id)}
          dome={false}
          aria-labelledby={`st-${ch.id}`}
          data-arena
        >
          <span className="st-ghost" aria-hidden>
            0{i + 1}
          </span>
          <div className="st-chapter">
            <div className="st-mark">
              <FighterCard
                id={ch.id}
                mark={mark(ch.id, 120)}
                clanName={st.arcade.clanNames[ch.id]}
                roots={st.chapters[ch.id].roots}
                stat={{ label: st.arcade.stats[ch.id], value: ch.stat }}
                locale={locale}
              />
            </div>
            <div className="st-text">
              <StageCall stage={stageLabel(i)} name={ch.name} />
              <div className="an-reveal">
                <h2 id={`st-${ch.id}`} tabIndex={-1}>
                  {st.chapters[ch.id].title}
                </h2>
                {st.chapters[ch.id].body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ComboCard
                label={st.arcade.specialMove}
                move={st.chapters[ch.id].move}
                combo={ch.combo}
                bird={ch.bird}
                corner={st.arcade.corner}
                birdName={st.flock[ch.bird].name}
                birdRole={st.flock[ch.bird].role}
              />
            </div>
          </div>
        </SectionBackdrop>
      ))}

      <SectionBackdrop className="st-heads brand-orochia" direction="up" grid aria-label={st.headsAria} data-arena>
        <div className="st-boss-banner">
          <span className="st-boss-round an-boss-call" aria-hidden>
            {st.arcade.finalRound}
          </span>
          <h2 className="st-boss-title">{st.arcade.orochiBossTitle}</h2>
          <p className="st-boss-sub">{st.arcade.orochiBossSub}</p>
        </div>
        <BossGauge label={st.arcade.bossGauge} count={st.heads.length} />

        <ol className="st-heads-grid">
          {st.heads.map((h, i) => (
            <li key={h.head} className="st-head-card" style={{ "--i": i } as React.CSSProperties}>
              <div className="st-vat-header">
                <span className="st-vat text-fg-accent">
                  {st.arcade.vatLabel} 0{i + 1}
                </span>
                <span className="st-vat-tag an-vat-stamp">{st.arcade.sealedBadge}</span>
              </div>
              <span className="st-head">{h.head}</span>
              <span className="st-answer">{h.answer}</span>
            </li>
          ))}
        </ol>
      </SectionBackdrop>

      <section className="st-flock" aria-labelledby="st-flock" data-arena>
        <p className="st-num">04 · {st.flockLabel}</p>
        <h2 id="st-flock">{st.flockTitle}</h2>
        <p className="st-flock-lead">{st.flockLead}</p>
        <div className="st-birds">
          {FLOCK.map((id, i) => (
            <article key={id} className="st-bird an-bird-in" style={{ "--i": i } as React.CSSProperties}>
              <span className="st-bird-portrait">
                <BirdPortrait id={id} />
              </span>
              <h3>{st.flock[id].name}</h3>
              <p className="st-role">{st.flock[id].role}</p>
              <p>{st.flock[id].line}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Bonus stage: the proof. The packages and repositories themselves are listed on /open-source. */}
      <SectionBackdrop className="st-open brand-krizaka" dome={false} aria-labelledby="st-open" data-arena>
        <StageCall stage={`05 · ${st.open.label}`} name="Open source" />
        <div className="an-reveal">
          <h2 id="st-open">{st.open.title}</h2>
          {st.open.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ButtonLink href="/open-source" size="lg" className="st-open-cta">
            {st.open.cta} <ForwardIcon size={15} />
          </ButtonLink>
        </div>
      </SectionBackdrop>

      <section className="st-closing" aria-labelledby="st-closing">
        <ContinueScreen
          label={st.arcade.continue}
          insertCoin={st.arcade.insertCoin}
          coinEntry={st.arcade.coinEntry}
          creditLabel={st.arcade.creditLabel}
          cabinetLabel={st.arcade.cabinetLabel}
          playerStart={st.arcade.playerStart}
          restartBtn={st.arcade.restartBtn}
        >
          <h2 id="st-closing" className="an-crt-heading">
            {st.closing.title}
          </h2>
          <p className="an-crt-body">{st.closing.body}</p>
          <div className="an-crt-ctas">
            <ButtonLink href="/products" variant="primary" size="lg">
              {st.ctaProducts} <ForwardIcon size={15} />
            </ButtonLink>
            <ButtonLink href={contactHref("story")} size="lg">
              {st.ctaContact}
            </ButtonLink>
          </div>
        </ContinueScreen>
        <div className="st-landscape" aria-hidden>
          <KrizakaLandscape relative={false} />
        </div>
      </section>
    </ArcadeDirector>
  );
}
