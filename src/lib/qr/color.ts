import type { Paint, QrDesign } from "./types";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3,8})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
  if (h.length !== 6 && h.length !== 8) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Every colour a paint can produce at its extremes. */
export function paintColors(p: Paint): string[] {
  return p.kind === "solid" ? [p.color] : [p.from, p.to];
}

export interface ContrastReport {
  /** Lowest contrast between any foreground colour and the background. */
  ratio: number;
  /** Foreground lighter than background. Many older scanners cannot read inverted codes. */
  inverted: boolean;
  level: "good" | "low" | "poor";
}

/** Contrast between the code and whatever sits behind it (white if transparent). */
export function contrastReport(design: QrDesign): ContrastReport {
  // A transparent code is assumed to be placed on white.
  const bg = design.bg ?? "#ffffff";
  const fgColors = [
    ...paintColors(design.fg),
    ...(design.eyeFrameColor ? [design.eyeFrameColor] : []),
    ...(design.eyeBallColor ? [design.eyeBallColor] : []),
  ];
  const ratio = Math.min(...fgColors.map((c) => contrastRatio(c, bg)));
  const inverted = fgColors.some((c) => luminance(c) > luminance(bg));
  const level = inverted || ratio < 2.5 ? "poor" : ratio < 4 ? "low" : "good";
  return { ratio, inverted, level };
}

/** Picks black or white text for readability on a background colour. */
export function readableTextOn(bg: string): string {
  return luminance(bg) > 0.4 ? "#0d0d0e" : "#ffffff";
}
