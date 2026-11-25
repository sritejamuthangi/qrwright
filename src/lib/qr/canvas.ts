import { roundedRect } from "./paths";
import { FRAME_FONT, type Scene, type SceneFill, type SceneGradient } from "./scene";

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load logo image."));
      img.src = src;
    });
    imageCache.set(src, p);
    if (imageCache.size > 24) imageCache.delete(imageCache.keys().next().value as string);
  }
  return p;
}

function resolveFill(
  ctx: CanvasRenderingContext2D,
  fill: SceneFill,
  gradients: SceneGradient[],
): string | CanvasGradient {
  if (typeof fill === "string") return fill;
  const g = gradients.find((x) => x.id === fill.gradient);
  if (!g) return "#000";
  const grad =
    g.kind === "linear"
      ? ctx.createLinearGradient(g.x1, g.y1, g.x2, g.y2)
      : ctx.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, g.r);
  grad.addColorStop(0, g.from);
  grad.addColorStop(1, g.to);
  return grad;
}

export interface CanvasRenderOptions {
  /** Fill the whole canvas with this colour first (used for JPEG and scan tests). */
  flatten?: string;
  /** Optional CSS filter applied while drawing, e.g. "blur(1px)". */
  filter?: string;
}

/** Paints a scene onto a new canvas `widthPx` wide. Browser only. */
export async function sceneToCanvas(
  scene: Scene,
  widthPx: number,
  opts: CanvasRenderOptions = {},
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const w = Math.max(1, Math.round(widthPx));
  const h = Math.max(1, Math.round((widthPx * scene.height) / scene.width));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  const images = new Map<string, HTMLImageElement>();
  await Promise.all(
    scene.nodes
      .filter((n) => n.t === "image")
      .map(async (n) => {
        if (n.t === "image") images.set(n.href, await loadImage(n.href));
      }),
  );

  if (opts.flatten) {
    ctx.fillStyle = opts.flatten;
    ctx.fillRect(0, 0, w, h);
  }
  if (opts.filter && "filter" in ctx) ctx.filter = opts.filter;

  const k = w / scene.width;
  ctx.scale(k, k);

  for (const node of scene.nodes) {
    ctx.save();
    switch (node.t) {
      case "path": {
        if (!node.d) break;
        if (node.tf) {
          ctx.translate(node.tf.tx, node.tf.ty);
          ctx.scale(node.tf.s, node.tf.s);
        }
        ctx.fillStyle = resolveFill(ctx, node.fill, scene.gradients);
        ctx.fill(new Path2D(node.d), node.rule ?? "nonzero");
        break;
      }
      case "rect": {
        ctx.fillStyle = node.fill;
        if (node.r) ctx.fill(new Path2D(roundedRect(node.x, node.y, node.w, node.h, node.r)));
        else ctx.fillRect(node.x, node.y, node.w, node.h);
        break;
      }
      case "circle": {
        ctx.fillStyle = node.fill;
        ctx.beginPath();
        ctx.arc(node.cx, node.cy, node.r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "image": {
        const img = images.get(node.href);
        if (img) {
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, node.x, node.y, node.w, node.h);
        }
        break;
      }
      case "text": {
        ctx.fillStyle = node.fill;
        ctx.font = `700 ${node.size}px ${FRAME_FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(node.text, node.x, node.y);
        break;
      }
    }
    ctx.restore();
  }
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: "image/png" | "image/jpeg" | "image/webp",
  quality = 0.95,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export the image."))),
      type,
      quality,
    );
  });
}
