"use client";

import { useState, type ReactNode } from "react";
import { MoonIcon, SunIcon } from "@krizaka/icons";
import { Tabs } from "@krizaka/ui/tabs";
import { useSiteTheme } from "../SiteTheme";
import { useI18n } from "../I18nProvider";
import { cn } from "@krizaka/ui/cn";

/* The frame of a live preview: Preview / Code tabs (@krizaka/ui, segmented), and a theme switch that applies to the
   frame only (`.theme-light` / `.theme-dark` of @krizaka/tokens re-declare the values on the subtree). */
export function PreviewFrame({ label, code, children, stageClassName = "" }: { label: string; code: ReactNode; children: ReactNode; stageClassName?: string }) {
  const { t } = useI18n();
  const text = t.docs.preview;
  const { theme: pageTheme } = useSiteTheme();
  const [frameTheme, setFrameTheme] = useState<"light" | "dark" | null>(null);
  const [tab, setTab] = useState("preview");
  const theme = frameTheme ?? pageTheme;

  return (
    <Tabs.Root
      variant="segmented"
      value={tab}
      onValueChange={setTab}
      role="group"
      aria-label={label}
      className="kz-preview not-prose gap-0"
    >
      <div className="kz-preview-bar">
        <Tabs.List aria-label={label}>
          <Tabs.Trigger value="preview">{text.preview}</Tabs.Trigger>
          <Tabs.Trigger value="code">{text.code}</Tabs.Trigger>
        </Tabs.List>
        {tab === "preview" && (
          <button
            type="button"
            className="kz-preview-theme"
            onClick={() => setFrameTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? text.toLight : text.toDark}
            title={theme === "dark" ? text.toLight : text.toDark}
          >
            {theme === "dark" ? <SunIcon size={14} /> : <MoonIcon size={14} />}
          </button>
        )}
      </div>
      <Tabs.Content value="preview" className={cn("kz-preview-stage rounded-none", "theme-" + theme, stageClassName)}>
        {children}
      </Tabs.Content>
      <Tabs.Content value="code" className="kz-preview-code rounded-none">
        {code}
      </Tabs.Content>
    </Tabs.Root>
  );
}
