import type { Metadata } from "next";
import Link from "next/link";
import { contactHref } from "@/lib/contact";
import { localizedMetadata } from "@/lib/seo";
import { PRODUCTS } from "@/lib/org-data";
import { NAV_PRODUCTS } from "@/lib/nav";
import { githubRepositories, publicRepositoryCount } from "@/lib/org-stats";
import { repositoriesOf, type GithubRepository, type RepositoryKind } from "@/lib/repository-catalogue";
import { groupPackages, summary } from "@/lib/npm-catalogue";
import { npmPackages, publishedVersion } from "@/lib/registry-versions";
import { KIT_PACKAGES, productKits } from "@/lib/story";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { ProductLogo } from "@krizaka/ui";
import { BOM_VERSION, CENTRAL_NAMESPACE_URL, KIT_PREVIOUS_VERSION, MAVEN_ARTIFACTS, centralUrl, mavenRepoUrl } from "@/lib/maven-packages";
import { reveal } from "@/lib/motion";
import { BUILDING_BLOCKS, FORUMS } from "@/lib/building-blocks";
import BlockCard from "@/app/components/blocks/BlockCard";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CataloguePage } from "@krizaka/ui/catalogue-page";
import { ChipLink } from "@krizaka/ui/chip-link";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Facts, Section, SectionHeading, type Fact } from "@krizaka/ui/page";
import { AutomationIcon, BookmarkIcon, ExternalIcon, ForwardIcon, KnowledgeIcon, LinkIcon, PackIcon, ServerIcon, ShieldIcon } from "@krizaka/icons";
import ButtonLink from "@/app/components/ButtonLink";

/* /open-source — for developers who want to build with Krizaka's pieces, on the Catalogue template (CataloguePage):
   the products in the sticky column, then one section per product — brand, mark, status (lib/nav.ts), stack, the
   Krizaka packages it uses (lib/story.ts, the table of /story) and **every** repository of the org, read from GitHub at
   build (scripts/gen-org-stats.mjs) — then the platform's repositories and the npm packages, grouped from what the
   registry says at build (scripts/gen-registry-versions.mjs). Nothing here is a list typed by hand. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: {
      title: "Open source — build with Krizaka's building blocks",
      description: "Reuse Krizaka's components in your own application — users, notifications, billing, the AI engine — or run a whole product. Every repository, Apache-2.0.",
    },
    fr: {
      title: "Open source — construisez avec les briques de Krizaka",
      description: "Réutilisez les composants de Krizaka dans votre application — utilisateurs, notifications, facturation, moteur IA — ou déployez un produit entier. Tous les dépôts, Apache-2.0.",
    },
  });
}

const STEPS = [
  { id: "pick", icon: PackIcon },
  { id: "run", icon: ServerIcon },
  { id: "plug", icon: LinkIcon },
] as const;

const PROMISES = [
  { id: "license", icon: KnowledgeIcon },
  { id: "ci", icon: AutomationIcon },
  { id: "docs", icon: BookmarkIcon },
  { id: "security", icon: ShieldIcon },
] as const;

const PRODUCT_IDS = NAV_PRODUCTS.map((p) => p.id);
const npmUrl = (name: string) => `https://www.npmjs.com/package/${name}`;
const centralArtifactUrl = (coordinate: string) => `https://central.sonatype.com/artifact/${coordinate.replace(":", "/")}`;

/** A repository, one card: its name, kind and language, and its description in full (GitHub's words). */
function RepoCard({ repo, kind }: { repo: GithubRepository; kind: string }) {
  return (
    <li>
      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-repo">
        <span className="os-repo-name">{repo.name}</span>
        <span className="os-repo-meta">
          {kind}
          {repo.language ? ` · ${repo.language}` : ""}
        </span>
        {repo.description && <span className="os-repo-desc">{repo.description}</span>}
      </a>
    </li>
  );
}

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const site = getDictionary(locale).site;
  const t = site.openSource;
  const pk = site.packages;
  const mv = site.maven;
  const w = site.blocks;
  const repositories = githubRepositories();
  const packages = npmPackages();
  const groups = groupPackages(packages);
  const kindLabel = (k: RepositoryKind) => t.kinds[k];

  const products = NAV_PRODUCTS.map((nav) => {
    const product = PRODUCTS.find((p) => p.id === nav.id);
    const repos = repositoriesOf(repositories, nav.id, PRODUCT_IDS);
    const runsOn = productKits(nav.id);
    const uses = runsOn.flatMap((k) => (k === "engine" ? [] : KIT_PACKAGES[k]));
    const status: Fact = nav.status
      ? { label: site.nav.status[nav.status].long, tone: "wip" }
      : { label: t.live, tone: "ok" };
    return { nav, product, repos, uses, status, engine: runsOn.includes("engine") && nav.id !== "orazaka" };
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
      <p className="os-filters-title">{t.nav.packages}</p>
      <ul>
        {groups.map(({ group, packages: list }) => (
          <li key={group}>
            <ChipLink href={`#npm-${group}`} className="os-chip">
              {pk.groups[group].title}
              <span className="os-chip-n">{list.length}</span>
            </ChipLink>
          </li>
        ))}
        <li>
          <ChipLink href="#maven" className="os-chip">
            {t.nav.maven}
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
        eyebrow="Open source · Apache-2.0"
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
        count={format(t.catalogueCount, { repositories: listed, packages: packages.length })}
        linkAs={Link}
      >
        {products.map(({ nav, product, repos, uses, status, engine }, i) => (
          <section key={nav.id} id={nav.id} aria-labelledby={`os-${nav.id}`} className={"os-product brand-" + nav.id} {...(i > 0 ? reveal(0, "soft") : {})}>
            <div className="os-product-head">
              <ProductLogo id={nav.id} size={44} />
              <div className="min-w-0">
                <h2 id={`os-${nav.id}`}>{nav.name}</h2>
                <p className="os-product-tagline">{site.nav[nav.id].tagline}</p>
              </div>
              <Link href={nav.href} className="os-product-link">
                {t.discoverProduct} <ForwardIcon size={13} aria-hidden />
              </Link>
            </div>
            <Facts
              className="os-product-facts"
              items={[status, { label: format(t.repoCount, { count: repos.length }) }, ...(engine ? [{ label: t.engine }] : [])]}
            />
            <dl className="os-product-meta">
              {product && (
                <div>
                  <dt>{t.stack}</dt>
                  <dd className="os-stack">{product.stack}</dd>
                </div>
              )}
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
                <RepoCard key={r.name} repo={r} kind={kindLabel(r.kind)} />
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
              <RepoCard key={r.name} repo={r} kind={kindLabel(r.kind)} />
            ))}
          </ul>
        </section>

        <section id="packages" aria-labelledby="os-packages" className="os-product os-npm">
          <SectionHeading
            id="os-packages"
            eyebrow={pk.eyebrow}
            title={pk.title}
            lead={pk.lead}
            reveal
            actions={
              <ButtonLink href="/docs/ui" size="md">
                {pk.docsUi} <ForwardIcon size={13} aria-hidden />
              </ButtonLink>
            }
          />
          <div className="os-pk-banner">
            <PackIcon size={18} aria-hidden />
            <p>{format(pk.notProductBanner, { count: packages.length })}</p>
          </div>
          {groups.map(({ group, packages: list }) => (
            <div key={group} id={`npm-${group}`} className="os-npm-group" {...reveal(0, "soft")}>
              <div className="os-npm-group-head">
                <h3>
                  {pk.groups[group].title} <span>{list.length}</span>
                </h3>
                <p>{pk.groups[group].intro}</p>
              </div>
              <ul className="os-npm-list">
                {list.map((p) => (
                  <li key={p.name}>
                    <a href={npmUrl(p.name)} target="_blank" rel="noopener noreferrer" className="os-npm-item">
                      <span className="os-npm-name">
                        <code>{p.name}</code>
                        <span className="os-npm-version">{p.version}</span>
                      </span>
                      {p.description && <span className="os-npm-desc">{summary(p.description)}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="os-npm-more">
            <Link href="/docs/ui">
              {pk.docsUi} <ForwardIcon size={12} aria-hidden />
            </Link>
            <Link href="/docs/orazaka/cli">
              {pk.cliDocs} <ForwardIcon size={12} aria-hidden />
            </Link>
          </p>
        </section>
      </CataloguePage>

      <Section spacing="sm" divider aria-label={t.title}>
        <ol className="os-steps" {...reveal()}>
          {STEPS.map(({ id, icon: Icon }, i) => (
            <li key={id}>
              <span className="os-step-n">{String(i + 1).padStart(2, "0")}</span>
              <Icon size={20} aria-hidden />
              <h2>{t.steps[id].title}</h2>
              <p>{t.steps[id].body}</p>
            </li>
          ))}
        </ol>
      </Section>

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

      <Section id="maven" eyebrow={mv.eyebrow} title={mv.title} lead={mv.lead} reveal divider>
        <div className="os-pk-banner">
          <PackIcon size={18} aria-hidden />
          <p>{mv.bomNote}</p>
        </div>
        <pre className="os-bom">{`<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-bom</artifactId>
  <version>${BOM_VERSION}</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>`}</pre>
        {/* Only while the BOM names kit modules that are not published yet (both versions read from Maven Central). */}
        {KIT_PREVIOUS_VERSION !== BOM_VERSION && (
          <p className="os-pk-note">{format(mv.pinnedNote, { previous: KIT_PREVIOUS_VERSION, current: BOM_VERSION })}</p>
        )}
        <div className="os-packages">
          {MAVEN_ARTIFACTS.map((a, i) => (
            <article key={a.id} className="os-package" {...reveal(i % 3)}>
              <div className="os-package-body">
                <p className="os-package-role">{mv.items[a.id].role}</p>
                <h3>{a.artifactId}</h3>
                <p>{mv.items[a.id].line}</p>
                <code>{`${a.groupId}:${a.artifactId}:${a.version}`}</code>
                <div className="os-package-links">
                  <a href={centralUrl(a)} target="_blank" rel="noopener noreferrer">
                    {mv.central} <ExternalIcon size={12} aria-hidden />
                  </a>
                  <a href={mavenRepoUrl(a)} target="_blank" rel="noopener noreferrer">
                    {mv.source} <ExternalIcon size={12} aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="os-maven-all">
          <a href={CENTRAL_NAMESPACE_URL} target="_blank" rel="noopener noreferrer">
            {mv.all} <ExternalIcon size={12} aria-hidden />
          </a>
        </p>
      </Section>

      <Section divider aria-labelledby="os-contribute">
        <div className="os-promises" {...reveal()}>
          {PROMISES.map(({ id, icon: Icon }) => (
            <div key={id}>
              <Icon size={18} aria-hidden />
              <h3>{t.promises[id].title}</h3>
              <p>{t.promises[id].body}</p>
            </div>
          ))}
        </div>
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

        .os-npm { padding-bottom: 0; }
        .os-pk-banner { display: flex; align-items: center; gap: 14px; margin: 20px 0 8px; padding: 14px 18px; border-radius: 14px;
          background: color-mix(in srgb, var(--kz-accent-soft) 80%, transparent); border: 1px solid var(--kz-border-strong); }
        .os-pk-banner svg { color: var(--kz-accent); flex-shrink: 0; }
        .os-pk-banner p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-npm-group { display: grid; grid-template-columns: minmax(0, 180px) minmax(0, 1fr); gap: 12px 24px; padding: 18px 0; border-bottom: 1px solid var(--kz-border-subtle);
          scroll-margin-top: var(--kz-anchor-offset, 96px); }
        @media (max-width: 760px) { .os-npm-group { grid-template-columns: minmax(0, 1fr); } }
        .os-npm-group-head h3 { margin: 0; font-size: 15px; font-weight: 700; }
        .os-npm-group-head h3 span { font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--kz-text-muted); }
        .os-npm-group-head p { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--kz-text-muted); }
        .os-npm-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 4px 20px; }
        .os-npm-item { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; text-decoration: none; min-width: 0; }
        .os-npm-name { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
        .os-npm-name code { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--kz-text-primary); overflow-wrap: anywhere; }
        .os-npm-item:hover code { color: var(--kz-accent); }
        .os-npm-version { font-family: var(--font-mono); font-size: 11px; padding: 1px 6px; border-radius: 6px; background: var(--kz-surface-2); color: var(--kz-text-secondary); }
        .os-npm-desc { font-size: 12.5px; line-height: 1.5; color: var(--kz-text-secondary); overflow-wrap: anywhere; }
        .os-npm-more { display: flex; flex-wrap: wrap; gap: 8px 20px; margin: 18px 0 0; }
        .os-npm-more a { display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .os-npm-more a:hover { color: var(--kz-accent); }

        .os-bom { margin: 0 0 20px; padding: 14px 16px; border-radius: 14px; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.6; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); color: var(--kz-text-primary); overflow-x: auto; }
        .os-maven-all { margin: 18px 0 0; }
        .os-pk-note { max-width: 640px; margin: -8px 0 24px; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-maven-all a { display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .os-maven-all a:hover { color: var(--kz-accent); }
        .os-packages { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: 14px; }
        .os-package { display: flex; gap: 16px; padding: 20px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color .25s, transform .25s; }
        .os-package:hover { border-color: var(--kz-border-strong); transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .os-package, .os-package:hover { transition: none; transform: none; } }
        .os-package-body { min-width: 0; }
        .os-package-role { margin: 0; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--kz-accent); }
        .os-package h3 { margin: 6px 0 0; font-family: var(--font-mono); font-size: 14.5px; font-weight: 700; overflow-wrap: anywhere; }
        .os-package p:not(.os-package-role) { margin: 6px 0 0; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-package code { display: block; margin-top: 12px; padding: 8px 10px; border-radius: 10px; font-family: var(--font-mono); font-size: 12px; background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle); color: var(--kz-text-primary); overflow-x: auto; white-space: nowrap; }
        .os-package-links { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; }
        .os-package-links a { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .os-package-links a:hover { color: var(--kz-accent); }
        .os-forums, .os-contribute { margin-top: 24px; }
        .os-blocks { scroll-margin-top: 64px; }

        .os-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .os-steps li { padding: 26px; background: var(--kz-surface-0); }
        .os-steps svg { color: var(--kz-accent); }
        .os-step-n { display: block; margin-bottom: 14px; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .os-steps h2 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; }
        .os-steps p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        .os-promises { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 24px; }
        .os-promises svg { color: var(--kz-accent); }
        .os-promises h3 { margin: 10px 0 4px; font-size: 15px; font-weight: 700; }
        .os-promises p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
      `}</style>
    </main>
  );
}
