export type BudgetLevel = "budget" | "moderate" | "luxury";

export interface CostBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  localTransport: number;
  activities: number;
}

export interface AlternativeDestination {
  name: string;
  reason: string;
}

/** Cost estimate returned by `POST /api/travel-cost`. */
export interface CostEstimate {
  currency: string;
  converted: boolean;
  breakdown: CostBreakdown;
  total: number;
  perPersonPerDay: number;
  budgetAdvice: string;
  savingSuggestions: string[];
  alternativeDestinations: AlternativeDestination[];
}

export interface CostEstimateInput {
  origin: string;
  destination: string;
  durationDays: number;
  travelers: number;
  budgetLevel: BudgetLevel;
  displayCurrency?: string;
}
