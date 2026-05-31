"use client";

import React from "react";

export default function MartinFalconSentry({ size = 180 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 1.1}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
      className="martin-falcon-container"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          {/* Falcon Body Gradient (Orange-Red / Amber) */}
          <linearGradient id="falcon-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9f00" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* Falcon Wing Gradient (Darker Red / Crimson) */}
          <linearGradient id="falcon-wing-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Letter / Postcard Gradient (Gold / Yellow) */}
          <linearGradient id="letter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Laser scanning glow */}
          <radialGradient id="laser-scan-cone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.45" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Ambient Background Glow */}
          <radialGradient id="falcon-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9f00" stopOpacity="0.18" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="80" cy="80" r="60" fill="url(#falcon-ambient-glow)" className="ambient-falcon-glow" />

        {/* Bobbing group */}
        <g className="falcon-bobbing" transform="translate(0, 0)">
          {/* Laser Scan Cone (Active on hover) */}
          <polygon
            points="80,48 -10,170 170,170"
            fill="url(#laser-scan-cone)"
            className="falcon-scan-cone"
            opacity="0"
            style={{ pointerEvents: "none" }}
          />

          {/* Sovereign Shield Base (Local machine pedestal) */}
          <g transform="translate(80, 150)">
            <ellipse cx="0" cy="10" rx="35" ry="8" fill="rgba(0, 0, 0, 0.25)" />
            {/* Pedestal */}
            <polygon points="-30,6 30,6 22,-4 -22,-4" fill="var(--kz-surface-2)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <line x1="-15" y1="1" x2="15" y2="1" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.6" />
            {/* Status led */}
            <circle cx="0" cy="-1" r="2.5" fill="var(--kz-status-success)" className="pedestal-led" />
          </g>

          {/* Floating Data Particles */}
          <g fill="var(--kz-accent)" opacity="0.6">
            <circle cx="40" cy="130" r="1.8" className="falcon-particle-1" />
            <circle cx="120" cy="125" r="2.2" className="falcon-particle-2" />
            <circle cx="70" cy="140" r="1.5" className="falcon-particle-3" />
          </g>

          {/* Claws feet */}
          <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="72" y1="120" x2="68" y2="148" className="claw-l" />
            <line x1="88" y1="120" x2="92" y2="148" className="claw-r" />
          </g>

          {/* Martin's Electrician Toolbelt (with wire/plug details) */}
          <g className="falcon-belt" transform="translate(80, 108)">
            <rect x="-24" y="-3" width="48" height="6" rx="2" fill="#78350f" stroke="var(--kz-border-strong)" strokeWidth="1" />
            {/* Buckle */}
            <rect x="-5" y="-5" width="10" height="10" rx="1" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
            {/* Wire Loop (symbolizes Martin the electrician) */}
            <path d="M -16 2 C -16 12, -8 12, -8 2" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" />
            {/* Small tool pouch */}
            <rect x="8" y="0" width="8" height="10" rx="1.5" fill="#451a03" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
          </g>

          {/* Sovereign Local Data Box (Martin's target postcard/mail draft) */}
          <g transform="translate(80, 120)" className="sovereign-letter">
            <rect
              x="-20"
              y="-14"
              width="40"
              height="26"
              rx="4"
              fill="url(#letter-grad)"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.2"
              className="postcard-hover-tilt"
            />
            {/* Postcard stamp & lines detail */}
            <rect x="11" y="-10" width="5" height="6" fill="#ef4444" opacity="0.8" />
            <line x1="-14" y1="-4" x2="-2" y2="-4" stroke="var(--kz-surface-0)" strokeWidth="1.2" opacity="0.6" />
            <line x1="-14" y1="1" x2="4" y2="1" stroke="var(--kz-surface-0)" strokeWidth="1.2" opacity="0.6" />
            <line x1="-14" y1="6" x2="-6" y2="6" stroke="var(--kz-surface-0)" strokeWidth="1.2" opacity="0.6" />
            {/* Neon safety seal (Loi 25 compliance tag) */}
            <circle cx="-13" cy="-9" r="2.5" fill="#10b981" />
          </g>

          {/* Tail Feathers */}
          <path
            d="M 45 105 C 30 120, 25 105, 40 95 C 28 100, 22 90, 42 85 Z"
            fill="#7f1d1d"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
            className="falcon-tail"
            style={{ transformOrigin: "45px 95px" }}
          />

          {/* Main Body */}
          <path
            d="M 50 80 C 50 55, 110 55, 110 80 C 110 110, 95 120, 80 120 C 65 120, 50 110, 50 80 Z"
            fill="url(#falcon-body-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.8"
          />

          {/* Belly plate */}
          <path
            d="M 58 82 C 58 68, 102 68, 102 82 C 102 98, 93 108, 80 108 C 67 108, 58 98, 58 82 Z"
            fill="#fed7aa"
            opacity="0.35"
          />

          {/* Mechanical Left Wing */}
          <path
            d="M 52 75 C 28 45, 15 88, 48 95 C 40 80, 44 75, 52 75 Z"
            fill="url(#falcon-wing-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
            className="falcon-wing-l"
            style={{ transformOrigin: "52px 75px" }}
          />

          {/* Mechanical Right Wing */}
          <path
            d="M 108 75 C 132 45, 145 88, 112 95 C 120 80, 116 75, 108 75 Z"
            fill="url(#falcon-wing-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
            className="falcon-wing-r"
            style={{ transformOrigin: "108px 75px" }}
          />

          {/* Head Group */}
          <g className="falcon-head" style={{ transformOrigin: "80px 62px" }}>
            {/* Neck connection */}
            <path d="M 70 65 C 72 55, 88 55, 90 65 Z" fill="url(#falcon-body-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />

            {/* Head Sphere */}
            <circle cx="80" cy="48" r="20" fill="url(#falcon-body-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.8" />

            {/* Electrician Hardhat (Mascot customization!) */}
            <path d="M 58 42 C 58 24, 102 24, 102 42 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
            <path d="M 54 41 C 54 41, 80 38, 106 41" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="24" x2="80" y2="40" stroke="#d97706" strokeWidth="2.5" />

            {/* Cyber Visor */}
            <rect x="64" y="38" width="32" height="10" rx="3.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <circle cx="72" cy="43" r="2.5" fill="#00f2fe" className="falcon-eye-l" />
            <circle cx="88" cy="43" r="2.5" fill="#00f2fe" className="falcon-eye-r" />

            {/* Cyber Beak */}
            <polygon points="74,51 86,51 80,64" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          </g>
        </g>
      </svg>

      <style>{`
        /* Mascot container hover */
        .martin-falcon-container {
          cursor: pointer;
        }

        /* Ambient glow animation */
        @keyframes falcon-glow-breath {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50%      { transform: scale(1.1); opacity: 0.35; }
        }
        .ambient-falcon-glow {
          animation: falcon-glow-breath 4s ease-in-out infinite;
          transform-origin: 80px 80px;
        }

        /* Bobbing / Hover Motion */
        @keyframes falcon-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .falcon-bobbing {
          animation: falcon-bob 3.8s ease-in-out infinite;
        }
        .martin-falcon-container:hover .falcon-bobbing {
          animation: falcon-bob 1.6s ease-in-out infinite;
        }

        /* Head Nodding */
        @keyframes falcon-head-nod {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(3deg) translateY(1px); }
        }
        .falcon-head {
          animation: falcon-head-nod 3.8s ease-in-out infinite;
        }

        /* Pedestal LED pulsing */
        @keyframes led-pulse {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; filter: drop-shadow(0 0 2px var(--kz-status-success)); }
        }
        .pedestal-led {
          animation: led-pulse 1.8s infinite;
        }

        /* Visor blinking */
        @keyframes visor-eye-blink {
          0%, 93%, 100% { fill: #00f2fe; filter: drop-shadow(0 0 1px #00f2fe); }
          96%           { fill: transparent; filter: none; }
        }
        .falcon-eye-l, .falcon-eye-r {
          animation: visor-eye-blink 4.2s infinite;
        }
        .martin-falcon-container:hover .falcon-eye-l,
        .martin-falcon-container:hover .falcon-eye-r {
          fill: #f59e0b;
          filter: drop-shadow(0 0 3px #f59e0b);
          animation: none;
        }

        /* Wing flap left */
        @keyframes falcon-wing-l-flap {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-10deg) scaleY(1.04); }
        }
        .falcon-wing-l {
          animation: falcon-wing-l-flap 2.2s ease-in-out infinite;
        }
        .martin-falcon-container:hover .falcon-wing-l {
          animation: falcon-wing-l-flap 0.45s linear infinite;
        }

        /* Wing flap right */
        @keyframes falcon-wing-r-flap {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(10deg) scaleY(1.04); }
        }
        .falcon-wing-r {
          animation: falcon-wing-r-flap 2.2s ease-in-out infinite;
        }
        .martin-falcon-container:hover .falcon-wing-r {
          animation: falcon-wing-r-flap 0.45s linear infinite;
        }

        /* Tail Sway */
        @keyframes falcon-tail-sway {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-6deg); }
        }
        .falcon-tail {
          animation: falcon-tail-sway 2.6s ease-in-out infinite;
        }

        /* Laser scanning Cone */
        @keyframes scan-glow {
          0%, 100% { opacity: 0; }
          40%, 60% { opacity: 0.22; }
          50%      { opacity: 0.35; }
        }
        .martin-falcon-container:hover .falcon-scan-cone {
          animation: scan-glow 1.6s ease-in-out infinite;
        }

        /* Postcard float */
        @keyframes postcard-float {
          0%, 100% { transform: translate(80px, 120px) translateY(0) rotate(1deg); }
          50%      { transform: translate(80px, 120px) translateY(-3px) rotate(-1deg); }
        }
        .sovereign-letter {
          animation: postcard-float 3s ease-in-out infinite 0.5s;
          transform-origin: center;
        }

        /* Rising particles */
        @keyframes falcon-rise-1 {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50%  { opacity: 0.7; }
          100% { transform: translate(-10px, -25px) scale(1.1); opacity: 0; }
        }
        @keyframes falcon-rise-2 {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50%  { opacity: 0.8; }
          100% { transform: translate(12px, -30px) scale(1.1); opacity: 0; }
        }
        .falcon-particle-1 {
          animation: falcon-rise-1 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        .falcon-particle-2 {
          animation: falcon-rise-2 2.8s ease-in-out infinite 0.6s;
          transform-origin: center;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .falcon-bobbing, .falcon-head, .pedestal-led, .falcon-eye-l, .falcon-eye-r,
          .falcon-wing-l, .falcon-wing-r, .falcon-tail, .falcon-scan-cone,
          .sovereign-letter, .falcon-particle-1, .falcon-particle-2, .ambient-falcon-glow {
            animation: none !important;
            transform: none !important;
          }
          .martin-falcon-container:hover .falcon-wing-l,
          .martin-falcon-container:hover .falcon-wing-r {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
