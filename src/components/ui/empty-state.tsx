import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Calm empty state: icon, explanation, and an optional action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-4", className)}>
      {icon && <div className="text-muted mb-4 text-4xl" aria-hidden="true">{icon}</div>}
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
