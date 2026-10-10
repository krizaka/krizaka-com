"use client";

/* /story — where the names come from, told with the grammar of a 1990s arcade fighting game.
   Hero: the select screen (three clans lock in). Stages 01–03: one per brand, built identically — fighter card
   (brand mark, treasure, power gauge, roots) on the left, stage announcement and text on the right — and played
   identically (card enters, impact, gauge fills, announcement, then text). The boss: eight heads sealed one by
   one while its gauge drains. The flock steps in. Continue? closes the page.
   Every section plays its entrance once; at most one slow, faint loop per section, never behind a paragraph;
   reduced motion = everything static. The motion contract lives in ArcadeNods. Tokens only: each clan section
   is scoped to its brand (`brand-<id>`), so its colours are its mark's. */

import React, { useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { useI18n } from "@/app/components/I18nProvider";
import KrizakaLandscape from "@/app/components/illustrations/KrizakaLandscape";
import { BirdPortrait, FlockStyles } from "@/app/components/story/Flock";
import { CHAPTERS, FLOCK, type ChapterId } from "@/lib/story";
import { NPM_PACKAGES, npmUrl } from "@/lib/npm-packages";
import PackageGlyph from "@/app/components/packages/PackageGlyph";
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

const EASE = [0.16, 1, 0.3, 1] as const;
/* Chapter 05 (the npm layers) keeps its single fade-up, once. */
const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: EASE },
};

/* One size for the three marks, in the select screen and in the stages: the stages must read alike. */
const mark = (id: ChapterId, size: number) => <ProductLogo id={id} size={size} animated={false} />;

export default function StoryClient() {
  const { t } = useI18n();
  const st = t.site.story;
  const [copiedPkg, setCopiedPkg] = useState<string | null>(null);

  const handleCopy = (pkgName: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`npm install ${pkgName}`);
      setCopiedPkg(pkgName);
      setTimeout(() => setCopiedPkg(null), 2000);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
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

      {/* The pattern in the steel: the shared interface layers, published on npm (Not standalone products) */}
      <section className="st-layers" aria-labelledby="st-layers">
        <div className="st-layers-badge-wrap">
          <span className="st-layers-badge">{st.layers.badge}</span>
        </div>
        <p className="st-num">05 · {st.layers.label}</p>
        <h2 id="st-layers">{st.layers.title}</h2>
        <p className="st-flock-lead">{st.layers.lead}</p>
        <motion.ol className="st-folds" {...reveal}>
          {NPM_PACKAGES.map((pkg, i) => (
            <li key={pkg.id} className="st-fold" style={{ marginLeft: `calc(${i} * var(--st-fold-step))` }}>
              <PackageGlyph id={pkg.id} size={54} />
              <div className="st-fold-body">
                <div className="st-fold-head">
                  <span className="st-fold-layer-pill">LAYER 0{i + 1}</span>
                  <a href={npmUrl(pkg)} target="_blank" rel="noopener noreferrer" className="st-fold-name">
                    {pkg.name} <ArrowUpRight size={13} aria-hidden />
                  </a>
                </div>
                <p>{st.layers.items[pkg.id]}</p>
                <div className="st-fold-actions">
                  <button
                    type="button"
                    onClick={() => handleCopy(pkg.name)}
                    className="st-fold-copy-btn"
                    title={st.layers.copyInstall}
                  >
                    {copiedPkg === pkg.name ? (
                      <>
                        <Check size={12} style={{ color: "var(--kz-success)" }} />
                        <span style={{ color: "var(--kz-success)" }}>{st.layers.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <code>npm i {pkg.name}</code>
                      </>
                    )}
                  </button>
                  <a
                    href={npmUrl(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="st-fold-npm-link"
                  >
                    {st.layers.viewNpm} <ArrowUpRight size={11} aria-hidden />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </motion.ol>
        <div className="st-install">
          <span>{st.layers.install}</span>
          <button
            type="button"
            onClick={() => handleCopy("@krizaka/ui")}
            className="st-install-pill"
          >
            {copiedPkg === "@krizaka/ui" ? (
              <>
                <Check size={13} style={{ color: "var(--kz-success)" }} />
                <span style={{ color: "var(--kz-success)" }}>{st.layers.copied}</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <code>npm install @krizaka/ui</code>
              </>
            )}
          </button>
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
        .st-eyebrow, .st-num { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--site-accent-text); margin: 0; }
        
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
        .st-text h2, .st-flock h2, .st-layers h2, .st-closing h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.6rem, 3.6vw, 2.3rem); font-weight: 800; letter-spacing: -.025em; line-height: 1.15; margin: 18px 0 18px; }
        .st-text p:not(.st-num) { font-size: 16px; line-height: 1.8; color: var(--kz-text-secondary); margin: 0 0 14px; }

        .st-heads { position: relative; max-width: 64rem; margin: 0 auto; padding: 72px 20px 96px; border-top: 1px solid var(--kz-border-subtle); }
        .st-boss-banner { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; }
        .st-boss-round { display: inline-block; font-family: var(--font-mono); font-size: 11px; font-weight: 900; letter-spacing: .3em; text-transform: uppercase; transform: skewX(-8deg); }
        .st-boss-title { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.3rem, 3vw, 1.7rem); font-weight: 800; letter-spacing: -.01em; color: var(--kz-text-primary); }
        .st-boss-sub { font-size: 13px; color: var(--kz-text-muted); }
        .st-heads ol { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .st-head-card { display: grid; gap: 8px; padding: 20px; background: var(--kz-surface-0); transition: background 0.2s ease; }
        .st-head-card:hover { background: var(--kz-surface-1); }
        .st-vat-header { display: flex; align-items: center; justify-content: space-between; }
        .st-vat { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; }
        .st-vat-tag { font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 2px 6px; border-radius: 4px;
          background: var(--kz-accent-soft); color: var(--kz-accent-text); border: 1px solid color-mix(in srgb, var(--kz-accent-2) 40%, transparent); }
        .st-head { font-size: 13px; color: var(--kz-text-muted); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--kz-accent-2) 70%, transparent); }
        .st-answer { font-size: 14.5px; font-weight: 600; color: var(--kz-text-primary); }

        .st-flock { max-width: 64rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; }
        .st-flock-lead { max-width: 560px; margin: 0 auto 40px; font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); }
        .st-birds { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 18px; text-align: left; }
        .st-bird { display: grid; justify-items: start; align-content: start; gap: 4px; padding: 22px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color .25s ease, transform .25s var(--kz-ease); }
        .st-bird:hover { border-color: color-mix(in srgb, var(--kz-accent) 50%, var(--kz-border-subtle)); transform: translateY(-3px); }
        .st-bird h3 { margin: 10px 0 0; font-size: 16px; font-weight: 700; }
        .st-role { margin: 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--site-accent-text); }
        .st-bird p:last-child { margin: 6px 0 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        /* The pattern in the steel (Section 05) */
        .st-layers { max-width: 64rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; --st-fold-step: clamp(0px, 4vw, 44px); }
        .st-layers-badge-wrap { display: flex; justify-content: center; margin-bottom: 14px; }
        .st-layers-badge {
          font-family: var(--font-mono); font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 14px;
          border-radius: 9999px;
          background: color-mix(in srgb, var(--kz-accent-soft) 85%, transparent);
          color: var(--kz-accent); border: 1px solid var(--kz-border-strong);
        }
        .st-folds { list-style: none; margin: 0 auto; padding: 0; max-width: 740px; display: grid; gap: 14px; text-align: left; }
        .st-fold {
          display: flex; gap: 20px; align-items: flex-start; padding: 20px 22px; border-radius: 20px;
          background: color-mix(in srgb, var(--kz-surface-1) 95%, transparent); border: 1px solid var(--kz-border-subtle);
          box-shadow: var(--kz-shadow-sm);
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .st-fold:hover {
          border-color: var(--kz-border-strong); transform: translateY(-2px);
          box-shadow: var(--kz-shadow-md);
        }
        @media (max-width: 640px) { .st-fold { margin-left: 0 !important; } }
        .st-fold-body { flex: 1; min-width: 0; }
        .st-fold-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .st-fold-layer-pill {
          font-family: var(--font-mono); font-size: 10px; font-weight: 800;
          letter-spacing: 0.14em; text-transform: uppercase; padding: 2px 8px;
          border-radius: 6px; background: var(--kz-surface-2); color: var(--kz-accent);
          border: 1px solid var(--kz-border-subtle);
        }
        .st-fold-name { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--kz-text-primary); text-decoration: none; }
        .st-fold-name:hover { color: var(--kz-accent); }
        .st-fold p { margin: 4px 0 0; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
        .st-fold-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 12px; }
        .st-fold-copy-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px;
          border-radius: 8px; border: 1px solid var(--kz-border-subtle);
          background: var(--kz-surface-2); color: var(--kz-text-secondary);
          font-size: 12px; cursor: pointer; transition: all 0.15s ease;
        }
        .st-fold-copy-btn:hover {
          border-color: var(--kz-border-strong); color: var(--kz-text-primary);
          background: color-mix(in srgb, var(--kz-surface-3) 80%, transparent);
        }
        .st-fold-copy-btn code { font-family: var(--font-mono); font-size: 11px; }
        .st-fold-npm-link {
          display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono);
          font-size: 11.5px; font-weight: 600; color: var(--kz-text-muted); text-decoration: none;
        }
        .st-fold-npm-link:hover { color: var(--kz-accent); }

        .st-install { margin: 32px 0 0; font-size: 13.5px; color: var(--kz-text-muted); display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; }
        .st-install-pill {
          display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px;
          border-radius: 10px; border: 1px solid var(--kz-border-strong);
          background: var(--kz-surface-2); color: var(--kz-text-primary); cursor: pointer;
          transition: all 0.15s ease; font-size: 13px;
        }
        .st-install-pill:hover { border-color: var(--kz-accent); transform: translateY(-1px); }
        .st-install-pill code { font-family: var(--font-mono); }

        .st-closing { position: relative; overflow: hidden; padding: 96px 20px clamp(300px, 34vw, 440px); text-align: center; border-top: 1px solid var(--kz-border-subtle); }
        .st-closing-text { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
        .st-closing p { font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); margin: 0; }
        .st-ctas { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 28px; }
        .st-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none;
          color: var(--kz-text-primary); border: 1px solid var(--kz-border-default); }
        .st-btn.is-primary { background: var(--kz-accent); color: var(--kz-on-accent); border-color: transparent; }
        /* Still by default: the flock, the package glyphs and the landscape carry their own idle
           loops elsewhere on the site; here they hold their first frame. A bird or a layer wakes up
           only while it is hovered. */
        .st-bird:not(:hover) *, .st-bird:not(:hover) *::before, .st-bird:not(:hover) *::after,
        .st-fold:not(:hover) *, .st-fold:not(:hover) *::before, .st-fold:not(:hover) *::after,
        .st-landscape *, .st-landscape *::before, .st-landscape *::after { animation-play-state: paused !important; }
        @media (prefers-reduced-motion: reduce) {
          .st-bird, .st-fold, .st-install-pill { transition: none !important; }
          .st-bird:hover, .st-fold:hover, .st-install-pill:hover { transform: none !important; }
        }

        .st-landscape { position: absolute; inset: auto 0 0 0; height: 300px; opacity: .7; pointer-events: none;
          -webkit-mask-image: linear-gradient(to top, black 60%, transparent); mask-image: linear-gradient(to top, black 60%, transparent); }
        @media (min-width: 768px) { .st-landscape { height: 440px; } }
      `}</style>
    </ArcadeDirector>
    </MotionConfig>
  );
}
