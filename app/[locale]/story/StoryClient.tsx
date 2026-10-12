"use client";

/* /story — the story of a studio, told like the poster of a 1990s arcade fighting game. Krizaka is the house that tells
   it (never a fighter beside its products): it forges the platform — the open building blocks — and the engine,
   Orazaka; the products run on both. The page is the storytelling kit of @krizaka/ui (`variant="arcade"`, its styles in
   @krizaka/ui/story.css); this file only lays it out.
   Hero: the studio presents its products on a select screen (from lib/nav.ts: a product added there gets its stage
   here as soon as its words exist). Stage 00: the house and its platform, with figures read at build. Then one stage per
   product, played identically — fighter card, stage call, the why, the special move carried by the bird in its corner,
   what it runs on. Bonus round: we use our own products (the table). The boss, the flock, everything open, Continue?
   One strong entrance per section, then calm to read; reduced motion = a still, composed page. */

import React from "react";
import { ForwardIcon } from "@krizaka/icons";
import { type BrandId, KrizakaLogo, ProductLogo } from "@krizaka/ui";
import { Achievement, AchievementList, Emblem } from "@krizaka/ui/achievement";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { ContinuePrompt } from "@krizaka/ui/continue-prompt";
import { GoalGauge } from "@krizaka/ui/goal-gauge";
import { Landscape } from "@krizaka/ui/landscape";
import { Mascot, Phoenix } from "@krizaka/ui/mascots";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { ProfileCard, StatGauge } from "@krizaka/ui/profile-card";
import { PromiseCard } from "@krizaka/ui/promise-card";
import { Scene, ScrollStage } from "@krizaka/ui/scroll-stage";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { StageBanner } from "@krizaka/ui/stage-banner";
import { cn } from "@krizaka/ui/cn";
import Link from "next/link";
import { contactHref } from "@/lib/contact";
import { format } from "@/lib/i18n";
import { useI18n } from "@/app/components/I18nProvider";
import Rich from "@/app/components/Rich";
import ButtonLink from "@/app/components/ButtonLink";
import { DUST, ENGINE, flock, isFlockBird, KITS, STUDIO, storyProducts, type KitId, type StoryProduct } from "@/lib/story";
import "./story.css";

export interface StoryFigures {
  repos: number;
  components: number;
  packages: number;
}
export interface StoryKit {
  id: Exclude<KitId, "engine">;
  packages: { name: string; version?: string }[];
}

/* The emblems of the clans: the sword for the house that forges, the mirror for the engine that answers, the jewel for
   the products it powers. */
const emblemOf = (id: string) => (id === STUDIO.id ? "sword" : id === ENGINE ? "mirror" : "jewel");
const mark = (id: string, size: number) => <ProductLogo id={id as BrandId} size={size} animated={false} />;
const pad = (n: number) => String(n).padStart(2, "0");

type Chapters = Record<string, { caption: string; title: string; body: string[]; move: string; stat: string } | undefined>;

function Bird({ bird, size }: { bird: string; size: number }) {
  if (bird === "phoenix") return <Phoenix size={size} animated={false} />;
  return isFlockBird(bird) ? <Mascot bird={bird} mood="success" size={size} animated={false} /> : null;
}

export default function StoryClient({ figures, kits }: { figures: StoryFigures; kits: StoryKit[] }) {
  const { t, locale } = useI18n();
  const st = t.site.story;
  const chapters = st.chapters as Chapters;
  const flockWords = st.flock as Record<string, { name: string; role: string; line: string } | undefined>;
  const products = storyProducts((id) => Boolean(chapters[id]));
  const birds = flock((id) => Boolean(flockWords[id]));
  const stage = (n: number) => `${st.arcade.stage} ${pad(n)}`;
  const navWords = t.site.nav as unknown as Record<string, { tagline: string; badge?: string } | undefined>;
  const statusOf = (p: StoryProduct) => (p.status ? t.site.nav.status[p.status].long : undefined);
  const percent = (value: number) => <NumberTicker value={value} locale={locale} format={{ style: "percent" }} />;
  const kitName = (id: KitId) => st.kits[id].name;
  const birdName = (bird: string) => flockWords[bird] && `${flockWords[bird]!.name} · ${flockWords[bird]!.role}`;

  return (
    <ScrollStage variant="arcade" className="st">
      {/* ── Hero: the house presents its products ── */}
      <SectionBackdrop as="header" className="st-hero brand-krizaka" grid data-kzs-scene="">
        <div data-backdrop-layer aria-hidden className="st-halos">
          {products.slice(0, 4).map((p, i) => (
            <span key={p.id} className={cn("st-halo", "brand-" + p.id)} data-at={i} />
          ))}
        </div>
        <div data-backdrop-layer aria-hidden className="st-dust">
          {DUST.map(([x, y, s], i) => (
            <span key={i} className="st-mote kzs-loop" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, "--d": i } as React.CSSProperties} />
          ))}
        </div>
        <div data-backdrop-layer aria-hidden className="st-hero-fade" />

        <div className="st-hero-inner">
          <p className="st-presents">
            <KrizakaLogo size={28} animated={false} />
            <span>{st.intro.presents}</span>
          </p>
          <p className="st-eyebrow">
            <span className="st-eyebrow-rule" aria-hidden />
            {st.intro.eyebrow}
            <span className="st-eyebrow-rule" aria-hidden />
          </p>
          <h1 className="st-hero-title">
            <Rich text={st.intro.title} renderBold={(c) => <span className="st-hero-accent">{c}</span>} />
          </h1>
          <p className="st-lead">{st.intro.lead}</p>

          <ChoiceGrid
            className="st-select"
            label={st.arcade.selectAria}
            tag={format(st.arcade.teamTag, { count: products.length })}
            caption={st.arcade.teamSynergy}
            prompt={st.arcade.selectPrompt}
            linkAs={Link}
            items={products.map((p, i) => {
              const words = chapters[p.id]!;
              const status = statusOf(p);
              return {
                id: p.id,
                brand: p.id,
                badge: `P${i + 1}`,
                eyebrow: p.id === ENGINE ? st.roles.engine : (status ?? st.roles.product),
                icon: <Emblem kind={emblemOf(p.id)} size={13} />,
                visual: mark(p.id, 84),
                name: p.name,
                title: navWords[p.id]?.tagline,
                extra: p.stat !== undefined ? <StatGauge label={words.stat} value={p.stat * 100} figure={percent(p.stat)} /> : undefined,
                meta: (
                  <>
                    {stage(i + 1)} <span aria-hidden>↓</span>
                  </>
                ),
                href: `#st-${p.id}`,
              };
            })}
          />
        </div>
      </SectionBackdrop>

      {/* ── Stage 00: the house and its platform ── */}
      <SectionBackdrop as="section" className="st-stage st-house brand-krizaka" dome={false} aria-labelledby="st-krizaka" data-kzs-scene="">
        <span className="st-ghost" aria-hidden>
          00
        </span>
        <div className="st-chapter">
          <div className="st-mark">
            <ProfileCard
              nameAs="p"
              visual={mark(STUDIO.id, 120)}
              icon={<Emblem kind="sword" size={16} />}
              name={st.studio.role}
              statLabel={st.studio.stat}
              figure={percent(1)}
              caption={st.studio.caption}
            />
          </div>
          <div className="st-text">
            <StageBanner stage={stage(0)} name={st.studio.label} />
            <div data-kzs-reveal>
              <h2 id="st-krizaka" tabIndex={-1}>
                {st.studio.title}
              </h2>
              {st.studio.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <PromiseCard
              label={st.arcade.specialMove}
              promise={st.studio.move}
              keys={STUDIO.combo}
              bearer={<Bird bird={STUDIO.bird} size={48} />}
              bearerLabel={st.arcade.corner}
              bearerName={birdName(STUDIO.bird)}
            />
          </div>
        </div>

        <div className="st-platform" data-kzs-reveal style={{ "--kzs-delay": ".9s" } as React.CSSProperties}>
          <h3 className="st-platform-title">{st.studio.platformTitle}</h3>
          <p className="st-platform-lead">{st.studio.platformLead}</p>
          <dl className="st-figures" aria-label={st.studio.figuresAria}>
            {(["repos", "components", "packages"] as const).map((k) => (
              <div key={k}>
                <dt>{st.studio.figures[k]}</dt>
                <dd>
                  <NumberTicker value={figures[k]} locale={locale} />
                </dd>
              </div>
            ))}
          </dl>
          <ul className="st-kits" aria-label={st.studio.kitsAria}>
            {kits.map((k) => (
              <li key={k.id} className="st-kit">
                <span className="st-kit-name">{st.kits[k.id].name}</span>
                <span className="st-kit-line">{st.kits[k.id].line}</span>
                <span className="st-kit-pkgs">
                  {k.packages.map((p) => (
                    <code key={p.name}>
                      {p.name}
                      {p.version && <span> {p.version}</span>}
                    </code>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SectionBackdrop>

      {/* ── One stage per product: the engine first, then the products it powers ── */}
      {products.map((p, i) => {
        const words = chapters[p.id]!;
        const status = statusOf(p);
        return (
          <SectionBackdrop key={p.id} as="section" className={cn("st-stage", "brand-" + p.id)} dome={false} aria-labelledby={`st-${p.id}`} data-kzs-scene="">
            <span className="st-ghost" aria-hidden>
              {pad(i + 1)}
            </span>
            <div className="st-chapter">
              <div className="st-mark">
                <ProfileCard
                  nameAs="p"
                  visual={mark(p.id, 120)}
                  icon={<Emblem kind={emblemOf(p.id)} size={16} />}
                  name={p.id === ENGINE ? st.roles.engine : (status ?? st.roles.product)}
                  statLabel={p.stat !== undefined ? words.stat : undefined}
                  value={(p.stat ?? 1) * 100}
                  figure={p.stat !== undefined ? percent(p.stat) : undefined}
                  caption={words.caption}
                />
              </div>
              <div className="st-text">
                <StageBanner stage={stage(i + 1)} name={p.name} />
                <div data-kzs-reveal>
                  <h2 id={`st-${p.id}`} tabIndex={-1}>
                    {words.title}
                  </h2>
                  {words.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p className="st-runs">
                    <span className="st-runs-label">{st.runsOn}</span>
                    {p.runsOn.map((k) => (
                      <span key={k} className="st-chip">
                        {kitName(k)}
                      </span>
                    ))}
                  </p>
                </div>
                <PromiseCard
                  label={st.arcade.specialMove}
                  promise={words.move}
                  keys={p.combo}
                  bearer={<Bird bird={p.bird} size={48} />}
                  bearerLabel={st.arcade.corner}
                  bearerName={birdName(p.bird)}
                />
              </div>
            </div>
          </SectionBackdrop>
        );
      })}

      {/* ── Bonus round: we use our own products ── */}
      <Scene className="st-ours" aria-labelledby="st-ours">
        <StageBanner stage={st.ours.label} name="Krizaka" />
        <div data-kzs-reveal>
          <h2 id="st-ours">{st.ours.title}</h2>
          <p className="st-ours-lead">{st.ours.lead}</p>
        </div>
        <div className="st-table-wrap" data-kzs-reveal style={{ "--kzs-delay": ".8s" } as React.CSSProperties}>
          <table className="st-table">
            <caption>{st.ours.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{st.ours.product}</th>
                {KITS.map((k) => (
                  <th key={k} scope="col">
                    {kitName(k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={"brand-" + p.id}>
                  <th scope="row">
                    <span className="st-table-product">
                      {mark(p.id, 22)}
                      {p.name}
                    </span>
                  </th>
                  {KITS.map((k) => {
                    const engine = k === "engine" && p.id === ENGINE;
                    const yes = engine || p.runsOn.includes(k);
                    return (
                      <td key={k} data-yes={yes ? "" : undefined}>
                        {yes ? (
                          <>
                            <span aria-hidden className="st-dot" />
                            <span className="st-cell">{engine ? st.ours.isEngine : st.ours.yes}</span>
                          </>
                        ) : (
                          <span className="st-cell st-no">{st.ours.no}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Scene>

      {/* ── The boss: eight heads sealed one by one while its gauge drains ── */}
      <SectionBackdrop as="section" className="st-heads brand-orochia" direction="up" grid aria-label={st.headsAria} data-kzs-scene="">
        <StageBanner size="lg" titleAs="h2" stage={st.arcade.finalRound} title={st.arcade.orochiBossTitle} subtitle={st.arcade.orochiBossSub} />
        <GoalGauge className="st-boss-gauge" label={st.arcade.bossGauge} segments={st.heads.length} value={0} mode="drain" valueText={`0 / ${st.heads.length}`} />
        <AchievementList>
          {st.heads.map((h, i) => (
            <Achievement key={h.head} eyebrow={`${st.arcade.vatLabel} ${pad(i + 1)}`} badge={st.arcade.sealedBadge} replaced={h.head} title={h.answer} />
          ))}
        </AchievementList>
      </SectionBackdrop>

      {/* ── The flock: one promise per bird ── */}
      <Scene className="st-flock" aria-labelledby="st-flock">
        <p className="st-num">{st.flockLabel}</p>
        <h2 id="st-flock">{st.flockTitle}</h2>
        <p className="st-flock-lead">{st.flockLead}</p>
        <div className="st-birds">
          {birds.map((id, i) => (
            <article key={id} className="st-bird" data-kzs-reveal style={{ "--kzs-delay": `${i * 0.08}s` } as React.CSSProperties}>
              <span className="st-bird-portrait" aria-hidden>
                {id === "phoenix" ? <Phoenix size={92} animated={false} /> : isFlockBird(id) && <Mascot bird={id} mood="welcome" tone="own" size={92} />}
              </span>
              <h3>{flockWords[id]!.name}</h3>
              <p className="st-role">{flockWords[id]!.role}</p>
              <p>{flockWords[id]!.line}</p>
            </article>
          ))}
        </div>
      </Scene>

      {/* ── Bonus stage: everything is open (the list itself lives on /open-source) ── */}
      <SectionBackdrop as="section" className="st-open brand-krizaka" dome={false} aria-labelledby="st-open" data-kzs-scene="">
        <StageBanner stage={st.open.label} name="Open source" />
        <div data-kzs-reveal>
          <h2 id="st-open">{st.open.title}</h2>
          {st.open.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ButtonLink href="/open-source" size="lg" className="st-open-cta">
            {st.open.cta} <ForwardIcon size={15} />
          </ButtonLink>
        </div>
      </SectionBackdrop>

      {/* ── Continue? — the cabinet carries the closing call ── */}
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
            <ButtonLink href="/products" variant="primary" size="lg">
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
