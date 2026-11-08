/* The words of each page's share image (krizaka-internal#2833): its section (the eyebrow the page wears, or the footer's
   word for the legal pages) and its title (the page's h1), read from the messages the page itself reads, so the card and
   the page never disagree. One entry per page of the sitemap that draws its own card (the film's card is its poster). */

import { getDictionary, type TranslationDictionary } from "./i18n";

type Words = { section: string; title: string; path: string };

const PAGES = {
  home: ({ site }: TranslationDictionary): Words => ({
    section: site.home.hero.eyebrow,
    title: site.home.hero.title,
    path: "",
  }),
  docs: ({ site }: TranslationDictionary): Words => ({
    section: site.openSource.hub.eyebrow,
    title: site.openSource.hub.title,
    path: "/docs",
  }),
  services: ({ site }: TranslationDictionary): Words => ({
    section: site.services.eyebrow,
    title: site.services.title,
    path: "/services",
  }),
  story: ({ site }: TranslationDictionary): Words => ({
    section: site.story.intro.eyebrow,
    title: site.story.intro.title,
    path: "/story",
  }),
  changelog: ({ site }: TranslationDictionary): Words => ({
    section: site.changelog.eyebrow,
    title: site.changelog.title,
    path: "/changelog",
  }),
  contact: ({ site }: TranslationDictionary): Words => ({
    section: site.contactPage.eyebrow,
    title: site.contactPage.title,
    path: "/contact",
  }),
  privacy: ({ site }: TranslationDictionary): Words => ({
    section: site.footer.privacy,
    title: site.legal.privacy.title,
    path: "/privacy",
  }),
  terms: ({ site }: TranslationDictionary): Words => ({
    section: site.footer.terms,
    title: site.legal.terms.title,
    path: "/terms",
  }),
} as const;

export type SharePage = keyof typeof PAGES;
export const SHARE_PAGES = Object.keys(PAGES) as SharePage[];

/** The card of one page in one language: section, title and the address it lives at. */
export function shareCardOf(page: SharePage, locale: string) {
  const words = PAGES[page](getDictionary(locale));
  return { section: words.section, title: words.title, address: `www.krizaka.com/${locale}${words.path}` };
}
