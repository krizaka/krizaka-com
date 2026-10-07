import { ReactNode } from "react";
import { getDocsList } from "@/lib/docs";
import DocsShell from "@/app/components/DocsShell";

/* Orochia documentation: the same shell as Orazaka's (synced docs, orochia-content/docs). */
export default async function OrochiaDocsLayout({ children }: { children: ReactNode }) {
  const docs = await getDocsList("orochia");
  return (
    <DocsShell docs={docs} product={{ id: "orochia", name: "Orochia", kicker: "Documentation", overviewHref: "/products/orochia/docs", docUrls: "flat" }}>
      {children}
    </DocsShell>
  );
}
