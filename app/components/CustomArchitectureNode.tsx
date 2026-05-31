import { Handle, Position } from '@xyflow/react';

/* On-brand architecture node — electric-blue accent, theme-aware (tokens flip
   in light mode), finished glass surface. No amber. */
export default function CustomArchitectureNode({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }: any) {
  return (
    <div
      className="kz-arch-node group relative min-w-[156px] rounded-xl px-4 py-3 backdrop-blur-md transition-all duration-300"
      style={{
        background: "color-mix(in srgb, var(--kz-surface-2) 80%, transparent)",
        border: "1px solid var(--kz-border-default)",
        boxShadow: "var(--kz-shadow-md)",
      }}
    >
      <Handle type="target" position={targetPosition} className="opacity-0" />
      <div
        className="text-center font-mono text-[11px] font-medium leading-tight whitespace-pre-wrap break-words"
        style={{ color: "var(--kz-text-primary)" }}
      >
        {data.label}
      </div>
      <Handle type="source" position={sourcePosition} className="opacity-0" />
      <style>{`
        .kz-arch-node:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 0 0 1px var(--kz-accent), 0 0 18px var(--kz-accent-soft) !important;
        }
      `}</style>
    </div>
  );
}
