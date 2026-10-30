/* /open-source — the facts of each part of the stack and the one command to start each.
   1. factsOf: what a collection of the hub says under its line (the version read from npm / Maven Central at build,
      « In development » said honestly).
   2. InstallTabs: the real install code of each published part, with the latest versions (CodeTabs, copy). A part that
      publishes nothing (the Lab, the Skills) has no tab — no command is ever shown that would not work.
   Words: site.home.stack (each part's line) and site.openSource (the rest). */

import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { Facts, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { mavenVersion, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import { STACK, STACK_LICENCE, type StackPart } from "@/lib/stack";

const part = (id: StackPart["id"]) => STACK.find((p) => p.id === id)!;

/** What a card says under its line: the published version (or the package count), else « In development ». */
export function factsOf(p: StackPart, w: ReturnType<typeof getDictionary>["site"]): Fact[] {
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
