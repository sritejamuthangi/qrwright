import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { importSecret, signToken } from "@/lib/tracking/token";

const state = vi.hoisted(() => ({ after: [] as (() => Promise<void>)[], getStore: vi.fn() }));
vi.mock("next/server", () => ({ connection: async () => {}, after: (fn: () => Promise<void>) => state.after.push(fn) }));
vi.mock("@/lib/server/counts", () => ({ getCountStore: state.getStore, today: () => "2026-11-25", daysAgo: () => "2026-08-27" }));
vi.mock("@/lib/server/keys", async () => { const { importSecret } = await import("@/lib/tracking/token"); return { getKey: () => importSecret("redirect-test-secret") }; });
import { GET } from "@/app/r/[token]/route";

const ua = "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36";
async function request() {
  const { token } = await signToken({ kind: "url", url: "https://example.com/menu" }, await importSecret("redirect-test-secret"), 0, crypto.getRandomValues(new Uint8Array(6)));
  return GET(new Request(`https://qrwright.sritejam.com/r/${token}`, { headers: { "user-agent": ua } }) as NextRequest, { params: Promise.resolve({ token }) });
}
describe("redirect availability", () => {
  beforeEach(() => { state.after.length = 0; state.getStore.mockReset(); });
  it("sends the redirect before touching count storage", async () => {
    const increment = vi.fn().mockResolvedValue(undefined);
    state.getStore.mockReturnValue({ increment, prune: vi.fn() });
    const response = await request();
    expect(response.status).toBe(302); expect(response.headers.get("location")).toBe("https://example.com/menu");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(state.getStore).not.toHaveBeenCalled();
    await state.after[0]();
    expect(increment).toHaveBeenCalledWith(expect.stringMatching(/^[A-Z2-7]{10}$/), "2026-11-25");
  });
  it("a failed database initialization cannot block a scan", async () => {
    state.getStore.mockImplementation(() => { throw new Error("Database down"); });
    const response = await request();
    expect(response.status).toBe(302);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(state.after[0]()).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith("Scan count unavailable.");
    log.mockRestore();
  });
  it("invalid signatures neither redirect nor count", async () => {
    const response = await GET(new Request("https://qrwright.sritejam.com/r/bad") as NextRequest, { params: Promise.resolve({ token: "bad" }) });
    expect(response.status).toBe(404); expect(state.after).toHaveLength(0);
  });
});
