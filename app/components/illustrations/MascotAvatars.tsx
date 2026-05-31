"use client";

import React from "react";

/* ─── Gradients shared by SVGs ─── */
const SVGDefs = () => (
  <defs>
    <linearGradient id="av-falcon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#ff9f00" />
      <stop offset="100%" stopColor="#ff2a00" />
    </linearGradient>
    <linearGradient id="av-duck-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#f43f5e" />
      <stop offset="100%" stopColor="#be123c" />
    </linearGradient>
    <linearGradient id="av-flamingo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#3b82f6" />
      <stop offset="100%" stopColor="#1d4ed8" />
    </linearGradient>
    <linearGradient id="av-owl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#a78bfa" />
      <stop offset="100%" stopColor="#6d28d9" />
    </linearGradient>
    <linearGradient id="av-holo-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
    </linearGradient>
  </defs>
);

/* ─── 1. FALCON BOT (Loi 25 Compliance) ─── */
export function FalconAvatar() {
  return (
    <div className="avatar-wrapper falcon-av" style={{ width: "68px", height: "76px" }}>
      <svg width="100%" height="100%" viewBox="0 5 50 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <SVGDefs />
        <g className="av-falcon-body">
          {/* Shadow */}
          <ellipse cx="25" cy="80" rx="15" ry="3" fill="rgba(0,0,0,0.15)" />
          {/* Legs */}
          <line x1="18" y1="65" x2="15" y2="80" stroke="#f97316" strokeWidth="2.5" />
          <line x1="32" y1="65" x2="35" y2="80" stroke="#f97316" strokeWidth="2.5" />
          {/* Body */}
          <path d="M 8 35 C 8 22, 42 22, 42 35 C 42 56, 36 64, 25 64 C 14 64, 8 56, 8 35 Z" fill="url(#av-falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          <path d="M 14 38 C 14 30, 36 30, 36 38 C 36 50, 31 54, 25 54 C 19 54, 14 50, 14 38 Z" fill="#ff9800" opacity="0.8" />
          {/* Wings */}
          <path d="M 5 32 C -3 40, -1 56, 11 54 C 7 46, 7 38, 5 32 Z" fill="#d84315" stroke="var(--kz-border-strong)" strokeWidth="1" className="av-wing-l" style={{ transformOrigin: "5px 32px" }} />
          <path d="M 45 32 C 53 40, 51 56, 39 54 C 43 46, 43 38, 45 32 Z" fill="#d84315" stroke="var(--kz-border-strong)" strokeWidth="1" className="av-wing-r" style={{ transformOrigin: "45px 32px" }} />
          {/* Head */}
          <g className="av-head" style={{ transformOrigin: "25px 28px" }}>
            <circle cx="25" cy="22" r="14" fill="url(#av-falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <polygon points="22,24 28,24 25,32" fill="#ffb300" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <rect x="13" y="12" width="24" height="8" rx="2" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="19" cy="16" r="2" fill="#00f2fe" className="av-eye" />
            <circle cx="31" cy="16" r="2" fill="#00f2fe" className="av-eye" />
          </g>
          {/* Sentry Laser Scan */}
          <polygon points="25,24 -20,80 70,80" fill="url(#av-holo-grad)" className="av-laser" opacity="0" style={{ transformOrigin: "25px 24px", pointerEvents: "none" }} />
        </g>
      </svg>
    </div>
  );
}

/* ─── 2. DEVELOPER DUCK (Content Creation) ─── */
export function DuckAvatar() {
  return (
    <div className="avatar-wrapper duck-av" style={{ width: "68px", height: "76px" }}>
      <svg width="100%" height="100%" viewBox="0 10 60 75" fill="none" xmlns="http://www.w3.org/2000/svg">
        <SVGDefs />
        <g className="av-duck-body">
          {/* Sitting body */}
          <path d="M 10 44 C 10 32, 50 32, 50 44 C 50 58, 44 66, 30 66 C 16 66, 10 58, 10 44 Z" fill="url(#av-duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          <path d="M 16 46 C 16 40, 44 40, 44 46 C 44 56, 38 60, 30 60 C 22 60, 16 56, 16 46 Z" fill="#f472b6" opacity="0.8" />
          {/* Wings typing */}
          <path d="M 5 40 C -1 45, 2 52, 14 50" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" className="av-typing-l" />
          <path d="M 55 40 C 61 45, 58 52, 46 50" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" className="av-typing-r" />
          {/* Head */}
          <g className="av-head" style={{ transformOrigin: "30px 32px" }}>
            <circle cx="30" cy="24" r="13" fill="url(#av-duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            <path d="M 20 24 C 20 21, 28 19, 30 19 C 32 19, 40 21, 40 24 C 40 27, 30 30, 30 30 C 28 30, 20 27, 20 24 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="25" cy="18" r="1.5" fill="var(--kz-text-primary)" />
            <circle cx="35" cy="18" r="1.5" fill="var(--kz-text-primary)" />
            {/* Glasses */}
            <circle cx="25" cy="18" r="3.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="35" cy="18" r="3.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <line x1="28.5" y1="18" x2="31.5" y2="18" stroke="var(--kz-border-strong)" strokeWidth="1" />
          </g>
          {/* Laptop */}
          <g transform="translate(16, 50)">
            <polygon points="-4,12 32,12 26,17 -10,17" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
            <polygon points="-1,11 29,11 26,0 -4,0" fill="var(--kz-accent-soft)" stroke="var(--kz-accent)" strokeWidth="0.8" className="av-laptop-screen" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ─── 3. FLAMINGO BOT (Customer Support) ─── */
export function FlamingoAvatar() {
  return (
    <div className="avatar-wrapper flamingo-av" style={{ width: "68px", height: "76px" }}>
      <svg width="100%" height="100%" viewBox="0 10 50 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <SVGDefs />
        <g className="av-flamingo-body">
          {/* Shadow */}
          <ellipse cx="25" cy="82" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
          {/* Legs */}
          <line x1="20" y1="62" x2="20" y2="82" stroke="var(--kz-border-strong)" strokeWidth="2" />
          <line x1="28" y1="62" x2="29" y2="82" stroke="var(--kz-border-strong)" strokeWidth="2" />
          {/* Body */}
          <path d="M 12 48 C 12 38, 38 38, 38 48 C 38 68, 31 71, 25 71 C 19 71, 12 68, 12 48 Z" fill="url(#av-flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          {/* Wing */}
          <path d="M 16 50 L 25 44 L 34 50 L 34 58 L 25 64 L 16 58 Z" fill="#ec4899" stroke="var(--kz-border-strong)" strokeWidth="0.8" className="av-flamingo-wing" />
          {/* Neck */}
          <path d="M 25 44 C 25 32, 10 20, 18 6" fill="none" stroke="url(#av-flamingo-grad)" strokeWidth="4.5" strokeLinecap="round" className="av-neck" />
          {/* Head */}
          <g className="av-head-group" transform="translate(18, 2)" style={{ transformOrigin: "0px 0px" }}>
            <circle cx="0" cy="0" r="7.5" fill="url(#av-flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="-2.5" cy="-1.5" r="1.2" fill="var(--kz-surface-0)" />
            <circle cx="-2.5" cy="-1.5" r="0.5" fill="#f43f5e" />
            <path d="M -6 -1.5 C -14 1, -12 10, -17 13 C -11 7, -6 3, -6 -1.5 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
            {/* Hat */}
            <path d="M -6 -6 L 6 -6 L 4 -11 L -4 -11 Z" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ─── 4. CYBER OWL (Document Analysis) ─── */
export function OwlAvatar() {
  return (
    <div className="avatar-wrapper owl-av" style={{ width: "68px", height: "76px" }}>
      <svg width="100%" height="100%" viewBox="-5 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <SVGDefs />
        <g className="av-owl-body">
          {/* Shadow */}
          <ellipse cx="20" cy="54" rx="14" ry="3.5" fill="rgba(0,0,0,0.15)" />
          {/* Body */}
          <path d="M 5,20 C 5,5, 35,5, 35,20 C 35,38, 30,50, 20,50 C 10,50, 5,38, 5,20 Z" fill="url(#av-owl-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          <path d="M 11,24 C 11,15, 29,15, 29,24 C 29,35, 26,41, 20,41 C 14,41, 11,35, 11,24 Z" fill="#00f2fe" opacity="0.3" />
          {/* Eyes */}
          <circle cx="14" cy="14" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
          <circle cx="26" cy="14" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
          <circle cx="14" cy="14" r="1.6" fill="#00ff66" className="av-owl-eye" />
          <circle cx="26" cy="14" r="1.6" fill="#00ff66" className="av-owl-eye" />
          {/* Beak */}
          <polygon points="18,16 22,16 20,22" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
          {/* Horns */}
          <polygon points="7,4 12,8 5,13" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
          <polygon points="33,4 28,8 35,13" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

/* ─── Styles injected for hover triggers on cards ─── */
export const MascotStyles = () => (
  <style>{`
    /* General Avatars hover setup */
    .avatar-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .av-head, .av-falcon-body, .av-duck-body, .av-flamingo-body, .av-owl-body {
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* ─── Falcon Bot interactions ─── */
    .falcon-av .av-head {
      animation: av-head-bob 4s ease-in-out infinite;
    }
    .falcon-av .av-wing-l {
      animation: av-wing-l-flap 3s ease-in-out infinite;
    }
    .falcon-av .av-wing-r {
      animation: av-wing-r-flap 3s ease-in-out infinite;
    }
    @keyframes av-head-bob {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-1.5px) rotate(1deg); }
    }
    @keyframes av-wing-l-flap {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(-5deg); }
    }
    @keyframes av-wing-r-flap {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(5deg); }
    }
    @keyframes av-laser-scan {
      0%, 100% { opacity: 0; }
      50%      { opacity: 0.35; }
    }

    /* Hover triggers via .pkg-card classes (handled by CSS selector) */
    .pkg-card:hover .falcon-av .av-wing-l {
      animation: av-wing-l-flap 0.5s linear infinite !important;
    }
    .pkg-card:hover .falcon-av .av-wing-r {
      animation: av-wing-r-flap 0.5s linear infinite !important;
    }
    .pkg-card:hover .falcon-av .av-head {
      transform: translateY(-2px) rotate(-2deg);
    }
    .pkg-card:hover .falcon-av .av-laser {
      animation: av-laser-scan 1s ease-in-out infinite;
    }
    .pkg-card:hover .falcon-av .av-eye {
      fill: #ff3c00;
      filter: drop-shadow(0 0 2px #ff3c00);
    }

    /* ─── Duck Bot interactions ─── */
    .duck-av .av-head {
      animation: av-duck-look 5s ease-in-out infinite;
    }
    @keyframes av-duck-look {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(3deg); }
    }
    @keyframes av-typing-flap-l {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-1.5px) rotate(-3deg); }
    }
    @keyframes av-typing-flap-r {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-1.5px) rotate(3deg); }
    }
    .duck-av .av-typing-l {
      animation: av-typing-flap-l 0.6s ease-in-out infinite;
    }
    .duck-av .av-typing-r {
      animation: av-typing-flap-r 0.6s ease-in-out infinite 0.3s;
    }

    .pkg-card:hover .duck-av .av-typing-l {
      animation: av-typing-flap-l 0.2s linear infinite !important;
    }
    .pkg-card:hover .duck-av .av-typing-r {
      animation: av-typing-flap-r 0.2s linear infinite 0.1s !important;
    }
    .pkg-card:hover .duck-av .av-laptop-screen {
      fill: #10b981;
      filter: drop-shadow(0 0 4px #10b981);
    }
    .pkg-card:hover .duck-av .av-head {
      transform: scale(1.04) rotate(-3deg);
    }

    /* ─── Flamingo Bot interactions ─── */
    .flamingo-av .av-neck {
      animation: av-flamingo-sway 6s ease-in-out infinite;
      transform-origin: 25px 44px;
    }
    .flamingo-av .av-head-group {
      animation: av-flamingo-head 6s ease-in-out infinite;
    }
    @keyframes av-flamingo-sway {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(-2deg); }
    }
    @keyframes av-flamingo-head {
      0%, 100% { transform: translate(18px, 2px) rotate(0deg); }
      50%      { transform: translate(18px, 2px) translateY(-2px) rotate(-2deg); }
    }
    .pkg-card:hover .flamingo-av .av-neck {
      animation: av-flamingo-sway 1.5s ease-in-out infinite;
    }
    .pkg-card:hover .flamingo-av .av-head-group {
      animation: av-flamingo-head 1.5s ease-in-out infinite;
    }
    .pkg-card:hover .flamingo-av .av-flamingo-wing {
      transform: translateY(-2px) rotate(-6deg);
    }

    /* ─── Owl Bot interactions ─── */
    .owl-av .av-owl-body {
      animation: av-owl-sway 4s ease-in-out infinite;
      transform-origin: center;
    }
    @keyframes av-owl-sway {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(-2deg) translateY(-1px); }
    }
    @keyframes av-owl-blink {
      0%, 90%, 100% { transform: scaleY(1); }
      95%           { transform: scaleY(0.1); }
    }
    .av-owl-eye {
      transform-box: fill-box;
      transform-origin: center;
      animation: av-owl-blink 4s infinite 1s;
    }
    .pkg-card:hover .owl-av .av-owl-body {
      transform: scale(1.05) translateY(-2px);
    }
    .pkg-card:hover .owl-av .av-owl-eye {
      fill: #00f2fe;
      filter: drop-shadow(0 0 3px #00f2fe);
      animation: none;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .av-head, .av-falcon-body, .av-duck-body, .av-flamingo-body, .av-owl-body,
      .av-wing-l, .av-wing-r, .av-typing-l, .av-typing-r, .av-neck, .av-head-group,
      .av-owl-eye {
        animation: none !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `}</style>
);
