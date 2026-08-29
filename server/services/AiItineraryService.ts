import { geminiService } from "./GeminiService";
import { ApiError } from "../lib/ApiError";
import { buildItineraryPrompt } from "../ai/prompts/itinerary.prompt";
import { itinerarySchema, type Itinerary } from "../ai/schemas/itinerary.schema";
import type { ItineraryRequest } from "../ai/schemas/itineraryRequest.schema";

/**
 * Generates a day-by-day travel itinerary via Gemini. Not cached — each request
 * (including "regenerate") should produce a fresh plan.
 */
export class AiItineraryService {
  async generate(input: ItineraryRequest): Promise<Itinerary> {
    const { system, prompt } = buildItineraryPrompt(input);

    const raw = await geminiService.generateJson<unknown>(prompt, {
      tier: "flash",
      system,
      temperature: 0.8,
    });

    const parsed = itinerarySchema.safeParse(raw);
    if (!parsed.success) {
      throw ApiError.upstream(
        "The itinerary came back in an unexpected format. Please try again.",
        502,
        parsed.error.issues
      );
    }
    return parsed.data;
  }
}

export const aiItineraryService = new AiItineraryService();
