"use client";

import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

interface CustomEdgeProps extends EdgeProps {
  data?: {
    firing?: boolean;
    phase?: "ingress" | "core" | "egress";
  };
}

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: CustomEdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isFiring = data?.firing;
  const phase = data?.phase || "core";

  // Particle styling based on phase
  const getParticleColor = () => {
    switch (phase) {
      case "ingress":
        return {
          bg: "rgba(99, 102, 241, 0.15)",
          active: "rgba(99, 102, 241, 0.85)",
          particle: "#818cf8",
          glow: "rgba(129, 140, 248, 0.4)",
        };
      case "egress":
        return {
          bg: "rgba(168, 85, 247, 0.15)",
          active: "rgba(168, 85, 247, 0.85)",
          particle: "#c084fc",
          glow: "rgba(192, 132, 252, 0.4)",
        };
      case "core":
      default:
        return {
          bg: "rgba(59, 130, 246, 0.15)",
          active: "rgba(59, 130, 246, 0.85)",
          particle: "#60a5fa",
          glow: "rgba(96, 165, 250, 0.4)",
        };
    }
  };

  const colors = getParticleColor();

  return (
    <>
      <style>{`
        @keyframes edge-flow {
          from {
            stroke-dashoffset: 16;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Glowing background conduit when active */}
      {isFiring && (
        <BaseEdge
          path={edgePath}
          style={{
            stroke: colors.particle,
            strokeWidth: 5,
            opacity: 0.35,
            filter: "blur(3px)",
            transition: "opacity 300ms ease",
          }}
        />
      )}

      {/* Background path — faint default layer or flowing dash when active */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isFiring ? colors.active : colors.bg,
          strokeWidth: isFiring ? 1.8 : 1.0,
          strokeDasharray: isFiring ? "8 8" : undefined,
          animation: isFiring ? "edge-flow 1s linear infinite" : undefined,
          transition: "stroke 300ms ease, stroke-width 300ms ease",
        }}
      />

      {/* Animated token/particle traveling along the path */}
      {isFiring && (
        <g>
          {/* Particle outer glow */}
          <circle r="7" fill={colors.glow}>
            <animateMotion
              dur="1.0s"
              repeatCount="indefinite"
              path={edgePath}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>

          {/* Particle inner core */}
          <circle r="3.5" fill={colors.particle}>
            <animateMotion
              dur="1.0s"
              repeatCount="indefinite"
              path={edgePath}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        </g>
      )}
    </>
  );
}
