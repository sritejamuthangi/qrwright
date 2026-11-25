import { svgToCanvas, withSvgSize } from "@/lib/barcode/render";

const MM = 72 / 25.4;

export async function svgToPngBlob(svg: string, width = 2400): Promise<Blob> {
  const canvas = await svgToCanvas(svg, Math.min(4096, Math.max(200, width)));
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not export the image."))), "image/png"),
  );
}

export async function svgToWebpBlob(svg: string, width = 2400): Promise<Blob> {
  const canvas = await svgToCanvas(svg, Math.min(4096, Math.max(200, width)));
  return new Promise((resolve, reject) => canvas.toBlob((blob) => {
    if (!blob || blob.type !== "image/webp") reject(new Error("This browser cannot export WebP. Choose PNG instead."));
    else resolve(blob);
  }, "image/webp", 0.94));
}

export async function svgToJpegBlob(svg: string, width = 2400, background = "#ffffff"): Promise<Blob> {
  const sized = withSvgSize(svg, Math.min(4096, Math.max(200, width)));
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not export the image."));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.max(1, Math.round((width * img.height) / img.width));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not export the image."))), "image/jpeg", 0.94),
  );
}

/** Places a barcode SVG on a PDF page at the requested width. */
export async function svgToPdfBlob(svg: string, widthMm = 70, marginMm = 8): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const png = await svgToPngBlob(svg, Math.round((widthMm / 25.4) * 300));
  const bytes = await png.arrayBuffer();
  const doc = await PDFDocument.create();
  doc.setProducer("QRWright");
  const probe = await doc.embedPng(bytes);
  const w = widthMm * MM;
  const h = (w * probe.height) / probe.width;
  const page = doc.addPage([w + marginMm * 2 * MM, h + marginMm * 2 * MM]);
  page.drawImage(probe, { x: marginMm * MM, y: marginMm * MM, width: w, height: h });
  return new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
}
