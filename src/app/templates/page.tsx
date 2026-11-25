import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { QrArt } from "@/components/content/qr-art";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/qr/templates";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("36 Free QR Code Design Templates", "Browse scannable QR code templates: classic, minimal, colorful, gradients and call-to-action frames. Customize any design for free in the QRWright studio.", "/templates");
export default function Page() {
  return <><PageIntro eyebrow="A head start, with style" title="Small squares. Big personality." description="36 designs, ready for your content. Every template is decode-tested. Choose one, then customize the colors, shapes, logo and frame." >
    <nav aria-label="Template categories" className="flex flex-wrap gap-2">{TEMPLATE_CATEGORIES.map((c) => <a key={c.id} href={`#${c.id}`} className="rounded-full border border-line bg-card px-3 py-2 text-xs hover:bg-signal">{c.label}</a>)}</nav>
  </PageIntro>
  <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6">{TEMPLATE_CATEGORIES.map((c) => <section key={c.id} id={c.id} className="scroll-mt-24"><h2 className="mb-5 text-2xl font-semibold tracking-tight">{c.label}</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{TEMPLATES.filter((t) => t.category === c.id).map((t) => <Link key={t.id} href={`/qr-code-generator?template=${t.id}`} className="group rounded-2xl border border-line bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-md"><div className="rounded-xl bg-white p-2"><QrArt template={t} prefix="gallery" /></div><h3 className="mt-4 flex justify-between gap-2 text-sm font-semibold">{t.name}<ArrowUpRight className="size-4 shrink-0 text-subtle" /></h3><p className="mt-1 text-xs leading-relaxed text-muted">{t.bestFor}</p><span className="mt-4 inline-block text-xs font-medium underline underline-offset-4">Use this design</span></Link>)}</div></section>)}</div>
  </>;
}
