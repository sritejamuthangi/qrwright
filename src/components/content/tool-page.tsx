import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import type { BarcodePage, ToolPage } from "@/content/types";
import { Inline } from "./inline";
import { FaqList, faqSchema } from "./faq";
import { cn } from "@/lib/cn";
import { absoluteUrl } from "@/lib/site";
import { jsonLd } from "@/lib/seo";

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

const TRUST = [
  { icon: Zap, text: "Free forever" },
  { icon: ShieldCheck, text: "No sign-up" },
  { icon: Sparkles, text: "No watermark" },
  { icon: Check, text: "Commercial use allowed" },
];

export function ToolPageLayout({
  page,
  kind,
  studio,
  facts,
  related,
  children,
}: {
  page: ToolPage;
  kind: "qr" | "barcode";
  studio: ReactNode;
  facts?: BarcodePage["facts"];
  related: RelatedLink[];
  children?: ReactNode;
}) {
  const base = kind === "qr" ? "/qr-code-generator" : "/barcode-generator";
  const crumbs = [
    { label: "Home", href: "/" },
    { label: kind === "qr" ? "QR codes" : "Barcodes", href: base },
    { label: page.h1.replace(/ (QR Code )?Generator.*$/i, ""), href: `${base}/${page.slug}` },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/80 to-paper" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] text-subtle">
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-muted">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {kind === "qr" ? "QR code generator" : "Barcode generator"}
              </p>
              <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.08]">
                {page.h1}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">{page.lede}</p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {TRUST.map((t) => (
                  <li key={t.text} className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <t.icon className="size-3.5 text-success" />
                    {t.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden rounded-2xl border border-line bg-card p-4 shadow-sm lg:block">
              <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-subtle">Start here</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {kind === "qr"
                  ? "Everything is generated in your browser. Add your content, choose a design, and download a print-ready file."
                  : "Enter your data, pick the format your system needs, and download a print-ready file. Validation and check digits are automatic."}
              </p>
              <a
                href="#generator"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-line-strong decoration-2 underline-offset-4 hover:decoration-ink"
              >
                Jump to the generator <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="generator" className="scroll-mt-20 border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{studio}</div>
      </section>

      <section className="border-b border-line bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {page.steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-line bg-card p-5">
                <span className="grid size-7 place-items-center rounded-full bg-signal font-pixel text-xs font-bold text-signal-ink">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  <Inline text={step.text} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="min-w-0">
            {facts && (
              <div className="mb-10 overflow-hidden rounded-2xl border border-line bg-card">
                <div className="border-b border-line px-5 py-3">
                  <h2 className="text-sm font-semibold">{page.h1.replace(/ Generator.*$/i, "")} at a glance</h2>
                </div>
                <dl className="grid sm:grid-cols-2">
                  {facts.map((f) => (
                    <div key={f.label} className="border-b border-line px-5 py-3 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-subtle">{f.label}</dt>
                      <dd className="mt-1 text-sm text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="space-y-10">
              {page.sections.map((section, i) => (
                <section key={section.heading} id={`section-${i + 1}`} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((p) => (
                      <p key={p.slice(0, 32)} className="text-[15px] leading-7 text-muted">
                        <Inline text={p} />
                      </p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 32)} className="flex gap-2.5 text-[15px] leading-7 text-muted">
                          <Check className="mt-1.5 size-4 shrink-0 text-success" />
                          <span>
                            <Inline text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {children}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-line bg-card p-5">
              <h2 className="text-sm font-semibold">Quick tips</h2>
              <ul className="mt-3 space-y-3">
                {page.tips.map((tip) => (
                  <li key={tip.slice(0, 32)} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
                    <span>
                      <Inline text={tip} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-card p-5">
              <h2 className="text-sm font-semibold">Related</h2>
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="group flex items-start justify-between gap-2 rounded-lg px-2 py-2 text-[13px] hover:bg-card-2"
                    >
                      <span>
                        <span className="font-medium text-ink">{r.label}</span>
                        {r.description && <span className="mt-0.5 block text-[11px] leading-relaxed text-subtle">{r.description}</span>}
                      </span>
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-signal-soft p-5">
              <p className="font-pixel text-[11px] uppercase tracking-[0.14em] text-ink">No account. No catch.</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/80">
                QRWright is free for personal and commercial use. Codes are made in your browser, and only
                anonymous scan counts are saved in the application’s database.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Questions people ask</h2>
          <div className="mt-4">
            <FaqList faqs={page.faqs} />
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl border border-line bg-ink p-6 text-paper sm:p-10">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-signal">Make it now</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Ready to make your {kind === "qr" ? "QR code" : "barcode"}?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
                No sign-up, no email, no watermark. Create it, test it, download it, and use it anywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#generator"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-signal px-5 text-sm font-medium text-signal-ink hover:bg-signal/85"
              >
                Open the generator <ArrowRight className="size-4" />
              </a>
              <Link
                href={kind === "qr" ? "/templates" : "/guides/barcode-types-explained"}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-paper/20 px-5 text-sm font-medium text-paper hover:bg-paper/10"
              >
                {kind === "qr" ? "Browse designs" : "Compare formats"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(page.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
    </>
  );
}

export function TypeCardGrid({
  items,
  columns = 3,
}: {
  items: { href: string; label: string; description: string; icon?: ReactNode }[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-2.5 sm:gap-3",
        columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-start gap-3 rounded-xl border border-line bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm"
        >
          {item.icon && (
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card-2 text-ink transition-colors group-hover:bg-signal">
              {item.icon}
            </span>
          )}
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-ink">{item.label}</span>
            <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{item.description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
