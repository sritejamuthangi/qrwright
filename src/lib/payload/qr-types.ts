import { site } from "@/lib/site";
import { pageUrl, type PageData } from "./page-data";

/**
 * Registry of QR content types: their form fields and how form values are
 * encoded into the text stored in the QR code. Encoders are pure functions
 * and are covered by tests/encoders.test.ts.
 */

export const QR_TYPE_IDS = [
  "url",
  "vcard",
  "pdf",
  "image",
  "social",
  "video",
  "text",
  "business",
  "facebook",
  "wifi",
  "app",
  "menu",
  "email",
  "phone",
  "sms",
  "whatsapp",
  "event",
  "location",
  "crypto",
  "upi",
] as const;
export type QrTypeId = (typeof QR_TYPE_IDS)[number];

export type Values = Record<string, string | boolean>;

export type TrackTarget =
  | { kind: "url"; url: string }
  | { kind: "app"; ios: string; android: string; fallback: string };

export type EncodeResult =
  | { ok: true; payload: string; track: TrackTarget | null; warning?: string }
  | { ok: false; error: string | null };

export type FieldKind =
  | "text"
  | "url"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "checkbox"
  | "number"
  | "datetime-local"
  | "date"
  | "password"
  | "color";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  maxLength?: number;
  /** Render at half width on larger screens. */
  half?: boolean;
  autoComplete?: string;
  showIf?: (v: Values) => boolean;
}

export interface QrTypeDef {
  id: QrTypeId;
  slug: string;
  label: string;
  /** One-line description for pickers and cards. */
  description: string;
  fields: FieldDef[];
  defaults: Values;
  /** Whether this type can ever be a tracked code. */
  trackable: boolean;
  encode(v: Values): EncodeResult;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const str = (v: Values, k: string) => (typeof v[k] === "string" ? (v[k] as string).trim() : "");
const raw = (v: Values, k: string) => (typeof v[k] === "string" ? (v[k] as string) : "");
const bool = (v: Values, k: string) => v[k] === true;

const EMPTY: EncodeResult = { ok: false, error: null };
const fail = (error: string): EncodeResult => ({ ok: false, error });
const ok = (payload: string, track: TrackTarget | null = null, warning?: string): EncodeResult => ({
  ok: true,
  payload,
  track,
  warning,
});

/**
 * Normalises a user-typed web address. Adds https:// when no scheme is given
 * and keeps the user's text as typed when it is already a clean URL.
 */
export function normalizeUrl(input: string): string | null {
  let s = input.trim();
  if (!s) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (!u.hostname.includes(".") && u.hostname !== "localhost") return null;
  // Keep the original text unless it needs escaping (spaces, non-ASCII).
  return /[\s\u0080-\uffff]/.test(s) ? u.href : s;
}

function urlResult(input: string, what = "web address"): EncodeResult {
  if (!input) return EMPTY;
  const url = normalizeUrl(input);
  if (!url) return fail(`Enter a valid ${what}, like example.com or https://example.com/page.`);
  return ok(url, { kind: "url", url });
}

/** Keeps digits and a leading plus, plus * and # for service codes. */
export function cleanPhone(input: string): string {
  const s = input.trim();
  const plus = s.startsWith("+") ? "+" : "";
  return plus + s.replace(/[^\d*#]/g, "");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Wi-Fi strings escape \ ; , : and " with a backslash. */
export const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

/** vCard 3.0 text escaping. */
export const vcardEscape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** iCalendar text escaping. */
export const icalEscape = vcardEscape;

/** "2026-05-04T18:30" -> "20260504T183000" */
export function icalDateTime(local: string): string | null {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(local);
  if (!m || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return null;
  const date = icalDate(m[1]);
  return date ? `${date}T${m[2]}${m[3]}${m[4] ?? "00"}` : null;
}

/** "2026-05-04" -> "20260504" */
export function icalDate(date: string, addDays = 0): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  const d = new Date(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== date) return null;
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** Converts a decimal amount to integer base units (e.g. ETH to wei) without floating point. */
export function toBaseUnits(amount: string, decimals: number): string | null {
  const m = /^(\d+)(?:\.(\d+))?$/.exec(amount.trim());
  if (!m) return null;
  if ((m[2]?.length ?? 0) > decimals) return null;
  const frac = (m[2] ?? "").slice(0, decimals).padEnd(decimals, "0");
  const joined = (m[1] + frac).replace(/^0+(?=\d)/, "");
  return joined;
}

const query = (params: [string, string][]) => {
  const parts = params.filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

const page = (data: Omit<PageData, "v">) => pageUrl(site.linkBase, { v: 1, ...data } as PageData);

// ---------------------------------------------------------------------------
// Social profiles
// ---------------------------------------------------------------------------

export const SOCIAL_NETWORKS = [
  { key: "instagram", label: "Instagram", url: (h: string) => `https://www.instagram.com/${h}` },
  { key: "x", label: "X", url: (h: string) => `https://x.com/${h}` },
  { key: "tiktok", label: "TikTok", url: (h: string) => `https://www.tiktok.com/@${h}` },
  { key: "youtube", label: "YouTube", url: (h: string) => `https://www.youtube.com/@${h}` },
  { key: "linkedin", label: "LinkedIn", url: (h: string) => `https://www.linkedin.com/in/${h}` },
  { key: "facebook", label: "Facebook", url: (h: string) => `https://www.facebook.com/${h}` },
  { key: "threads", label: "Threads", url: (h: string) => `https://www.threads.net/@${h}` },
  { key: "telegram", label: "Telegram", url: (h: string) => `https://t.me/${h}` },
  { key: "github", label: "GitHub", url: (h: string) => `https://github.com/${h}` },
] as const;

/** Accepts "@name", "name" or a full profile link. */
export function socialUrl(input: string, build: (handle: string) => string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s) || /\.[a-z]{2,}\//i.test(s)) return normalizeUrl(s);
  const handle = s.replace(/^@/, "");
  if (!/^[\w.\-]{1,100}$/.test(handle)) return null;
  return build(handle);
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const linkField = (label: string, placeholder: string, help?: string): FieldDef => ({
  name: "url",
  label,
  kind: "url",
  placeholder,
  help,
  required: true,
  maxLength: 1000,
  autoComplete: "url",
});

export const QR_TYPES: QrTypeDef[] = [
  {
    id: "url",
    slug: "url",
    label: "Website URL",
    description: "Open any web page.",
    fields: [linkField("Website address", "https://example.com")],
    defaults: { url: "" },
    trackable: true,
    encode: (v) => urlResult(str(v, "url")),
  },
  {
    id: "vcard",
    slug: "vcard",
    label: "vCard",
    description: "Save a contact in one scan.",
    fields: [
      { name: "first", label: "First name", kind: "text", half: true, autoComplete: "given-name", maxLength: 60 },
      { name: "last", label: "Last name", kind: "text", half: true, autoComplete: "family-name", maxLength: 60 },
      { name: "org", label: "Company", kind: "text", half: true, autoComplete: "organization", maxLength: 80 },
      { name: "title", label: "Job title", kind: "text", half: true, autoComplete: "organization-title", maxLength: 80 },
      { name: "mobile", label: "Mobile phone", kind: "tel", half: true, placeholder: "+1 555 010 0199", autoComplete: "tel", maxLength: 30 },
      { name: "work", label: "Work phone", kind: "tel", half: true, maxLength: 30 },
      { name: "email", label: "Email", kind: "email", half: true, autoComplete: "email", maxLength: 120 },
      { name: "website", label: "Website", kind: "url", half: true, placeholder: "example.com", maxLength: 200 },
      { name: "street", label: "Street", kind: "text", autoComplete: "street-address", maxLength: 120 },
      { name: "city", label: "City", kind: "text", half: true, autoComplete: "address-level2", maxLength: 60 },
      { name: "region", label: "State / region", kind: "text", half: true, autoComplete: "address-level1", maxLength: 60 },
      { name: "zip", label: "Postal code", kind: "text", half: true, autoComplete: "postal-code", maxLength: 20 },
      { name: "country", label: "Country", kind: "text", half: true, autoComplete: "country-name", maxLength: 60 },
      { name: "note", label: "Note", kind: "textarea", maxLength: 300 },
    ],
    defaults: {},
    trackable: false,
    encode: (v) => {
      const first = str(v, "first");
      const last = str(v, "last");
      const org = str(v, "org");
      const anything = ["first", "last", "org", "title", "mobile", "work", "email", "website", "street", "city", "note"].some(
        (k) => str(v, k),
      );
      if (!anything) return EMPTY;
      const full = [first, last].filter(Boolean).join(" ") || org;
      if (!full) return fail("Add a name or a company so the contact has a title.");
      const email = str(v, "email");
      if (email && !EMAIL_RE.test(email)) return fail("That email address doesn't look right.");
      const website = str(v, "website") ? normalizeUrl(str(v, "website")) : "";
      if (website === null) return fail("That website address doesn't look right.");

      const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${vcardEscape(last)};${vcardEscape(first)};;;`, `FN:${vcardEscape(full)}`];
      if (org) lines.push(`ORG:${vcardEscape(org)}`);
      if (str(v, "title")) lines.push(`TITLE:${vcardEscape(str(v, "title"))}`);
      if (str(v, "mobile")) lines.push(`TEL;TYPE=CELL:${cleanPhone(str(v, "mobile"))}`);
      if (str(v, "work")) lines.push(`TEL;TYPE=WORK,VOICE:${cleanPhone(str(v, "work"))}`);
      if (email) lines.push(`EMAIL:${email}`);
      if (website) lines.push(`URL:${website}`);
      const adr = ["street", "city", "region", "zip", "country"].map((k) => vcardEscape(str(v, k)));
      if (adr.some(Boolean)) lines.push(`ADR;TYPE=WORK:;;${adr.join(";")}`);
      if (str(v, "note")) lines.push(`NOTE:${vcardEscape(str(v, "note"))}`);
      lines.push("END:VCARD");
      return ok(lines.join("\r\n"));
    },
  },
  {
    id: "pdf",
    slug: "pdf",
    label: "PDF",
    description: "Link to a document or brochure.",
    fields: [
      linkField(
        "Link to your PDF",
        "https://drive.google.com/file/d/…",
        "Upload the file to Google Drive, Dropbox, OneDrive or your website, set it to “Anyone with the link can view”, and paste the link.",
      ),
    ],
    defaults: { url: "" },
    trackable: true,
    encode: (v) => urlResult(str(v, "url"), "link to your PDF"),
  },
  {
    id: "image",
    slug: "images",
    label: "Images",
    description: "Share a photo or gallery.",
    fields: [
      linkField(
        "Link to the image or album",
        "https://photos.app.goo.gl/…",
        "Use a public link to an image, a shared album, or a gallery page.",
      ),
    ],
    defaults: { url: "" },
    trackable: true,
    encode: (v) => urlResult(str(v, "url"), "link to your images"),
  },
  {
    id: "social",
    slug: "social-media",
    label: "Social media",
    description: "One profile, or all of them on one page.",
    fields: [
      {
        name: "title",
        label: "Page title",
        kind: "text",
        placeholder: "Corner Café",
        help: "Used when you add more than one profile. One profile opens directly.",
        maxLength: 60,
      },
      ...SOCIAL_NETWORKS.map<FieldDef>((n) => ({
        name: n.key,
        label: n.label,
        kind: "text",
        half: true,
        placeholder: "@username or link",
        maxLength: 200,
      })),
      { name: "website", label: "Website", kind: "url", half: true, placeholder: "example.com", maxLength: 300 },
    ],
    defaults: {},
    trackable: true,
    encode: (v) => {
      const links: [string, string][] = [];
      for (const n of SOCIAL_NETWORKS) {
        const input = str(v, n.key);
        if (!input) continue;
        const url = socialUrl(input, n.url);
        if (!url) return fail(`Check your ${n.label} username or link.`);
        links.push([n.label, url]);
      }
      if (str(v, "website")) {
        const url = normalizeUrl(str(v, "website"));
        if (!url) return fail("That website address doesn't look right.");
        links.push(["Website", url]);
      }
      if (links.length === 0) return EMPTY;
      if (links.length === 1) return ok(links[0][1], { kind: "url", url: links[0][1] });
      return ok(
        page({ k: "l", n: str(v, "title") || "My links", l: links }),
        null,
        "Several profiles open a links page. It can't be tracked.",
      );
    },
  },
  {
    id: "video",
    slug: "video",
    label: "Video",
    description: "Play a YouTube, Vimeo or hosted video.",
    fields: [linkField("Link to the video", "https://youtu.be/…", "YouTube, Vimeo, TikTok, or a link to a video file you host.")],
    defaults: { url: "" },
    trackable: true,
    encode: (v) => urlResult(str(v, "url"), "video link"),
  },
  {
    id: "text",
    slug: "text",
    label: "Simple text",
    description: "Show a message, no internet needed.",
    fields: [
      {
        name: "text",
        label: "Text",
        kind: "textarea",
        placeholder: "Type your message…",
        required: true,
        maxLength: 2000,
        help: "Shorter text makes a smaller code that is easier to scan.",
      },
    ],
    defaults: { text: "" },
    trackable: false,
    encode: (v) => {
      const text = raw(v, "text");
      if (!text.trim()) return EMPTY;
      return ok(text, null, text.length > 800 ? "Long text makes a dense code. Print it larger." : undefined);
    },
  },
  {
    id: "business",
    slug: "business-page",
    label: "Business page",
    description: "A mobile page with your details.",
    fields: [
      { name: "name", label: "Business name", kind: "text", required: true, maxLength: 60, placeholder: "Corner Café" },
      { name: "tagline", label: "Tagline", kind: "text", maxLength: 80, placeholder: "Coffee, cake and good Wi-Fi" },
      { name: "about", label: "About", kind: "textarea", maxLength: 300 },
      { name: "phone", label: "Phone", kind: "tel", half: true, maxLength: 30 },
      { name: "email", label: "Email", kind: "email", half: true, maxLength: 120 },
      { name: "website", label: "Website", kind: "url", half: true, maxLength: 200, placeholder: "example.com" },
      { name: "color", label: "Accent color", kind: "color", half: true },
      { name: "address", label: "Address", kind: "textarea", maxLength: 200 },
      { name: "hours", label: "Opening hours", kind: "textarea", maxLength: 300, placeholder: "Mon–Fri 8:00–18:00\nSat 9:00–14:00" },
      { name: "l1", label: "Extra link label", kind: "text", half: true, maxLength: 40, placeholder: "Order online" },
      { name: "u1", label: "Extra link", kind: "url", half: true, maxLength: 300 },
      { name: "l2", label: "Second link label", kind: "text", half: true, maxLength: 40 },
      { name: "u2", label: "Second link", kind: "url", half: true, maxLength: 300 },
    ],
    defaults: { color: "#0d0d0e" },
    trackable: false,
    encode: (v) => {
      const name = str(v, "name");
      if (!name) {
        const other = ["tagline", "about", "phone", "email", "website", "address", "hours"].some((k) => str(v, k));
        return other ? fail("Add your business name.") : EMPTY;
      }
      const email = str(v, "email");
      if (email && !EMAIL_RE.test(email)) return fail("That email address doesn't look right.");
      const website = str(v, "website") ? normalizeUrl(str(v, "website")) : undefined;
      if (website === null) return fail("That website address doesn't look right.");
      const links: [string, string][] = [];
      for (const [lk, uk] of [["l1", "u1"], ["l2", "u2"]] as const) {
        if (!str(v, uk)) continue;
        const u = normalizeUrl(str(v, uk));
        if (!u) return fail("Check your extra links.");
        links.push([str(v, lk) || "Link", u]);
      }
      const color = str(v, "color");
      return ok(
        page({
          k: "b",
          n: name,
          t: str(v, "tagline") || undefined,
          d: str(v, "about") || undefined,
          ph: str(v, "phone") ? cleanPhone(str(v, "phone")) : undefined,
          em: email || undefined,
          w: website || undefined,
          ad: str(v, "address") || undefined,
          h: str(v, "hours") || undefined,
          c: /^#[0-9a-f]{6}$/i.test(color) ? color : undefined,
          l: links.length ? links : undefined,
        }),
      );
    },
  },
  {
    id: "facebook",
    slug: "facebook",
    label: "Facebook",
    description: "Send people to your page.",
    fields: [
      {
        name: "page",
        label: "Facebook page",
        kind: "text",
        required: true,
        maxLength: 300,
        placeholder: "facebook.com/yourpage or yourpage",
      },
    ],
    defaults: {},
    trackable: true,
    encode: (v) => {
      const input = str(v, "page");
      if (!input) return EMPTY;
      const url = /facebook\.com|fb\.com|fb\.me/i.test(input)
        ? normalizeUrl(input)
        : socialUrl(input, (h) => `https://www.facebook.com/${h}`);
      if (!url) return fail("Enter your page link or username.");
      return ok(url, { kind: "url", url });
    },
  },
  {
    id: "wifi",
    slug: "wifi",
    label: "Wi‑Fi",
    description: "Join a network without typing.",
    fields: [
      { name: "ssid", label: "Network name (SSID)", kind: "text", required: true, maxLength: 32, autoComplete: "off" },
      {
        name: "security",
        label: "Security",
        kind: "select",
        half: true,
        options: [
          { value: "WPA", label: "WPA / WPA2 / WPA3" },
          { value: "WEP", label: "WEP (old)" },
          { value: "nopass", label: "None (open network)" },
        ],
      },
      {
        name: "password",
        label: "Password",
        kind: "password",
        half: true,
        maxLength: 63,
        autoComplete: "off",
        showIf: (v) => v.security !== "nopass",
      },
      { name: "hidden", label: "Hidden network", kind: "checkbox" },
    ],
    defaults: { security: "WPA", hidden: false },
    trackable: false,
    encode: (v) => {
      const ssid = raw(v, "ssid");
      if (!ssid.trim()) return EMPTY;
      const sec = (raw(v, "security") || "WPA") as "WPA" | "WEP" | "nopass";
      const pass = raw(v, "password");
      if (sec === "WPA" && pass && (pass.length < 8 || pass.length > 63)) {
        return fail("WPA passwords are 8 to 63 characters long.");
      }
      if (sec !== "nopass" && !pass) return fail("Add the network password, or choose “None”.");
      let s = `WIFI:T:${sec};S:${wifiEscape(ssid)};`;
      if (sec !== "nopass") s += `P:${wifiEscape(pass)};`;
      if (bool(v, "hidden")) s += "H:true;";
      return ok(`${s};`);
    },
  },
  {
    id: "app",
    slug: "app",
    label: "App",
    description: "App Store and Google Play in one code.",
    fields: [
      { name: "ios", label: "App Store link", kind: "url", maxLength: 400, placeholder: "https://apps.apple.com/app/…" },
      { name: "android", label: "Google Play link", kind: "url", maxLength: 400, placeholder: "https://play.google.com/store/apps/details?id=…" },
      { name: "fallback", label: "Website for other devices (optional)", kind: "url", maxLength: 400 },
    ],
    defaults: {},
    trackable: true,
    encode: (v) => {
      const parse = (k: string) => (str(v, k) ? normalizeUrl(str(v, k)) : "");
      const ios = parse("ios");
      const android = parse("android");
      const fallback = parse("fallback");
      if (ios === null || android === null || fallback === null) return fail("Check your store links.");
      if (!ios && !android && !fallback) return EMPTY;
      if (ios && android) {
        return ok(page({ k: "a", n: undefined, i: ios, a: android, w: fallback || undefined }), {
          kind: "app",
          ios,
          android,
          fallback: fallback || "",
        });
      }
      const only = (ios || android || fallback) as string;
      return ok(only, { kind: "url", url: only });
    },
  },
  {
    id: "menu",
    slug: "menu",
    label: "Menu",
    description: "Open your menu on any phone.",
    fields: [linkField("Link to your menu", "https://example.com/menu", "A PDF, a menu page on your site, or an ordering page.")],
    defaults: { url: "" },
    trackable: true,
    encode: (v) => urlResult(str(v, "url"), "link to your menu"),
  },
  {
    id: "email",
    slug: "email",
    label: "Email",
    description: "Start an email, pre-filled.",
    fields: [
      { name: "to", label: "Send to", kind: "email", required: true, maxLength: 120, placeholder: "hello@example.com" },
      { name: "subject", label: "Subject", kind: "text", maxLength: 120 },
      { name: "body", label: "Message", kind: "textarea", maxLength: 600 },
    ],
    defaults: {},
    trackable: false,
    encode: (v) => {
      const to = str(v, "to");
      if (!to) return str(v, "subject") || str(v, "body") ? fail("Add the address to send to.") : EMPTY;
      if (!EMAIL_RE.test(to)) return fail("That email address doesn't look right.");
      return ok(`mailto:${encodeURIComponent(to).replace(/%40/g, "@").replace(/%2B/g, "+")}${query([["subject", str(v, "subject")], ["body", raw(v, "body").trim()]])}`);
    },
  },
  {
    id: "phone",
    slug: "phone",
    label: "Phone",
    description: "Call a number.",
    fields: [{ name: "phone", label: "Phone number", kind: "tel", required: true, maxLength: 30, placeholder: "+1 555 010 0199", help: "Include the country code so it works for everyone." }],
    defaults: {},
    trackable: false,
    encode: (v) => {
      const input = str(v, "phone");
      if (!input) return EMPTY;
      const p = cleanPhone(input);
      if (p.replace(/\D/g, "").length < 3) return fail("Enter a phone number.");
      return ok(`tel:${p}`);
    },
  },
  {
    id: "sms",
    slug: "sms",
    label: "SMS",
    description: "Send a text message.",
    fields: [
      { name: "phone", label: "Phone number", kind: "tel", required: true, maxLength: 30, placeholder: "+1 555 010 0199" },
      { name: "message", label: "Message", kind: "textarea", maxLength: 300 },
    ],
    defaults: {},
    trackable: false,
    encode: (v) => {
      const input = str(v, "phone");
      if (!input) return raw(v, "message").trim() ? fail("Add the phone number to text.") : EMPTY;
      const p = cleanPhone(input);
      if (p.replace(/\D/g, "").length < 3) return fail("Enter a phone number.");
      return ok(`SMSTO:${p}:${raw(v, "message").trim()}`);
    },
  },
  {
    id: "whatsapp",
    slug: "whatsapp",
    label: "WhatsApp",
    description: "Open a chat with a message ready.",
    fields: [
      { name: "phone", label: "WhatsApp number", kind: "tel", required: true, maxLength: 30, placeholder: "+91 98765 43210", help: "With country code." },
      { name: "message", label: "Pre-filled message", kind: "textarea", maxLength: 300 },
    ],
    defaults: {},
    trackable: true,
    encode: (v) => {
      const digits = str(v, "phone").replace(/\D/g, "");
      if (!digits) return raw(v, "message").trim() ? fail("Add the WhatsApp number.") : EMPTY;
      if (digits.length < 7 || digits.length > 15) return fail("Use the full number with country code, e.g. +91 98765 43210.");
      const url = `https://wa.me/${digits}${query([["text", raw(v, "message").trim()]])}`;
      return ok(url, { kind: "url", url });
    },
  },
  {
    id: "event",
    slug: "event",
    label: "Event",
    description: "Add an event to a calendar.",
    fields: [
      { name: "title", label: "Event title", kind: "text", required: true, maxLength: 100 },
      { name: "allDay", label: "All-day event", kind: "checkbox" },
      { name: "start", label: "Starts", kind: "datetime-local", half: true, showIf: (v) => !v.allDay },
      { name: "end", label: "Ends", kind: "datetime-local", half: true, showIf: (v) => !v.allDay },
      { name: "startDate", label: "Starts", kind: "date", half: true, showIf: (v) => v.allDay === true },
      { name: "endDate", label: "Ends", kind: "date", half: true, showIf: (v) => v.allDay === true },
      { name: "location", label: "Location", kind: "text", maxLength: 150 },
      { name: "description", label: "Description", kind: "textarea", maxLength: 400 },
    ],
    defaults: { allDay: false },
    trackable: false,
    encode: (v) => {
      const title = str(v, "title");
      if (!title) return EMPTY;
      const lines = ["BEGIN:VEVENT", `SUMMARY:${icalEscape(title)}`];
      if (bool(v, "allDay")) {
        const start = icalDate(str(v, "startDate"));
        if (!start) return fail("Pick the start date.");
        const end = str(v, "endDate") ? icalDate(str(v, "endDate"), 1) : icalDate(str(v, "startDate"), 1);
        if (!end) return fail("Pick a valid end date.");
        if (end && end <= start) return fail("The event must end after it starts.");
        lines.push(`DTSTART;VALUE=DATE:${start}`);
        if (end) lines.push(`DTEND;VALUE=DATE:${end}`);
      } else {
        const start = icalDateTime(str(v, "start"));
        if (!start) return fail("Pick the start date and time.");
        const end = str(v, "end") ? icalDateTime(str(v, "end")) : null;
        if (str(v, "end") && !end) return fail("Pick a valid end date and time.");
        if (end && end <= start) return fail("The event must end after it starts.");
        lines.push(`DTSTART:${start}`);
        if (end) lines.push(`DTEND:${end}`);
      }
      if (str(v, "location")) lines.push(`LOCATION:${icalEscape(str(v, "location"))}`);
      if (str(v, "description")) lines.push(`DESCRIPTION:${icalEscape(str(v, "description"))}`);
      lines.push("END:VEVENT");
      return ok(lines.join("\r\n"));
    },
  },
  {
    id: "location",
    slug: "location",
    label: "Location",
    description: "Open a place in Maps.",
    fields: [
      {
        name: "mode",
        label: "Find the place by",
        kind: "select",
        options: [
          { value: "address", label: "Address or place name" },
          { value: "coords", label: "Latitude and longitude" },
        ],
      },
      { name: "query", label: "Address or place", kind: "text", maxLength: 200, placeholder: "Gateway of India, Mumbai", showIf: (v) => v.mode !== "coords" },
      { name: "lat", label: "Latitude", kind: "text", half: true, placeholder: "18.9220", showIf: (v) => v.mode === "coords" },
      { name: "lng", label: "Longitude", kind: "text", half: true, placeholder: "72.8347", showIf: (v) => v.mode === "coords" },
      {
        name: "geo",
        label: "Use a geo: link instead of a Google Maps link",
        kind: "checkbox",
        help: "geo: links open the default map app on many Android phones but not on iPhone.",
        showIf: (v) => v.mode === "coords",
      },
    ],
    defaults: { mode: "address", geo: false },
    trackable: true,
    encode: (v) => {
      let q: string;
      if (raw(v, "mode") === "coords") {
        const lat = str(v, "lat");
        const lng = str(v, "lng");
        if (!lat && !lng) return EMPTY;
        const la = Number(lat);
        const lo = Number(lng);
        if (!lat || !lng || !Number.isFinite(la) || !Number.isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) {
          return fail("Latitude must be between -90 and 90, longitude between -180 and 180.");
        }
        if (bool(v, "geo")) return ok(`geo:${la},${lo}`);
        q = `${la},${lo}`;
      } else {
        q = str(v, "query");
        if (!q) return EMPTY;
      }
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
      return ok(url, { kind: "url", url });
    },
  },
  {
    id: "crypto",
    slug: "crypto",
    label: "Crypto",
    description: "Request a crypto payment.",
    fields: [
      {
        name: "coin",
        label: "Currency",
        kind: "select",
        half: true,
        options: [
          { value: "bitcoin", label: "Bitcoin (BTC)" },
          { value: "ethereum", label: "Ethereum (ETH)" },
          { value: "litecoin", label: "Litecoin (LTC)" },
          { value: "dogecoin", label: "Dogecoin (DOGE)" },
          { value: "solana", label: "Solana (SOL)" },
        ],
      },
      { name: "amount", label: "Amount (optional)", kind: "text", half: true, placeholder: "0.001", maxLength: 30 },
      { name: "address", label: "Wallet address", kind: "text", required: true, maxLength: 120, autoComplete: "off" },
      { name: "label", label: "Label (optional)", kind: "text", half: true, maxLength: 60 },
      { name: "message", label: "Message (optional)", kind: "text", half: true, maxLength: 120 },
    ],
    defaults: { coin: "bitcoin" },
    trackable: false,
    encode: (v) => {
      const coin = raw(v, "coin") || "bitcoin";
      if (!["bitcoin", "ethereum", "litecoin", "dogecoin", "solana"].includes(coin)) return fail("Choose a supported currency.");
      const address = str(v, "address");
      if (!address) return EMPTY;
      if (/\s/.test(address)) return fail("Wallet addresses can't contain spaces.");
      const amount = str(v, "amount");
      if (amount && !/^\d+(\.\d+)?$/.test(amount)) return fail("Use a plain number for the amount, like 0.001.");
      const patterns: Record<string, RegExp> = {
        bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
        ethereum: /^0x[a-fA-F0-9]{40}$/,
        litecoin: /^(ltc1|[LM3])[a-zA-HJ-NP-Z0-9]{25,62}$/,
        dogecoin: /^[DA9][a-km-zA-HJ-NP-Z1-9]{24,40}$/,
        solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      };
      const warning = patterns[coin]?.test(address)
        ? undefined
        : "This doesn't look like a typical address for this currency. Double-check it.";
      if (coin === "ethereum") {
        const wei = amount ? toBaseUnits(amount, 18) : "";
        if (wei === null) return fail("Ethereum amounts can have at most 18 decimal places.");
        return ok(`ethereum:${address}${query([["value", wei ?? ""]])}`, null, warning);
      }
      const params: [string, string][] = [["amount", amount], ["label", str(v, "label")], ["message", str(v, "message")]];
      return ok(`${coin}:${address}${query(params)}`, null, warning);
    },
  },
  {
    id: "upi",
    slug: "upi",
    label: "UPI payment",
    description: "Get paid with any UPI app.",
    fields: [
      { name: "vpa", label: "UPI ID", kind: "text", required: true, maxLength: 100, placeholder: "yourname@bank", autoComplete: "off" },
      { name: "name", label: "Payee name", kind: "text", required: true, maxLength: 60, placeholder: "Corner Café" },
      { name: "amount", label: "Amount in ₹ (optional)", kind: "text", half: true, placeholder: "250", maxLength: 12, help: "Leave empty so customers enter the amount." },
      { name: "note", label: "Note (optional)", kind: "text", half: true, maxLength: 60, placeholder: "Order 42" },
    ],
    defaults: {},
    trackable: false,
    encode: (v) => {
      const vpa = str(v, "vpa");
      if (!vpa) return EMPTY;
      if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{1,64}$/.test(vpa)) {
        return fail("A UPI ID looks like name@bank.");
      }
      const name = str(v, "name");
      if (!name) return fail("Add the payee name shown to customers.");
      const amount = str(v, "amount");
      if (amount && !/^\d{1,7}(\.\d{1,2})?$/.test(amount)) return fail("Use an amount like 250 or 99.50.");
      let s = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}`;
      if (amount) s += `&am=${amount}`;
      s += "&cu=INR";
      if (str(v, "note")) s += `&tn=${encodeURIComponent(str(v, "note"))}`;
      return ok(s);
    },
  },
];

export const QR_TYPE_MAP = Object.fromEntries(QR_TYPES.map((t) => [t.id, t])) as Record<QrTypeId, QrTypeDef>;

export function getQrTypeBySlug(slug: string): QrTypeDef | undefined {
  return QR_TYPES.find((t) => t.slug === slug);
}

export function isQrTypeId(s: string): s is QrTypeId {
  return (QR_TYPE_IDS as readonly string[]).includes(s);
}
