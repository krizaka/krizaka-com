import type { Metadata } from "next";
import Link from "next/link";
import { ExternalIcon, ForwardIcon, KnowledgeIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { localizedMetadata } from "@/lib/seo";
import { NAV_PRODUCTS } from "@/lib/nav";
import { githubRepositories, publicRepositoryCount } from "@/lib/org-stats";
import { repositoriesOf, type GithubRepository } from "@/lib/repository-catalogue";
import { mavenArtifactCount, npmPackages } from "@/lib/registry-versions";
import { KITS } from "@/lib/product-stack";
import { MANIFESTS_READ_AT, productStackRows } from "@/lib/product-stack-data";
import { uiFacts } from "@/lib/ui-facts";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import { BUILDING_BLOCKS } from "@/lib/building-blocks";
import TopNavBar from "@/app/components/TopNavBar";
import ProductStackTable from "@/app/components/ProductStackTable";
import FigureTiles from "@/app/components/FigureTiles";
import BlockCard from "@/app/components/blocks/BlockCard";
import ButtonLink from "@/app/components/ButtonLink";
import { StackCards } from "@/app/components/home/OpenStack";
import "./open-source.css";

/* /open-source — the site's second view (the home is the first; 2026-10-17), on the docs-hub template: simple and
   inviting, read in five seconds.
   1. The hero: one promise, the figures read at build (GitHub, the Krizaka UI registries, npm, Maven Central), one action.
   2. What we publish: Krizaka UI → ui.krizaka.com, Krizaka Java → java.krizaka.com (lib/stack.ts), then the building blocks
      (compact cards, each with its page /open-source/<block>).
   3. Every repository, by product, read from GitHub at build — folded (native <details>), opened on demand; what each
      product runs on, read from the products' manifests, folded too.
   4. How to contribute: the contact page's picker (a discussion or an issue, on the right repository), the guide.
   Nothing here is a list typed by hand. */

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

/** A repository, one line: its name, kind and language, and its description (GitHub's words) — except Orochia's
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
  const repositories = githubRepositories();
  const groups = [
    ...NAV_PRODUCTS.map((nav) => ({ id: nav.id as string, name: nav.name, repos: repositoriesOf(repositories, nav.id, PRODUCT_IDS) })),
    { id: "krizaka", name: t.platform.name, repos: repositoriesOf(repositories, "krizaka", PRODUCT_IDS) },
  ].filter((g) => g.repos.length > 0);
  const figures = [
    { id: "repositories", value: publicRepositoryCount(), label: t.figures.repositories },
    { id: "components", value: uiFacts().components, label: t.figures.components },
    { id: "npm", value: npmPackages().length, label: t.figures.npm },
    { id: "maven", value: mavenArtifactCount(), label: t.figures.maven },
  ].filter((f) => f.value > 0);

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} align="center" linkAs={Link}>
        <div className="os-hero-figures">
          <FigureTiles figures={figures} label={t.figuresLabel} locale={locale} />
        </div>
        <div className="os-hero-actions">
          <ButtonLink href={GITHUB_ORG_URL} variant="primary" size="lg" shimmer magnetic>
            {t.github} <ExternalIcon size={14} aria-hidden />
          </ButtonLink>
        </div>
      </PageHero>

      <Section id="stack" eyebrow={t.stackEyebrow} title={t.stackTitle} lead={t.stackLead}>
        <StackCards locale={locale} mavenArtifacts={mavenArtifactCount()} />
      </Section>

      <Section id="blocks" eyebrow={site.blocks.eyebrow} title={site.blocks.title} reveal divider>
        <CardGrid columns={3} min={300}>
          {BUILDING_BLOCKS.map((block) => (
            <BlockCard key={block.id} block={block} w={site.blocks} />
          ))}
        </CardGrid>
      </Section>

      <Section id="repositories" eyebrow={t.reposEyebrow} title={t.reposTitle} lead={t.reposLead} reveal divider>
        <div className="os-groups">
          {groups.map((g) => (
            <details key={g.id} id={g.id} className={"os-group brand-" + g.id}>
              <summary>
                <ProductLogo id={g.id as (typeof PRODUCT_IDS)[number] | "krizaka"} size={28} animated={false} />
                <span className="os-group-name">{g.name}</span>
                <span className="os-group-count">{format(t.repoCount, { count: g.repos.length })}</span>
                <ForwardIcon size={14} aria-hidden className="os-group-chevron" />
              </summary>
              <ul className="os-repos">
                {g.repos.map((r) => (
                  <RepoCard key={r.name} repo={r} kind={t.kinds[r.kind]} orochia={t.orochiaRepos} />
                ))}
              </ul>
            </details>
          ))}
          <details id="runs-on" className="os-group">
            <summary>
              <KnowledgeIcon size={22} aria-hidden />
              <span className="os-group-name">{t.runsTitle}</span>
              <ForwardIcon size={14} aria-hidden className="os-group-chevron" />
            </summary>
            <div className="os-runs">
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
            </div>
          </details>
        </div>
      </Section>

      <Section divider aria-labelledby="os-contribute">
        <CtaPanel id="os-contribute" title={t.contributeTitle} body={t.contributeBody} reveal>
          <ButtonLink href="/contact#public" variant="primary" size="lg">
            {t.contributeAsk} <ForwardIcon size={15} />
          </ButtonLink>
          <ButtonLink href="https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md" size="lg">
            {t.contributeGuide}
          </ButtonLink>
        </CtaPanel>
      </Section>
    </main>
  );
}
