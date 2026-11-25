const stripSlash = (s: string) => s.replace(/\/+$/, "");

const siteUrl = stripSlash(process.env.NEXT_PUBLIC_SITE_URL || "https://qrcode.sritejam.com");

export const site = {
  name: "QRWright",
  /** Canonical origin for SEO, sitemaps and absolute links. */
  url: siteUrl,
  /**
   * Origin used inside tracked QR codes (`/r/...`) and hosted pages (`/p#...`).
   * Printed codes depend on this domain forever, so it must never change once
   * codes are in the wild. Defaults to the site URL.
   */
  linkBase: stripSlash(process.env.NEXT_PUBLIC_LINK_BASE_URL || siteUrl),
  tagline: "Free QR code and barcode generator",
  description:
    "Create beautiful QR codes and barcodes for free. 20 QR types, 36 designs, logos, frames and scan counts. No sign-up, no watermark, no ads. Made in your browser.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || null,
  locale: "en_US",
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
