"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileDown,
  Loader2,
  Save,
  ScanBarcode,
} from "lucide-react";
import { toast } from "sonner";
import {
  BARCODE_FORMATS,
  BARCODE_GROUPS,
  getBarcodeFormat,
} from "@/lib/barcode/formats";
import { DEFAULT_BARCODE_OPTIONS, barcodeSvg, withSvgSize, type BarcodeRenderOptions } from "@/lib/barcode/render";
import { downloadBlob, fileStem } from "@/lib/export/download";
import { svgToJpegBlob, svgToPdfBlob, svgToPngBlob, svgToWebpBlob } from "@/lib/export/svg";
import { newId, saveCode, type SavedBarcode } from "@/lib/library";
import { Button } from "@/components/ui/button";
import { Checkbox, ErrorText, Help, Input, Label, Select } from "@/components/ui/field";
import { cn } from "@/lib/cn";

const HEX = /^#[0-9a-f]{6}$/i;

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={label}
        value={HEX.test(value) ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="size-9 shrink-0 rounded-lg border border-line-strong"
      />
      <div className="min-w-0 flex-1">
        <span className="mb-0.5 block text-[11px] text-muted">{label}</span>
        <input
          value={value}
          onChange={(e) => HEX.test(e.target.value) && onChange(e.target.value)}
          className="w-full rounded-md border border-line bg-card px-2 py-1 font-mono text-[11px] uppercase"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export function BarcodeStudio({ initialFormat = "code-128" }: { initialFormat?: string }) {
  const [formatId, setFormatId] = useState(initialFormat);
  const format = getBarcodeFormat(formatId) ?? BARCODE_FORMATS[0];
  const [text, setText] = useState("");
  const [opts, setOpts] = useState<BarcodeRenderOptions>(DEFAULT_BARCODE_OPTIONS);
  const [rendered, setRendered] = useState<{ key: string; svg: string; error: string | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validation = useMemo(() => format.validate(text), [format, text]);
  const valid = validation.ok ? validation.text : null;
  const renderKey = JSON.stringify([valid, format.id, opts]);
  const svg = rendered?.key === renderKey ? rendered.svg : "";
  const error = !validation.ok ? validation.error : rendered?.key === renderKey ? rendered.error : null;

  useEffect(() => {
    let alive = true;
    if (!valid) return;
    barcodeSvg(valid, format, opts)
      .then((s) => {
        if (!alive) return;
        setRendered({ key: renderKey, svg: s, error: null });
      })
      .catch((err) => {
        if (!alive) return;
        setRendered({ key: renderKey, svg: "", error: err instanceof Error ? err.message.replace(/^bwip-js:\s*/, "") : "Could not draw this barcode." });
      });
    return () => {
      alive = false;
    };
  }, [valid, format, opts, renderKey]);

  function changeFormat(id: string) {
    setFormatId(id);
    setText("");
    setRendered(null);
  }

  const set = <K extends keyof BarcodeRenderOptions>(key: K, value: BarcodeRenderOptions[K]) =>
    setOpts((o) => ({ ...o, [key]: value }));

  async function copy() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(valid);
      toast.success("Barcode data copied.");
    } catch {
      toast.error("Could not copy.");
    }
  }

  async function download(kind: "svg" | "png" | "jpeg" | "webp" | "pdf") {
    if (!svg) return;
    setBusy(kind);
    try {
      const stem = fileStem(valid ?? "", "barcode");
      if (kind === "svg") {
        downloadBlob(new Blob([withSvgSize(svg, 1200)], { type: "image/svg+xml;charset=utf-8" }), `${stem}.svg`);
      } else if (kind === "png") {
        downloadBlob(await svgToPngBlob(svg, 2400), `${stem}.png`);
      } else if (kind === "jpeg") {
        downloadBlob(await svgToJpegBlob(svg, 2400, opts.background ?? "#ffffff"), `${stem}.jpg`);
      } else if (kind === "webp") {
        downloadBlob(await svgToWebpBlob(svg), `${stem}.webp`);
      } else {
        downloadBlob(await svgToPdfBlob(svg, 70), `${stem}.pdf`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not export the barcode.");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (!valid) return;
    setSaving(true);
    try {
      const now = Date.now();
      const code: SavedBarcode = {
        id: newId(),
        kind: "barcode",
        title: `${format.label}: ${valid}`.slice(0, 64),
        format: format.id,
        payload: valid,
        options: {
          scale: opts.scale,
          height: opts.height,
          includeText: opts.includeText,
          barColor: opts.barColor,
          background: opts.background,
          rotate: opts.rotate,
        },
        createdAt: now,
        updatedAt: now,
      };
      await saveCode(code);
      toast.success("Saved to My codes, in this browser.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save this barcode.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      <div className="order-2 space-y-5 lg:order-1">
        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Format</h2>
          <Select value={formatId} onChange={(e) => changeFormat(e.target.value)} aria-label="Barcode format">
            {BARCODE_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {BARCODE_FORMATS.filter((f) => f.group === g.id).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
          <p className="mt-2 text-xs leading-relaxed text-muted">{format.description}</p>

          <div className="mt-4">
            <Label htmlFor="barcode-data" required hint={`${text.length}/${format.maxLength}`}>
              Data
            </Label>
            {format.group === "two-d" ? (
              <textarea
                id="barcode-data"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, format.maxLength))}
                rows={4}
                placeholder={format.placeholder}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-line-strong bg-card px-3 py-2 text-sm focus:border-ink focus:outline-none focus:ring-2 focus:ring-ring/15"
              />
            ) : (
              <Input
                id="barcode-data"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, format.maxLength))}
                placeholder={format.placeholder}
                spellCheck={false}
                autoComplete="off"
              />
            )}
            {format.gs1 && (
              <Help>
                Put each Application Identifier in parentheses, for example (01)09521234543213(17)261231.
                Supply-chain use needs GS1-issued numbers.
              </Help>
            )}
            {format.check && (
              <Help>
                Enter the data digits and the check digit is calculated for you. If you include a check digit,
                it is verified.
              </Help>
            )}
            {validation.ok && validation.warning && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-warn-soft px-2.5 py-1.5 text-[11px] text-warn">
                <AlertTriangle className="mt-0.5 size-3 shrink-0" /> {validation.warning}
              </p>
            )}
            {!validation.ok && validation.error && <ErrorText>{validation.error}</ErrorText>}
            {valid && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-success">
                <Check className="size-3" /> Encoded as {format.label}: <span className="font-mono">{valid}</span>
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Appearance</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Module width</Label>
              <input type="range" min={1} max={6} step={1} value={opts.scale} onChange={(e) => set("scale", Number(e.target.value))} className="w-full" />
              <p className="text-[11px] text-subtle">Scale {opts.scale}</p>
            </div>
            <div>
              <Label>Bar height</Label>
              <input type="range" min={8} max={40} step={1} value={opts.height} onChange={(e) => set("height", Number(e.target.value))} className="w-full" />
              <p className="text-[11px] text-subtle">{opts.height} mm</p>
            </div>
            <ColorField label="Bar color" value={opts.barColor} onChange={(v) => set("barColor", v)} />
            <div>
              <Label>Background</Label>
              <div className="flex items-center gap-2">
                <ColorField label="Color" value={opts.background ?? "#ffffff"} onChange={(v) => set("background", v)} />
                <label className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted">
                  <input
                    type="checkbox"
                    checked={opts.background === null}
                    onChange={(e) => set("background", e.target.checked ? null : "#ffffff")}
                    className="size-3.5 accent-ink"
                  />
                  None
                </label>
              </div>
            </div>
            <div>
              <Label>Rotation</Label>
              <Select value={opts.rotate} onChange={(e) => set("rotate", Number(e.target.value) as BarcodeRenderOptions["rotate"])}>
                <option value={0}>0°</option>
                <option value={90}>90°</option>
                <option value={180}>180°</option>
                <option value={270}>270°</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Checkbox
                checked={opts.includeText}
                onChange={(e) => set("includeText", e.target.checked)}
                label="Show human-readable text"
                disabled={format.group === "two-d"}
              />
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-subtle">
            Keep bars dark and the background light. A quiet zone is added automatically around the symbol.
          </p>
        </section>
      </div>

      <aside className="order-1 lg:order-2 lg:sticky lg:top-20">
        <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ScanBarcode className="size-4" /> Preview
            </h2>
            <span className="rounded-full bg-card-2 px-2 py-0.5 text-[10px] text-muted">{format.label}</span>
          </div>

          <div className={cn("min-h-40 overflow-x-auto rounded-xl p-3", opts.background === null ? "bg-checker" : "bg-white")}>
            {svg ? (
              <div className="mx-auto w-full max-w-full [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
              <div className="flex h-36 items-center justify-center px-4 text-center text-xs text-subtle">
                {error ?? "Enter data to see the barcode."}
              </div>
            )}
          </div>

          {error && svg && <p className="mt-2 text-[11px] text-danger">{error}</p>}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" onClick={() => download("png")} disabled={!svg || busy !== null}>
              {busy === "png" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              PNG
            </Button>
            <Button type="button" variant="outline" onClick={save} disabled={!valid || !svg || saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2">
            {(["svg", "jpeg", "webp", "pdf"] as const).map((k) => (
              <Button key={k} type="button" size="sm" variant="outline" onClick={() => download(k)} disabled={!svg || busy !== null}>
                {busy === k ? <Loader2 className="size-3 animate-spin" /> : <FileDown className="size-3" />}
                {k === "jpeg" ? "JPG" : k.toUpperCase()}
              </Button>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={copy} disabled={!valid} className="flex-1">
              <Copy className="size-3.5" /> Copy data
            </Button>
            <a
              href={format.id ? `/barcode-generator/${format.id}` : "/barcode-generator"}
              className="inline-flex items-center text-[11px] text-muted hover:text-ink"
            >
              About {format.label}
            </a>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-subtle">
            For retail products, use numbers issued by GS1 or your national ISBN agency. Never invent a
            product number, because it can collide with a real product. Test the printed barcode with a
            scanner before a print run.
          </p>
        </div>
      </aside>
    </div>
  );
}
