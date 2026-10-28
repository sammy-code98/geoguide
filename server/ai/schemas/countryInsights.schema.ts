import { z } from "zod";


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
