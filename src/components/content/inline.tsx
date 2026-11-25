import { Fragment, type ReactNode } from "react";
import Link from "next/link";

/**
 * Renders the small inline markup allowed in content files:
 * **bold**, `code`, and [link](/internal-path). Nothing else is interpreted.
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(\/[^)]+\))/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        const link = /^\[([^\]]+)\]\((\/[^)]+)\)$/.exec(part);
        if (link) {
          return (
            <Link key={i} href={link[2]} className="underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              {link[1]}
            </Link>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`prose-qr ${className}`}>{children}</div>;
}
