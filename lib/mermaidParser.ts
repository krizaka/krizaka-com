import { Node, Edge } from '@xyflow/react';
import dagre from '@dagrejs/dagre';

/**
 * Detects non-graph Mermaid diagram types that cannot be rendered
 * as a node/edge graph (e.g. sequenceDiagram, gantt, pie, etc.)
 */
function isUnsupportedDiagramType(code: string): boolean {
  const firstLine = code.trim().split('\n')[0].trim().toLowerCase();
  const unsupported = [
    'sequencediagram', 'gantt', 'pie', 'erdiagram', 'journey',
    'classdiagram', 'statediagram', 'gitgraph', 'mindmap',
    'timeline', 'sankey', 'block', 'xychart', 'packet',
    'architecture', 'kanban', 'requirement',
  ];
  return unsupported.some(t => firstLine.startsWith(t));
}

/**
 * Robust node definition parser that handles:
 *   A["Label with (parens) & special chars"]
 *   B((Circle))
 *   C{Diamond}
 *   D>Flag]
 *   E[Simple]
 *   F
 */
function parseNodeDef(str: string): { id: string; label: string } {
  str = str.trim();
  if (!str) return { id: '', label: '' };

  // Match: ID followed by optional bracket-delimited label
  // Use a non-greedy approach: find the ID, then everything after is the label wrapper
  const idMatch = str.match(/^([a-zA-Z0-9_-]+)/);
  if (!idMatch) return { id: str.replace(/[^a-zA-Z0-9_-]/g, ''), label: str };

  const id = idMatch[1];
  const rest = str.slice(id.length).trim();

  if (!rest) return { id, label: id };

  // Extract label from any bracket pair: [...], (...), {...}, >...]
  // Find the innermost text between the first opening and last closing bracket
  let label = rest;

  // Strip outer brackets layer by layer
  const bracketPairs = [
    [/^\[+"?/, /"?\]+$/],
    [/^\(+/, /\)+$/],
    [/^\{+/, /\}+$/],
    [/^>+/, /\]+$/],
  ];

  for (const [open, close] of bracketPairs) {
    if (open.test(label) && close.test(label)) {
      label = label.replace(open, '').replace(close, '');
      break;
    }
  }

  // Clean up remaining quotes
  if (label.startsWith('"') && label.endsWith('"')) {
    label = label.slice(1, -1);
  }

  return { id, label: label || id };
}

export function parseMermaidToReactFlow(mermaidCode: string): { nodes: Node[], edges: Edge[] } {
  if (isUnsupportedDiagramType(mermaidCode)) {
    throw new Error('UNSUPPORTED_DIAGRAM_TYPE');
  }

  // Use a NON-compound graph to avoid dagre rank crashes with parent/child inconsistencies
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 80 });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodesMap = new Map<string, { id: string; label: string; parent: string | null; isGroup: boolean }>();
  const edgesList: Array<{ id: string; source: string; target: string; label?: string; isDashed: boolean }> = [];

  let currentSubgraph: string | null = null;
  const subgraphStack: string[] = [];
  const lines = mermaidCode.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'));

  // Edge detection regex — handles -->, ===>, -.->
  const EDGE_REGEX = /^(.+?)\s*(--+>|==+>|-\.+-?>|--+)\s*(?:\|([^|]*)\|)?\s*(.+)$/;

  for (const line of lines) {
    // Skip graph/flowchart declaration
    if (/^(?:graph|flowchart)\s+/i.test(line)) {
      const dirMatch = line.match(/(?:graph|flowchart)\s+([A-Z]+)/);
      if (dirMatch) {
        dagreGraph.setGraph({ ...dagreGraph.graph(), rankdir: dirMatch[1] });
      }
      continue;
    }

    if (/^direction\s+/i.test(line)) {
      const dirMatch = line.match(/direction\s+([A-Z]+)/);
      if (dirMatch) {
        dagreGraph.setGraph({ ...dagreGraph.graph(), rankdir: dirMatch[1] });
      }
      continue;
    }

    // Skip style/class/click/linkStyle directives
    if (/^(?:style|classDef|class|click|linkStyle)\s/i.test(line)) continue;

    // Subgraph open
    if (/^subgraph\s/i.test(line)) {
      const match = line.match(/^subgraph\s+([a-zA-Z0-9_-]+)(?:\s*\["?([^"]*)"?\])?/i);
      if (match) {
        const sgId = match[1];
        const sgLabel = match[2] || sgId;
        if (currentSubgraph) subgraphStack.push(currentSubgraph);
        currentSubgraph = sgId;
        nodesMap.set(sgId, { id: sgId, label: sgLabel, parent: null, isGroup: true });
        dagreGraph.setNode(sgId, { label: sgLabel, width: 300, height: 200 });
      }
      continue;
    }

    // Subgraph close
    if (line === 'end') {
      currentSubgraph = subgraphStack.pop() || null;
      continue;
    }

    // Try to match an edge
    const edgeMatch = line.match(EDGE_REGEX);
    if (edgeMatch) {
      const src = parseNodeDef(edgeMatch[1]);
      const tgt = parseNodeDef(edgeMatch[4]);
      const arrowType = edgeMatch[2];
      const edgeLabel = edgeMatch[3];

      // Validate node IDs
      if (!src.id || !tgt.id || src.id.length > 80 || tgt.id.length > 80) continue;

      // Register nodes
      for (const def of [src, tgt]) {
        if (!nodesMap.has(def.id)) {
          nodesMap.set(def.id, { id: def.id, label: def.label, parent: currentSubgraph, isGroup: false });
          dagreGraph.setNode(def.id, { label: def.label, width: 220, height: 80 });
        } else {
          const existing = nodesMap.get(def.id)!;
          if (existing.label === existing.id && def.label !== def.id) {
            existing.label = def.label;
            const n = dagreGraph.node(def.id);
            if (n) n.label = def.label;
          }
        }
      }

      const isDashed = arrowType.includes('.');
      edgesList.push({
        id: `e-${src.id}-${tgt.id}-${edgesList.length}`,
        source: src.id,
        target: tgt.id,
        label: edgeLabel,
        isDashed,
      });
      dagreGraph.setEdge(src.id, tgt.id);
    } else {
      // Single node declaration
      const def = parseNodeDef(line);
      if (def.id && def.id !== 'end' && def.id.length <= 80 && !nodesMap.has(def.id)) {
        nodesMap.set(def.id, { id: def.id, label: def.label, parent: currentSubgraph, isGroup: false });
        dagreGraph.setNode(def.id, { label: def.label, width: 220, height: 80 });
      }
    }
  }

  // Validate: remove edges referencing non-existent dagre nodes
  const validNodeIds = new Set(dagreGraph.nodes());
  const cleanEdges = edgesList.filter(e => {
    if (!validNodeIds.has(e.source) || !validNodeIds.has(e.target)) {
      try { dagreGraph.removeEdge(e.source, e.target); } catch { /* ignore */ }
      return false;
    }
    return true;
  });

  if (nodesMap.size === 0) {
    throw new Error('EMPTY_GRAPH');
  }

  // Layout with try/catch — dagre can still crash on edge cases
  try {
    dagre.layout(dagreGraph);
  } catch (err) {
    console.warn('Dagre layout failed, using fallback grid layout', err);
    // Fallback: arrange nodes in a grid
    let idx = 0;
    const cols = Math.ceil(Math.sqrt(nodesMap.size));
    nodesMap.forEach((n) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      dagreGraph.setNode(n.id, {
        ...(dagreGraph.node(n.id) || {}),
        x: col * 280 + 140,
        y: row * 120 + 60,
        width: 220,
        height: 80,
      });
      idx++;
    });
  }

  const reactFlowNodes: Node[] = [];
  const reactFlowEdges: Edge[] = [];

  // Build nodes — groups first for proper z-ordering
  const groups: typeof reactFlowNodes = [];
  const regular: typeof reactFlowNodes = [];

  nodesMap.forEach((n) => {
    const dagreNode = dagreGraph.node(n.id);
    if (!dagreNode) return;

    const w = dagreNode.width || 220;
    const h = dagreNode.height || 80;
    const x = (dagreNode.x || 0) - w / 2;
    const y = (dagreNode.y || 0) - h / 2;

    if (n.isGroup) {
      groups.push({
        id: n.id,
        type: 'group',
        data: { label: n.label },
        position: { x, y },
        style: {
          width: w,
          height: h,
          backgroundColor: 'rgba(24, 24, 27, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: 'rgba(245, 158, 11, 0.7)',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          paddingTop: '8px',
          paddingLeft: '12px',
          fontFamily: 'var(--font-mono)',
          backdropFilter: 'blur(4px)',
          zIndex: -1,
        },
      });
    } else {
      regular.push({
        id: n.id,
        type: 'customArchitecture',
        data: { label: n.label },
        position: { x, y },
      });
    }
  });

  reactFlowNodes.push(...groups, ...regular);

  cleanEdges.forEach((e) => {
    // Skip edges connected to groups to avoid React Flow warnings about missing handles
    if (nodesMap.get(e.source)?.isGroup || nodesMap.get(e.target)?.isGroup) return;

    reactFlowEdges.push({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'customAnimated',
      animated: e.isDashed,
      label: e.label,
    });
  });

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
}
