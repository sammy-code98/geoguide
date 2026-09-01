import { Skeleton } from "../ui/skeleton";

export default function CardLoader(): JSX.Element {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
