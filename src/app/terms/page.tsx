import Link from "next/link";
import { InfoPage } from "@/components/content/info-page";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Terms of Use", "Terms for using QRWright’s free QR code and barcode tools, exports, local library and tracked links.", "/terms");
export default function Page() {
  return <InfoPage title="Terms of use." description="Effective November 25, 2026. QRWright is free to use for personal and commercial projects.">
    <h2>Your codes and content</h2><p>You may create, download, print and use generated codes commercially without attribution or a watermark. You retain rights to your own content and designs. You are responsible for permission to use uploaded logos and for the destinations and data you encode.</p>
    <h2>Use the service responsibly</h2><p>Do not use QRWright for phishing, malware, impersonation, fraudulent payments, unlawful content or deliberate disruption of the service. Abusive tracked links may be disabled. Rate limits may apply to signing requests to keep the service available.</p>
    <h2>Availability and limits</h2><p>The tools are provided as available, without a service-level guarantee. Hosting and count storage use finite resources. Counts may be delayed, filtered or unavailable; they are not audited unique-visitor statistics. Valid redirects are designed to work independently of the count database.</p><p>Direct codes do not have an expiry imposed by QRWright. URLs need their destination to remain available. Tracked links and QRWright mini pages also depend on this domain and application remaining online. Keep critical long-term links on a domain you control.</p>
    <h2>Verify before using</h2><p>Check encoded data, destinations, phone numbers and payment addresses. Test codes at their final size and on their final material. A generated symbol does not assign you a GS1 number, an ISBN, regulatory approval, a ticket or an identity credential. Follow the requirements of the system that will read it.</p>
    <h2>Local library and backups</h2><p>My codes is stored in this browser, not an account. Export backups before clearing browser data or changing devices. QRWright cannot recover deleted local content. Neither Direct nor Tracked destinations can be edited after printing.</p>
    <h2>Payments and third-party services</h2><p>QRWright does not process payments or take a commission. Payment apps and external websites have their own terms and charges. Product and platform names identify supported formats or destinations and do not imply endorsement.</p>
    <h2>Changes and contact</h2><p>These terms may be updated as the service changes. The effective date will reflect updates. Questions and abuse reports can use the channels listed on <Link href="/contact">Contact</Link>.</p>
  </InfoPage>;
}
