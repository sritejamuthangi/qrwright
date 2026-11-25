import { PageIntro } from "@/components/content/page-intro";
import { CodeLibrary } from "@/components/tools/code-library";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("My Codes", "Your browser-local QR code and barcode library. Rename, restyle, export, back up, and view anonymous scan totals.", "/my-codes", true);
export default function Page() { return <><PageIntro eyebrow="Your local collection" title="My codes." description="Your QR codes, barcodes and designs, right where you left them. Saved in this browser, with backup and import when you need to move." /><section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"><CodeLibrary /></section></>; }
