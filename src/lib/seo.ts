import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

export function pageMetadata(title: string, description: string, path: string, noindex = false): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", title, description, url: canonical, siteName: site.name, images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
    ...(noindex ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } } : {}),
  };
}

export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
