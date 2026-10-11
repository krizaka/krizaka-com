import type { TOCItemType } from "fumadocs-core/toc";
import { CodeBlock } from "./ExamplePreview";
import { IconGallery } from "./IconGallery";
import { InlineCode } from "./InlineCode";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { KRIZAKA_UI_REPO_URL } from "@/lib/site";
import { iconEntries, iconGroups, iconGuidelines } from "@/lib/ui-foundations";
import { packageVersion } from "@/lib/package-version";

/* /docs/ui/icons, generated from @krizaka/icons: the set (glyphIndex: name, component, group, keywords) in a
   searchable gallery, and the words of the package (iconGroups, iconGuidelines). Server Component; the gallery is the
   only client part and receives the index as props. */

const INSTALL = "npm install @krizaka/icons\n# React Native: npx expo install react-native-svg";
const USAGE = `import { ChatIcon, SearchIcon } from "@krizaka/icons";

<ChatIcon />                                   // decorative: aria-hidden, 24 px, currentColor
<ChatIcon title="Sovereign chat" size={20} />   // an image with an accessible name
<ChatIcon nodeColor="var(--kz-accent)" />        // the node lit with the brand accent
<button aria-label="Search" className="text-fg-secondary hover:text-fg"><SearchIcon size={20} /></button>

// React Native
import { ChatIcon as NativeChatIcon } from "@krizaka/icons/native";
<NativeChatIcon color={theme.textPrimary} nodeColor={theme.accent} title="Chat" />`;
const ISSUE_URL = `${KRIZAKA_UI_REPO_URL}/issues/new?title=${encodeURIComponent("icons: ")}`;

export function iconsToc(t: TranslationDictionary): TOCItemType[] {
  const c = t.docs.foundations;
  return [
    ["icon-set", c.icons.set],
    ["installation", c.installation],
    ["grammar", c.icons.grammar],
    ["sizes", c.icons.sizeGuide],
    ["color", c.icons.color],
    ["accessibility", c.icons.accessibility],
    ["request", c.icons.request],
  ].map(([id, title]) => ({ title, url: `#${id}`, depth: 2 }));
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul lang="en">
      {items.map((text) => (
        <li key={text}>
          <InlineCode text={text} />
        </li>
      ))}
    </ul>
  );
}

export function IconsDoc({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.docs.foundations;
  const ic = c.icons;
  const groups = iconGroups.map((g) => ({ id: g.id, title: g.title }));

  return (
    <>
      <IconGallery icons={iconEntries()} groups={groups} />
      <dl className="kz-type-dl" lang="en">
        {iconGroups.map((g) => (
          <div key={g.id}>
            <dt>{g.title}</dt>
            <dd>{g.description}</dd>
          </div>
        ))}
      </dl>

      <h2 id="installation">{c.installation}</h2>
      <p>{ic.installIntro}</p>
      <CodeBlock code={INSTALL} lang="bash" />
      <CodeBlock code={USAGE} lang="tsx" />

      <h2 id="grammar">{ic.grammar}</h2>
      <List items={iconGuidelines.grammar} />

      <h2 id="sizes">{ic.sizeGuide}</h2>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={ic.sizeGuide}>
        <table className="kz-table">
          <thead>
            <tr>
              <th scope="col">{ic.size}</th>
              <th scope="col">{ic.use}</th>
            </tr>
          </thead>
          <tbody>
            {iconGuidelines.sizes.map(({ size, use }) => (
              <tr key={size}>
                <th scope="row">{size} px</th>
                <td lang="en">
                  <InlineCode text={use} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="color">{ic.color}</h2>
      <List items={iconGuidelines.color} />

      <h2 id="accessibility">{ic.accessibility}</h2>
      <List items={iconGuidelines.accessibility} />

      <h2 id="request">{ic.request}</h2>
      <List items={iconGuidelines.request} />
      <p>
        <a href={ISSUE_URL}>{ic.requestCta} →</a>
      </p>

      <p className="kz-component-source not-prose">
        <span>{format(c.source, { packages: `@krizaka/icons@${packageVersion("icons")}` })}</span>
        <a href={`${KRIZAKA_UI_REPO_URL}/blob/main/packages/icons/scripts/glyphs.mjs`}>{c.edit}</a>
      </p>
    </>
  );
}
