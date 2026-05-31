import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

/* On-brand animated edge — electric-blue accent, theme-aware. The marching-dash
   animation is paused globally under prefers-reduced-motion (globals.css). */
export default function CustomAnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: "var(--kz-accent)", strokeOpacity: 0.14, strokeWidth: 2 }}
      />
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          stroke: "var(--kz-accent)",
          strokeOpacity: 0.85,
          strokeWidth: 2,
          strokeDasharray: "6, 24",
          animation: "dashdraw 1.5s linear infinite",
        }}
      />
      {label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect
            x="-60"
            y="-12"
            width="120"
            height="24"
            fill="var(--kz-surface-1)"
            rx="6"
            stroke="var(--kz-accent)"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            fill="var(--kz-text-secondary)"
            fontSize="10"
            fontFamily="var(--font-mono, monospace)"
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      )}
      <style>
        {`
          @keyframes dashdraw {
            from { stroke-dashoffset: 30; }
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </>
  );
}
