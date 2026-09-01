import { ReactNode } from "react";
import {
  MdOutlineInfo,
  MdOutlineTheaterComedy,
  MdOutlineTranslate,
  MdOutlineRestaurant,
  MdOutlineDirectionsBus,
  MdOutlineHealthAndSafety,
  MdOutlineWbSunny,
  MdOutlineTipsAndUpdates,
} from "react-icons/md";
import { GiCutDiamond } from "react-icons/gi";
import type { CountryInsights } from "../../types/insights";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface CountryInsightsProps {
  data: CountryInsights | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;
}

interface SectionDef {
  key: keyof Omit<CountryInsights, "hiddenGems">;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionDef[] = [
  { key: "overview", title: "Overview", Icon: MdOutlineInfo },
  { key: "culture", title: "Culture & traditions", Icon: MdOutlineTheaterComedy },
  { key: "languages", title: "Languages", Icon: MdOutlineTranslate },
  { key: "cuisine", title: "Food & cuisine", Icon: MdOutlineRestaurant },
  { key: "transportation", title: "Getting around", Icon: MdOutlineDirectionsBus },
  { key: "safety", title: "Safety", Icon: MdOutlineHealthAndSafety },
  { key: "bestSeason", title: "Best season to visit", Icon: MdOutlineWbSunny },
  { key: "travelAdvice", title: "Travel advice", Icon: MdOutlineTipsAndUpdates },
];

function Section({
  Icon,
  title,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-primary text-xl" />
        <h3 className="text-base font-semibold text-fg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function CountryInsights({
  data,
  isLoading,
  isError,
  error,
  onRetry,
}: CountryInsightsProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true">
        {new Array(6).fill(null).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5">
            <Skeleton className="h-5 w-1/3 mb-3" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-11/12 mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-muted">
          {error?.message || "We couldn't generate insights right now."}
        </p>
        <Button onClick={onRetry}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SECTIONS.map(({ key, title, Icon }) => (
        <Section key={key} Icon={Icon} title={title}>
          <p className="text-fg/90 leading-relaxed">{data[key]}</p>
        </Section>
      ))}

      {data.hiddenGems.length > 0 && (
        <div className="md:col-span-2">
          <Section Icon={GiCutDiamond} title="Hidden gems">
            <ul className="list-disc pl-5 space-y-1">
              {data.hiddenGems.map((gem) => (
                <li key={gem} className="text-fg/90 leading-relaxed">
                  {gem}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}
