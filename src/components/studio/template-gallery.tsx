"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import { TEMPLATE_CATEGORIES, TEMPLATES, type QrTemplate } from "@/lib/qr/templates";
import type { QrDesign } from "@/lib/qr/types";
import { cn } from "@/lib/cn";

const SAMPLE = "https://qrwright.sritejam.com";

function TemplateThumb({ template }: { template: QrTemplate }) {
  const svg = useMemo(() => {
    try {
      return sceneToSvg(renderQr(SAMPLE, template.design).scene, {
        idPrefix: `tpl-${template.id}`,
        title: `${template.name} QR code template`,
      });
    } catch {
      return "";
    }
  }, [template]);

  return <div className="w-full [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function TemplateGallery({
  design,
  onPick,
}: {
  design: QrDesign;
  onPick: (design: QrDesign) => void;
}) {
  const [category, setCategory] = useState<string>("all");
  const activeId = TEMPLATES.find((t) => JSON.stringify(t.design) === JSON.stringify(design))?.id;
  const shown = category === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  return (
    <div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[{ id: "all", label: "All 36" }, ...TEMPLATE_CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              category === c.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-card text-muted hover:border-ink hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
        {shown.map((t) => (
          <button
            key={t.id}
            type="button"
            title={`${t.name}: ${t.bestFor}`}
            onClick={() => {
              onPick(t.design);
            }}
            className={cn(
              "group relative rounded-lg border bg-white p-1.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
              activeId === t.id ? "border-ink ring-2 ring-signal" : "border-line",
            )}
          >
            <TemplateThumb template={t} />
            <span className="mt-1 block truncate px-0.5 text-[10px] font-medium text-[#0d0d0e]">
              {t.name}
            </span>
            {activeId === t.id && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-signal text-[#0d0d0e]">
                <Check className="size-3" />
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-subtle">
        Templates change colors, shapes and frames only. Every design is checked to decode in the built-in
        scan test. Applying a template replaces your current design; your content stays.
      </p>
    </div>
  );
}

/** Small color preview used by the style controls. */
export function DesignSwatch({ design }: { design: QrDesign }) {
  const svg = useMemo(() => {
    try {
      return sceneToSvg(renderQr(SAMPLE, design).scene, { idPrefix: "swatch" });
    } catch {
      return "";
    }
  }, [design]);
  return <div className="w-16 [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
