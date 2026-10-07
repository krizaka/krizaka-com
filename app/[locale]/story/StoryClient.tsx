"use client";

/* /story — where the names come from. Restrained layout: generous whitespace, one idea per
   chapter, the animated marks and the flock as the only ornaments. Tokens only; reduced-motion safe. */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/app/components/I18nProvider";
import KrizakaLogo from "@/app/components/KrizakaLogo";
import OrazakaLogo from "@/app/components/OrazakaLogo";
import OrochiaLogo from "@/app/components/OrochiaLogo";
import KrizakaLandscape from "@/app/components/illustrations/KrizakaLandscape";
import { BirdPortrait, FlockStyles } from "@/app/components/story/Flock";
import { CHAPTERS, FLOCK, HEADS, STORY_CLOSING, STORY_INTRO } from "@/lib/story";

const MARK = {
  krizaka: <KrizakaLogo size={150} />,
  orazaka: <OrazakaLogo size={132} />,
  orochia: <OrochiaLogo size={150} />,
};

export default function StoryClient() {
  const { locale } = useI18n();
  const loc = locale === "fr" ? "fr" : "en";

  return (
    <div className="st">
      <FlockStyles />

      <header className="st-hero">
        <p className="st-eyebrow">{STORY_INTRO.eyebrow[loc]}</p>
        <h1>{STORY_INTRO.title[loc]}</h1>
        <p className="st-lead">{STORY_INTRO.lead[loc]}</p>
        <div className="st-marks" aria-hidden>
          <KrizakaLogo size={44} />
          <span />
          <OrazakaLogo size={40} />
          <span />
          <OrochiaLogo size={44} />
        </div>
      </header>

      {CHAPTERS.map((ch, i) => (
        <section key={ch.id} className={`st-chapter${i % 2 ? " is-flipped" : ""}`} aria-labelledby={`st-${ch.id}`}>
          <div className="st-mark">
            <div className="st-mark-disc">{MARK[ch.id]}</div>
            <p className="st-roots">{ch.roots[loc]}</p>
          </div>
          <div className="st-text">
            <p className="st-num">{String(i + 1).padStart(2, "0")} · {ch.name}</p>
            <h2 id={`st-${ch.id}`}>{ch.title[loc]}</h2>
            {ch.body.map((p) => (
              <p key={p.en}>{p[loc]}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="st-heads" aria-label={loc === "fr" ? "Les huit têtes" : "The eight heads"}>
        <ol>
          {HEADS.map((h, i) => (
            <li key={h.head.en}>
              <span className="st-vat">{i + 1}</span>
              <span className="st-head">{h.head[loc]}</span>
              <span className="st-answer">{h.answer[loc]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="st-flock" aria-labelledby="st-flock">
        <p className="st-num">04 · {loc === "fr" ? "La volée" : "The flock"}</p>
        <h2 id="st-flock">{loc === "fr" ? "Ceux qui veillent." : "The ones keeping watch."}</h2>
        <p className="st-flock-lead">
          {loc === "fr"
            ? "Nos mascottes ne sont pas un décor. Chacune porte une chose sur laquelle nous ne transigeons pas."
            : "Our mascots aren't decoration. Each one carries something we don't compromise on."}
        </p>
        <div className="st-birds">
          {FLOCK.map((b) => (
            <article key={b.id} className="st-bird">
              <BirdPortrait id={b.id} />
              <h3>{b.name[loc]}</h3>
              <p className="st-role">{b.role[loc]}</p>
              <p>{b.line[loc]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="st-closing">
        <div className="st-closing-text">
          <h2>{STORY_CLOSING.title[loc]}</h2>
          <p>{STORY_CLOSING.body[loc]}</p>
          <div className="st-ctas">
            <Link href="/products" className="st-btn is-primary">
              {loc === "fr" ? "Découvrir les produits" : "Explore the products"} <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="st-btn">
              {loc === "fr" ? "Nous écrire" : "Write to us"}
            </Link>
          </div>
        </div>
        <div className="st-landscape" aria-hidden>
          <KrizakaLandscape relative={false} />
        </div>
      </section>

      <style>{`
        .st { color: var(--kz-text-primary); }
        .st-hero { max-width: 760px; margin: 0 auto; padding: clamp(128px, 16vw, 176px) 20px 72px; text-align: center; }
        .st-eyebrow, .st-num { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-accent); margin: 0; }
        .st-hero h1 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2.1rem, 5.6vw, 3.4rem); font-weight: 800; letter-spacing: -.035em; line-height: 1.08; margin: 18px 0 0; }
        .st-lead { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.75; color: var(--kz-text-secondary); margin: 22px auto 0; max-width: 640px; }
        .st-marks { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 40px; }
        .st-marks span { width: 48px; height: 1px; background: linear-gradient(90deg, transparent, var(--kz-border-strong), transparent); }

        .st-chapter { max-width: 64rem; margin: 0 auto; padding: 72px 20px; display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 80px); align-items: center; border-top: 1px solid var(--kz-border-subtle); }
        .st-chapter.is-flipped .st-mark { order: 2; }
        @media (max-width: 760px) { .st-chapter { grid-template-columns: 1fr; text-align: center; } .st-chapter.is-flipped .st-mark { order: 0; } }
        .st-mark { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .st-mark-disc { display: flex; align-items: center; justify-content: center; width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle at 50% 40%, var(--kz-surface-2), var(--kz-surface-0) 70%); border: 1px solid var(--kz-border-subtle); }
        .st-roots { font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); margin: 0; }
        .st-text h2, .st-flock h2, .st-closing h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.6rem, 3.6vw, 2.3rem); font-weight: 800; letter-spacing: -.025em; line-height: 1.15; margin: 12px 0 18px; }
        .st-text p:not(.st-num) { font-size: 16px; line-height: 1.8; color: var(--kz-text-secondary); margin: 0 0 14px; }

        .st-heads { max-width: 64rem; margin: -24px auto 0; padding: 0 20px 72px; }
        .st-heads ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .st-heads li { display: grid; gap: 6px; padding: 20px; background: var(--kz-surface-0); }
        .st-vat { font-family: var(--font-mono); font-size: 11px; color: #d946ef; }
        .st-head { font-size: 13px; color: var(--kz-text-muted); text-decoration: line-through; text-decoration-color: color-mix(in srgb, #d946ef 60%, transparent); }
        .st-answer { font-size: 14.5px; font-weight: 600; color: var(--kz-text-primary); }

        .st-flock { max-width: 64rem; margin: 0 auto; padding: 72px 20px; border-top: 1px solid var(--kz-border-subtle); text-align: center; }
        .st-flock-lead { max-width: 560px; margin: 0 auto 40px; font-size: 16px; line-height: 1.75; color: var(--kz-text-secondary); }
        .st-birds { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 18px; text-align: left; }
        .st-bird { display: grid; justify-items: start; gap: 4px; padding: 22px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .st-bird h3 { margin: 10px 0 0; font-size: 16px; font-weight: 700; }
        .st-role { margin: 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-accent); }
        .st-bird p:last-child { margin: 6px 0 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

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
  );
}
