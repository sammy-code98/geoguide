import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineCalculator } from "react-icons/hi";
import { GiSpinningBlades } from "react-icons/gi";
import { useCostEstimate } from "../../hooks/useCostEstimate";
import type { BudgetLevel } from "../../types/cost";
import CostResult from "../../components/Cost/CostResult";

const BUDGET_LEVELS: { value: BudgetLevel; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "moderate", label: "Moderate" },
  { value: "luxury", label: "Luxury" },
];

// Common display currencies (estimates are computed in USD, converted server-side).
const CURRENCIES = [
  "USD", "EUR", "GBP", "NGN", "JPY", "CAD", "AUD", "CHF",
  "CNY", "INR", "ZAR", "AED", "BRL", "KES", "GHS",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white dark:bg-bgDark text-black dark:text-textWhite shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const labelClass = "block text-sm font-semibold text-black dark:text-textWhite mb-1";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-textWhite flex items-center gap-2">
            <HiOutlineCalculator className="text-primary" />
            Travel Cost Estimator
          </h1>
          <p className="text-textGray dark:text-grayish mt-2">
            Estimate your trip budget with AI-powered guidance and alternatives.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
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
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Estimating…" : "Estimate cost"}
            </button>
          </div>
        </form>

        {/* Results / states */}
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <GiSpinningBlades className="text-5xl text-primary animate-spin" />
            <p className="text-textGray dark:text-grayish">Crunching the numbers…</p>
          </div>
        )}

        {isError && !isPending && (
          <p className="text-center text-secondary" role="alert">
            {(error as Error)?.message || "Couldn't estimate the cost. Please try again."}
          </p>
        )}

        {data && !isPending && <CostResult estimate={data} />}
      </div>
    </div>
  );
}
