import Link from "next/link";
import { Mark } from "@/components/logo";
import { site } from "@/lib/site";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "QR codes",
    links: [
      ["QR code generator", "/qr-code-generator"],
      ["Website URL", "/qr-code-generator/url"],
      ["Wi-Fi", "/qr-code-generator/wifi"],
      ["vCard", "/qr-code-generator/vcard"],
      ["Business page", "/qr-code-generator/business-page"],
      ["Restaurant menu", "/qr-code-generator/menu"],
    ],
  },
  {
    title: "Barcodes",
    links: [
      ["Barcode generator", "/barcode-generator"],
      ["Code 128", "/barcode-generator/code-128"],
      ["EAN-13", "/barcode-generator/ean-13"],
      ["UPC-A", "/barcode-generator/upc-a"],
      ["Data Matrix", "/barcode-generator/data-matrix"],
      ["PDF417", "/barcode-generator/pdf417"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["Templates", "/templates"],
      ["Bulk generator", "/bulk-qr-code-generator"],
      ["QR scanner", "/qr-code-scanner"],
      ["My codes", "/my-codes"],
      ["Print sizes", "/guides/qr-code-size-for-print"],
      ["Static vs dynamic", "/guides/static-vs-dynamic-qr-codes"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Mark className="size-6 text-ink" />
              <span className="font-pixel text-sm tracking-tight">QRWRIGHT</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Free QR codes and barcodes, made in your browser. No account, no watermark, no ads, no scan
              limits.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-3 py-1 text-[11px] font-medium text-ink">
              <span className="size-1.5 rounded-full bg-success" /> Free for everyone, including commercial use
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle">{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-muted transition-colors hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center">
          <p>© {site.name}. Free to use.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto">
            <Link href="/guides" className="hover:text-ink">Guides</Link>
            <Link href="/about" className="hover:text-ink">About</Link>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/contact" className="hover:text-ink">Contact</Link>
            <Link href="/sitemap.xml" className="hover:text-ink">Sitemap</Link>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-subtle">
          QR codes are generated on your device. Tracked links store anonymous scan counts only: no
          destinations, IP addresses, device details or personal data. Product names are used descriptively;
          QRWright is not affiliated with or endorsed by any brand mentioned on this site.
        </p>
        <p className="mt-3 text-[11px] text-subtle">
          Built with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/sritejamuthangi/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink transition-colors hover:text-signal"
          >
            Sri Teja Muthangi
          </a>
        </p>
      </div>
    </footer>
  );
}
