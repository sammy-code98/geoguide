import { Link } from "react-router-dom";
import { HiOutlineCalendar, HiOutlineWallet } from "react-icons/hi2";
import { HiOutlineMap, HiOutlineCalculator } from "react-icons/hi";
import { AppRoutes } from "../../types/routes";
import type { RecommendedCountry } from "../../types/recommendations";
import { Badge } from "../ui/badge";

interface RecommendationCardProps {
  country: RecommendedCountry;
}

const cardLink =
  "inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

export default function RecommendationCard({
  country,
}: RecommendationCardProps): JSX.Element {
  const dest = encodeURIComponent(country.name);

  return (
    <div className="flex flex-col bg-surface border border-border rounded-lg p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-xl font-semibold text-fg">{country.name}</h3>
        {country.region && (
          <Badge variant="primary" className="whitespace-nowrap">
            {country.region}
          </Badge>
        )}
      </div>

      <p className="text-fg/90 leading-relaxed mt-2">{country.reason}</p>

      {country.bestFor.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {country.bestFor.map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-1 text-sm text-muted">
        {country.estimatedBudget && (
          <p className="flex items-center gap-2">
            <HiOutlineWallet className="text-primary" aria-hidden="true" />
            {country.estimatedBudget}
          </p>
        )}
        {country.bestSeason && (
          <p className="flex items-center gap-2">
            <HiOutlineCalendar className="text-primary" aria-hidden="true" />
            {country.bestSeason}
          </p>
        )}
      </div>

      <div className="flex gap-4 mt-4 pt-4 border-t border-border">
        <Link to={`${AppRoutes.itinerary}?destination=${dest}`} className={cardLink}>
          <HiOutlineMap aria-hidden="true" />
          Plan itinerary
        </Link>
        <Link to={`${AppRoutes.costEstimator}?destination=${dest}`} className={cardLink}>
          <HiOutlineCalculator aria-hidden="true" />
          Estimate cost
        </Link>
      </div>
    </div>
  );
}
