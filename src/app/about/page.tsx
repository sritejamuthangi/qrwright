import Link from "next/link";
import { InfoPage } from "@/components/content/info-page";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("About QRWright", "QRWright is a free, local-first QR code and barcode workshop. No accounts, ads or watermarks. Your designs stay in your browser.", "/about");
export default function Page() {
  return <InfoPage title="A small tool, built with care." description="QRWright makes a familiar job simpler: turn something useful into a code people can scan.">
    <h2>Free means the whole tool</h2><p>Twenty QR types. Thirty-six design templates. Eighteen barcode formats. Logos, frames, print sheets, batch exports and anonymous scan counts. Every feature is free for personal and commercial use, without an account or watermark.</p>
    <h2>Built around your browser</h2><p>QR patterns, barcodes and exports are generated on your device. Your saved collection lives in IndexedDB, in this browser. There is no cloud library, profile, or email signup. A JSON backup lets you move your collection yourself.</p>
    <h2>Simple, honest tracking</h2><p>Tracked codes count link opens. Their destinations travel inside signed links, rather than a destination database. The count store holds only anonymous totals and daily counts. If counting is unavailable, a valid redirect can still work.</p><p>Tracked destinations cannot be changed after printing. We spell that out because “dynamic QR” often means an editable destination elsewhere. Read <Link href="/guides/static-vs-dynamic-qr-codes">Direct vs. Tracked</Link> before choosing.</p>
    <h2>Designed to stay inexpensive</h2><p>Most of the work runs on your device, and public pages are generated ahead of time. The service is designed for free hosting tiers. There is no paid upgrade or billing flow. Tracked codes and hosted mini pages depend on this site being available; a Direct code containing your own URL does not.</p>
    <h2>A note on reliability</h2><p>Templates are tested with a real QR decoder. Your content, colors, logo and print material still matter. Use the studio’s scan check and test a printed proof with real phones.</p><p>Questions or something broken? Visit <Link href="/contact">Contact</Link>.</p>
  </InfoPage>;
}
