import { describe, expect, it } from "vitest";
import { contrastReport } from "@/lib/qr/color";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import { TEMPLATES } from "@/lib/qr/templates";
import { decodeSvg } from "./helpers/decode";

const SAMPLES = [
  "https://qrwright.sritejam.com/r/GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBV",
  "WIFI:T:WPA;S:Corner Cafe;P:latte-art-2026;;",
  "https://example.com/menu",
];
const WIDTHS = [300, 520, 800];

describe("templates", () => {
  it("has 36 unique templates", () => {
    expect(TEMPLATES).toHaveLength(36);
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(36);
  });

  it.each(TEMPLATES.map((t) => [t.id, t] as const))("%s decodes at every size", (_id, tpl) => {
    for (const text of SAMPLES) {
      const { scene } = renderQr(text, tpl.design);
      const svg = sceneToSvg(scene);
      for (const w of WIDTHS) {
        expect(decodeSvg(svg, w, scene.moduleSize), `${tpl.id} @ ${w}px: ${text}`).toBe(text);
      }
    }
  });

  it.each(TEMPLATES.map((t) => [t.id, t] as const))("%s has enough contrast", (_id, tpl) => {
    expect(contrastReport(tpl.design).level).not.toBe("poor");
  });
});
