"use client";

import { useEffect, useState } from "react";
import { fetchStats, formatCount } from "@/lib/tracking/client";

export function GlobalScans() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    fetchStats([]).then((s) => { if (alive) setCount(s.global); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
      <span className="size-2 rounded-full bg-success" />
      <div className="text-xs text-muted">
        {count === null ? "Scan counts currently unavailable" : <><strong className="font-mono text-base text-ink" title={count.toLocaleString("en-US")}>{formatCount(count)}</strong> real tracked scans</>}
        <span className="mt-0.5 block text-[10px] text-subtle">Anonymous totals. Bots filtered. No seeded numbers.</span>
      </div>
    </div>
  );
}
