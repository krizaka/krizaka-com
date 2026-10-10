import type { ReactNode } from "react";
import { DocsChrome } from "@/app/components/docs/DocsChrome";

/* Every documentation page: Fumadocs' search and interface texts, under the site's theme and i18n. */
export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return <DocsChrome>{children}</DocsChrome>;
}
