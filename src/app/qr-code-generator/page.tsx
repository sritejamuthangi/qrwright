import { PageIntro } from "@/components/content/page-intro";
import { TypeCardGrid } from "@/components/content/tool-page";
import { QrStudio } from "@/components/studio/qr-studio";
import { TypeIcon } from "@/components/studio/type-picker";
import { QR_TYPES } from "@/lib/payload/qr-types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Free QR Code Generator with Logos & Scan Counts", "Create a custom QR code in your browser. Choose from 20 content types, 36 designs, logos and frames. Free SVG, PNG and PDF downloads with no sign-up.", "/qr-code-generator");
export default function Page() {
  return <><PageIntro eyebrow="The QR studio" title="Your idea. One scan away." description="Choose your content, make the design your own, and download a code that’s ready to use. Free for personal and commercial projects." />
    <section id="generator" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"><QrStudio /></section>
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6"><h2 className="mb-5 text-2xl font-semibold tracking-tight">Explore all 20 QR types</h2><TypeCardGrid columns={4} items={QR_TYPES.map((t) => ({ href: `/qr-code-generator/${t.slug}`, label: t.label, description: t.description, icon: <TypeIcon id={t.id} className="size-4" /> }))} /></section>
  </>;
}
