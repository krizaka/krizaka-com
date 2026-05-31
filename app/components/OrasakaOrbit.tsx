"use client";

import { useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────
   ORASAKA ORBIT — Overlay rings + orbiting particle
   Designed to sit ON TOP of the krizaka.svg which already contains
   its own concentric rings (r=125, r=165). This adds:
   - Additional faint concentric rings for depth
   - A luminous amber particle orbiting on a CIRCULAR path
   - Hover-triggered scanning mode with radar sweep
   ───────────────────────────────────────────────────────────────────── */

export default function OrasakaOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    containerRef.current?.setAttribute("data-scanning", "");
  }, []);

  const handleLeave = useCallback(() => {
    containerRef.current?.removeAttribute("data-scanning");
  }, []);

  return (
    <div
      ref={containerRef}
      className="orbit-container"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ pointerEvents: "auto" }}
    >
      <svg
        className="orbit-svg"
        viewBox="0 0 460 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Extra concentric rings for depth */}
        <circle
          cx="230" cy="230" r="90"
          stroke="hsla(38, 92%, 50%, 0.06)"
          strokeWidth="0.5"
          fill="none"
          className="radar-ring radar-ring-0 radar-circle"
        />
        <circle
          cx="230" cy="230" r="135"
          stroke="hsla(38, 92%, 50%, 0.05)"
          strokeWidth="0.5"
          fill="none"
          className="radar-ring radar-ring-1 radar-circle"
        />
        <circle
          cx="230" cy="230" r="190"
          stroke="hsla(38, 92%, 50%, 0.04)"
          strokeWidth="0.5"
          fill="none"
          className="radar-ring radar-ring-2 radar-circle"
        />

        {/* Orbit track — circular, matching the SVG's outer ring radius */}
        <circle
          cx="230" cy="230" r="155"
          stroke="hsla(38, 92%, 50%, 0.06)"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="4 8"
          className="orbit-track"
        />

        {/* Radar sweep line */}
        <line
          x1="230" y1="230"
          x2="230" y2="30"
          stroke="url(#sweep-gradient)"
          strokeWidth="1"
          className="radar-sweep"
        />

        <defs>
          <linearGradient id="sweep-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsla(38, 92%, 50%, 0)" />
            <stop offset="100%" stopColor="hsla(38, 92%, 50%, 0.3)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Orbiting particle — CSS circular path */}
      <div className="orbit-particle-wrapper">
        <div className="orbit-trail" />
        <div className="orbit-particle" />
      </div>
    </div>
  );
}
