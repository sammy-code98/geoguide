import { z } from "zod";

/** Request body for POST /api/ai/itinerary. */
export const itineraryRequestSchema = z.object({
  destination: z.string().min(1).max(120),
  durationDays: z.number().int().min(1).max(14),
  budgetLevel: z.enum(["budget", "moderate", "luxury"]),
  interests: z.array(z.string().max(40)).max(12).default([]),
  travelStyle: z.enum(["relaxed", "balanced", "fast-paced"]).default("balanced"),
});

export type ItineraryRequest = z.infer<typeof itineraryRequestSchema>;
