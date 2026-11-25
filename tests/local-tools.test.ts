import { describe, expect, it } from "vitest";
import { parseBulkCsv } from "@/lib/bulk";
import { validateSavedCode } from "@/lib/library";
import { DEFAULT_DESIGN } from "@/lib/qr/types";
describe("bulk CSV", () => {
  it("handles quoted commas and multiline cells", () => {
    const rows = parseBulkCsv('filename,text\n"greeting,one","Hello, world\nSecond line"', "text");
    expect(rows[0].payload).toBe("Hello, world\nSecond line"); expect(rows[0].error).toBeUndefined();
  });
  it("rejects too many rows and reports invalid content", () => {
    expect(() => parseBulkCsv(`url\n${Array(501).fill("https://example.com").join("\n")}`, "url")).toThrow("500");
    expect(parseBulkCsv("url\njavascript:alert(1)", "url")[0].error).toBeTruthy();
    expect(parseBulkCsv("ssid,security\nGuest,INVALID", "wifi")[0].error).toContain("Invalid");
  });
});
describe("backup validation", () => {
  const code = { id: "test", kind: "qr", typeId: "url", title: "Example", payload: "https://example.com", design: DEFAULT_DESIGN, createdAt: 1, updatedAt: 1 };
  it("restores valid designs while stripping active or remote logo content", () => {
    expect(validateSavedCode(code)).toEqual(code);
    const validated = validateSavedCode({ ...code, design: { ...DEFAULT_DESIGN, logo: { src: "https://tracker.example/pixel" }, fg: { kind: "solid", color: '" onload="alert(1)' } } });
    expect(validated?.kind === "qr" && validated.design.logo).toBeNull();
    expect(validated?.kind === "qr" && validated.design.fg).toEqual(DEFAULT_DESIGN.fg);
  });
  it("rejects malformed records and spoofed tracking IDs", () => {
    expect(validateSavedCode({ ...code, title: {} })).toBeNull();
    expect(validateSavedCode({ ...code, typeId: "missing" })).toBeNull();
    expect(validateSavedCode({ ...code, tracked: { url: "javascript:alert(1)", countId: "AAAAAAAAAA" } })).toBeNull();
  });
});
