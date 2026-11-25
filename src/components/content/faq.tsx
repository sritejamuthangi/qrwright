import { ChevronDown } from "lucide-react";
import type { Faq } from "@/content/types";
import { Inline } from "./inline";

export function FaqList({ faqs, idPrefix = "faq" }: { faqs: Faq[]; idPrefix?: string }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-card">
      {faqs.map((f, i) => (
        <details key={f.q} className="group" id={`${idPrefix}-${i + 1}`}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-ink">
            <span>{f.q}</span>
            <ChevronDown className="size-4 shrink-0 text-subtle transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-muted">
            <Inline text={f.a} />
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\*\*/g, "").replace(/`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") },
    })),
  };
}
