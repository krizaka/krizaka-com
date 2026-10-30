/* /open-source — the stack at a glance and the one command to start (founder, 2026-10-30: « ça fait amateur »).
   1. StackGlance: one LinkCard per part of lib/stack.ts (Krizaka UI, Lab, Java, TypeScript, Skills) — its host, one line,
      its facts (the version read from npm / Maven Central at build, « In development » said honestly), the way in.
   2. InstallTabs: the real install code of each published part, with the latest versions (CodeTabs, copy). A part that
      publishes nothing (the Lab, the Skills) has no tab — no command is ever shown that would not work.
   Words: site.home.stack (each part's line) and site.openSource (the rest). */

import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, type Fact } from "@krizaka/ui/page";
import { ProductLogo } from "@krizaka/ui";
import { format, getDictionary } from "@/lib/i18n";
import { mavenVersion, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import { STACK, STACK_LICENCE, hostOf, stackActionUrl, type StackPart } from "@/lib/stack";

const part = (id: StackPart["id"]) => STACK.find((p) => p.id === id)!;

/** What a card says under its line: the published version (or the package count), else « In development ». */
function factsOf(p: StackPart, w: ReturnType<typeof getDictionary>["site"]): Fact[] {
  const s = w.openSource.stackFacts;
  if (p.status === "development") return [{ label: s.development, tone: "wip" }];
  if (p.registry === "maven" && p.coordinate) {
    const v = mavenVersion(p.coordinate.split(":")[1]);
    return v ? [{ label: `${p.coordinate.split(":")[1]} ${v}`, tone: "ok" }, { label: STACK_LICENCE }] : [];
  }
  if (p.coordinate) {
    const v = publishedVersion(p.coordinate);
    return v ? [{ label: `${p.coordinate} ${v}`, tone: "ok" }, { label: STACK_LICENCE }] : [];
  }
  const count = npmPackagesFrom(p.repoUrl).length;
  return count
    ? [{ label: format(w.home.stack.facts.npm, { count }), tone: "ok" }, { label: STACK_LICENCE }]
    : [{ label: s.notPublished, tone: "wip" }];
}

/** The card's way in: « Explore … » for a site, « Open the lab » for the lab. */
function ctaOf(w: object, fallback: string): string {
  if ("explore" in w && typeof w.explore === "string") return w.explore;
  if ("lab" in w && typeof w.lab === "string") return w.lab;
  return fallback;
}

/** Published parts first (three across), then what is built in the open (the Lab, the Skills): two rows, no orphan card. */
export function StackGlance({ locale }: { locale: string }) {
  const site = getDictionary(locale).site;
  const words = site.home.stack;
  const card = (p: StackPart) => {
    const w = words[p.id];
    return (
      <LinkCard
        key={p.id}
        href={stackActionUrl(p)}
        title={p.name}
        meta={hostOf(p.url)}
        description={w.line}
        icon={<ProductLogo id="krizaka" size={22} animated={false} />}
        extra={<Facts items={factsOf(p, site)} />}
        cta={ctaOf(w, p.name)}
        layout="stack"
        titleAs="h3"
      />
    );
  };
  const released = STACK.filter((p) => p.status === "released");
  const building = STACK.filter((p) => p.status === "development");
  return (
    <div className="os-glance">
      <CardGrid min={260} columns={3} fit="fit">
        {released.map(card)}
      </CardGrid>
      {building.length > 0 && (
        <>
          <p className="os-glance-label">{site.openSource.stackFacts.development}</p>
          <CardGrid min={260} columns={2} fit="fit">
            {building.map(card)}
          </CardGrid>
        </>
      )}
    </div>
  );
}

export function InstallTabs({ locale }: { locale: string }) {
  const w = getDictionary(locale).site.openSource.install;
  const ui = part("ui");
  const ts = part("ts");
  const bom = mavenVersion("krizaka-bom");
  const uiVersion = ui.coordinate ? publishedVersion(ui.coordinate) : undefined;
  const tsPackages = npmPackagesFrom(ts.repoUrl);
  const block = (code: string, language: string, file: string) => (
    <CodeBlock code={code} language={language} file={file} copyLabel={w.copy} copiedLabel={w.copied} />
  );
  const tabs = [
    uiVersion && {
      id: "ui",
      label: ui.name,
      content: block(
        `npm install @krizaka/ui@${uiVersion} @krizaka/tokens @krizaka/tailwind\n\n# app/globals.css\n@import "tailwindcss";\n@import "@krizaka/tailwind";\n@import "@krizaka/ui/tailwind.css";`,
        "bash",
        "terminal",
      ),
    },
    bom && {
      id: "maven",
      label: "Krizaka Java · Maven",
      content: block(
        `<dependencyManagement>\n  <dependencies>\n    <dependency>\n      <groupId>com.krizaka</groupId>\n      <artifactId>krizaka-bom</artifactId>\n      <version>${bom}</version>\n      <type>pom</type>\n      <scope>import</scope>\n    </dependency>\n  </dependencies>\n</dependencyManagement>`,
        "xml",
        "pom.xml",
      ),
    },
    bom && {
      id: "gradle",
      label: "Krizaka Java · Gradle",
      content: block(
        `dependencies {\n  implementation(platform("com.krizaka:krizaka-bom:${bom}"))\n}`,
        "kotlin",
        "build.gradle.kts",
      ),
    },
    tsPackages.length > 0 && {
      id: "ts",
      label: ts.name,
      content: block(["npm install", ...tsPackages.map((name) => `  ${name}`)].join(" \\\n"), "bash", "terminal"),
    },
  ].filter((t): t is { id: string; label: string; content: React.JSX.Element } => Boolean(t));
  return tabs.length ? <CodeTabs label={w.tabs} tabs={tabs} /> : null;
}
