"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Download,
  Globe,
  Mail,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import { decodePageData, type PageData } from "@/lib/payload/page-data";
import { site } from "@/lib/site";

function safeAccent(c?: string) {
  return c && /^#[0-9a-f]{6}$/i.test(c) ? c : "#0d0d0e";
}

function vcardFor(d: PageData): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${esc(d.n ?? "")}`, `ORG:${esc(d.n ?? "")}`];
  if (d.ph) lines.push(`TEL;TYPE=CELL:${d.ph}`);
  if (d.em) lines.push(`EMAIL:${d.em}`);
  if (d.w) lines.push(`URL:${d.w}`);
  if (d.ad) lines.push(`ADR;TYPE=WORK:;;${esc(d.ad)}`);
  if (d.d) lines.push(`NOTE:${esc(d.d)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

function downloadContact(d: PageData) {
  const blob = new Blob([vcardFor(d)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(d.n ?? "contact").replace(/[^\w-]+/g, "-")}.vcf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function Shell({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center px-4 py-8 sm:py-14">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-xl">
          <div className="h-2" style={{ background: accent }} />
          <div className="p-6 sm:p-8">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-subtle">
          Shared with a{" "}
          <Link href={site.url} className="underline underline-offset-2 hover:text-ink">
            {site.name}
          </Link>{" "}
          QR code. This page is not stored on a server.
        </p>
      </div>
    </div>
  );
}

const buttonStyle = (accent: string) => ({
  background: accent,
  color: "#fff",
});

export function PageView() {
  const [data, setData] = useState<PageData | null | undefined>(undefined);

  useEffect(() => {
    const read = () => setData(decodePageData(window.location.hash));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const accent = safeAccent(data?.c);

  useEffect(() => {
    if (!data || data.k !== "a") return;
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(ua);
    const android = /Android/i.test(ua);
    const target = ios ? data.i : android ? data.a : data.w || data.i || data.a;
    if (!target) return;
    const t = setTimeout(() => window.location.replace(target), 900);
    return () => clearTimeout(t);
  }, [data]);

  const mapUrl = useMemo(() => {
    if (!data?.ad) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.ad)}`;
  }, [data]);

  if (data === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">Loading page…</div>
    );
  }

  if (data === null) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">This page link isn&apos;t valid</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The QR code may be damaged or was copied incompletely. Ask whoever shared it for a new code.
        </p>
        <Link href="/qr-code-generator" className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
          Make a free QR code
        </Link>
      </div>
    );
  }

  if (data.k === "l") {
    return (
      <Shell accent={accent}>
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-card-2">
            <Store className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{data.n || "My links"}</h1>
          {data.d && <p className="mt-2 text-sm leading-relaxed text-muted">{data.d}</p>}
        </div>
        <div className="mt-7 space-y-2.5">
          {(data.l ?? []).map(([label, url]) => (
            <a
              key={url}
              href={url}
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={buttonStyle(accent)}
            >
              <span className="truncate">{label}</span>
              <ArrowRight className="size-4 shrink-0" />
            </a>
          ))}
        </div>
      </Shell>
    );
  }

  if (data.k === "a") {
    return (
      <Shell accent={accent}>
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-card-2">
            <Download className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Get the app</h1>
          <p className="mt-2 text-sm text-muted">Opening the right store for this device…</p>
        </div>
        <div className="mt-7 space-y-2.5">
          {data.i && (
            <a href={data.i} className="block rounded-xl px-4 py-3.5 text-center text-sm font-medium" style={buttonStyle(accent)}>
              Download on the App Store
            </a>
          )}
          {data.a && (
            <a href={data.a} className="block rounded-xl border border-line px-4 py-3.5 text-center text-sm font-medium">
              Get it on Google Play
            </a>
          )}
          {data.w && (
            <a href={data.w} className="block rounded-xl border border-line px-4 py-3.5 text-center text-sm font-medium">
              Visit the website
            </a>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <Shell accent={accent}>
      <div className="text-center">
        <div
          className="mx-auto grid size-16 place-items-center rounded-2xl text-xl font-semibold text-white"
          style={{ background: accent }}
        >
          {(data.n ?? "?").slice(0, 1).toUpperCase()}
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{data.n}</h1>
        {data.t && <p className="mt-1.5 text-sm text-muted">{data.t}</p>}
        {data.d && <p className="mt-4 text-sm leading-relaxed text-muted">{data.d}</p>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {data.ph && (
          <a href={`tel:${data.ph}`} className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium" style={buttonStyle(accent)}>
            <Phone className="size-4" /> Call
          </a>
        )}
        {data.em && (
          <a href={`mailto:${data.em}`} className="flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-3 text-sm font-medium">
            <Mail className="size-4" /> Email
          </a>
        )}
        {mapUrl && (
          <a href={mapUrl} rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-3 text-sm font-medium">
            <MapPin className="size-4" /> Directions
          </a>
        )}
        {data.w && (
          <a href={data.w} rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-3 text-sm font-medium">
            <Globe className="size-4" /> Website
          </a>
        )}
        <button
          type="button"
          onClick={() => downloadContact(data)}
          className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-3 text-sm font-medium"
        >
          <Download className="size-4" /> Save contact
        </button>
      </div>

      {(data.ad || data.h) && (
        <div className="mt-6 space-y-3 rounded-2xl bg-card-2 p-4 text-sm">
          {data.ad && (
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" />
              <span>{data.ad}</span>
            </p>
          )}
          {data.h && (
            <p className="flex gap-2.5">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted" />
              <span className="whitespace-pre-line">{data.h}</span>
            </p>
          )}
        </div>
      )}

      {data.l && data.l.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.l.map(([label, url]) => (
            <a
              key={url}
              href={url}
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-medium hover:bg-card-2"
            >
              {label}
              <ArrowRight className="size-4" />
            </a>
          ))}
        </div>
      )}
    </Shell>
  );
}
