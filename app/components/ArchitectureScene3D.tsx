"use client";

/**
 * Interactive 3D architecture graph — a FAITHFUL, layered rendering of the
 * code-generated app/data/architecture.json (modules + declared dependency
 * edges + ports). Layout is derived from the data (dependency depth + layer),
 * NOT hand-placed: foundation at the bottom → core/identity → capabilities →
 * application (router/workers) → aggregate on top.
 *
 * Fully theme-aware (dark + light) and tuned to the Krizaka visual identity:
 * obsidian/ice palette keyed off --kz-accent, soft contact shadow ground,
 * additive node glow, a staggered entrance and a calm idle float (both honor
 * prefers-reduced-motion). The user orbits/zooms; hovering a module lights its
 * dependency edges and reveals its ports.
 *
 * Source of truth = the Orasaka backend; regenerate via `orasaka docs build`.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, ContactShadows, Html, Line, OrbitControls, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";
import architecture from "@/app/data/architecture.json";

type Layer = "framework" | "app" | "aggregate";
type Mod = {
  id: string;
  path?: string;
  layer: Layer;
  ports: { inbound: string[]; outbound: string[] };
  synthetic?: boolean;
};
type Dep = { from: string; to: string };

const BAND_LABEL = ["Foundation", "Core", "Capabilities", "Application", "Aggregate"];

/* ─── Theme-aware palette (harmonized with the --kz-* tokens) ─────────────── */

type Palette = {
  bg: string;
  fog: [number, number];
  text: string;
  textOutline: string;
  edgeBase: string;
  edgeActive: string;
  edgeDim: number;
  layer: Record<Layer, string>;
  emissive: number; // base emissive intensity for nodes
  metalness: number;
  roughness: number;
  ambient: number;
  keyLight: string;
  keyIntensity: number;
  rimLight: string;
  rimIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  glowOpacity: number;
  shadowOpacity: number;
  bandLabel: string;
};

const PALETTE: Record<"dark" | "light", Palette> = {
  dark: {
    bg: "#080a0f",
    fog: [24, 50],
    text: "#f1f5f9",
    textOutline: "#05070c",
    edgeBase: "#405273",
    edgeActive: "#5b9dff",
    edgeDim: 0.08,
    layer: { framework: "#3b82f6", app: "#22d3ee", aggregate: "#a78bfa" },
    emissive: 0.42,
    metalness: 0.6,
    roughness: 0.26,
    ambient: 0.5,
    keyLight: "#6aa6ff",
    keyIntensity: 130,
    rimLight: "#22d3ee",
    rimIntensity: 80,
    hemiSky: "#9bc2ff",
    hemiGround: "#0b1020",
    hemiIntensity: 0.7,
    glowOpacity: 0.5,
    shadowOpacity: 0.5,
    bandLabel: "rgba(148,163,184,0.5)",
  },
  light: {
    bg: "#eef2f8",
    fog: [26, 58],
    text: "#0f172a",
    textOutline: "#ffffff",
    edgeBase: "#8092af",
    edgeActive: "#1f6feb",
    edgeDim: 0.14,
    layer: { framework: "#2563eb", app: "#0891b2", aggregate: "#7c3aed" },
    emissive: 0.14,
    metalness: 0.32,
    roughness: 0.42,
    ambient: 0.95,
    keyLight: "#ffffff",
    keyIntensity: 90,
    rimLight: "#8ad0ff",
    rimIntensity: 40,
    hemiSky: "#ffffff",
    hemiGround: "#c9d4e6",
    hemiIntensity: 1.1,
    glowOpacity: 0.22,
    shadowOpacity: 0.28,
    bandLabel: "rgba(71,85,105,0.55)",
  },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Soft radial sprite texture for additive node glow (generated once). */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.5)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/** Infer a layer for modules that appear only inside dependency edges. */
function inferLayer(id: string): Layer {
  if (id.includes("end2end")) return "aggregate";
  if (id.includes("router") || id.includes("workers")) return "app";
  return "framework";
}

/** Layered layout computed from the data (band = max(dependency depth, layer floor)). */
function useLayout() {
  return useMemo(() => {
    const rawMods = architecture.modules as Mod[];
    const deps = (architecture.dependencies as Dep[]) ?? [];

    const modMap: Record<string, Mod> = {};
    rawMods.forEach((m) => (modMap[m.id] = m));
    deps.forEach((e) =>
      [e.from, e.to].forEach((id) => {
        if (!modMap[id]) modMap[id] = { id, layer: inferLayer(id), ports: { inbound: [], outbound: [] }, synthetic: true };
      })
    );
    const mods = Object.values(modMap);

    const out: Record<string, string[]> = {};
    mods.forEach((m) => (out[m.id] = []));
    deps.forEach((e) => out[e.from]?.push(e.to));

    const layerFloor: Record<Layer, number> = { framework: 0, app: 3, aggregate: 4 };
    const memo: Record<string, number> = {};
    const depth = (id: string, seen: Set<string> = new Set()): number => {
      if (memo[id] != null) return memo[id];
      if (seen.has(id)) return 0;
      seen.add(id);
      const outs = out[id] ?? [];
      const d = outs.length ? 1 + Math.max(...outs.map((t) => depth(t, seen))) : 0;
      seen.delete(id);
      return (memo[id] = d);
    };

    const band: Record<string, number> = {};
    mods.forEach((m) => (band[m.id] = Math.max(depth(m.id), layerFloor[m.layer] ?? 0)));

    const byBand: Record<number, Mod[]> = {};
    mods.forEach((m) => (byBand[band[m.id]] ??= []).push(m));
    const pos: Record<string, THREE.Vector3> = {};
    const order: Record<string, number> = {};
    const bandKeys = Object.keys(byBand).map(Number).sort((a, b) => a - b);
    const SPACING_X = 3.4;
    const BAND_Y = 2.3;
    let appearIdx = 0;
    bandKeys.forEach((b) => {
      const list = byBand[b].sort((a, z) => a.id.localeCompare(z.id));
      list.forEach((m, i) => {
        const x = (i - (list.length - 1) / 2) * SPACING_X;
        const y = b * BAND_Y - (bandKeys.length - 1) * BAND_Y * 0.5;
        const z = (i % 2 === 0 ? -1 : 1) * 0.4;
        pos[m.id] = new THREE.Vector3(x, y, z);
        order[m.id] = appearIdx++;
      });
    });

    const edges = deps.filter((e) => pos[e.from] && pos[e.to]);
    const bands = bandKeys.map((b) => ({
      label: BAND_LABEL[b] ?? `Layer ${b}`,
      x: -((Math.max(...bandKeys.map((k) => byBand[k].length)) - 1) / 2) * SPACING_X - 2.6,
      y: b * BAND_Y - (bandKeys.length - 1) * BAND_Y * 0.5,
    }));
    return { mods, pos, edges, bands, count: appearIdx };
  }, []);
}

/* ─── Module node ─────────────────────────────────────────────────────────── */

function ModuleNode({
  mod,
  position,
  appearDelay,
  onHover,
  dimmed,
  palette,
  reduced,
  glow,
}: {
  mod: Mod;
  position: THREE.Vector3;
  appearDelay: number;
  onHover: (id: string | null) => void;
  dimmed: boolean;
  palette: Palette;
  reduced: boolean;
  glow: THREE.Texture;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const sprite = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);
  const t = useRef(0);
  const color = palette.layer[mod.layer];
  const portCount = mod.ports.inbound.length + mod.ports.outbound.length;
  const w = 1.7 + Math.min(portCount, 10) * 0.1;

  useFrame((_, dt) => {
    t.current += dt;
    // staggered entrance: 0 → 1 eased, after appearDelay
    const raw = reduced ? 1 : Math.min(1, Math.max(0, (t.current - appearDelay) / 0.7));
    const appear = 1 - Math.pow(1 - raw, 3); // easeOutCubic
    const float = reduced ? 0 : Math.sin(t.current * 0.9 + appearDelay * 6) * 0.06;
    const targetScale = (hovered ? 1.12 : 1) * appear;

    if (group.current) {
      group.current.position.set(position.x, position.y + float + (1 - appear) * -1.4, position.z);
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 1 - Math.pow(0.001, dt)));
    }
    if (mat.current) {
      const e = (hovered ? palette.emissive + 0.7 : palette.emissive) * appear;
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(mat.current.emissiveIntensity, e, 1 - Math.pow(0.01, dt));
      mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, dimmed ? 0.3 : 1, 1 - Math.pow(0.01, dt));
    }
    if (sprite.current) {
      const target = (hovered ? palette.glowOpacity + 0.35 : palette.glowOpacity) * appear * (dimmed ? 0.25 : 1);
      const m = sprite.current.material as THREE.SpriteMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, target, 1 - Math.pow(0.01, dt));
    }
  });

  return (
    <group ref={group} position={position}>
      {/* additive glow halo */}
      <sprite ref={sprite} scale={[w * 2.4, 2.2, 1]} position={[0, 0, -0.05]}>
        <spriteMaterial map={glow} color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      <RoundedBox
        ref={mesh}
        args={[w, 0.74, 1.05]}
        radius={0.12}
        smoothness={4}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(mod.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={palette.emissive}
          metalness={palette.metalness}
          roughness={palette.roughness}
          transparent
          opacity={1}
        />
      </RoundedBox>

      <Billboard>
        <Text
          fontSize={0.26}
          color={palette.text}
          anchorX="center"
          anchorY="middle"
          maxWidth={w + 0.6}
          outlineWidth={0.012}
          outlineColor={palette.textOutline}
          fillOpacity={dimmed ? 0.4 : 1}
        >
          {mod.id.replace("orasaka-", "")}
        </Text>
      </Billboard>

      {hovered && (
        <Html position={[0, 0.9, 0]} center distanceFactor={9} pointerEvents="none" zIndexRange={[100, 0]}>
          <div className="kz-arch3d-tip">
            <strong>{mod.id}</strong>
            <div className="kz-arch3d-tip-layer">
              {mod.layer}
              {mod.synthetic ? " · adapter" : ""}
            </div>
            {mod.ports.inbound.length > 0 && (
              <div>
                <span className="kz-arch3d-tip-label">in</span> {mod.ports.inbound.join(", ")}
              </div>
            )}
            {mod.ports.outbound.length > 0 && (
              <div>
                <span className="kz-arch3d-tip-label">out</span> {mod.ports.outbound.join(", ")}
              </div>
            )}
            {portCount === 0 && <div className="kz-arch3d-tip-muted">No declared ports</div>}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Animated dependency edge ────────────────────────────────────────────── */

function Edge({ from, to, active, related, palette }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean; related: boolean; palette: Palette }) {
  const ref = useRef<{ material: THREE.LineDashedMaterial | THREE.LineBasicMaterial } | null>(null);
  useFrame((_, dt) => {
    const mat = (ref.current as unknown as { material?: { dashOffset?: number } })?.material;
    if (mat && active && related && mat.dashOffset != null) mat.dashOffset -= dt * 2.2; // flow toward target
  });
  const lit = !active || related;
  return (
    <Line
      ref={ref as never}
      points={[from, to]}
      color={lit ? (active ? palette.edgeActive : palette.edgeBase) : palette.edgeBase}
      lineWidth={active && related ? 2.2 : 1.5}
      transparent
      opacity={lit ? (active ? 0.95 : 0.38) : palette.edgeDim}
      dashed={active && related}
      dashSize={0.5}
      gapSize={0.28}
    />
  );
}

/* ─── Theme-reactive scene environment ────────────────────────────────────── */

function SceneEnv({ palette }: { palette: Palette }) {
  return (
    <>
      {/* Declarative, theme-reactive background + fog (updates on palette change). */}
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, palette.fog[0], palette.fog[1]]} />
      <hemisphereLight args={[palette.hemiSky, palette.hemiGround, palette.hemiIntensity]} />
      <ambientLight intensity={palette.ambient} />
      <pointLight position={[10, 12, 8]} intensity={palette.keyIntensity} color={palette.keyLight} />
      <pointLight position={[-10, -6, -8]} intensity={palette.rimIntensity} color={palette.rimLight} />
    </>
  );
}

function Graph({ palette, reduced, glow }: { palette: Palette; reduced: boolean; glow: THREE.Texture }) {
  const { mods, pos, edges, bands, count } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  const orderRef = useMemo(() => {
    const o: Record<string, number> = {};
    let i = 0;
    [...mods].sort((a, b) => (pos[a.id]?.y ?? 0) - (pos[b.id]?.y ?? 0)).forEach((m) => (o[m.id] = i++));
    return o;
  }, [mods, pos]);

  return (
    <group>
      {/* faint layer-band labels on the left rail */}
      {bands.map((b) => (
        <Billboard key={b.label} position={[b.x, b.y, 0]}>
          <Text fontSize={0.2} color={palette.bandLabel} anchorX="right" anchorY="middle" letterSpacing={0.08}>
            {b.label.toUpperCase()}
          </Text>
        </Billboard>
      ))}

      {edges.map((e, i) => (
        <Edge
          key={i}
          from={pos[e.from]}
          to={pos[e.to]}
          active={!!active}
          related={!active || e.from === active || e.to === active}
          palette={palette}
        />
      ))}

      {mods.map((m) =>
        pos[m.id] ? (
          <ModuleNode
            key={m.id}
            mod={m}
            position={pos[m.id]}
            appearDelay={reduced ? 0 : (orderRef[m.id] / Math.max(count, 1)) * 0.7}
            onHover={setActive}
            palette={palette}
            reduced={reduced}
            glow={glow}
            dimmed={
              !!active &&
              active !== m.id &&
              !edges.some((e) => (e.from === active && e.to === m.id) || (e.to === active && e.from === m.id))
            }
          />
        ) : null
      )}

      <ContactShadows position={[0, -5.6, 0]} opacity={palette.shadowOpacity} scale={26} blur={2.6} far={9} color={palette.layer.framework} />
    </group>
  );
}

function Legend({ palette }: { palette: Palette }) {
  return (
    <div className="kz-arch3d-legend" aria-hidden>
      {(["framework", "app", "aggregate"] as Layer[]).map((l) => (
        <span key={l}>
          <i style={{ background: palette.layer[l] }} />
          {l === "framework" ? "Framework" : l === "app" ? "Application" : "Aggregate"}
        </span>
      ))}
    </div>
  );
}

export default function ArchitectureScene3D() {
  const { theme } = useTheme();
  const palette = PALETTE[theme === "light" ? "light" : "dark"];
  const reduced = usePrefersReducedMotion();
  const glow = useGlowTexture();

  return (
    <div className="kz-arch3d" data-theme={theme}>
      <Legend palette={palette} />
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 19], fov: 50 }} gl={{ antialias: true }}>
        <SceneEnv palette={palette} />
        <Suspense fallback={null}>
          <Graph palette={palette} reduced={reduced} glow={glow} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom target={[0, 0.3, 0]} minDistance={9} maxDistance={32} autoRotate={false} />
      </Canvas>
    </div>
  );
}
