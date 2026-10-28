import type { BudgetLevel } from "./cost";

export type TravelStyle = "relaxed" | "balanced" | "fast-paced";

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  food: string[];
  transportation: string;
}

export interface Itinerary {
  destination: string;
  summary: string;
  days: ItineraryDay[];
  budgetSummary: string;
}

export interface ItineraryInput {
  destination: string;
  durationDays: number;
  budgetLevel: BudgetLevel;
  interests: string[];
  travelStyle: TravelStyle;
}
