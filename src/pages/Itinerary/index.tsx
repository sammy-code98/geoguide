import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineMap } from "react-icons/hi";
import { useItinerary } from "../../hooks/useItinerary";
import type { BudgetLevel } from "../../types/cost";
import type { ItineraryInput, TravelStyle } from "../../types/itinerary";
import { TRAVEL_INTERESTS } from "../../constants/interests";
import ItineraryResult from "../../components/Itinerary/ItineraryResult";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/cn";
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
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-fg flex items-center gap-2">
            <HiOutlineMap className="text-primary" aria-hidden="true" />
            Itinerary planner
          </h1>
          <p className="text-muted mt-2">
            A personalized day-by-day travel plan, tailored to your interests.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-4"
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
                    aria-pressed={active}
                    className={cn(
                      "py-1.5 px-3.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-surface text-fg border-border hover:border-primary/40"
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isPending} className="w-full">
            {isPending ? "Generating…" : "Generate itinerary"}
          </Button>
        </form>

        {/* States */}
        {isPending && (
          <p className="text-center text-muted py-12" role="status">
            Planning your trip…
          </p>
        )}

        {isError && !isPending && (
          <p className="text-center text-danger" role="alert">
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
