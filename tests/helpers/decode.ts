import { Resvg } from "@resvg/resvg-js";
import jsQR from "jsqr";

function rasterDecode(svg: string, width: number): string | null {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    background: "#ffffff",
    font: { loadSystemFonts: false },
  });
  const img = resvg.render();
  const px = img.pixels;
  const data = new Uint8ClampedArray(px.buffer, px.byteOffset, px.length);
  const code = jsQR(data, img.width, img.height, { inversionAttempts: "attemptBoth" });
  return code ? code.data : null;
}

/** Wraps the SVG body in a Gaussian blur, like a camera frame that is slightly out of focus. */
function soften(svg: string, std: number): string {
  return svg
    .replace(
      /(<svg[^>]*>)/,
      `$1<defs><filter id="cam" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${std}"/></filter></defs><g filter="url(#cam)">`,
    )
    .replace(/<\/svg>$/, "</g></svg>");
}

/**
 * Rasterises an SVG with resvg (a spec-compliant renderer) and decodes it with
 * jsQR. Phone scanners read many frames with varying sharpness, so a read
 * counts if either a crisp frame or a slightly soft one decodes.
 *
 * `moduleSize` is the size of one QR module in SVG user units; the soft frame
 * uses a blur of 0.15 modules.
 */
export function decodeSvg(svg: string, width = 640, moduleSize?: number): string | null {
  const crisp = rasterDecode(svg, width);
  if (crisp !== null || !moduleSize) return crisp;
  return rasterDecode(soften(svg, moduleSize * 0.15), width);
}

/** Renders a tiny SVG to a PNG data URL, used as a stand-in logo in tests. */
export function svgToPngDataUrl(svg: string, size = 256): string {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
  return `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
}
