import type { BudgetLevel } from "./cost";

export type Climate = "warm" | "temperate" | "cold" | "any";

export interface RecommendedCountry {
  name: string;
  region: string;
  reason: string;
  bestFor: string[];
  estimatedBudget: string;
  bestSeason: string;
}

/** Recommendations returned by `POST /api/ai/recommendations`. */
export interface Recommendations {
  summary: string;
  countries: RecommendedCountry[];
  tips: string[];
}

export interface RecommendationsInput {
  interests: string[];
  budgetLevel: BudgetLevel;
  climate: Climate;
  durationDays?: number;
  month?: string;
  fromCountry?: string;
}
