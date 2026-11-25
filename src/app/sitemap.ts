import type { MetadataRoute } from "next";
import { BARCODE_PAGES, GUIDES, QR_PAGES } from "@/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/qr-code-generator", "/barcode-generator", "/templates", "/bulk-qr-code-generator", "/qr-code-scanner", "/guides", "/about", "/privacy", "/terms", "/contact"];
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...QR_PAGES.map((p) => ({ url: absoluteUrl(`/qr-code-generator/${p.slug}`) })),
    ...BARCODE_PAGES.map((p) => ({ url: absoluteUrl(`/barcode-generator/${p.slug}`) })),
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), lastModified: g.updated })),
  ];
}
