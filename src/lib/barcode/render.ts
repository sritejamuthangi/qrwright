import type { BarcodeFormat } from "./formats";

export interface BarcodeRenderOptions {
  scale: number;
  /** Bar height in millimetres (1D formats). */
  height: number;
  includeText: boolean;
  barColor: string;
  /** `null` for a transparent background. */
  background: string | null;
  rotate: 0 | 90 | 180 | 270;
}

export const DEFAULT_BARCODE_OPTIONS: BarcodeRenderOptions = {
  scale: 3,
  height: 15,
  includeText: true,
  barColor: "#0d0d0e",
  background: "#ffffff",
  rotate: 0,
};

const ROTATE = { 0: "N", 90: "R", 180: "I", 270: "L" } as const;

const hex = (c: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c.slice(1) : "000000");

/** Renders a barcode to an SVG string using bwip-js. Runs in the browser. */
export async function barcodeSvg(
  text: string,
  format: BarcodeFormat,
  opts: BarcodeRenderOptions,
): Promise<string> {
  const bwip = await import("bwip-js/browser");
  const draw = (bwip as unknown as Record<string, (o: unknown, d: unknown) => string>)[format.bwip];
  if (!draw) throw new Error("That barcode format is not available.");
  const is2d = format.group === "two-d";
  return draw(
    {
      text,
      scale: is2d ? Math.max(2, Math.round(opts.scale * 0.8)) : opts.scale,
      height: opts.height,
      includetext: is2d ? false : opts.includeText,
      textxalign: "center",
      textsize: 9,
      barcolor: hex(opts.barColor),
      textcolor: hex(opts.barColor),
      backgroundcolor: opts.background ? hex(opts.background) : undefined,
      rotate: ROTATE[opts.rotate],
      paddingwidth: 8,
      paddingheight: 4,
    },
    bwip.drawingSVG(),
  );
}

/** Adds explicit pixel dimensions to a bwip SVG (which only has a viewBox). */
export function withSvgSize(svg: string, width: number): string {
  const vb = /viewBox="([\d.\s-]+)"/.exec(svg);
  if (!vb) return svg;
  const [, , w, h] = vb[1].trim().split(/\s+/).map(Number);
  if (!w || !h) return svg;
  const height = Math.round((width * h) / w);
  return svg.replace(/<svg /, `<svg width="${Math.round(width)}" height="${height}" `);
}

/** Draws an SVG string onto a canvas at the requested width. Browser only. */
export async function svgToCanvas(svg: string, width: number): Promise<HTMLCanvasElement> {
  const sized = withSvgSize(svg, width);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  const img = new Image();
  img.decoding = "sync";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not render the barcode."));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.max(1, Math.round((width * img.height) / img.width));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
