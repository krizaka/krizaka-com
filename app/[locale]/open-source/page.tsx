import type { Metadata } from "next";
import Link from "next/link";
import { contactHref } from "@/lib/contact";
import { localizedMetadata } from "@/lib/seo";
import { NAV_PRODUCTS } from "@/lib/nav";
import { githubRepositories, publicRepositoryCount } from "@/lib/org-stats";
import { repositoriesOf, type GithubRepository, type RepositoryKind } from "@/lib/repository-catalogue";
import { mavenArtifactCount, publishedVersion } from "@/lib/registry-versions";
import { KIT_PACKAGES } from "@/lib/product-stack";
import { MANIFESTS_READ_AT, productKits, productStackRows } from "@/lib/product-stack-data";
import { KITS } from "@/lib/product-stack";
import ProductStackTable from "@/app/components/ProductStackTable";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { ProductLogo } from "@krizaka/ui";
import { reveal } from "@/lib/motion";
import { BUILDING_BLOCKS, FORUMS } from "@/lib/building-blocks";
import BlockCard from "@/app/components/blocks/BlockCard";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { CataloguePage } from "@krizaka/ui/catalogue-page";
import { ChipLink } from "@krizaka/ui/chip-link";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Facts, Section, SectionHeading, type Fact } from "@krizaka/ui/page";
import { StackCards } from "@/app/components/home/OpenStack";
import { ExternalIcon, ForwardIcon, KnowledgeIcon } from "@krizaka/icons";
import ButtonLink from "@/app/components/ButtonLink";

/* /open-source — the hub of what Krizaka publishes, on the Catalogue template (CataloguePage): first the stack, each
   part on its own site (Krizaka UI → ui.krizaka.com, Krizaka Java → java.krizaka.com, lib/stack.ts); then **every**
   repository of the org, read from GitHub at build (scripts/gen-org-stats.mjs), by product — with the Krizaka packages
   each one uses (lib/story.ts) — and the platform's; then why each building block exists (/open-source/<block>). The
   package lists and the guides live on the stack's own sites. Nothing here is a list typed by hand. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: {
      title: "Open source — Krizaka UI, Krizaka Java and every Krizaka repository",
      description: "Everything Krizaka builds is public under Apache-2.0: Krizaka UI (ui.krizaka.com), Krizaka Java (java.krizaka.com) and every repository of its products.",
    },
    fr: {
      title: "Open source — Krizaka UI, Krizaka Java et tous les dépôts Krizaka",
      description: "Tout ce que Krizaka construit est public sous Apache-2.0 : Krizaka UI (ui.krizaka.com), Krizaka Java (java.krizaka.com) et chaque dépôt de ses produits.",
    },
  });
}

const PRODUCT_IDS = NAV_PRODUCTS.map((p) => p.id);
const npmUrl = (name: string) => `https://www.npmjs.com/package/${name}`;
const centralArtifactUrl = (coordinate: string) => `https://central.sonatype.com/artifact/${coordinate.replace(":", "/")}`;

/** A repository, one card: its name, kind and language, and its description in full (GitHub's words) — except Orochia's
    repositories, whose GitHub descriptions are written for its own audience: krizaka.com says one neutral line each
    (messages, site.openSource.orochiaRepos). */
function RepoCard({ repo, kind, orochia }: { repo: GithubRepository; kind: string; orochia: Record<string, string> }) {
  const description = repo.name.startsWith("orochia") ? (orochia[repo.name] ?? orochia.default) : repo.description;
  return (
    <li>
      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-repo">
        <span className="os-repo-name">{repo.name}</span>
        <span className="os-repo-meta">
          {kind}
          {repo.language ? ` · ${repo.language}` : ""}
        </span>
        {description && <span className="os-repo-desc">{description}</span>}
      </a>
    </li>
  );
}

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const site = getDictionary(locale).site;
  const t = site.openSource;
  const w = site.blocks;
  const repositories = githubRepositories();
  const kindLabel = (k: RepositoryKind) => t.kinds[k];

  const products = NAV_PRODUCTS.map((nav) => {
    const repos = repositoriesOf(repositories, nav.id, PRODUCT_IDS);
    const runsOn = productKits(nav.id);
    const uses = runsOn.flatMap((k) => (k === "engine" ? [] : KIT_PACKAGES[k]));
    const status: Fact = nav.status
      ? { label: site.nav.status[nav.status].long, tone: "wip" }
      : { label: t.live, tone: "ok" };
    return { nav, repos, uses, status, engine: runsOn.includes("engine") && nav.id !== "orazaka", foundation: runsOn.filter((k) => k !== "engine") };
  });
  const platformRepos = repositoriesOf(repositories, "krizaka", PRODUCT_IDS);
  const listed = products.reduce((n, p) => n + p.repos.length, platformRepos.length);

  const filters = (
    <nav aria-label={t.jump} className="os-filters">
      <p className="os-filters-title">{t.nav.products}</p>
      <ul>
        {products.map(({ nav, repos }) => (
          <li key={nav.id}>
            <ChipLink href={`#${nav.id}`} className={"os-chip brand-" + nav.id}>
              <ProductLogo id={nav.id} size={16} animated={false} />
              {nav.name}
              <span className="os-chip-n">{repos.length}</span>
            </ChipLink>
          </li>
        ))}
        <li>
          <ChipLink href="#krizaka" className="os-chip">
            <ProductLogo id="krizaka" size={16} animated={false} />
            {t.platform.name}
            <span className="os-chip-n">{platformRepos.length}</span>
          </ChipLink>
        </li>
      </ul>
      <p className="os-filters-title">{t.nav.more}</p>
      <ul>
        <li>
          <ChipLink href="#knowhow" className="os-chip">
            {t.nav.knowhow}
          </ChipLink>
        </li>
        <li>
          <ChipLink href="#stack" className="os-chip">
            {t.nav.stack}
          </ChipLink>
        </li>
        <li>
          <ChipLink href="#runs-on" className="os-chip">
            {t.nav.runs}
          </ChipLink>
        </li>
        <li>
          <ChipLink href="#blocks-title" className="os-chip">
            {t.nav.blocks}
          </ChipLink>
        </li>
      </ul>
    </nav>
  );

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <CataloguePage
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        search={
          <p className="os-count">
            {format(t.count, { count: publicRepositoryCount() })}
            <a href={GITHUB_ORG_URL}>github.com/krizaka</a>
          </p>
        }
        filters={filters}
        filtersLabel={t.jump}
        count={format(t.catalogueCount, { repositories: listed })}
        linkAs={Link}
      >
        <section id="stack" aria-labelledby="os-stack" className="os-product">
          <SectionHeading id="os-stack" eyebrow={t.stackEyebrow} title={t.stackTitle} lead={t.stackLead} />
          <StackCards locale={locale} mavenArtifacts={mavenArtifactCount()} />
        </section>

        <section id="knowhow" aria-labelledby="os-knowhow" className="os-product">
          <SectionHeading id="os-knowhow" eyebrow={t.foundation.eyebrow} title={t.foundation.title} lead={t.foundation.lead} />
          <CardGrid as="ul" min={340} columns={2}>
            {products.map(({ nav, repos, foundation }) => {
              const kits = foundation.map((k) => site.story.kits[k].name).join(", ");
              return (
                <LinkCard
                  key={nav.id}
                  href={`#${nav.id}`}
                  linkAs={Link}
                  layout="stack"
                  className={"brand-" + nav.id}
                  title={site.products.knowhow[nav.id].name}
                  meta={format(site.products.proofBy, { name: nav.name })}
                  icon={<ProductLogo id={nav.id} size={40} animated={false} />}
                  description={kits ? format(t.foundation.stands, { name: nav.name, kits }) : format(t.foundation.standsAlone, { name: nav.name })}
                  cta={format(t.repoCount, { count: repos.length })}
                />
              );
            })}
          </CardGrid>
        </section>

        <section id="runs-on" aria-labelledby="os-runs" className="os-product">
          <SectionHeading id="os-runs" eyebrow={t.runs.eyebrow} title={t.runs.title} lead={t.runs.lead} />
          <ProductStackTable
            rows={productStackRows(PRODUCT_IDS).map((r) => ({ ...r, name: NAV_PRODUCTS.find((p) => p.id === r.id)!.name }))}
            kits={KITS}
            labels={{
              caption: t.runs.caption,
              product: t.runs.product,
              yes: t.runs.yes,
              no: t.runs.no,
              partial: t.runs.partial,
              isEngine: t.runs.isEngine,
              planned: t.runs.planned,
              transport: t.runs.transport,
              parts: t.runs.parts,
              kits: Object.fromEntries(KITS.map((k) => [k, site.story.kits[k].name])) as Record<(typeof KITS)[number], string>,
            }}
          />
          <p className="os-stack-read">{format(t.runs.read, { date: MANIFESTS_READ_AT })}</p>
        </section>

        {products.map(({ nav, repos, uses, status, engine }, i) => (
          <section key={nav.id} id={nav.id} aria-labelledby={`os-${nav.id}`} className={"os-product brand-" + nav.id} {...(i > 0 ? reveal(0, "soft") : {})}>
            <div className="os-product-head">
              <ProductLogo id={nav.id} size={44} />
              <div className="min-w-0">
                <h2 id={`os-${nav.id}`}>{nav.name}</h2>
                <p className="os-product-tagline">{site.products.cards[nav.id].line}</p>
              </div>
              <a href={nav.href} target="_blank" rel="noopener noreferrer" className="os-product-link">
                {site.products.visit} <ForwardIcon size={13} aria-hidden />
              </a>
            </div>
            <Facts
              className="os-product-facts"
              items={[status, { label: format(t.repoCount, { count: repos.length }) }, ...(engine ? [{ label: t.engine }] : [])]}
            />
            <dl className="os-product-meta">
              {uses.length > 0 && (
                <div>
                  <dt>{t.uses}</dt>
                  <dd>
                    <ul className="os-uses">
                      {uses.map((coordinate) => {
                        const version = publishedVersion(coordinate);
                        const href = coordinate.startsWith("@") ? npmUrl(coordinate) : centralArtifactUrl(coordinate);
                        return (
                          <li key={coordinate}>
                            <a href={href} target="_blank" rel="noopener noreferrer">
                              <code>{coordinate.replace(/^com\.krizaka:/, "")}</code>
                              {version && <span>{version}</span>}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
            <ul className="os-repos">
              {repos.map((r) => (
                <RepoCard key={r.name} repo={r} kind={kindLabel(r.kind)} orochia={t.orochiaRepos} />
              ))}
            </ul>
          </section>
        ))}

        <section id="krizaka" aria-labelledby="os-krizaka" className="os-product" {...reveal(0, "soft")}>
          <div className="os-product-head">
            <ProductLogo id="krizaka" size={44} />
            <div className="min-w-0">
              <h2 id="os-krizaka">{t.platform.name}</h2>
              <p className="os-product-tagline">{t.platform.tagline}</p>
            </div>
          </div>
          <Facts className="os-product-facts" items={[{ label: format(t.repoCount, { count: platformRepos.length }) }]} />
          <ul className="os-repos">
            {platformRepos.map((r) => (
              <RepoCard key={r.name} repo={r} kind={kindLabel(r.kind)} orochia={t.orochiaRepos} />
            ))}
          </ul>
        </section>

      </CataloguePage>

      {/* The building blocks stand on the brand's backdrop (BRAND.md §4). */}
      <Section id="blocks-title" eyebrow={w.eyebrow} title={w.title} lead={w.lead} reveal backdrop={{ dome: true }} className="os-blocks">
        <CardGrid columns={3} min={300}>
          {BUILDING_BLOCKS.map((block) => (
            <BlockCard key={block.id} block={block} w={w} />
          ))}
        </CardGrid>
        <CtaPanel id="forums-title" level={3} title={w.forums.title} body={w.forums.body} reveal className="os-forums">
          <ButtonLink href={FORUMS.java.url} variant="primary" size="lg">
            {w.forums.java} <ExternalIcon size={13} aria-hidden />
          </ButtonLink>
          <ButtonLink href={FORUMS.ui.url} size="lg">
            {w.forums.ui} <ExternalIcon size={13} aria-hidden />
          </ButtonLink>
        </CtaPanel>
      </Section>

      <Section divider aria-labelledby="os-contribute">
        <CtaPanel id="os-contribute" title={t.contributeTitle} body={t.contributeBody} reveal className="os-contribute">
            <ButtonLink href="https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md" variant="primary" size="lg">
              <KnowledgeIcon size={15} /> {t.contributeGuide}
            </ButtonLink>
            <ButtonLink href={FORUMS.java.url} size="lg">
              {t.ask}
            </ButtonLink>
            <ButtonLink href={contactHref("open-source", "blocks")} size="lg">
              {t.write}
            </ButtonLink>
        </CtaPanel>
      </Section>

      <SiteFooter />

      <style>{`
        .os-count { margin: 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); }
        .os-count a { color: var(--kz-accent); text-decoration: none; }

        .os-filters { display: grid; gap: 10px; }
        .os-filters ul { list-style: none; margin: 0 0 8px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
        .os-filters-title { margin: 8px 0 0; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--kz-text-muted); }
        .os-chip { gap: 6px; text-decoration: none; }
        .os-chip-n { font-family: var(--font-mono); font-size: 10.5px; color: var(--kz-text-muted); }

        .os-product { scroll-margin-top: var(--kz-anchor-offset, 96px); padding: 28px 0 36px; border-top: 1px solid var(--kz-border-subtle); }
        .os-product:first-child { border-top: 0; padding-top: 0; }
        .os-product-head { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 14px; }
        .os-product-head h2 { margin: 0; font-family: var(--kz-font-display); font-size: clamp(1.35rem, 2.6vw, 1.7rem); font-weight: 800; letter-spacing: -0.02em; }
        .os-product-head > .min-w-0 { flex: 1 1 220px; }
        .os-product-tagline { margin: 2px 0 0; font-size: 14px; line-height: 1.5; color: var(--kz-text-secondary); }
        .os-product-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: var(--kz-accent-text, var(--kz-accent)); text-decoration: none; }
        .os-product-link:hover { text-decoration: underline; }
        .os-product-facts { margin: 14px 0 0; }
        .os-product-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 12px 24px; margin: 16px 0 0; }
        .os-product-meta dt { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--kz-text-muted); }
        .os-product-meta dd { margin: 6px 0 0; font-size: 13.5px; line-height: 1.55; color: var(--kz-text-secondary); }
        .os-stack-product { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; }
        .os-stack-cell { display: inline-flex; align-items: center; gap: 8px; color: var(--kz-text-primary); }
        .os-stack-cell[data-state="no"] { color: var(--kz-text-muted, var(--kz-text-secondary)); }
        .os-stack-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--kz-accent); }
        .os-stack-cell[data-state="no"] .os-stack-dot { background: transparent; border: 1.5px solid var(--kz-border-default); }
        .os-stack-cell[data-state="planned"] .os-stack-dot { background: transparent; border: 1.5px dashed var(--kz-accent); }
        .os-stack-cell[data-state="partial"] .os-stack-dot { background: linear-gradient(90deg, var(--kz-accent) 50%, transparent 50%); border: 1.5px solid var(--kz-accent); }
        .os-stack-read { margin: 12px 0 0; font-size: 12.5px; color: var(--kz-text-muted); }
        .os-uses { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
        .os-uses a { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--kz-border-default); background: var(--kz-surface-1);
          font-size: 12px; color: var(--kz-text-primary); text-decoration: none; }
        .os-uses a:hover { border-color: var(--kz-accent); }
        .os-uses code { font-family: var(--font-mono); font-size: 12px; overflow-wrap: anywhere; }
        .os-uses span { font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }

        .os-repos { list-style: none; margin: 18px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 10px; }
        .os-repos > li { display: flex; min-width: 0; }
        .os-repo { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 12px 14px; border-radius: 12px; text-decoration: none;
          background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color .2s; }
        .os-repo:hover { border-color: var(--kz-accent); }
        .os-repo:focus-visible { outline: 2px solid var(--kz-ring, var(--kz-accent)); outline-offset: 2px; }
        .os-repo-name { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--kz-text-primary); overflow-wrap: anywhere; }
        .os-repo-meta { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--kz-accent-text, var(--kz-accent)); }
        .os-repo-desc { font-size: 12.5px; line-height: 1.55; color: var(--kz-text-secondary); overflow-wrap: anywhere; }
        @media (prefers-reduced-motion: reduce) { .os-repo { transition: none; } }


        .os-forums, .os-contribute { margin-top: 24px; }
        .os-blocks { scroll-margin-top: 64px; }


      `}</style>
    </main>
  );
}
