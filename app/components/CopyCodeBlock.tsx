"use client";

import { useState, useCallback, useRef, ReactNode } from "react";

export default function CopyCodeBlock({
  children,
  language,
}: {
  children: ReactNode;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    const text = preRef.current?.querySelector("pre")?.textContent || "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleShare = useCallback(() => {
    const text = preRef.current?.querySelector("pre")?.textContent || "";
    if (navigator.share) {
      navigator.share({ title: "Code snippet", text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div
      ref={preRef}
      style={{
        margin: "20px 0",
        borderRadius: "var(--kz-radius-md)",
        border: "1px solid var(--kz-border-subtle)",
        overflow: "hidden",
        background: "var(--kz-surface-1)",
        position: "relative",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px 6px 16px",
          borderBottom: "1px solid var(--kz-border-subtle)",
          background: "var(--kz-surface-2)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--kz-text-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {language || "code"}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Share button */}
          <button
            onClick={handleShare}
            aria-label="Share code"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 6,
              background: "transparent",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              color: "var(--kz-text-muted)",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--kz-text-primary)";
              e.currentTarget.style.background = "var(--kz-surface-3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--kz-text-muted)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "4px 10px",
              background: copied ? "hsla(160, 84%, 39%, 0.1)" : "transparent",
              border: `1px solid ${copied ? "hsla(160, 84%, 39%, 0.3)" : "var(--kz-border-subtle)"}`,
              borderRadius: 6,
              cursor: "pointer",
              color: copied ? "var(--kz-status-success)" : "var(--kz-text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.color = "var(--kz-text-primary)";
                e.currentTarget.style.borderColor = "var(--kz-border-default)";
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.color = "var(--kz-text-muted)";
                e.currentTarget.style.borderColor = "var(--kz-border-subtle)";
              }
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div
        style={{
          padding: "16px 20px",
          overflowX: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
