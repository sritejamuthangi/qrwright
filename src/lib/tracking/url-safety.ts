/**
 * Checks that a tracked-link destination is a public http(s) URL. Shared by
 * the browser (instant feedback) and the signing API (enforcement).
 */

export type SafetyResult = { ok: true; url: string } | { ok: false; reason: string };

const BLOCKED_SUFFIXES = [".local", ".localhost", ".internal", ".lan", ".home.arpa", ".intranet", ".corp"];

function isPrivateIPv4(host: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

export function checkDestination(input: string, selfHosts: string[] = []): SafetyResult {
  if (input.length > 1000) return { ok: false, reason: "That link is too long for a tracked code. Use a Direct code instead." };
  let u: URL;
  try {
    u = new URL(input);
  } catch {
    return { ok: false, reason: "That isn't a valid link." };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok: false, reason: "Tracked codes can only open http or https links." };
  }
  if (u.username || u.password) return { ok: false, reason: "Links with a username or password can't be tracked." };
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) {
    return { ok: false, reason: "Tracked codes must point to a public website." };
  }
  if (host.startsWith("[") || host.includes(":")) {
    return { ok: false, reason: "Tracked codes must use a domain name, not an IP address." };
  }
  if (isPrivateIPv4(host)) return { ok: false, reason: "Tracked codes must point to a public website." };
  if (!host.includes(".")) return { ok: false, reason: "Tracked codes must point to a public website." };
  if (selfHosts.includes(host) && /^\/r\//i.test(u.pathname)) {
    return { ok: false, reason: "That is already a tracked link." };
  }
  return { ok: true, url: input };
}
