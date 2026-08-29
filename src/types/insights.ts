/**
 * AI-generated country travel insights returned by `/api/ai/country/:code`.
 * Mirrors `server/ai/schemas/countryInsights.schema.ts`.
 */
export interface CountryInsights {
  overview: string;
  culture: string;
  languages: string;
  cuisine: string;
  transportation: string;
  safety: string;
  bestSeason: string;
  travelAdvice: string;
  hiddenGems: string[];
}
