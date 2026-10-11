import type { Metadata } from "next";
import { contactHref } from "@/lib/contact";
import Link from "next/link";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories, type OrgRepository } from "@/lib/org-data";
import { publicRepositoryCount } from "@/lib/org-stats";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { ProductLogo } from "@krizaka/ui";
import { NPM_PACKAGES, npmUrl, repoUrl } from "@/lib/npm-packages";
import { BOM_VERSION, CENTRAL_NAMESPACE_URL, KIT_PREVIOUS_VERSION, MAVEN_ARTIFACTS, centralUrl, mavenRepoUrl } from "@/lib/maven-packages";
import PackageGlyph from "@/app/components/packages/PackageGlyph";
import { reveal } from "@/lib/motion";
import { BUILDING_BLOCKS, FORUMS } from "@/lib/building-blocks";
import BlockCard from "@/app/components/blocks/BlockCard";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { AutomationIcon, BookmarkIcon, ExternalIcon, ForwardIcon, KnowledgeIcon, LinkIcon, PackIcon, ServerIcon, ShieldIcon } from "@krizaka/icons";
import ButtonLink from "@/app/components/ButtonLink";

/* /open-source — for developers who want to build with Krizaka's pieces: what can be reused, how
   to take it, and every public repository. The repository list comes from the generated product
   data (lib/org-data.ts), never written here. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: {
      title: "Open source — build with Krizaka's building blocks | Krizaka",
      description: "Reuse Krizaka's components in your own application — users, notifications, billing, the AI engine — or run a whole product. Every repository, Apache-2.0.",
    },
    fr: {
      title: "Open source — construisez avec les briques de Krizaka | Krizaka",
      description: "Réutilisez les composants de Krizaka dans votre application — utilisateurs, notifications, facturation, moteur IA — ou déployez un produit entier. Tous les dépôts, Apache-2.0.",
    },
  });
}

const STEPS = [
  { id: "pick", icon: PackIcon },
  { id: "run", icon: ServerIcon },
  { id: "plug", icon: LinkIcon },
] as const;

const GROUPS = [
  { id: "workspace", product: "orazaka" },
  { id: "foundation", product: "orazaka" },
  { id: "ai", product: "orazaka" },
  { id: "apps", product: "orazaka" },
  { id: "orochia", product: "orochia" },
] as const;

const PROMISES = [
  { id: "license", icon: KnowledgeIcon },
  { id: "ci", icon: AutomationIcon },
  { id: "docs", icon: BookmarkIcon },
  { id: "security", icon: ShieldIcon },
] as const;

/** First sentence of a repository description — one idea per line. */
const short = (d: string) => (d.split(/(?<=[.:])\s/)[0] ?? d).replace(/[:.]$/, "");

/** A repository, one line: its name and the first sentence of its description (from the generated product data). */
function RepoLine({ repo }: { repo: OrgRepository }) {
  return (
    <li>
      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-repo">
        <span className="os-repo-name">{repo.name}</span>
        <span className="os-repo-desc">{short(repo.description)}</span>
      </a>
    </li>
  );
}

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.openSource;
  const pk = getDictionary(locale).site.packages;
  const mv = getDictionary(locale).site.maven;
  const repositories = orgRepositories();
  const w = getDictionary(locale).site.blocks;

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <PageHero eyebrow="Open source · Apache-2.0" title={t.title} lead={t.lead} align="center">
        <p className="os-count">
          {format(t.count, { count: publicRepositoryCount() })}
          <a href={GITHUB_ORG_URL}>github.com/krizaka</a>
        </p>
      </PageHero>

      <Section spacing="sm" aria-label={t.title}>
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

      {/* The building blocks stand on the brand's backdrop (BRAND.md §4): the section the page is about. */}
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

      {(["orazaka", "orochia"] as const).map((product) => (
        <Section key={product} spacing="sm" aria-labelledby={`os-${product}`}>
          <div className="os-product-head" {...reveal()}>
            <ProductLogo id={product} size={40} />
            <div>
              <h2 id={`os-${product}`} className="kz-heading-title">{product === "orazaka" ? "Orazaka" : "Orochia"}</h2>
              <Link href={`/products/${product}`} className="os-product-link">
                {t.discoverProduct} <ForwardIcon size={13} />
              </Link>
            </div>
          </div>
          {GROUPS.filter((g) => g.product === product).map((group) => {
            const repos = repositories.filter((r) => r.group === group.id);
            if (repos.length === 0) return null;
            return (
              <div key={group.id} className="os-group" {...reveal(0, "soft")}>
                <div className="os-group-head">
                  <h3>{t.groups[group.id].title}</h3>
                  <p>{t.groups[group.id].intro}</p>
                </div>
                <ul className="os-repos">
                  {repos.map((r) => (
                    <RepoLine key={r.name} repo={r} />
                  ))}
                </ul>
              </div>
            );
          })}
        </Section>
      ))}

      <Section id="packages" eyebrow={pk.eyebrow} title={pk.title} lead={pk.lead} reveal divider>
        <div className="os-pk-banner">
          <PackIcon size={18} aria-hidden />
          <p>{format(pk.notProductBanner, { count: NPM_PACKAGES.length })}</p>
        </div>
        <div className="os-packages">
          {NPM_PACKAGES.map((p, i) => (
            <article key={p.id} className="os-package" {...reveal(i % 3)}>
              <PackageGlyph id={p.id} size={48} />
              <div className="os-package-body">
                <p className="os-package-role">{pk.items[p.id].role}</p>
                <h3>{p.name}</h3>
                <p>{pk.items[p.id].line}</p>
                <code>npm install {p.name}</code>
                <div className="os-package-links">
                  <a href={npmUrl(p)} target="_blank" rel="noopener noreferrer">
                    {pk.npm} <ExternalIcon size={12} aria-hidden />
                  </a>
                  <a href={repoUrl(p)} target="_blank" rel="noopener noreferrer">
                    {pk.source} <ExternalIcon size={12} aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
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
        .os-bom { margin: 0 0 20px; padding: 14px 16px; border-radius: 14px; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.6; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); color: var(--kz-text-primary); overflow-x: auto; }
        .os-maven-all { margin: 18px 0 0; }
        .os-pk-note { max-width: 640px; margin: -8px 0 24px; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-maven-all a { display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .os-maven-all a:hover { color: var(--kz-accent); }
        .os-pk-banner {
          display: flex; align-items: center; gap: 14px; margin: 0 0 28px; padding: 14px 18px; border-radius: 14px;
          background: color-mix(in srgb, var(--kz-accent-soft) 80%, transparent); border: 1px solid var(--kz-border-strong);
        }
        .os-pk-banner svg { color: var(--kz-accent); flex-shrink: 0; }
        .os-pk-banner p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-packages { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: 14px; }
        .os-package { display: flex; gap: 16px; padding: 20px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color .25s, transform .25s; }
        .os-package:hover { border-color: var(--kz-border-strong); transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .os-package, .os-package:hover { transition: none; transform: none; } }
        .os-package-body { min-width: 0; }
        .os-package-role { margin: 0; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--kz-accent); }
        .os-package h3 { margin: 6px 0 0; font-family: var(--font-mono); font-size: 14.5px; font-weight: 700; overflow-wrap: anywhere; }
        .os-package p:not(.os-package-role) { margin: 6px 0 0; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-package code { display: block; margin-top: 12px; padding: 8px 10px; border-radius: 10px; font-family: var(--font-mono); font-size: 12px; background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle); color: var(--kz-text-primary); overflow-x: auto; white-space: nowrap; }
        .os-package-links { display: flex; gap: 14px; margin-top: 12px; }
        .os-package-links a { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .os-package-links a:hover { color: var(--kz-accent); }
        .os-forums, .os-contribute { margin-top: 24px; }
        .os-count { margin: 0 auto; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); }
        .os-count a { color: var(--kz-accent); text-decoration: none; }
        .os-blocks { scroll-margin-top: 64px; }

        .os-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .os-steps li { padding: 26px; background: var(--kz-surface-0); }
        .os-steps svg { color: var(--kz-accent); }
        .os-step-n { display: block; margin-bottom: 14px; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .os-steps h2 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; }
        .os-steps p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        .os-product-head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
        .os-product-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 13px; color: var(--kz-text-secondary); text-decoration: none; }
        .os-product-link:hover { color: var(--kz-text-primary); }
        .os-group { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 24px; padding: 18px 0; }
        @media (max-width: 760px) { .os-group { grid-template-columns: 1fr; gap: 12px; } }
        .os-group-head h3 { margin: 0; font-size: 15px; font-weight: 700; }
        .os-group-head p { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--kz-text-muted); }
        .os-repos { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 2px 20px; }
        .os-repo { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; text-decoration: none; border-bottom: 1px solid var(--kz-border-subtle); }
        .os-repo-name { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--kz-text-primary); }
        .os-repo:hover .os-repo-name { color: var(--kz-accent); }
        .os-repo-desc { font-size: 12.5px; line-height: 1.5; color: var(--kz-text-muted); }

        .os-promises { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 24px; }
        .os-promises svg { color: var(--kz-accent); }
        .os-promises h3 { margin: 10px 0 4px; font-size: 15px; font-weight: 700; }
        .os-promises p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
      `}</style>
    </main>
  );
}
