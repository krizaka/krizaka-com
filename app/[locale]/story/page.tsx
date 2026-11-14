import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ForwardIcon, PlayIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { Page } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { Toc, TocLayout } from "@krizaka/ui/toc";
import { localizedMetadata } from "@/lib/seo";
import { contactHref } from "@/lib/contact";
import { ENGINE_USES } from "@/lib/engine-uses";
import { brandFilm } from "@/lib/story-film";
import { watchPath } from "@/lib/watch-films";
import { asLocale, format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { publicRepositoryCount } from "@/lib/org-stats";
import { PRODUCTS, type Product, type ProductStatus as Status } from "@/lib/products";
import { publishedCount } from "@/lib/registry-versions";
import {
  COMPANY_CHAPTERS,
  ENGINE,
  OPEN_BIRD,
  PRODUCT_BIRD,
  PRODUCT_CHAPTERS,
  STORY_ANCHORS,
  WHO_BIRD,
  WORK_STEPS,
  type StoryBird,
} from "@/lib/story";
import { clipOf } from "@/lib/story-clips";
import { uiFacts } from "@/lib/ui-facts";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import FigureTiles from "@/app/components/FigureTiles";
import Rich from "@/app/components/Rich";
import { ProductStatus } from "@/app/components/ProductStatus";
import { ProductMark } from "@/app/components/ProductMark";
import { StackTiles } from "@/app/components/home/OpenStack";
import ClipFigure from "@/app/components/story/ClipFigure";
import FilmCredits from "@/app/components/story/FilmCredits";
import FilmLightbox from "@/app/components/home/FilmLightbox";
import ProductVisual from "@/app/components/home/visuals/ProductVisual";
import "@/app/components/home/visuals/visuals.css";
import EngineFlowView from "@/app/components/home/EngineFlowView";
import ReadingProgress from "@/app/components/story/ReadingProgress";
import TakeCard from "@/app/components/story/TakeCard";
import { takeOf } from "@/lib/story-takes";
import StoryChapter from "@/app/components/story/StoryChapter";
import "./story.css";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/story",
    en: {
      title: "Our story: a small Montréal studio that builds with agents, in the open",
      description:
        "Krizaka is a small studio founded in Montréal. Where the name comes from, how we build with AI agents and measure it, Sovkora the engine, the products built on it and what comes next.",
    },
    fr: {
      title: "Notre histoire : un petit studio de Montréal qui construit avec des agents, à découvert",
      description:
        "Krizaka est un petit studio fondé à Montréal. D'où vient le nom, comment nous construisons avec des agents d'IA et le mesurons, Sovkora le moteur, les produits construits dessus et la suite.",
    },
  });
}

const product = (id: string) => PRODUCTS.find((p) => p.id === id)!;
const names = (locale: string, list: readonly Product[]) =>
  new Intl.ListFormat(locale, { type: "conjunction" }).format(list.map((p) => p.name));

/** A bird's promise, in the words of the family film for its four birds (Krizaka, Sovkora, Verikora, Folioviv), the brand reference's for the others. */
function promiseOf(t: TranslationDictionary, bird: StoryBird): string {
  const s = t.site.story;
  const family: Record<string, string> = s.world.family.cues;
  if (bird in family) return family[bird]!;
  return bird in s.world.cues ? s.world.cues[bird as keyof typeof s.world.cues] : s.birds[bird as keyof typeof s.birds];
}

/* /story (longform, with a sticky chapter contents): a short intro, then ten-second chapters in a fixed order — who we are,
   where the name comes from, how we work, the engine, each product, the open stack, what is next — each a heading, a
   line or two, one proof visual and its depth in a fold. A product says the home's line and status (the same messages
   and data), the products in conception join « what is next » (lib/products-in-design.ts). It is Krizaka's story, the company's: no chapter links to the founder's blog (krizaka-internal#138).
   The face of a chapter lets a feeling show, not an explanation (founder, 2026-11-06, krizaka-internal#2800): its figure is a
   clip of the home's carousels (lib/story-clips.ts, ClipFigure), and the diagrams, the products' real takes and the status
   board sit one step deeper, in the chapter's fold. The brand film « Montrer son travail » is shown once: its loop is
   chapter 1's clip, the whole film opens in a lightbox (nothing fetched before) and its watch page is one link away. The
   name and how we work have no clip, on purpose. Every figure is read at build; products and their statuses come from
   lib/products.ts, what runs on the engine from lib/engine-uses.ts — nothing is typed here. */
export default async function StoryPage({ params }: Props) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const st = t.site.story;
  const h = t.site.products;
  const e = h.engine;
  const engine = product(ENGINE);
  const film = brandFilm();
  const figures = [
    { id: "repos", label: st.open.figures.repos, value: publicRepositoryCount() },
    { id: "components", label: st.open.figures.components, value: uiFacts().components },
    { id: "packages", label: st.open.figures.packages, value: publishedCount() },
  ].filter((f) => f.value > 0);

  const chapterNames = new Map<string, string>([
    ["who", st.who.nav],
    ["name", st.name.nav],
    ["work", st.work.nav],
    ["engine", st.engine.nav],
    ["open", st.open.nav],
    ["next", st.next.nav],
    ...PRODUCT_CHAPTERS.map((id) => [id, product(id).name] as [string, string]),
  ]);
  const plain = new Set<string>([...COMPANY_CHAPTERS, "engine", "open", "next"]);
  const items = STORY_ANCHORS.map((id) => ({
    id: plain.has(id) ? id : `p-${id}`,
    label: chapterNames.get(id)!,
  }));
  const number = (anchor: (typeof STORY_ANCHORS)[number]) => STORY_ANCHORS.indexOf(anchor) + 1;
  /** The chapter's clip as its figure (« Fig. n », n its number), or null when it has none. */
  const clip = (anchor: (typeof STORY_ANCHORS)[number], extra?: ReactNode) => {
    const ref = clipOf(anchor);
    return ref ? (
      <ClipFigure clip={ref} fig={number(anchor)} locale={locale}>
        {extra}
      </ClipFigure>
    ) : null;
  };

  const figureTiles = <FigureTiles figures={figures} label={st.open.figuresAria} locale={locale} columns />;

  const usesList = (
    <ul className="st-uses">
      {ENGINE_USES.map((u) => {
        const p = product(u.id);
        const back = new Intl.ListFormat(locale, { type: "conjunction" }).format(u.back.map((b) => e.back[b]));
        return (
          <li key={u.id} className={"brand-" + u.id} data-planned={u.planned ? "" : undefined}>
            <ProductMark id={u.id} size={22} />
            <span>
              <strong>{p.name}</strong> — {e.uses[u.id as keyof typeof e.uses]}
              {u.planned ? ` (${e.planned})` : ""} · {format(e.gets, { list: back })}
            </span>
          </li>
        );
      })}
    </ul>
  );

  /** The product's real take (a poster, played in a lightbox on click), when one is recorded. */
  const takeProof = (id: (typeof PRODUCT_CHAPTERS)[number] | typeof ENGINE, name: string) => {
    const take = takeOf(id, locale);
    return take ? (
      <TakeCard take={take} name={name} id={id} other={Boolean(take.lang && take.lang !== locale)} />
    ) : null;
  };

  const productChapter = (id: (typeof PRODUCT_CHAPTERS)[number]) => {
    const p = product(id);
    const use = ENGINE_USES.find((u) => u.id === id);
    const useLine =
      use &&
      format(use.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, {
        use: e.uses[use.id as keyof typeof e.uses],
      });
    const bird = PRODUCT_BIRD[id];
    const take = takeProof(id, p.name);
    return (
      <StoryChapter
        key={id}
        id={`p-${id}`}
        number={number(id)}
        brand={id}
        meta={<ProductStatus status={p.status} t={t} />}
        title={
          <>
            <ProductLogo id={id} size={36} animated={false} /> {p.name}
          </>
        }
        kicker={h.knowhow[id].name}
        lead={
          <>
            <p>{h.cards[id].line}</p>
          </>
        }
        bird={bird}
        promise={promiseOf(t, bird)}
        proof={
          clip(id) ??
          take ?? (
            <div className="st-proof">
              <ProductVisual id={id} name={p.name} />
              <p className="kz-label">{st.products.demo}</p>
            </div>
          )
        }
        fold={{
          summary: st.products.how,
          children: (
            <>
              <p>{st.products.proofs[id as keyof typeof st.products.proofs]}</p>
              {useLine && <p className="st-uses-line">{useLine}</p>}
              {clipOf(id) && take}
            </>
          ),
        }}
        actions={
          <>
            <ButtonLink href={p.siteUrl} variant="primary">
              {h.visit} <ForwardIcon size={14} />
            </ButtonLink>
            {p.repoUrl && (
              <ButtonLink href={p.repoUrl} variant="ghost" ariaLabel={format(h.sourceAria, { name: p.name })}>
                {h.source}
              </ButtonLink>
            )}
          </>
        }
      />
    );
  };

  /** A sentence that names products. */
  const words = (message: string, list: readonly Product[]) => format(message, { products: names(locale, list) });
  /** A planned use is said for a product being worked on, never for a paused one. */
  const planned = ENGINE_USES.filter((u) => u.planned).filter((u) => product(u.id).status !== "paused");
  const developing = PRODUCTS.filter((p) => p.status === "development");
  const board: Status[] = ["devPreview", "development", "construction", "paused"];

  const statusBoard = (
    <div className="st-board" role="group" aria-label={st.next.boardAria}>
      {board.map((status) => {
        const list = PRODUCTS.filter((p) => p.status === status);
        return list.length === 0 ? null : (
          <div key={status} className="st-board-col" data-status={status}>
            <p className="st-board-label">
              <ProductStatus status={status} t={t} />
            </p>
            <ul>
              {list.map((p) => (
                <li key={p.id} className={"brand-" + p.id}>
                  <ProductMark id={p.id} size={20} /> {p.name}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <main className="st" style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <SiteBar />
      <ReadingProgress />
      <PageHero
        eyebrow={st.intro.eyebrow}
        title={<Rich text={st.intro.title} renderBold={(c) => <span className="st-accent">{c}</span>} />}
        lead={st.intro.lead}
      >
        <div className="st-actions">
          <ButtonLink href="#who" variant="primary" size="lg">
            {st.intro.start} <ForwardIcon size={15} />
          </ButtonLink>
        </div>
      </PageHero>

      <Page className="st-body">
        <TocLayout toc={<Toc label={st.toc} items={items} />}>
          <StoryChapter
            id="who"
            number={number("who")}
            kicker={st.who.places.join(" · ")}
            title={st.who.title}
            lead={
              <>
                <p>{st.who.lead}</p>
                <p>{st.who.refusal}</p>
              </>
            }
            bird={WHO_BIRD}
            promise={promiseOf(t, WHO_BIRD)}
            proof={clip(
              "who",
              <div className="st-film-ways">
                <FilmLightbox
                  film={{ mp4: film.mp4, poster: film.poster, tall: film.tall }}
                  trigger={
                    <Button type="button" variant="secondary" size="md">
                      <PlayIcon size={15} aria-hidden /> {st.who.film}{" "}
                      <span className="st-film-length">{st.who.filmLength}</span>
                    </Button>
                  }
                />
                <ButtonLink href={`/${locale}${watchPath(film.id)}`} variant="ghost" size="md">
                  {st.watch.watchPage}
                </ButtonLink>
                <FilmCredits />
              </div>,
            )}
          />

          <StoryChapter
            id="name"
            number={number("name")}
            title={st.name.title}
            lead={st.name.passage.map((line) => (
              <p key={line}>
                <Rich
                  text={line}
                  renderBold={(c) => (
                    <span lang="ar" dir="rtl" className="st-ar">
                      {c}
                    </span>
                  )}
                />
              </p>
            ))}
            proof={
              <figure className="st-name-card" aria-labelledby="name-card-caption">
                <p className="st-name-word" translate="no">
                  Krizaka
                </p>
                <p className="st-name-ar" lang="ar" dir="rtl">
                  {st.name.card.arabic}
                </p>
                <p className="st-name-gloss">{st.name.card.gloss}</p>
                <figcaption id="name-card-caption" className="st-name-note">
                  {st.name.card.caption}
                </figcaption>
              </figure>
            }
          />

          <StoryChapter
            id="work"
            number={number("work")}
            title={st.work.title}
            lead={<p>{st.work.lead}</p>}
            proof={
              <figure className="st-work" aria-labelledby="work-steps-title">
                <figcaption id="work-steps-title" className="st-work-title">
                  {st.work.stepsTitle}
                </figcaption>
                <ol className="st-work-steps">
                  {WORK_STEPS.map((step) => (
                    <li key={step} data-step={step}>
                      <strong>{st.work.steps[step].name}</strong>
                      <span>{st.work.steps[step].line}</span>
                    </li>
                  ))}
                </ol>
              </figure>
            }
            fold={{
              summary: st.work.more,
              children: (
                <>
                  {st.work.depth.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </>
              ),
            }}
          />

          <StoryChapter
            id="engine"
            number={number("engine")}
            brand={ENGINE}
            meta={<ProductStatus status={engine.status} t={t} />}
            title={
              <>
                <ProductLogo id={ENGINE} size={36} animated={false} /> {st.engine.title}
              </>
            }
            kicker={h.knowhow.sovkora.name}
            lead={
              <>
                <p className="st-line">{t.site.home.engine.line}</p>
                <p>{st.engine.lead}</p>
              </>
            }
            bird={PRODUCT_BIRD.sovkora}
            promise={promiseOf(t, PRODUCT_BIRD.sovkora)}
            proof={clip("engine") ?? <EngineFlowView t={t} />}
            fold={{
              summary: st.engine.more,
              children: (
                <>
                  <p>{e.sends}.</p>
                  {clipOf("engine") && <EngineFlowView t={t} />}
                  {usesList}
                  {takeProof(ENGINE, engine.name)}
                </>
              ),
            }}
            actions={
              <ButtonLink href={engine.siteUrl} variant="primary">
                {h.visit} <ForwardIcon size={14} />
              </ButtonLink>
            }
          />

          {PRODUCT_CHAPTERS.map((id) => productChapter(id))}

          <StoryChapter
            id="open"
            number={number("open")}
            title={st.open.title}
            lead={<p>{st.open.lead}</p>}
            bird={OPEN_BIRD}
            promise={promiseOf(t, OPEN_BIRD)}
            proof={clip("open") ?? figureTiles}
            fold={{
              summary: st.open.more,
              children: (
                <>
                  {clipOf("open") && figureTiles}
                  <StackTiles locale={locale} />
                </>
              ),
            }}
            actions={
              <ButtonLink href="/docs" variant="primary">
                {st.open.cta} <ForwardIcon size={14} />
              </ButtonLink>
            }
          />

          <StoryChapter
            id="next"
            number={number("next")}
            title={st.next.title}
            lead={
              <>
                <p>{st.next.lead}</p>
                <ul className="st-list">
                  {planned.length > 0 && (
                    <li>
                      {words(
                        st.next.wire,
                        planned.map((u) => product(u.id)),
                      )}
                    </li>
                  )}
                  {developing.length > 0 && <li>{words(st.next.reach, developing)}</li>}
                </ul>
              </>
            }
            proof={clip("next") ?? statusBoard}
            fold={clipOf("next") ? { summary: st.next.boardAria, children: statusBoard } : undefined}
            actions={
              <ButtonLink href={contactHref("story")} variant="primary" size="lg">
                {st.next.cta} <ForwardIcon size={15} />
              </ButtonLink>
            }
          />
        </TocLayout>
      </Page>
    </main>
  );
}
