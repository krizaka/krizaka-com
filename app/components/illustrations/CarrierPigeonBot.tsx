"use client";

import React from "react";

export default function CarrierPigeonBot({ size = 120 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
      className="pigeon-bot-container"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          {/* Cyber gradients */}
          <linearGradient id="pigeon-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" /> {/* Cyan */}
            <stop offset="100%" stopColor="#6366f1" /> {/* Indigo */}
          </linearGradient>

          <linearGradient id="pigeon-wing-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" /> {/* Pink */}
            <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
          </linearGradient>

          <linearGradient id="package-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" /> {/* Gold */}
            <stop offset="100%" stopColor="#ef4444" /> {/* Orange-Red */}
          </linearGradient>

          <radialGradient id="package-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="holo-scan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow behind the pigeon */}
        <circle cx="80" cy="70" r="45" fill="url(#holo-scan)" className="ambient-pigeon-glow" />

        {/* Outer Group with Bobbing/Hover motion */}
        <g className="pigeon-bobbing" transform="translate(0, 0)">
          {/* Floating Data Particles */}
          <g fill="var(--kz-accent)" opacity="0.8">
            <circle cx="50" cy="115" r="2" className="pigeon-particle-1" />
            <circle cx="95" cy="120" r="1.5" className="pigeon-particle-2" />
            <circle cx="68" cy="105" r="2.5" className="pigeon-particle-3" />
          </g>

          {/* Claws holding the cables */}
          <g stroke="var(--kz-border-strong)" strokeWidth="1.5" strokeLinecap="round">
            {/* Suspender Cables */}
            <line x1="72" y1="80" x2="68" y2="110" />
            <line x1="88" y1="80" x2="92" y2="110" />
          </g>

          {/* Claws feet */}
          <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="70" y1="76" x2="74" y2="82" />
            <line x1="74" y1="76" x2="70" y2="82" />
            <line x1="86" y1="76" x2="90" y2="82" />
            <line x1="90" y1="76" x2="86" y2="82" />
          </g>

          {/* Isometric Glowing Package */}
          <g transform="translate(80, 120)" className="isometric-package">
            {/* Package Glow */}
            <circle cx="0" cy="0" r="24" fill="url(#package-ambient-glow)" className="packet-glow-breath" />

            {/* Left face */}
            <polygon points="0,0 -14,-8 -14,8 0,16" fill="#d97706" stroke="var(--kz-border-strong)" strokeWidth="1" />
            {/* Right face */}
            <polygon points="0,0 14,-8 14,8 0,16" fill="#b45309" stroke="var(--kz-border-strong)" strokeWidth="1" />
            {/* Top face */}
            <polygon points="0,-16 -14,-8 0,0 14,-8" fill="url(#package-body-grad)" stroke="var(--kz-border-strong)" strokeWidth="1" />

            {/* Neon Accent Lines on Package */}
            <polyline points="-14,-8 0,0 14,-8" fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="1.2" opacity="0.9" className="package-strip-neon" />
          </g>

          {/* Tail Feathers */}
          <path
            d="M 38 68 C 24 72, 20 62, 34 54 C 22 56, 18 48, 36 46 Z"
            fill="#4338ca"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
            className="pigeon-tail"
            style={{ transformOrigin: "38px 56px" }}
          />

          {/* Main Body */}
          <path
            d="M 45 54 C 45 34, 95 34, 95 54 C 95 76, 82 82, 70 82 C 58 82, 45 76, 45 54 Z"
            fill="url(#pigeon-body-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.6"
          />

          {/* Belly plate */}
          <path
            d="M 52 56 C 52 44, 88 44, 88 56 C 88 68, 80 74, 70 74 C 60 74, 52 68, 52 56 Z"
            fill="#38bdf8"
            opacity="0.25"
          />

          {/* Mechanical Left Wing */}
          <path
            d="M 48 48 C 30 25, 20 62, 42 66 C 36 54, 40 50, 48 48 Z"
            fill="url(#pigeon-wing-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
            className="pigeon-wing-l"
            style={{ transformOrigin: "48px 48px" }}
          />

          {/* Mechanical Right Wing */}
          <path
            d="M 92 48 C 110 25, 120 62, 98 66 C 104 54, 100 50, 92 48 Z"
            fill="url(#pigeon-wing-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
            className="pigeon-wing-r"
            style={{ transformOrigin: "92px 48px" }}
          />

          {/* Head Group */}
          <g className="pigeon-head" style={{ transformOrigin: "70px 42px" }}>
            {/* Neck Connection */}
            <path d="M 62 44 C 64 36, 76 36, 78 44 Z" fill="url(#pigeon-body-grad)" stroke="var(--kz-border-strong)" strokeWidth="1" />

            {/* Head Sphere */}
            <circle cx="70" cy="30" r="16" fill="url(#pigeon-body-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.6" />

            {/* Cyber Visor */}
            <rect x="58" y="21" width="24" height="8" rx="2.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="64" cy="25" r="2" fill="#00f2fe" className="pigeon-eye-l" />
            <circle cx="76" cy="25" r="2" fill="#00f2fe" className="pigeon-eye-r" />

            {/* Beak */}
            <polygon points="66,32 74,32 70,42" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
            
            {/* Small Head Antenna */}
            <line x1="70" y1="14" x2="70" y2="6" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
            <circle cx="70" cy="5" r="1.5" fill="#d946ef" className="pigeon-antenna-light" />
          </g>
        </g>
      </svg>

      <style>{`
        /* Pigeon Container Hover */
        .pigeon-bot-container {
          cursor: pointer;
        }

        /* Ambient Glow animation */
        @keyframes pigeon-amb-breath {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50%      { transform: scale(1.15); opacity: 0.45; }
        }
        .ambient-pigeon-glow {
          animation: pigeon-amb-breath 4s ease-in-out infinite;
          transform-origin: 80px 70px;
        }

        /* Bobbing / Hover Motion */
        @keyframes pigeon-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        .pigeon-bobbing {
          animation: pigeon-bob 3.5s ease-in-out infinite;
        }
        .pigeon-bot-container:hover .pigeon-bobbing {
          animation: pigeon-bob 1.5s ease-in-out infinite;
        }

        /* Head bobbing */
        @keyframes pigeon-head-nod {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(4deg) translateY(1px); }
        }
        .pigeon-head {
          animation: pigeon-head-nod 3.5s ease-in-out infinite;
        }

        /* Antenna light flashing */
        @keyframes antenna-flash {
          0%, 100% { fill: #d946ef; filter: drop-shadow(0 0 1px #d946ef); }
          50%      { fill: #00f2fe; filter: drop-shadow(0 0 3px #00f2fe); }
        }
        .pigeon-antenna-light {
          animation: antenna-flash 2s infinite;
        }

        /* Wing flap left */
        @keyframes wing-flap-l {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-12deg) scaleY(1.05); }
        }
        .pigeon-wing-l {
          animation: wing-flap-l 2s ease-in-out infinite;
        }
        .pigeon-bot-container:hover .pigeon-wing-l {
          animation: wing-flap-l 0.4s linear infinite;
        }

        /* Wing flap right */
        @keyframes wing-flap-r {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(12deg) scaleY(1.05); }
        }
        .pigeon-wing-r {
          animation: wing-flap-r 2s ease-in-out infinite;
        }
        .pigeon-bot-container:hover .pigeon-wing-r {
          animation: wing-flap-r 0.4s linear infinite;
        }

        /* Visor Lenses blinking */
        @keyframes visor-blink {
          0%, 92%, 100% { fill: #00f2fe; filter: drop-shadow(0 0 1px #00f2fe); }
          95%           { fill: transparent; filter: none; }
        }
        .pigeon-eye-l, .pigeon-eye-r {
          animation: visor-blink 4s infinite;
        }
        .pigeon-bot-container:hover .pigeon-eye-l,
        .pigeon-bot-container:hover .pigeon-eye-r {
          fill: #f59e0b;
          filter: drop-shadow(0 0 3px #f59e0b);
          animation: none;
        }

        /* Package breathing glow */
        @keyframes packet-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.1); }
        }
        .packet-glow-breath {
          animation: packet-glow 3s ease-in-out infinite;
          transform-origin: center;
        }
        .pigeon-bot-container:hover .packet-glow-breath {
          animation: packet-glow 1s ease-in-out infinite;
          fill: url(#holo-scan);
        }

        /* Rising particles */
        @keyframes rise-p-1 {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50%  { opacity: 0.8; }
          100% { transform: translate(-15px, -30px) scale(1.2); opacity: 0; }
        }
        @keyframes rise-p-2 {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50%  { opacity: 0.9; }
          100% { transform: translate(15px, -35px) scale(1.2); opacity: 0; }
        }
        @keyframes rise-p-3 {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50%  { opacity: 0.7; }
          100% { transform: translate(5px, -45px) scale(1.4); opacity: 0; }
        }
        .pigeon-particle-1 {
          animation: rise-p-1 3s ease-in-out infinite;
          transform-origin: center;
        }
        .pigeon-particle-2 {
          animation: rise-p-2 3.5s ease-in-out infinite 0.8s;
          transform-origin: center;
        }
        .pigeon-particle-3 {
          animation: rise-p-3 2.8s ease-in-out infinite 1.6s;
          transform-origin: center;
        }

        /* Tail sway */
        @keyframes tail-sway {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-5deg); }
        }
        .pigeon-tail {
          animation: tail-sway 2.5s ease-in-out infinite;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .pigeon-bobbing, .pigeon-head, .pigeon-wing-l, .pigeon-wing-r,
          .pigeon-eye-l, .pigeon-eye-r, .packet-glow-breath,
          .pigeon-particle-1, .pigeon-particle-2, .pigeon-particle-3,
          .pigeon-tail, .ambient-pigeon-glow, .pigeon-antenna-light {
            animation: none !important;
            transform: none !important;
          }
          .pigeon-bot-container:hover .pigeon-wing-l,
          .pigeon-bot-container:hover .pigeon-wing-r {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
