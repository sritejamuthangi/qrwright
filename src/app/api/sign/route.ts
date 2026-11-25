import { z } from "zod";
import { NONCE_BYTES, signToken } from "@/lib/tracking/token";
import { checkDestination } from "@/lib/tracking/url-safety";
import { activeKeyId, getKey, trackingEnabled } from "@/lib/server/keys";
import { MemoryLimiter, clientIp } from "@/lib/server/request";
import { isFlaggedUrl } from "@/lib/server/safe-browsing";
import { site } from "@/lib/site";


const limiter = new MemoryLimiter(40, 60 * 60 * 1000);

const UrlTarget = z.object({ kind: z.literal("url"), url: z.string().min(1).max(1000) });
const AppTarget = z.object({
  kind: z.literal("app"),
  ios: z.string().max(500),
  android: z.string().max(500),
  fallback: z.string().max(500),
});
const Body = z.object({ target: z.discriminatedUnion("kind", [UrlTarget, AppTarget]) });

const json = (status: number, body: unknown) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });

export async function POST(req: Request) {
  if (!trackingEnabled()) {
    return json(503, { ok: false, error: "Scan tracking is not configured on this deployment. Use a Direct QR code instead." });
  }
  if (!limiter.take(clientIp(req))) {
    return json(429, { ok: false, error: "Too many tracked links from this connection. Try again later." });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  const target = parsed.target;
  const hosts = [new URL(site.linkBase).hostname];

  if (target.kind === "url") {
    const check = checkDestination(target.url, hosts);
    if (!check.ok) return json(400, { ok: false, error: check.reason });
    if (await isFlaggedUrl([target.url])) {
      return json(400, { ok: false, error: "That link was flagged as unsafe by Google Safe Browsing." });
    }
  } else {
    const urls = [target.ios, target.android, target.fallback].filter(Boolean);
    if (urls.length === 0) return json(400, { ok: false, error: "Add at least one app link." });
    for (const url of urls) {
      const check = checkDestination(url, hosts);
      if (!check.ok) return json(400, { ok: false, error: check.reason });
    }
    if (await isFlaggedUrl(urls)) {
      return json(400, { ok: false, error: "One of those links was flagged as unsafe by Google Safe Browsing." });
    }
  }

  const keyId = activeKeyId();
  const key = keyId === null ? null : getKey(keyId);
  if (!key || keyId === null) return json(503, { ok: false, error: "Scan tracking is not available right now." });

  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_BYTES));
  const { token, countId } = await signToken(target, await key, keyId, nonce);
  if (token.length > 2000) return json(400, { ok: false, error: "Those destinations are too long for a tracked code. Shorten the links or use Direct mode." });

  return json(200, { ok: true, url: `${site.linkBase}/r/${token}`, countId });
}
