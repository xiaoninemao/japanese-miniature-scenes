import type { Kit, XYZ } from "./kit.ts";

export interface SceneAnimation {
  update?: (delta: number, time: number, reducedMotion: boolean, pixelsPerUnit: number) => void;
  dispose?: () => void;
}

export type SceneBuilder = (kit: Kit) => SceneAnimation | void;

export interface SceneConfig {
  title: string;
  background: string;
  light: string;
  intensity: number;
  ambient: number;
  camera: XYZ;
  target: XYZ;
  verticalSpan: number;
}
