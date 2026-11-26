import { describe, expect, it } from "vitest";
import { base32Decode, base32Encode } from "@/lib/encoding";
import { countIdFromLink, importSecret, parseToken, signToken, unpackTarget, verifyToken } from "@/lib/tracking/token";
import { checkDestination } from "@/lib/tracking/url-safety";
import { isCountableScan, MemoryLimiter, platformOf } from "@/lib/server/request";
import { formatCount } from "@/lib/tracking/client";
import type { TrackTarget } from "@/lib/payload/qr-types";

const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";
describe("signed self-contained links", () => {
  const targets: TrackTarget[] = [
    ...["https://example.com/path?a=1#part", "http://www.example.com", "https://www.example.com/नमस्ते"].map((url) => ({ kind: "url" as const, url })),
    { kind: "app", ios: "https://apps.apple.com/app/id123", android: "https://play.google.com/store/apps/details?id=123", fallback: "https://example.com" },
  ];
  it.each(targets)("round-trips $kind with a rotated key", async (target) => {
    const key = await importSecret("test-secret-at-least-thirty-two-bytes");
    const link = await signToken(target, key, 3, new Uint8Array([1, 2, 3, 4, 5, 6]));
    const parsed = parseToken(link.token)!;
    expect(parsed.keyId).toBe(3);
    expect(await verifyToken(parsed, key)).toBe(true);
    expect(unpackTarget(parsed.kind, parsed.body)).toEqual(target);
    expect(countIdFromLink(`https://example.com/r/${link.token}`)).toBe(link.countId);
  });
  it("rejects changed body, nonce, signature, unknown version and wrong secret", async () => {
    const key = await importSecret("correct-key");
    const { token } = await signToken({ kind: "url", url: "https://example.com" }, key, 0, new Uint8Array(6));
    for (const index of [1, 8, base32Decode(token)!.length - 1]) {
      const bytes = base32Decode(token)!; bytes[index] ^= 1;
      expect(await verifyToken(parseToken(base32Encode(bytes))!, key)).toBe(false);
    }
    expect(await verifyToken(parseToken(token)!, await importSecret("wrong-key"))).toBe(false);
    const bytes = base32Decode(token)!; bytes[0] |= 0xc0;
    expect(parseToken(base32Encode(bytes))).toBeNull();
    expect(parseToken("malformed!" )).toBeNull();
  });
  it.each(["javascript:alert(1)", "http://localhost", "http://127.0.0.1", "http://2130706433", "http://10.1.2.3", "http://192.168.1.1", "http://[::1]", "http://office.local", "https://user:password@example.com", "https://qrwright.sritejam.com/r/TOKEN"])("rejects unsafe target %s", (url) => {
    expect(checkDestination(url, ["qrwright.sritejam.com"]).ok).toBe(false);
  });
  it("allows public HTTPS and preserves fragments", () => { expect(checkDestination("https://example.com/page#section")).toEqual({ ok: true, url: "https://example.com/page#section" }); });
});
describe("count quality", () => {
  it("excludes bots, HEAD and prefetch but accepts a normal camera open", () => {
    expect(isCountableScan(new Request("https://example.com", { headers: { "user-agent": ua } }))).toBe(true);
    const excluded: Record<string, string>[] = [{ "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" }, { "user-agent": ua, "sec-purpose": "prefetch;prerender" }, {}];
    for (const headers of excluded) {
      expect(isCountableScan(new Request("https://example.com", { headers }))).toBe(false);
    }
    expect(isCountableScan(new Request("https://example.com", { method: "HEAD", headers: { "user-agent": ua } }))).toBe(false);
    expect(platformOf(ua)).toBe("ios");
  });
  it("resets rate limits after the window", () => {
    const limiter = new MemoryLimiter(2, 1000);
    expect(limiter.take("a", 0)).toBe(true); expect(limiter.take("a", 1)).toBe(true); expect(limiter.take("a", 2)).toBe(false);
    expect(limiter.take("b", 2)).toBe(true); expect(limiter.take("a", 1000)).toBe(true);
  });
  it("formats real totals using K/M/B/T", () => {
    expect([0, 999, 1200, 1_200_000, 1_200_000_000, 1_200_000_000_000].map(formatCount)).toEqual(["0", "999", "1.2K", "1.2M", "1.2B", "1.2T"]);
  });
});
