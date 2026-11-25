import { isbot } from "isbot";

/** Best-effort client IP. Used only in memory for rate limiting and de-duplication; never stored. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const PREFETCH_HINTS = ["prefetch", "prerender", "preview"];

/**
 * A scan counts only when it looks like a person opening the link: a GET
 * request from a non-bot user agent that is not a prefetch or link preview
 * (WhatsApp, iMessage, Slack and similar unfurlers identify as bots).
 */
export function isCountableScan(req: Request): boolean {
  if (req.method !== "GET") return false;
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || ua.length < 10 || isbot(ua)) return false;
  for (const h of ["sec-purpose", "purpose", "x-purpose", "x-moz"]) {
    const v = req.headers.get(h)?.toLowerCase();
    if (v && PREFETCH_HINTS.some((p) => v.includes(p))) return false;
  }
  return true;
}

export type Platform = "ios" | "android" | "other";

export function platformOf(ua: string): Platform {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

/**
 * Fixed-window counters held in memory. Serverless instances do not share
 * memory, so this is a speed bump against abuse, not a hard guarantee.
 */
export class MemoryLimiter {
  private hits = new Map<string, { n: number; reset: number }>();
  constructor(
    private limit: number,
    private windowMs: number,
  ) {}

  /** Returns true if the request is allowed. */
  take(key: string, now = Date.now()): boolean {
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) if (v.reset <= now) this.hits.delete(k);
    }
    const entry = this.hits.get(key);
    if (!entry || entry.reset <= now) {
      this.hits.set(key, { n: 1, reset: now + this.windowMs });
      return true;
    }
    entry.n++;
    return entry.n <= this.limit;
  }
}
