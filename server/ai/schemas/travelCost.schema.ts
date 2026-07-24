import { z } from "zod";

/** Request body for POST /api/travel-cost. */
export const travelCostRequestSchema = z.object({
  origin: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
  durationDays: z.number().int().min(1).max(365),
  travelers: z.number().int().min(1).max(50),
  budgetLevel: z.enum(["budget", "moderate", "luxury"]),
  displayCurrency: z.string().length(3).optional(),
});

export type TravelCostRequest = z.infer<typeof travelCostRequestSchema>;
