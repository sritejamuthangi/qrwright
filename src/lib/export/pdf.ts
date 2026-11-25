import { sceneBackground } from "./download";
import { sceneToCanvas } from "@/lib/qr/canvas";
import type { Scene } from "@/lib/qr/scene";

const MM = 72 / 25.4;

export interface PdfOptions {
  /** Printed width of the code in millimetres. */
  widthMm?: number;
  /** Margin around the code in millimetres. */
  marginMm?: number;
}

/** A single-code PDF at print resolution, sized to the requested width. */
export async function sceneToPdfBlob(scene: Scene, opts: PdfOptions = {}): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const widthMm = opts.widthMm ?? 60;
  const margin = opts.marginMm ?? 8;
  const pxWidth = Math.min(4096, Math.max(600, Math.round((widthMm / 25.4) * 300)));
  const canvas = await sceneToCanvas(scene, pxWidth, { flatten: sceneBackground(scene) });
  const png = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not render the PDF."))), "image/png"),
  );

  const doc = await PDFDocument.create();
  doc.setProducer("QRWright");
  doc.setCreator("QRWright — https://qrcode.sritejam.com");
  const pageW = (widthMm + margin * 2) * MM;
  const pageH = ((widthMm * scene.height) / scene.width + margin * 2) * MM;
  const page = doc.addPage([pageW, pageH]);
  const image = await doc.embedPng(await png.arrayBuffer());
  page.drawImage(image, {
    x: margin * MM,
    y: pageH - margin * MM - (widthMm * scene.height) / scene.width * MM,
    width: widthMm * MM,
    height: ((widthMm * scene.height) / scene.width) * MM,
  });
  return new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
}

export interface SheetOptions {
  page: "a4" | "letter";
  /** Codes per page. */
  count: number;
  /** Caption printed under each code. */
  caption?: string;
  /** Draw dashed cut guides. */
  guides?: boolean;
}

const SHEETS = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
} as const;

/** A print sheet with several copies of one code, with cut guides. */
export async function sceneToSheetPdf(scene: Scene, opts: SheetOptions): Promise<Blob> {
  const { PDFDocument, rgb } = await import("pdf-lib");
  const size = SHEETS[opts.page];
  const margin = 10;
  const gap = 4;
  const captionH = opts.caption?.trim() ? 7 : 0;
  const perRow = opts.count <= 2 ? opts.count : opts.count <= 6 ? 2 : opts.count <= 12 ? 3 : 4;
  const rows = Math.ceil(opts.count / perRow);
  const cellW = (size.w - margin * 2 - gap * (perRow - 1)) / perRow;
  const cellH = (size.h - margin * 2 - gap * (rows - 1)) / rows;
  const codeSize = Math.min(cellW, (cellH - captionH) / (scene.height / scene.width)) * 0.9;

  const pxWidth = Math.min(1600, Math.round((codeSize / 25.4) * 300));
  const canvas = await sceneToCanvas(scene, pxWidth, { flatten: sceneBackground(scene) });
  const png = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not render the sheet."))), "image/png"),
  );

  const doc = await PDFDocument.create();
  doc.setProducer("QRWright");
  const page = doc.addPage([size.w * MM, size.h * MM]);
  const image = await doc.embedPng(await png.arrayBuffer());
  // Rasterize captions with browser fonts so Unicode names do not fail the
  // standard PDF font's WinAnsi encoder. The QR itself remains 300 dpi.
  let captionImage: Awaited<ReturnType<typeof doc.embedPng>> | null = null;
  if (captionH && opts.caption) {
    const label = document.createElement("canvas");
    label.width = Math.round((cellW - 4) / 25.4 * 300);
    label.height = 72;
    const ctx = label.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported.");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, label.width, label.height);
    ctx.fillStyle = "#0d0d0e"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "600 32px system-ui, sans-serif";
    ctx.fillText(opts.caption.trim().slice(0, 60), label.width / 2, label.height / 2, label.width - 8);
    captionImage = await doc.embedPng(label.toDataURL("image/png"));
  }

  for (let i = 0; i < opts.count; i++) {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const x = margin + col * (cellW + gap);
    const yTop = margin + row * (cellH + gap);
    const codeH = (codeSize * scene.height) / scene.width;
    const cx = x + (cellW - codeSize) / 2;
    const cyTop = yTop + (cellH - captionH - codeH) / 2;
    page.drawImage(image, {
      x: cx * MM,
      y: (size.h - cyTop - codeH) * MM,
      width: codeSize * MM,
      height: codeH * MM,
    });
    if (captionImage) {
      page.drawImage(captionImage, {
        x: (x + 2) * MM,
        y: (size.h - cyTop - codeH - 6) * MM,
        width: (cellW - 4) * MM,
        height: 6 * MM,
      });
    }
    if (opts.guides) {
      page.drawRectangle({
        x: x * MM,
        y: (size.h - yTop - cellH) * MM,
        width: cellW * MM,
        height: cellH * MM,
        borderColor: rgb(0.78, 0.76, 0.71),
        borderWidth: 0.4,
        borderDashArray: [3, 3],
      });
    }
  }
  return new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
}
