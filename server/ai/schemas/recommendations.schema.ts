import { z } from "zod";

export const recommendedCountrySchema = z.object({
  name: z.string(),
  region: z.string().default(""),
  reason: z.string(),
  bestFor: z.array(z.string()).default([]),
  estimatedBudget: z.string().default(""),
  bestSeason: z.string().default(""),
});

/** Schema for Gemini's personalized recommendations output. */
export const recommendationsSchema = z.object({
  summary: z.string(),
  countries: z.array(recommendedCountrySchema),
  tips: z.array(z.string()),
});

export type RecommendedCountry = z.infer<typeof recommendedCountrySchema>;
export type Recommendations = z.infer<typeof recommendationsSchema>;
