interface CostPromptInput {
  origin: string;
  destination: string;
  durationDays: number;
  travelers: number;
  budgetLevel: "budget" | "moderate" | "luxury";
}

/**
 * Builds the prompt for a travel cost estimate. Gemini returns all monetary
 * values in USD as the total for the whole trip (all travelers, full duration).
 */
export function buildCostEstimatePrompt(input: CostPromptInput): {
  system: string;
  prompt: string;
} {
  const system =
    "You are a travel budgeting expert. Produce realistic, current cost estimates. " +
    "Respond with a single valid JSON object and nothing else — no markdown or code fences.";

  const prompt = `Estimate the cost of a trip with these details:
- Origin: ${input.origin}
- Destination: ${input.destination}
- Duration: ${input.durationDays} day(s)
- Travelers: ${input.travelers}
- Budget level: ${input.budgetLevel}

Return a JSON object with these keys:
- "breakdown": object with numeric USD totals for the ENTIRE trip (all travelers, full duration):
  "flights", "accommodation", "food", "localTransport", "activities".
- "total": numeric USD grand total (should roughly equal the sum of the breakdown).
- "perPersonPerDay": numeric USD cost per traveler per day.
- "budgetAdvice": 2-3 sentences of practical budget guidance for this trip.
- "savingSuggestions": array of 3-5 short money-saving tips specific to this route/destination.
- "alternativeDestinations": array of 2-3 objects { "name", "reason" } suggesting cheaper or better-value destinations with a similar vibe.

All monetary values must be plain numbers in USD (no currency symbols or text).`;

  return { system, prompt };
}
