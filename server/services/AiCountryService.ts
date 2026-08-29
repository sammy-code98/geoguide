import { geminiService } from "./GeminiService";
import { restCountriesService } from "./RestCountriesService";
import { TtlCache } from "../lib/cache";
import { ApiError } from "../lib/ApiError";
import { buildCountryInsightsPrompt } from "../ai/prompts/countryInsights.prompt";
import {
  countryInsightsSchema,
  type CountryInsights,
} from "../ai/schemas/countryInsights.schema";

/**
 * Generates AI travel insights for a country. Orchestrates the country lookup,
 * prompt building, Gemini call, and response validation — and caches results
 * (AI calls are expensive) keyed by country code.
 */
export class AiCountryService {
  private readonly cache = new TtlCache(60 * 60 * 24); // 24 hours

  async getInsights(code: string): Promise<CountryInsights> {
    const key = `insights:${code.toUpperCase()}`;
    return this.cache.remember(key, 60 * 60 * 24, async () => {
      const country = await restCountriesService.getByCode(code);
      const { system, prompt } = buildCountryInsightsPrompt(country);

      const raw = await geminiService.generateJson<unknown>(prompt, {
        tier: "flash",
        system,
        temperature: 0.6,
      });

      const parsed = countryInsightsSchema.safeParse(raw);
      if (!parsed.success) {
        throw ApiError.upstream(
          "The AI returned insights in an unexpected format. Please try again.",
          502,
          parsed.error.issues
        );
      }
      return parsed.data;
    });
  }
}

export const aiCountryService = new AiCountryService();
