import { PageIntro } from "@/components/content/page-intro";
import { QrScanner } from "@/components/tools/qr-scanner";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Free QR Code Scanner — Camera or Image", "Read a QR code with your camera or from an image. See the content before opening a link. Free, private, and processed entirely in your browser.", "/qr-code-scanner");
export default function Page() {
  return <><PageIntro eyebrow="Look before you open" title="What’s in that code?" description="Scan with your camera or choose an image. Read the content first, then decide what to do with it." /><section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6"><QrScanner /></section></>;
}
