import { after, connection, type NextRequest } from "next/server";
import { daysAgo, getCountStore, today } from "@/lib/server/counts";
import { getKey } from "@/lib/server/keys";
import { clientIp, isCountableScan, platformOf } from "@/lib/server/request";
import { site } from "@/lib/site";
import { parseToken, unpackTarget, verifyToken } from "@/lib/tracking/token";

/**
 * Tracked-code redirect. Verifies the signed token, redirects immediately and
 * counts the scan after the response is sent, so counting can never slow down
 * or break a scan.
 */

const NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
};

// Short-lived, in-memory de-duplication of double opens (some phones request a
// link twice in quick succession). Keys are hashes; nothing is persisted.
const recent = new Map<string, number>();
const DEDUPE_MS = 10_000;

async function isDuplicate(req: NextRequest, countId: string): Promise<boolean> {
  const now = Date.now();
  if (recent.size > 10_000) for (const [k, t] of recent) if (now - t > DEDUPE_MS) recent.delete(k);
  const data = new TextEncoder().encode(`${clientIp(req)}|${req.headers.get("user-agent")}|${countId}`);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)).slice(0, 12)).join(".");
  const seen = recent.get(hash);
  recent.set(hash, now);
  return seen !== undefined && now - seen < DEDUPE_MS;
}

function page(status: number, title: string, message: string) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} · ${site.name}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f4ee;color:#0d0d0e;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}main{max-width:420px}h1{font-size:1.4rem;margin:0 0 .5rem}p{color:#57544d;line-height:1.6}a{color:#0d0d0e}</style></head><body><main><h1>${title}</h1><p>${message}</p><p><a href="${site.url}">Make a free QR code with ${site.name}</a></p></main></body></html>`;
  return new Response(html, { status, headers: { ...NO_STORE, "Content-Type": "text/html; charset=utf-8" } });
}

const INVALID = () =>
  page(404, "This QR code link isn't valid", "The code may be damaged, or it was copied incorrectly. Ask whoever shared it for a new one.");

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  await connection();
  const { token } = await ctx.params;

  const parsed = parseToken(token);
  if (!parsed) return INVALID();
  const key = getKey(parsed.keyId);
  if (!key || !(await verifyToken(parsed, await key))) return INVALID();

  const blocked = (process.env.BLOCKED_COUNT_IDS ?? "").split(",").map((s) => s.trim());
  if (blocked.includes(parsed.countId)) {
    return page(410, "This link has been disabled", "It was reported for abuse and is no longer available.");
  }

  const target = unpackTarget(parsed.kind, parsed.body);
  if (!target) return INVALID();

  let destination: string;
  if (target.kind === "app") {
    const p = platformOf(req.headers.get("user-agent") ?? "");
    destination =
      (p === "ios" && target.ios) ||
      (p === "android" && target.android) ||
      target.fallback ||
      target.ios ||
      target.android;
  } else {
    destination = target.url;
  }
  if (!/^https?:\/\//i.test(destination)) return INVALID();

  if (isCountableScan(req)) {
    after(async () => {
      try {
        const store = getCountStore();
        if (!store || await isDuplicate(req, parsed.countId)) return;
        const day = today();
        await store.increment(parsed.countId, day);
        // Occasionally prune old daily rows, in addition to the daily cron.
        if (Math.random() < 0.001) await store.prune(daysAgo(90));
      } catch {
        // Keep request details and destinations out of application logs.
        console.error("Scan count unavailable.");
      }
    });
  }

  return new Response(null, {
    status: 302,
    headers: { ...NO_STORE, Location: destination, "Referrer-Policy": "no-referrer" },
  });
}
