import { z } from "zod";

/**
 * Schema for AI-generated country travel insights. Used to validate Gemini's
 * JSON output before it reaches the frontend — the UI can trust this shape.
 */
export const countryInsightsSchema = z.object({
  overview: z.string(),
  culture: z.string(),
  languages: z.string(),
  cuisine: z.string(),
  transportation: z.string(),
  safety: z.string(),
  bestSeason: z.string(),
  travelAdvice: z.string(),
  hiddenGems: z.array(z.string()),
});

export type CountryInsights = z.infer<typeof countryInsightsSchema>;
