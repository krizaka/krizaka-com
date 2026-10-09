"use client";

/* /story — where the names come from. Restrained layout: generous whitespace, one idea per
   chapter, the animated marks and the flock as ornaments, sections revealed as they scroll in, and
   a few quiet arcade nods in the background (ArcadeNods). Tokens only; reduced-motion safe. */

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/app/components/I18nProvider";
import KrizakaLandscape from "@/app/components/illustrations/KrizakaLandscape";
import { BirdPortrait, FlockStyles } from "@/app/components/story/Flock";
import { CHAPTERS, FLOCK } from "@/lib/story";
import { NPM_PACKAGES, npmUrl } from "@/lib/npm-packages";
import PackageGlyph from "@/app/components/packages/PackageGlyph";
import {
  ArcadeStyles,
  ArcadeStageCut,
  ArcadeTeamBadge,
  ContinuePrompt,
  Embers,
  Treasures,
  YearsMarquee,
} from "@/app/components/story/ArcadeNods";
import { KrizakaLogo, OrazakaLogo, OrochiaLogo } from "@krizaka/ui";

const EASE = [0.16, 1, 0.3, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

const MARK = {
  krizaka: <KrizakaLogo size={150} />,
  orazaka: <OrazakaLogo size={132} />,
  orochia: <OrochiaLogo size={150} />,
};

const MARK_AURA = {
  krizaka: "is-krizaka",
  orazaka: "is-orazaka",
  orochia: "is-orochia",
} as const;

export default function StoryClient() {
  const { t } = useI18n();
  const st = t.site.story;

  return (
    <MotionConfig reducedMotion="user">
    <div className="st">
      <FlockStyles />
      <ArcadeStyles />
      <Embers />

      <header className="st-hero">
        <p className="st-eyebrow">{st.intro.eyebrow}</p>
        <h1>{st.intro.title}</h1>
        <p className="st-lead">{st.intro.lead}</p>

        {/* 1990s Arcade Team Battle Homage: Three Sacred Clans */}
        <ArcadeTeamBadge tag={st.arcade.teamTag} synergy={st.arcade.teamSynergy} />

        {/* Three names, one team: they enter in turn, then a light sweeps across them. */}
        <div className="st-marks" aria-hidden>
          {[
            { mark: <KrizakaLogo key="k" size={44} />, id: "krizaka" },
            { mark: <OrazakaLogo key="oz" size={40} />, id: "orazaka" },
            { mark: <OrochiaLogo key="oc" size={44} />, id: "orochia" },
          ].map(({ mark, id }, i) => [
            i > 0 && <i key={`sep-${i}`} className="st-sep" />,
            <motion.span
              key={`mark-${i}`}
              className={`st-mark-slot ${MARK_AURA[id as keyof typeof MARK_AURA]}`}
              initial={{ opacity: 0, x: (i - 1) * -24, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.18 }}
            >
              {mark}
            </motion.span>,
          ])}
        </div>
      </header>

      {CHAPTERS.map((ch, i) => (
        <section key={ch.id} className={`st-chapter${i % 2 ? " is-flipped" : ""}`} aria-labelledby={`st-${ch.id}`}>
          <motion.div className="st-mark" {...reveal}>
            <div className={`st-mark-disc is-${ch.id}`}>
              <div className="st-disc-glow" aria-hidden />
              {MARK[ch.id]}
            </div>
            <p className="st-roots">{st.chapters[ch.id].roots}</p>
            {ch.id === "orochia" && <Treasures />}
          </motion.div>
          <motion.div className="st-text" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
            <ArcadeStageCut stage={`${st.arcade.stage} 0${i + 1}`} name={ch.name} />
            <h2 id={`st-${ch.id}`}>{st.chapters[ch.id].title}</h2>
            {st.chapters[ch.id].body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </motion.div>
        </section>
      ))}

      <section className="st-heads" aria-label={st.headsAria}>
        <YearsMarquee />

        <div className="st-boss-banner" aria-hidden>
          <span className="st-boss-title">{st.arcade.orochiBossTitle}</span>
          <span className="st-boss-sub">{st.arcade.orochiBossSub}</span>
        </div>

        <ol>
          {st.heads.map((h, i) => (
            <motion.li
              key={h.head}
              className="st-head-card"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: EASE, delay: (i % 4) * 0.08 }}
            >
              <div className="st-vat-header">
                <span className="st-vat">{st.arcade.vatLabel} 0{i + 1}</span>
                <span className="st-vat-tag">{st.arcade.sealedBadge}</span>
              </div>
              <span className="st-head">{h.head}</span>
              <span className="st-answer">{h.answer}</span>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="st-flock" aria-labelledby="st-flock">
        <p className="st-num">04 · {st.flockLabel}</p>
        <h2 id="st-flock">{st.flockTitle}</h2>
        <p className="st-flock-lead">
          {st.flockLead}
        </p>
        <div className="st-birds">
          {FLOCK.map((id) => (
            <motion.article key={id} className="st-bird" {...reveal}>
              <BirdPortrait id={id} />
              <h3>{st.flock[id].name}</h3>
              <p className="st-role">{st.flock[id].role}</p>
              <p>{st.flock[id].line}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* The pattern in the steel: the shared interface layers, published on npm. */}
      <section className="st-layers" aria-labelledby="st-layers">
        <p className="st-num">05 · {st.layers.label}</p>
        <h2 id="st-layers">{st.layers.title}</h2>
        <p className="st-flock-lead">{st.layers.lead}</p>
        <ol className="st-folds">
          {NPM_PACKAGES.map((pkg, i) => (
            <motion.li
              key={pkg.id}
              className="st-fold"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              style={{ marginLeft: `calc(${i} * var(--st-fold-step))` }}
            >
              <PackageGlyph id={pkg.id} size={52} />
              <div>
                <a href={npmUrl(pkg)} target="_blank" rel="noopener noreferrer" className="st-fold-name">
                  {pkg.name} <ArrowUpRight size={13} aria-hidden />
                </a>
                <p>{st.layers.items[pkg.id]}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="st-install">
          <span>{st.layers.install}</span> <code>npm install @krizaka/ui</code>
        </p>
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
          <ContinuePrompt label={st.arcade.continue} insertCoin={st.arcade.insertCoin} />
        </div>
        <div className="st-landscape" aria-hidden>
          <KrizakaLandscape relative={false} />
        </div>
      </section>

      <style>{`
        .st { position: relative; color: var(--kz-text-primary); }
        .st > :is(header, section) { position: relative; z-index: 1; }
        .st-mark-slot { display: inline-flex; position: relative; padding: 6px; border-radius: 50%; transition: transform 0.3s ease; }
        .st-mark-slot:hover { transform: translateY(-2px) scale(1.08); }
        .st-mark-slot.is-krizaka:hover { box-shadow: 0 0 20px 4px rgba(249, 115, 22, 0.4); }
        .st-mark-slot.is-orazaka:hover { box-shadow: 0 0 20px 4px rgba(234, 179, 8, 0.4); }
        .st-mark-slot.is-orochia:hover { box-shadow: 0 0 20px 4px rgba(168, 85, 247, 0.45); }
        .st-marks { position: relative; overflow: hidden; padding: 10px 14px; margin-top: 28px; }
        .st-marks::after { content: ""; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(105deg, transparent 35%, color-mix(in srgb, var(--kz-text-primary) 18%, transparent) 50%, transparent 65%);
          transform: translateX(-120%); animation: st-sweep 1.4s 1.2s cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes st-sweep { to { transform: translateX(120%); } }
        @media (prefers-reduced-motion: reduce) { .st-marks::after { display: none; } }
        .st-hero { max-width: 760px; margin: 0 auto; padding: clamp(128px, 16vw, 176px) 20px 72px; text-align: center; }
        .st-eyebrow, .st-num { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-accent); margin: 0; }
        .st-hero h1 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2.1rem, 5.6vw, 3.4rem); font-weight: 800; letter-spacing: -.035em; line-height: 1.08; margin: 18px 0 0; }
        .st-lead { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.75; color: var(--kz-text-secondary); margin: 22px auto 28px; max-width: 640px; }
        .st-marks { display: flex; align-items: center; justify-content: center; gap: 14px; }
        .st-marks .st-sep { width: 48px; height: 1px; background: linear-gradient(90deg, transparent, var(--kz-border-strong), transparent); }

        .st-chapter { max-width: 64rem; margin: 0 auto; padding: 72px 20px; display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 80px); align-items: center; border-top: 1px solid var(--kz-border-subtle); }
        .st-chapter.is-flipped .st-mark { order: 2; }
        @media (max-width: 760px) { .st-chapter { grid-template-columns: 1fr; text-align: center; } .st-chapter.is-flipped .st-mark { order: 0; } }
        .st-mark { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .st-mark-disc { position: relative; display: flex; align-items: center; justify-content: center; width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle at 50% 40%, var(--kz-surface-2), var(--kz-surface-0) 70%); border: 1px solid var(--kz-border-subtle);
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
        .st-mark-disc:hover { transform: scale(1.03); }
        .st-mark-disc.is-krizaka { border-color: rgba(249, 115, 22, 0.35); box-shadow: 0 0 35px -10px rgba(249, 115, 22, 0.25); }
        .st-mark-disc.is-orazaka { border-color: rgba(234, 179, 8, 0.35); box-shadow: 0 0 35px -10px rgba(234, 179, 8, 0.25); }
        .st-mark-disc.is-orochia { border-color: rgba(168, 85, 247, 0.35); box-shadow: 0 0 35px -10px rgba(168, 85, 247, 0.3); }
        .st-disc-glow { position: absolute; inset: -2px; border-radius: 50%; pointer-events: none; opacity: 0.6; filter: blur(8px); }
        .st-mark-disc.is-krizaka .st-disc-glow { background: radial-gradient(circle, rgba(249, 115, 22, 0.2), transparent 70%); }
        .st-mark-disc.is-orazaka .st-disc-glow { background: radial-gradient(circle, rgba(234, 179, 8, 0.2), transparent 70%); }
        .st-mark-disc.is-orochia .st-disc-glow { background: radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent 70%); }
        .st-roots { font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); margin: 0; }
        .st-text h2, .st-flock h2, .st-layers h2, .st-closing h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.6rem, 3.6vw, 2.3rem); font-weight: 800; letter-spacing: -.025em; line-height: 1.15; margin: 12px 0 18px; }
        .st-text p:not(.st-num) { font-size: 16px; line-height: 1.8; color: var(--kz-text-secondary); margin: 0 0 14px; }

        .st-heads { position: relative; max-width: 64rem; margin: -24px auto 0; padding: 24px 20px 96px; }
        .st-boss-banner { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; margin-bottom: 24px; text-align: center; }
        .st-boss-title { font-family: var(--font-mono); font-size: 12px; font-weight: 900; letter-spacing: 0.25em; text-transform: uppercase; color: #d946ef; text-shadow: 0 0 12px rgba(217, 70, 239, 0.4); }
        .st-boss-sub { font-size: 13px; color: var(--kz-text-muted); }
        .st-heads ol { position: relative; z-index: 1; }
        .st-heads ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .st-head-card { display: grid; gap: 8px; padding: 20px; background: color-mix(in srgb, var(--kz-surface-0) 88%, transparent); backdrop-filter: blur(2px); transition: background 0.2s ease; }
        .st-head-card:hover { background: color-mix(in srgb, var(--kz-surface-1) 95%, transparent); }
        .st-vat-header { display: flex; align-items: center; justify-content: space-between; }
        .st-vat { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #d946ef; }
        .st-vat-tag { font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: rgba(217, 70, 239, 0.15); color: #d946ef; border: 1px solid rgba(217, 70, 239, 0.3); }
        .st-head { font-size: 13px; color: var(--kz-text-muted); text-decoration: line-through; text-decoration-color: color-mix(in srgb, #d946ef 60%, transparent); }
        .st-answer { font-size: 14.5px; font-weight: 600; color: var(--kz-text-primary); }

        .st-flock { max-width: 64rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; }
        .st-flock-lead { max-width: 560px; margin: 0 auto 40px; font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); }
        .st-birds { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 18px; text-align: left; }
        .st-bird { display: grid; justify-items: start; gap: 4px; padding: 22px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .st-bird h3 { margin: 10px 0 0; font-size: 16px; font-weight: 700; }
        .st-role { margin: 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-accent); }
        .st-bird p:last-child { margin: 6px 0 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        .st-layers { max-width: 64rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; --st-fold-step: clamp(0px, 4vw, 44px); }
        .st-folds { list-style: none; margin: 0 auto; padding: 0; max-width: 720px; display: grid; gap: 12px; text-align: left; }
        .st-fold { display: flex; gap: 16px; align-items: center; padding: 16px 18px; border-radius: 18px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        @media (max-width: 640px) { .st-fold { margin-left: 0 !important; } }
        .st-fold-name { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .st-fold-name:hover { color: var(--kz-accent); }
        .st-fold p { margin: 4px 0 0; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
        .st-install { margin: 28px 0 0; font-size: 13px; color: var(--kz-text-muted); }
        .st-install code { font-family: var(--font-mono); padding: 6px 10px; margin-left: 6px; border-radius: 8px; background: var(--kz-surface-2); color: var(--kz-text-primary); border: 1px solid var(--kz-border-subtle); }

        .st-closing { position: relative; overflow: hidden; padding: 96px 20px clamp(300px, 34vw, 440px); text-align: center; border-top: 1px solid var(--kz-border-subtle); }
        .st-closing-text { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
        .st-closing p { font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); margin: 0; }
        .st-ctas { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 28px; }
        .st-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none;
          color: var(--kz-text-primary); border: 1px solid var(--kz-border-default); }
        .st-btn.is-primary { background: var(--kz-accent); color: var(--kz-on-accent); border-color: transparent; }
        .st-landscape { position: absolute; inset: auto 0 0 0; height: 300px; opacity: .7; pointer-events: none;
          -webkit-mask-image: linear-gradient(to top, black 60%, transparent); mask-image: linear-gradient(to top, black 60%, transparent); }
        @media (min-width: 768px) { .st-landscape { height: 440px; } }
      `}</style>
    </div>
    </MotionConfig>
  );
}
