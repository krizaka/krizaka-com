import type { Metadata } from "next";
import Image from "next/image";
import { ForwardIcon, PlayIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { Page } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { Toc, TocLayout } from "@krizaka/ui/toc";
import { TapedPhoto } from "@krizaka/ui/taped-photo";
import { localizedMetadata } from "@/lib/seo";
import { video } from "@/lib/cdn";
import { contactHref } from "@/lib/contact";
import { ENGINE_USES } from "@/lib/engine-uses";
import { FILM_BASE } from "@/lib/film-captions";
import { storyFilm } from "@/lib/story-film";
import { asLocale, format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { publicRepositoryCount } from "@/lib/org-stats";
import { PRODUCTS, type Product, type ProductStatus as Status } from "@/lib/products";
import { publishedCount } from "@/lib/registry-versions";
import {
  BLOG_CHAPTER,
  blogChapterUrl,
  ENGINE,
  OPEN_BIRD,
  PRODUCT_BIRD,
  PRODUCT_CHAPTERS,
  STORY_ANCHORS,
  WHO_BIRD,
  type StoryBird,
} from "@/lib/story";
import { uiFacts } from "@/lib/ui-facts";
import { PRODUCTS_ANCHOR } from "@/lib/nav";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import FigureTiles from "@/app/components/FigureTiles";
import Rich from "@/app/components/Rich";
import { ProductStatus } from "@/app/components/ProductStatus";
import { StackTiles } from "@/app/components/home/OpenStack";
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
      title: "Our story — one studio, one engine, every product on the same blocks",
      description:
        "Krizaka forges open building blocks, builds a sovereign AI engine on them — Orazaka — and ships its products on both. The studio in Montréal, the engine, each product, the open stack and what comes next.",
    },
    fr: {
      title: "Notre histoire — un studio, un moteur, tous les produits sur les mêmes briques",
      description:
        "Krizaka forge des briques ouvertes, construit dessus un moteur d'IA souverain — Orazaka — et livre ses produits sur les deux. Le studio à Montréal, le moteur, chaque produit, la pile ouverte et la suite.",
    },
  });
}

const product = (id: string) => PRODUCTS.find((p) => p.id === id)!;
const names = (locale: string, list: readonly Product[]) =>
  new Intl.ListFormat(locale, { type: "conjunction" }).format(list.map((p) => p.name));

/** A bird's promise, in the words of the family film for its four birds (Krizaka, Orazaka, Yomizaka, Akinaza), the brand reference's for the others. */
function promiseOf(t: TranslationDictionary, bird: StoryBird): string {
  const s = t.site.story;
  const family: Record<string, string> = s.world.family.cues;
  if (bird in family) return family[bird]!;
  return bird in s.world.cues ? s.world.cues[bird as keyof typeof s.world.cues] : s.birds[bird as keyof typeof s.birds];
}

/* /story (longform, with a sticky chapter contents): a short intro, then ten-second chapters in a fixed order — who we are,
   the engine, each product, the open stack, what is next — each a heading, a line or two, one proof visual and its
   depth in a fold. The film « The Krizaka family » is shown once (a poster card in chapter 1, the player
   opens in a lightbox, nothing fetched before). Every figure is read at build; products and their statuses come from
   lib/products.ts, what runs on the engine from lib/engine-uses.ts — nothing is typed here. */
export default async function StoryPage({ params }: Props) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const st = t.site.story;
  const h = t.site.products;
  const e = h.engine;
  const engine = product(ENGINE);
  const film = storyFilm();
  const codeFilm = video(FILM_BASE);
  const figures = [
    { id: "repos", label: st.open.figures.repos, value: publicRepositoryCount() },
    { id: "components", label: st.open.figures.components, value: uiFacts().components },
    { id: "packages", label: st.open.figures.packages, value: publishedCount() },
  ].filter((f) => f.value > 0);

  const chapterNames = new Map<string, string>([
    ["who", st.who.nav],
    ["engine", st.engine.nav],
    ["open", st.open.nav],
    ["next", st.next.nav],
    ...PRODUCT_CHAPTERS.map((id) => [id, product(id).name] as [string, string]),
  ]);
  const items = STORY_ANCHORS.map((id) => ({
    id: id === "who" || id === "engine" || id === "open" || id === "next" ? id : `p-${id}`,
    label: chapterNames.get(id)!,
  }));
  const number = (anchor: (typeof STORY_ANCHORS)[number]) => STORY_ANCHORS.indexOf(anchor) + 1;
  const chapterLabel = (n: number) => format(st.chapter, { n: String(n) });
  const numbered = (anchor: (typeof STORY_ANCHORS)[number]) => ({
    number: number(anchor),
    chapterLabel: chapterLabel(number(anchor)),
  });

  /** The blog chapter that tells this part in full: a quiet link beside the chapter's main action. */
  const readOn = (anchor: keyof typeof BLOG_CHAPTER) => (
    <ButtonLink
      href={blogChapterUrl(BLOG_CHAPTER[anchor], locale)}
      variant="ghost"
      ariaLabel={format(st.products.readAria, { title: st.blog[anchor] })}
    >
      {st.products.read}
    </ButtonLink>
  );

  const usesList = (
    <ul className="st-uses">
      {ENGINE_USES.map((u) => {
        const p = product(u.id);
        const back = new Intl.ListFormat(locale, { type: "conjunction" }).format(u.back.map((b) => e.back[b]));
        return (
          <li key={u.id} className={"brand-" + u.id} data-planned={u.planned ? "" : undefined}>
            <ProductLogo id={u.id} size={22} animated={false} />
            <span>
              <strong>{p.name}</strong> — {e.uses[u.id as keyof typeof e.uses]}
              {u.planned ? ` (${e.planned})` : ""} · {format(e.gets, { list: back })}
            </span>
          </li>
        );
      })}
    </ul>
  );

  /** The printed pictures lean in turn, left then right, down the chapters (a slight tilt: the print's own lean). */
  const lean = (anchor: (typeof STORY_ANCHORS)[number]) => (number(anchor) % 2 ? -1.4 : 1.4);

  /** The product's real take (a poster, played in a lightbox on click), when one is recorded; the mini-visual otherwise. */
  const takeProof = (
    id: (typeof PRODUCT_CHAPTERS)[number] | typeof ENGINE,
    name: string,
    anchor: (typeof STORY_ANCHORS)[number],
  ) => {
    const take = takeOf(id, locale);
    return take ? (
      <TakeCard
        take={take}
        name={name}
        id={id}
        other={Boolean(take.lang && take.lang !== locale)}
        tilt={lean(anchor)}
      />
    ) : null;
  };

  const productChapter = (id: (typeof PRODUCT_CHAPTERS)[number]) => {
    const p = product(id);
    const use = ENGINE_USES.find((u) => u.id === id);
    const useLine = use
      ? format(use.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, {
          use: e.uses[use.id as keyof typeof e.uses],
        })
      : undefined;
    const bird = PRODUCT_BIRD[id];
    return (
      <StoryChapter
        key={id}
        id={`p-${id}`}
        {...numbered(id)}
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
            <p>{st.products.lines[id as keyof typeof st.products.lines]}</p>
          </>
        }
        bird={bird}
        promise={promiseOf(t, bird)}
        proof={
          takeProof(id, p.name, id) ?? (
            <div className="st-proof">
              <ProductVisual id={id} />
              <p className="st-proof-note">{st.products.demo}</p>
            </div>
          )
        }
        fold={{
          summary: st.products.how,
          children: (
            <>
              <p>{st.products.proofs[id as keyof typeof st.products.proofs]}</p>
              {useLine && <p className="st-uses-line">{useLine}</p>}
            </>
          ),
        }}
        actions={
          <>
            <ButtonLink href={p.siteUrl} variant="primary">
              {h.visit} <ForwardIcon size={14} />
            </ButtonLink>
            <ButtonLink href={p.repoUrl} variant="ghost" ariaLabel={format(h.sourceAria, { name: p.name })}>
              {h.source}
            </ButtonLink>
            {readOn(id as keyof typeof BLOG_CHAPTER)}
          </>
        }
      />
    );
  };

  /** A sentence that names products. */
  const words = (message: string, list: readonly Product[]) => format(message, { products: names(locale, list) });
  const planned = ENGINE_USES.filter((u) => u.planned);
  const developing = PRODUCTS.filter((p) => p.status === "development");
  const board: Status[] = ["devPreview", "development", "construction"];

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
          <ButtonLink href={PRODUCTS_ANCHOR} size="lg">
            {st.intro.products}
          </ButtonLink>
        </div>
      </PageHero>

      <Page className="st-body">
        <TocLayout toc={<Toc label={st.toc} items={items} />}>
          <StoryChapter
            id="who"
            {...numbered("who")}
            meta={<span className="st-place">{st.who.places.join(" · ")}</span>}
            title={st.who.title}
            lead={
              <>
                <p>{st.who.lead}</p>
                <p>{st.who.refusal}</p>
              </>
            }
            bird={WHO_BIRD}
            promise={promiseOf(t, WHO_BIRD)}
            proof={
              <>
                <TapedPhoto className="st-film-photo" tilt={lean("who")}>
                  <FilmLightbox
                    film={{ mp4: film.mp4, poster: film.poster, vtt: film.vtt }}
                    fallback={{ mp4: codeFilm.mp4, poster: codeFilm.poster, vtt: "film.vtt" }}
                    trigger={
                      <button type="button" className="st-film" aria-label={`${st.who.film} · ${st.who.filmLength}`}>
                        <Image
                          className="st-film-poster"
                          src={film.poster}
                          alt=""
                          width={1280}
                          height={720}
                          sizes="(min-width: 1100px) 400px, (min-width: 640px) 50vw, 92vw"
                        />
                        <span className="st-film-play" aria-hidden>
                          <PlayIcon size={22} />
                        </span>
                        <span className="st-film-caption">
                          {st.who.film} <span>{st.who.filmLength}</span>
                        </span>
                      </button>
                    }
                  />
                </TapedPhoto>
                <FilmCredits />
              </>
            }
            actions={readOn("who")}
          />

          <StoryChapter
            id="engine"
            {...numbered("engine")}
            brand={ENGINE}
            meta={<ProductStatus status={engine.status} t={t} />}
            title={
              <>
                <ProductLogo id={ENGINE} size={36} animated={false} /> {st.engine.title}
              </>
            }
            kicker={h.knowhow.orazaka.name}
            lead={<p>{st.engine.lead}</p>}
            bird={PRODUCT_BIRD.orazaka}
            promise={promiseOf(t, PRODUCT_BIRD.orazaka)}
            proof={
              <>
                <EngineFlowView t={t} />
                {takeProof(ENGINE, engine.name, "engine")}
              </>
            }
            fold={{
              summary: st.engine.more,
              children: (
                <>
                  <p>{e.sends}.</p>
                  {usesList}
                </>
              ),
            }}
            actions={
              <>
                <ButtonLink href={engine.siteUrl} variant="primary">
                  {h.visit} <ForwardIcon size={14} />
                </ButtonLink>
                {readOn("engine")}
              </>
            }
          />

          {PRODUCT_CHAPTERS.map((id) => productChapter(id))}

          <StoryChapter
            id="open"
            {...numbered("open")}
            title={st.open.title}
            lead={<p>{st.open.lead}</p>}
            bird={OPEN_BIRD}
            promise={promiseOf(t, OPEN_BIRD)}
            proof={<FigureTiles figures={figures} label={st.open.figuresAria} locale={locale} columns />}
            fold={{ summary: st.open.more, children: <StackTiles locale={locale} /> }}
            actions={
              <>
                <ButtonLink href="/docs" variant="primary">
                  {st.open.cta} <ForwardIcon size={14} />
                </ButtonLink>
                {readOn("open")}
              </>
            }
          />

          <StoryChapter
            id="next"
            {...numbered("next")}
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
            proof={
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
                            <ProductLogo id={p.id} size={20} animated={false} /> {p.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            }
            actions={
              <>
                <ButtonLink href={contactHref("story")} variant="primary" size="lg">
                  {st.next.cta} <ForwardIcon size={15} />
                </ButtonLink>
                {readOn("next")}
              </>
            }
          />
        </TocLayout>
      </Page>
    </main>
  );
}
