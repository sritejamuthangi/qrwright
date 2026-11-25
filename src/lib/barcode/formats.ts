/** Barcode formats, their validation and how they map to bwip-js encoders. */

export type BarcodeGroup = "retail" | "logistics" | "two-d" | "legacy";

export interface BarcodeFormat {
  id: string;
  label: string;
  group: BarcodeGroup;
  /** Function exported by bwip-js. */
  bwip: string;
  /** One-line description for pickers. */
  description: string;
  placeholder: string;
  /** Maximum characters we accept. */
  maxLength: number;
  /** Formats that carry a check digit we validate ourselves. */
  check?: "ean13" | "ean8" | "upca" | "itf14" | "isbn";
  /** Formats that need GS1 Application Identifiers in parentheses. */
  gs1?: boolean;
  validate(input: string): { ok: true; text: string; warning?: string } | { ok: false; error: string };
}

const digits = (s: string) => s.replace(/[\s-]/g, "");
const onlyDigits = (s: string) => /^\d+$/.test(s);

function checkDigit(data: string, weights: (i: number) => number): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += Number(data[i]) * weights(i);
  return (10 - (sum % 10)) % 10;
}

const eanWeights = (i: number) => (i % 2 === 0 ? 1 : 3);
const upcWeights = (i: number) => (i % 2 === 0 ? 3 : 1);

function validateEan(
  input: string,
  dataLen: number,
  name: string,
  weights: (i: number) => number,
): { ok: true; text: string } | { ok: false; error: string } {
  const s = digits(input);
  if (!onlyDigits(s)) return { ok: false, error: `${name} uses digits only.` };
  if (s.length === dataLen) {
    const check = checkDigit(s, weights);
    return { ok: true, text: s + check };
  }
  if (s.length === dataLen + 1) {
    const expected = checkDigit(s.slice(0, dataLen), weights);
    if (Number(s[dataLen]) !== expected) {
      return { ok: false, error: `That check digit is wrong. For ${s.slice(0, dataLen)} the check digit is ${expected}.` };
    }
    return { ok: true, text: s };
  }
  return {
    ok: false,
    error: `${name} needs ${dataLen} digits (we add the check digit) or ${dataLen + 1} digits including it.`,
  };
}

function validateGs1(input: string, max: number): { ok: true; text: string } | { ok: false; error: string } {
  const s = input.trim();
  if (!s) return { ok: false, error: "Enter your data with GS1 Application Identifiers in parentheses." };
  if (s.length > max) return { ok: false, error: "That is too long for this format." };
  if ((s.match(/\(/g) ?? []).length !== (s.match(/\)/g) ?? []).length) {
    return { ok: false, error: "Check the parentheses around each Application Identifier." };
  }
  if (!/^\(\d{2,4}\)/.test(s)) {
    return { ok: false, error: "Start with an Application Identifier in parentheses, for example (01)." };
  }
  if (!/^[A-Za-z0-9()\-.,/+ ]+$/.test(s)) {
    return { ok: false, error: "Use letters, digits, parentheses and basic punctuation only." };
  }
  return { ok: true, text: s };
}

function wrapCodabar(input: string): { ok: true; text: string } | { ok: false; error: string } {
  const s = input.trim().toUpperCase();
  if (!s) return { ok: false, error: "Enter the data to encode." };
  const allowed = /^[0-9\-$:/.+A-D]+$/;
  if (!allowed.test(s)) return { ok: false, error: "Codabar allows digits, - $ : / . + and start/stop letters A to D." };
  const isStart = /^[A-D]/.test(s);
  const isEnd = /[A-D]$/.test(s);
  if (isStart && isEnd && s.length > 2) return { ok: true, text: s };
  const body = s.replace(/^[A-D]/, "").replace(/[A-D]$/, "");
  if (!body) return { ok: false, error: "Add some digits between the start and stop characters." };
  return { ok: true, text: `A${body}B` };
}

export function isbn10To13(input: string): { ok: true; text: string } | { ok: false; error: string } {
  const s = input.replace(/[\s-]/g, "").toUpperCase();
  if (/^\d{9}[\dX]$/.test(s)) {
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += (s[i] === "X" ? 10 : Number(s[i])) * (10 - i);
    if (sum % 11 !== 0) return { ok: false, error: "That ISBN-10 check digit is wrong." };
    const core = `978${s.slice(0, 9)}`;
    return { ok: true, text: core + checkDigit(core, eanWeights) };
  }
  if (/^\d{13}$/.test(s)) {
    if (!/^97[89]/.test(s)) return { ok: false, error: "ISBN-13 numbers start with 978 or 979." };
    const expected = checkDigit(s.slice(0, 12), eanWeights);
    if (Number(s[12]) !== expected) return { ok: false, error: `That check digit is wrong. It should be ${expected}.` };
    return { ok: true, text: s };
  }
  return { ok: false, error: "Enter an ISBN-10 (10 characters) or ISBN-13 (13 digits). Hyphens are fine." };
}

export const BARCODE_FORMATS: BarcodeFormat[] = [
  {
    id: "code-128",
    label: "Code 128",
    group: "logistics",
    bwip: "code128",
    description: "Compact full-ASCII code for labels, assets and shipping.",
    placeholder: "ASSET-2026-0042",
    maxLength: 80,
    validate: (input) => {
      const s = input.trim();
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (!/^[\x20-\x7e]+$/.test(s)) return { ok: false, error: "Code 128 supports printable ASCII characters only." };
      if (s.length > 80) return { ok: false, error: "Keep Code 128 under 80 characters so it stays readable." };
      return { ok: true, text: s };
    },
  },
  {
    id: "gs1-128",
    label: "GS1-128",
    group: "logistics",
    bwip: "gs1_128",
    description: "Code 128 with GS1 Application Identifiers for supply chains.",
    placeholder: "(01)09521234543213(17)261231(10)ABC123",
    maxLength: 120,
    gs1: true,
    validate: (input) => validateGs1(input, 120),
  },
  {
    id: "code-39",
    label: "Code 39",
    group: "legacy",
    bwip: "code39",
    description: "Simple, self-checking code for badges and legacy systems.",
    placeholder: "CODE-39",
    maxLength: 43,
    validate: (input) => {
      const s = input.trim().toUpperCase();
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (!/^[A-Z0-9 .\-$/+%]+$/.test(s)) {
        return { ok: false, error: "Code 39 allows A-Z, 0-9, space and - . $ / + % only. Lowercase is converted." };
      }
      if (s.length > 43) return { ok: false, error: "Code 39 gets wide quickly. Keep it under 43 characters." };
      return { ok: true, text: s };
    },
  },
  {
    id: "code-93",
    label: "Code 93",
    group: "legacy",
    bwip: "code93",
    description: "Denser than Code 39, with two built-in check characters.",
    placeholder: "CODE93",
    maxLength: 48,
    validate: (input) => {
      const s = input.trim().toUpperCase();
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (!/^[A-Z0-9 .\-$/+%]+$/.test(s)) {
        return { ok: false, error: "Code 93 allows A-Z, 0-9, space and - . $ / + % only." };
      }
      return { ok: true, text: s };
    },
  },
  {
    id: "codabar",
    label: "Codabar",
    group: "legacy",
    bwip: "rationalizedCodabar",
    description: "Old library, lab and photo-lab code. Start and stop added for you.",
    placeholder: "123456",
    maxLength: 40,
    validate: wrapCodabar,
  },
  {
    id: "ean-13",
    label: "EAN-13",
    group: "retail",
    bwip: "ean13",
    description: "The standard retail barcode outside the US and Canada.",
    placeholder: "590123412345",
    maxLength: 17,
    check: "ean13",
    validate: (input) => validateEan(input, 12, "EAN-13", eanWeights),
  },
  {
    id: "ean-8",
    label: "EAN-8",
    group: "retail",
    bwip: "ean8",
    description: "Small retail barcode for tiny packages.",
    placeholder: "9638507",
    maxLength: 10,
    check: "ean8",
    validate: (input) => validateEan(input, 7, "EAN-8", upcWeights),
  },
  {
    id: "upc-a",
    label: "UPC-A",
    group: "retail",
    bwip: "upca",
    description: "Retail barcode for the US and Canada.",
    placeholder: "03600029145",
    maxLength: 15,
    check: "upca",
    validate: (input) => {
      const s = digits(input);
      if (!onlyDigits(s)) return { ok: false, error: "UPC-A uses digits only." };
      if (s.length === 11) return { ok: true, text: s + checkDigit(s, upcWeights) };
      if (s.length === 12) {
        const expected = checkDigit(s.slice(0, 11), upcWeights);
        if (Number(s[11]) !== expected) {
          return { ok: false, error: `That check digit is wrong. For ${s.slice(0, 11)} it should be ${expected}.` };
        }
        return { ok: true, text: s };
      }
      return { ok: false, error: "UPC-A needs 11 digits (we add the check digit) or 12 digits including it." };
    },
  },
  {
    id: "upc-e",
    label: "UPC-E",
    group: "retail",
    bwip: "upce",
    description: "Zero-suppressed UPC for very small packages.",
    placeholder: "012345",
    maxLength: 10,
    validate: (input) => {
      const s = digits(input);
      if (!onlyDigits(s)) return { ok: false, error: "UPC-E uses digits only." };
      if (s.length < 6 || s.length > 8) return { ok: false, error: "UPC-E needs 6, 7 or 8 digits." };
      const full = s.length === 6 ? `0${s}` : s;
      const [system, a, b, c, d, e, f] = full;
      if (system !== "0" && system !== "1") return { ok: false, error: "UPC-E number systems must be 0 or 1." };
      const expanded = Number(f) <= 2 ? `${system}${a}${b}${f}0000${c}${d}${e}`
        : f === "3" ? `${system}${a}${b}${c}00000${d}${e}`
        : f === "4" ? `${system}${a}${b}${c}${d}00000${e}`
        : `${system}${a}${b}${c}${d}${e}0000${f}`;
      const check = checkDigit(expanded, upcWeights);
      if (full.length === 8 && Number(full[7]) !== check) return { ok: false, error: `That UPC-E check digit is wrong. It should be ${check}.` };
      return { ok: true, text: `${full.slice(0, 7)}${check}` };
    },
  },
  {
    id: "itf-14",
    label: "ITF-14",
    group: "logistics",
    bwip: "itf14",
    description: "14-digit carton code with a bearer bar, for corrugated boxes.",
    placeholder: "10012345000017",
    maxLength: 18,
    check: "itf14",
    validate: (input) => {
      const s = digits(input);
      if (!onlyDigits(s)) return { ok: false, error: "ITF-14 uses digits only." };
      if (s.length === 13) return { ok: true, text: s + checkDigit(s, upcWeights) };
      if (s.length === 14) {
        const expected = checkDigit(s.slice(0, 13), upcWeights);
        if (Number(s[13]) !== expected) {
          return { ok: false, error: `That check digit is wrong. For ${s.slice(0, 13)} it should be ${expected}.` };
        }
        return { ok: true, text: s };
      }
      return { ok: false, error: "ITF-14 needs 13 digits (we add the check digit) or 14 digits including it." };
    },
  },
  {
    id: "interleaved-2-of-5",
    label: "Interleaved 2 of 5",
    group: "logistics",
    bwip: "interleaved2of5",
    description: "Dense numeric code for warehouse and distribution labels.",
    placeholder: "1234567890",
    maxLength: 60,
    validate: (input) => {
      const s = digits(input);
      if (!onlyDigits(s)) return { ok: false, error: "Interleaved 2 of 5 uses digits only." };
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (s.length % 2 === 1) {
        return { ok: true, text: `0${s}`, warning: "An odd number of digits needs a leading zero. We added it." };
      }
      return { ok: true, text: s };
    },
  },
  {
    id: "msi-plessey",
    label: "MSI Plessey",
    group: "legacy",
    bwip: "msi",
    description: "Numeric shelf and inventory code. No check digit is added.",
    placeholder: "1234567",
    maxLength: 30,
    validate: (input) => {
      const s = digits(input);
      if (!onlyDigits(s) || !s) return { ok: false, error: "MSI Plessey uses digits only." };
      return { ok: true, text: s };
    },
  },
  {
    id: "pharmacode",
    label: "Pharmacode",
    group: "legacy",
    bwip: "pharmacode",
    description: "Packaging control code for pharmaceutical production lines.",
    placeholder: "1234",
    maxLength: 6,
    validate: (input) => {
      const s = digits(input);
      if (!onlyDigits(s) || !s) return { ok: false, error: "Pharmacode uses digits only." };
      const n = Number(s);
      if (n < 3 || n > 131070) return { ok: false, error: "Pharmacode encodes a number from 3 to 131070." };
      return { ok: true, text: String(n) };
    },
  },
  {
    id: "isbn",
    label: "ISBN",
    group: "retail",
    bwip: "ean13",
    description: "Book barcode. ISBN-10 is converted to ISBN-13.",
    placeholder: "9780306406157",
    maxLength: 20,
    check: "isbn",
    validate: (input) => isbn10To13(input),
  },
  {
    id: "data-matrix",
    label: "Data Matrix",
    group: "two-d",
    bwip: "datamatrix",
    description: "Tiny 2D code for parts, electronics and labels.",
    placeholder: "PART-2026-0042",
    maxLength: 1500,
    validate: (input) => {
      const s = input.trim();
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (s.length > 1500) return { ok: false, error: "Keep Data Matrix under 1,500 characters." };
      return { ok: true, text: s };
    },
  },
  {
    id: "gs1-datamatrix",
    label: "GS1 Data Matrix",
    group: "two-d",
    bwip: "gs1datamatrix",
    description: "Healthcare and UDI 2D code with GS1 identifiers.",
    placeholder: "(01)09521234543213(17)261231(10)ABC123(21)12345",
    maxLength: 300,
    gs1: true,
    validate: (input) => validateGs1(input, 300),
  },
  {
    id: "pdf417",
    label: "PDF417",
    group: "two-d",
    bwip: "pdf417",
    description: "Stacked 2D code used on IDs, licences and documents.",
    placeholder: "License data or a short document",
    maxLength: 1800,
    validate: (input) => {
      const s = input.trim();
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (s.length > 1800) return { ok: false, error: "Keep PDF417 under 1,800 characters." };
      return { ok: true, text: s };
    },
  },
  {
    id: "aztec",
    label: "Aztec",
    group: "two-d",
    bwip: "azteccode",
    description: "Boarding-pass and transit 2D code with a central bullseye.",
    placeholder: "Boarding pass data",
    maxLength: 3000,
    validate: (input) => {
      const s = input.trim();
      if (!s) return { ok: false, error: "Enter the data to encode." };
      if (s.length > 3000) return { ok: false, error: "Keep Aztec under 3,000 characters." };
      return { ok: true, text: s };
    },
  },
];

export const BARCODE_MAP = Object.fromEntries(BARCODE_FORMATS.map((f) => [f.id, f])) as Record<string, BarcodeFormat>;

export const BARCODE_GROUPS: { id: BarcodeGroup; label: string }[] = [
  { id: "retail", label: "Retail" },
  { id: "logistics", label: "Logistics and labels" },
  { id: "two-d", label: "2D codes" },
  { id: "legacy", label: "Legacy and industrial" },
];

export function getBarcodeFormat(id: string): BarcodeFormat | undefined {
  return BARCODE_MAP[id];
}
