import { PageIntro } from "@/components/content/page-intro";
import { BulkGenerator } from "@/components/tools/bulk-generator";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Bulk QR Code Generator — CSV to ZIP", "Create up to 500 QR codes from a CSV in your browser. Apply one custom design and download a ZIP of PNG or SVG files. Free, private, no account.", "/bulk-qr-code-generator");
export default function Page() {
  return <><PageIntro eyebrow="The batch workshop" title="One design. A whole lot of codes." description="Turn a CSV into up to 500 Direct QR codes. Choose the content type, check your rows, and download a ZIP. Everything happens in your browser." /><section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"><BulkGenerator /></section></>;
}
