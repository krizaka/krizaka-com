import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { getManifestEntry, isPublished, type Audience } from './docs-manifest';

const DOCS_DIR = path.join(process.cwd(), 'orazaka-content/docs');
const README_PATH = path.join(process.cwd(), 'orazaka-content/README.md');

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

function extractTitleFromMarkdown(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Documentation';
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

export async function getDocsList(): Promise<Omit<DocContent, 'content'>[]> {
  try {
    const files = await fs.readdir(DOCS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const list = [];

    for (const file of mdFiles) {
      const slug = file.replace(/\.md$/, '').toLowerCase();

      // PUBLICATION GATE — only manifest-approved docs reach the public site.
      // Internal/contributor docs (agent rules, ADR ledgers, CI, UI guidelines)
      // are excluded by omission from the manifest.
      if (!isPublished(slug)) continue;
      const entry = getManifestEntry(slug)!;

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

export async function getDocBySlugAndCategory(category: string, slug: string): Promise<DocContent | null> {
  const list = await getDocsList();
  const docMeta = list.find(d => d.slug === slug && d.category === category);
  
  if (!docMeta) return null;
  
  try {
    const files = await fs.readdir(DOCS_DIR);
    const fileName = files.find((f) => f.replace(/\.md$/, '').toLowerCase() === slug);
    if (!fileName) return null;

    const fullPath = path.join(DOCS_DIR, fileName);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { content } = matter(fileContents);

    return { ...docMeta, content };
  } catch (error) {
    console.error(`Error loading doc for category ${category} and slug ${slug}:`, error);
    return null;
  }
}

export async function getRootReadme(): Promise<DocContent | null> {
  try {
    const fileContents = await fs.readFile(README_PATH, 'utf8');
    const { data, content } = matter(fileContents);
    
    const title = data.title || extractTitleFromMarkdown(content);
    const description = data.description || extractDescriptionFromMarkdown(content);

    return {
      slug: 'index',
      category: 'root',
      order: 0,
      title,
      description,
      content,
      frontMatter: data,
    };
  } catch (error) {
    console.error('Error loading root README:', error);
    return null;
  }
}
