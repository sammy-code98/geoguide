import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Editorial section header — serif title + muted subtitle, with room for an
 * action. Replaces card-wrapped headers to create hierarchy through typography.
 */
export function SectionHeading({
  title,
  subtitle,
  action,
  as: Tag = "h2",
  className,
}: SectionHeadingProps): JSX.Element {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <div>
        <Tag
          className={cn(
            "font-serif text-fg tracking-tight",
            Tag === "h1" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
          )}
        >
          {title}
        </Tag>
        {subtitle && <p className="mt-2 text-muted max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
