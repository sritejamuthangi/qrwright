import type { Metadata } from "next";
import { PageView } from "./page-view";

export const metadata: Metadata = {
  title: "Shared page",
  description: "A page shared through a QRWright QR code.",
  robots: { index: false, follow: false, nocache: true },
};

export default function HostedPage() {
  return <PageView />;
}
