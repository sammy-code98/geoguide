import type { ItineraryRequest } from "../schemas/itineraryRequest.schema";

/**
 * Builds the prompt for a day-by-day travel itinerary. Kept out of the route
 * handler so it can be tuned independently of the AI transport.
 */
export function buildItineraryPrompt(input: ItineraryRequest): {
  system: string;
  prompt: string;
} {
  const system =
    "You are an expert travel itinerary planner. Create realistic, well-paced, " +
    "day-by-day plans tailored to the traveler's interests, budget, and style. " +
    "Respond with a single valid JSON object only — no markdown or code fences.";

  const interests =
    input.interests.length > 0
      ? `Traveler interests: ${input.interests.join(", ")}.`
      : "";

  const prompt = `Create a ${input.durationDays}-day travel itinerary for ${input.destination}.
Budget level: ${input.budgetLevel}. Travel style: ${input.travelStyle}. ${interests}

Return a JSON object with these keys:
- "destination": string (the destination).
- "summary": 2-3 sentence overview of the trip.
- "days": an array of exactly ${input.durationDays} objects, each with:
  - "day": the day number (1 to ${input.durationDays}).
  - "title": a short theme for the day.
  - "morning": what to do in the morning (1-2 sentences).
  - "afternoon": the afternoon plan (1-2 sentences).
  - "evening": the evening plan (1-2 sentences).
  - "food": array of 2-3 recommended restaurants or dishes for that day.
  - "transportation": how to get around that day (1 sentence).
- "budgetSummary": 2-3 sentences on expected costs and value tips.

Tailor activities to the interests, budget, and pace. Do not include markdown.`;

  return { system, prompt };
}
