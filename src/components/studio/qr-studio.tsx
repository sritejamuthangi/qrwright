"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  Loader2,
  Printer,
  RefreshCw,
  Save,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { contrastReport } from "@/lib/qr/color";
import { minPrintWidthMm } from "@/lib/qr/matrix";
import { renderQr } from "@/lib/qr/render";
import { sanitizeDesign } from "@/lib/qr/sanitize";
import { getTemplate } from "@/lib/qr/templates";
import { sceneToSvg } from "@/lib/qr/svg";
import { DEFAULT_DESIGN, type QrDesign } from "@/lib/qr/types";
import { QR_TYPE_MAP, type FieldDef, type QrTypeId, type Values } from "@/lib/payload/qr-types";
import { sceneBlob, downloadBlob, fileStem } from "@/lib/export/download";
import { sceneToPdfBlob, sceneToSheetPdf } from "@/lib/export/pdf";
import { sceneToCanvas } from "@/lib/qr/canvas";
import { newId, saveCode, type SavedQr } from "@/lib/library";
import { createTrackedLink, fetchStats, formatCount, type TrackedLink } from "@/lib/tracking/client";
import { Button } from "@/components/ui/button";
import { Checkbox, ErrorText, Help, Input, Label, Segmented, Select, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { QrPreview } from "./qr-preview";
import { DesignPanel } from "./design-panel";
import { QrTypePicker, TypeIcon } from "./type-picker";

const DESIGN_KEY = "qrwright:design:v1";

function titleFor(typeId: QrTypeId, values: Values, payload: string): string {
  const v = values;
  const firstLast = [v.first, v.last].filter((x) => typeof x === "string" && x.trim()).join(" ");
  const candidates = [v.name, v.title, v.ssid, firstLast, v.org, v.page, v.vpa, v.url, v.text, payload];
  const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0) as string | undefined;
  const label = QR_TYPE_MAP[typeId].label;
  const title = (found ?? label).replace(/\s+/g, " ").trim();
  return title.length > 64 ? `${title.slice(0, 61)}…` : title;
}

function ContentField({
  field,
  values,
  onChange,
}: {
  field: FieldDef;
  values: Values;
  onChange: (name: string, value: string | boolean) => void;
}) {
  const id = `f-${field.name}`;
  const value = values[field.name];
  const common = { id, name: field.name, maxLength: field.maxLength, required: field.required };

  let control: React.ReactNode;
  switch (field.kind) {
    case "textarea":
      control = (
        <Textarea
          {...common}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          rows={field.name === "about" ? 3 : 4}
        />
      );
      break;
    case "select":
      control = (
        <Select value={String(value ?? "")} onChange={(e) => onChange(field.name, e.target.value)} {...common}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      );
      break;
    case "checkbox":
      control = (
        <Checkbox
          checked={value === true}
          onChange={(e) => onChange(field.name, e.target.checked)}
          label={field.label}
        />
      );
      break;
    case "color":
      control = (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#0d0d0e"}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="size-9 rounded-lg border border-line-strong"
            aria-label={field.label}
          />
          <Input
            value={String(value ?? "#0d0d0e")}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="font-mono text-xs uppercase"
            maxLength={7}
          />
        </div>
      );
      break;
    default:
      control = (
        <Input
          {...common}
          type={field.kind === "url" ? "text" : field.kind}
          inputMode={field.kind === "tel" ? "tel" : undefined}
          autoComplete={field.autoComplete}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
        />
      );
  }

  if (field.kind === "checkbox") {
    return <div className="pt-1">{control}</div>;
  }

  return (
    <div className={cn(field.half ? "sm:col-span-1" : "sm:col-span-2")}>
      <Label htmlFor={id} required={field.required} hint={field.maxLength ? `${String(value ?? "").length}/${field.maxLength}` : undefined}>
        {field.label}
      </Label>
      {control}
      {field.help && <Help>{field.help}</Help>}
    </div>
  );
}

export function QrStudio({
  initialType = "url",
  hideTypePicker = false,
}: {
  initialType?: QrTypeId;
  hideTypePicker?: boolean;
}) {
  const [typeId, setTypeId] = useState<QrTypeId>(initialType);
  const type = QR_TYPE_MAP[typeId];
  const [values, setValues] = useState<Values>({ ...type.defaults });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mode, setMode] = useState<"direct" | "tracked">("direct");
  const [tracked, setTracked] = useState<TrackedLink | null>(null);
  const [trackBusy, setTrackBusy] = useState(false);
  const [stats, setStats] = useState<number | null>(null);
  const [statsNonce, setStatsNonce] = useState(0);
  const [design, setDesign] = useState<QrDesign>(DEFAULT_DESIGN);
  const [hydrated, setHydrated] = useState(false);
  const [scanResult, setScanResult] = useState<{ key: string; results: { width: number; ok: boolean }[] } | null>(null);
  const [scanBusy, setScanBusy] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [pngWidth, setPngWidth] = useState(2048);
  const [pdfWidth, setPdfWidth] = useState(60);
  const [sheetPage, setSheetPage] = useState<"a4" | "letter">("a4");
  const [sheetCount, setSheetCount] = useState(6);
  const [sheetGuides, setSheetGuides] = useState(true);
  const [saving, setSaving] = useState(false);
  const contentVersion = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DESIGN_KEY);
      // This effect hydrates an external browser-only preference after SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDesign(sanitizeDesign(JSON.parse(raw)));
    } catch {
      /* ignore a corrupt preference */
    }
    const template = getTemplate(new URLSearchParams(window.location.search).get("template") ?? "");
    if (template) setDesign(sanitizeDesign(template.design));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(DESIGN_KEY, JSON.stringify(design));
    } catch {
      /* storage may be full or blocked */
    }
  }, [design, hydrated]);

  const encoded = useMemo(() => type.encode(values), [type, values]);

  const previewPayload =
    mode === "tracked" ? (tracked?.url ?? "") : encoded.ok ? encoded.payload : "";

  const rendered = useMemo(() => {
    if (!previewPayload) return null;
    try {
      return renderQr(previewPayload, design);
    } catch {
      return null;
    }
  }, [previewPayload, design]);

  const scanKey = JSON.stringify([previewPayload, design]);
  const scan = scanResult?.key === scanKey ? scanResult.results : null;

  useEffect(() => {
    if (!tracked) return;
    let alive = true;
    fetchStats([tracked.countId])
      .then((s) => {
        if (alive) setStats(s.totals[tracked.countId] ?? 0);
      })
      .catch(() => {
        if (alive) setStats(null);
      });
    return () => {
      alive = false;
    };
  }, [tracked, statsNonce]);

  function changeType(id: QrTypeId) {
    contentVersion.current++;
    setTypeId(id);
    setValues({ ...QR_TYPE_MAP[id].defaults });
    setTracked(null);
    setMode("direct");
    setPickerOpen(false);
  }

  function changeValue(name: string, value: string | boolean) {
    contentVersion.current++;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (tracked) setTracked(null);
  }

  const contrast = contrastReport(design);
  const usesMiniPage = encoded.ok && encoded.payload.includes("/p#");
  const canTrack = type.trackable && (!encoded.ok || encoded.track !== null);
  const activeFields = type.fields.filter((f) => !f.showIf || f.showIf(values));

  async function createTrack() {
    if (!encoded.ok || !encoded.track) return;
    setTrackBusy(true);
    const version = contentVersion.current;
    try {
      const link = await createTrackedLink(encoded.track);
      if (contentVersion.current !== version) return;
      setTracked(link);
      setMode("tracked");
      setStats(0);
      toast.success("Tracked link created. The QR code now counts scans.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the tracked link.");
    } finally {
      setTrackBusy(false);
    }
  }

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Could not copy. Select the text and copy it manually.");
    }
  }

  async function save() {
    if (!rendered || !previewPayload) return;
    setSaving(true);
    try {
      const now = Date.now();
      const code: SavedQr = {
        id: newId(),
        kind: "qr",
        title: titleFor(typeId, values, previewPayload),
        typeId,
        payload: previewPayload,
        design,
        tracked: tracked ?? undefined,
        createdAt: now,
        updatedAt: now,
      };
      await saveCode(code);
      toast.success("Saved to My codes, in this browser.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save this code.");
    } finally {
      setSaving(false);
    }
  }

  async function download(format: "png" | "svg" | "jpeg" | "webp" | "pdf" | "sheet") {
    if (!rendered) return;
    setBusy(format);
    try {
      const stem = fileStem(previewPayload, "qr-code");
      if (format === "svg") {
        const svg = sceneToSvg(rendered.scene, { size: 1024, idPrefix: "export", title: "QR code" });
        downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${stem}.svg`);
      } else if (format === "pdf") {
        downloadBlob(await sceneToPdfBlob(rendered.scene, { widthMm: pdfWidth }), `${stem}.pdf`);
      } else if (format === "sheet") {
        downloadBlob(
          await sceneToSheetPdf(rendered.scene, {
            page: sheetPage,
            count: sheetCount,
            caption: titleFor(typeId, values, previewPayload),
            guides: sheetGuides,
          }),
          `${stem}-print-sheet.pdf`,
        );
      } else {
        downloadBlob(await sceneBlob(rendered.scene, format, pngWidth), `${stem}.${format === "jpeg" ? "jpg" : format}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not export this code.");
    } finally {
      setBusy(null);
    }
  }

  async function runScanCheck() {
    if (!rendered || !previewPayload) return;
    setScanBusy(true);
    setScanResult(null);
    try {
      const jsQR = (await import("jsqr")).default;
      const widths = [300, 560, 860];
      const results: { width: number; ok: boolean }[] = [];
      for (const width of widths) {
        const canvas = await sceneToCanvas(rendered.scene, width);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not supported.");
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(data.data, canvas.width, canvas.height, { inversionAttempts: "attemptBoth" });
        results.push({ width, ok: code?.data === previewPayload });
      }
      setScanResult({ key: scanKey, results });
    } catch {
      toast.error("The scan check could not run in this browser.");
    } finally {
      setScanBusy(false);
    }
  }

  const version = rendered?.matrix.version;
  const printMm = rendered ? minPrintWidthMm(rendered.matrix.size, design.margin) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="order-2 min-w-0 space-y-5 lg:order-1">
        {/* Content */}
        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="grid size-5 place-items-center rounded-full bg-signal text-[11px] font-bold text-signal-ink">1</span>
              Content
            </h2>
            {!hideTypePicker && (
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted hover:border-ink hover:text-ink"
                aria-expanded={pickerOpen}
              >
                <TypeIcon id={typeId} className="size-3.5" />
                {type.label}
                <ChevronDown className={cn("size-3 transition-transform", pickerOpen && "rotate-180")} />
              </button>
            )}
          </div>

          {!hideTypePicker && pickerOpen && (
            <div className="mb-4 rounded-xl border border-line bg-card-2/60 p-2">
              <QrTypePicker value={typeId} onChange={changeType} />
            </div>
          )}

          {hideTypePicker && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-card-2 px-3 py-2 text-xs text-muted">
              <TypeIcon id={typeId} className="size-4" />
              {type.label}: {type.description}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {activeFields.map((field) => (
              <ContentField key={field.name} field={field} values={values} onChange={changeValue} />
            ))}
          </div>

          {encoded.ok === false && encoded.error && <ErrorText>{encoded.error}</ErrorText>}
          {previewPayload && !rendered && <ErrorText>This content or design is too large to render. Shorten the content or reduce error correction.</ErrorText>}
          {encoded.ok && encoded.warning && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-warn-soft px-3 py-2 text-xs leading-relaxed text-warn">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {encoded.warning}
            </p>
          )}

          <div className="mt-5 rounded-xl border border-line bg-card-2/50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[13px] font-medium">Scan tracking</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Direct codes have no expiry or scan counts. Tracked codes count link opens.
                </p>
              </div>
              <Segmented
                ariaLabel="Tracking mode"
                value={mode}
                onChange={(m) => {
                  contentVersion.current++;
                  setMode(m);
                  if (m === "direct") setTracked(null);
                }}
                options={[
                  { value: "direct", label: "Direct" },
                  {
                    value: "tracked",
                    label: "Tracked",
                    disabled: !canTrack,
                    title: !type.trackable
                      ? "This type is always Direct"
                      : !canTrack
                        ? "This content cannot be tracked"
                        : "Count scans with a short link",
                  },
                ]}
              />
            </div>

            {!type.trackable && (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-subtle">
                <ShieldCheck className="mt-0.5 size-3 shrink-0" />
                {usesMiniPage ? "Page data is inside the link. This mini page still needs QRWright online to display." : "This type is always Direct: the content is inside the QR code and is never counted."}
              </p>
            )}

            {type.trackable && mode === "tracked" && !tracked && (
              <div className="mt-3 rounded-lg border border-line bg-card p-3">
                <p className="text-xs leading-relaxed text-muted">
                  A tracked code points to a signed short link on{" "}
                  <span className="font-mono text-[11px]">qrcode.sritejam.com</span>. We count scans and store
                  nothing about the destination. The link cannot be edited later, and it needs this site to
                  stay online.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-3"
                  onClick={createTrack}
                  disabled={trackBusy || !encoded.ok || !encoded.track}
                >
                  {trackBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  Create tracked link
                </Button>
              </div>
            )}

            {tracked && (
              <div className="mt-3 rounded-lg border border-line bg-card p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-subtle">Short link</p>
                <div className="mt-1.5 flex gap-2">
                  <input
                    readOnly
                    value={tracked.url}
                    onFocus={(e) => e.target.select()}
                    className="min-w-0 flex-1 rounded-md border border-line bg-card-2 px-2 py-1.5 font-mono text-[11px]"
                  />
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Copy short link" onClick={() => copy(tracked.url, "Short link copied.")}>
                    <Copy className="size-3.5" />
                  </Button>
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-xs">
                  <span className="text-muted">Scans</span>
                  <strong className="text-base tabular-nums" title={stats?.toLocaleString("en-US")}>{stats === null ? "—" : formatCount(stats)}</strong>
                  <button
                    type="button"
                    onClick={() => setStatsNonce((n) => n + 1)}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink"
                  >
                    <RefreshCw className="size-3" /> Refresh
                  </button>
                  <a
                    href={tracked.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink"
                  >
                    Open <ExternalLink className="size-3" />
                  </a>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-subtle">
                  Changing the content creates a new link. Bots and link previews are filtered out of counts.
                  Opening it yourself counts as a scan.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Design */}
        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <span className="grid size-5 place-items-center rounded-full bg-signal text-[11px] font-bold text-signal-ink">2</span>
            Design
          </h2>
          <DesignPanel design={design} onChange={setDesign} />
        </section>
      </div>

      {/* Preview */}
      <aside className="order-1 lg:order-2 lg:sticky lg:top-20">
        <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Live preview</h2>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium",
                mode === "tracked" && tracked
                  ? "bg-signal text-signal-ink"
                  : "bg-card-2 text-muted",
              )}
            >
              {mode === "tracked" && tracked ? (
                <>
                  <ScanLine className="size-3" /> Tracked
                </>
              ) : (
                "Direct · permanent"
              )}
            </span>
          </div>

          <div
            className={cn(
              "rounded-xl p-3",
              design.bg === null ? "bg-checker" : "bg-white",
            )}
          >
            <QrPreview
              payload={previewPayload}
              design={design}
              placeholder={
                mode === "tracked"
                  ? "Create the tracked link to preview your code."
                  : "Add your content to see the QR code."
              }
            />
          </div>

          {rendered && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-subtle">
              <span>Version {version}</span>
              <span>{rendered.matrix.size} × {rendered.matrix.size} modules</span>
              <span>EC {rendered.matrix.ec}</span>
              <span>Print ≥ {printMm} mm</span>
            </div>
          )}

          {(contrast.level !== "good" || (design.logo && design.logo.size > 0.26)) && (
            <div className="mt-3 space-y-2">
              {contrast.level !== "good" && (
                <p
                  className={cn(
                    "flex items-start gap-2 rounded-lg px-3 py-2 text-[11px] leading-relaxed",
                    contrast.level === "poor" ? "bg-danger-soft text-danger" : "bg-warn-soft text-warn",
                  )}
                >
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  {contrast.inverted
                    ? "Light modules on a dark background fail on many scanners. Use dark modules on a light background."
                    : contrast.level === "poor"
                      ? "Very low contrast. Darken the code or lighten the background before printing."
                      : "Contrast is low. Test with a few phones before a print run."}
                </p>
              )}
              {design.logo && design.logo.size > 0.26 && (
                <p className="flex items-start gap-2 rounded-lg bg-warn-soft px-3 py-2 text-[11px] leading-relaxed text-warn">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  The logo is large. Auto error correction is raised to H, but test at the final print size.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" onClick={() => download("png")} disabled={!rendered || busy !== null}>
              {busy === "png" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Download PNG
            </Button>
            <Button type="button" variant="outline" onClick={save} disabled={!rendered || saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save
            </Button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <select
              aria-label="PNG size"
              value={pngWidth}
              onChange={(e) => setPngWidth(Number(e.target.value))}
              className="h-8 flex-1 rounded-full border border-line bg-card px-2 text-[11px] text-muted"
            >
              {[512, 1024, 2048, 4096].map((w) => (
                <option key={w} value={w}>{w} px PNG</option>
              ))}
            </select>
            <Button type="button" size="sm" variant="ghost" onClick={runScanCheck} disabled={!rendered || scanBusy}>
              {scanBusy ? <Loader2 className="size-3.5 animate-spin" /> : <ScanLine className="size-3.5" />}
              Scan check
            </Button>
          </div>

          {scan && (
            <div className="mt-2 rounded-lg border border-line bg-card-2 p-2.5">
              <p className="text-[11px] font-medium">Decoded in this browser</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {scan.map((r) => (
                  <span
                    key={r.width}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      r.ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
                    )}
                  >
                    {r.ok ? <Check className="size-2.5" /> : <AlertTriangle className="size-2.5" />}
                    {r.width}px
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-subtle">
                A simulation, not a guarantee. Test with real phones at the final size.
              </p>
            </div>
          )}

          <details className="group mt-3 rounded-lg border border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5">
                <FileDown className="size-3.5" /> More formats and print
              </span>
              <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-line p-3">
              <div className="grid grid-cols-3 gap-1.5">
                {(["svg", "pdf", "jpeg", "webp"] as const).map((f) => (
                  <Button
                    key={f}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => download(f)}
                    disabled={!rendered || busy !== null}
                  >
                    {busy === f ? <Loader2 className="size-3 animate-spin" /> : null}
                    {f.toUpperCase()}
                  </Button>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                <label className="flex items-center justify-between gap-2 text-[11px] text-muted">
                  PDF width
                  <select
                    value={pdfWidth}
                    onChange={(e) => setPdfWidth(Number(e.target.value))}
                    className="h-7 rounded-md border border-line bg-card px-1.5 text-[11px]"
                  >
                    {[30, 40, 50, 60, 80, 100].map((mm) => (
                      <option key={mm} value={mm}>{mm} mm</option>
                    ))}
                  </select>
                </label>
                <Button type="button" size="sm" variant="soft" className="w-full" onClick={() => download("pdf")} disabled={!rendered || busy !== null}>
                  {busy === "pdf" ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                  Download PDF
                </Button>
              </div>

              <div className="mt-4 border-t border-line pt-3">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium">
                  <Printer className="size-3.5" /> Print sheet
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Paper size"
                    value={sheetPage}
                    onChange={(e) => setSheetPage(e.target.value as "a4" | "letter")}
                    className="h-8 rounded-md border border-line bg-card px-1.5 text-[11px]"
                  >
                    <option value="a4">A4</option>
                    <option value="letter">US Letter</option>
                  </select>
                  <select
                    aria-label="Codes per page"
                    value={sheetCount}
                    onChange={(e) => setSheetCount(Number(e.target.value))}
                    className="h-8 rounded-md border border-line bg-card px-1.5 text-[11px]"
                  >
                    {[2, 4, 6, 9, 12, 16].map((n) => (
                      <option key={n} value={n}>{n} per page</option>
                    ))}
                  </select>
                </div>
                <label className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                  <input type="checkbox" checked={sheetGuides} onChange={(e) => setSheetGuides(e.target.checked)} className="size-3.5 accent-ink" />
                  Dashed cut guides
                </label>
                <Button type="button" size="sm" variant="soft" className="mt-2 w-full" onClick={() => download("sheet")} disabled={!rendered || busy !== null}>
                  {busy === "sheet" ? <Loader2 className="size-3.5 animate-spin" /> : <Printer className="size-3.5" />}
                  Download sheet PDF
                </Button>
              </div>
            </div>
          </details>

          <p className="mt-3 text-[10px] leading-relaxed text-subtle">
            Codes are generated on your device. Only tracked-link scan counts reach our servers. Always test a
            printed code with a real phone before ordering a large print run.
          </p>
        </div>
      </aside>
    </div>
  );
}
