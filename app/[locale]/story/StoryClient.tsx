"use client";

/* /story — why Krizaka, Orazaka and Orochia exist, told with the grammar of a 1990s arcade fighting game.
   Hero: the select screen (three clans lock in). Stages 01–03: one per brand, built identically — fighter card
   (brand mark, treasure, power gauge, roots) on the left; stage announcement, the why (origin · problem · answer) and
   the brand's special move (its promise) on the right — and played identically (card enters, impact, gauge fills,
   announcement, then text). The boss: eight heads sealed one by one while its gauge drains. The flock steps in.
   Bonus stage: everything is open (the list itself lives on /open-source). Continue? closes the page.
   Every section plays its entrance once; at most one slow, faint loop per section, never behind a paragraph;
   reduced motion = everything static. The motion contract lives in ArcadeNods. Tokens only: each clan section
   is scoped to its brand (`brand-<id>`), so its colours are its mark's. */

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/app/components/I18nProvider";
import KrizakaLandscape from "@/app/components/illustrations/KrizakaLandscape";
import { BirdPortrait, FlockStyles } from "@/app/components/story/Flock";
import { CHAPTERS, FLOCK, type ChapterId } from "@/lib/story";
import {
  ArcadeDirector,
  ArcadeStyles,
  BossGauge,
  ClanSelect,
  ContinuePrompt,
  FighterCard,
  StageCall,
} from "@/app/components/story/ArcadeNods";
import { ProductLogo } from "@krizaka/ui";

/* One size for the three marks, in the select screen and in the stages: the stages must read alike. */
const mark = (id: ChapterId, size: number) => <ProductLogo id={id} size={size} animated={false} />;

export default function StoryClient() {
  const { t } = useI18n();
  const st = t.site.story;

  return (
    <ArcadeDirector>
      <FlockStyles />
      <ArcadeStyles />

      <header className="st-hero">
        <p className="st-eyebrow">{st.intro.eyebrow}</p>
        <h1 className="st-hero-title">{st.intro.title}</h1>
        <p className="st-lead">{st.intro.lead}</p>

        <ClanSelect
          aria={st.arcade.selectAria}
          head={{ tag: st.arcade.teamTag, synergy: st.arcade.teamSynergy }}
          clans={CHAPTERS.map((ch) => ({
            id: ch.id,
            mark: mark(ch.id, 64),
            name: st.arcade.clanNames[ch.id],
            title: `${ch.name} · ${st.arcade.clans[ch.id]}`,
          }))}
        />
      </header>

      {CHAPTERS.map((ch, i) => (
        <section key={ch.id} className={`st-chapter brand-${ch.id}`} aria-labelledby={`st-${ch.id}`} data-arena>
          <div className="st-mark">
            <FighterCard
              id={ch.id}
              mark={mark(ch.id, 124)}
              clanName={st.arcade.clanNames[ch.id]}
              powerLabel={st.arcade.power}
              roots={st.chapters[ch.id].roots}
            />
          </div>
          <div className="st-text">
            <StageCall stage={`${st.arcade.stage} 0${i + 1}`} name={ch.name} />
            <div className="an-reveal">
              <h2 id={`st-${ch.id}`}>{st.chapters[ch.id].title}</h2>
              {st.chapters[ch.id].body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="st-move">
                <span className="st-move-label text-fg-accent">{st.arcade.specialMove}</span>
                <strong>{st.chapters[ch.id].move}</strong>
              </p>
            </div>
          </div>
        </section>
      ))}

      <section className="st-heads brand-orochia" aria-label={st.headsAria} data-arena>
        <div className="st-boss-banner" aria-hidden>
          <span className="st-boss-round an-boss-call text-fg-accent">{st.arcade.finalRound}</span>
          <span className="st-boss-title">{st.arcade.orochiBossTitle}</span>
          <span className="st-boss-sub">{st.arcade.orochiBossSub}</span>
        </div>
        <BossGauge label={st.arcade.bossGauge} count={st.heads.length} />

        <ol>
          {st.heads.map((h, i) => (
            <li key={h.head} className="st-head-card">
              <div className="st-vat-header">
                <span className="st-vat text-fg-accent">{st.arcade.vatLabel} 0{i + 1}</span>
                <span className="st-vat-tag an-vat-stamp" style={{ "--i": i } as React.CSSProperties}>{st.arcade.sealedBadge}</span>
              </div>
              <span className="st-head">{h.head}</span>
              <span className="st-answer">{h.answer}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="st-flock" aria-labelledby="st-flock" data-arena>
        <p className="st-num">04 · {st.flockLabel}</p>
        <h2 id="st-flock">{st.flockTitle}</h2>
        <p className="st-flock-lead">
          {st.flockLead}
        </p>
        <div className="st-birds">
          {FLOCK.map((id, i) => (
            <article key={id} className="st-bird an-bird-in" style={{ "--i": i } as React.CSSProperties}>
              <BirdPortrait id={id} />
              <h3>{st.flock[id].name}</h3>
              <p className="st-role">{st.flock[id].role}</p>
              <p>{st.flock[id].line}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Bonus stage: the proof. The packages and repositories themselves are listed on /open-source. */}
      <section className="st-open brand-krizaka" aria-labelledby="st-open" data-arena>
        <StageCall stage={`05 · ${st.open.label}`} name="Open source" />
        <div className="an-reveal">
          <h2 id="st-open">{st.open.title}</h2>
          {st.open.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link href="/open-source" className="st-btn">
            {st.open.cta} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="st-closing">
        <div className="st-closing-text">
          <h2>{st.closing.title}</h2>
          <p>{st.closing.body}</p>
          <div className="st-ctas">
            <Link href="/products" className="st-btn is-primary">
              {st.ctaProducts} <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="st-btn">
              {st.ctaContact}
            </Link>
          </div>
          <ContinuePrompt
            label={st.arcade.continue}
            insertCoin={st.arcade.insertCoin}
            coinEntry={st.arcade.coinEntry}
            creditLabel={st.arcade.creditLabel}
            cabinetLabel={st.arcade.cabinetLabel}
            playerStart={st.arcade.playerStart}
            restartBtn={st.arcade.restartBtn}
          />
        </div>
        <div className="st-landscape" aria-hidden>
          <KrizakaLandscape relative={false} />
        </div>
      </section>

      <style>{`
        .st { position: relative; color: var(--kz-text-primary); }
        .st > :is(header, section) { position: relative; z-index: 1; }
        .st-hero { max-width: 760px; margin: 0 auto; padding: clamp(128px, 16vw, 176px) 20px 56px; text-align: center; }
        .st-eyebrow, .st-num { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-accent-text); margin: 0; }
        
        .st-hero-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(2.1rem, 5.6vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -.035em;
          line-height: 1.08;
          margin: 18px 0 0;
          color: var(--kz-text-primary);
        }

        .st-lead { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.75; color: var(--kz-text-secondary); margin: 22px auto 28px; max-width: 640px; }

        /* The three stages share one grid, one card, one rhythm: card left, text right, same sizes and spacing. */
        .st-chapter { max-width: 64rem; margin: 0 auto; padding: 80px 20px; display: grid; grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
          gap: clamp(32px, 6vw, 72px); align-items: center; border-top: 1px solid var(--kz-border-subtle); }
        @media (max-width: 760px) { .st-chapter { grid-template-columns: 1fr; padding: 64px 20px; text-align: center; } }
        .st-mark { display: flex; justify-content: center; }
        .st-text h2, .st-flock h2, .st-open h2, .st-closing h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.6rem, 3.6vw, 2.3rem); font-weight: 800; letter-spacing: -.025em; line-height: 1.15; margin: 18px 0 18px; }
        .st-text p:not(.st-num) { font-size: 16px; line-height: 1.8; color: var(--kz-text-secondary); margin: 0 0 14px; }

        .st-heads { position: relative; max-width: 64rem; margin: 0 auto; padding: 72px 20px 96px; border-top: 1px solid var(--kz-border-subtle); }
        .st-boss-banner { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; }
        .st-boss-round { display: inline-block; font-family: var(--font-mono); font-size: 11px; font-weight: 900; letter-spacing: .3em; text-transform: uppercase; transform: skewX(-8deg); }
        .st-boss-title { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.3rem, 3vw, 1.7rem); font-weight: 800; letter-spacing: -.01em; color: var(--kz-text-primary); }
        .st-boss-sub { font-size: 13px; color: var(--kz-text-secondary); }
        .st-heads ol { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .st-head-card { display: grid; gap: 8px; padding: 20px; background: var(--kz-surface-0); transition: background 0.2s ease; }
        .st-head-card:hover { background: var(--kz-surface-1); }
        .st-vat-header { display: flex; align-items: center; justify-content: space-between; }
        .st-vat { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; }
        .st-vat-tag { font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 2px 6px; border-radius: 4px;
          background: var(--kz-accent-soft); color: var(--kz-accent-text); border: 1px solid color-mix(in srgb, var(--kz-accent-2) 40%, transparent); }
        .st-head { font-size: 13px; color: var(--kz-text-secondary); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--kz-accent-2) 70%, transparent); }
        .st-answer { font-size: 14.5px; font-weight: 600; color: var(--kz-text-primary); }

        .st-flock { max-width: 64rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; }
        .st-flock-lead { max-width: 560px; margin: 0 auto 40px; font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); }
        .st-birds { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 18px; text-align: left; }
        .st-bird { display: grid; justify-items: start; align-content: start; gap: 4px; padding: 22px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color .25s ease, transform .25s var(--kz-ease); }
        .st-bird:hover { border-color: color-mix(in srgb, var(--kz-accent) 50%, var(--kz-border-subtle)); transform: translateY(-3px); }
        .st-bird h3 { margin: 10px 0 0; font-size: 16px; font-weight: 700; }
        .st-role { margin: 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-accent-text); }
        .st-bird p:last-child { margin: 6px 0 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        .st-move { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; margin: 22px 0 0 !important; padding: 12px 16px; border-radius: 10px;
          border: 1px solid var(--kz-border-subtle); border-left: 3px solid var(--kz-accent); background: var(--kz-surface-1); }
        .st-move-label { font-family: var(--font-mono); font-size: 10.5px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .st-move strong { font-family: var(--font-display), system-ui, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -.01em; color: var(--kz-text-primary); }
        @media (max-width: 760px) { .st-move { justify-content: center; } }

        .st-open { max-width: 46rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; }
        .st-open p { font-size: 16px; line-height: 1.8; color: var(--kz-text-secondary); margin: 0 auto 14px; max-width: 620px; }
        .st-open .st-btn { margin-top: 14px; }

        .st-closing { position: relative; overflow: hidden; padding: 96px 20px clamp(300px, 34vw, 440px); text-align: center; border-top: 1px solid var(--kz-border-subtle); }
        .st-closing-text { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
        .st-closing p { font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); margin: 0; }
        .st-ctas { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 28px; }
        .st-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none;
          color: var(--kz-text-primary); border: 1px solid var(--kz-border-default); }
        .st-btn.is-primary { background: var(--kz-accent); color: var(--kz-on-accent); border-color: transparent; }
        /* Still by default: the flock and the landscape carry their own idle loops elsewhere on the site; here they
           hold their first frame. A bird wakes up only while it is hovered. */
        .st-bird:not(:hover) *, .st-bird:not(:hover) *::before, .st-bird:not(:hover) *::after,
        .st-landscape *, .st-landscape *::before, .st-landscape *::after { animation-play-state: paused !important; }
        @media (prefers-reduced-motion: reduce) {
          .st-bird, .st-btn { transition: none !important; }
          .st-bird:hover { transform: none !important; }
        }

        .st-landscape { position: absolute; inset: auto 0 0 0; height: 300px; opacity: .7; pointer-events: none;
          -webkit-mask-image: linear-gradient(to top, black 60%, transparent); mask-image: linear-gradient(to top, black 60%, transparent); }
        @media (min-width: 768px) { .st-landscape { height: 440px; } }
      `}</style>
    </ArcadeDirector>
  );
}
