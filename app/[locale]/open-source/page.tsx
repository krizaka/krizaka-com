import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon, ExternalIcon, FlagIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { DocsHubPage } from "@krizaka/ui/docs-hub-page";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { Sparkline } from "@krizaka/charts/sparkline";
import { localizedMetadata } from "@/lib/seo";
import { githubRepositories } from "@/lib/org-stats";
import { openSourceRepositories } from "@/lib/repository-catalogue";
import snapshot from "@/lib/registry-versions.json";
import manifests from "@/lib/product-manifests.json";
import { mavenArtifactCount, npmPackages, publishedVersion } from "@/lib/registry-versions";
import { packageRows, weeklySeriesTotal, weeklyTotal, type RegistrySnapshot } from "@/lib/package-catalogue";
import { GOOD_FIRST_URL, roadmapLinks } from "@/lib/library-links";
import { howItFits } from "@/lib/how-it-fits";
import { PRODUCTS } from "@/lib/products";
import { PUBLIC_CHANNELS } from "@/lib/public-channels";
import { publicChannels } from "@/lib/github-channels";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import { STACK, STACK_LICENCE, hostOf, stackActionUrl } from "@/lib/stack";
import { uiCatalogue } from "@/lib/ui-catalogue";
import { cataloguePageUrl } from "@/lib/catalogue-match";
import { SKILLS_PLUGINS, skillUrl, skillsInstall } from "@/lib/skills-plugins";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import MotionPlayground from "@/app/components/home/playground/MotionPlayground";
import { InstallTabs, factsOf } from "./StackGlance";
import { PackagesTable } from "./OpenSourceTables";
import ComponentBench from "./ComponentBench";
import CatalogueSearch from "./CatalogueSearch";
import HowItFits from "./HowItFits";
import "@/app/components/home/stack-tiles.css";
import "./open-source.css";

/* /open-source — the technical view, on its declared template (docs-hub: @krizaka/ui DocsHubPage), redesigned with
   Krizaka's design skills (krizaka-cahier-design; 2026-10-30, the CTO's direction « a living showcase »). Read in five
   seconds, then deeper on demand; everything read from data at build; one primary action per section.
   1. The hub (DocsHubPage): the search of the Krizaka UI catalogue first (the registries' live entries →
      ui.krizaka.com), the stack as collections (each with its source, releases and issues — the roadmap lives on
      GitHub, #467), the quick start in three steps with the live versions, the most downloaded packages, the owl's
      promise that nothing here is typed by hand.
   2. Play with it: real @krizaka/ui components the visitor drives, the code written as they play (Fig. 1), and the
      Lab's engine flow with two of its settings (Fig. 2). Each figure framed and captioned.
   3. Krizaka Skills: the marketplace command and the three plugins, each with its skills.
   4. Packages: the figures as one line of facts (no counter band), then the searchable table.
   5. How it fits, 6. Contribute (the contact page's picker, the guide, the code of conduct, the licence).
   Only what is open source is listed: the products are operated by Krizaka (openSourceRepositories). */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: {
      title: "Open source — every Krizaka package and repository, and how they fit",
      description:
        "What Krizaka open-sources, under Apache-2.0: Krizaka UI (ui.krizaka.com), Krizaka Java (java.krizaka.com), every npm and Maven Central package and every repository we publish. Our products are operated by Krizaka.",
    },
    fr: {
      title: "Open source — chaque paquet et dépôt Krizaka, et comment tout s'emboîte",
      description:
        "Ce que Krizaka publie en open source, sous Apache-2.0 : Krizaka UI (ui.krizaka.com), Krizaka Java (java.krizaka.com), chaque paquet npm et Maven Central et chaque dépôt que nous publions. Nos produits sont exploités par Krizaka.",
    },
  });
}

const PRODUCT_IDS = PRODUCTS.map((p) => p.id);
const CONDUCT_URL = "https://github.com/krizaka/.github/blob/main/CODE_OF_CONDUCT.md";
const CONTRIBUTING_URL = "https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md";
const LICENSE_URL = "https://www.apache.org/licenses/LICENSE-2.0";
/** The search's way in when nothing is typed: four entries of the catalogue a developer opens first. */
const SEARCH_HINTS = ["page-hero", "data-table", "engine-flow", "code-block"] as const;
const POPULAR_COUNT = 5;

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const site = dict.site;
  const t = site.openSource;
  const h = t.hub;
  const channelGroups = publicChannels();
  const allRepositories = githubRepositories();
  const repositories = openSourceRepositories(allRepositories, PRODUCT_IDS);
  const javaSite = STACK.find((s) => s.id === "java")!.url;
  const packages = packageRows(
    snapshot as RegistrySnapshot,
    allRepositories.filter((r) => !r.archived).map((r) => r.name),
    javaSite,
    PRODUCT_IDS,
  );
  const layers = howItFits(
    manifests.products,
    (snapshot as RegistrySnapshot).mavenMeta,
    (snapshot as RegistrySnapshot).maven ?? {},
  );
  const catalogue = await uiCatalogue();
  const fmt = new Intl.NumberFormat(locale);
  const weekly = weeklyTotal(packages);
  const series = weeklySeriesTotal(packages);
  const uiVersion = publishedVersion("@krizaka/ui");
  const roadmap = new Map(roadmapLinks(STACK).map((r) => [r.id, r]));

  const figures: Fact[] = [
    { label: format(h.facts.repositories, { count: fmt.format(repositories.length) }) },
    { label: format(h.facts.npm, { count: fmt.format(npmPackages().length) }), tone: "ok" },
    { label: format(h.facts.maven, { count: fmt.format(mavenArtifactCount()) }), tone: "ok" },
    ...(weekly ? [{ label: format(h.facts.downloads, { count: fmt.format(weekly) }) }] : []),
    { label: "Apache-2.0" },
  ];
  const popular = packages
    .filter((p) => p.registry === "npm" && p.weeklyDownloads)
    .sort((a, b) => (b.weeklyDownloads ?? 0) - (a.weeklyDownloads ?? 0))
    .slice(0, POPULAR_COUNT)
    .map((p) => ({
      href: p.registryUrl,
      title: p.name,
      meta: format(h.perWeek, { count: fmt.format(p.weeklyDownloads ?? 0) }),
    }));
  const hints = SEARCH_HINTS.map((name) => catalogue.find((e) => e.name === name)).filter((e) => e !== undefined);

  return (
    <main className="os-page">
      <SiteBar />

      <DocsHubPage
        eyebrow={h.eyebrow}
        title={h.title}
        lead={h.lead}
        linkAs={Link}
        linksLayout="wrap"
        search={
          catalogue.length > 0 ? (
            <CatalogueSearch
              entries={catalogue}
              locale={locale}
              w={{
                label: format(h.search.label, { count: fmt.format(catalogue.length) }),
                placeholder: h.search.placeholder,
                results: h.search.results,
                clear: h.search.clear,
              }}
            />
          ) : undefined
        }
        searchHints={
          hints.length > 0 ? (
            <p className="os-hints">
              <span>{h.search.hints}</span>
              {hints.map((e) => (
                <a key={e.name} href={cataloguePageUrl(e.name, locale)}>
                  {e.title}
                </a>
              ))}
            </p>
          ) : undefined
        }
        collectionsTitle={h.collections}
        collections={STACK.map((p) => {
          const r = roadmap.get(p.id);
          return {
            id: p.id,
            mark: <ProductLogo id="krizaka" size={20} animated={false} />,
            title: p.name,
            href: stackActionUrl(p),
            description: (
              <>
                <span className="os-collection-host">{hostOf(p.url)}</span> {site.home.stack[p.id].line}
                <Facts items={factsOf(p, site).filter((f) => f.label !== STACK_LICENCE)} />
              </>
            ),
            links: [
              { href: p.repoUrl, label: h.links.source },
              ...(r
                ? [
                    { href: r.releases, label: t.roadmap.releases },
                    { href: r.issues, label: t.roadmap.issues },
                  ]
                : []),
            ],
          };
        })}
        quickstarts={{
          title: h.quickstart.title,
          children: (
            <div className="os-quickstart">
              {uiVersion ? (
                <ol className="os-steps">
                  <li>
                    <p className="os-step-title">{h.quickstart.install}</p>
                    <CodeBlock
                      code={`npm install @krizaka/ui@${uiVersion} @krizaka/tailwind`}
                      language="bash"
                      file="terminal"
                      copyLabel={t.install.copy}
                      copiedLabel={t.install.copied}
                    />
                  </li>
                  <li>
                    <p className="os-step-title">{h.quickstart.styles}</p>
                    <CodeBlock
                      code={`@import "tailwindcss";\n@import "@krizaka/tailwind";\n@import "@krizaka/ui/tailwind.css";`}
                      language="css"
                      file="app/globals.css"
                      copyLabel={t.install.copy}
                      copiedLabel={t.install.copied}
                    />
                  </li>
                  <li>
                    <p className="os-step-title">{h.quickstart.use}</p>
                    <CodeBlock
                      code={`import { Button } from "@krizaka/ui/button";\n\n<Button variant="primary">${h.quickstart.sample}</Button>`}
                      language="tsx"
                      file="app/page.tsx"
                      copyLabel={t.install.copy}
                      copiedLabel={t.install.copied}
                    />
                  </li>
                </ol>
              ) : null}
              <p className="os-step-title">{h.quickstart.other}</p>
              <InstallTabs locale={locale} skip={uiVersion ? ["ui"] : []} />
            </div>
          ),
        }}
        popular={popular.length > 0 ? { title: h.popular, items: popular } : undefined}
        promise={{ label: h.promise.label, text: h.promise.text }}
      />

      <Section id="play" eyebrow={h.play.eyebrow} title={h.play.title} lead={h.play.lead} reveal divider>
        <div className="os-figures">
          <figure className="os-figure">
            <ComponentBench
              w={{
                ...h.bench,
                copy: t.install.copy,
                copied: t.install.copied,
              }}
            />
            <figcaption>{uiVersion ? format(h.play.fig1, { version: uiVersion }) : h.play.fig1Bare}</figcaption>
          </figure>
          <figure className="os-figure">
            <MotionPlayground w={site.home.stack.motion} />
            <figcaption>{h.play.fig2}</figcaption>
          </figure>
        </div>
      </Section>

      <Section id="skills" eyebrow={h.skills.eyebrow} title={h.skills.title} lead={h.skills.lead} reveal divider>
        <CodeTabs
          label={h.skills.tabs}
          tabs={SKILLS_PLUGINS.map((plugin) => ({
            id: plugin.id,
            label: plugin.name,
            content: (
              <div className="os-skills">
                <p>{h.skills.plugins[plugin.id]}</p>
                <CodeBlock
                  code={skillsInstall(plugin)}
                  language="bash"
                  file="Claude Code"
                  copyLabel={t.install.copy}
                  copiedLabel={t.install.copied}
                />
                <ul aria-label={format(h.skills.list, { plugin: plugin.name })}>
                  {plugin.skills.map((skill) => (
                    <li key={skill}>
                      <a href={skillUrl(skill)} target="_blank" rel="noopener noreferrer">
                        {skill}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          }))}
        />
      </Section>

      <Section
        id="packages"
        eyebrow={t.packages.eyebrow}
        title={t.packages.title}
        lead={t.packages.lead}
        reveal
        divider
      >
        <div className="os-facts" aria-label={t.figuresLabel}>
          <Facts items={figures} />
          {series ? <Sparkline data={series} variant="area" width={96} aria-label={t.packages.trend} /> : null}
        </div>
        <PackagesTable rows={packages} />
        <p className="os-note">
          <a href={`${GITHUB_ORG_URL}?type=source`} target="_blank" rel="noopener noreferrer">
            {t.repositories.title} <ExternalIcon size={11} aria-hidden />
          </a>
        </p>
      </Section>

      <Section id="how-it-fits" eyebrow={t.fits.eyebrow} title={t.fits.title} lead={t.fits.lead} reveal divider>
        <HowItFits layers={layers} w={t.fits} />
      </Section>

      <Section id="contribute" divider aria-labelledby="os-contribute">
        <CtaPanel id="os-contribute" title={t.contribute.title} body={t.contribute.body} reveal>
          <ButtonLink href={CONTRIBUTING_URL} variant="primary" size="lg">
            {t.contribute.guide} <ExternalIcon size={13} aria-hidden />
          </ButtonLink>
          <ButtonLink href={GOOD_FIRST_URL} variant="secondary" size="lg">
            {t.contribute.goodFirst} <ExternalIcon size={13} aria-hidden />
          </ButtonLink>
        </CtaPanel>
        <div className="os-picker">
          {PUBLIC_CHANNELS.map((ch) => {
            const words = dict.contact.channels.find((c) => c.kind === ch.id)!;
            const Icon = ch.id === "discussions" ? ChatIcon : FlagIcon;
            return (
              <div key={ch.id} className="os-picker-row">
                <p className="os-picker-title">
                  <Icon size={16} aria-hidden /> {words.cta}
                </p>
                <ul className="os-picker-repos">
                  {channelGroups
                    .filter((g) => g.group === "stack")
                    .flatMap((g) => g.entries)
                    .map((e) => (
                      <li key={e.id}>
                        <a href={e[ch.id].href} target="_blank" rel="noopener noreferrer">
                          <ProductLogo id={e.mark as never} size={16} animated={false} /> {e.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })}
          <p className="os-picker-legal">
            {t.roadmap.note} <a href={CONDUCT_URL}>{t.contribute.conduct}</a> ·{" "}
            <a href={LICENSE_URL}>{t.contribute.license}</a>
          </p>
        </div>
      </Section>
    </main>
  );
}
