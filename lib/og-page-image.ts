/* The share image route of a page that has a card in lib/og-pages.ts: one factory, so the route files stay four lines
   (the `size`, `contentType` and `alt` exports must live in each route file, Next reads them there). */

import { shareImage } from "./og-card";
import { shareCardOf, type SharePage } from "./og-pages";

export const pageShareImage =
  (page: SharePage) =>
  async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    return shareImage(shareCardOf(page, locale));
  };
