import { Link } from "react-router-dom";
import { HiOutlineCalendar, HiOutlineWallet } from "react-icons/hi2";
import { HiOutlineMap, HiOutlineCalculator } from "react-icons/hi";
import { AppRoutes } from "../../types/routes";
import type { RecommendedCountry } from "../../types/recommendations";

interface RecommendationCardProps {
  country: RecommendedCountry;
}

export default function RecommendationCard({
  country,
}: RecommendationCardProps): JSX.Element {
  const dest = encodeURIComponent(country.name);

  return (
    <div className="flex flex-col bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-black dark:text-textWhite">{country.name}</h3>
        {country.region && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
            {country.region}
          </span>
        )}
      </div>

      <p className="text-textGray dark:text-textWhite leading-relaxed mt-2">{country.reason}</p>

      {country.bestFor.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {country.bestFor.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-textGray dark:text-grayish"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-1 text-sm text-textGray dark:text-grayish">
        {country.estimatedBudget && (
          <p className="flex items-center gap-2">
            <HiOutlineWallet className="text-primary" />
            {country.estimatedBudget}
          </p>
        )}
        {country.bestSeason && (
          <p className="flex items-center gap-2">
            <HiOutlineCalendar className="text-primary" />
            {country.bestSeason}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to={`${AppRoutes.itinerary}?destination=${dest}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <HiOutlineMap />
          Plan itinerary
        </Link>
        <Link
          to={`${AppRoutes.costEstimator}?destination=${dest}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <HiOutlineCalculator />
          Estimate cost
        </Link>
      </div>
    </div>
  );
}
