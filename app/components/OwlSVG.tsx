"use client";

import { motion } from "framer-motion";

/* ─── Owl Mascot SVG (Cognitive Engine identity) ─── */
export function OwlSVG({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="showcase-owl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <g>
        {/* Body */}
        <path
          d="M 18 22 C 18 10, 42 10, 42 22 C 42 38, 36 45, 30 45 C 24 45, 18 38, 18 22 Z"
          fill="url(#showcase-owl-grad)"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
        />
        {/* Eyes */}
        <motion.g
          animate={{ scaleY: [1, 1, 1, 0.1, 1, 1, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.43, 0.46, 0.5, 0.6, 1] }}
          style={{ transformOrigin: "30px 18px" }}
        >
          <circle cx="24" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
          <circle cx="36" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
          <circle cx="24" cy="18" r="1.5" fill="#00ff66" />
          <circle cx="36" cy="18" r="1.5" fill="#00ff66" />
        </motion.g>
        {/* Beak */}
        <polygon points="28,20 32,20 30,25" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
        {/* Ears */}
        <motion.polygon
          points="20,11 24,14 18,18"
          fill="#7c3aed"
          stroke="var(--kz-border-strong)" strokeWidth="1"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "24px 14px" }}
        />
        <motion.polygon
          points="40,11 36,14 42,18"
          fill="#7c3aed"
          stroke="var(--kz-border-strong)" strokeWidth="1"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "36px 14px" }}
        />
      </g>
    </svg>
  );
}
