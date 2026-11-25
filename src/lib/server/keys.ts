import { importSecret } from "@/lib/tracking/token";

/**
 * HMAC keys for tracked links.
 *
 * TOKEN_SECRET is key 0. For rotation, add TOKEN_SECRET_1 … TOKEN_SECRET_7 and
 * point TOKEN_ACTIVE_KEY_ID at the new one. Never delete an old secret: every
 * printed code signed with it would stop working.
 */

const DEV_SECRET = "qrwright-local-development-secret-do-not-use-in-production";

function secrets(): Map<number, string> {
  const map = new Map<number, string>();
  const s0 = process.env.TOKEN_SECRET;
  if (s0) map.set(0, s0);
  for (let i = 1; i < 8; i++) {
    const s = process.env[`TOKEN_SECRET_${i}`];
    if (s) map.set(i, s);
  }
  if (map.size === 0 && process.env.NODE_ENV !== "production") map.set(0, DEV_SECRET);
  return map;
}

const cache = new Map<number, Promise<CryptoKey>>();

export function getKey(id: number): Promise<CryptoKey> | null {
  const secret = secrets().get(id);
  if (!secret) return null;
  let key = cache.get(id);
  if (!key) {
    key = importSecret(secret);
    cache.set(id, key);
  }
  return key;
}

export function activeKeyId(): number | null {
  const all = secrets();
  const wanted = Number(process.env.TOKEN_ACTIVE_KEY_ID ?? 0);
  if (all.has(wanted)) return wanted;
  return all.size ? [...all.keys()][0] : null;
}

/** Tracked links can be created only when a signing secret is configured (or in development). */
export function trackingEnabled(): boolean {
  return activeKeyId() !== null;
}
