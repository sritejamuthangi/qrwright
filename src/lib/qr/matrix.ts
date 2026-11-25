import QRCode from "qrcode";
import type { EcLevel } from "./types";

export interface QrMatrix {
  /** Modules per side. */
  size: number;
  /** QR version (1-40). */
  version: number;
  ec: EcLevel;
  /** Row-major module data, 1 = dark. */
  data: Uint8Array;
}

export class QrCapacityError extends Error {
  constructor() {
    super(
      "This content is too long for a QR code. Shorten it, or lower the error correction level.",
    );
    this.name = "QrCapacityError";
  }
}

/**
 * Encodes text into a QR module matrix. Uses the `qrcode` package for the
 * ISO/IEC 18004 encoding (segment optimisation, error correction, masking);
 * all rendering is done by our own engine.
 */
export function createMatrix(text: string, ec: EcLevel): QrMatrix {
  if (!text) throw new Error("Nothing to encode.");
  let qr: ReturnType<typeof QRCode.create>;
  try {
    qr = QRCode.create(text, { errorCorrectionLevel: ec });
  } catch (err) {
    if (err instanceof Error && /too big|amount of data/i.test(err.message)) {
      throw new QrCapacityError();
    }
    throw err;
  }
  const size = qr.modules.size;
  const src = qr.modules.data;
  const data = new Uint8Array(size * size);
  for (let i = 0; i < data.length; i++) data[i] = src[i] ? 1 : 0;
  return { size, version: qr.version, ec, data };
}

/** True if (row, col) is inside one of the three 7x7 finder patterns. */
export function isFinderModule(size: number, row: number, col: number): boolean {
  const top = row < 7;
  const left = col < 7;
  const right = col >= size - 7;
  const bottom = row >= size - 7;
  return (top && left) || (top && right) || (bottom && left);
}

/**
 * Centre coordinates (row/col indices) of the alignment patterns for a
 * version, per ISO/IEC 18004 Annex E (computed form, as in Nayuki's encoder).
 */
export function alignmentPositions(version: number): number[] {
  if (version === 1) return [];
  const size = version * 4 + 17;
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
}

/** Centres of every alignment pattern that does not collide with a finder pattern. */
export function alignmentCenters(version: number): { x: number; y: number }[] {
  const pos = alignmentPositions(version);
  const last = pos.length - 1;
  const out: { x: number; y: number }[] = [];
  pos.forEach((y, i) =>
    pos.forEach((x, j) => {
      const collides = (i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0);
      if (!collides) out.push({ x, y });
    }),
  );
  return out;
}

/** Top-left corners (in modules) of the three finder patterns. */
export function finderOrigins(size: number) {
  return [
    { x: 0, y: 0, corner: "tl" as const },
    { x: size - 7, y: 0, corner: "tr" as const },
    { x: 0, y: size - 7, corner: "bl" as const },
  ];
}

/**
 * Rough minimum printed width (in mm) for reliable phone scanning at arm's
 * length. Based on ~0.4 mm per module plus the quiet zone.
 */
export function minPrintWidthMm(size: number, margin: number) {
  return Math.ceil((size + margin * 2) * 0.4);
}
