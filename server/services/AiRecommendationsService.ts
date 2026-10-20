import { geminiService } from "./GeminiService.js";
import { ApiError } from "../lib/ApiError.js";
import { buildRecommendationsPrompt } from "../ai/prompts/recommendations.prompt.js";
import {
  recommendationsSchema,
  type Recommendations,
} from "../ai/schemas/recommendations.schema.js";
import type { RecommendationsRequest } from "../ai/schemas/recommendationsRequest.schema.js";

/**
 * Generates personalized destination recommendations via Gemini. Not cached, so
 * re-submitting yields fresh suggestions.
 */
export class AiRecommendationsService {
  async generate(input: RecommendationsRequest): Promise<Recommendations> {
    const { system, prompt } = buildRecommendationsPrompt(input);

    const raw = await geminiService.generateJson<unknown>(prompt, {
      tier: "flash",
      system,
      temperature: 0.7,
    });

    const parsed = recommendationsSchema.safeParse(raw);
    if (!parsed.success) {
      throw ApiError.upstream(
        "The recommendations came back in an unexpected format. Please try again.",
        502,
        parsed.error.issues
      );
    }
    return parsed.data;
  }
}

export const aiRecommendationsService = new AiRecommendationsService();
