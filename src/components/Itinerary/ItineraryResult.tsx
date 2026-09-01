import { useState } from "react";
import { MdContentCopy, MdCheck, MdRefresh } from "react-icons/md";
import { HiOutlineWallet } from "react-icons/hi2";
import type { Itinerary } from "../../types/itinerary";
import { itineraryToText } from "../../utils/itinerary";
import { Button } from "../ui/button";
import SaveButton from "../Saved/SaveButton";
import DayCard from "./DayCard";

interface ItineraryResultProps {
  itinerary: Itinerary;
  /** Omit to hide the Regenerate button (e.g. on the Saved Trips page). */
  onRegenerate?: () => void;
  isRegenerating?: boolean;
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
    <div className="space-y-8">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-fg">
            {itinerary.destination}
          </h2>
          <p className="text-muted mt-1">{itinerary.days.length}-day itinerary</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copy}>
            {copied ? <MdCheck className="text-success" /> : <MdContentCopy />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <SaveButton
            label
            item={{
              id: `itinerary:${itinerary.destination}:${itinerary.days.length}`,
              type: "itinerary",
              title: `${itinerary.destination} — ${itinerary.days.length}-day itinerary`,
              subtitle: itinerary.summary,
              data: itinerary,
            }}
          />
          {onRegenerate && (
            <Button onClick={onRegenerate} disabled={isRegenerating}>
              <MdRefresh className={isRegenerating ? "animate-spin" : ""} />
              {isRegenerating ? "Regenerating…" : "Regenerate"}
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-lg text-fg/90 leading-relaxed border-l-2 border-primary/30 pl-4">
        {itinerary.summary}
      </p>

      {/* Days — editorial timeline */}
      <div className="border-l border-border ml-1.5">
        {itinerary.days.map((day) => (
          <DayCard key={day.day} day={day} />
        ))}
      </div>

      {/* Budget */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-fg mb-2">
          <HiOutlineWallet className="text-primary" aria-hidden="true" />
          Budget summary
        </h3>
        <p className="text-fg/90 leading-relaxed">{itinerary.budgetSummary}</p>
      </div>
    </div>
  );
}
