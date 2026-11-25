import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { GUIDES, getGuide } from "@/content/guides";
import { ButtonLink } from "@/components/ui/button";
import { absoluteUrl, site } from "@/lib/site";
import { jsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => GUIDES.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  return pageMetadata(guide.title, guide.description, `/guides/${guide.slug}`);
}
export default async function Page({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  // Only trusted, checked-in editorial Markdown reaches this renderer.
  const html = marked.parse(guide.body, { async: false });
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: guide.published, dateModified: guide.updated, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`), author: { "@type": "Organization", name: site.name, url: site.url }, image: absoluteUrl("/og.png") };
  return <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
    <Link href="/guides" className="text-xs text-muted hover:underline">← All guides</Link>
    <p className="mt-8 font-mono text-[11px] text-subtle">{guide.readingMinutes} MIN READ · UPDATED {guide.updated}</p>
    <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{guide.title}</h1>
    <p className="mt-5 text-lg leading-relaxed text-muted">{guide.description}</p>
    <div className="prose-qr mt-10 border-t border-line pt-8" dangerouslySetInnerHTML={{ __html: html }} />
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-signal-soft p-6"><h2 className="font-semibold">Put it into practice.</h2><ButtonLink href="/qr-code-generator">Open the QR studio</ButtonLink></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
  </article>;
}
