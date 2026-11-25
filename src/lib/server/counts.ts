import { createClient, type Client } from "@libsql/client/web";

/**
 * Anonymous scan counters. This is the only data QRWright stores:
 *   scan_totals(id, total)        one row per tracked code, plus "_all"
 *   scan_daily(id, day, n)        per-day counts, pruned after 90 days
 * No destinations, IP addresses, user agents or locations are stored.
 */

export interface CountStore {
  readonly kind: "turso" | "memory";
  increment(id: string, day: string): Promise<void>;
  totals(ids: string[]): Promise<Record<string, number>>;
  daily(id: string, sinceDay: string): Promise<{ day: string; n: number }[]>;
  global(): Promise<number>;
  prune(beforeDay: string): Promise<number>;
}

export const GLOBAL_ID = "_all";
export const DAILY_RETENTION_DAYS = 90;

export const today = (d = new Date()) => d.toISOString().slice(0, 10);
export const daysAgo = (n: number) => today(new Date(Date.now() - n * 86_400_000));

const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS scan_totals (id TEXT PRIMARY KEY, total INTEGER NOT NULL DEFAULT 0) WITHOUT ROWID",
  "CREATE TABLE IF NOT EXISTS scan_daily (id TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (id, day)) WITHOUT ROWID",
];

class TursoStore implements CountStore {
  readonly kind = "turso" as const;
  private schema: Promise<void> | null = null;
  constructor(private db: Client) {}

  private ready() {
    if (!this.schema) {
      this.schema = this.db
        .batch(SCHEMA, "write")
        .then(() => undefined)
        .catch((err) => {
          this.schema = null;
          throw err;
        });
    }
    return this.schema;
  }

  async increment(id: string, day: string) {
    await this.ready();
    await this.db.batch(
      [
        { sql: "INSERT INTO scan_totals (id, total) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET total = total + 1", args: [id] },
        { sql: "INSERT INTO scan_totals (id, total) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET total = total + 1", args: [GLOBAL_ID] },
        { sql: "INSERT INTO scan_daily (id, day, n) VALUES (?, ?, 1) ON CONFLICT(id, day) DO UPDATE SET n = n + 1", args: [id, day] },
      ],
      "write",
    );
  }

  async totals(ids: string[]) {
    if (!ids.length) return {};
    await this.ready();
    const rs = await this.db.execute({
      sql: `SELECT id, total FROM scan_totals WHERE id IN (${ids.map(() => "?").join(",")})`,
      args: ids,
    });
    const out: Record<string, number> = {};
    for (const row of rs.rows) out[String(row.id)] = Number(row.total);
    return out;
  }

  async daily(id: string, sinceDay: string) {
    await this.ready();
    const rs = await this.db.execute({
      sql: "SELECT day, n FROM scan_daily WHERE id = ? AND day >= ? ORDER BY day",
      args: [id, sinceDay],
    });
    return rs.rows.map((r) => ({ day: String(r.day), n: Number(r.n) }));
  }

  async global() {
    return (await this.totals([GLOBAL_ID]))[GLOBAL_ID] ?? 0;
  }

  async prune(beforeDay: string) {
    await this.ready();
    const rs = await this.db.execute({ sql: "DELETE FROM scan_daily WHERE day < ?", args: [beforeDay] });
    return rs.rowsAffected;
  }
}

/** Development fallback. Counts live in memory and reset when the server restarts. */
class MemoryStore implements CountStore {
  readonly kind = "memory" as const;
  private t = new Map<string, number>();
  private d = new Map<string, number>();

  async increment(id: string, day: string) {
    this.t.set(id, (this.t.get(id) ?? 0) + 1);
    this.t.set(GLOBAL_ID, (this.t.get(GLOBAL_ID) ?? 0) + 1);
    const k = `${id}|${day}`;
    this.d.set(k, (this.d.get(k) ?? 0) + 1);
  }
  async totals(ids: string[]) {
    return Object.fromEntries(ids.filter((id) => this.t.has(id)).map((id) => [id, this.t.get(id)!]));
  }
  async daily(id: string, sinceDay: string) {
    return [...this.d.entries()]
      .map(([k, n]) => ({ id: k.split("|")[0], day: k.split("|")[1], n }))
      .filter((r) => r.id === id && r.day >= sinceDay)
      .sort((a, b) => a.day.localeCompare(b.day))
      .map(({ day, n }) => ({ day, n }));
  }
  async global() {
    return this.t.get(GLOBAL_ID) ?? 0;
  }
  async prune(beforeDay: string) {
    let n = 0;
    for (const k of this.d.keys()) {
      if (k.split("|")[1] < beforeDay) {
        this.d.delete(k);
        n++;
      }
    }
    return n;
  }
}

let store: CountStore | null | undefined;

/** Returns the configured store, the in-memory store in development, or null when counting is off. */
export function getCountStore(): CountStore | null {
  if (store !== undefined) return store;
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    store = new TursoStore(createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }));
  } else if (process.env.NODE_ENV !== "production" || process.env.COUNT_STORE === "memory") {
    store = new MemoryStore();
  } else {
    store = null;
  }
  return store;
}
