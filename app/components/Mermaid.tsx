'use client';
/* eslint-disable react-hooks/set-state-in-effect -- the SVG is rendered asynchronously by mermaid.js into local state. */

/* Mermaid — the fallback renderer of the diagrams written inside synced docs (AGENTS.md §4: the main schemas are the
   interactive components; a ```mermaid fence in a doc is drawn here). Mermaid lays every diagram out itself, flowcharts
   included, at a readable size: the former path re-parsed flowcharts into React Flow and fitted them into a fixed
   600px box, which shrank labels until they could not be read. Wider than the column → it scrolls, it never shrinks.
   Theme-aware: re-rendered with the --kz-* values of the active theme. The source stays one click away. */

import { useCallback, useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function Mermaid({ chart }: { chart: string }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const render = useCallback(async () => {
    try {
      const mermaid = (await import('mermaid')).default;
      await document.fonts.ready; // labels are measured: measure them in the font they are drawn in
      const css = getComputedStyle(document.documentElement);
      const v = (name: string) => css.getPropertyValue(name).trim();
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        htmlLabels: false,
        themeVariables: {
          darkMode: theme === 'dark',
          background: v('--kz-surface-1'),
          primaryColor: v('--kz-surface-2'),
          primaryTextColor: v('--kz-text-primary'),
          primaryBorderColor: v('--kz-border-strong'),
          secondaryColor: v('--kz-surface-3'),
          tertiaryColor: v('--kz-surface-1'),
          lineColor: v('--kz-text-muted'),
          textColor: v('--kz-text-primary'),
          clusterBkg: v('--kz-surface-1'),
          clusterBorder: v('--kz-border-default'),
          edgeLabelBackground: v('--kz-surface-1'),
          noteBkgColor: v('--kz-surface-3'),
          noteTextColor: v('--kz-text-secondary'),
          noteBorderColor: v('--kz-border-default'),
          actorBkg: v('--kz-surface-2'),
          actorBorder: v('--kz-border-strong'),
          actorTextColor: v('--kz-text-primary'),
          actorLineColor: v('--kz-border-strong'),
          signalColor: v('--kz-text-secondary'),
          signalTextColor: v('--kz-text-primary'),
          labelBoxBkgColor: v('--kz-surface-2'),
          labelBoxBorderColor: v('--kz-border-default'),
          labelTextColor: v('--kz-text-primary'),
          loopTextColor: v('--kz-text-secondary'),
          activationBorderColor: v('--kz-accent'),
          activationBkgColor: v('--kz-accent-soft'),
          sequenceNumberColor: v('--kz-on-accent'),
          // A real family, not a var(): mermaid measures labels with it, and a mismatch clips them.
          fontFamily: getComputedStyle(document.body).fontFamily,
          fontSize: '15px',
        },
        flowchart: { useMaxWidth: false, htmlLabels: false, curve: 'basis', padding: 12, nodeSpacing: 40, rankSpacing: 52 },
        sequence: { useMaxWidth: false, mirrorActors: false, actorMargin: 64, messageMargin: 36 },
        state: { useMaxWidth: false },
        er: { useMaxWidth: false },
        class: { useMaxWidth: false },
      });
      const id = `kz-mermaid-${Math.random().toString(36).slice(2, 10)}`;
      const out = await mermaid.render(id, chart.trim());
      setSvg(out.svg);
      setFailed(false);
    } catch (err) {
      console.warn('Mermaid render failed:', err);
      setFailed(true);
    }
  }, [chart, theme]);

  useEffect(() => {
    render();
  }, [render]);

  const frame: React.CSSProperties = {
    margin: '24px 0',
    borderRadius: 14,
    border: '1px solid var(--kz-border-subtle)',
    background: 'var(--kz-surface-1)',
  };

  if (failed) {
    return (
      <pre style={{ ...frame, padding: '16px 20px', fontSize: 12.5, lineHeight: 1.6, fontFamily: 'var(--font-mono)', color: 'var(--kz-text-secondary)', overflowX: 'auto' }}>
        {chart.trim()}
      </pre>
    );
  }

  return (
    <figure className="kz-mermaid not-prose" style={{ ...frame, padding: 0 }}>
      <div style={{ overflowX: 'auto', padding: '24px 20px', minHeight: svg ? undefined : 160 }}>
        {svg && <div style={{ width: 'max-content', minWidth: '100%', display: 'flex', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: svg }} />}
      </div>
      <style>{`
        .kz-mermaid svg { max-width: none; height: auto; }
        .kz-mermaid .nodeLabel, .kz-mermaid .edgeLabel, .kz-mermaid .label { color: var(--kz-text-primary); }
        .kz-mermaid .edgeLabel { color: var(--kz-text-secondary); }
      `}</style>
    </figure>
  );
}
