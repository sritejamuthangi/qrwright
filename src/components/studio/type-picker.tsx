"use client";

import {
  Bitcoin,
  CalendarDays,
  Contact,
  FileText,
  Image as ImageIcon,
  IndianRupee,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Share2,
  Smartphone,
  Store,
  Type,
  Users,
  UtensilsCrossed,
  Video,
  Wifi,
} from "lucide-react";
import { QR_TYPES, type QrTypeId } from "@/lib/payload/qr-types";
import { cn } from "@/lib/cn";

const ICONS: Record<QrTypeId, React.ComponentType<{ className?: string }>> = {
  url: Link2,
  vcard: Contact,
  pdf: FileText,
  image: ImageIcon,
  social: Share2,
  video: Video,
  text: Type,
  business: Store,
  facebook: Users,
  wifi: Wifi,
  app: Smartphone,
  menu: UtensilsCrossed,
  email: Mail,
  phone: Phone,
  sms: MessageSquare,
  whatsapp: MessageCircle,
  event: CalendarDays,
  location: MapPin,
  crypto: Bitcoin,
  upi: IndianRupee,
};

export function QrTypePicker({
  value,
  onChange,
  exclude,
}: {
  value: QrTypeId;
  onChange: (id: QrTypeId) => void;
  exclude?: QrTypeId[];
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {QR_TYPES.filter((t) => !exclude?.includes(t.id)).map((t) => {
        const Icon = ICONS[t.id];
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            title={t.description}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors",
              active
                ? "border-ink bg-ink text-paper"
                : "border-line bg-card text-ink hover:border-line-strong hover:bg-card-2",
            )}
          >
            <Icon className={cn("size-4 shrink-0", active ? "text-signal" : "text-muted")} />
            <span className="truncate">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function TypeIcon({ id, className }: { id: QrTypeId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} />;
}
