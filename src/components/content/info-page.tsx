import type { ReactNode } from "react";
import { PageIntro } from "./page-intro";

export function InfoPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <><PageIntro eyebrow="About QRWright" title={title} description={description} /><div className="prose-qr mx-auto w-full px-4 py-10 sm:px-6">{children}</div></>;
}
