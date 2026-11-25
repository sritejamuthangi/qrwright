import { connection } from "next/server";
import { daysAgo, getCountStore } from "@/lib/server/counts";


/**
 * Vercel Cron target (see vercel.json). Deletes per-day rows older than 90 days.
 * Totals are kept forever, because they are the number shown to the owner.
 */
export async function GET(req: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (!secret && process.env.NODE_ENV === "production") return Response.json({ error: "Cron authentication is not configured." }, { status: 503 });
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const store = getCountStore();
  if (!store) return Response.json({ ok: true, pruned: 0, note: "No count store configured." });
  try {
    const pruned = await store.prune(daysAgo(90));
    return Response.json({ ok: true, pruned });
  } catch {
    return Response.json({ error: "Prune failed." }, { status: 500 });
  }
}
