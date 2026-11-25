import Link from "next/link";
import { ArrowRight, ArrowUpRight, Barcode, Check, Download, Layers, LockKeyhole, Paintbrush, ScanLine, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { TypeCardGrid } from "@/components/content/tool-page";
import { FaqList, faqSchema } from "@/components/content/faq";
import { QrArt } from "@/components/content/qr-art";
import { GlobalScans } from "@/components/global-scans";
import { TypeIcon } from "@/components/studio/type-picker";
import { QR_TYPES } from "@/lib/payload/qr-types";
import { getTemplate } from "@/lib/qr/templates";
import { GUIDES } from "@/content/guides";
import { jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Free QR Code & Barcode Generator", "Make custom QR codes and 18 barcode formats for free. Add colors, logos and frames, count scans, and export print-ready files. No account or watermark.", "/");

const faqs = [
  { q: "Is QRWright really free?", a: "Yes. Every design, export format, and tool is free for personal and commercial use. There is no subscription, account, watermark, or advertising." },
  { q: "Will my QR code expire?", a: "Direct codes have no expiry. URLs still need their destination website to work. Tracked codes and QRWright mini pages also need this site to remain online." },
  { q: "Can I change the destination after printing?", a: "Neither Direct nor Tracked destinations can be edited. Link to a page you control, and update that page while keeping its address the same." },
  { q: "Where are my codes stored?", a: "My codes is saved in this browser using IndexedDB. It is not an account or a cloud backup. Export a JSON backup before clearing your browser data or moving devices." },
  { q: "What does scan tracking collect?", a: "Only anonymous totals and daily counts. Bot and preview requests are filtered. The destination is carried in a signed link, never saved in the count database. Counts measure link opens, not unique people." },
];

export default function Home() {
  return <>
    <section className="relative overflow-hidden border-b border-line bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/80 to-paper" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[11px] font-medium"><span className="size-1.5 rounded-full bg-success" /> Small squares. Endless possibilities.</p>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-7xl">Make it yours.<br /><span className="relative inline-block">Make it <span className="relative z-10">scan.</span><span className="absolute bottom-1 right-0 h-4 w-[52%] -rotate-2 bg-signal sm:h-5" /></span></h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">QR codes with a little more character. Create, customize, and download in your browser. Every tool is free.</p>
          <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/qr-code-generator" size="lg">Create a QR code <ArrowRight className="size-4" /></ButtonLink><ButtonLink href="/barcode-generator" variant="outline" size="lg"><Barcode className="size-4" /> Make a barcode</ButtonLink></div>
          <ul className="mt-5 flex flex-wrap gap-4 text-xs text-muted">{["No sign-up", "No watermark", "No ads"].map((t) => <li key={t} className="flex items-center gap-1"><Check className="size-3 text-success" />{t}</li>)}</ul>
        </div>
        <div className="relative mx-auto w-full max-w-sm pb-6">
          <div className="absolute -inset-4 rotate-6 rounded-3xl border border-line bg-card-2" />
          <div className="relative -rotate-3 rounded-3xl border border-line bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between"><span className="font-pixel text-[11px] text-muted">01 / YOUR NEXT IDEA</span><span className="rounded-full bg-signal px-2 py-1 text-[9px] font-bold text-signal-ink">READY TO SCAN</span></div>
            <div className="rounded-2xl bg-white p-2"><QrArt template={getTemplate("neon-night")!} prefix="hero" /></div>
            <div className="mt-4 flex justify-between text-xs text-muted"><span>A real QR code. Try it.</span><ScanLine className="size-4" /></div>
          </div>
          <div className="absolute -bottom-3 -right-3 rotate-3 rounded-xl border border-line bg-signal px-4 py-3 font-pixel text-xs text-signal-ink shadow-sm">100% FREE. 100% YOURS.</div>
        </div>
      </div>
    </section>

    <div className="border-b border-line bg-card"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 md:grid-cols-4">{[["20", "QR content types"], ["36", "ready-made designs"], ["18", "barcode formats"], ["$0", "for every feature"]].map(([n, label]) => <div key={label} className="flex items-center gap-3"><span className="font-pixel text-2xl">{n}</span><span className="text-xs text-muted">{label}</span></div>)}</div></div>

    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="font-pixel text-[11px] uppercase tracking-widest text-muted">One tool. Twenty possibilities.</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">What would you like to share?</h2></div><Link href="/qr-code-generator" className="inline-flex items-center gap-2 text-sm font-medium">Open the studio <ArrowUpRight className="size-4" /></Link></div>
      <TypeCardGrid columns={4} items={QR_TYPES.map((t) => ({ href: `/qr-code-generator/${t.slug}`, label: t.label, description: t.description, icon: <TypeIcon id={t.id} className="size-4" /> }))} />
    </section>

    <section className="border-y border-line bg-card-2/50"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="font-pixel text-[11px] uppercase tracking-widest text-muted">Beyond black and white</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">A good start for your next great thing.</h2></div><ButtonLink href="/templates" variant="outline">All 36 designs <ArrowRight className="size-4" /></ButtonLink></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{["classic", "forest", "sunset", "menu-card"].map((id) => { const t = getTemplate(id) ?? getTemplate("royal")!; return <Link key={id} href={`/qr-code-generator?template=${t.id}`} className="group rounded-2xl border border-line bg-card p-4 transition-transform hover:-translate-y-1"><div className="rounded-lg bg-white p-2"><QrArt template={t} prefix="home" /></div><p className="mt-3 flex justify-between text-sm font-medium">{t.name}<ArrowUpRight className="size-4 text-subtle" /></p><p className="mt-1 text-xs leading-relaxed text-muted">{t.bestFor}</p></Link>; })}</div>
    </div></section>

    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
      <div><p className="font-pixel text-[11px] uppercase tracking-widest text-muted">Useful by design</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Your content stays yours.</h2><p className="mt-4 max-w-md leading-7 text-muted">Create on your device. Save in your browser. Download a file you own. QRWright keeps the process simple, from a single business card to a stack of labels.</p><div className="mt-6 max-w-sm"><GlobalScans /></div></div>
      <div className="grid gap-6 sm:grid-cols-2">{[
        [Paintbrush, "Made to match", "Shapes, gradients, logos and frames. Start from a template or build your own."],
        [LockKeyhole, "Local-first", "Your library stays in this browser. Take a JSON backup whenever you need one."],
        [Download, "Ready for print", "SVG, PNG, PDF, JPEG and WebP, plus A4 and US Letter print sheets."],
        [Layers, "One or five hundred", "Turn a CSV into a ZIP of Direct QR codes, all with the same design."],
      ].map(([Icon, title, text]) => { const I = Icon as typeof Zap; return <div key={title as string}><I className="mb-3 size-5" /><h3 className="text-sm font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{text as string}</p></div>; })}</div>
    </section>

    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="rounded-3xl bg-ink p-6 text-paper sm:p-10"><div className="grid gap-8 md:grid-cols-2"><div><p className="font-pixel text-xs uppercase tracking-widest text-signal">Choose what matters</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Permanent, or counted.</h2><p className="mt-4 text-sm leading-7 text-paper/70">Direct codes carry your content. Tracked codes carry a signed redirect and count opens. Both are free, and neither changes destination after printing.</p><Link href="/guides/static-vs-dynamic-qr-codes" className="mt-5 inline-flex items-center gap-2 text-sm text-signal">Understand the difference <ArrowRight className="size-4" /></Link></div><div className="grid grid-cols-2 gap-3">{[["Direct", "Content in the pattern. No scan count. URLs still need their destination to work."], ["Tracked", "Anonymous totals and daily counts. Needs QRWright online; counting never holds up a redirect."]].map(([title, text]) => <div key={title} className="rounded-2xl border border-paper/20 p-5"><h3 className="font-pixel text-base">{title}</h3><p className="mt-3 text-xs leading-6 text-paper/70">{text}</p></div>)}</div></div></div>
      <h2 className="mb-5 mt-14 text-2xl font-semibold tracking-tight">A little know-how goes a long way.</h2>
      <div className="grid gap-3 md:grid-cols-3">{GUIDES.slice(0, 3).map((g) => <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-line bg-card p-5"><span className="font-mono text-[11px] text-subtle">{g.readingMinutes} MIN READ</span><h3 className="mt-3 font-semibold">{g.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{g.description}</p></Link>)}</div>
      <h2 className="mb-5 mt-14 text-2xl font-semibold tracking-tight">Good questions.</h2><FaqList faqs={faqs} />
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />
  </>;
}
