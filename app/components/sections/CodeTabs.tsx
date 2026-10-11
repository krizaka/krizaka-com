"use client";

import type { ReactNode } from "react";
import { Tabs } from "@krizaka/ui/tabs";

/** Several ways to write the same thing (Maven · Gradle): tabs from @krizaka/ui above samples rendered on the server. */
export default function CodeTabs({ label, tabs }: { label: string; tabs: readonly { id: string; label: string; content: ReactNode }[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.id} variant="segmented" className="ps-codetabs">
      <Tabs.List aria-label={label}>
        {tabs.map((t) => (
          <Tabs.Trigger key={t.id} value={t.id}>
            {t.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((t) => (
        <Tabs.Content key={t.id} value={t.id}>
          {t.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
