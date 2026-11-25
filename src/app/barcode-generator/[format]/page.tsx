import { notFound } from "next/navigation";
import { BARCODE_PAGES, getBarcodePage } from "@/content";
import { ToolPageLayout } from "@/components/content/tool-page";
import { BarcodeStudio } from "@/components/studio/barcode-studio";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ format: string }> };
export const generateStaticParams = () => BARCODE_PAGES.map((p) => ({ format: p.slug }));
export async function generateMetadata({ params }: Props) {
  const page = getBarcodePage((await params).format);
  if (!page) notFound();
  return pageMetadata(page.metaTitle, page.metaDescription, `/barcode-generator/${page.slug}`);
}
export default async function Page({ params }: Props) {
  const page = getBarcodePage((await params).format);
  if (!page) notFound();
  return <ToolPageLayout page={page} kind="barcode" facts={page.facts} studio={<BarcodeStudio key={page.slug} initialFormat={page.slug} />} related={[
    { label: "All barcode formats", href: "/barcode-generator" },
    { label: "Barcode types explained", href: "/guides/barcode-types-explained" },
    { label: "UPC vs. EAN", href: "/guides/upc-vs-ean" },
    { label: "Make a QR code", href: "/qr-code-generator" },
  ]} />;
}
