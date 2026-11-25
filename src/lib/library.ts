import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { QrDesign } from "@/lib/qr/types";
import type { QrTypeId } from "@/lib/payload/qr-types";
import { isQrTypeId } from "@/lib/payload/qr-types";
import { sanitizeDesign } from "@/lib/qr/sanitize";
import { getBarcodeFormat } from "@/lib/barcode/formats";
import { countIdFromLink } from "@/lib/tracking/token";
import { z } from "zod";

/** Codes saved in this browser only. Nothing is uploaded or synced. */

export interface SavedQr {
  id: string;
  kind: "qr";
  title: string;
  typeId: QrTypeId;
  payload: string;
  design: QrDesign;
  tracked?: { url: string; countId: string };
  createdAt: number;
  updatedAt: number;
}

export interface SavedBarcode {
  id: string;
  kind: "barcode";
  title: string;
  format: string;
  payload: string;
  options: {
    scale: number;
    height: number;
    includeText: boolean;
    barColor: string;
    background: string | null;
    rotate: 0 | 90 | 180 | 270;
  };
  createdAt: number;
  updatedAt: number;
}

export type SavedCode = SavedQr | SavedBarcode;

interface LibrarySchema extends DBSchema {
  codes: {
    key: string;
    value: SavedCode;
    indexes: { updatedAt: number };
  };
}

let dbPromise: Promise<IDBPDatabase<LibrarySchema>> | null = null;

function db() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("This browser does not support local storage for codes."));
  }
  dbPromise ??= openDB<LibrarySchema>("qrwright", 1, {
    upgrade(database) {
      const store = database.createObjectStore("codes", { keyPath: "id" });
      store.createIndex("updatedAt", "updatedAt");
    },
  });
  return dbPromise;
}

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export async function listCodes(): Promise<SavedCode[]> {
  const database = await db();
  const all = await database.getAllFromIndex("codes", "updatedAt");
  return all.reverse();
}

export async function saveCode(code: SavedCode): Promise<void> {
  const database = await db();
  await database.put("codes", code);
}

export async function deleteCode(id: string): Promise<void> {
  const database = await db();
  await database.delete("codes", id);
}

export async function clearCodes(): Promise<void> {
  const database = await db();
  await database.clear("codes");
}

export interface Backup {
  app: "QRWright";
  version: 1;
  exportedAt: string;
  codes: SavedCode[];
}

export async function exportBackup(): Promise<Backup> {
  return {
    app: "QRWright",
    version: 1,
    exportedAt: new Date().toISOString(),
    codes: await listCodes(),
  };
}

const common = {
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  payload: z.string().min(1).max(12_000),
  createdAt: z.number().finite().nonnegative(),
  updatedAt: z.number().finite().nonnegative(),
};
const hex = z.string().regex(/^#[0-9a-f]{6}$/i);
const codeSchema = z.discriminatedUnion("kind", [
  z.object({ ...common, kind: z.literal("qr"), typeId: z.string().refine(isQrTypeId), design: z.unknown(), tracked: z.object({ url: z.string().url().max(4000), countId: z.string().regex(/^[A-Z2-7]{10}$/) }).optional() }),
  z.object({ ...common, kind: z.literal("barcode"), format: z.string().refine((id) => !!getBarcodeFormat(id)), options: z.object({ scale: z.number().int().min(1).max(6), height: z.number().min(8).max(40), includeText: z.boolean(), barColor: hex, background: hex.nullable(), rotate: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]) }) }),
]);

export function validateSavedCode(raw: unknown): SavedCode | null {
  const result = codeSchema.safeParse(raw);
  if (!result.success) return null;
  const code = result.data;
  if (code.kind === "barcode") return getBarcodeFormat(code.format)?.validate(code.payload).ok ? code : null;
  if (code.tracked && (!/^https?:\/\//.test(code.tracked.url) || code.payload !== code.tracked.url || countIdFromLink(code.tracked.url) !== code.tracked.countId)) return null;
  return { ...code, typeId: code.typeId as QrTypeId, design: sanitizeDesign(code.design) };
}

/** Imports a backup, keeping codes that already exist. Returns how many were added. */
export async function importBackup(json: string): Promise<number> {
  if (json.length > 20_000_000) throw new Error("Backups must be under 20 MB.");
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  if (!data || typeof data !== "object") throw new Error("That file isn't a QRWright backup.");
  const backup = data as Partial<Backup>;
  if (backup.app !== "QRWright" || backup.version !== 1 || !Array.isArray(backup.codes)) {
    throw new Error("That file isn't a QRWright backup.");
  }
  if (backup.codes.length > 5000) throw new Error("Import up to 5,000 codes at a time.");
  const codes = backup.codes.map(validateSavedCode);
  if (codes.some((c) => !c)) throw new Error("This backup contains an invalid code. No codes were imported.");
  const database = await db();
  const existing = new Set(await database.getAllKeys("codes"));
  const tx = database.transaction("codes", "readwrite");
  let added = 0;
  for (const code of codes) {
    if (!code || existing.has(code.id)) continue;
    await tx.store.put(code);
    existing.add(code.id);
    added++;
  }
  await tx.done;
  return added;
}
