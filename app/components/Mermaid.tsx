'use client';
/* eslint-disable react-hooks/set-state-in-effect -- async renders the parsed
   diagram into local state for the React Flow renderer; not a render-time set. */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState, Position, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { parseMermaidToReactFlow } from '../../lib/mermaidParser';
import CustomArchitectureNode from './CustomArchitectureNode';
import CustomAnimatedEdge from './CustomAnimatedEdge';

/* ─── Native Mermaid renderer for sequence diagrams, gantt, etc. ─── */
function MermaidNativeFallback({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [renderError, setRenderError] = useState(false);

  const renderChart = useCallback(async () => {
    try {
      const mermaid = (await import('mermaid')).default;
      const css = getComputedStyle(document.documentElement);
      const accentColor = css.getPropertyValue('--kz-accent') || 'hsl(217, 92%, 60%)';
      const surfaceColor = css.getPropertyValue('--kz-surface-1') || 'hsl(240, 5%, 9%)';
      const surface2 = css.getPropertyValue('--kz-surface-2') || 'hsl(240, 5%, 13%)';
      const borderSubtle = css.getPropertyValue('--kz-border-subtle') || 'hsla(0, 0%, 100%, 0.06)';
      const borderStrong = css.getPropertyValue('--kz-border-strong') || 'hsla(0, 0%, 100%, 0.16)';
      const textPrimary = css.getPropertyValue('--kz-text-primary') || '#fff';
      const textSecondary = css.getPropertyValue('--kz-text-secondary') || '#ccc';
      
      const themeVars: Record<string, string> = {
        primaryColor: surfaceColor,
        primaryTextColor: textPrimary,
        primaryBorderColor: accentColor,
        lineColor: accentColor,
        secondaryColor: surface2,
        tertiaryColor: surfaceColor,
        noteBkgColor: surface2,
        noteTextColor: textSecondary,
        noteBorderColor: borderSubtle,
        actorBkg: surfaceColor,
        actorBorder: accentColor,
        actorTextColor: textPrimary,
        actorLineColor: borderStrong,
        signalColor: textSecondary,
        signalTextColor: textPrimary,
        labelBoxBkgColor: surfaceColor,
        labelBoxBorderColor: borderSubtle,
        labelTextColor: textPrimary,
        loopTextColor: accentColor,
        activationBorderColor: accentColor,
        activationBkgColor: 'hsla(217, 92%, 60%, 0.1)',
        sequenceNumberColor: accentColor,
        fontFamily: css.getPropertyValue('--font-mono') || 'monospace',
        fontSize: '12px',
      };

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: themeVars,
        sequence: {
          diagramMarginX: 32,
          diagramMarginY: 24,
          actorMargin: 80,
          width: 160,
          height: 45,
          boxMargin: 15,
          boxTextMargin: 8,
          noteMargin: 12,
          messageMargin: 40,
          mirrorActors: false,
          useMaxWidth: true,
          rightAngles: false,
          showSequenceNumbers: false,
        },
      });

      const uniqueId = `mermaid-native-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      let { svg } = await mermaid.render(uniqueId, chart.trim());

      // Ensure SVG scales responsively and apply a project-specific class
      if (svg && svg.indexOf('class="kz-mermaid-svg"') === -1) {
        svg = svg.replace('<svg', '<svg class="kz-mermaid-svg"');
      }

      setSvgContent(svg);
      setRenderError(false);
    } catch (err) {
      console.warn('Mermaid native render failed:', err);
      setRenderError(true);
    }
  }, [chart]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // Raw code fallback if mermaid.js itself fails
  if (renderError) {
    return (
      <div
        style={{
          margin: "24px 0",
          borderRadius: "var(--kz-radius-md)",
          border: "1px solid var(--kz-border-subtle)",
          overflow: "hidden",
          background: "var(--kz-surface-1)",
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid var(--kz-border-subtle)",
            background: "var(--kz-surface-2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--kz-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--kz-text-muted)", letterSpacing: "0.04em" }}>
            DIAGRAM SOURCE
          </span>
        </div>
        <pre
          style={{
            padding: "16px 20px",
            fontSize: 12,
            lineHeight: 1.6,
            fontFamily: "var(--font-mono)",
            color: "var(--kz-text-secondary)",
            overflowX: "auto",
            margin: 0,
          }}
        >
          {chart.trim()}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        margin: "24px 0",
        borderRadius: "var(--kz-radius-md)",
        border: "1px solid var(--kz-border-subtle)",
        overflow: "hidden",
        background: "var(--kz-surface-1)",
        boxShadow: "var(--kz-shadow-lg)",
        position: "relative",
      }}
    >
      {/* Dots background matching React Flow */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: `radial-gradient(var(--kz-border-strong) 1.5px, transparent 1.5px)`,
          backgroundSize: "20px 20px",
          opacity: 0.3,
          pointerEvents: "none",
        }} 
      />

      {/* Header */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid var(--kz-border-subtle)",
          background: "var(--kz-surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--kz-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--kz-text-muted)", letterSpacing: "0.04em" }}>
            SEQUENCE FLOW
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--kz-border-subtle)" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--kz-border-subtle)" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--kz-border-subtle)" }} />
        </div>
      </div>

      {/* SVG container */}
      <div
        style={{
          padding: "32px 16px",
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {svgContent ? (
          <div style={{ maxWidth: "100%", minWidth: 0 }}>
            <style>{`
              .kz-mermaid-svg { max-width: 100%; height: auto; display: block; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2)); }
              .kz-mermaid-svg .actor rect { rx: 8; ry: 8; fill: color-mix(in srgb, var(--kz-surface-2) 70%, transparent) !important; stroke: var(--kz-accent) !important; stroke-width: 1px !important; backdrop-filter: blur(4px); }
              .kz-mermaid-svg .actor text, .kz-mermaid-svg .actorText, .kz-mermaid-svg .label { font-family: var(--font-mono) !important; fill: var(--kz-text-primary) !important; font-size: 11px !important; font-weight: 500; }
              .kz-mermaid-svg .messageText { font-family: var(--font-mono) !important; fill: var(--kz-text-secondary) !important; font-size: 10px !important; letter-spacing: 0.02em; }
              .kz-mermaid-svg .note { fill: color-mix(in srgb, var(--kz-surface-3) 80%, transparent) !important; stroke: var(--kz-border-subtle) !important; rx: 4; ry: 4; }
              .kz-mermaid-svg .noteText { font-family: var(--font-mono) !important; fill: var(--kz-text-muted) !important; font-size: 10px !important; }
              .kz-mermaid-svg .activation { stroke: var(--kz-accent) !important; fill: var(--kz-accent-soft) !important; }
              .kz-mermaid-svg path.messageLine0, .kz-mermaid-svg path.messageLine1 { stroke: var(--kz-accent) !important; stroke-width: 1.5px !important; }
              .kz-mermaid-svg #arrowhead path { fill: var(--kz-accent) !important; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--kz-text-muted)", fontSize: 12 }}>
            Rendering diagram…
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  customArchitecture: CustomArchitectureNode,
};

const edgeTypes = {
  customAnimated: CustomAnimatedEdge,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    if (node.type === 'group') {
      dagreGraph.setNode(node.id, { label: node.data.label, paddingLeft: 30, paddingRight: 30, paddingTop: 60, paddingBottom: 30 });
    } else {
      dagreGraph.setNode(node.id, { width: 180, height: 60 });
    }
  });

  nodes.forEach((node) => {
    if (node.parentId) {
      dagreGraph.setParent(node.id, node.parentId);
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) return node;
    
    // Dagre returns absolute center coords. Convert to top-left coords.
    let x = nodeWithPosition.x - nodeWithPosition.width / 2;
    let y = nodeWithPosition.y - nodeWithPosition.height / 2;

    // React Flow requires relative positioning for children
    if (node.parentId) {
      const parentNode = dagreGraph.node(node.parentId);
      if (parentNode) {
        x -= (parentNode.x - parentNode.width / 2);
        y -= (parentNode.y - parentNode.height / 2);
      }
    }

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: { x, y },
      style: node.type === 'group' 
        ? { ...node.style, width: nodeWithPosition.width, height: nodeWithPosition.height, zIndex: -1 } 
        : { ...node.style, zIndex: 10 },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function Mermaid({ chart }: { chart: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUnsupported, setIsUnsupported] = useState(false);

  useEffect(() => {
    try {
      const parsed = parseMermaidToReactFlow(chart);
      const direction = chart.includes('direction LR') || chart.includes('graph LR') || chart.includes('flowchart LR') ? 'LR' : 'TB';
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(parsed.nodes, parsed.edges, direction);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setError(null);
      setIsUnsupported(false);
    } catch (e) {
      if (e instanceof Error && (e.message === 'UNSUPPORTED_DIAGRAM_TYPE' || e.message === 'EMPTY_GRAPH')) {
        setIsUnsupported(true);
        setError(null);
      } else {
        console.error('Failed to parse mermaid to react flow', e);
        setError(e instanceof Error ? e.message : String(e));
        setIsUnsupported(false);
      }
    }
  }, [chart, setNodes, setEdges]);

  // Unsupported diagram types rendered via native mermaid.js (sequence, gantt, etc.)
  if (isUnsupported) {
    return <MermaidNativeFallback chart={chart} />;
  }

  if (error) {
    return (
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          border: "1px solid hsla(0, 84%, 60%, 0.2)",
          padding: 16,
          borderRadius: "var(--kz-radius-md)",
          background: "hsla(0, 84%, 60%, 0.06)",
          color: "var(--kz-status-error)",
          margin: "20px 0",
        }}
      >
        Failed to render architecture diagram: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: 600,
        margin: "24px 0",
        borderRadius: "var(--kz-radius-md)",
        border: "1px solid var(--kz-border-subtle)",
        overflow: "hidden",
        background: "var(--kz-surface-1)",
        boxShadow: "var(--kz-shadow-lg)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--kz-grid-color)" variant={BackgroundVariant.Dots} gap={20} size={1.5} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
