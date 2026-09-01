import { FormEvent, useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { useRecommendations } from "../../hooks/useRecommendations";
import type { BudgetLevel } from "../../types/cost";
import type { Climate, RecommendationsInput } from "../../types/recommendations";
import { TRAVEL_INTERESTS } from "../../constants/interests";
import RecommendationCard from "../../components/Recommendations/RecommendationCard";
import { Button } from "../../components/ui/button";
import { BackToTop } from "../../components/ui/back-to-top";
import { cn } from "../../lib/cn";
import { inputClass, labelClass } from "../../constants/formStyles";

const BUDGET_LEVELS: BudgetLevel[] = ["budget", "moderate", "luxury"];
const CLIMATES: Climate[] = ["any", "warm", "temperate", "cold"];
const MONTHS = [
  "Any", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function RecommendationsPage(): JSX.Element {
  const { mutate, data, isPending, isError, error } = useRecommendations();

  const [interests, setInterests] = useState<string[]>([]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("moderate");
  const [climate, setClimate] = useState<Climate>("any");
  const [durationDays, setDurationDays] = useState(7);
  const [month, setMonth] = useState("Any");
  const [fromCountry, setFromCountry] = useState("");

  const toggleInterest = (interest: string) =>
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const input: RecommendationsInput = {
      interests,
      budgetLevel,
      climate,
      durationDays,
      ...(month !== "Any" ? { month } : {}),
      ...(fromCountry.trim() ? { fromCountry: fromCountry.trim() } : {}),
    };
    mutate(input);
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-fg flex items-center gap-2">
            <HiOutlineLightBulb className="text-primary" aria-hidden="true" />
            Where to next?
          </h1>
          <p className="text-muted mt-2">
            Not sure where to go? Get destination ideas tailored to you.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="budget">Budget level</label>
              <select id="budget" className={inputClass} value={budgetLevel} onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}>
                {BUDGET_LEVELS.map((b) => (
                  <option key={b} value={b}>{cap(b)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="climate">Climate preference</label>
              <select id="climate" className={inputClass} value={climate} onChange={(e) => setClimate(e.target.value as Climate)}>
                {CLIMATES.map((c) => (
                  <option key={c} value={c}>{cap(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="duration">Duration (days)</label>
              <input id="duration" type="number" min={1} max={90} className={inputClass} value={durationDays} onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div>
              <label className={labelClass} htmlFor="month">Travel month</label>
              <select id="month" className={inputClass} value={month} onChange={(e) => setMonth(e.target.value)}>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="from">Departing from (optional)</label>
              <input id="from" className={inputClass} value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} placeholder="e.g. United Kingdom" />
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
            {isPending ? "Finding destinations…" : "Get recommendations"}
          </Button>
        </form>

        {/* States */}
        {isPending && (
          <p className="text-center text-muted py-12" role="status">
            Matching you with destinations…
          </p>
        )}

        {isError && !isPending && (
          <p className="text-center text-danger" role="alert">
            {(error as Error)?.message || "Couldn't get recommendations. Please try again."}
          </p>
        )}

        {data && !isPending && (
          <div className="space-y-8">
            <p className="text-lg text-fg/90 leading-relaxed border-l-2 border-primary/30 pl-4">
              {data.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.countries.map((c) => (
                <RecommendationCard key={c.name} country={c} />
              ))}
            </div>

            {data.tips.length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-fg mb-2">
                  <MdOutlineTipsAndUpdates className="text-primary" aria-hidden="true" />
                  Travel tips
                </h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  {data.tips.map((tip) => (
                    <li key={tip} className="text-fg/90 leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <BackToTop />
    </div>
  );
}
