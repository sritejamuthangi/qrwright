import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
  return <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center"><p className="font-pixel text-sm text-subtle">404 / NO CODE HERE</p><h1 className="mt-4 text-3xl font-semibold tracking-tight">This page wandered off.</h1><p className="mb-6 mt-3 text-sm leading-relaxed text-muted">Check the address, or start a new QR code in the studio.</p><ButtonLink href="/qr-code-generator">Open the QR studio</ButtonLink></div>;
}
