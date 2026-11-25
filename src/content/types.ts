/**
 * Content schema for SEO tool pages.
 *
 * Inline markup allowed in any prose string (body, list, tips, steps, faq answers):
 *   **bold**, `code`, and [link text](/internal-path)
 * Nothing else: no HTML, no headings, no external links.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface Section {
  heading: string;
  /** Paragraphs. */
  body: string[];
  /** Optional bullet list shown after the paragraphs. */
  list?: string[];
}

export interface ToolPage {
  /** URL segment, e.g. "wifi" for /qr-code-generator/wifi. */
  slug: string;
  /** <title> text without the " | QRWright" suffix. 45-60 characters. */
  metaTitle: string;
  /** Meta description. 140-160 characters. */
  metaDescription: string;
  h1: string;
  /** One or two sentences shown under the H1. */
  lede: string;
  /** Exactly three short how-to steps. */
  steps: { title: string; text: string }[];
  /** Two to four explanatory sections. */
  sections: Section[];
  /** Three to six practical tips. */
  tips: string[];
  /** Four to six questions people actually search for. */
  faqs: Faq[];
}

export interface BarcodePage extends ToolPage {
  /** Four to six spec facts shown in a table, e.g. { label: "Check digit", value: "Mod 10, required" }. */
  facts: { label: string; value: string }[];
}

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date. */
  published: string;
  updated: string;
  readingMinutes: number;
}
