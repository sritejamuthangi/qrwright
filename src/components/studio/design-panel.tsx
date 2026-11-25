"use client";

import { useRef, useState } from "react";
import { ImagePlus, RotateCcw, Trash2, Upload } from "lucide-react";
import {
  DOT_STYLES,
  DOT_STYLE_LABELS,
  EYE_BALL_LABELS,
  EYE_FRAME_LABELS,
  EYE_FRAME_STYLES,
  FRAME_LABELS,
  FRAME_STYLES,
  RELIABLE_EYE_BALLS,
  isReliableEyePair,
  type EyeBallStyle,
  type EyeFrameStyle,
  type Paint,
  type QrDesign,
} from "@/lib/qr/types";
import { LOGO_ICONS, fileToPngDataUrl, iconPng } from "@/lib/qr/logo-icons";
import { Segmented, inputClass } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { toast } from "sonner";
import { TemplateGallery } from "./template-gallery";

type Tab = "templates" | "style" | "logo" | "frame" | "advanced";

const TABS: { id: Tab; label: string }[] = [
  { id: "templates", label: "Templates" },
  { id: "style", label: "Style" },
  { id: "logo", label: "Logo" },
  { id: "frame", label: "Frame" },
  { id: "advanced", label: "Advanced" },
];

const HEX = /^#[0-9a-f]{6}$/i;

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState({ source: value, text: value });
  const text = draft.source === value ? draft.text : value;
  return (
    <div className={cn("flex items-center gap-2", disabled && "pointer-events-none opacity-40")}>
      <input
        type="color"
        aria-label={`${label} color`}
        value={HEX.test(value) ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="size-9 shrink-0 rounded-lg border border-line-strong"
      />
      <div className="min-w-0 flex-1">
        <label className="mb-0.5 block text-[11px] text-muted">{label}</label>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            const v = e.target.value.trim();
            setDraft({ source: value, text: v });
            if (HEX.test(v)) onChange(v);
          }}
          onBlur={() => {
            if (!HEX.test(text)) setDraft({ source: value, text: value });
          }}
          spellCheck={false}
          className="w-full rounded-md border border-line bg-card px-2 py-1 font-mono text-[11px] uppercase"
        />
      </div>
    </div>
  );
}

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        {hint && <span className="text-[11px] text-subtle">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ChipGrid<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={cn(
            "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
            value === o
              ? "border-ink bg-ink text-paper"
              : "border-line bg-card text-muted hover:border-line-strong hover:text-ink",
          )}
        >
          {labels[o]}
        </button>
      ))}
    </div>
  );
}

const PHRASES = ["SCAN ME", "SCAN TO PAY", "SEE THE MENU", "SCAN FOR WI-FI", "FOLLOW US", "SHOP NOW", "LEAVE A REVIEW"];

export function DesignPanel({
  design,
  onChange,
}: {
  design: QrDesign;
  onChange: (design: QrDesign) => void;
}) {
  const [tab, setTab] = useState<Tab>("templates");
  const fileRef = useRef<HTMLInputElement>(null);
  const update = (patch: Partial<QrDesign>) => onChange({ ...design, ...patch });

  const fg = design.fg;
  const fgKind = fg.kind === "solid" ? "solid" : fg.kind;
  const fgFrom = fg.kind === "solid" ? fg.color : fg.from;
  const fgTo = fg.kind === "solid" ? "#1d4ed8" : fg.to;
  const fgAngle = fg.kind === "linear" ? fg.angle : 45;

  const setPaint = (kind: "solid" | "linear" | "radial") => {
    let next: Paint;
    if (kind === "solid") next = { kind: "solid", color: fgFrom };
    else if (kind === "linear") next = { kind: "linear", from: fgFrom, to: fgTo, angle: fgAngle };
    else next = { kind: "radial", from: fgFrom, to: fgTo };
    update({ fg: next });
  };

  const setEyeFrame = (frame: EyeFrameStyle) => {
    const ball = isReliableEyePair(frame, design.eyeBall)
      ? design.eyeBall
      : RELIABLE_EYE_BALLS[frame][0];
    update({ eyeFrame: frame, eyeBall: ball });
  };

  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      const src = await fileToPngDataUrl(file);
      update({
        logo: { src, size: 0.24, plate: "none", plateColor: null, excavate: true },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that image.");
    }
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-full border border-line bg-card-2 p-1 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t.id ? "bg-ink text-paper" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "templates" && (
          <TemplateGallery design={design} onPick={(d) => onChange({ ...d })} />
        )}

        {tab === "style" && (
          <div className="space-y-5">
            <Row label="Module shape">
              <ChipGrid options={DOT_STYLES} value={design.dots} onChange={(dots) => update({ dots })} labels={DOT_STYLE_LABELS} />
            </Row>

            <Row label="Eye frame">
              <ChipGrid options={EYE_FRAME_STYLES} value={design.eyeFrame} onChange={setEyeFrame} labels={EYE_FRAME_LABELS} />
            </Row>

            <Row label="Eye center" hint="Tested pairs only">
              <ChipGrid
                options={RELIABLE_EYE_BALLS[design.eyeFrame]}
                value={design.eyeBall}
                onChange={(eyeBall: EyeBallStyle) => update({ eyeBall })}
                labels={EYE_BALL_LABELS}
              />
            </Row>

            <div className="rounded-xl border border-line bg-card p-3">
              <Row label="Code color">
                <Segmented
                  ariaLabel="Color type"
                  value={fgKind}
                  onChange={(v) => setPaint(v)}
                  options={[
                    { value: "solid", label: "Solid" },
                    { value: "linear", label: "Linear" },
                    { value: "radial", label: "Radial" },
                  ]}
                />
              </Row>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ColorField
                  label={fg.kind === "solid" ? "Color" : "From"}
                  value={fgFrom}
                  onChange={(v) =>
                    update({ fg: fg.kind === "solid" ? { kind: "solid", color: v } : { ...fg, from: v } })
                  }
                />
                {fg.kind !== "solid" && (
                  <ColorField
                    label="To"
                    value={fgTo}
                    onChange={(v) => update({ fg: { ...fg, to: v } })}
                  />
                )}
              </div>
              {fg.kind === "linear" && (
                <div className="mt-3">
                  <Row label="Angle" hint={`${fg.angle}°`}>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={5}
                      value={fg.angle}
                      onChange={(e) => update({ fg: { ...fg, angle: Number(e.target.value) } })}
                      className="w-full"
                    />
                  </Row>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-line bg-card p-3">
              <Row label="Background">
                <div className="flex items-center gap-3">
                  <ColorField
                    label="Color"
                    value={design.bg ?? "#ffffff"}
                    onChange={(bg) => update({ bg })}
                    disabled={design.bg === null}
                  />
                  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={design.bg === null}
                      onChange={(e) => update({ bg: e.target.checked ? null : "#ffffff" })}
                      className="size-3.5 accent-ink"
                    />
                    Transparent
                  </label>
                </div>
              </Row>
            </div>

            <div className="rounded-xl border border-line bg-card p-3">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium">
                <input
                  type="checkbox"
                  checked={design.eyeFrameColor !== null || design.eyeBallColor !== null}
                  onChange={(e) =>
                    update({
                      eyeFrameColor: e.target.checked ? "#e11d48" : null,
                      eyeBallColor: e.target.checked ? "#e11d48" : null,
                    })
                  }
                  className="size-4 accent-ink"
                />
                Separate eye colors
              </label>
              {(design.eyeFrameColor !== null || design.eyeBallColor !== null) && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <ColorField
                    label="Eye frame"
                    value={design.eyeFrameColor ?? fgFrom}
                    onChange={(v) => update({ eyeFrameColor: v })}
                  />
                  <ColorField
                    label="Eye center"
                    value={design.eyeBallColor ?? fgFrom}
                    onChange={(v) => update({ eyeBallColor: v })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "logo" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white">
                {design.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={design.logo.src} alt="Current logo" className="size-full object-contain" />
                ) : (
                  <ImagePlus className="size-5 text-subtle" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium">Center logo</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  PNG, JPG, WebP or SVG. Keep it simple, and test before printing.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => upload(e.target.files?.[0])}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="size-3.5" /> Upload logo
              </Button>
              {design.logo && (
                <Button type="button" variant="ghost" size="sm" onClick={() => update({ logo: null })}>
                  <Trash2 className="size-3.5" /> Remove
                </Button>
              )}
            </div>

            <Row label="Or use an icon">
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
                {LOGO_ICONS.map((icon) => (
                  <button
                    key={icon.key}
                    type="button"
                    title={icon.label}
                    onClick={() =>
                      update({
                        logo: {
                          src: iconPng(icon.key, "#ffffff"),
                          size: 0.23,
                          plate: "circle",
                          plateColor: "#0d0d0e",
                          excavate: true,
                        },
                      })
                    }
                    className="grid aspect-square place-items-center rounded-lg border border-line bg-white p-1.5 text-[#0d0d0e] transition-colors hover:border-ink"
                  >
                    <IconGlyph name={icon.key} />
                  </button>
                ))}
              </div>
            </Row>

            {design.logo && (
              <div className="space-y-4 rounded-xl border border-line bg-card p-3">
                <Row label="Logo size" hint={`${Math.round(design.logo.size * 100)}% of width`}>
                  <input
                    type="range"
                    min={12}
                    max={30}
                    value={Math.round(design.logo.size * 100)}
                    onChange={(e) =>
                      update({ logo: { ...design.logo!, size: Number(e.target.value) / 100 } })
                    }
                    className="w-full"
                  />
                  <p className="mt-1 text-[11px] text-subtle">
                    Above 24% the error correction is raised to H automatically. Larger logos are riskier.
                  </p>
                </Row>
                <Row label="Plate behind the logo">
                  <Segmented
                    ariaLabel="Logo plate"
                    value={design.logo.plate}
                    onChange={(plate) => update({ logo: { ...design.logo!, plate } })}
                    options={[
                      { value: "none", label: "None" },
                      { value: "square", label: "Square" },
                      { value: "rounded", label: "Rounded" },
                      { value: "circle", label: "Circle" },
                    ]}
                  />
                </Row>
                {design.logo.plate !== "none" && (
                  <label className="flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={design.logo.plateColor !== null}
                      onChange={(e) =>
                        update({
                          logo: { ...design.logo!, plateColor: e.target.checked ? "#0d0d0e" : null },
                        })
                      }
                      className="size-3.5 accent-ink"
                    />
                    Custom plate color
                  </label>
                )}
                {design.logo.plate !== "none" && design.logo.plateColor !== null && (
                  <ColorField
                    label="Plate color"
                    value={design.logo.plateColor}
                    onChange={(v) => update({ logo: { ...design.logo!, plateColor: v } })}
                  />
                )}
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={design.logo.excavate}
                    onChange={(e) => update({ logo: { ...design.logo!, excavate: e.target.checked } })}
                    className="size-3.5 accent-ink"
                  />
                  Clear the modules behind the logo
                </label>
              </div>
            )}
          </div>
        )}

        {tab === "frame" && (
          <div className="space-y-4">
            <Row label="Frame style">
              <div className="grid grid-cols-2 gap-1.5">
                {FRAME_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => update({ frame: { ...design.frame, style } })}
                    aria-pressed={design.frame.style === style}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                      design.frame.style === style
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-card text-muted hover:border-line-strong hover:text-ink",
                    )}
                  >
                    {FRAME_LABELS[style]}
                  </button>
                ))}
              </div>
            </Row>

            {design.frame.style !== "none" && (
              <>
                <Row label="Call to action" hint={`${design.frame.text.length}/40`}>
                  <input
                    type="text"
                    maxLength={40}
                    value={design.frame.text}
                    onChange={(e) => update({ frame: { ...design.frame, text: e.target.value } })}
                    className={inputClass}
                    placeholder="SCAN ME"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {PHRASES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => update({ frame: { ...design.frame, text: p } })}
                        className="rounded-full border border-line px-2 py-1 text-[10px] text-muted hover:border-ink hover:text-ink"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Row>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ColorField
                    label="Frame color"
                    value={design.frame.color}
                    onChange={(color) => update({ frame: { ...design.frame, color } })}
                  />
                  <ColorField
                    label="Text color"
                    value={design.frame.textColor}
                    onChange={(textColor) => update({ frame: { ...design.frame, textColor } })}
                  />
                </div>
                <p className="text-[11px] leading-relaxed text-subtle">
                  Frames add a banner or border around the code. The QR symbol itself stays square, so
                  frames are safe to scan as long as contrast stays high.
                </p>
              </>
            )}
          </div>
        )}

        {tab === "advanced" && (
          <div className="space-y-5">
            <Row label="Error correction" hint="Auto is best for most codes">
              <Segmented
                ariaLabel="Error correction"
                value={design.ec}
                onChange={(ec) => update({ ec })}
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "L", label: "L" },
                  { value: "M", label: "M" },
                  { value: "Q", label: "Q" },
                  { value: "H", label: "H" },
                ]}
              />
              <p className="mt-2 text-[11px] leading-relaxed text-subtle">
                L recovers about 7% damage, M 15%, Q 25%, H 30%. Higher levels make the code denser. Auto
                uses M, and raises to Q or H when you add a logo.
              </p>
            </Row>

            <Row label="Quiet zone" hint={`${design.margin} modules`}>
              <input
                type="range"
                min={0}
                max={10}
                value={design.margin}
                onChange={(e) => update({ margin: Number(e.target.value) })}
                className="w-full"
              />
              <p className="mt-1 text-[11px] text-subtle">
                The blank border around the code. The standard asks for 4 modules; keep at least 2 for
                printed codes.
              </p>
            </Row>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onChange({
                  ...design,
                  dots: "square",
                  eyeFrame: "square",
                  eyeBall: "square",
                  fg: { kind: "solid", color: "#0d0d0e" },
                  bg: "#ffffff",
                  eyeFrameColor: null,
                  eyeBallColor: null,
                  logo: null,
                  frame: { style: "none", text: "SCAN ME", color: "#0d0d0e", textColor: "#ffffff" },
                  ec: "auto",
                  margin: 4,
                });
              }}
            >
              <RotateCcw className="size-3.5" /> Reset the design
            </Button>
            <p className="text-[11px] leading-relaxed text-subtle">
              Manual error-correction overrides are for special cases, like heavy print wear or a logo. If a
              code stops scanning, set it back to Auto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Minimal inline glyphs for the built-in logo icons. */
function IconGlyph({ name }: { name: string }) {
  const paths: Record<string, string> = {
    wifi: "M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0M8.5 16.43a5 5 0 0 1 7 0",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    "map-pin": "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    "shopping-cart": "M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2 3h2l2.4 12.2a2 2 0 0 0 2 1.8h9.7a2 2 0 0 0 2-1.6L22 7H5",
    coffee: "M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2",
    heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
    star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
    camera: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "calendar-days": "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01",
    "utensils-crossed": "M16 2l-7 7M8 2l8 8M5 16l3 3M3 21l6-6M14 14l7 7M21 14l-7 7",
    link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    "message-circle": "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.7-.9L3 21l2-5.3A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z",
    contact: "M16 2v2M8 2v2M4 4h16a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM15 9h2M15 13h2M7 17c.6-1.5 1.7-2 3-2s2.4.5 3 2",
    store: "M3 9l1.5-6h15L21 9M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 21v-6h6v6",
  };
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.link} />
    </svg>
  );
}
