import { deflateSync, inflateSync } from "fflate";
import { base64UrlDecode, base64UrlEncode, utf8Decode, utf8Encode } from "@/lib/encoding";

/**
 * Data for hosted mini pages (business page, links page, smart app link).
 *
 * The data travels inside the QR link after the `#`, e.g.
 * `https://qrcode.sritejam.com/p#z<base64url>`. Browsers never send the
 * fragment to the server, so the page is rendered entirely on the scanner's
 * phone and nothing is stored anywhere.
 */
export interface PageData {
  v: 1;
  /** b = business page, l = links page, a = smart app link */
  k: "b" | "l" | "a";
  /** Name / title */
  n?: string;
  /** Tagline */
  t?: string;
  /** About / description */
  d?: string;
  ph?: string;
  em?: string;
  /** Website */
  w?: string;
  /** Address */
  ad?: string;
  /** Opening hours */
  h?: string;
  /** Accent colour */
  c?: string;
  /** Links: [label, url] */
  l?: [string, string][];
  /** App Store URL */
  i?: string;
  /** Google Play URL */
  a?: string;
}

/** Encodes page data as `z` + base64url(deflate(json)), or `j` + base64url(json) if that is shorter. */
export function encodePageData(data: PageData): string {
  const raw = utf8Encode(JSON.stringify(data));
  const packed = deflateSync(raw, { level: 9 });
  return packed.length < raw.length ? `z${base64UrlEncode(packed)}` : `j${base64UrlEncode(raw)}`;
}

const MAX = { short: 120, long: 600, url: 600 };
const HEX = /^#[0-9a-f]{6}$/i;

const str = (v: unknown, max: number) => (typeof v === "string" && v.length <= max ? v : undefined);

/** Accepts only http(s) URLs. Everything rendered from page data is untrusted input. */
export function safeHttpUrl(v: unknown): string | undefined {
  if (typeof v !== "string" || v.length > MAX.url) return undefined;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}

/** Decodes and validates page data from a URL fragment (with or without the leading `#`). */
export function decodePageData(fragment: string): PageData | null {
  const s = fragment.replace(/^#/, "");
  if (s.length < 2 || s.length > 6000) return null;
  const bytes = base64UrlDecode(s.slice(1));
  if (!bytes) return null;
  let parsed: unknown;
  try {
    const json = s[0] === "z" ? utf8Decode(inflateSync(bytes)) : s[0] === "j" ? utf8Decode(bytes) : null;
    if (json === null) return null;
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  if (o.v !== 1 || (o.k !== "b" && o.k !== "l" && o.k !== "a")) return null;

  const links = Array.isArray(o.l)
    ? o.l
        .slice(0, 12)
        .map((pair) =>
          Array.isArray(pair) ? ([str(pair[0], MAX.short), safeHttpUrl(pair[1])] as const) : null,
        )
        .filter((p): p is readonly [string, string] => !!p && !!p[0] && !!p[1])
        .map(([label, url]) => [label, url] as [string, string])
    : undefined;

  return {
    v: 1,
    k: o.k,
    n: str(o.n, MAX.short),
    t: str(o.t, MAX.short),
    d: str(o.d, MAX.long),
    ph: str(o.ph, 40),
    em: str(o.em, 120),
    w: safeHttpUrl(o.w),
    ad: str(o.ad, 240),
    h: str(o.h, 400),
    c: typeof o.c === "string" && HEX.test(o.c) ? o.c : undefined,
    l: links,
    i: safeHttpUrl(o.i),
    a: safeHttpUrl(o.a),
  };
}

export function pageUrl(base: string, data: PageData): string {
  return `${base}/p#${encodePageData(data)}`;
}
