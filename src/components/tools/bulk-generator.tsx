"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { DesignPanel } from "@/components/studio/design-panel";
import { QrPreview } from "@/components/studio/qr-preview";
import { parseBulkCsv, type BulkRow } from "@/lib/bulk";
import { QR_TYPES, QR_TYPE_MAP, type QrTypeId } from "@/lib/payload/qr-types";
import { DEFAULT_DESIGN } from "@/lib/qr/types";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import { downloadBlob, fileStem, sceneBlob } from "@/lib/export/download";

const EXAMPLE = "filename,url\nwebsite,https://example.com\nmenu,https://example.com/menu";

export function BulkGenerator() {
  const [typeId, setTypeId] = useState<QrTypeId>("url");
  const [csv, setCsv] = useState(EXAMPLE);
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const [format, setFormat] = useState("svg");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const cancel = useRef(false);
  const type = QR_TYPE_MAP[typeId];

  function validate() {
    try { const parsed = parseBulkCsv(csv, typeId); setRows(parsed); setError(""); }
    catch (e) { setRows([]); setError(e instanceof Error ? e.message : "Could not read the CSV."); }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 2_000_000) { setError("Keep the CSV under 2 MB."); return; }
    try { setCsv(await file.text()); setRows([]); setError(""); }
    catch { setError("Could not read that file."); }
  }
  async function generate() {
    setBusy(true); setProgress(0); setError(""); cancel.current = false;
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const failures: string[] = [];
      let added = 0;
      for (let i = 0; i < rows.length; i++) {
        if (cancel.current) return;
        const row = rows[i];
        try {
          const scene = renderQr(row.payload, design).scene;
          // Prefix makes duplicate names safe and keeps the original CSV order.
          const filename = `${String(i + 1).padStart(3, "0")}-${fileStem(row.name)}.${format}`;
          zip.file(filename, format === "svg" ? sceneToSvg(scene, { size: 1024, idPrefix: `bulk-${i}` }) : await (await sceneBlob(scene, "png", 1024)).arrayBuffer());
          added++;
        } catch (e) { failures.push(`Row ${row.row}: ${e instanceof Error ? e.message : "Could not render"}`); }
        setProgress(i + 1);
        if (i % 8 === 0) await new Promise<void>((r) => setTimeout(r, 0));
      }
      if (!added) throw new Error(failures[0] || "No codes could be generated.");
      if (failures.length) zip.file("errors.txt", failures.join("\n"));
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      if (cancel.current) return;
      downloadBlob(blob, "qrwright-bulk.zip");
      if (failures.length) toast.warning(`${added} codes exported; ${failures.length} failed. See errors.txt in the ZIP.`);
      else toast.success(`${added} QR codes exported.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not export this batch."); }
    finally { setBusy(false); }
  }
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
    <div className="space-y-5">
      <fieldset disabled={busy} className="rounded-2xl border border-line bg-card p-5 disabled:opacity-60">
        <Label htmlFor="bulk-type">1. Choose a content type</Label><Select id="bulk-type" value={typeId} onChange={(e) => { setTypeId(e.target.value as QrTypeId); setRows([]); }}>{QR_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</Select>
        <p className="mt-3 text-xs leading-relaxed text-muted">CSV headers for {type.label}: <span className="font-mono">{type.fields.map((f) => f.name).join(", ")}</span>. Add an optional <code>filename</code> column. Unspecified fields use the generator defaults.</p>
        <Label htmlFor="bulk-csv" className="mt-5">2. Paste or open a CSV</Label><Textarea id="bulk-csv" value={csv} onChange={(e) => { setCsv(e.target.value); setRows([]); }} rows={8} maxLength={2_000_000} className="font-mono text-xs" spellCheck={false} />
        <div className="mt-3 flex flex-wrap items-center gap-2"><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-2 text-xs"><Upload className="size-3.5" /> Open CSV<Input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></label><Button variant="outline" size="sm" onClick={() => downloadBlob(new Blob([EXAMPLE], { type: "text/csv" }), "qrwright-example.csv")}>Example CSV</Button><Button size="sm" onClick={validate}>Validate rows</Button></div>
        {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
        {rows.length > 0 && <div className="mt-4"><p className="text-xs text-muted">{rows.length} rows · {rows.filter((r) => r.error).length} need attention</p><div className="mt-2 max-h-64 overflow-auto rounded-lg border border-line"><table className="w-full text-left text-xs"><thead className="sticky top-0 bg-card-2"><tr><th className="p-2">Row</th><th className="p-2">Filename</th><th className="p-2">Status</th></tr></thead><tbody>{rows.map((r) => <tr key={r.row} className="border-t border-line"><td className="p-2">{r.row}</td><td className="max-w-36 truncate p-2">{r.name}</td><td className={`p-2 ${r.error ? "text-danger" : "text-success"}`}>{r.error || "Ready"}</td></tr>)}</tbody></table></div></div>}
      </fieldset>
      <fieldset disabled={busy} className="rounded-2xl border border-line bg-card p-5"><h2 className="mb-4 text-sm font-semibold">3. One design for the whole batch</h2><DesignPanel design={design} onChange={setDesign} /></fieldset>
    </div>
    <aside className="h-fit rounded-2xl border border-line bg-card p-5 lg:sticky lg:top-20"><h2 className="mb-3 text-sm font-semibold">First valid row preview</h2><div className="rounded-xl bg-white p-2"><QrPreview payload={rows.find((r) => !r.error)?.payload ?? ""} design={design} placeholder="Validate your rows to see a preview." /></div><Label htmlFor="bulk-format" className="mt-4">Export format</Label><Select id="bulk-format" value={format} onChange={(e) => setFormat(e.target.value)} disabled={busy}><option value="svg">SVG · vector, print-ready</option><option value="png">PNG · 1024 px</option></Select><Button className="mt-4 w-full" disabled={busy || !rows.length || rows.some((r) => r.error)} onClick={generate}>{busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}{busy ? `${progress} / ${rows.length}` : "Download ZIP"}</Button>{busy && <Button className="mt-2 w-full" variant="ghost" onClick={() => { cancel.current = true; }}>Cancel</Button>}<p className="mt-3 text-xs leading-relaxed text-muted">Up to 500 Direct codes per batch. Files are processed on this device. Test a few finished codes before printing.</p></aside>
  </div>;
}
