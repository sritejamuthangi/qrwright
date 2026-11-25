import { FRAME_FONT, type Scene, type SceneFill, type Transform } from "./scene";
import { fmt } from "./paths";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface SvgOptions {
  /** Output width in px. Omit for a fluid SVG that scales with its container. */
  size?: number;
  /** Prefix for gradient ids, so several codes can share one HTML document. */
  idPrefix?: string;
  /** Accessible title. */
  title?: string;
}

/** Serialises a scene to a standalone SVG document string. */
export function sceneToSvg(scene: Scene, opts: SvgOptions = {}): string {
  const prefix = (opts.idPrefix ?? "qrw").replace(/[^a-z0-9_-]/gi, "");
  const W = scene.width;
  const H = scene.height;
  const dims = opts.size
    ? ` width="${Math.round(opts.size)}" height="${Math.round((opts.size * H) / W)}"`
    : "";

  const fill = (f: SceneFill) => (typeof f === "string" ? f : `url(#${prefix}-${f.gradient})`);
  const tfAttr = (tf?: Transform) =>
    tf ? ` transform="translate(${fmt(tf.tx)} ${fmt(tf.ty)}) scale(${fmt(tf.s)})"` : "";

  let defs = "";
  for (const g of scene.gradients) {
    const stops = `<stop offset="0" stop-color="${g.from}"/><stop offset="1" stop-color="${g.to}"/>`;
    defs +=
      g.kind === "linear"
        ? `<linearGradient id="${prefix}-${g.id}" gradientUnits="userSpaceOnUse" x1="${fmt(g.x1)}" y1="${fmt(g.y1)}" x2="${fmt(g.x2)}" y2="${fmt(g.y2)}">${stops}</linearGradient>`
        : `<radialGradient id="${prefix}-${g.id}" gradientUnits="userSpaceOnUse" cx="${fmt(g.cx)}" cy="${fmt(g.cy)}" r="${fmt(g.r)}">${stops}</radialGradient>`;
  }

  let body = "";
  for (const node of scene.nodes) {
    switch (node.t) {
      case "path":
        if (!node.d) break;
        body += `<path d="${node.d}" fill="${fill(node.fill)}"${node.rule ? ` fill-rule="${node.rule}"` : ""}${tfAttr(node.tf)}/>`;
        break;
      case "rect":
        body += `<rect x="${fmt(node.x)}" y="${fmt(node.y)}" width="${fmt(node.w)}" height="${fmt(node.h)}"${node.r ? ` rx="${fmt(node.r)}"` : ""} fill="${node.fill}"/>`;
        break;
      case "circle":
        body += `<circle cx="${fmt(node.cx)}" cy="${fmt(node.cy)}" r="${fmt(node.r)}" fill="${node.fill}"/>`;
        break;
      case "image":
        body += `<image href="${esc(node.href)}" x="${fmt(node.x)}" y="${fmt(node.y)}" width="${fmt(node.w)}" height="${fmt(node.h)}" preserveAspectRatio="xMidYMid meet"/>`;
        break;
      case "text":
        body += `<text x="${fmt(node.x)}" y="${fmt(node.y)}" text-anchor="middle" font-family="${FRAME_FONT}" font-weight="700" font-size="${fmt(node.size)}" fill="${node.fill}">${esc(node.text)}</text>`;
        break;
    }
  }

  const title = opts.title ? `<title>${esc(opts.title)}</title>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(W)} ${fmt(H)}"${dims} role="img">` +
    title +
    (defs ? `<defs>${defs}</defs>` : "") +
    body +
    `</svg>`
  );
}
