import type { RecommendationsRequest } from "../schemas/recommendationsRequest.schema";

/** Builds the prompt for personalized destination recommendations. */
export function buildRecommendationsPrompt(input: RecommendationsRequest): {
  system: string;
  prompt: string;
} {
  const system =
    "You are a travel recommendation expert. Suggest destinations tailored to the " +
    "traveler's preferences. Respond with a single valid JSON object only — no " +
    "markdown or code fences.";

  const lines = [
    `- Interests: ${input.interests.length ? input.interests.join(", ") : "general travel"}`,
    `- Budget level: ${input.budgetLevel}`,
    `- Climate preference: ${input.climate}`,
  ];
  if (input.durationDays) lines.push(`- Trip duration: ${input.durationDays} days`);
  if (input.month) lines.push(`- Traveling in: ${input.month}`);
  if (input.fromCountry) lines.push(`- Departing from: ${input.fromCountry}`);

  const prompt = `Recommend travel destinations for a traveler with:
${lines.join("\n")}

Return a JSON object with these keys:
- "summary": 1-2 sentence overview of why these destinations suit this traveler.
- "countries": an array of 4-6 objects, each with:
  - "name": the country name.
  - "region": the world region.
  - "reason": 1-2 sentences on why it fits this traveler's interests and budget.
  - "bestFor": array of 2-4 short tags (e.g. "beaches", "street food", "hiking").
  - "estimatedBudget": a rough budget note (e.g. "~$1200 for a week").
  - "bestSeason": the best time of year to visit.
- "tips": an array of 3-5 personalized travel tips.

Tailor everything to the climate preference and season. Do not include markdown.`;

  return { system, prompt };
}
