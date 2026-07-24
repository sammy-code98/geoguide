interface CountryPromptInput {
  name: string;
  region: string;
  capital: string | null;
}

/**
 * Builds the system instruction + user prompt for country travel insights.
 * Prompts live here (never inside route handlers or the frontend) so they can
 * be tuned and reused independently of the AI transport.
 */
export function buildCountryInsightsPrompt(country: CountryPromptInput): {
  system: string;
  prompt: string;
} {
  const system =
    "You are an expert, up-to-date travel writer. Provide concise, factual, and " +
    "practical insights for travelers. Always respond with a single valid JSON " +
    "object and nothing else — no markdown, no code fences, no commentary.";

  const location = country.capital
    ? `${country.name} (capital: ${country.capital}) in ${country.region}`
    : `${country.name} in ${country.region}`;

  const prompt = `Provide travel insights for ${location}.

Return a JSON object with EXACTLY these keys:
- "overview": 2-3 sentences introducing the country as a travel destination.
- "culture": 2-3 sentences on culture, traditions, and etiquette.
- "languages": 1-2 sentences on languages spoken and useful phrases.
- "cuisine": 2-3 sentences on food and signature dishes to try.
- "transportation": 2-3 sentences on getting around (public transport, taxis, etc.).
- "safety": 2-3 sentences of honest, practical safety guidance for travelers.
- "bestSeason": 1-2 sentences on the best time of year to visit and why.
- "travelAdvice": 2-3 sentences of practical tips (money, connectivity, customs).
- "hiddenGems": an array of 3 to 5 short strings, each a lesser-known place or experience.

Keep every text value traveler-focused and free of markdown.`;

  return { system, prompt };
}
