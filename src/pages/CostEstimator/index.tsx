import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineCalculator } from "react-icons/hi";
import { useCostEstimate } from "../../hooks/useCostEstimate";
import type { BudgetLevel } from "../../types/cost";
import { CURRENCY_CODES } from "../../constants/currencies";
import CostResult from "../../components/Cost/CostResult";
import SaveButton from "../../components/Saved/SaveButton";
import { Button } from "../../components/ui/button";
import { inputClass, labelClass } from "../../constants/formStyles";

const BUDGET_LEVELS: { value: BudgetLevel; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "moderate", label: "Moderate" },
  { value: "luxury", label: "Luxury" },
];

export default function CostEstimatorPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { mutate, data, isPending, isError, error } = useCostEstimate();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState(searchParams.get("destination") ?? "");
  const [durationDays, setDurationDays] = useState(7);
  const [travelers, setTravelers] = useState(1);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("moderate");
  const [displayCurrency, setDisplayCurrency] = useState("USD");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    mutate({
      origin: origin.trim(),
      destination: destination.trim(),
      durationDays,
      travelers,
      budgetLevel,
      displayCurrency,
    });
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-fg flex items-center gap-2">
            <HiOutlineCalculator className="text-primary" aria-hidden="true" />
            Travel cost estimator
          </h1>
          <p className="text-muted mt-2">
            Estimate your trip budget with guidance and alternatives.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-surface border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className={labelClass} htmlFor="origin">From</label>
            <input
              id="origin"
              className={inputClass}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Lagos, Nigeria"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="destination">To</label>
            <input
              id="destination"
              className={inputClass}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Japan"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="duration">Duration (days)</label>
            <input
              id="duration"
              type="number"
              min={1}
              max={365}
              className={inputClass}
              value={durationDays}
              onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="travelers">Travelers</label>
            <input
              id="travelers"
              type="number"
              min={1}
              max={50}
              className={inputClass}
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="budget">Budget level</label>
            <select
              id="budget"
              className={inputClass}
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}
            >
              {BUDGET_LEVELS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="currency">Show costs in</label>
            <select
              id="currency"
              className={inputClass}
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
            >
              {CURRENCY_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Estimating…" : "Estimate cost"}
            </Button>
          </div>
        </form>

        {/* Results / states */}
        {isPending && (
          <p className="text-center text-muted py-12" role="status">
            Crunching the numbers…
          </p>
        )}

        {isError && !isPending && (
          <p className="text-center text-danger" role="alert">
            {(error as Error)?.message || "Couldn't estimate the cost. Please try again."}
          </p>
        )}

        {data && !isPending && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <SaveButton
                label
                item={{
                  id: `cost:${destination.trim()}:${durationDays}:${travelers}:${budgetLevel}`,
                  type: "costEstimate",
                  title: `${origin.trim() || "Trip"} → ${destination.trim()}`,
                  subtitle: `${durationDays} days · ${travelers} traveler(s) · ${budgetLevel}`,
                  data,
                }}
              />
            </div>
            <CostResult estimate={data} />
          </div>
        )}
      </div>
    </div>
  );
}
