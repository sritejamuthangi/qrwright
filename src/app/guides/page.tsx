import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { GUIDES } from "@/content/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("QR Code & Barcode Guides", "Practical guides to QR design, print sizes, logos, error correction, scan tracking, Wi-Fi codes and barcode formats. Learn to make codes that work.", "/guides");
export default function Page() {
  return <><PageIntro eyebrow="The field notes" title="Make it work in the real world." description="Practical answers, from your first QR code to the finer points of print, tracking and barcode formats." />
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">{GUIDES.map((g) => <Link key={g.slug} href={`/guides/${g.slug}`} className="flex flex-col rounded-2xl border border-line bg-card p-6 hover:border-line-strong"><span className="font-mono text-[11px] text-subtle">{g.readingMinutes} MIN READ</span><h2 className="mt-4 text-lg font-semibold leading-snug">{g.title}</h2><p className="mb-6 mt-3 text-sm leading-relaxed text-muted">{g.description}</p><span className="mt-auto flex items-center gap-2 text-xs font-medium">Read the guide <ArrowUpRight className="size-4" /></span></Link>)}</div>
  </>;
}
