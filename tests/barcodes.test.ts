import { describe, expect, it } from "vitest";
import { BARCODE_FORMATS, getBarcodeFormat, isbn10To13 } from "@/lib/barcode/formats";
import { barcodeSvg, DEFAULT_BARCODE_OPTIONS } from "@/lib/barcode/render";
describe("barcode validation and rendering", () => {
  it.each(BARCODE_FORMATS)("$id renders its validated example", async (f) => {
    const result = f.validate(f.placeholder);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const svg = await barcodeSvg(result.text, f, DEFAULT_BARCODE_OPTIONS);
    expect(svg).toContain("<svg"); expect(svg).toContain("<path");
  });
  it.each([["ean-13", "590123412345", "5901234123457"], ["ean-8", "9638507", "96385074"], ["upc-a", "03600029145", "036000291452"], ["itf-14", "1001234500001", "10012345000017"]])("calculates and verifies %s check digits", (id, core, full) => {
    const f = getBarcodeFormat(id)!;
    expect(f.validate(core)).toEqual({ ok: true, text: full });
    expect(f.validate(full)).toEqual({ ok: true, text: full });
    expect(f.validate(`${core}${(Number(full.at(-1)) + 1) % 10}`).ok).toBe(false);
  });
  it("converts ISBN-10 with its original check digit verified", () => {
    expect(isbn10To13("0-306-40615-2")).toEqual({ ok: true, text: "9780306406157" });
    expect(isbn10To13("0306406153").ok).toBe(false);
    expect(isbn10To13("5901234123457").ok).toBe(false);
  });
  it("expands UPC-E to verify its check digit", () => {
    expect(getBarcodeFormat("upc-e")!.validate("425261")).toEqual({ ok: true, text: "04252614" });
    expect(getBarcodeFormat("upc-e")!.validate("04252614")).toEqual({ ok: true, text: "04252614" });
    expect(getBarcodeFormat("upc-e")!.validate("04252615").ok).toBe(false);
  });
  it("does not paint a black background for transparent output", async () => {
    const svg = await barcodeSvg("TEST", BARCODE_FORMATS[0], { ...DEFAULT_BARCODE_OPTIONS, background: null });
    expect(svg).not.toContain("<rect");
  });
});
