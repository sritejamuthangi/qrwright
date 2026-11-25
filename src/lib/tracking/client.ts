import type { TrackTarget } from "@/lib/payload/qr-types";

export interface TrackedLink {
  url: string;
  countId: string;
}

export async function createTrackedLink(target: TrackTarget): Promise<TrackedLink> {
  const res = await fetch("/api/sign", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ target }),
  });
  const data = (await res.json().catch(() => null)) as
    | { ok: true; url: string; countId: string }
    | { ok: false; error: string }
    | null;
  if (!res.ok || !data || !data.ok) {
    throw new Error(data && !data.ok ? data.error : "Could not create the tracked link. Try again.");
  }
  return { url: data.url, countId: data.countId };
}

export interface Stats {
  totals: Record<string, number>;
  global: number;
}

export async function fetchStats(ids: string[]): Promise<Stats> {
  const params = new URLSearchParams();
  if (ids.length) params.set("ids", ids.join(","));
  const res = await fetch(`/api/stats?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load scan counts.");
  const data = (await res.json()) as Stats;
  return { totals: data.totals ?? {}, global: data.global ?? 0 };
}

export interface DailyStats {
  total: number;
  daily: { day: string; n: number }[];
}

export async function fetchDaily(id: string, days = 30): Promise<DailyStats> {
  const res = await fetch(`/api/stats?id=${encodeURIComponent(id)}&days=${days}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load scan counts.");
  return (await res.json()) as DailyStats;
}

/** 1234 -> 1.2K, 1234567 -> 1.2M. Used for every public counter. */
export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(Math.floor(n));
  const units = ["K", "M", "B", "T"];
  let value = n;
  let unit = -1;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
  }
  let digits = value >= 100 ? 0 : 1;
  if (Number(value.toFixed(digits)) >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
    digits = 1;
  }
  return `${value.toFixed(digits).replace(/\.0$/, "")}${units[unit]}`;
}
