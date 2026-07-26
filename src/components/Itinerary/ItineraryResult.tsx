import { useState } from "react";
import { MdContentCopy, MdCheck, MdRefresh } from "react-icons/md";
import { HiOutlineWallet } from "react-icons/hi2";
import type { Itinerary } from "../../types/itinerary";
import { itineraryToText } from "../../utils/itinerary";
import DayCard from "./DayCard";

interface ItineraryResultProps {
  itinerary: Itinerary;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export default function ItineraryResult({
  itinerary,
  onRegenerate,
  isRegenerating,
}: ItineraryResultProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(itineraryToText(itinerary));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-textWhite">
            {itinerary.destination}
          </h2>
          <p className="text-textGray dark:text-grayish">
            {itinerary.days.length}-day itinerary
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-black dark:text-textWhite font-semibold hover:border-primary/50"
          >
            {copied ? <MdCheck className="text-green-500" /> : <MdContentCopy />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            <MdRefresh className={isRegenerating ? "animate-spin" : ""} />
            {isRegenerating ? "Regenerating…" : "Regenerate"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
        <p className="text-textGray dark:text-textWhite leading-relaxed">
          {itinerary.summary}
        </p>
      </div>

      {/* Days */}
      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <DayCard key={day.day} day={day} />
        ))}
      </div>

      {/* Budget */}
      <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-black dark:text-textWhite mb-2">
          <HiOutlineWallet className="text-primary" />
          Budget Summary
        </h3>
        <p className="text-textGray dark:text-textWhite leading-relaxed">
          {itinerary.budgetSummary}
        </p>
      </div>
    </div>
  );
}
