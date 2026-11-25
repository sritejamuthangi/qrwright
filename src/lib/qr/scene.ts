import { alignmentCenters, finderOrigins, isFinderModule, type QrMatrix } from "./matrix";
import {
  circlePath,
  contourPath,
  convexCornerOrientation,
  diamondPath,
  fmt,
  roundedRect,
  traceContours,
  type Corner,
} from "./paths";
import type {
  DotStyle,
  EyeBallStyle,
  EyeFrameStyle,
  LogoConfig,
  Paint,
  QrDesign,
} from "./types";

/**
 * A backend-neutral description of a rendered QR code. The same scene is
 * serialised to SVG (preview, SVG export) or painted onto a canvas (PNG, JPEG,
 * WebP, PDF, scan test), so every format looks identical.
 */

export const FRAME_FONT = "Arial, Helvetica, sans-serif";

export type SceneFill = string | { gradient: string };

export interface Transform {
  tx: number;
  ty: number;
  s: number;
}

export type SceneNode =
  | { t: "path"; d: string; fill: SceneFill; rule?: "evenodd"; tf?: Transform }
  | { t: "rect"; x: number; y: number; w: number; h: number; r?: number; fill: string }
  | { t: "circle"; cx: number; cy: number; r: number; fill: string }
  | { t: "image"; href: string; x: number; y: number; w: number; h: number }
  | { t: "text"; x: number; y: number; text: string; size: number; fill: string };

export type SceneGradient =
  | { id: string; kind: "linear"; x1: number; y1: number; x2: number; y2: number; from: string; to: string }
  | { id: string; kind: "radial"; cx: number; cy: number; r: number; from: string; to: string };

export interface Scene {
  width: number;
  height: number;
  gradients: SceneGradient[];
  nodes: SceneNode[];
  /** Scene units per QR module. */
  moduleSize: number;
  /** The QR symbol plus quiet zone, in scene units. */
  qrBox: { x: number; y: number; size: number };
  matrix: { size: number; version: number; ec: string };
}

/** Width of the QR block (symbol + quiet zone) in scene units. */
const Q = 1000;

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const LOGO_SRC = /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i;

/** Returns a safe colour value, falling back if the input is not a hex colour. */
export function safeColor(c: string | null | undefined, fallback: string): string {
  return c && HEX.test(c) ? c : fallback;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// ---------------------------------------------------------------------------
// Data modules
// ---------------------------------------------------------------------------

function dotsPath(n: number, isDark: (x: number, y: number) => boolean, style: DotStyle): string {
  switch (style) {
    case "square":
    case "soft":
    case "rounded":
    case "liquid":
    case "classy":
    case "classy-rounded": {
      const loops = traceContours(n, isDark);
      const radius: Record<typeof style, (c: Corner) => number> = {
        square: () => 0,
        soft: (c) => (c.convex ? 0.22 : 0),
        rounded: (c) => (c.convex ? 0.5 : 0),
        liquid: (c) => (c.convex ? 0.5 : 0.4),
        classy: (c) => (c.convex && convexCornerOrientation(c) % 2 === 0 ? 0.5 : 0),
        "classy-rounded": (c) =>
          c.convex ? (convexCornerOrientation(c) % 2 === 0 ? 0.5 : 0.18) : 0,
      };
      return contourPath(loops, radius[style]);
    }
    case "dots":
    case "diamond":
    case "pixel": {
      let d = "";
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (!isDark(x, y)) continue;
          if (style === "dots") d += circlePath(x + 0.5, y + 0.5, 0.48);
          else if (style === "diamond") d += diamondPath(x + 0.5, y + 0.5, 0.62);
          else d += `M${fmt(x + 0.12)} ${fmt(y + 0.12)}h0.76v0.76h-0.76Z`;
        }
      }
      return d;
    }
    case "vertical":
    case "horizontal": {
      const vertical = style === "vertical";
      let d = "";
      for (let a = 0; a < n; a++) {
        let start = -1;
        for (let b = 0; b <= n; b++) {
          const dark = b < n && (vertical ? isDark(a, b) : isDark(b, a));
          if (dark && start < 0) start = b;
          if (!dark && start >= 0) {
            const len = b - start;
            d += vertical
              ? roundedRect(a + 0.1, start + 0.04, 0.8, len - 0.08, 0.4)
              : roundedRect(start + 0.04, a + 0.1, len - 0.08, 0.8, 0.4);
            start = -1;
          }
        }
      }
      return d;
    }
  }
}

// ---------------------------------------------------------------------------
// Finder patterns ("eyes")
// ---------------------------------------------------------------------------

type EyeCorner = "tl" | "tr" | "bl";

/** Leaf shapes keep the corner that faces the centre of the code sharp. */
function leafRadii(corner: EyeCorner, r: number): [number, number, number, number] {
  if (corner === "tl") return [r, r, 0, r];
  if (corner === "tr") return [r, r, r, 0];
  return [r, 0, r, r];
}

function eyeFramePath(ox: number, oy: number, corner: EyeCorner, style: EyeFrameStyle): string {
  switch (style) {
    case "square":
      return roundedRect(ox, oy, 7, 7, 0) + roundedRect(ox + 1, oy + 1, 5, 5, 0);
    case "rounded":
      return roundedRect(ox, oy, 7, 7, 2) + roundedRect(ox + 1, oy + 1, 5, 5, 1);
    case "extra-rounded":
      return roundedRect(ox, oy, 7, 7, 3) + roundedRect(ox + 1, oy + 1, 5, 5, 2);
    case "circle":
      return circlePath(ox + 3.5, oy + 3.5, 3.5) + circlePath(ox + 3.5, oy + 3.5, 2.5);
    case "leaf":
      return (
        roundedRect(ox, oy, 7, 7, leafRadii(corner, 3)) +
        roundedRect(ox + 1, oy + 1, 5, 5, leafRadii(corner, 2))
      );
  }
}

function eyeBallPath(ox: number, oy: number, corner: EyeCorner, style: EyeBallStyle): string {
  const x = ox + 2;
  const y = oy + 2;
  switch (style) {
    case "square":
      return roundedRect(x, y, 3, 3, 0);
    case "rounded":
      return roundedRect(x, y, 3, 3, 0.9);
    case "circle":
      return circlePath(x + 1.5, y + 1.5, 1.5);
    case "diamond": {
      // A diamond with flattened tips. A pure diamond is either too short on
      // the diagonals or too long on the axes for finder-pattern detection;
      // clipping the tips keeps both close to the 1:1:3:1:1 ratio.
      const cx = x + 1.5;
      const cy = y + 1.5;
      const a = 1.65;
      const b = 0.45;
      const pts: [number, number][] = [
        [a, -b], [a, b], [b, a], [-b, a], [-a, b], [-a, -b], [-b, -a], [b, -a],
      ];
      return pts.map(([px, py], i) => `${i ? "L" : "M"}${fmt(cx + px)} ${fmt(cy + py)}`).join("") + "Z";
    }
    case "leaf":
      return roundedRect(x, y, 3, 3, leafRadii(corner, 1.3));
  }
}

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------

interface LogoBox {
  /** Plate box in module units. */
  x: number;
  y: number;
  size: number;
  /** Image box in module units. */
  ix: number;
  iy: number;
  isize: number;
}

function computeLogoBox(n: number, logo: LogoConfig): LogoBox {
  const size = clamp(logo.size, 0.1, 0.34) * n;
  const x = (n - size) / 2;
  const inset = logo.plate === "none" ? 0 : size * (logo.plate === "circle" ? 0.17 : 0.11);
  return { x, y: x, size, ix: x + inset, iy: x + inset, isize: size - inset * 2 };
}

function excavationMask(n: number, box: LogoBox, plate: LogoConfig["plate"]): Uint8Array {
  const mask = new Uint8Array(n * n);
  const pad = 0.2;
  const cx = box.x + box.size / 2;
  const cy = box.y + box.size / 2;
  const r = box.size / 2 + pad;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let hit: boolean;
      if (plate === "circle") {
        // Distance from circle centre to the nearest point of the module square.
        const nx = clamp(cx, x, x + 1);
        const ny = clamp(cy, y, y + 1);
        hit = (nx - cx) ** 2 + (ny - cy) ** 2 < r * r;
      } else {
        hit =
          x + 1 > box.x - pad &&
          x < box.x + box.size + pad &&
          y + 1 > box.y - pad &&
          y < box.y + box.size + pad;
      }
      if (hit) mask[y * n + x] = 1;
    }
  }
  return mask;
}

// ---------------------------------------------------------------------------
// Frames
// ---------------------------------------------------------------------------

/** Approximate advance width of a string in ems for a bold sans-serif face. */
export function textWidthEm(s: string): number {
  let w = 0;
  for (const ch of s) {
    if (ch === " ") w += 0.28;
    else if (/[MW]/.test(ch)) w += 0.88;
    else if (/[I]/.test(ch)) w += 0.3;
    else if (/[A-Z]/.test(ch)) w += 0.72;
    else if (/[mw]/.test(ch)) w += 0.86;
    else if (/[ijlf!.,:;'|]/.test(ch)) w += 0.3;
    else if (/[a-z0-9]/.test(ch)) w += 0.6;
    else w += 0.66;
  }
  return w;
}

function fitText(text: string, maxWidth: number, maxSize: number) {
  const em = textWidthEm(text) || 1;
  return Math.max(24, Math.min(maxSize, maxWidth / em));
}

function textNode(text: string, cx: number, cy: number, size: number, fill: string): SceneNode {
  // Baseline sits so cap-height is optically centred on cy.
  return { t: "text", x: cx, y: cy + size * 0.36, text, size, fill };
}

interface FrameLayout {
  width: number;
  height: number;
  qx: number;
  qy: number;
  before: SceneNode[];
  after: SceneNode[];
  /** Background painted behind the QR block (symbol + quiet zone). */
  qrBg: string | null;
  qrBgRadius: number;
}

function layoutFrame(design: QrDesign): FrameLayout {
  const { frame } = design;
  const bg = design.bg ? safeColor(design.bg, "#ffffff") : null;
  const fc = safeColor(frame.color, "#0d0d0e");
  const tc = safeColor(frame.textColor, "#ffffff");
  const text = frame.text.trim().slice(0, 40);

  switch (frame.style) {
    case "none":
      return { width: Q, height: Q, qx: 0, qy: 0, before: [], after: [], qrBg: bg, qrBgRadius: 0 };

    case "banner-bottom":
    case "banner-top": {
      const p = 40;
      const L = text ? 220 : p;
      const W = Q + p * 2;
      const H = Q + p + L;
      const top = frame.style === "banner-top";
      const qy = top ? L : p;
      const labelCy = top ? L / 2 + 10 : Q + p + L / 2 - 10;
      const after: SceneNode[] = text
        ? [textNode(text, W / 2, labelCy, fitText(text, W - p * 4, L * 0.42), tc)]
        : [];
      return {
        width: W,
        height: H,
        qx: p,
        qy,
        before: [{ t: "rect", x: 0, y: 0, w: W, h: H, r: 64, fill: fc }],
        after,
        qrBg: bg ?? "#ffffff",
        qrBgRadius: 30,
      };
    }

    case "box": {
      const t = 26;
      const g = 18;
      const L = text ? 190 : 0;
      const W = Q + (t + g) * 2;
      const H = W + L;
      const R = 72;
      const before: SceneNode[] = [];
      if (bg) before.push({ t: "rect", x: 0, y: 0, w: W, h: H, r: R, fill: bg });
      before.push({
        t: "path",
        d: roundedRect(0, 0, W, H, R) + roundedRect(t, t, W - t * 2, H - t * 2, R - t),
        fill: fc,
        rule: "evenodd",
      });
      const after: SceneNode[] = text
        ? [textNode(text, W / 2, t + g + Q + (L - t) / 2, fitText(text, W - 160, L * 0.46), fc)]
        : [];
      return { width: W, height: H, qx: t + g, qy: t + g, before, after, qrBg: null, qrBgRadius: 0 };
    }

    case "bubble": {
      const gap = 44;
      const L = 200;
      const W = Q;
      const H = text ? Q + gap + L : Q;
      const after: SceneNode[] = [];
      if (text) {
        const by = Q + gap;
        after.push(
          { t: "rect", x: 0, y: by, w: W, h: L, r: 64, fill: fc },
          {
            t: "path",
            d: `M${W / 2 - 48} ${by + 2}L${W / 2} ${by - 40}L${W / 2 + 48} ${by + 2}Z`,
            fill: fc,
          },
          textNode(text, W / 2, by + L / 2, fitText(text, W - 160, L * 0.44), tc),
        );
      }
      return { width: W, height: H, qx: 0, qy: 0, before: [], after, qrBg: bg, qrBgRadius: 44 };
    }

    case "pill": {
      const t = 24;
      const g = 18;
      const gb = text ? 76 : g;
      const W = Q + (t + g) * 2;
      const ringH = t + g + Q + gb + t;
      const Lh = 140;
      const H = text ? ringH + Lh / 2 - t / 2 + 8 : ringH;
      const R = 80;
      const before: SceneNode[] = [];
      if (bg) before.push({ t: "rect", x: 0, y: 0, w: W, h: ringH, r: R, fill: bg });
      before.push({
        t: "path",
        d: roundedRect(0, 0, W, ringH, R) + roundedRect(t, t, W - t * 2, ringH - t * 2, R - t),
        fill: fc,
        rule: "evenodd",
      });
      const after: SceneNode[] = [];
      if (text) {
        const size = fitText(text, W * 0.8 - 100, Lh * 0.46);
        const pw = clamp(textWidthEm(text) * size + 120, W * 0.42, W * 0.86);
        const cy = ringH - t / 2;
        after.push(
          { t: "rect", x: (W - pw) / 2, y: cy - Lh / 2, w: pw, h: Lh, r: Lh / 2, fill: fc },
          textNode(text, W / 2, cy, size, tc),
        );
      }
      return { width: W, height: H, qx: t + g, qy: t + g, before, after, qrBg: null, qrBgRadius: 0 };
    }

    case "viewfinder": {
      const p = 70;
      const L = text ? 200 : 0;
      const W = Q + p * 2;
      const H = W + L;
      const before: SceneNode[] = [];
      if (bg) before.push({ t: "rect", x: 0, y: 0, w: W, h: H, r: 56, fill: bg });
      const th = 22;
      const arm = 190;
      const x0 = 22;
      const y0 = 22;
      const x1 = W - 22;
      const y1 = W - 22;
      const bracket =
        roundedRect(x0, y0, arm, th, [th / 2, th / 2, th / 2, 0]) +
        roundedRect(x0, y0, th, arm, [0, 0, th / 2, th / 2]) +
        roundedRect(x1 - arm, y0, arm, th, [th / 2, th / 2, 0, th / 2]) +
        roundedRect(x1 - th, y0, th, arm, [0, 0, th / 2, th / 2]) +
        roundedRect(x0, y1 - th, arm, th, [0, th / 2, th / 2, th / 2]) +
        roundedRect(x0, y1 - arm, th, arm, [th / 2, th / 2, 0, 0]) +
        roundedRect(x1 - arm, y1 - th, arm, th, [th / 2, 0, th / 2, th / 2]) +
        roundedRect(x1 - th, y1 - arm, th, arm, [th / 2, th / 2, 0, 0]);
      before.push({ t: "path", d: bracket, fill: fc });
      const after: SceneNode[] = text
        ? [textNode(text, W / 2, W + L / 2 - 30, fitText(text, W - 200, L * 0.44), fc)]
        : [];
      return { width: W, height: H, qx: p, qy: p, before, after, qrBg: null, qrBgRadius: 0 };
    }
  }
}

// ---------------------------------------------------------------------------
// Paint
// ---------------------------------------------------------------------------

function paintToFill(paint: Paint, n: number, gradients: SceneGradient[], id: string): SceneFill {
  if (paint.kind === "solid") return safeColor(paint.color, "#000000");
  const from = safeColor(paint.from, "#000000");
  const to = safeColor(paint.to, "#000000");
  if (paint.kind === "linear") {
    const a = (paint.angle * Math.PI) / 180;
    const c = n / 2;
    const h = (n / 2) * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a)));
    gradients.push({
      id,
      kind: "linear",
      x1: c - Math.cos(a) * h,
      y1: c - Math.sin(a) * h,
      x2: c + Math.cos(a) * h,
      y2: c + Math.sin(a) * h,
      from,
      to,
    });
  } else {
    gradients.push({ id, kind: "radial", cx: n / 2, cy: n / 2, r: n * 0.72, from, to });
  }
  return { gradient: id };
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export function buildScene(matrix: QrMatrix, design: QrDesign): Scene {
  const n = matrix.size;
  const margin = clamp(Math.round(design.margin), 0, 10);
  const mod = Q / (n + margin * 2);
  const layout = layoutFrame(design);
  const nodes: SceneNode[] = [...layout.before];
  const gradients: SceneGradient[] = [];

  if (layout.qrBg) {
    nodes.push({ t: "rect", x: layout.qx, y: layout.qy, w: Q, h: Q, r: layout.qrBgRadius, fill: layout.qrBg });
  }

  const tf: Transform = { tx: layout.qx + margin * mod, ty: layout.qy + margin * mod, s: mod };
  const fgFill = paintToFill(design.fg, n, gradients, "fg");

  const logo = design.logo && LOGO_SRC.test(design.logo.src) ? design.logo : null;
  const logoBox = logo ? computeLogoBox(n, logo) : null;
  const mask = logo && logoBox && logo.excavate ? excavationMask(n, logoBox, logo.plate) : null;

  // Alignment patterns are drawn as solid rings regardless of the module
  // style. Scanners use them to correct perspective, and dotted or striped
  // versions are easy to mistake for ordinary data modules.
  const alignMask = new Uint8Array(n * n);
  let alignD = "";
  const roundAlign = !["square", "soft", "pixel", "classy"].includes(design.dots);
  for (const a of alignmentCenters(matrix.version)) {
    let covered = false;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const i = (a.y + dy) * n + a.x + dx;
        alignMask[i] = 1;
        if (mask && mask[i]) covered = true;
      }
    }
    if (covered) continue;
    const x = a.x - 2;
    const y = a.y - 2;
    alignD += roundAlign
      ? roundedRect(x, y, 5, 5, 1.6) + roundedRect(x + 1, y + 1, 3, 3, 0.8) + circlePath(a.x + 0.5, a.y + 0.5, 0.55)
      : roundedRect(x, y, 5, 5, 0) + roundedRect(x + 1, y + 1, 3, 3, 0) + roundedRect(a.x, a.y, 1, 1, 0);
  }

  const isDark = (x: number, y: number) =>
    matrix.data[y * n + x] === 1 &&
    !isFinderModule(n, y, x) &&
    !alignMask[y * n + x] &&
    !(mask && mask[y * n + x]);

  nodes.push({ t: "path", d: dotsPath(n, isDark, design.dots), fill: fgFill, tf });
  if (alignD) nodes.push({ t: "path", d: alignD, fill: fgFill, rule: "evenodd", tf });

  const eyes = finderOrigins(n);
  const frameFill = design.eyeFrameColor ? safeColor(design.eyeFrameColor, "#000000") : fgFill;
  const ballFill = design.eyeBallColor ? safeColor(design.eyeBallColor, "#000000") : fgFill;
  nodes.push({
    t: "path",
    d: eyes.map((e) => eyeFramePath(e.x, e.y, e.corner, design.eyeFrame)).join(""),
    fill: frameFill,
    rule: "evenodd",
    tf,
  });
  nodes.push({
    t: "path",
    d: eyes.map((e) => eyeBallPath(e.x, e.y, e.corner, design.eyeBall)).join(""),
    fill: ballFill,
    tf,
  });

  if (logo && logoBox) {
    const toScene = (v: number) => v * mod;
    const px = tf.tx + toScene(logoBox.x);
    const py = tf.ty + toScene(logoBox.y);
    const ps = toScene(logoBox.size);
    const plateColor = safeColor(logo.plateColor, layout.qrBg ?? design.bg ?? "#ffffff");
    if (logo.plate === "circle") {
      nodes.push({ t: "circle", cx: px + ps / 2, cy: py + ps / 2, r: ps / 2, fill: plateColor });
    } else if (logo.plate !== "none") {
      nodes.push({
        t: "rect",
        x: px,
        y: py,
        w: ps,
        h: ps,
        r: logo.plate === "rounded" ? ps * 0.22 : 0,
        fill: plateColor,
      });
    }
    nodes.push({
      t: "image",
      href: logo.src,
      x: tf.tx + toScene(logoBox.ix),
      y: tf.ty + toScene(logoBox.iy),
      w: toScene(logoBox.isize),
      h: toScene(logoBox.isize),
    });
  }

  nodes.push(...layout.after);

  return {
    width: layout.width,
    height: layout.height,
    gradients,
    nodes,
    moduleSize: mod,
    qrBox: { x: layout.qx, y: layout.qy, size: Q },
    matrix: { size: n, version: matrix.version, ec: matrix.ec },
  };
}
