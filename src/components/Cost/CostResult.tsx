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
    { label: "Local transport", value: breakdown.localTransport, Icon: MdOutlineDirectionsBus },
    { label: "Activities", value: breakdown.activities, Icon: MdOutlineAttractions },
  ];

  return (
    <div className="space-y-8">
      {/* Total */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <p className="text-sm text-muted">Estimated total trip cost</p>
        <p className="text-4xl md:text-5xl font-semibold text-fg mt-1">
          {formatCurrency(estimate.total, currency)}
        </p>
        <p className="text-sm text-muted mt-2">
          ≈ {formatCurrency(estimate.perPersonPerDay, currency)} per person / day
        </p>
        {!estimate.converted && currency === "USD" && (
          <p className="text-xs text-muted mt-1">Estimates in USD.</p>
        )}
      </div>

      {/* Breakdown — scannable line items */}
      <div className="bg-surface border border-border rounded-xl divide-y divide-border">
        {rows.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-3.5">
            <Icon className="text-primary text-xl shrink-0" aria-hidden="true" />
            <span className="text-fg">{label}</span>
            <span className="ml-auto font-medium text-fg tabular-nums">
              {formatCurrency(value, currency)}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-surface-2">
          <span className="font-medium text-fg">Total</span>
          <span className="ml-auto font-semibold text-fg tabular-nums">
            {formatCurrency(estimate.total, currency)}
          </span>
        </div>
      </div>

      {/* Advice */}
      <div>
        <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-fg mb-3">
          <MdOutlineTipsAndUpdates className="text-primary" aria-hidden="true" />
          Budget advice
        </h3>
        <p className="text-fg/90 leading-relaxed">{estimate.budgetAdvice}</p>
        {estimate.savingSuggestions.length > 0 && (
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            {estimate.savingSuggestions.map((tip) => (
              <li key={tip} className="text-fg/90 leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Alternatives */}
      {estimate.alternativeDestinations.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-fg mb-3">
            <HiOutlineGlobeAlt className="text-primary" aria-hidden="true" />
            Alternative destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estimate.alternativeDestinations.map((alt) => (
              <div
                key={alt.name}
                className="bg-surface border border-border rounded-lg p-4"
              >
                <p className="font-medium text-fg">{alt.name}</p>
                {alt.reason && (
                  <p className="text-sm text-muted mt-1 leading-relaxed">
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
