import { video } from "@/lib/cdn";

export interface AmbientSources {
  webm: string;
  mp4: string;
  poster: string;
}

export type AmbientSet = Record<"wide" | "tall", Record<"dark" | "light", AmbientSources>>;

const valley = (cut: string, theme: "dark" | "light") => video(`brand-films/ambient/home-valley-${cut}-${theme}`);
const cuts = (cut: string) => ({ dark: valley(cut, "dark"), light: valley(cut, "light") });

/** The valley, looping, without its birds; the live flocks stand on it. */
export const VALLEY: AmbientSet = { wide: cuts("16x9"), tall: cuts("4x5") };
