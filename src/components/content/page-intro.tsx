import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="border-b border-line bg-grid">
      <div className="bg-gradient-to-b from-paper/50 to-paper">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="font-pixel text-xs uppercase tracking-widest text-muted">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
