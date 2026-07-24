import { z } from "zod";

/** Cost per category for the WHOLE trip (all travelers, full duration), in USD. */
export const costBreakdownSchema = z.object({
  flights: z.number().nonnegative(),
  accommodation: z.number().nonnegative(),
  food: z.number().nonnegative(),
  localTransport: z.number().nonnegative(),
  activities: z.number().nonnegative(),
});

/** Schema for Gemini's cost-estimate JSON output (validated before use). */
export const costEstimateSchema = z.object({
  breakdown: costBreakdownSchema,
  total: z.number().nonnegative(),
  perPersonPerDay: z.number().nonnegative(),
  budgetAdvice: z.string(),
  savingSuggestions: z.array(z.string()),
  // Gemini sometimes returns plain strings here — accept both and normalize.
  alternativeDestinations: z.array(
    z.union([
      z.object({ name: z.string(), reason: z.string().default("") }),
      z.string().transform((name) => ({ name, reason: "" })),
    ])
  ),
});

export type CostBreakdown = z.infer<typeof costBreakdownSchema>;
export type CostEstimateResult = z.infer<typeof costEstimateSchema>;
