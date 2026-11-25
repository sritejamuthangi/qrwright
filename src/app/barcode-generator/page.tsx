import { Barcode } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { TypeCardGrid } from "@/components/content/tool-page";
import { BarcodeStudio } from "@/components/studio/barcode-studio";
import { BARCODE_FORMATS, BARCODE_GROUPS } from "@/lib/barcode/formats";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Free Barcode Generator — 18 Formats", "Generate Code 128, EAN, UPC, ISBN, Data Matrix, PDF417 and more. Automatic check digits and print-ready downloads. Free, no account, made in your browser.", "/barcode-generator");
export default function Page() {
  return <><PageIntro eyebrow="The barcode studio" title="From data to label." description="Eighteen formats for retail, inventory, shipping and more. Choose the format your scanner needs, enter your data, and download." />
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"><BarcodeStudio /></section>
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 sm:px-6">{BARCODE_GROUPS.map((g) => <section key={g.id}><h2 className="mb-4 text-xl font-semibold">{g.label}</h2><TypeCardGrid items={BARCODE_FORMATS.filter((f) => f.group === g.id).map((f) => ({ href: `/barcode-generator/${f.id}`, label: f.label, description: f.description, icon: <Barcode className="size-4" /> }))} /></section>)}</div>
  </>;
}
