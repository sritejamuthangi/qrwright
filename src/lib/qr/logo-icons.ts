import iconData from "./logo-icons.json";

type Node = [string, Record<string, string | number>];

const ICONS = iconData as unknown as Record<string, Node[]>;

export const LOGO_ICONS = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "phone", label: "Phone" },
  { key: "mail", label: "Email" },
  { key: "globe", label: "Website" },
  { key: "map-pin", label: "Location" },
  { key: "shopping-cart", label: "Shop" },
  { key: "coffee", label: "Café" },
  { key: "utensils-crossed", label: "Food" },
  { key: "heart", label: "Heart" },
  { key: "star", label: "Star" },
  { key: "camera", label: "Camera" },
  { key: "calendar-days", label: "Event" },
  { key: "message-circle", label: "Chat" },
  { key: "link", label: "Link" },
  { key: "download", label: "Download" },
  { key: "contact", label: "Contact" },
  { key: "store", label: "Store" },
] as const;

export type LogoIconKey = (typeof LOGO_ICONS)[number]["key"];

function trace(ctx: CanvasRenderingContext2D, nodes: Node[]) {
  const num = (attrs: Record<string, string | number>, k: string) => Number(attrs[k] ?? 0);
  for (const [tag, attrs] of nodes) {
    ctx.beginPath();
    switch (tag) {
      case "path":
        ctx.stroke(new Path2D(String(attrs.d ?? "")));
        break;
      case "circle":
        ctx.arc(num(attrs, "cx"), num(attrs, "cy"), num(attrs, "r"), 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "line":
        ctx.moveTo(num(attrs, "x1"), num(attrs, "y1"));
        ctx.lineTo(num(attrs, "x2"), num(attrs, "y2"));
        ctx.stroke();
        break;
      case "rect": {
        const x = num(attrs, "x");
        const y = num(attrs, "y");
        const w = num(attrs, "width");
        const h = num(attrs, "height");
        const r = num(attrs, "rx");
        if (r) ctx.roundRect(x, y, w, h, r);
        else ctx.rect(x, y, w, h);
        ctx.stroke();
        break;
      }
      case "polyline":
      case "polygon": {
        const points = String(attrs.points ?? "")
          .trim()
          .split(/\s+/)
          .map((p) => p.split(",").map(Number));
        points.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        if (tag === "polygon") ctx.closePath();
        ctx.stroke();
        break;
      }
      default:
        break;
    }
  }
}

/** Rasterises a built-in icon to a square PNG data URL (browser only). */
export function iconPng(key: string, color = "#ffffff", size = 256): string {
  const nodes = ICONS[key];
  if (!nodes) return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  // Lucide icons are drawn in a 24x24 box; leave a little breathing room.
  const scale = (size / 24) * 0.78;
  const offset = (size - 24 * scale) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.translate(offset, offset);
  ctx.scale(scale, scale);
  trace(ctx, nodes);
  return canvas.toDataURL("image/png");
}

/** Reads an uploaded image file and returns a square PNG data URL (browser only). */
export function fileToPngDataUrl(file: File, size = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) {
      reject(new Error("Use a PNG, JPG, WebP or SVG file."));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error("That image is over 4 MB. Use a smaller file."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas is not supported in this browser."));
        return;
      }
      // Cover-fit the image into the square.
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}
