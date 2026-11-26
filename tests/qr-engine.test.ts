import { describe, expect, it } from "vitest";
import { alignmentCenters, createMatrix } from "@/lib/qr/matrix";
import { traceContours } from "@/lib/qr/paths";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import {
  DEFAULT_DESIGN,
  DOT_STYLES,
  EYE_FRAME_STYLES,
  FRAME_STYLES,
  RELIABLE_EYE_BALLS,
  type QrDesign,
} from "@/lib/qr/types";
import { decodeSvg, svgToPngDataUrl } from "./helpers/decode";

const URL_SAMPLE = "https://qrwright.sritejam.com/qr-code-generator?utm=test";
const WIDTHS = [300, 560, 860];

const design = (patch: Partial<QrDesign>): QrDesign => ({ ...DEFAULT_DESIGN, ...patch });

/** Decodes a design at several sizes; returns the widths that failed. */
function failures(text: string, d: QrDesign, widths = WIDTHS): number[] {
  const { scene } = renderQr(text, d);
  const svg = sceneToSvg(scene);
  return widths.filter((w) => decodeSvg(svg, w, scene.moduleSize) !== text);
}

const LOGO = svgToPngDataUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#e11d48"/><path d="M7 12l3 3 7-7" stroke="#fff" stroke-width="3" fill="none"/></svg>`,
);

describe("matrix", () => {
  it("places alignment patterns per ISO/IEC 18004", () => {
    expect(alignmentCenters(1)).toEqual([]);
    expect(alignmentCenters(2)).toEqual([{ x: 18, y: 18 }]);
    // Version 7 has a 3x3 grid minus the three finder corners.
    expect(alignmentCenters(7)).toHaveLength(6);
    expect(alignmentCenters(40)).toHaveLength(46);
  });

  it("reports versions that grow with content", () => {
    expect(createMatrix("hi", "M").version).toBe(1);
    expect(createMatrix("x".repeat(300), "M").version).toBeGreaterThan(9);
  });
});

describe("contour tracing", () => {
  it("keeps diagonal neighbours as separate shapes", () => {
    const cells = new Set(["0,0", "1,1"]);
    const loops = traceContours(2, (x, y) => cells.has(`${x},${y}`));
    expect(loops).toHaveLength(2);
    for (const loop of loops) expect(loop).toHaveLength(4);
  });

  it("produces a hole for a ring of modules", () => {
    const loops = traceContours(3, (x, y) => !(x === 1 && y === 1));
    expect(loops).toHaveLength(2);
    const convexCounts = loops.map((l) => l.filter((c) => c.convex).length).sort();
    expect(convexCounts).toEqual([0, 4]);
  });
});

describe("rendered QR codes decode", () => {
  it.each(DOT_STYLES)("module style %s", (dots) => {
    expect(failures(URL_SAMPLE, design({ dots }))).toEqual([]);
  });

  // Every eye pairing we label reliable must decode with the hardest module styles.
  const pairs = EYE_FRAME_STYLES.flatMap((frame) =>
    RELIABLE_EYE_BALLS[frame].flatMap((ball) =>
      (["square", "dots", "diamond", "vertical"] as const).map((dots) => [frame, ball, dots] as const),
    ),
  );
  it.each(pairs)("eye frame %s + ball %s with %s modules", (eyeFrame, eyeBall, dots) => {
    expect(failures(URL_SAMPLE, design({ eyeFrame, eyeBall, dots }))).toEqual([]);
  });

  it.each(FRAME_STYLES)("frame %s", (style) => {
    const d = design({ frame: { style, text: "SCAN ME", color: "#1e3a8a", textColor: "#ffffff" } });
    expect(failures(URL_SAMPLE, d)).toEqual([]);
  });

  it("linear and radial gradients", () => {
    const linear = design({ fg: { kind: "linear", from: "#1e3a8a", to: "#0ea5e9", angle: 45 } });
    const radial = design({ fg: { kind: "radial", from: "#4c1d95", to: "#db2777" } });
    expect(failures(URL_SAMPLE, linear)).toEqual([]);
    expect(failures(URL_SAMPLE, radial)).toEqual([]);
  });

  it.each(["none", "square", "rounded", "circle"] as const)("logo with %s plate", (plate) => {
    const d = design({
      dots: "rounded",
      eyeFrame: "rounded",
      eyeBall: "rounded",
      logo: { src: LOGO, size: 0.26, plate, plateColor: null, excavate: true },
    });
    expect(failures(URL_SAMPLE, d)).toEqual([]);
  });

  it("transparent background", () => {
    expect(failures(URL_SAMPLE, design({ bg: null }))).toEqual([]);
  });

  it("long payloads (high versions)", () => {
    const long = "WIFI:T:WPA;S:Cafe;P:" + "x".repeat(600) + ";;";
    expect(failures(long, design({ dots: "dots", eyeFrame: "circle", eyeBall: "circle" }), [1400])).toEqual([]);
  });

  it("unicode text", () => {
    expect(failures("Hello, café ☕ — नमस्ते 👋", design({}))).toEqual([]);
  });
});
