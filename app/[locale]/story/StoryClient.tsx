"use client";

/* /story — the story of a studio, told as one short run of stages with a wink at the arcade (the founder's), built from
   the blocks of @krizaka/ui: PageHero, Section, StageBanner (arcade) for the stage call, PromiseCard (arcade) for the
   "special move" carried by the bird in the corner, the ProductCard everywhere a product is shown, Stat tiles for the
   figures, the stack cards, ContinuePrompt at the end. Nothing of its own but a little prose.
   Spine: the founder → the refusal → the engine (Orazaka) → what it proves first → the rest of the roster → the open
   blocks → contact. Products come from lib/products.ts (the server page renders the cards), figures are read at build.
   One entrance per stage, then calm; reduced motion = a still page. */

import { ForwardIcon } from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import { Mascot } from "@krizaka/ui/mascots";
import { ContinuePrompt } from "@krizaka/ui/continue-prompt";
import { Landscape } from "@krizaka/ui/landscape";
import { Facts, Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { PromiseCard } from "@krizaka/ui/promise-card";
import { ScrollStage } from "@krizaka/ui/scroll-stage";
import { StageBanner } from "@krizaka/ui/stage-banner";
import { VideoPlayer } from "@krizaka/ui/video-player";
import type { ReactNode } from "react";
import { contactHref } from "@/lib/contact";
import { FILM_CUES, TOUR_CUES } from "@/lib/film-captions";
import { PRODUCTS_ANCHOR } from "@/lib/nav";
import { useI18n } from "@/app/components/I18nProvider";
import Rich from "@/app/components/Rich";
import ButtonLink from "@/app/components/ButtonLink";
import "./story.css";

/** The server page renders what reads data (cards, figures, stack) and hands it down. */
export interface StoryParts {
  engine: ReactNode;
  proves: ReactNode;
  roster: ReactNode;
  figures: ReactNode;
  stack: ReactNode;
}

/** « Le monde de Krizaka » on the CDN (lib/cdn.ts `video()`), and its captions (same-origin WebVTT, app/[locale]/story/film.vtt). */
export interface StoryFilm {
  mp4: string;
  poster: string;
  captions: { en: string; fr: string };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function StoryClient({ parts, film, tour }: { parts: StoryParts; film: StoryFilm; tour: StoryFilm }) {
  const { t, locale } = useI18n();
  const st = t.site.story;
  const s = st.stages;
  const flock = st.flock;
  const stage = (n: number, name: string) => <StageBanner variant="arcade" stage={`${st.arcade.stage} ${pad(n)}`} name={name} />;
  const move = (promise: string, bird: "duck" | "owl", keys: readonly string[]) => (
    <PromiseCard
      variant="arcade"
      label={st.arcade.specialMove}
      promise={promise}
      keys={keys}
      bearer={<Mascot bird={bird} mood="success" size={48} animated={false} />}
      bearerLabel={st.arcade.corner}
      bearerName={`${flock[bird].name} · ${flock[bird].role}`}
    />
  );
  const w = st.world;
  const playerLabels = {
    ...w.labels,
    speed: (rate: number) => format(w.labels.speed, { rate: String(rate) }),
    captions: (track: string | null) => format(w.labels.captions, { track: track ?? w.labels.captionsOff }),
    time: (time: string, duration: string) => format(w.labels.time, { time, duration }),
  };
  const prose = (lines: readonly string[]) => (
    <div className="st-prose">
      {lines.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );

  return (
    <ScrollStage variant="arcade" className="st">
      <PageHero
        eyebrow={st.intro.eyebrow}
        title={<Rich text={st.intro.title} renderBold={(c) => <span className="st-accent">{c}</span>} />}
        lead={st.intro.lead}
        aside={<Mascot bird="duck" mood="success" size={120} animated={false} />}
      >
        <div className="st-actions">
          <ButtonLink href="#st-founder" variant="primary" size="lg" shimmer>
            {st.arcade.playerStart} <ForwardIcon size={15} />
          </ButtonLink>
          <ButtonLink href={PRODUCTS_ANCHOR} size="lg">
            {st.ctaProducts}
          </ButtonLink>
        </div>
      </PageHero>

      {/* The flock, filmed from the code: first under the hero, so no reveal (LCP); the poster first, nothing fetched
          before play (preload none), never autoplayed; the lines it says are written below it (its text version). */}
      <Section id="st-world" eyebrow={w.eyebrow} title={w.title} lead={w.lead}>
        <div className="st-film">
          <VideoPlayer
            src={film.mp4}
            poster={film.poster}
            preload="none"
            title={w.player}
            tracks={(["en", "fr"] as const).map((lang) => ({ src: film.captions[lang], srcLang: lang, label: w.captions[lang], default: lang === locale }))}
            labels={playerLabels}
          />
        </div>
        <h3 className="st-film-heading">{w.textVersion}</h3>
        <ol className="st-film-lines">
          {FILM_CUES.filter((c) => c.id !== "title").map((c) => (
            <li key={c.id}>{w.cues[c.id]}</li>
          ))}
        </ol>
        <p className="st-film-credit">{w.credit}</p>

        {/* The sequel: the same birds, photoreal and on tour through five eras (AI-generated, said here and in the film). */}
        <h3 className="st-film-heading">{w.tour.title}</h3>
        <p className="st-film-lead">{w.tour.lead}</p>
        <div className="st-film">
          <VideoPlayer
            src={tour.mp4}
            poster={tour.poster}
            preload="none"
            title={w.tour.player}
            tracks={(["en", "fr"] as const).map((lang) => ({ src: tour.captions[lang], srcLang: lang, label: w.captions[lang], default: lang === locale }))}
            labels={playerLabels}
          />
        </div>
        <h3 className="st-film-heading">{w.textVersion}</h3>
        <ol className="st-film-lines">
          {TOUR_CUES.map((c) => (
            <li key={c.id}>{w.cues[c.id]}</li>
          ))}
        </ol>
        <p className="st-film-credit">{w.tour.credit}</p>
      </Section>

      <Section id="st-founder" data-kzs-scene="" divider eyebrow={stage(1, s.founder.name)} title={s.founder.title} reveal>
        {prose(s.founder.body)}
        <Facts className="st-places" aria-label={s.founder.placesAria} items={s.founder.places.map((label) => ({ label }))} />
        {move(s.founder.move, "duck", ["↓", "↘", "→", "P"])}
      </Section>

      <Section id="st-refusal" data-kzs-scene="" divider eyebrow={stage(2, s.refusal.name)} title={s.refusal.title} reveal>
        {prose(s.refusal.body)}
      </Section>

      <Section id="st-engine" data-kzs-scene="" divider eyebrow={stage(3, s.engine.name)} title={s.engine.title} reveal>
        {prose(s.engine.body)}
        {move(s.engine.move, "owl", ["←", "↙", "↓", "↘", "→", "K"])}
        <div className="st-cards">{parts.engine}</div>
      </Section>

      <Section id="st-proves" data-kzs-scene="" divider eyebrow={stage(4, s.proves.name)} title={s.proves.title} lead={s.proves.lead} reveal>
        {parts.proves}
      </Section>

      <Section id="st-roster" data-kzs-scene="" divider eyebrow={stage(5, s.roster.name)} title={s.roster.title} lead={s.roster.lead} reveal>
        {parts.roster}
      </Section>

      <Section id="st-open" data-kzs-scene="" divider eyebrow={stage(6, s.open.name)} title={s.open.title} lead={s.open.body} reveal>
        {parts.figures}
        <div className="st-cards">{parts.stack}</div>
        <div className="st-actions">
          <ButtonLink href="/open-source#runs-on" variant="primary">
            {s.open.cta} <ForwardIcon size={14} />
          </ButtonLink>
          <ButtonLink href="/open-source">{s.open.ctaAll}</ButtonLink>
        </div>
      </Section>

      <section className="st-closing" aria-labelledby="st-closing">
        <ContinuePrompt
          variant="arcade"
          brand="krizaka"
          caption={st.arcade.cabinetLabel}
          highlight={st.arcade.insertCoin}
          hint={st.arcade.coinEntry}
          status={st.arcade.creditLabel}
          title={st.arcade.continue}
          countdown={{ from: 9, to: 7 }}
          actionKey={st.arcade.playerStart}
          actionLabel={st.arcade.restartBtn}
          onAction={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
        >
          <h2 id="st-closing" className="st-crt-heading">
            {st.closing.title}
          </h2>
          <p className="st-crt-body">{st.closing.body}</p>
          <div className="st-crt-ctas">
            <ButtonLink href={PRODUCTS_ANCHOR} variant="primary" size="lg">
              {st.ctaProducts} <ForwardIcon size={15} />
            </ButtonLink>
            <ButtonLink href={contactHref("story")} size="lg">
              {st.ctaContact}
            </ButtonLink>
          </div>
        </ContinuePrompt>
        <div className="st-landscape" aria-hidden>
          <Landscape animated={false} />
        </div>
      </section>
    </ScrollStage>
  );
}
