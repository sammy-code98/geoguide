import type { Itinerary } from "../types/itinerary";

/** Renders an itinerary as plain text for copying to the clipboard. */
export function itineraryToText(itinerary: Itinerary): string {
  const lines: string[] = [];
  lines.push(`${itinerary.destination} — ${itinerary.days.length}-day itinerary`);
  lines.push("");
  lines.push(itinerary.summary);
  lines.push("");

  itinerary.days.forEach((day) => {
    lines.push(`Day ${day.day}: ${day.title}`);
    lines.push(`  Morning: ${day.morning}`);
    lines.push(`  Afternoon: ${day.afternoon}`);
    lines.push(`  Evening: ${day.evening}`);
    if (day.food.length) lines.push(`  Food: ${day.food.join(", ")}`);
    lines.push(`  Getting around: ${day.transportation}`);
    lines.push("");
  });

  lines.push(`Budget: ${itinerary.budgetSummary}`);
  return lines.join("\n");
}
