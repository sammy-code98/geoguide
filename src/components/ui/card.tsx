import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/** Surface container: 1px border, moderate radius, no shadow by default. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn("bg-surface border border-border rounded-lg", className)}
      {...props}
    />
  );
}
