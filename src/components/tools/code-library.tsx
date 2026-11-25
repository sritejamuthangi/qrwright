"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download, Loader2, RefreshCw, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { QrPreview } from "@/components/studio/qr-preview";
import { DesignPanel } from "@/components/studio/design-panel";
import { deleteCode, exportBackup, importBackup, listCodes, newId, saveCode, type SavedCode } from "@/lib/library";
import { QR_TYPE_MAP } from "@/lib/payload/qr-types";
import { getBarcodeFormat } from "@/lib/barcode/formats";
import { barcodeSvg } from "@/lib/barcode/render";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import { downloadBlob, fileStem, sceneBlob } from "@/lib/export/download";
import { sceneToPdfBlob, sceneToSheetPdf } from "@/lib/export/pdf";
import { svgToJpegBlob, svgToPdfBlob, svgToPngBlob, svgToWebpBlob } from "@/lib/export/svg";
import { fetchDaily, fetchStats, formatCount, type DailyStats } from "@/lib/tracking/client";

function BarcodePreview({ code }: { code: Extract<SavedCode, { kind: "barcode" }> }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let alive = true;
    const format = getBarcodeFormat(code.format);
    if (format) barcodeSvg(code.payload, format, code.options).then((s) => { if (alive) setSvg(s); }).catch(() => {});
    return () => { alive = false; };
  }, [code]);
  return <div className="grid min-h-32 place-items-center rounded-lg bg-white p-3 text-black [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg || "Preview unavailable" }} />;
}

function DailyChart({ id }: { id: string }) {
  const [data, setData] = useState<DailyStats | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let alive = true;
    fetchDaily(id, 30).then((s) => { if (alive) { setData(s); setError(""); } }).catch(() => { if (alive) setError("Scan counts are temporarily unavailable."); });
    return () => { alive = false; };
  }, [id, refresh]);
  const peak = Math.max(1, ...(data?.daily.map((d) => d.n) ?? []));
  return <section className="mt-5 rounded-xl border border-line p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Scans · last 30 days</h3><button type="button" aria-label="Refresh daily counts" onClick={() => setRefresh((n) => n + 1)}><RefreshCw className="size-4" /></button></div>{error ? <p role="status" className="mt-2 text-xs text-muted">{error}</p> : !data ? <p className="mt-2 text-xs text-muted">Loading counts…</p> : <><p className="mt-2 text-xs text-muted"><strong className="text-lg text-ink" title={String(data.total)}>{formatCount(data.total)}</strong> total link opens</p><div className="mt-4 flex h-24 items-end gap-1" role="img" aria-label={`Daily scans for the past 30 days. Total ${data.daily.reduce((n, d) => n + d.n, 0)}.`}>{data.daily.map((d) => <div key={d.day} className="min-w-0 flex-1 rounded-t-sm bg-ink" style={{ height: `${d.n ? Math.max(3, d.n / peak * 100) : 1}%`, opacity: d.n ? 1 : 0.15 }} title={`${d.day}: ${d.n}`} />)}</div><div className="mt-1 flex justify-between font-mono text-[9px] text-subtle"><span>{data.daily[0]?.day}</span><span>{data.daily.at(-1)?.day}</span></div><details className="mt-3 text-xs"><summary className="text-muted">Daily numbers (UTC)</summary><div className="mt-2 max-h-40 overflow-auto">{data.daily.map((d) => <div key={d.day} className="flex justify-between border-b border-line py-1"><span>{d.day}</span><span>{d.n}</span></div>)}</div></details></>}<p className="mt-3 text-[10px] leading-relaxed text-subtle">Bot-filtered link opens, not unique visitors. Daily history is retained for 90 days; totals remain.</p></section>;
}

function CodeEditor({ code, onSave, onClose }: { code: SavedCode; onSave: (code: SavedCode) => Promise<void>; onClose: () => void }) {
  const [draft, setDraft] = useState(code);
  const [busy, setBusy] = useState("");
  async function exportCode(format: string) {
    setBusy(format);
    try {
      const stem = fileStem(draft.title);
      let blob: Blob;
      if (draft.kind === "qr") {
        const scene = renderQr(draft.payload, draft.design).scene;
        if (format === "svg") blob = new Blob([sceneToSvg(scene, { size: 1024 })], { type: "image/svg+xml" });
        else if (format === "pdf") blob = await sceneToPdfBlob(scene, { widthMm: 60 });
        else if (format === "sheet") blob = await sceneToSheetPdf(scene, { page: "a4", count: 6, guides: true, caption: draft.title });
        else blob = await sceneBlob(scene, format as "png" | "jpeg" | "webp", 2048);
      } else {
        const definition = getBarcodeFormat(draft.format);
        if (!definition) throw new Error("Unknown format.");
        const svg = await barcodeSvg(draft.payload, definition, draft.options);
        if (format === "svg") blob = new Blob([svg], { type: "image/svg+xml" });
        else if (format === "pdf") blob = await svgToPdfBlob(svg);
        else if (format === "jpeg") blob = await svgToJpegBlob(svg);
        else if (format === "webp") blob = await svgToWebpBlob(svg);
        else blob = await svgToPngBlob(svg);
      }
      downloadBlob(blob, `${stem}${format === "sheet" ? "-sheet" : ""}.${format === "sheet" ? "pdf" : format === "jpeg" ? "jpg" : format}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Export failed."); }
    finally { setBusy(""); }
  }
  return <section className="rounded-2xl border border-line-strong bg-card p-5" aria-label="Saved code details">
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Code details</h2><Button variant="ghost" size="icon-sm" aria-label="Close details" onClick={onClose}><X className="size-4" /></Button></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div><Label htmlFor="code-title">Name</Label><Input id="code-title" value={draft.title} maxLength={200} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /><Label className="mt-4">Encoded content</Label><pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-card-2 p-3 text-[11px] leading-6">{draft.payload}</pre><p className="mt-2 text-xs text-muted">The content is fixed. You can rename this saved item and restyle its QR design.</p>{draft.kind === "qr" && <div className="mt-5"><DesignPanel design={draft.design} onChange={(design) => setDraft({ ...draft, design })} /></div>}<Button className="mt-5" disabled={!!busy || !draft.title.trim()} onClick={async () => { setBusy("save"); try { await onSave({ ...draft, title: draft.title.trim(), updatedAt: Date.now() }); toast.success("Changes saved in this browser."); } catch { toast.error("Could not save changes."); } finally { setBusy(""); } }}><Save className="size-4" /> Save changes</Button></div>
      <div><div className="rounded-xl bg-white p-3">{draft.kind === "qr" ? <QrPreview payload={draft.payload} design={draft.design} /> : <BarcodePreview code={draft} />}</div><div className="mt-3 flex flex-wrap gap-2">{(draft.kind === "qr" ? ["png", "svg", "pdf", "jpeg", "webp", "sheet"] : ["png", "svg", "pdf", "jpeg"]).map((f) => <Button key={f} variant="outline" size="sm" disabled={!!busy} onClick={() => exportCode(f)}>{busy === f ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}{f === "sheet" ? "Print sheet" : f.toUpperCase()}</Button>)}</div>{draft.kind === "qr" && draft.tracked && <DailyChart key={draft.tracked.countId} id={draft.tracked.countId} />}</div>
    </div>
  </section>;
}

export function CodeLibrary() {
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [refresh, setRefresh] = useState(0);
  const [limit, setLimit] = useState(24);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    let alive = true;
    listCodes().then((items) => { if (alive) setCodes(items); }).catch((e) => { if (alive) setError(e instanceof Error ? e.message : "Could not open local storage."); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const ids = useMemo(() => codes.flatMap((c) => c.kind === "qr" && c.tracked ? [c.tracked.countId] : []), [codes]);
  useEffect(() => {
    let alive = true;
    async function load() {
      const counts: Record<string, number> = {};
      for (let i = 0; i < ids.length; i += 60) {
        const chunk = ids.slice(i, i + 60);
        try { const data = await fetchStats(chunk); for (const id of chunk) counts[id] = data.totals[id] ?? 0; } catch { /* Show an em dash for unavailable counts. */ }
        if (!alive) return;
      }
      if (alive) setTotals(counts);
    }
    void load();
    return () => { alive = false; };
  }, [ids, refresh]);
  const shown = codes.filter((c) => (filter === "all" || (filter === "tracked" ? c.kind === "qr" && !!c.tracked : c.kind === filter)) && `${c.title} ${c.payload}`.toLowerCase().includes(query.toLowerCase()));
  const current = codes.find((c) => c.id === selected);
  async function update(code: SavedCode) { await saveCode(code); setCodes(await listCodes()); }
  async function backup() {
    try { downloadBlob(new Blob([JSON.stringify(await exportBackup(), null, 2)], { type: "application/json" }), "qrwright-backup.json"); }
    catch { toast.error("Could not create the backup."); }
  }
  async function restore(file?: File) {
    if (!file) return;
    if (file.size > 20_000_000) { toast.error("Backups must be under 20 MB."); return; }
    setImporting(true);
    try { const n = await importBackup(await file.text()); setCodes(await listCodes()); toast.success(`${n} codes imported. Existing codes kept.`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Import failed."); }
    finally { setImporting(false); }
  }
  return <div className="space-y-6">
    <div className="rounded-2xl border border-line bg-card p-4"><div className="flex flex-wrap gap-2"><Input aria-label="Search saved codes" placeholder="Search your codes…" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-40 flex-1" /><Select aria-label="Filter codes" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-auto"><option value="all">All codes</option><option value="qr">QR codes</option><option value="barcode">Barcodes</option><option value="tracked">Tracked</option></Select><Button variant="outline" onClick={backup} disabled={loading || !codes.length}><Download className="size-4" /> Backup</Button><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm"><Upload className="size-4" />{importing ? "Importing…" : "Import"}<input className="sr-only" type="file" accept=".json,application/json" disabled={importing} onChange={(e) => { void restore(e.target.files?.[0]); e.target.value = ""; }} /></label><Button variant="ghost" size="icon" aria-label="Refresh scan counts" onClick={() => setRefresh((n) => n + 1)}><RefreshCw className="size-4" /></Button></div><p className="mt-3 text-xs leading-relaxed text-muted">Saved only in this browser on this device. Clearing site data removes your library. Keep a backup; it contains your encoded content, including any Wi-Fi passwords.</p></div>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    {current && <CodeEditor key={current.id} code={current} onSave={update} onClose={() => setSelected(null)} />}
    {loading ? <p className="py-12 text-center text-sm text-muted">Opening your local library…</p> : !codes.length ? <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center"><h2 className="text-2xl font-semibold">Your collection starts here.</h2><p className="mb-6 mt-3 text-sm text-muted">Use Save in either studio to keep a code in this browser.</p><ButtonLink href="/qr-code-generator">Create your first code</ButtonLink></div> : <><p className="text-xs text-muted">{shown.length} saved codes</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shown.slice(0, limit).map((c) => <section key={c.id} className="rounded-2xl border border-line bg-card p-4"><button type="button" className="w-full text-left" onClick={() => { setSelected(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={`Open ${c.title}`}><div className="mx-auto max-w-40 rounded-lg bg-white p-1">{c.kind === "qr" ? <QrPreview payload={c.payload} design={c.design} /> : <BarcodePreview code={c} />}</div><h2 className="mt-3 truncate text-sm font-semibold">{c.title}</h2><p className="mt-1 text-xs text-muted">{c.kind === "qr" ? QR_TYPE_MAP[c.typeId]?.label ?? "QR code" : getBarcodeFormat(c.format)?.label} · {c.kind === "qr" && c.tracked ? `${totals[c.tracked.countId] === undefined ? "—" : formatCount(totals[c.tracked.countId])} scans` : "Direct"}</p></button><div className="mt-3 flex items-center gap-2 border-t border-line pt-3"><Button size="sm" variant="soft" onClick={() => setSelected(c.id)}>Details & export</Button><Button size="icon-sm" variant="ghost" aria-label={`Duplicate ${c.title}`} onClick={async () => { try { await update({ ...c, id: newId(), title: `${c.title.slice(0, 190)} (copy)`, createdAt: Date.now(), updatedAt: Date.now() }); toast.success("Local copy created. A tracked copy shares its original counter."); } catch { toast.error("Could not duplicate."); } }}><Copy className="size-3.5" /></Button><Button size="icon-sm" variant="ghost" aria-label={`Delete ${c.title}`} className="ml-auto text-danger" onClick={async () => { try { await deleteCode(c.id); setCodes((items) => items.filter((item) => item.id !== c.id)); if (selected === c.id) setSelected(null); toast("Removed from this browser.", { action: { label: "Undo", onClick: () => { void update(c).catch(() => toast.error("Could not restore.")); } } }); } catch { toast.error("Could not delete."); } }}><Trash2 className="size-3.5" /></Button></div></section>)}</div>{shown.length > limit && <Button variant="outline" onClick={() => setLimit((n) => n + 24)}>Show more</Button>}</>}
  </div>;
}
