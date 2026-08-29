import {
  MdOutlineFlight,
  MdOutlineHotel,
  MdOutlineRestaurant,
  MdOutlineDirectionsBus,
  MdOutlineAttractions,
  MdOutlineTipsAndUpdates,
} from "react-icons/md";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import type { CostEstimate } from "../../types/cost";
import { formatCurrency } from "../../utils/custom";

interface CostResultProps {
  estimate: CostEstimate;
}

export default function CostResult({ estimate }: CostResultProps): JSX.Element {
  const { currency, breakdown } = estimate;

  const rows = [
    { label: "Flights", value: breakdown.flights, Icon: MdOutlineFlight },
    { label: "Accommodation", value: breakdown.accommodation, Icon: MdOutlineHotel },
    { label: "Food", value: breakdown.food, Icon: MdOutlineRestaurant },
    { label: "Local Transport", value: breakdown.localTransport, Icon: MdOutlineDirectionsBus },
    { label: "Activities", value: breakdown.activities, Icon: MdOutlineAttractions },
  ];

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
        <p className="text-sm opacity-90">Estimated total trip cost</p>
        <p className="text-4xl md:text-5xl font-bold mt-1">
          {formatCurrency(estimate.total, currency)}
        </p>
        <p className="text-sm opacity-90 mt-2">
          ≈ {formatCurrency(estimate.perPersonPerDay, currency)} per person / day
        </p>
        {!estimate.converted && currency === "USD" && (
          <p className="text-xs opacity-75 mt-1">Estimates in USD.</p>
        )}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {rows.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 text-center"
          >
            <Icon className="text-primary text-2xl mx-auto mb-2" />
            <p className="text-xs text-textGray dark:text-grayish">{label}</p>
            <p className="font-bold text-black dark:text-textWhite mt-1">
              {formatCurrency(value, currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Advice */}
      <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-black dark:text-textWhite mb-2">
          <MdOutlineTipsAndUpdates className="text-primary" />
          Budget Advice
        </h3>
        <p className="text-textGray dark:text-textWhite leading-relaxed">
          {estimate.budgetAdvice}
        </p>
        {estimate.savingSuggestions.length > 0 && (
          <ul className="list-disc pl-5 mt-3 space-y-1">
            {estimate.savingSuggestions.map((tip) => (
              <li key={tip} className="text-textGray dark:text-textWhite leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Alternatives */}
      {estimate.alternativeDestinations.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-black dark:text-textWhite mb-3">
            <HiOutlineGlobeAlt className="text-primary" />
            Alternative Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {estimate.alternativeDestinations.map((alt) => (
              <div
                key={alt.name}
                className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl p-4"
              >
                <p className="font-bold text-primary">{alt.name}</p>
                {alt.reason && (
                  <p className="text-sm text-textGray dark:text-grayish mt-1 leading-relaxed">
                    {alt.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
