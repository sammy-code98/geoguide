import { z } from "zod";

export const itineraryDaySchema = z.object({
  day: z.number().int(),
  title: z.string(),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  food: z.array(z.string()),
  transportation: z.string(),
});

/** Schema for Gemini's day-by-day itinerary output (validated before use). */
export const itinerarySchema = z.object({
  destination: z.string(),
  summary: z.string(),
  days: z.array(itineraryDaySchema),
  budgetSummary: z.string(),
});

export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
