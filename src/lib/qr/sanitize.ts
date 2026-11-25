import {
  DEFAULT_DESIGN,
  DOT_STYLES,
  EYE_BALL_STYLES,
  EYE_FRAME_STYLES,
  FRAME_STYLES,
  RELIABLE_EYE_BALLS,
  type EcLevel,
  type EyeBallStyle,
  type EyeFrameStyle,
  type FrameStyle,
  type LogoPlate,
  type Paint,
  type QrDesign,
} from "./types";

const HEX = /^#[0-9a-f]{6}$/i;
const LOGO_SRC = /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i;

const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;

const color = (value: unknown, fallback: string) =>
  typeof value === "string" && HEX.test(value) ? value : fallback;

const clamp = (value: unknown, lo: number, hi: number, fallback: number) => {
  const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(hi, Math.max(lo, n));
};

function paint(value: unknown): Paint {
  if (!value || typeof value !== "object") return DEFAULT_DESIGN.fg;
  const p = value as Record<string, unknown>;
  if (p.kind === "linear") {
    return {
      kind: "linear",
      from: color(p.from, "#0d0d0e"),
      to: color(p.to, "#1d4ed8"),
      angle: clamp(p.angle, 0, 360, 45),
    };
  }
  if (p.kind === "radial") {
    return { kind: "radial", from: color(p.from, "#0d0d0e"), to: color(p.to, "#1d4ed8") };
  }
  return { kind: "solid", color: color(p.color, "#0d0d0e") };
}

/** Validates a design loaded from storage or an imported backup. */
export function sanitizeDesign(input: unknown): QrDesign {
  if (!input || typeof input !== "object") return { ...DEFAULT_DESIGN };
  const d = input as Record<string, unknown>;
  const eyeFrame = oneOf<EyeFrameStyle>(d.eyeFrame, EYE_FRAME_STYLES, "square");
  const ball = oneOf<EyeBallStyle>(d.eyeBall, EYE_BALL_STYLES, "square");
  const eyeBall = RELIABLE_EYE_BALLS[eyeFrame].includes(ball) ? ball : RELIABLE_EYE_BALLS[eyeFrame][0];

  let logo: QrDesign["logo"] = null;
  if (d.logo && typeof d.logo === "object") {
    const l = d.logo as Record<string, unknown>;
    if (typeof l.src === "string" && LOGO_SRC.test(l.src)) {
      logo = {
        src: l.src,
        size: clamp(l.size, 0.1, 0.34, 0.24),
        plate: oneOf<LogoPlate>(l.plate, ["none", "square", "rounded", "circle"], "none"),
        plateColor: typeof l.plateColor === "string" && HEX.test(l.plateColor) ? l.plateColor : null,
        excavate: l.excavate !== false,
      };
    }
  }

  const frame = (d.frame && typeof d.frame === "object" ? d.frame : {}) as Record<string, unknown>;
  const ec = oneOf<EcLevel | "auto">(d.ec, ["L", "M", "Q", "H", "auto"], "auto");

  return {
    dots: oneOf(d.dots, DOT_STYLES, "square"),
    eyeFrame,
    eyeBall,
    fg: paint(d.fg),
    bg: d.bg === null ? null : color(d.bg, "#ffffff"),
    eyeFrameColor: typeof d.eyeFrameColor === "string" && HEX.test(d.eyeFrameColor) ? d.eyeFrameColor : null,
    eyeBallColor: typeof d.eyeBallColor === "string" && HEX.test(d.eyeBallColor) ? d.eyeBallColor : null,
    logo,
    frame: {
      style: oneOf<FrameStyle>(frame.style, FRAME_STYLES, "none"),
      text: typeof frame.text === "string" ? frame.text.slice(0, 40) : "SCAN ME",
      color: color(frame.color, "#0d0d0e"),
      textColor: color(frame.textColor, "#ffffff"),
    },
    ec,
    margin: Math.round(clamp(d.margin, 0, 10, 4)),
  };
}
