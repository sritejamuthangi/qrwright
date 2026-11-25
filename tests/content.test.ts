import { describe, expect, it } from "vitest";
import { QR_PAGES, BARCODE_PAGES, GUIDES } from "@/content";
import { QR_TYPES } from "@/lib/payload/qr-types";
import { BARCODE_FORMATS } from "@/lib/barcode/formats";
import sitemap from "@/app/sitemap";
describe("published content coverage", () => {
  it("has one page per supported format and no duplicate slugs", () => {
    expect(QR_PAGES.map((p) => p.slug).sort()).toEqual(QR_TYPES.map((t) => t.slug).sort());
    expect(BARCODE_PAGES.map((p) => p.slug).sort()).toEqual(BARCODE_FORMATS.map((t) => t.id).sort());
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(12);
  });
  it("resolves every editorial internal link and excludes private routes from the sitemap", () => {
    const paths = sitemap().map((p) => new URL(p.url).pathname);
    const valid = new Set([...paths, "/my-codes"]);
    for (const data of [...QR_PAGES, ...BARCODE_PAGES, ...GUIDES]) {
      for (const match of JSON.stringify(data).matchAll(/\]\((\/[^)]+)\)/g)) expect(valid.has(match[1].split("#")[0]), `${data.slug}: ${match[1]}`).toBe(true);
    }
    expect(paths).toHaveLength(61);
    expect(paths.some((p) => p.startsWith("/api/") || p.startsWith("/r/") || p === "/p" || p === "/my-codes")).toBe(false);
  });
});
