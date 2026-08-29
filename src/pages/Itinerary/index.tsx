import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineMap } from "react-icons/hi";
import { GiSpinningBlades } from "react-icons/gi";
import { useItinerary } from "../../hooks/useItinerary";
import type { BudgetLevel } from "../../types/cost";
import type { ItineraryInput, TravelStyle } from "../../types/itinerary";
import { TRAVEL_INTERESTS } from "../../constants/interests";
import ItineraryResult from "../../components/Itinerary/ItineraryResult";
import { inputClass, labelClass } from "../../constants/formStyles";

const BUDGET_LEVELS: BudgetLevel[] = ["budget", "moderate", "luxury"];
const TRAVEL_STYLES: TravelStyle[] = ["relaxed", "balanced", "fast-paced"];

export default function ItineraryPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { mutate, data, isPending, isError, error } = useItinerary();

  const [destination, setDestination] = useState(searchParams.get("destination") ?? "");
  const [durationDays, setDurationDays] = useState(5);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("moderate");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("balanced");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const buildInput = (): ItineraryInput => ({
    destination: destination.trim(),
    durationDays,
    budgetLevel,
    interests,
    travelStyle,
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    mutate(buildInput());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-textWhite flex items-center gap-2">
            <HiOutlineMap className="text-primary" />
            AI Itinerary Generator
          </h1>
          <p className="text-textGray dark:text-grayish mt-2">
            Get a personalized day-by-day travel plan. Powered by Gemini.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="destination">Destination</label>
              <input
                id="destination"
                className={inputClass}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Thailand"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="duration">Duration (days)</label>
              <input
                id="duration"
                type="number"
                min={1}
                max={14}
                className={inputClass}
                value={durationDays}
                onChange={(e) =>
                  setDurationDays(Math.min(14, Math.max(1, Number(e.target.value) || 1)))
                }
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
                  <option key={b} value={b}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="style">Travel style</label>
              <select
                id="style"
                className={inputClass}
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
              >
                {TRAVEL_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className={labelClass}>Interests</span>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_INTERESTS.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`py-1.5 px-3 rounded-full text-sm font-semibold border transition-colors ${
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-white/80 dark:bg-gray-800/80 text-black dark:text-textWhite border-gray-200 dark:border-gray-600 hover:border-primary/50"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Generating…" : "Generate itinerary"}
          </button>
        </form>

        {/* States */}
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <GiSpinningBlades className="text-5xl text-primary animate-spin" />
            <p className="text-textGray dark:text-grayish">Planning your trip…</p>
          </div>
        )}

        {isError && !isPending && (
          <p className="text-center text-secondary" role="alert">
            {(error as Error)?.message || "Couldn't generate an itinerary. Please try again."}
          </p>
        )}

        {data && !isPending && (
          <ItineraryResult
            itinerary={data}
            onRegenerate={() => mutate(buildInput())}
            isRegenerating={isPending}
          />
        )}
      </div>
    </div>
  );
}
