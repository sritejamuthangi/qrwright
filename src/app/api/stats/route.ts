import { connection } from "next/server";
import { daysAgo, getCountStore, today } from "@/lib/server/counts";
import { COUNT_ID_RE } from "@/lib/tracking/token";


const IDS = /^[A-Z2-7]{10}$/;

const json = (status: number, body: unknown) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });

export async function GET(req: Request) {
  await connection();
  const url = new URL(req.url);
  const store = getCountStore();
  if (!store) return json(503, { error: "Scan counting is not configured on this deployment." });

  const id = url.searchParams.get("id");
  if (id) {
    if (!COUNT_ID_RE.test(id)) return json(400, { error: "Invalid count ID." });
    const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? 30) || 30));
    try {
      const [totals, daily] = await Promise.all([store.totals([id]), store.daily(id, daysAgo(days - 1))]);
      const map = new Map(daily.map((d) => [d.day, d.n]));
      const filled: { day: string; n: number }[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const day = daysAgo(i);
        filled.push({ day, n: map.get(day) ?? 0 });
      }
      return json(200, { total: totals[id] ?? 0, daily: filled, today: today() });
    } catch {
      return json(503, { error: "Scan counts are temporarily unavailable." });
    }
  }

  const ids = (url.searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length > 60) return json(400, { error: "Too many IDs." });
  if (ids.some((s) => !IDS.test(s))) return json(400, { error: "Invalid count ID." });

  try {
    const [totals, global] = await Promise.all([store.totals(ids), store.global()]);
    return json(200, { totals, global });
  } catch {
    return json(503, { error: "Scan counts are temporarily unavailable." });
  }
}
