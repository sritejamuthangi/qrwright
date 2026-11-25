import { connection } from "next/server";
import { getCountStore } from "@/lib/server/counts";
import { COUNT_ID_RE } from "@/lib/tracking/token";


/** Total scans for one tracked code. Counts are written by /r/[token], never here. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await ctx.params;
  if (!COUNT_ID_RE.test(id)) {
    return Response.json({ error: "Invalid count ID." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const store = getCountStore();
  if (!store) {
    return Response.json(
      { error: "Scan counting is not configured on this deployment." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const totals = await store.totals([id]);
    return Response.json(
      { id, total: totals[id] ?? 0 },
      { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
    );
  } catch {
    return Response.json(
      { error: "Scan counts are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
