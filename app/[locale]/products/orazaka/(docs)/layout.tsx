import { ReactNode } from "react";
import { getDocsList } from "@/lib/docs";
import DocsShell from "@/app/components/DocsShell";

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const docs = await getDocsList("orazaka");
  return (
    <DocsShell docs={docs} product={{ id: "orazaka", name: "Orazaka", kicker: "Documentation", overviewHref: "/products/orazaka", docUrls: "category" }}>
      {children}
    </DocsShell>
  );
}
