import { Skeleton } from "../../components/ui/skeleton";

export default function DetailLoader() {
  return (
    <div>
      <Skeleton className="h-9 w-24" />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="h-[280px] lg:h-[360px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
            {new Array(6).fill(null).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
