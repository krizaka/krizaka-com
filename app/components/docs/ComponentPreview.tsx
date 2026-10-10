import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { demoSource, getRegistryItem } from "@/lib/ui-registry";
import { UI_DEMOS, type UiDemoName } from "@/lib/ui-demos";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { PreviewFrame } from "./PreviewFrame";

/* A primitive, live: the registry demo of @krizaka/ui rendered in place, its source (exactly what is rendered) in a
   copyable code block, and a dark/light switch on the frame only (study §4.3). Server Component: the source is read
   at build time from the installed package. */
export async function ComponentPreview({ name, locale }: { name: UiDemoName; locale: Locale }) {
  const [item, { default: Demo }] = await Promise.all([getRegistryItem(name), UI_DEMOS[name]()]);
  const t = getDictionary(locale).docs.preview;
  return (
    <PreviewFrame
      label={format(t.label, { name })}
      code={<ServerCodeBlock code={demoSource(item)} lang="tsx" themes={{ light: "github-light", dark: "github-dark" }} />}
    >
      <Demo />
    </PreviewFrame>
  );
}
