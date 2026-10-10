"use client";

import { useId, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { useI18n } from "../I18nProvider";

/* The frame of a live preview: Preview / Code tabs, and a theme switch that applies to the frame only
   (`.theme-light` / `.theme-dark` of @krizaka/tokens re-declare the values on the subtree). */
export function PreviewFrame({ label, code, children }: { label: string; code: ReactNode; children: ReactNode }) {
  const { t } = useI18n();
  const text = t.docs.preview;
  const { theme: pageTheme } = useTheme();
  const [frameTheme, setFrameTheme] = useState<"light" | "dark" | null>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const id = useId();
  const theme = frameTheme ?? pageTheme;

  return (
    <div className="kz-preview not-prose">
      {/* The section's heading for assistive technology (the demo's own headings sit below it). */}
      <h2 className="sr-only">{label}</h2>
      <div className="kz-preview-bar">
        <div role="tablist" aria-label={label} className="kz-preview-tabs">
          {(["preview", "code"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              id={`${id}-${value}-tab`}
              aria-selected={tab === value}
              aria-controls={`${id}-${value}`}
              onClick={() => setTab(value)}
              className="kz-preview-tab"
            >
              {text[value]}
            </button>
          ))}
        </div>
        {tab === "preview" && (
          <button
            type="button"
            className="kz-preview-theme"
            onClick={() => setFrameTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? text.toLight : text.toDark}
            title={theme === "dark" ? text.toLight : text.toDark}
          >
            {theme === "dark" ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
          </button>
        )}
      </div>
      <div
        role="tabpanel"
        id={`${id}-preview`}
        aria-labelledby={`${id}-preview-tab`}
        hidden={tab !== "preview"}
        className={`kz-preview-stage theme-${theme}`}
      >
        {children}
      </div>
      <div role="tabpanel" id={`${id}-code`} aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"} className="kz-preview-code">
        {code}
      </div>
    </div>
  );
}
