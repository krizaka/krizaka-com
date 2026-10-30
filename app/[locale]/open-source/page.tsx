import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon, ExternalIcon, FlagIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { localizedMetadata } from "@/lib/seo";
import { githubRepositories } from "@/lib/org-stats";
import { openSourceRepositories } from "@/lib/repository-catalogue";
import snapshot from "@/lib/registry-versions.json";
import manifests from "@/lib/product-manifests.json";
import { mavenArtifactCount, npmPackages } from "@/lib/registry-versions";
import { packageRows, weeklySeriesTotal, weeklyTotal, type RegistrySnapshot } from "@/lib/package-catalogue";
import { GOOD_FIRST_URL, roadmapLinks } from "@/lib/library-links";
import { howItFits } from "@/lib/how-it-fits";
import { PRODUCTS } from "@/lib/products";
import { PUBLIC_CHANNELS } from "@/lib/public-channels";
import { publicChannels } from "@/lib/github-channels";
import { format, getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import { STACK } from "@/lib/stack";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { StatGrid } from "@krizaka/ui/stat";
import { Sparkline } from "@krizaka/charts/sparkline";
import { InstallTabs, StackGlance } from "./StackGlance";
import { PackagesTable } from "./OpenSourceTables";
import HowItFits from "./HowItFits";
import "./open-source.css";

/* /open-source — the site's second view (the home is the first; 2026-10-17): the technical view, as refined as the home
   (docs-hub template). One primary action per section, no boxes in boxes; everything read from data at build.
   1. The hero: one line, the live figures (repositories, npm packages, Maven artifacts, the licence), GitHub.
   2. The stack: Krizaka UI → ui.krizaka.com, Krizaka Java → java.krizaka.com, each with a still mini-visual and its
      latest version (npm, Maven Central); the building blocks' pages, as quiet links.
   3. Packages: a searchable DataTable of every published package (lib/package-catalogue.ts) — registry and family
      facets, the latest version, the weekly downloads (npm), the links.
   4. Repositories: every open-source repository with its platform, language and last push (GitHub at build).
   5. How it fits: building blocks → shared services (lib/how-it-fits.ts), an ordered list that is its own text version.
   Only what is open source is listed: the products are operated by Krizaka (lib/repository-catalogue.ts
   `openSourceRepositories`), out of every list, and the page claims nothing about their licence.
   6. Contribute: the contact page's picker (a discussion or an issue, on the right repository), the guide, the code of
      conduct, the licence. */

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

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const site = dict.site;
  const channelGroups = publicChannels();
  const t = site.openSource;
  // What is open source: the platform's repositories and packages. The products are operated by Krizaka (2026-10-26) —
  // out of every list and table here, and nothing on this page says anything about their licence.
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

  const figures = [
    { id: "repositories", value: repositories.length, label: t.figures.repositories },
    { id: "npm", value: npmPackages().length, label: t.figures.npm },
    { id: "maven", value: mavenArtifactCount(), label: t.figures.maven },
    // Read from api.npmjs.org at build; absent (0) when the registry was unreachable. Maven Central publishes no download count.
    { id: "downloads", value: weeklyTotal(packages) ?? 0, label: t.figures.downloads },
  ].filter((f) => f.value > 0);
  const series = weeklySeriesTotal(packages);
  const fmt = new Intl.NumberFormat(locale);

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <SiteBar />

      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} align="center" linkAs={Link}>
        <div className="os-hero-actions">
          <ButtonLink href={GITHUB_ORG_URL} variant="primary" size="lg">
            {t.github} <ExternalIcon size={14} aria-hidden />
          </ButtonLink>
          <ButtonLink href={GOOD_FIRST_URL} variant="secondary" size="lg">
            {t.contribute.goodFirst} <ExternalIcon size={14} aria-hidden />
          </ButtonLink>
        </div>
        <div className="os-hero-figures">
          <StatGrid
            variant="strip"
            aria-label={t.figuresLabel}
            items={figures.map((f) => ({
              id: f.id,
              label: f.label,
              value: fmt.format(f.value),
              chart: f.id === "downloads" && series ? <Sparkline data={series} variant="area" width={64} /> : undefined,
            }))}
          />
          <p className="os-hero-license">{format(t.figures.license, { license: "Apache-2.0" })}</p>
        </div>
      </PageHero>

      <Section id="stack" eyebrow={t.stackEyebrow} title={t.stackTitle} lead={t.stackLead}>
        <StackGlance locale={locale} />
      </Section>

      <Section id="install" eyebrow={t.install.eyebrow} title={t.install.title} lead={t.install.lead} reveal divider>
        <InstallTabs locale={locale} />
      </Section>

      <Section
        id="packages"
        eyebrow={t.packages.eyebrow}
        title={t.packages.title}
        lead={t.packages.lead}
        reveal
        divider
      >
        <PackagesTable rows={packages} />
        <p className="os-hero-license">
          <a href={`${GITHUB_ORG_URL}?type=source`} target="_blank" rel="noopener noreferrer">
            {t.repositories.title}
          </a>
        </p>
      </Section>

      <Section id="how-it-fits" eyebrow={t.fits.eyebrow} title={t.fits.title} lead={t.fits.lead} reveal divider>
        <HowItFits layers={layers} w={t.fits} />
      </Section>

      <Section id="roadmap" eyebrow={t.roadmap.eyebrow} title={t.roadmap.title} lead={t.roadmap.lead} reveal divider>
        <ul className="os-roadmap">
          {roadmapLinks(STACK).map((r) => (
            <li key={r.id} className="os-roadmap-row">
              <span className="os-roadmap-name">{r.name}</span>
              <a href={r.issues} target="_blank" rel="noopener noreferrer">
                {t.roadmap.issues} <ExternalIcon size={11} aria-hidden />
              </a>
              <a href={r.releases} target="_blank" rel="noopener noreferrer">
                {t.roadmap.releases} <ExternalIcon size={11} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="os-hero-license">{t.roadmap.note}</p>
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
            <a href={CONDUCT_URL}>{t.contribute.conduct}</a> · <a href={LICENSE_URL}>{t.contribute.license}</a>
          </p>
        </div>
      </Section>
    </main>
  );
}
