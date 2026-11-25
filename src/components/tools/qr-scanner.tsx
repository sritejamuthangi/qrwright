"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Copy, Square, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { safeHttpUrl } from "@/lib/payload/page-data";

export function QrScanner() {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef(0);
  const session = useRef(0);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function stop() {
    session.current++;
    cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setActive(false); setBusy(false);
  }
  useEffect(() => {
    const sessionRef = session;
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => { sessionRef.current++; cancelAnimationFrame(frame.current); stream.current?.getTracks().forEach((t) => t.stop()); document.removeEventListener("visibilitychange", hide); };
  }, []);
  async function start() {
    stop(); setBusy(true); setError(""); setResult("");
    const current = session.current;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera scanning needs HTTPS and a browser with camera access. You can also open an image.");
      const jsQR = (await import("jsqr")).default;
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } }, audio: false });
      if (session.current !== current) { media.getTracks().forEach((t) => t.stop()); return; }
      stream.current = media;
      const element = video.current;
      if (!element) { stop(); return; }
      element.srcObject = media;
      await element.play();
      if (session.current !== current) return;
      setActive(true); setBusy(false);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas is unavailable in this browser.");
      let previous = 0;
      const tick = (time: number) => {
        if (session.current !== current) return;
        if (time - previous > 180 && element.videoWidth) {
          previous = time;
          canvas.width = Math.min(960, element.videoWidth);
          canvas.height = Math.round(canvas.width * element.videoHeight / element.videoWidth);
          ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
          if (code?.data) { setResult(code.data); stop(); return; }
        }
        frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    } catch (e) {
      if (session.current !== current) return;
      stop(); setError(e instanceof Error ? e.message : "Could not start the camera.");
    }
  }
  async function readImage(file?: File) {
    if (!file) return;
    stop(); setResult(""); setError("");
    if (file.size > 20_000_000) { setError("Choose an image smaller than 20 MB."); return; }
    setBusy(true);
    const current = session.current;
    const url = URL.createObjectURL(file);
    try {
      const jsQR = (await import("jsqr")).default;
      const image = new Image();
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Could not open that image. Try PNG, JPEG or WebP.")); image.src = url; });
      const canvas = document.createElement("canvas");
      const ratio = Math.min(1, 2048 / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * ratio)); canvas.height = Math.max(1, Math.round(image.height * ratio));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable.");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
      if (current !== session.current) return;
      if (!code?.data) throw new Error("No readable QR code found. Try a closer crop or a sharper image with the full border visible.");
      setResult(code.data);
    } catch (e) { if (current === session.current) setError(e instanceof Error ? e.message : "Could not scan that file."); }
    finally { URL.revokeObjectURL(url); if (current === session.current) setBusy(false); }
  }
  const link = safeHttpUrl(result);
  return <div className="grid gap-6 md:grid-cols-2">
    <section className="rounded-2xl border border-line bg-card p-5"><div className="relative overflow-hidden rounded-xl bg-[#0d0d0e]"><video ref={video} muted playsInline className="aspect-square w-full object-cover" aria-label="Camera preview" />{!active && <div className="absolute inset-0 grid place-items-center text-sm text-white/60">{busy ? "Opening…" : "Camera is off"}</div>}</div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={active || busy ? stop : start}>{active || busy ? <Square className="size-4" /> : <Camera className="size-4" />}{active || busy ? "Stop" : "Start camera"}</Button><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm"><Upload className="size-4" /> Open image<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => { void readImage(e.target.files?.[0]); e.target.value = ""; }} /></label></div><p className="mt-3 text-xs leading-relaxed text-muted">Point at one QR code with its whole border visible. Camera frames and images stay on this device.</p></section>
    <section className="h-fit rounded-2xl border border-line bg-card p-5"><h2 className="text-lg font-semibold">Decoded content</h2>{error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}{result ? <><pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-card-2 p-4 text-xs leading-6">{result}</pre><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(result); toast.success("Copied."); } catch { toast.error("Select the text and copy it manually."); } }}><Copy className="size-4" /> Copy</Button>{link && <a href={link} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-4 py-2 text-sm text-paper">Open link ↗</a>}</div><p className="mt-3 text-xs text-muted">Check the destination before opening it. Scanning never opens a link automatically.</p></> : <p className="mt-3 text-sm leading-relaxed text-muted">Start your camera or open an image to read a QR code. This tool reads QR codes; other barcode formats need a compatible reader.</p>}</section>
  </div>;
}
