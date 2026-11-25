import { notFound } from "next/navigation";
import { QR_PAGES, getQrPage } from "@/content";
import { ToolPageLayout } from "@/components/content/tool-page";
import { QrStudio } from "@/components/studio/qr-studio";
import { getQrTypeBySlug } from "@/lib/payload/qr-types";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => QR_PAGES.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: Props) {
  const page = getQrPage((await params).slug);
  if (!page) notFound();
  return pageMetadata(page.metaTitle, page.metaDescription, `/qr-code-generator/${page.slug}`);
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getQrPage(slug);
  const type = getQrTypeBySlug(slug);
  if (!page || !type) notFound();
  return <ToolPageLayout page={page} kind="qr" studio={<QrStudio key={type.id} initialType={type.id} hideTypePicker />} related={[
    { label: "All QR types", href: "/qr-code-generator" },
    { label: "36 design templates", href: "/templates" },
    { label: "Print size guide", href: "/guides/qr-code-size-for-print" },
    { label: "Direct vs. Tracked", href: "/guides/static-vs-dynamic-qr-codes" },
  ]} />;
}
