import { geminiService } from "./GeminiService";
import { exchangeRateService } from "./ExchangeRateService";
import { TtlCache } from "../lib/cache";
import { ApiError } from "../lib/ApiError";
import { integrations } from "../config/env";
import { buildCostEstimatePrompt } from "../ai/prompts/costEstimate.prompt";
import {
  costEstimateSchema,
  type CostEstimateResult,
} from "../ai/schemas/costEstimate.schema";
import type { TravelCostRequest } from "../ai/schemas/travelCost.schema";

/** Cost estimate returned to the frontend, in `currency` (USD unless converted). */
export interface CostEstimate extends CostEstimateResult {
  currency: string;
  converted: boolean;
}

/**
 * Produces a travel cost estimate via Gemini (USD), optionally converting to a
 * display currency with the ExchangeRate service. Cached by exact input.
 */
export class CostEstimateService {
  private readonly cache = new TtlCache(60 * 60 * 12); // 12 hours

  async estimate(input: TravelCostRequest): Promise<CostEstimate> {
    const cacheKey = `cost:${JSON.stringify(input)}`;
    return this.cache.remember(cacheKey, 60 * 60 * 12, async () => {
      const { system, prompt } = buildCostEstimatePrompt(input);
      const raw = await geminiService.generateJson<unknown>(prompt, {
        tier: "flash",
        system,
        temperature: 0.4,
      });

      const parsed = costEstimateSchema.safeParse(raw);
      if (!parsed.success) {
        throw ApiError.upstream(
          "The estimate came back in an unexpected format. Please try again.",
          502,
          parsed.error.issues
        );
      }

      const base: CostEstimate = { currency: "USD", converted: false, ...parsed.data };
      return this.maybeConvert(base, input.displayCurrency);
    });
  }

  private async maybeConvert(
    estimate: CostEstimate,
    displayCurrency: string | undefined
  ): Promise<CostEstimate> {
    const target = displayCurrency?.toUpperCase();
    if (!target || target === "USD" || !integrations.exchangeRate) return estimate;

    try {
      const rates = await exchangeRateService.getRates("USD");
      const rate = rates[target];
      if (!rate) return estimate;

      const round = (n: number) => Math.round(n * rate * 100) / 100;
      return {
        ...estimate,
        currency: target,
        converted: true,
        total: round(estimate.total),
        perPersonPerDay: round(estimate.perPersonPerDay),
        breakdown: {
          flights: round(estimate.breakdown.flights),
          accommodation: round(estimate.breakdown.accommodation),
          food: round(estimate.breakdown.food),
          localTransport: round(estimate.breakdown.localTransport),
          activities: round(estimate.breakdown.activities),
        },
      };
    } catch {
      // Conversion is best-effort — fall back to USD on any failure.
      return estimate;
    }
  }
}

export const costEstimateService = new CostEstimateService();
