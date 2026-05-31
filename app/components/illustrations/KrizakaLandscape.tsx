"use client";

export default function KrizakaLandscape({ relative = false }: { relative?: boolean }) {
  return (
    <div
      style={{
        position: relative ? "relative" : "absolute",
        bottom: relative ? undefined : 0,
        left: 0,
        right: 0,
        height: relative ? "1000px" : "100%",
        width: "100%",
        pointerEvents: "none",
        zIndex: relative ? 2 : 0,
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 50 1200 520"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* Vibrant Cyber Sun Glow */}
          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#ec4899" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.16" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Mountains Vibrant Gradients */}
          <linearGradient id="mtn-back" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.75" /> {/* indigo */}
            <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--kz-surface-0)" />
          </linearGradient>
          <linearGradient id="mtn-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" /> {/* cyan */}
            <stop offset="50%" stopColor="#0891b2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--kz-surface-0)" />
          </linearGradient>
          <linearGradient id="mtn-front" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.8" /> {/* pink */}
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--kz-surface-0)" />
          </linearGradient>

          {/* Vibrant Mascot Gradients */}
          <linearGradient id="falcon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9f00" />
            <stop offset="100%" stopColor="#ff2a00" />
          </linearGradient>
          <linearGradient id="duck-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="flamingo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="owl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>

          {/* Hologram Projections */}
          <linearGradient id="holo-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          {/* KOF Rivalry Gradients for Cyber-Phoenix */}
          <linearGradient id="phoenix-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb000" />
            <stop offset="100%" stopColor="#ff3c00" />
          </linearGradient>
          <linearGradient id="phoenix-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="phoenix-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--kz-surface-3)" />
            <stop offset="100%" stopColor="var(--kz-surface-2)" />
          </linearGradient>

          {/* KOF Glowing streams gradients */}
          <linearGradient id="kof-gold-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff3c00" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffb000" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--kz-surface-0)" />
          </linearGradient>
          <linearGradient id="kof-purple-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#db2777" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--kz-surface-0)" />
          </linearGradient>

          {/* River mask to fade out at the bottom */}
          <linearGradient id="river-mask-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="85%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <mask id="river-fade-mask">
            <rect x="0" y="0" width="1200" height="1000" fill="url(#river-mask-grad)" />
          </mask>

          {/* Cyber trees gradient */}
          <linearGradient id="tree-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Cyber Bench Gradient */}
          <linearGradient id="bench-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--kz-surface-3)" />
            <stop offset="100%" stopColor="var(--kz-surface-2)" />
          </linearGradient>

          {/* Cyber Aurora Glows */}
          <radialGradient id="aurora-left" cx="20%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aurora-right" cx="80%" cy="25%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform="translate(0, 60)">
        {/* ─── Cyber Aurora Backdrop ─── */}
        <circle cx="200" cy="180" r="600" fill="url(#aurora-left)" />
        <circle cx="1000" cy="150" r="600" fill="url(#aurora-right)" />

        {/* ─── Ethereal Sun and Sky Network Nodes (Constellations) ─── */}
        <circle cx="600" cy="200" r="380" fill="url(#sun-glow)" />
        <circle cx="600" cy="200" r="64" fill="#f59e0b" opacity="0.16" className="sun-pulsing" />

        {/* Constellation grid lines in the sky */}
        <g opacity="0.3" stroke="var(--kz-accent)" strokeWidth="1">
          <line x1="300" y1="120" x2="380" y2="80" />
          <line x1="380" y1="80" x2="450" y2="110" />
          <line x1="450" y1="110" x2="300" y2="120" />
          <line x1="450" y1="110" x2="520" y2="60" />
          <line x1="750" y1="80" x2="840" y2="130" />
          <line x1="840" y1="130" x2="900" y2="70" />
          <line x1="900" y1="70" x2="750" y2="80" />
        </g>
        {/* Constellation node points */}
        <g fill="var(--kz-accent)" opacity="0.65">
          <circle cx="300" cy="120" r="3.5" />
          <circle cx="380" cy="80" r="5" className="pulse-slow" />
          <circle cx="450" cy="110" r="3" />
          <circle cx="520" cy="60" r="4.5" />
          <circle cx="750" cy="80" r="4.5" />
          <circle cx="840" cy="130" r="3.5" />
          <circle cx="900" cy="70" r="6" className="pulse-slow" />
        </g>

        {/* ─── Layered Mountains (with Digital Contours) ─── */}
        {/* Far Peaks */}
        <path d="M 150 480 L 420 280 L 680 480 Z" fill="url(#mtn-back)" stroke="#818cf8" strokeWidth="1.5" />
        <path d="M 520 480 L 780 230 L 1050 480 Z" fill="url(#mtn-back)" stroke="#818cf8" strokeWidth="1.5" />

        {/* Mid Peaks */}
        <path d="M -50 500 L 220 320 L 500 500 Z" fill="url(#mtn-mid)" stroke="#22d3ee" strokeWidth="1.5" />
        <path d="M 700 500 L 980 300 L 1250 500 Z" fill="url(#mtn-mid)" stroke="#22d3ee" strokeWidth="1.5" />

        {/* Wireframe grids on mountains (Contour lines) */}
        <g stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.18">
          {/* Mid peak left contours */}
          <line x1="30" y1="440" x2="410" y2="440" />
          <line x1="85" y1="400" x2="355" y2="400" />
          <line x1="140" y1="360" x2="300" y2="360" />
          {/* Mid peak right contours */}
          <line x1="770" y1="450" x2="1180" y2="450" />
          <line x1="825" y1="410" x2="1125" y2="410" />
          <line x1="880" y1="370" x2="1070" y2="370" />
        </g>

        {/* Front Peaks */}
        <path d="M 100 520 L 360 380 L 620 520 Z" fill="url(#mtn-front)" stroke="#e879f9" strokeWidth="1.8" />
        <path d="M 580 520 L 850 350 L 1100 520 Z" fill="url(#mtn-front)" stroke="#e879f9" strokeWidth="1.8" />

        {/* ─── KOF-Inspired Cyber-Phoenix & Dual Glowing Flame Trails ─── */}
        {/* Dual Cascading Flame Trails */}
        {/* Left Purple Flame Trail */}
        <path
          d="M 590 340 C 570 370, 610 390, 590 410 C 570 430, 490 440, 510 480 C 530 520, 670 530, 700 560 C 720 580, 750 600, 730 630 C 710 660, 630 670, 650 710 C 660 730, 690 740, 700 760 C 710 780, 670 800, 650 830 C 630 860, 680 890, 690 920 C 695 935, 705 945, 710 1000"
          fill="none"
          stroke="url(#kof-purple-glow)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
          mask="url(#river-fade-mask)"
          style={{
            filter: "drop-shadow(0 0 6px rgba(219, 39, 119, 0.4))",
          }}
        />
        <path
          d="M 590 340 C 570 370, 610 390, 590 410 C 570 430, 490 440, 510 480 C 530 520, 670 530, 700 560 C 720 580, 750 600, 730 630 C 710 660, 630 670, 650 710 C 660 730, 690 740, 700 760 C 710 780, 670 800, 650 830 C 630 860, 680 890, 690 920 C 695 935, 705 945, 710 1000"
          fill="none"
          stroke="#db2777"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
          mask="url(#river-fade-mask)"
          style={{
            strokeDasharray: "25, 20",
            animation: "phoenix-flow-purple 8s linear infinite",
            pointerEvents: "none",
            filter: "drop-shadow(0 0 3px #db2777)",
          }}
        />

        {/* Right Gold Flame Trail */}
        <path
          d="M 610 340 C 590 370, 630 390, 610 410 C 590 430, 510 440, 530 480 C 550 520, 690 530, 720 560 C 740 580, 770 600, 750 630 C 730 660, 650 670, 670 710 C 680 730, 710 740, 720 760 C 730 780, 690 800, 670 830 C 650 860, 700 890, 710 920 C 715 935, 725 945, 730 1000"
          fill="none"
          stroke="url(#kof-gold-glow)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
          mask="url(#river-fade-mask)"
          style={{
            filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))",
          }}
        />
        <path
          d="M 610 340 C 590 370, 630 390, 610 410 C 590 430, 510 440, 530 480 C 550 520, 690 530, 720 560 C 740 580, 770 600, 750 630 C 730 660, 650 670, 670 710 C 680 730, 710 740, 720 760 C 730 780, 690 800, 670 830 C 650 860, 700 890, 710 920 C 715 935, 725 945, 730 1000"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
          mask="url(#river-fade-mask)"
          style={{
            strokeDasharray: "35, 15",
            animation: "phoenix-flow-gold 6s linear infinite",
            pointerEvents: "none",
            filter: "drop-shadow(0 0 3px #fbbf24)",
          }}
        />

        {/* Hoverable Cyber-Phoenix Soaring in the Valley Center */}
        <g className="cyber-phoenix" style={{ cursor: "pointer", pointerEvents: "auto" }}>
          {/* Main Body diamond capsule */}
          <polygon
            points="600,310 608,325 600,345 592,325"
            fill="url(#phoenix-body-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1.2"
          />
          {/* Glowing Phoenix Core */}
          <circle cx="600" cy="325" r="3" fill="#ffef5c" className="phoenix-core" />

          {/* Head */}
          <circle cx="600" cy="302" r="6" fill="url(#phoenix-body-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
          {/* Visor */}
          <rect x="58" y="300" width="4" height="2" rx="0.5" fill="#00f2fe" />
          {/* Head Crest */}
          <polygon points="600,296 603,290 600,293 597,290" fill="#ff3c00" />

          {/* Left Wing (Purple mechanical fire) */}
          <path
            d="M 592 322 C 555 310, 520 325, 498 348 C 525 348, 545 338, 568 340 C 582 341, 588 333, 592 322 Z"
            fill="url(#phoenix-purple-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1"
            className="phoenix-wing-l"
            style={{ transformOrigin: "592px 322px" }}
          />

          {/* Right Wing (Gold mechanical fire) */}
          <path
            d="M 608 322 C 645 310, 680 325, 702 348 C 675 348, 655 338, 632 340 C 618 341, 612 333, 608 322 Z"
            fill="url(#phoenix-gold-grad)"
            stroke="var(--kz-border-strong)"
            strokeWidth="1"
            className="phoenix-wing-r"
            style={{ transformOrigin: "608px 322px" }}
          />
        </g>

        {/* ─── Cyber Trees & Hexagonal Foliage (Nature + Tech) ─── */}
        {/* Left Tree */}
        <g transform="translate(180, 360)">
          {/* Server trunk */}
          <line x1="0" y1="120" x2="0" y2="40" stroke="var(--kz-border-strong)" strokeWidth="4" />
          <rect x="-8" y="50" width="16" height="28" rx="2" fill="var(--kz-surface-2)" stroke="var(--kz-border-subtle)" />
          {/* LED dots on trunk */}
          <circle cx="0" cy="58" r="1.5" fill="var(--kz-accent)" />
          <circle cx="0" cy="66" r="1.5" fill="var(--kz-accent)" opacity="0.6" />
          {/* Hexagonal foliage */}
          <polygon points="0,-10 35,10 35,50 0,70 -35,50 -35,10" fill="url(#tree-grad)" stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.4" />
          <polygon points="0,-5 25,10 25,40 0,55 -25,40 -25,10" fill="url(#tree-grad)" stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* Treehouse Tree (Center-Left) */}
        <g transform="translate(420, 320)">
          {/* Trunk */}
          <line x1="0" y1="180" x2="0" y2="60" stroke="var(--kz-border-strong)" strokeWidth="5" />
          <line x1="0" y1="110" x2="35" y2="90" stroke="var(--kz-border-strong)" strokeWidth="3.5" />
          {/* Foliage */}
          <polygon points="0,-20 52,10 52,70 0,100 -52,70 -52,10" fill="url(#tree-grad)" stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.35" />
          <polygon points="0,-10 38,10 38,55 0,75 -38,55 -38,10" fill="url(#tree-grad)" stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.5" />

          {/* Hexagonal Treehouse */}
          <g transform="translate(0, 50)" style={{ pointerEvents: "auto", cursor: "pointer" }} className="cyber-treehouse">
            <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="var(--kz-surface-3)" stroke="var(--kz-accent)" strokeWidth="1.5" />
            {/* Window */}
            <circle cx="0" cy="0" r="8" fill="var(--kz-surface-1)" stroke="var(--kz-border-strong)" />
            <circle cx="0" cy="0" r="4" fill="var(--kz-accent)" className="window-glow" />
            {/* Ladder */}
            <path d="M -6 30 L -6 95 M 6 30 L 6 95 M -6 42 L 6 42 M -6 54 L 6 54 M -6 66 L 6 66 M -6 78 L 6 78 M -6 90 L 6 90" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
            {/* Animated green local data pulses rising from treehouse */}
            <circle cx="0" cy="-45" r="3" fill="#10b981" className="rising-pulse-1" />
            <circle cx="15" cy="-35" r="2" fill="#10b981" className="rising-pulse-2" />
          </g>
        </g>

        {/* Right Tree */}
        <g transform="translate(1000, 340)">
          <line x1="0" y1="160" x2="0" y2="60" stroke="var(--kz-border-strong)" strokeWidth="4" />
          <polygon points="0,-15 42,10 42,60 0,85 -42,60 -42,10" fill="url(#tree-grad)" stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.4" />
          <polygon points="0,-5 28,10 28,42 0,60 -28,42 -28,10" fill="url(#tree-grad)" stroke="var(--kz-accent)" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* ─── Cyber Tech Bench (Center-Right) ─── */}
        <g transform="translate(740, 480)">
          {/* Bench support legs */}
          <line x1="20" y1="35" x2="20" y2="60" stroke="var(--kz-border-strong)" strokeWidth="4" />
          <line x1="140" y1="35" x2="140" y2="60" stroke="var(--kz-border-strong)" strokeWidth="4" />
          {/* Bench seat */}
          <rect x="0" y="22" width="160" height="12" rx="4" fill="url(#bench-grad)" stroke="var(--kz-border-default)" strokeWidth="1.2" />
          {/* Bench backrest */}
          <rect x="0" y="0" width="160" height="10" rx="3" fill="url(#bench-grad)" stroke="var(--kz-border-default)" strokeWidth="1.2" transform="rotate(-5, 80, 5)" />
          {/* Backrest brackets */}
          <line x1="15" y1="10" x2="15" y2="24" stroke="var(--kz-border-strong)" strokeWidth="3" />
          <line x1="145" y1="10" x2="145" y2="24" stroke="var(--kz-border-strong)" strokeWidth="3" />
        </g>

        {/* ─── MASCOT BIRD 4: Cyber Owl (Teal/Indigo - Left Tree) ─── */}
        <g transform="translate(180, 275) scale(1.4)" className="bird-hitbox mobile-hide">
          <rect x="-20" y="-15" width="40" height="70" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
          <g className="bird-graphics owl-bot">
            {/* Shadow */}
            <ellipse cx="0" cy="50" rx="16" ry="4" fill="rgba(0,0,0,0.15)" />
            {/* Body */}
            <path
              d="M -15,10 C -15,-10, 15,-10, 15,10 C 15,30, 10,45, 0,45 C -10,45, -15,30, -15,10 Z"
              fill="url(#owl-grad)"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.2"
            />
            {/* Belly plate */}
            <path
              d="M -8,15 C -8,5, 8,5, 8,15 C 8,28, 5,35, 0,35 C -5,35, -8,28, -8,15 Z"
              fill="#00f2fe"
              opacity="0.35"
            />
            {/* Eyes */}
            <circle cx="-6" cy="2" r="5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="6" cy="2" r="5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <circle cx="-6" cy="2" r="2" fill="#00ff66" className="owl-eye" />
            <circle cx="6" cy="2" r="2" fill="#00ff66" className="owl-eye" />
            {/* Beak */}
            <polygon points="-2,4 2,4 0,10" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
            {/* Horns / Ears */}
            <polygon points="-12,-8 -6,-4 -14,2" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="1" />
            <polygon points="12,-8 6,-4 14,2" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="1" />
          </g>
        </g>

        {/* ─── MASCOT BIRD 1: Cyber-Sentry Falcon (Orange - Left) ─── */}
        <g transform="translate(120, 360) scale(1.65)" className="bird-hitbox mobile-hide">
          <rect x="-10" y="0" width="70" height="90" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
          <g className="bird-graphics falcon-bot">
            {/* Shadow */}
            <ellipse cx="25" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
            
            {/* Legs */}
            <line x1="16" y1="65" x2="12" y2="85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            <line x1="34" y1="65" x2="38" y2="85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            {/* Feet claws */}
            <path d="M 6 85 L 14 85 M 34 85 L 44 85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

            {/* Body */}
            <path
              d="M 5 35 C 5 20, 45 20, 45 35 C 45 58, 38 68, 25 68 C 12 68, 5 58, 5 35 Z"
              fill="url(#falcon-grad)"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.5"
            />
            {/* Belly plate */}
            <path
              d="M 12 38 C 12 28, 38 28, 38 38 C 38 52, 32 58, 25 58 C 18 58, 12 52, 12 38 Z"
              fill="#ff9800"
              opacity="0.85"
            />

            {/* Wings */}
            <path
              d="M 2 30 C -8 40, -4 60, 10 58 C 5 50, 4 38, 2 30 Z"
              fill="#d84315"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.2"
              className="wing-left"
              style={{ transformOrigin: "2px 30px" }}
            />
            <path
              d="M 48 30 C 58 40, 54 60, 40 58 C 45 50, 46 38, 48 30 Z"
              fill="#d84315"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.2"
              className="wing-right"
              style={{ transformOrigin: "48px 30px" }}
            />

            {/* Tail feathers */}
            <path d="M 20 66 L 15 80 L 25 76 L 35 80 L 30 66" fill="#bf360c" stroke="var(--kz-border-strong)" strokeWidth="1" />

            {/* Head */}
            <g className="head-group" style={{ transformOrigin: "25px 28px" }}>
              <circle cx="25" cy="22" r="18" fill="url(#falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
              
              {/* Beak */}
              <polygon points="21,24 29,24 25,36" fill="#ffb300" stroke="var(--kz-border-strong)" strokeWidth="1.2" />

              {/* Visor */}
              <rect x="9" y="10" width="32" height="10" rx="3" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              {/* Lenses */}
              <circle cx="17" cy="15" r="2.5" fill="#00f2fe" className="falcon-eye" />
              <circle cx="33" cy="15" r="2.5" fill="#00f2fe" className="falcon-eye" />
              {/* Wire */}
              <path d="M 41 15 C 44 15, 43 25, 41 28" stroke="var(--kz-border-strong)" strokeWidth="1" fill="none" />
            </g>

            {/* Sentry Scan Laser Overlay */}
            <polygon points="25,28 -60,180 110,180" fill="url(#holo-grad)" className="sentry-laser" opacity="0" style={{ transformOrigin: "25px 28px", pointerEvents: "none" }} />
          </g>
        </g>

        {/* ─── MASCOT BIRD 2: Developer Duck (Pink - Center Bench) ─── */}
        <g transform="translate(750, 355) scale(1.75)" className="bird-hitbox mobile-hide">
          <rect x="-10" y="5" width="70" height="75" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
          <g className="bird-graphics developer-duck">
            {/* Sitting body */}
            <path
              d="M 5 45 C 5 30, 45 30, 45 45 C 45 62, 38 72, 25 72 C 12 72, 5 62, 5 45 Z"
              fill="url(#duck-grad)"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.5"
            />
            {/* Belly light */}
            <path
              d="M 12 48 C 12 40, 38 40, 38 48 C 38 60, 32 64, 25 64 C 18 64, 12 60, 12 48 Z"
              fill="#f472b6"
              opacity="0.85"
            />

            {/* Wings typing */}
            <path
              d="M -2 40 C -8 46, -4 55, 10 52"
              fill="none"
              stroke="#db2777"
              strokeWidth="8"
              strokeLinecap="round"
              className="wing-left-type"
            />
            <path
              d="M 52 40 C 58 46, 54 55, 40 52"
              fill="none"
              stroke="#db2777"
              strokeWidth="8"
              strokeLinecap="round"
              className="wing-right-type"
            />

            {/* Head */}
            <g className="head-group" style={{ transformOrigin: "25px 32px" }}>
              <circle cx="25" cy="24" r="16" fill="url(#duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
              {/* Duck Beak */}
              <path
                d="M 12 24 C 12 20, 22 18, 25 18 C 28 18, 38 20, 38 24 C 38 28, 28 32, 25 32 C 22 32, 12 28, 12 24 Z"
                fill="#fbbf24"
                stroke="var(--kz-border-strong)"
                strokeWidth="1.2"
              />
              {/* Eyes */}
              <circle cx="19" cy="16" r="2" fill="var(--kz-text-primary)" className="duck-eye" />
              <circle cx="31" cy="16" r="2" fill="var(--kz-text-primary)" className="duck-eye" />
              {/* Glasses */}
              <circle cx="19" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              <circle cx="31" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              <line x1="23.5" y1="16" x2="26.5" y2="16" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
            </g>

            {/* Holographic Laptop */}
            <g transform="translate(10, 52)">
              {/* Base */}
              <polygon points="-8,16 38,16 30,22 -14,22" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              {/* Hologram screen */}
              <polygon
                points="-4,14 34,14 30,-2 -8,-2"
                fill="var(--kz-accent-soft)"
                stroke="var(--kz-accent)"
                strokeWidth="1"
                opacity="0.8"
                className="laptop-screen"
              />
              {/* Glowing prompt line */}
              <line x1="-2" y1="4" x2="24" y2="4" stroke="var(--kz-accent)" strokeWidth="1.5" opacity="0.9" />
              <line x1="-2" y1="8" x2="16" y2="8" stroke="var(--kz-accent)" strokeWidth="1.5" opacity="0.6" />
              
              {/* Holographic Projection */}
              <polygon points="12,-2 -40,-80 70,-80" fill="url(#holo-grad)" opacity="0" className="holo-projection" style={{ pointerEvents: "none" }} />
              {/* Tiny code elements inside hologram */}
              <g className="holo-elements" opacity="0">
                <rect x="-10" y="-45" width="22" height="6" rx="2" fill="var(--kz-surface-3)" stroke="#10b981" strokeWidth="0.5" />
                <rect x="18" y="-35" width="18" height="6" rx="2" fill="var(--kz-surface-3)" stroke="#10b981" strokeWidth="0.5" />
              </g>
            </g>
          </g>
        </g>

        {/* ─── MASCOT BIRD 3: High-Neck Flamingo-Bot (Blue - Right) ─── */}
        <g transform="translate(1000, 270) scale(1.75)" className="bird-hitbox mobile-hide">
          <rect x="-15" y="0" width="65" height="165" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
          <g className="bird-graphics flamingo-bot">
            {/* Shadow */}
            <ellipse cx="20" cy="160" rx="22" ry="5" fill="rgba(0,0,0,0.15)" />

            {/* Long legs */}
            <line x1="12" y1="105" x2="12" y2="160" stroke="var(--kz-border-strong)" strokeWidth="2.5" />
            <line x1="26" y1="105" x2="28" y2="160" stroke="var(--kz-border-strong)" strokeWidth="2.5" />
            {/* Joints */}
            <circle cx="12" cy="130" r="2.5" fill="#3b82f6" />
            <circle cx="27" cy="130" r="2.5" fill="#3b82f6" />

            {/* Body */}
            <path
              d="M 2 80 C 2 68, 38 68, 38 80 C 38 108, 28 112, 20 112 C 12 112, 2 108, 2 80 Z"
              fill="url(#flamingo-grad)"
              stroke="var(--kz-border-strong)"
              strokeWidth="1.5"
            />

            {/* Wing (Vibrant contrast) */}
            <path
              d="M 8 82 L 20 74 L 32 82 L 32 94 L 20 102 L 8 94 Z"
              fill="#ec4899"
              stroke="var(--kz-border-strong)"
              strokeWidth="1"
              opacity="0.95"
              className="flamingo-wing"
            />

            {/* Curved neck */}
            <path
              d="M 20 74 C 20 60, -2 40, 8 18"
              fill="none"
              stroke="url(#flamingo-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              className="flamingo-neck"
            />

            {/* Head */}
            <g className="head-group" transform="translate(8, 12)" style={{ transformOrigin: "0px 0px" }}>
              <circle cx="0" cy="0" r="10" fill="url(#flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              
              {/* Eye */}
              <circle cx="-3" cy="-2" r="1.5" fill="var(--kz-surface-0)" />
              <circle cx="-3" cy="-2" r="0.6" fill="#f43f5e" className="flamingo-eye" />

              {/* Beak */}
              <path d="M -8 -2 C -18 2, -16 14, -22 18 C -14 10, -8 4, -8 -2 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />

              {/* Hat */}
              <path d="M -8 -8 L 8 -8 L 6 -14 L -6 -14 Z" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              <ellipse cx="0" cy="-8" rx="10" ry="1.5" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
            </g>
          </g>
        </g>

        {/* ─── Floating Glowing Tech Particles ─── */}
        <circle cx="340" cy="300" r="6" fill="#00f2fe" opacity="0.75" className="float-particle-1" />
        <circle cx="520" cy="220" r="5" fill="#a855f7" opacity="0.65" className="float-particle-2" />
        <circle cx="710" cy="310" r="6.5" fill="#3b82f6" opacity="0.7" className="float-particle-3" />
        <circle cx="920" cy="250" r="5" fill="#00f2fe" opacity="0.8" className="float-particle-4" />
        </g>
      </svg>

      <style>{`
        /* --- Cyber Phoenix & Flame Flow animations --- */
        @keyframes phoenix-flow-purple {
          from { strokeDashoffset: 350; }
          to   { strokeDashoffset: 0; }
        }
        @keyframes phoenix-flow-gold {
          from { strokeDashoffset: 0; }
          to   { strokeDashoffset: 350; }
        }
        @keyframes phoenix-bob {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes wing-flap-l-phoenix {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-10deg) translateY(-2px); }
        }
        @keyframes wing-flap-r-phoenix {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(10deg) translateY(-2px); }
        }
        @keyframes core-glow {
          0%, 100% { fill: #ffef5c; filter: drop-shadow(0 0 1px #ffef5c); }
          50%      { fill: #ffffff; filter: drop-shadow(0 0 5px #ff3c00); }
        }

        .cyber-phoenix {
          animation: phoenix-bob 4s ease-in-out infinite;
          transform-origin: 600px 325px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cyber-phoenix:hover {
          transform: translateY(-4px) scale(1.08);
        }
        .phoenix-wing-l {
          animation: wing-flap-l-phoenix 2.5s ease-in-out infinite;
        }
        .phoenix-wing-r {
          animation: wing-flap-r-phoenix 2.5s ease-in-out infinite;
        }
        .cyber-phoenix:hover .phoenix-wing-l {
          animation: wing-flap-l-phoenix 0.6s linear infinite;
        }
        .cyber-phoenix:hover .phoenix-wing-r {
          animation: wing-flap-r-phoenix 0.6s linear infinite;
        }
        .phoenix-core {
          animation: core-glow 1.5s ease-in-out infinite;
        }

        /* --- Pulse Animations --- */
        @keyframes opacity-pulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.95; }
        }
        .pulse-slow {
          animation: opacity-pulse 4s ease-in-out infinite;
        }
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.16; transform: scale(0.96); }
          50%      { opacity: 0.32; transform: scale(1.04); }
        }
        .sun-pulsing {
          animation: sun-pulse 6s ease-in-out infinite;
          transform-origin: 600px 200px;
        }

        /* --- Rising local data pulses --- */
        @keyframes rise-fade-1 {
          0%   { transform: translateY(80px) scale(0.5); opacity: 0; }
          40%  { opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1.3); opacity: 0; }
        }
        @keyframes rise-fade-2 {
          0%   { transform: translateY(60px) scale(0.4); opacity: 0; }
          50%  { opacity: 0.9; }
          100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        .rising-pulse-1 {
          animation: rise-fade-1 4s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          transform-origin: center;
        }
        .rising-pulse-2 {
          animation: rise-fade-2 5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 1.5s;
          transform-origin: center;
        }

        /* --- Mascot Hover Animations (Stable Hitboxes) --- */
        .bird-graphics {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .bird-hitbox:hover .bird-graphics {
          transform: scale(1.08) translateY(-4px);
        }

        /* --- Bird Eye Blinking/Glowing Animations --- */
        .falcon-eye {
          animation: falcon-eye-pulse 2.5s ease-in-out infinite;
        }
        .duck-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: eye-blink 5s ease-in-out infinite 1s;
        }
        .flamingo-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: eye-blink 6s ease-in-out infinite 2.5s;
        }
        .owl-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: eye-blink 4s ease-in-out infinite 0.5s;
        }

        @keyframes eye-blink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.15);
          }
        }

        @keyframes falcon-eye-pulse {
          0%, 100% { fill: #00f2fe; filter: drop-shadow(0 0 2px #00f2fe); }
          50%      { fill: #00ff66; filter: drop-shadow(0 0 5px #00ff66); }
        }

        /* FalconBot constant loop animations */
        .falcon-bot .head-group {
          animation: head-bob 4s ease-in-out infinite;
        }
        .falcon-bot .wing-left {
          animation: wing-flap-left 3s ease-in-out infinite;
        }
        .falcon-bot .wing-right {
          animation: wing-flap-right 3s ease-in-out infinite;
        }
        .falcon-bot .sentry-laser {
          animation: scan-flicker 5s ease-in-out infinite;
        }

        @keyframes scan-flicker {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 0.15; }
          50%      { opacity: 0.5; }
        }
        @keyframes head-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes wing-flap-left {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-8deg) scaleX(1.05); }
        }
        @keyframes wing-flap-right {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(8deg) scaleX(1.05); }
        }

        /* Developer Duck constant loop animations */
        .developer-duck .head-group {
          animation: duck-look 6s ease-in-out infinite;
        }
        .developer-duck .wing-left-type {
          animation: wing-type-l 0.5s ease-in-out infinite;
        }
        .developer-duck .wing-right-type {
          animation: wing-type-r 0.5s ease-in-out infinite 0.25s;
        }
        .developer-duck .laptop-screen {
          animation: screen-flicker-idle 3s ease-in-out infinite;
        }
        .developer-duck .holo-projection {
          animation: holo-flicker 6s ease-in-out infinite;
        }
        .developer-duck .holo-elements {
          animation: holo-elements-rise 6s ease-in-out infinite;
        }

        @keyframes screen-flicker-idle {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 0.95; filter: drop-shadow(0 0 3px var(--kz-accent)); }
        }
        @keyframes holo-flicker {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 0.35; }
          50%      { opacity: 0.65; }
        }
        @keyframes holo-elements-rise {
          0%   { transform: translateY(10px); opacity: 0; }
          50%  { opacity: 0.8; }
          100% { transform: translateY(-15px); opacity: 0; }
        }
        @keyframes duck-look {
          0%, 100% { transform: rotate(0deg); }
          30%      { transform: rotate(-5deg); }
          70%      { transform: rotate(5deg); }
        }
        @keyframes wing-type-l {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-3px) rotate(-4deg); }
        }
        @keyframes wing-type-r {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-3px) rotate(4deg); }
        }

        /* Flamingo Bot constant loop animations */
        .flamingo-bot .head-group {
          animation: flamingo-head-bob 5s ease-in-out infinite;
        }
        .flamingo-bot .flamingo-neck {
          animation: flamingo-neck-sway 7s ease-in-out infinite;
          transform-origin: 20px 74px;
        }
        .flamingo-bot .flamingo-wing {
          animation: flamingo-wing-flap 4s ease-in-out infinite;
        }

        @keyframes flamingo-neck-sway {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-3deg) scaleY(1.02); }
        }
        @keyframes flamingo-head-bob {
          0%, 100% { transform: translate(8px, 12px) translateY(0) rotate(0deg); }
          50%      { transform: translate(8px, 12px) translateY(-5px) rotate(-3deg); }
        }
        @keyframes flamingo-wing-flap {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-2px) rotate(-6deg); }
        }

        /* Owl Bot constant loop animations */
        .owl-bot {
          animation: owl-sway 5s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes owl-sway {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50%      { transform: rotate(-3deg) translateY(-2px); }
        }

        /* Treehouse hover glow */
        .cyber-treehouse:hover .window-glow {
          fill: #f59e0b;
          filter: drop-shadow(0 0 10px #f59e0b);
        }

        /* Floating tech particles */
        @keyframes float-up-down {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%      { transform: translateY(-24px); opacity: 0.95; }
        }
        .float-particle-1 { animation: float-up-down 4.2s ease-in-out infinite; }
        .float-particle-2 { animation: float-up-down 5.2s ease-in-out infinite 1.2s; }
        .float-particle-3 { animation: float-up-down 4.7s ease-in-out infinite 0.6s; }
        .float-particle-4 { animation: float-up-down 6.2s ease-in-out infinite 2.2s; }

        @media (max-width: 1024px) {
          .mobile-hide {
            display: none !important;
          }
        }
      `}</style>

      {/* Premium Bottom Fade Gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to top, var(--kz-surface-0) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}
