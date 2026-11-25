/**
 * Geometry helpers that turn QR modules into SVG path data.
 *
 * Connected styles (square, rounded, liquid, classy) are drawn by tracing the
 * outline of each dark region and rounding its corners. This produces one
 * seamless path per region, so there are no hairline gaps between adjacent
 * modules at any zoom level or export size.
 */

// Directions, clockwise in screen space (y points down): East, South, West, North.
const DX = [1, 0, -1, 0] as const;
const DY = [0, 1, 0, -1] as const;

export interface Corner {
  x: number;
  y: number;
  inDir: number;
  outDir: number;
  /** Convex corner of the dark region (a right turn when dark is on the right). */
  convex: boolean;
}

/** Formats a number compactly for path data. */
export function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(3);
  return s.replace(/\.?0+$/, "");
}

/**
 * Traces the boundary of every dark region in an n x n grid.
 * Each loop keeps the dark region on its right-hand side, so outer boundaries
 * run clockwise and holes run counter-clockwise (correct for nonzero fill).
 * Cells that only touch diagonally are kept as separate shapes.
 */
export function traceContours(
  n: number,
  isDark: (x: number, y: number) => boolean,
): Corner[][] {
  const W = n + 1;
  const ex: number[] = [];
  const ey: number[] = [];
  const ed: number[] = [];
  const out = new Int32Array(W * W * 2).fill(-1);

  const add = (x: number, y: number, d: number) => {
    const id = ex.length;
    ex.push(x);
    ey.push(y);
    ed.push(d);
    const v = (y * W + x) * 2;
    if (out[v] === -1) out[v] = id;
    else out[v + 1] = id;
  };

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!isDark(x, y)) continue;
      if (y === 0 || !isDark(x, y - 1)) add(x, y, 0);
      if (x === n - 1 || !isDark(x + 1, y)) add(x + 1, y, 1);
      if (y === n - 1 || !isDark(x, y + 1)) add(x + 1, y + 1, 2);
      if (x === 0 || !isDark(x - 1, y)) add(x, y + 1, 3);
    }
  }

  const used = new Uint8Array(ex.length);
  const loops: Corner[][] = [];

  for (let e0 = 0; e0 < ex.length; e0++) {
    if (used[e0]) continue;
    const corners: Corner[] = [];
    let e = e0;
    // Every boundary is closed, so this always terminates.
    for (;;) {
      used[e] = 1;
      const d = ed[e];
      const vx = ex[e] + DX[d];
      const vy = ey[e] + DY[d];
      const v = (vy * W + vx) * 2;
      let next = out[v];
      const alt = out[v + 1];
      if (alt !== -1 && ed[next] !== ((d + 1) & 3)) next = alt; // saddle: turn right
      const nd = ed[next];
      if (nd !== d) {
        corners.push({ x: vx, y: vy, inDir: d, outDir: nd, convex: ((nd - d + 4) & 3) === 1 });
      }
      if (next === e0) break;
      e = next;
    }
    if (corners.length) loops.push(corners);
  }
  return loops;
}

/** Orientation of a convex corner: 0 = top-left, 1 = top-right, 2 = bottom-right, 3 = bottom-left. */
export function convexCornerOrientation(c: Corner): number {
  return c.outDir; // out East => TL, South => TR, West => BR, North => BL
}

/** Builds path data for traced loops, rounding each corner by `radius(corner)` (max 0.5). */
export function contourPath(loops: Corner[][], radius: (c: Corner) => number): string {
  let d = "";
  for (const loop of loops) {
    const k = loop.length;
    const c0 = loop[0];
    const r0 = radius(c0);
    d += `M${fmt(c0.x + DX[c0.outDir] * r0)} ${fmt(c0.y + DY[c0.outDir] * r0)}`;
    for (let i = 1; i <= k; i++) {
      const c = loop[i % k];
      const r = radius(c);
      const ax = c.x - DX[c.inDir] * r;
      const ay = c.y - DY[c.inDir] * r;
      d += c.inDir === 0 || c.inDir === 2 ? `H${fmt(ax)}` : `V${fmt(ay)}`;
      if (r > 0) {
        const bx = c.x + DX[c.outDir] * r;
        const by = c.y + DY[c.outDir] * r;
        d += `A${fmt(r)} ${fmt(r)} 0 0 ${c.convex ? 1 : 0} ${fmt(bx)} ${fmt(by)}`;
      }
    }
    d += "Z";
  }
  return d;
}

/** Rounded rectangle with independent corner radii [tl, tr, br, bl]. */
export function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  radii: number | [number, number, number, number],
): string {
  const [tl, tr, br, bl] = typeof radii === "number" ? [radii, radii, radii, radii] : radii;
  const arc = (r: number, toX: number, toY: number) =>
    r > 0 ? `A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(toX)} ${fmt(toY)}` : "";
  return (
    `M${fmt(x + tl)} ${fmt(y)}` +
    `H${fmt(x + w - tr)}` +
    arc(tr, x + w, y + tr) +
    `V${fmt(y + h - br)}` +
    arc(br, x + w - br, y + h) +
    `H${fmt(x + bl)}` +
    arc(bl, x, y + h - bl) +
    `V${fmt(y + tl)}` +
    arc(tl, x + tl, y) +
    "Z"
  );
}

export function circlePath(cx: number, cy: number, r: number): string {
  return (
    `M${fmt(cx - r)} ${fmt(cy)}` +
    `a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(r * 2)} 0` +
    `a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-r * 2)} 0Z`
  );
}

export function diamondPath(cx: number, cy: number, h: number): string {
  return `M${fmt(cx)} ${fmt(cy - h)}L${fmt(cx + h)} ${fmt(cy)}L${fmt(cx)} ${fmt(cy + h)}L${fmt(cx - h)} ${fmt(cy)}Z`;
}
