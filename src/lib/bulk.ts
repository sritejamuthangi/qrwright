import Papa from "papaparse";
import { QR_TYPE_MAP, type QrTypeId, type Values } from "./payload/qr-types";

export interface BulkRow { row: number; name: string; payload: string; error?: string }

/** Pure CSV validation. Row data stays on the device. */
export function parseBulkCsv(csv: string, typeId: QrTypeId): BulkRow[] {
  if (csv.length > 2_000_000) throw new Error("Keep the CSV under 2 MB.");
  const result = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: "greedy", transformHeader: (h) => h.replace(/^\uFEFF/, "").trim() });
  const errors = result.errors.filter((e) => e.code !== "UndetectableDelimiter");
  if (errors.length) throw new Error(`CSV row ${(errors[0].row ?? 0) + 2}: ${errors[0].message}`);
  if (result.meta.renamedHeaders) throw new Error("Each CSV column must have a unique name.");
  if (!result.data.length) throw new Error("Add at least one data row below the headers.");
  if (result.data.length > 500) throw new Error("Use up to 500 rows per batch.");
  const type = QR_TYPE_MAP[typeId];
  if (!type.fields.some((f) => result.meta.fields?.includes(f.name))) throw new Error(`Use a header from this type: ${type.fields.map((f) => f.name).join(", ")}.`);
  return result.data.map((record, i) => {
    const values: Values = { ...type.defaults };
    let error: string | undefined;
    for (const field of type.fields) {
      if (record[field.name] !== undefined && record[field.name] !== "") {
        if (field.maxLength && record[field.name].length > field.maxLength) error = `${field.label} exceeds ${field.maxLength} characters.`;
        if (field.kind === "select" && !field.options?.some((o) => o.value === record[field.name])) error = `Invalid ${field.label}. Use ${field.options?.map((o) => o.value).join(", ")}.`;
        values[field.name] = field.kind === "checkbox" ? /^(true|1|yes)$/i.test(record[field.name]) : record[field.name];
      }
    }
    const encoded = type.encode(values);
    return { row: i + 2, name: record.filename?.trim() || `qr-${String(i + 1).padStart(3, "0")}`, payload: encoded.ok ? encoded.payload : "", ...(error || !encoded.ok ? { error: error || (!encoded.ok && encoded.error) || "Required content is missing." } : {}) };
  });
}
