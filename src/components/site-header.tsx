"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const QR_LINKS = [
  ["Website URL", "/qr-code-generator/url"],
  ["Wi-Fi", "/qr-code-generator/wifi"],
  ["vCard contact", "/qr-code-generator/vcard"],
  ["Business page", "/qr-code-generator/business-page"],
  ["Restaurant menu", "/qr-code-generator/menu"],
  ["Social media", "/qr-code-generator/social-media"],
  ["All QR types", "/qr-code-generator"],
] as const;

const NAV = [
  ["QR codes", "/qr-code-generator"],
  ["Barcodes", "/barcode-generator"],
  ["Templates", "/templates"],
  ["Bulk", "/bulk-qr-code-generator"],
  ["Guides", "/guides"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="QRWright home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          <div className="group relative">
            <Link
              href="/qr-code-generator"
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              QR codes <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-60 rounded-xl border border-line bg-card p-1.5 shadow-xl">
                {QR_LINKS.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-card-2"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {NAV.slice(1).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/qr-code-scanner"
            className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink sm:block"
          >
            Scanner
          </Link>
          <Link
            href="/my-codes"
            className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink md:block"
          >
            My codes
          </Link>
          <ThemeToggle />
          <ButtonLink href="/qr-code-generator" size="sm" className="hidden sm:inline-flex">
            Create a QR code
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-line bg-card lg:hidden", open ? "block" : "hidden")}>
        <nav aria-label="Mobile" className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:grid-cols-2">
          {[...NAV, ["Scanner", "/qr-code-scanner"], ["My codes", "/my-codes"], ["All QR types", "/qr-code-generator"]].map(
            ([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-card-2"
              >
                {label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
