import { canvasToBlob, sceneToCanvas } from "@/lib/qr/canvas";
import type { Scene } from "@/lib/qr/scene";

export type RasterFormat = "png" | "jpeg" | "webp";

const MIME: Record<RasterFormat, "image/png" | "image/jpeg" | "image/webp"> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function sceneBlob(
  scene: Scene,
  format: RasterFormat,
  width: number,
): Promise<Blob> {
  const canvas = await sceneToCanvas(scene, width, {
    flatten: format === "png" ? undefined : sceneBackground(scene),
  });
  return canvasToBlob(canvas, MIME[format], format === "png" ? undefined : 0.94);
}

/** The colour to paint behind transparent areas for formats without alpha. */
export function sceneBackground(scene: Scene): string {
  const first = scene.nodes.find((n) => n.t === "rect");
  if (first && first.t === "rect" && first.x === 0 && first.y === 0 && first.w === scene.width) {
    return first.fill;
  }
  return "#ffffff";
}

/** A safe file name stem from user content. */
export function fileStem(text: string, fallback = "qr-code"): string {
  const base = text
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || fallback;
}
