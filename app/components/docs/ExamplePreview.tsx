import { readFileSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { exampleKey, exampleSource, type RegistryExample } from "@/lib/ui-registry";
import { UI_EXAMPLES, type UiExampleKey } from "@/lib/ui-examples";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { PreviewFrame } from "./PreviewFrame";
import { cn } from "@krizaka/ui/cn";

const THEMES = { "light": "github-light", "dark": "github-dark" } as const; // quoted keys: the ratchet reads an unquoted key as a theme variant

/* A named example of @krizaka/ui, live: the compiled example of the package rendered in place, its source (exactly
   what is rendered) in a copyable code block, and a dark/light switch on the frame only. Server Component: the source
   is read at build time from the installed package. */
export async function ExamplePreview({ title, example, locale }: { title: string; example: RegistryExample; locale: Locale }) {
  const load = UI_EXAMPLES[exampleKey(example) as UiExampleKey];
  const t = getDictionary(locale).docs.preview;
  const code = <ServerCodeBlock code={exampleSource(example)} lang="tsx" themes={THEMES} />;
  if (!load) return code;
  const { default: Example } = await load();
  return (
    <PreviewFrame label={format(t.label, { name: `${title} — ${example.title}` })} code={code}>
      <Example />
    </PreviewFrame>
  );
}

/** Width and height of a PNG (its IHDR chunk), so the screenshot reserves its space. */
function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

/* A React Native example: its story's screenshots (dark and light, following the frame's theme switch) — React Native
   has no live preview on the web — and the code to copy. Without screenshots (an example with no story), the code. */
export function NativeExamplePreview({ title, example, locale, eager = false }: { title: string; example: RegistryExample; locale: Locale; eager?: boolean }) {
  const t = getDictionary(locale).docs;
  const code = <ServerCodeBlock code={exampleSource(example)} lang="tsx" themes={THEMES} />;
  if (!example.screenshots) return <div className="kz-native-code">{code}</div>;
  const alt = format(t.component.nativeShot, { name: `${title} — ${example.title}` });
  const shot = (theme: "dark" | "light") => {
    const file = example.screenshots![theme].replace(/^examples\//, "");
    const size = pngSize(path.join(process.cwd(), "public", "ui-examples", file));
    return <Image src={`/ui-examples/${file}`} alt={alt} {...size} loading={eager ? "eager" : "lazy"} className={cn("kz-shot", "kz-shot-" + theme)} />;
  };
  return (
    <PreviewFrame label={format(t.preview.label, { name: `${title} — ${example.title}` })} code={code} stageClassName="kz-preview-stage-shot">
      {shot("dark")}
      {shot("light")}
    </PreviewFrame>
  );
}

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return <ServerCodeBlock code={code} lang={lang} themes={THEMES} />;
}
