import type { BarcodePage, ToolPage } from "./types";
import { qrPagesA } from "./qr-pages-a";
import { qrPagesB } from "./qr-pages-b";
import { barcodePages } from "./barcode-pages";
import { GUIDES } from "./guides";

/**
 * Content registry. Every QR type and barcode format that the generators
 * support has exactly one page here; tests/content.test.ts checks coverage.
 */

export const QR_PAGES: ToolPage[] = [...qrPagesA, ...qrPagesB];
export const BARCODE_PAGES: BarcodePage[] = barcodePages;

const qrMap = new Map(QR_PAGES.map((p) => [p.slug, p]));
const barcodeMap = new Map(BARCODE_PAGES.map((p) => [p.slug, p]));
const guideMap = new Map(GUIDES.map((g) => [g.slug, g]));

export function getQrPage(slug: string): ToolPage | undefined {
  return qrMap.get(slug);
}

export function getBarcodePage(slug: string): BarcodePage | undefined {
  return barcodeMap.get(slug);
}

export function getGuidePage(slug: string) {
  return guideMap.get(slug);
}

export { GUIDES };
