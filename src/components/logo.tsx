import { cn } from "@/lib/cn";

/** QRWright mark: a finder pattern drawn as an ink square with a signal corner. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <rect x="6" y="6" width="8" height="8" rx="1.6" fill="var(--signal)" />
      <rect x="8.4" y="8.4" width="3.2" height="3.2" rx="0.6" fill="currentColor" />
      <rect x="18" y="6" width="8" height="8" rx="1.6" fill="var(--signal)" />
      <rect x="20.4" y="8.4" width="3.2" height="3.2" rx="0.6" fill="currentColor" />
      <rect x="6" y="18" width="8" height="8" rx="1.6" fill="var(--signal)" />
      <rect x="8.4" y="20.4" width="3.2" height="3.2" rx="0.6" fill="currentColor" />
      <rect x="18" y="18" width="3.2" height="3.2" fill="var(--signal)" />
      <rect x="22.8" y="18" width="3.2" height="3.2" fill="var(--signal)" />
      <rect x="18" y="22.8" width="3.2" height="3.2" fill="var(--signal)" />
      <rect x="22.8" y="22.8" width="3.2" height="3.2" fill="var(--signal)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Mark />
      <span className="font-pixel text-[17px] tracking-tight text-ink">
        QR<span className="text-muted">WRIGHT</span>
      </span>
    </span>
  );
}
