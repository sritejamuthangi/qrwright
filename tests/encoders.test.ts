import { describe, expect, it } from "vitest";
import { QR_TYPES, QR_TYPE_MAP, icalDate, icalDateTime, toBaseUnits, type QrTypeId, type Values } from "@/lib/payload/qr-types";
import { decodePageData, encodePageData } from "@/lib/payload/page-data";
import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import { DEFAULT_DESIGN } from "@/lib/qr/types";
import { decodeSvg } from "./helpers/decode";

const samples: Record<QrTypeId, Values> = {
  url: { url: "example.com" }, vcard: { first: "Ada", last: "Lovelace", email: "ada@example.com" },
  pdf: { url: "https://example.com/manual.pdf" }, image: { url: "https://example.com/photo.jpg" },
  social: { instagram: "@ada", github: "ada" }, video: { url: "https://example.com/video" }, text: { text: "Hello, नमस्ते ☕" },
  business: { name: "Corner Café", phone: "+1 555 010 0199", website: "example.com" }, facebook: { page: "example" },
  wifi: { ssid: "Guest", password: "correct horse", hidden: true }, app: { ios: "https://apps.apple.com/app/id123", android: "https://play.google.com/store/apps/details?id=test", fallback: "https://example.com" },
  menu: { url: "https://example.com/menu" }, email: { to: "ada@example.com", subject: "Hello & welcome", body: "Line 1\nLine 2" },
  phone: { phone: "+44 20 7946 0958" }, sms: { phone: "+44 20 7946 0958", message: "Hello" }, whatsapp: { phone: "+91 98765 43210", message: "Hello & welcome" },
  event: { title: "Workshop", start: "2026-12-10T10:00", end: "2026-12-10T11:00" }, location: { mode: "coords", lat: "18.922", lng: "72.8347" },
  crypto: { coin: "ethereum", address: "0x0000000000000000000000000000000000000001", amount: "0.001" }, upi: { vpa: "cafe@bank", name: "Corner Café", amount: "99.50" },
};
const encode = (id: QrTypeId, values: Values) => QR_TYPE_MAP[id].encode({ ...QR_TYPE_MAP[id].defaults, ...values });
const payload = (id: QrTypeId, values: Values) => { const r = encode(id, values); if (!r.ok) throw new Error(r.error ?? "Empty input"); return r.payload; };

describe("content encoders", () => {
  it.each(QR_TYPES)("$id survives a real QR encode/decode", (type) => {
    const result = encode(type.id, samples[type.id]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { scene } = renderQr(result.payload, DEFAULT_DESIGN);
    expect(decodeSvg(sceneToSvg(scene), 800, scene.moduleSize)).toBe(result.payload);
    if (!type.trackable) expect(result.track).toBeNull();
  });
  it.each(QR_TYPES)("$id does not generate from empty defaults", (type) => { expect(type.encode(type.defaults).ok).toBe(false); });
  it("escapes Wi-Fi delimiters without stripping password spaces", () => {
    expect(payload("wifi", { ssid: 'Tea;"Room', password: " pass;word " })).toBe('WIFI:T:WPA;S:Tea\\;\\"Room;P: pass\\;word ;;');
    expect(payload("wifi", { ssid: "Open", security: "nopass" })).toBe("WIFI:T:nopass;S:Open;;");
    expect(encode("wifi", { ssid: "Guest", password: "short" }).ok).toBe(false);
  });
  it("escapes contact and event text rather than adding fields", () => {
    expect(payload("vcard", { first: "Ada;Test", note: "One\nTwo,Three" })).toContain("NOTE:One\\nTwo\\,Three");
    expect(payload("event", { title: "One\nSUMMARY:Injected", start: "2026-12-10T10:00" })).toContain("SUMMARY:One\\nSUMMARY:Injected");
  });
  it("validates real dates and uses exclusive ends for all-day events", () => {
    expect(icalDate("2026-02-30")).toBeNull();
    expect(icalDateTime("2026-12-10T25:00")).toBeNull();
    expect(icalDate("2028-02-29", 1)).toBe("20280301");
    expect(payload("event", { title: "Day", allDay: true, startDate: "2026-12-31" })).toContain("DTEND;VALUE=DATE:20270101");
    expect(encode("event", { title: "Day", start: "2026-12-10T11:00", end: "2026-12-10T10:00" }).ok).toBe(false);
  });
  it("keeps decimal payment amounts exact and rejects silent rounding", () => {
    expect(toBaseUnits("0.000000000000000001", 18)).toBe("1");
    expect(toBaseUnits("123456789.123456789123456789", 18)).toBe("123456789123456789123456789");
    expect(toBaseUnits("0.0000000000000000001", 18)).toBeNull();
    expect(encode("upi", { vpa: "bad", name: "Cafe" }).ok).toBe(false);
    expect(encode("upi", { vpa: "cafe@bank", name: "Cafe", amount: "1.001" }).ok).toBe(false);
  });
  it("keeps hosted pages in fragments and single-profile links direct", () => {
    const url = payload("business", samples.business);
    expect(new URL(url).pathname).toBe("/p");
    expect(new URL(url).search).toBe("");
    expect(decodePageData(new URL(url).hash)?.n).toBe("Corner Café");
    expect(payload("social", { instagram: "@ada" })).toBe("https://www.instagram.com/ada");
    const social = encode("social", samples.social);
    expect(social.ok && social.track).toBeNull();
  });
  it("rejects script URLs, invalid coordinates and email injection", () => {
    expect(encode("url", { url: "javascript:alert(1)" }).ok).toBe(false);
    expect(encode("location", { mode: "coords", lat: "91", lng: "10" }).ok).toBe(false);
    expect(payload("email", { to: "test?bcc=other@example.com" })).toBe("mailto:test%3Fbcc%3Dother@example.com");
  });
  it("validates untrusted mini-page content before rendering", () => {
    const decoded = decodePageData(encodePageData({ v: 1, k: "l", l: [["Bad", "javascript:alert(1)"], ["Good", "https://example.com"]] }));
    expect(decoded?.l).toEqual([["Good", "https://example.com/"]]);
    expect(decodePageData("#znot-valid!")).toBeNull();
  });
});
