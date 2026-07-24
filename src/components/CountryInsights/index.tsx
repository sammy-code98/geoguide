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
  { key: "culture", title: "Culture & Traditions", Icon: MdOutlineTheaterComedy },
  { key: "languages", title: "Languages", Icon: MdOutlineTranslate },
  { key: "cuisine", title: "Food & Cuisine", Icon: MdOutlineRestaurant },
  { key: "transportation", title: "Getting Around", Icon: MdOutlineDirectionsBus },
  { key: "safety", title: "Safety", Icon: MdOutlineHealthAndSafety },
  { key: "bestSeason", title: "Best Season to Visit", Icon: MdOutlineWbSunny },
  { key: "travelAdvice", title: "Travel Advice", Icon: MdOutlineTipsAndUpdates },
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
    <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-primary text-xl" />
        <h3 className="text-lg font-bold text-black dark:text-textWhite">{title}</h3>
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
          <div
            key={i}
            className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 animate-pulse"
          >
            <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-11/12 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-textGray dark:text-textWhite text-lg">
          {error?.message || "We couldn't generate insights right now."}
        </p>
        <button
          onClick={onRetry}
          className="py-2 px-5 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SECTIONS.map(({ key, title, Icon }) => (
        <Section key={key} Icon={Icon} title={title}>
          <p className="text-textGray dark:text-textWhite leading-relaxed">{data[key]}</p>
        </Section>
      ))}

      {data.hiddenGems.length > 0 && (
        <div className="md:col-span-2">
          <Section Icon={GiCutDiamond} title="Hidden Gems">
            <ul className="list-disc pl-5 space-y-1">
              {data.hiddenGems.map((gem) => (
                <li key={gem} className="text-textGray dark:text-textWhite leading-relaxed">
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
