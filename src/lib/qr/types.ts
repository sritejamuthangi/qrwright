/** Error correction level. Higher levels survive more damage (or a logo) but make denser codes. */
export type EcLevel = "L" | "M" | "Q" | "H";

export const DOT_STYLES = [
  "square",
  "soft",
  "rounded",
  "liquid",
  "classy",
  "classy-rounded",
  "dots",
  "diamond",
  "pixel",
  "vertical",
  "horizontal",
] as const;
export type DotStyle = (typeof DOT_STYLES)[number];

// Dotted eyes were evaluated and removed: they break the 1:1:3:1:1 finder
// ratio along diagonals, and failed decoding in most test renders.
export const EYE_FRAME_STYLES = ["square", "rounded", "extra-rounded", "circle", "leaf"] as const;
export type EyeFrameStyle = (typeof EYE_FRAME_STYLES)[number];

export const EYE_BALL_STYLES = ["square", "rounded", "circle", "diamond", "leaf"] as const;
export type EyeBallStyle = (typeof EYE_BALL_STYLES)[number];

/**
 * Eye-ball shapes that decode reliably inside each eye-frame shape, measured
 * across square, dotted, diamond and striped module styles (see
 * tests/qr-engine.test.ts). Mismatched roundness skews the finder pattern
 * along its diagonals, and scanners then confuse it with nearby modules.
 */
export const RELIABLE_EYE_BALLS: Record<EyeFrameStyle, readonly EyeBallStyle[]> = {
  square: ["square"],
  rounded: ["square", "rounded", "leaf"],
  "extra-rounded": ["rounded", "circle", "diamond", "leaf"],
  circle: ["rounded", "circle", "diamond", "leaf"],
  leaf: ["rounded", "leaf"],
};

export function isReliableEyePair(frame: EyeFrameStyle, ball: EyeBallStyle): boolean {
  return RELIABLE_EYE_BALLS[frame].includes(ball);
}

export const FRAME_STYLES = [
  "none",
  "banner-bottom",
  "banner-top",
  "box",
  "bubble",
  "pill",
  "viewfinder",
] as const;
export type FrameStyle = (typeof FRAME_STYLES)[number];

export type Paint =
  | { kind: "solid"; color: string }
  | { kind: "linear"; from: string; to: string; angle: number }
  | { kind: "radial"; from: string; to: string };

export type LogoPlate = "none" | "square" | "rounded" | "circle";

export interface LogoConfig {
  /** Square PNG/SVG data URL. Always normalised to a square image before use. */
  src: string;
  /** Logo box width as a fraction of the QR symbol width (0.12 - 0.32). */
  size: number;
  /** Shape drawn behind the logo. */
  plate: LogoPlate;
  /** Plate colour. `null` uses the QR background colour (or white). */
  plateColor: string | null;
  /** Remove modules behind the logo so it sits on a clean area. */
  excavate: boolean;
}

export interface FrameConfig {
  style: FrameStyle;
  text: string;
  color: string;
  textColor: string;
}

export interface QrDesign {
  dots: DotStyle;
  eyeFrame: EyeFrameStyle;
  eyeBall: EyeBallStyle;
  fg: Paint;
  /** Background colour. `null` means transparent. */
  bg: string | null;
  /** Eye colours. `null` inherits the foreground paint. */
  eyeFrameColor: string | null;
  eyeBallColor: string | null;
  logo: LogoConfig | null;
  frame: FrameConfig;
  ec: EcLevel | "auto";
  /** Quiet zone, in modules. The QR spec asks for 4. */
  margin: number;
}

export const DEFAULT_DESIGN: QrDesign = {
  dots: "square",
  eyeFrame: "square",
  eyeBall: "square",
  fg: { kind: "solid", color: "#0d0d0e" },
  bg: "#ffffff",
  eyeFrameColor: null,
  eyeBallColor: null,
  logo: null,
  frame: { style: "none", text: "SCAN ME", color: "#0d0d0e", textColor: "#ffffff" },
  ec: "auto",
  margin: 4,
};

export const DOT_STYLE_LABELS: Record<DotStyle, string> = {
  square: "Square",
  soft: "Soft",
  rounded: "Rounded",
  liquid: "Liquid",
  classy: "Classy",
  "classy-rounded": "Classy rounded",
  dots: "Dots",
  diamond: "Diamond",
  pixel: "Pixel",
  vertical: "Vertical",
  horizontal: "Horizontal",
};

export const EYE_FRAME_LABELS: Record<EyeFrameStyle, string> = {
  square: "Square",
  rounded: "Rounded",
  "extra-rounded": "Extra rounded",
  circle: "Circle",
  leaf: "Leaf",
};

export const EYE_BALL_LABELS: Record<EyeBallStyle, string> = {
  square: "Square",
  rounded: "Rounded",
  circle: "Circle",
  diamond: "Diamond",
  leaf: "Leaf",
};

export const FRAME_LABELS: Record<FrameStyle, string> = {
  none: "No frame",
  "banner-bottom": "Banner below",
  "banner-top": "Banner above",
  box: "Outline box",
  bubble: "Speech bubble",
  pill: "Pill label",
  viewfinder: "Viewfinder",
};

/** Resolves the effective error-correction level for a design. */
export function resolveEcLevel(design: Pick<QrDesign, "ec" | "logo">): EcLevel {
  if (design.ec !== "auto") return design.ec;
  if (design.logo) return design.logo.size > 0.24 ? "H" : "Q";
  return "M";
}
