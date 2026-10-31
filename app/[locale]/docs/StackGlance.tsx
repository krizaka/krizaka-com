/* /docs — the one command to start each part of the stack.
   InstallTabs: the real install code of each published part, with the latest versions (CodeTabs, copy). A part that
      publishes nothing (the Lab, the Skills) has no tab — no command is ever shown that would not work.
   Words: site.home.stack (each part's line) and site.openSource (the rest). */

import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { getDictionary } from "@/lib/i18n";
import { mavenVersion, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import { STACK, type StackPart } from "@/lib/stack";

const part = (id: StackPart["id"]) => STACK.find((p) => p.id === id)!;

/** `skip`: the parts a page already shows step by step (the quick start of the hub draws Krizaka UI in three steps). */
export function InstallTabs({ locale, skip = [] }: { locale: string; skip?: readonly string[] }) {
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
  ]
    .filter((t): t is { id: string; label: string; content: React.JSX.Element } => Boolean(t))
    .filter((t) => !skip.includes(t.id));
  return tabs.length ? <CodeTabs label={w.tabs} tabs={tabs} /> : null;
}
