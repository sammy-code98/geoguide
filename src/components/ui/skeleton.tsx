import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn("animate-pulse bg-surface-2 rounded-md", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
