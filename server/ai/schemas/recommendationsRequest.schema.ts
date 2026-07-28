import { z } from "zod";

/** Request body for POST /api/ai/recommendations. */
export const recommendationsRequestSchema = z.object({
  interests: z.array(z.string().max(40)).max(12).default([]),
  budgetLevel: z.enum(["budget", "moderate", "luxury"]),
  climate: z.enum(["warm", "temperate", "cold", "any"]).default("any"),
  durationDays: z.number().int().min(1).max(90).optional(),
  month: z.string().max(20).optional(),
  fromCountry: z.string().max(120).optional(),
});

export type RecommendationsRequest = z.infer<typeof recommendationsRequestSchema>;
