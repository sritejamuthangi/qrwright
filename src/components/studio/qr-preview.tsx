"use client";

import { useId, useMemo } from "react";
import { QrCapacityError } from "@/lib/qr/matrix";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import type { QrDesign } from "@/lib/qr/types";
import { cn } from "@/lib/cn";

export function QrPreview({
  payload,
  design,
  className,
  idPrefix = "preview",
  title = "QR code preview",
  placeholder = "Your QR code appears here as you type.",
}: {
  payload: string;
  design: QrDesign;
  className?: string;
  idPrefix?: string;
  title?: string;
  placeholder?: string;
}) {
  const instance = useId();
  const result = useMemo(() => {
    if (!payload) return null;
    try {
      const { scene } = renderQr(payload, design);
      return { svg: sceneToSvg(scene, { idPrefix: `${idPrefix}-${instance}`, title }) };
    } catch (err) {
      return { error: err instanceof QrCapacityError ? err.message : "Could not render this QR code." };
    }
  }, [payload, design, idPrefix, title, instance]);

  if (!result) {
    return (
      <div
        className={cn(
          "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-card-2/50 p-6 text-center",
          className,
        )}
      >
        <div className="grid grid-cols-4 gap-1 opacity-25">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={cn("size-3 rounded-[2px] bg-ink", [0, 1, 2, 4, 8, 12].includes(i) ? "opacity-100" : "opacity-40")}
            />
          ))}
        </div>
        <p className="max-w-[220px] text-sm text-muted">{placeholder}</p>
      </div>
    );
  }

  if ("error" in result) {
    return (
      <div className={cn("flex aspect-square w-full items-center justify-center rounded-xl border border-danger/30 bg-danger-soft p-6 text-center", className)}>
        <p className="max-w-[260px] text-sm font-medium text-danger">{result.error}</p>
      </div>
    );
  }

  return (
    <div
      className={cn("qr-preview w-full [&>svg]:h-auto [&>svg]:w-full", className)}
      dangerouslySetInnerHTML={{ __html: result.svg }}
    />
  );
}
