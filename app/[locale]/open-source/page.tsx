import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, FileCode2, GitBranch, Layers, Package, Plug, Scale, ShieldCheck, Workflow } from "lucide-react";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories, type OrgRepository } from "@/lib/org-data";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { KrizakaLogo, ProductLogo } from "@krizaka/ui";
import { NPM_PACKAGES, npmUrl, repoUrl } from "@/lib/npm-packages";
import { BOM_VERSION, CENTRAL_NAMESPACE_URL, KIT_PREVIOUS_VERSION, MAVEN_ARTIFACTS, centralUrl, mavenRepoUrl } from "@/lib/maven-packages";
import PackageGlyph from "@/app/components/packages/PackageGlyph";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { reveal } from "@/lib/motion";

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
  { id: "pick", icon: Package },
  { id: "run", icon: GitBranch },
  { id: "plug", icon: Plug },
] as const;

/** The pieces most applications need first — Krizaka building blocks, reusable by any application. */
const FEATURED = ["krizaka-users", "krizaka-notifications", "krizaka-billing", "krizaka-platform-kit"] as const;

const GROUPS = [
  { id: "workspace", product: "orazaka" },
  { id: "foundation", product: "orazaka" },
  { id: "ai", product: "orazaka" },
  { id: "apps", product: "orazaka" },
  { id: "orochia", product: "orochia" },
] as const;

const PROMISES = [
  { id: "license", icon: Scale },
  { id: "ci", icon: Workflow },
  { id: "docs", icon: FileCode2 },
  { id: "security", icon: ShieldCheck },
] as const;

/** First sentence of a repository description — the card stays one idea long. */
const short = (d: string) => (d.split(/(?<=[.:])\s/)[0] ?? d).replace(/[:.]$/, "");

function RepoCard({ repo }: { repo: OrgRepository }) {
  return (
    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-repo">
      <span className="os-repo-name">
        {repo.name} <ArrowUpRight size={14} aria-hidden />
      </span>
      <span className="os-repo-desc">{short(repo.description)}</span>
    </a>
  );
}

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.openSource;
  const pk = getDictionary(locale).site.packages;
  const mv = getDictionary(locale).site.maven;
  const repositories = orgRepositories();
  const byName = new Map(repositories.map((r) => [r.name, r]));
  const blocks = repositories.filter((r) => r.product === "krizaka");

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <SectionBackdrop as="header" grid>
      <div className="os-hero">
        <p className="os-eyebrow">Open source · Apache-2.0</p>
        <h1>{t.title}</h1>
        <p className="os-lead">
          {t.lead}
        </p>
        <p className="os-count">
          {format(t.count, { count: repositories.length })}
          <a href={GITHUB_ORG_URL}>github.com/krizaka</a>
        </p>
      </div>
      </SectionBackdrop>

      <section className="os-section">
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
      </section>

      <section className="os-section">
        <div {...reveal()}>
          <p className="os-eyebrow">{t.mostReused}</p>
          <h2 className="os-h2">{t.mostReusedTitle}</h2>
        </div>
        <div className="os-featured">
          {FEATURED.map((name, i) => {
            const repo = byName.get(name);
            if (!repo) return null;
            return (
              <article key={name} className="os-feature" {...reveal(i + 1)}>
                <p className="os-feature-repo">{name}</p>
                <h3>{t.featured[name].title}</h3>
                <ul>
                  {t.featured[name].gives.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-feature-link">
                  {t.viewRepo} <ArrowUpRight size={14} />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="os-section" id="building-blocks">
        <div className="os-product-head" {...reveal()}>
          <KrizakaLogo size={40} />
          <div>
            <h2 className="os-h2" style={{ margin: 0 }}>{t.blocksTitle}</h2>
          </div>
        </div>
        <div className="os-group" {...reveal(0, "soft")}>
          <div className="os-group-head">
            <h3>{t.groups.domain.title}</h3>
            <p>{t.groups.domain.intro}</p>
          </div>
          <div className="os-repos">
            {blocks.map((r) => (
              <RepoCard key={r.name} repo={r} />
            ))}
          </div>
        </div>
      </section>

      {(["orazaka", "orochia"] as const).map((product) => (
        <section key={product} className="os-section">
          <div className="os-product-head" {...reveal()}>
            <ProductLogo id={product} size={40} />
            <div>
              <h2 className="os-h2" style={{ margin: 0 }}>{product === "orazaka" ? "Orazaka" : "Orochia"}</h2>
              <Link href={`/products/${product}`} className="os-product-link">
                {t.discoverProduct} <ArrowRight size={13} />
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
                <div className="os-repos">
                  {repos.map((r) => (
                    <RepoCard key={r.name} repo={r} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      <section className="os-section" id="packages">
        <div {...reveal()}>
          <p className="os-eyebrow">{pk.eyebrow}</p>
          <h2 className="os-h2">{pk.title}</h2>
          <p className="os-pk-lead">{pk.lead}</p>
        </div>
        <div className="os-pk-banner">
          <Layers size={18} aria-hidden />
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
                    {pk.npm} <ArrowUpRight size={13} aria-hidden />
                  </a>
                  <a href={repoUrl(p)} target="_blank" rel="noopener noreferrer">
                    {pk.source} <ArrowUpRight size={13} aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="os-section" id="maven">
        <div {...reveal()}>
          <p className="os-eyebrow">{mv.eyebrow}</p>
          <h2 className="os-h2">{mv.title}</h2>
          <p className="os-pk-lead">{mv.lead}</p>
        </div>
        <div className="os-pk-banner">
          <Layers size={18} aria-hidden />
          <p>{mv.bomNote}</p>
        </div>
        <pre className="os-bom">{`<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-bom</artifactId>
  <version>${BOM_VERSION}</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>`}</pre>
        <p className="os-pk-note">{format(mv.pinnedNote, { previous: KIT_PREVIOUS_VERSION, current: BOM_VERSION })}</p>
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
                    {mv.central} <ArrowUpRight size={13} aria-hidden />
                  </a>
                  <a href={mavenRepoUrl(a)} target="_blank" rel="noopener noreferrer">
                    {mv.source} <ArrowUpRight size={13} aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="os-maven-all">
          <a href={CENTRAL_NAMESPACE_URL} target="_blank" rel="noopener noreferrer">
            {mv.all} <ArrowUpRight size={13} aria-hidden />
          </a>
        </p>
      </section>

      <section className="os-section">
        <div className="os-promises" {...reveal()}>
          {PROMISES.map(({ id, icon: Icon }) => (
            <div key={id}>
              <Icon size={18} aria-hidden />
              <h3>{t.promises[id].title}</h3>
              <p>{t.promises[id].body}</p>
            </div>
          ))}
        </div>
        <div className="os-contribute" {...reveal()}>
          <div>
            <h2>{t.contributeTitle}</h2>
            <p>
              {t.contributeBody}
            </p>
          </div>
          <div className="os-contribute-links">
            <a href="https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="os-btn is-primary">
              <BookOpen size={15} /> {t.contributeGuide}
            </a>
            <Link href="/contact" className="os-btn">
              {t.ask}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .os-bom { margin: 0 0 20px; padding: 14px 16px; border-radius: 14px; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.6; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); color: var(--kz-text-primary); overflow-x: auto; }
        .os-maven-all { margin: 18px 0 0; }
        .os-pk-note { max-width: 640px; margin: -8px 0 24px; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-muted); }
        .os-maven-all a { display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: var(--kz-text-primary); text-decoration: none; }
        .os-maven-all a:hover { color: var(--kz-accent); }
        .os-pk-lead { max-width: 640px; margin: -4px 0 20px; font-size: 15px; line-height: 1.7; color: var(--kz-text-secondary); }
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
        .os-hero { max-width: 760px; margin: 0 auto; padding: clamp(128px, 16vw, 176px) 20px 40px; text-align: center; }
        .os-eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-accent); margin: 0 0 12px; }
        .os-hero h1 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2.2rem, 6vw, 3.4rem); font-weight: 800; letter-spacing: -.035em; line-height: 1.08; margin: 0; }
        .os-lead { font-size: clamp(15px, 1.9vw, 17.5px); line-height: 1.75; color: var(--kz-text-secondary); margin: 20px auto 0; max-width: 640px; }
        .os-count { margin: 18px 0 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); }
        .os-count a { color: var(--kz-accent); text-decoration: none; }
        .os-section { max-width: 72rem; margin: 0 auto; padding: 56px 20px; }
        .os-h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.5rem, 3.4vw, 2.1rem); font-weight: 800; letter-spacing: -.025em; margin: 0 0 28px; }

        .os-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .os-steps li { padding: 26px; background: var(--kz-surface-0); }
        .os-steps svg { color: var(--kz-accent); }
        .os-step-n { display: block; margin-bottom: 14px; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }
        .os-steps h2 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; }
        .os-steps p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        .os-featured { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr)); gap: 16px; }
        .os-feature { display: flex; flex-direction: column; padding: 24px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .os-feature-repo { margin: 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); }
        .os-feature h3 { margin: 6px 0 14px; font-size: 18px; font-weight: 700; }
        .os-feature ul { margin: 0 0 18px; padding: 0; list-style: none; display: grid; gap: 8px; }
        .os-feature li { position: relative; padding-left: 16px; font-size: 14px; line-height: 1.5; color: var(--kz-text-secondary); }
        .os-feature li::before { content: ""; position: absolute; left: 0; top: .6em; width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; }
        .os-feature-link { margin-top: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 700; color: var(--kz-accent); text-decoration: none; }

        .os-product-head { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; padding-top: 8px; border-top: 1px solid var(--kz-border-subtle); padding-top: 40px; }
        .os-product-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 13px; color: var(--kz-text-secondary); text-decoration: none; }
        .os-product-link:hover { color: var(--kz-text-primary); }
        .os-group { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 24px; padding: 18px 0; }
        @media (max-width: 760px) { .os-group { grid-template-columns: 1fr; gap: 12px; } }
        .os-group-head h3 { margin: 0; font-size: 15px; font-weight: 700; }
        .os-group-head p { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--kz-text-muted); }
        .os-repos { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 10px; }
        .os-repo { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: 14px; text-decoration: none; color: var(--kz-text-primary);
          background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color 150ms ease, transform 150ms ease; }
        .os-repo:hover { border-color: var(--kz-border-strong); transform: translateY(-1px); }
        .os-repo-name { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
        .os-repo-name svg { color: var(--kz-text-muted); flex-shrink: 0; }
        .os-repo-desc { font-size: 13px; line-height: 1.55; color: var(--kz-text-secondary); }
        @media (prefers-reduced-motion: reduce) { .os-repo, .os-repo:hover { transition: none; transform: none; } }

        .os-promises { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 24px; padding-top: 40px; border-top: 1px solid var(--kz-border-subtle); }
        .os-promises svg { color: var(--kz-accent); }
        .os-promises h3 { margin: 10px 0 4px; font-size: 15px; font-weight: 700; }
        .os-promises p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-contribute { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; margin-top: 48px; padding: 28px;
          border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .os-contribute h2 { margin: 0 0 6px; font-size: 20px; font-weight: 800; }
        .os-contribute p { margin: 0; max-width: 520px; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }
        .os-contribute-links { display: flex; flex-wrap: wrap; gap: 10px; }
        .os-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none;
          color: var(--kz-text-primary); border: 1px solid var(--kz-border-default); }
        .os-btn.is-primary { background: var(--kz-accent); color: var(--kz-on-accent); border-color: transparent; }
      `}</style>
    </main>
  );
}
