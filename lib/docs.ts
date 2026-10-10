import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { DOCS_MANIFEST, type Audience, type DocManifestEntry } from './docs-manifest';
import { OROCHIA_DOCS_MANIFEST } from './orochia-docs-manifest';

/** Each product publishes the docs synced from its own repository, gated by its own manifest. */
export type Product = 'orazaka' | 'orochia';

const ORAZAKA_DOCS_DIR = path.join(process.cwd(), 'orazaka-content/docs');
const OROCHIA_DOCS_DIR = path.join(process.cwd(), 'orochia-content/docs');

// Explicit per product (not a lookup table) so the bundler traces exactly these two folders.
function productDocs(product: Product): { dir: string; manifest: Record<string, DocManifestEntry> } {
  return product === 'orochia'
    ? { dir: OROCHIA_DOCS_DIR, manifest: OROCHIA_DOCS_MANIFEST }
    : { dir: ORAZAKA_DOCS_DIR, manifest: DOCS_MANIFEST };
}

export interface DocContent {
  slug: string;
  category: string;
  order: number;
  title: string;
  description: string;
  content: string; // Raw MDX content
  frontMatter: Record<string, unknown>;
  /** Curated human intro (what is this, who is it for) from the manifest. */
  intro?: string;
  /** Audience badge from the manifest. */
  audience?: Audience;
}

function extractDescriptionFromMarkdown(markdown: string): string {
  const paragraphs = markdown.split(/\n\s*\n/);
  for (const p of paragraphs) {
    if (!p.startsWith('#') && !p.startsWith('---') && p.trim().length > 0) {
      return p.replace(/^>\s*/m, '').replace(/\*|`|_/g, '').trim().substring(0, 160);
    }
  }
  return '';
}

export async function getDocsList(product: Product = 'orazaka'): Promise<Omit<DocContent, 'content'>[]> {
  const { dir: DOCS_DIR, manifest } = productDocs(product);
  try {
    const files = await fs.readdir(DOCS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const list = [];

    for (const file of mdFiles) {
      const slug = file.replace(/\.md$/, '').toLowerCase();

      // PUBLICATION GATE — only manifest-approved docs reach the public site.
      // Internal/contributor docs (agent rules, ADR ledgers, CI, UI guidelines)
      // are excluded by omission from the manifest.
      const entry = manifest[slug];
      if (!entry) continue;

      const content = await fs.readFile(path.join(DOCS_DIR, file), 'utf8');
      const { data, content: rawContent } = matter(content);

      // Manifest is authoritative for title/category/order; description falls
      // back to the doc's own first paragraph.
      const description = data.description || extractDescriptionFromMarkdown(rawContent);

      list.push({
        slug,
        category: entry.category,
        order: entry.order,
        title: entry.title,
        description,
        frontMatter: data,
        intro: entry.intro,
        audience: entry.audience,
      });
    }

    list.sort((a, b) => a.order - b.order);
    return list;
  } catch (error) {
    console.error('Error reading docs directory:', error);
    return [];
  }
}
