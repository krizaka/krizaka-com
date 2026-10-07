"use client";

import { FalconAvatar, OwlAvatar, FlamingoAvatar, DuckAvatar, MascotStyles } from "../illustrations/MascotAvatars";
import CarrierPigeonBot from "../illustrations/CarrierPigeonBot";
import PhoenixMark from "./PhoenixMark";
import type { Bird } from "@/lib/story";

/** The portrait of one bird of the flock (the Krizaka mascots). */
export function BirdPortrait({ id, size = 92 }: { id: Bird["id"]; size?: number }) {
  const box = { width: size, height: size, display: "flex", alignItems: "flex-end", justifyContent: "center" } as const;
  if (id === "pigeon") return <div style={box}><CarrierPigeonBot size={size} /></div>;
  if (id === "phoenix") return <div style={box}><PhoenixMark size={size} /></div>;
  const Avatar = { falcon: FalconAvatar, owl: OwlAvatar, flamingo: FlamingoAvatar, duck: DuckAvatar }[id];
  return (
    <div style={{ ...box, padding: size * 0.08 }}>
      <div style={{ width: size * 0.72, height: size * 0.92 }}>
        <Avatar />
      </div>
    </div>
  );
}

export function FlockStyles() {
  return <MascotStyles />;
}
